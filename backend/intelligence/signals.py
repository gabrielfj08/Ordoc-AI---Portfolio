"""
Intelligence Signals - Integração automática com eventos da plataforma.

Este módulo conecta o sistema de Intelligence aos eventos dos outros módulos
de forma DESACOPLADA e NÃO-INVASIVA, usando Django signals.

Princípios:
- Assíncrono: usa Celery para não bloquear requests
- Resiliente: falhas não afetam o fluxo principal
- Simples: sem lógica complexa, delega para tasks
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

logger = logging.getLogger('intelligence.signals')


# Evitar import circular - importar models apenas quando necessário
def get_document_model():
    """Lazy import para evitar circular dependency."""
    from ordoc_air.models import Document
    return Document


def get_task_model():
    """Lazy import para evitar circular dependency."""
    from ordoc_flow.models import Task
    return Task


def get_signature_request_model():
    """Lazy import para evitar circular dependency."""
    from ordoc_sign.models import SignatureRequest
    return SignatureRequest


@receiver(post_save, sender='ordoc_air.Document')
def on_document_created(sender, instance, created, **kwargs):
    """
    Quando um documento é criado, agenda análise automática.

    Executa de forma ASSÍNCRONA via Celery para não bloquear o upload.
    """
    if not created:
        return

    # Importar task apenas quando necessário (evita circular import)
    from .tasks import analyze_document_async

    try:
        # Agendar análise assíncrona (não bloqueia)
        analyze_document_async.apply_async(
            args=[str(instance.id)],
            kwargs={
                'document_type': instance.document_type or 'unknown',
                'organization_id': str(instance.organization_id) if instance.organization_id else None
            },
            countdown=2  # Aguarda 2s para DB commit completar
        )
        logger.info(f"Análise agendada para documento {instance.id}")
    except Exception as e:
        # Não propaga erro - falha na análise não afeta upload
        logger.warning(f"Erro ao agendar análise do documento {instance.id}: {e}")


@receiver(post_save, sender='ordoc_flow.Task')
def on_task_status_changed(sender, instance, created, **kwargs):
    """
    Quando uma tarefa muda de status, aprende com a ação.

    Captura aprovações/rejeições para alimentar o aprendizado.
    """
    if created:
        return  # Ignora criação, só processa mudanças

    # Só aprende com ações finais (aprovação ou rejeição)
    if instance.status not in ['completed', 'rejected']:
        return

    from .tasks import learn_from_task_action

    try:
        learn_from_task_action.apply_async(
            args=[str(instance.id)],
            kwargs={
                'action_type': 'approval' if instance.status == 'completed' else 'rejection',
                'user_id': str(instance.assigned_to_id) if instance.assigned_to_id else None,
                'organization_id': str(instance.procedure.organization_id) if hasattr(instance, 'procedure') else None
            },
            countdown=1
        )
        logger.debug(f"Aprendizado agendado para task {instance.id}")
    except Exception as e:
        logger.warning(f"Erro ao agendar aprendizado da task {instance.id}: {e}")


@receiver(post_save, sender='ordoc_sign.SignatureRequest')
def on_signature_completed(sender, instance, created, **kwargs):
    """
    Quando uma assinatura é completada, gera insights.

    Aprende padrões de assinatura (tempo médio, campos comuns, etc).
    """
    if created or instance.status != 'completed':
        return

    from .tasks import analyze_signature_pattern

    try:
        analyze_signature_pattern.apply_async(
            args=[str(instance.id)],
            countdown=1
        )
        logger.debug(f"Análise de assinatura agendada: {instance.id}")
    except Exception as e:
        logger.warning(f"Erro ao agendar análise de assinatura {instance.id}: {e}")


# Signal para rastrear edições de documentos (feedback implícito)
@receiver(post_save, sender='ordoc_air.Document')
def on_document_edited(sender, instance, created, **kwargs):
    """
    Quando um documento é editado (não criado), rastreia mudanças.

    Edições são feedback implícito de que algo precisou ser corrigido.
    """
    if created:
        return  # Ignora criação

    from .tasks import track_document_edit

    try:
        # Rastrear edição como feedback
        track_document_edit.apply_async(
            args=[str(instance.id)],
            kwargs={
                'modified_by': str(instance.updated_by_id) if hasattr(instance, 'updated_by_id') else None
            },
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao rastrear edição do documento {instance.id}: {e}")


# Função helper para desabilitar signals em contextos específicos (ex: testes, migrations)
class DisableSignals:
    """Context manager para desabilitar signals temporariamente."""

    def __init__(self, *signals):
        self.signals = signals
        self.original = []

    def __enter__(self):
        for signal in self.signals:
            self.original.append(signal.receivers[:])
            signal.receivers = []

    def __exit__(self, *args):
        for signal, receivers in zip(self.signals, self.original):
            signal.receivers = receivers
