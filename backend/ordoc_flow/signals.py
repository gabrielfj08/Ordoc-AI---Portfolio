from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
import logging

from .models import Procedure, Task, ProcedureTemplate
from .search import workflow_solr_service

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Procedure)
def procedure_post_save(sender, instance, created, **kwargs):
    """
    Signal para indexar procedimento no Solr após salvar.
    """
    if getattr(settings, 'SOLR_ENABLED', True):
        try:
            workflow_solr_service.index_procedure(instance)
            logger.info(f"Procedimento {instance.process_number} indexado automaticamente")
        except Exception as e:
            logger.error(f"Erro ao indexar procedimento {instance.id}: {str(e)}")


@receiver(post_delete, sender=Procedure)
def procedure_post_delete(sender, instance, **kwargs):
    """
    Signal para remover procedimento do Solr após deletar.
    """
    if getattr(settings, 'SOLR_ENABLED', True):
        try:
            workflow_solr_service.delete_by_object('procedure', instance.id)
            logger.info(f"Procedimento {instance.process_number} removido do índice")
        except Exception as e:
            logger.error(f"Erro ao remover procedimento {instance.id} do índice: {str(e)}")


@receiver(post_save, sender=Task)
def task_post_save(sender, instance, created, **kwargs):
    """
    Signal para indexar tarefa no Solr após salvar.
    """
    if getattr(settings, 'SOLR_ENABLED', True):
        try:
            workflow_solr_service.index_task(instance)
            logger.info(f"Tarefa {instance.name} indexada automaticamente")
        except Exception as e:
            logger.error(f"Erro ao indexar tarefa {instance.id}: {str(e)}")


@receiver(post_delete, sender=Task)
def task_post_delete(sender, instance, **kwargs):
    """
    Signal para remover tarefa do Solr após deletar.
    """
    if getattr(settings, 'SOLR_ENABLED', True):
        try:
            workflow_solr_service.delete_by_object('task', instance.id)
            logger.info(f"Tarefa {instance.name} removida do índice")
        except Exception as e:
            logger.error(f"Erro ao remover tarefa {instance.id} do índice: {str(e)}")


@receiver(post_save, sender=ProcedureTemplate)
def procedure_template_post_save(sender, instance, created, **kwargs):
    """
    Signal para indexar template no Solr após salvar.
    """
    if getattr(settings, 'SOLR_ENABLED', True):
        try:
            workflow_solr_service.index_procedure_template(instance)
            logger.info(f"Template {instance.name} indexado automaticamente")
        except Exception as e:
            logger.error(f"Erro ao indexar template {instance.id}: {str(e)}")


@receiver(post_delete, sender=ProcedureTemplate)
def procedure_template_post_delete(sender, instance, **kwargs):
    """
    Signal para remover template do Solr após deletar.
    """
    if getattr(settings, 'SOLR_ENABLED', True):
        try:
            workflow_solr_service.delete_by_object('procedure_template', instance.id)
            logger.info(f"Template {instance.name} removido do índice")
        except Exception as e:
            logger.error(f"Erro ao remover template {instance.id} do índice: {str(e)}")


# Signals para reindexação quando objetos relacionados mudam

@receiver(post_save, sender='ordoc_flow.TaskComment')
def task_comment_post_save(sender, instance, created, **kwargs):
    """
    Reindexa a tarefa quando um comentário é adicionado/modificado.
    """
    if getattr(settings, 'SOLR_ENABLED', True) and instance.task:
        try:
            workflow_solr_service.index_task(instance.task)
            logger.info(f"Tarefa {instance.task.name} reindexada após comentário")
        except Exception as e:
            logger.error(f"Erro ao reindexar tarefa após comentário: {str(e)}")


@receiver(post_save, sender='ordoc_flow.TaskField')
def task_field_post_save(sender, instance, created, **kwargs):
    """
    Reindexa o objeto relacionado quando um campo customizado é modificado.
    """
    if getattr(settings, 'SOLR_ENABLED', True) and hasattr(instance, 'fieldable') and instance.fieldable:
        try:
            if isinstance(instance.fieldable, Task):
                workflow_solr_service.index_task(instance.fieldable)
                logger.info(f"Tarefa reindexada após modificação de campo")
            elif isinstance(instance.fieldable, Procedure):
                workflow_solr_service.index_procedure(instance.fieldable)
                logger.info(f"Procedimento reindexado após modificação de campo")
        except Exception as e:
            logger.error(f"Erro ao reindexar após modificação de campo: {str(e)}")


@receiver(post_save, sender='ordoc_flow.Field')
def field_post_save(sender, instance, created, **kwargs):
    """
    Reindexa o template quando um campo é modificado.
    """
    if getattr(settings, 'SOLR_ENABLED', True) and instance.procedure_template:
        try:
            workflow_solr_service.index_procedure_template(instance.procedure_template)
            logger.info(f"Template reindexado após modificação de campo")
        except Exception as e:
            logger.error(f"Erro ao reindexar template após modificação de campo: {str(e)}")


# Função para reindexação em massa
def reindex_all_workflow_data(organization=None):
    """
    Reindexa todos os dados do workflow.
    Útil para migrações ou reconstrução do índice.
    """
    logger.info("Iniciando reindexação em massa do workflow")
    
    try:
        # Filtros por organização se especificado
        procedure_filter = {}
        task_filter = {}
        template_filter = {}
        
        if organization:
            procedure_filter['organization'] = organization
            task_filter['procedure__organization'] = organization
            template_filter['organization'] = organization
        
        # Reindexa procedimentos
        procedures = Procedure.objects.filter(**procedure_filter)
        for procedure in procedures:
            workflow_solr_service.index_procedure(procedure)
        logger.info(f"Reindexados {procedures.count()} procedimentos")
        
        # Reindexa tarefas
        tasks = Task.objects.filter(**task_filter)
        for task in tasks:
            workflow_solr_service.index_task(task)
        logger.info(f"Reindexadas {tasks.count()} tarefas")
        
        # Reindexa templates
        templates = ProcedureTemplate.objects.filter(**template_filter)
        for template in templates:
            workflow_solr_service.index_procedure_template(template)
        logger.info(f"Reindexados {templates.count()} templates")
        
        logger.info("Reindexação em massa concluída com sucesso")
        
    except Exception as e:
        logger.error(f"Erro durante reindexação em massa: {str(e)}")
        raise


# ============================================================================
# NOTIFICATION SIGNALS
# ============================================================================

@receiver(post_save, sender=Task)
def notify_task_assigned(sender, instance, created, **kwargs):
    """
    Notifica quando uma tarefa é atribuída a alguém
    """
    # Só notificar se a tarefa tem assignee e não foi criada pelo próprio assignee
    if instance.assignee and instance.assignee != instance.created_by:
        try:
            from ordoc_flow.notification_service import NotificationService
            NotificationService.notify_task_assigned(
                task=instance,
                assignee=instance.assignee
            )
            logger.info(f"Task assignment notification sent to {instance.assignee.user.email}")
        except Exception as e:
            logger.error(f"Failed to send task assignment notification: {e}")


@receiver(post_save, sender='ordoc_flow.ApprovalInstance')
def notify_approval_requested(sender, instance, created, **kwargs):
    """
    Notifica quando uma aprovação é solicitada
    """
    approver = getattr(instance, 'approver', None)
    if created and approver:
        try:
            from ordoc_flow.notification_service import NotificationService
            NotificationService.notify_approval_requested(
                approval_instance=instance,
                approver=instance.approver
            )
            logger.info(f"Approval notification sent to {instance.approver.user.email}")
        except Exception as e:
            logger.error(f"Failed to send approval notification: {e}")


@receiver(post_save, sender='ordoc_flow.ApprovalInstance')
def notify_approval_status_changed(sender, instance, created, **kwargs):
    """
    Notifica quando status de aprovação muda (não no create)
    """
    if not created and instance.pk:
        try:
            from ordoc_flow.models import ApprovalInstance
            from ordoc_flow.notification_service import NotificationService
            
            # Buscar instância anterior para comparar
            old_instance = ApprovalInstance.objects.filter(pk=instance.pk).first()
            if old_instance and old_instance.status != instance.status and instance.status in ['approved', 'rejected']:
                # Notificar quem solicitou a aprovação
                if hasattr(instance, 'requested_by') and instance.requested_by:
                    subject = f"Aprovação {instance.get_status_display()}"
                    body = f"Sua solicitação de aprovação foi {instance.get_status_display().lower()}."
                    
                    NotificationService.send_notification(
                        recipient=instance.requested_by,
                        subject=subject,
                        body=body,
                        notification_type='approval',
                        related_object=instance
                    )
                    logger.info(f"Approval status notification sent to {instance.requested_by.user.email}")
        except Exception as e:
            logger.error(f"Failed to send approval status notification: {e}")
