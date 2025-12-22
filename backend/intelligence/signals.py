"""
Intelligence Signals - Integração AMPLA e automática com eventos da plataforma.

Este módulo conecta o sistema de Intelligence a TODOS os eventos relevantes
dos outros módulos de forma DESACOPLADA e NÃO-INVASIVA, usando Django signals.

COBERTURA COMPLETA:
- Documentos (upload, edição, download, compartilhamento, exclusão)
- Workflows (criação, aprovação, rejeição, conclusão)
- Assinaturas (solicitação, assinatura, rejeição)
- Usuários (login, logout, mudança de senha, acesso)
- Organizações (criação, mudança de configuração)
- Integrações (uso de APIs externas)

Princípios:
- Assíncrono: usa Celery para não bloquear requests
- Resiliente: falhas não afetam o fluxo principal
- Abrangente: captura TUDO que pode gerar insights
- Simples: sem lógica complexa, delega para tasks
"""
from django.db.models.signals import post_save, pre_delete, m2m_changed
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver, Signal
import logging

logger = logging.getLogger('intelligence.signals')

# Custom signals
document_accessed = Signal()
document_downloaded = Signal()
document_shared = Signal()


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


# ========================================
# WORKFLOWS E PROCEDIMENTOS
# ========================================

@receiver(post_save, sender='ordoc_flow.Procedure')
def on_procedure_created_or_updated(sender, instance, created, **kwargs):
    """
    Quando um procedimento é criado ou atualizado.

    Aprende:
    - Tipos de procedimentos mais usados
    - Tempo médio de conclusão
    - Taxa de aprovação/rejeição
    """
    from .tasks import analyze_procedure_pattern

    try:
        analyze_procedure_pattern.apply_async(
            args=[str(instance.id)],
            kwargs={'is_new': created},
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao agendar análise de procedimento {instance.id}: {e}")


# ========================================
# USUÁRIOS E AUTENTICAÇÃO
# ========================================

@receiver(user_logged_in)
def on_user_login(sender, request, user, **kwargs):
    """
    Quando um usuário faz login.

    Monitora:
    - Horários de acesso
    - Frequência de uso
    - Padrões de login
    """
    from .tasks import track_user_activity

    try:
        track_user_activity.apply_async(
            args=[str(user.id), 'login'],
            kwargs={
                'ip_address': request.META.get('REMOTE_ADDR'),
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200]
            },
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao rastrear login do usuário {user.id}: {e}")


@receiver(user_login_failed)
def on_login_failed(sender, credentials, request, **kwargs):
    """
    Quando uma tentativa de login falha.

    Monitora:
    - Tentativas de acesso não autorizado
    - Possíveis ataques
    """
    from .tasks import track_security_event

    try:
        track_security_event.apply_async(
            args=['login_failed'],
            kwargs={
                'username': credentials.get('username', 'unknown'),
                'ip_address': request.META.get('REMOTE_ADDR') if request else None
            },
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao rastrear falha de login: {e}")


# ========================================
# ORGANIZAÇÕES
# ========================================

@receiver(post_save, sender='ordoc_air.Organization')
def on_organization_changed(sender, instance, created, **kwargs):
    """
    Quando uma organização é criada ou atualizada.

    Aprende:
    - Configurações comuns
    - Padrões de uso
    """
    from .tasks import analyze_organization_usage

    try:
        if not created:  # Só analisa mudanças, não criação
            analyze_organization_usage.apply_async(
                args=[str(instance.id)],
                countdown=1
            )
    except Exception as e:
        logger.warning(f"Erro ao analisar organização {instance.id}: {e}")


# ========================================
# EXCLUSÕES (Detecção de problemas)
# ========================================

@receiver(pre_delete, sender='ordoc_air.Document')
def on_document_deleted(sender, instance, **kwargs):
    """
    Quando um documento é deletado.

    Monitora:
    - Exclusões frequentes (possível problema de UX)
    - Documentos deletados logo após upload (erro?)
    """
    from .tasks import track_deletion
    from django.utils import timezone

    try:
        # Se deletado logo após criação (< 5 min), pode ser erro
        time_since_creation = (timezone.now() - instance.created_at).total_seconds()
        is_quick_delete = time_since_creation < 300  # 5 minutos

        track_deletion.apply_async(
            args=['document', str(instance.id)],
            kwargs={
                'quick_delete': is_quick_delete,
                'organization_id': str(instance.organization_id) if instance.organization_id else None
            },
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao rastrear exclusão do documento {instance.id}: {e}")


# ========================================
# COMPARTILHAMENTOS E ACESSOS
# ========================================

@receiver(document_accessed)
def on_document_accessed(sender, document, user, **kwargs):
    """
    Custom signal: quando um documento é acessado/visualizado.

    COMO USAR: Disparar este signal nas views de visualização:

    from intelligence.signals import document_accessed
    document_accessed.send(sender=Document, document=doc, user=request.user)
    """
    from .tasks import track_document_access

    try:
        track_document_access.apply_async(
            args=[str(document.id), str(user.id)],
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao rastrear acesso ao documento {document.id}: {e}")


@receiver(document_downloaded)
def on_document_downloaded(sender, document, user, **kwargs):
    """
    Custom signal: quando um documento é baixado.

    COMO USAR: Disparar nas views de download:

    from intelligence.signals import document_downloaded
    document_downloaded.send(sender=Document, document=doc, user=request.user)
    """
    from .tasks import track_document_download

    try:
        track_document_download.apply_async(
            args=[str(document.id), str(user.id)],
            countdown=1
        )
    except Exception as e:
        logger.warning(f"Erro ao rastrear download do documento {document.id}: {e}")


# ========================================
# TAGS E CATEGORIZAÇÃO
# ========================================

@receiver(m2m_changed, sender='ordoc_air.Document.tags.through')
def on_document_tags_changed(sender, instance, action, **kwargs):
    """
    Quando tags de um documento mudam.

    Aprende:
    - Tags mais usadas por tipo de documento
    - Padrões de categorização
    """
    from .tasks import learn_tagging_pattern

    if action in ['post_add', 'post_remove']:
        try:
            learn_tagging_pattern.apply_async(
                args=[str(instance.id)],
                kwargs={'action': action},
                countdown=1
            )
        except Exception as e:
            logger.warning(f"Erro ao aprender padrão de tags do documento {instance.id}: {e}")


# ========================================
# HELPERS
# ========================================

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
