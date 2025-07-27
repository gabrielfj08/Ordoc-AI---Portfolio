from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from celery import shared_task
import logging

from .models import (
    Procedure, Task, ProcedureTemplate, TaskTemplate,
    ExternalRequester, GroupRequester
)
from .approval_models import (
    ApprovalWorkflow, ApprovalInstance, ApprovalStep, ApprovalStepInstance,
    NotificationTemplate, NotificationLog
)

logger = logging.getLogger(__name__)


class WorkflowNotificationService:
    """
    Serviço para gerenciar notificações do workflow.
    """
    
    def __init__(self, organization):
        self.organization = organization
    
    def send_notification(self, template_name, recipient, context_object, **extra_context):
        """
        Envia uma notificação baseada em template.
        
        Args:
            template_name: Nome do template de notificação
            recipient: Usuário ou ExternalRequester que receberá a notificação
            context_object: Objeto que será usado como contexto (Procedure, Task, etc.)
            extra_context: Contexto adicional para o template
        """
        try:
            # Busca o template de notificação
            template = NotificationTemplate.objects.get(
                name=template_name,
                organization=self.organization,
                is_active=True
            )
            
            # Prepara o contexto
            context = {
                'object': context_object,
                'recipient': recipient,
                'organization': self.organization,
                **extra_context
            }
            
            # Renderiza o assunto e corpo
            subject = self._render_template(template.subject_template, context)
            body = self._render_template(template.body_template, context)
            
            # Determina o destinatário
            if hasattr(recipient, 'email'):
                recipient_email = recipient.email
                recipient_phone = getattr(recipient, 'phone', None)
            else:
                recipient_email = recipient.email if hasattr(recipient, 'email') else None
                recipient_phone = None
            
            # Cria o log de notificação
            notification_log = NotificationLog.objects.create(
                template=template,
                notification_type=template.notification_type,
                recipient_email=recipient_email,
                recipient_phone=recipient_phone,
                subject=subject,
                body=body,
                status='pending',
                content_type=ContentType.objects.get_for_model(context_object),
                object_id=context_object.id
            )
            
            # Define o destinatário correto
            if isinstance(recipient, ExternalRequester):
                notification_log.external_recipient = recipient
            else:
                notification_log.recipient = recipient
            
            notification_log.save()
            
            # Envia a notificação de forma assíncrona
            if template.notification_type in ['email', 'both']:
                send_email_notification.delay(notification_log.id)
            
            if template.notification_type in ['sms', 'both'] and recipient_phone:
                send_sms_notification.delay(notification_log.id)
            
            return notification_log
            
        except NotificationTemplate.DoesNotExist:
            logger.warning(f"Template de notificação '{template_name}' não encontrado")
            return None
        except Exception as e:
            logger.error(f"Erro ao enviar notificação: {str(e)}")
            return None
    
    def _render_template(self, template_string, context):
        """Renderiza um template string com o contexto fornecido"""
        from django.template import Template, Context
        template = Template(template_string)
        return template.render(Context(context))
    
    def notify_procedure_created(self, procedure):
        """Notifica sobre criação de procedimento"""
        # Notifica o solicitante
        if procedure.requester:
            self.send_notification(
                'procedure_created',
                procedure.requester,
                procedure,
                action='created'
            )
        
        # Notifica o grupo responsável
        if procedure.responsible_group:
            for member in procedure.responsible_group.get_active_members():
                self.send_notification(
                    'procedure_assigned',
                    member.user,
                    procedure,
                    action='assigned'
                )
    
    def notify_task_assigned(self, task):
        """Notifica sobre atribuição de tarefa"""
        if task.assignee:
            self.send_notification(
                'task_assigned',
                task.assignee,
                task,
                action='assigned'
            )
        elif task.group_assignee:
            for member in task.group_assignee.get_active_members():
                self.send_notification(
                    'task_assigned',
                    member.user,
                    task,
                    action='assigned'
                )
    
    def notify_task_completed(self, task):
        """Notifica sobre conclusão de tarefa"""
        # Notifica o criador do procedimento
        if task.procedure.created_by:
            self.send_notification(
                'task_completed',
                task.procedure.created_by,
                task,
                action='completed'
            )
        
        # Notifica o solicitante
        if task.procedure.requester:
            self.send_notification(
                'task_completed',
                task.procedure.requester,
                task,
                action='completed'
            )
    
    def notify_approval_requested(self, approval_instance):
        """Notifica sobre solicitação de aprovação"""
        # Busca a primeira etapa pendente
        pending_step = approval_instance.step_instances.filter(
            status='pending'
        ).order_by('approval_step__order').first()
        
        if pending_step and pending_step.assigned_to:
            self.send_notification(
                'approval_requested',
                pending_step.assigned_to,
                approval_instance,
                step=pending_step,
                action='approval_requested'
            )


class ApprovalService:
    """
    Serviço para gerenciar o sistema de aprovações.
    """
    
    def __init__(self, organization):
        self.organization = organization
        self.notification_service = WorkflowNotificationService(organization)
    
    def create_approval_instance(self, workflow, content_object, requested_by):
        """
        Cria uma instância de aprovação para um objeto.
        
        Args:
            workflow: ApprovalWorkflow
            content_object: Objeto que precisa de aprovação (Procedure, Task, etc.)
            requested_by: Usuário que solicitou a aprovação
        """
        with transaction.atomic():
            # Cria a instância de aprovação
            approval_instance = ApprovalInstance.objects.create(
                workflow=workflow,
                content_type=ContentType.objects.get_for_model(content_object),
                object_id=content_object.id,
                requested_by=requested_by,
                status='pending'
            )
            
            # Cria as instâncias das etapas
            for step in workflow.steps.all().order_by('order'):
                step_instance = ApprovalStepInstance.objects.create(
                    approval_instance=approval_instance,
                    approval_step=step,
                    status='pending' if step.order == 1 else 'waiting',
                    assigned_to=step.approver_user
                )
                
                # Define prazo se especificado
                if step.timeout_hours:
                    step_instance.due_date = timezone.now() + timezone.timedelta(
                        hours=step.timeout_hours
                    )
                    step_instance.save()
            
            # Inicia o workflow
            approval_instance.start()
            approval_instance.save()
            
            # Notifica sobre a solicitação
            self.notification_service.notify_approval_requested(approval_instance)
            
            return approval_instance
    
    def approve_step(self, step_instance, approved_by, comments=None):
        """
        Aprova uma etapa do workflow.
        """
        with transaction.atomic():
            if step_instance.status != 'pending':
                raise ValueError("Esta etapa não está pendente de aprovação")
            
            # Aprova a etapa
            step_instance.approve()
            step_instance.approved_by = approved_by
            step_instance.comments = comments or ''
            step_instance.completed_at = timezone.now()
            step_instance.save()
            
            # Verifica se há próxima etapa
            next_step = step_instance.approval_instance.step_instances.filter(
                approval_step__order__gt=step_instance.approval_step.order,
                status='waiting'
            ).order_by('approval_step__order').first()
            
            if next_step:
                # Ativa a próxima etapa
                next_step.status = 'pending'
                next_step.save()
                
                # Notifica o próximo aprovador
                if next_step.assigned_to:
                    self.notification_service.send_notification(
                        'approval_requested',
                        next_step.assigned_to,
                        step_instance.approval_instance,
                        step=next_step,
                        action='approval_requested'
                    )
            else:
                # Todas as etapas foram aprovadas
                approval_instance = step_instance.approval_instance
                approval_instance.approve()
                approval_instance.completed_at = timezone.now()
                approval_instance.save()
                
                # Notifica sobre aprovação final
                self.notification_service.send_notification(
                    'approval_completed',
                    approval_instance.requested_by,
                    approval_instance,
                    action='approved'
                )
    
    def reject_step(self, step_instance, rejected_by, comments=None):
        """
        Rejeita uma etapa do workflow.
        """
        with transaction.atomic():
            if step_instance.status != 'pending':
                raise ValueError("Esta etapa não está pendente de aprovação")
            
            # Rejeita a etapa
            step_instance.reject()
            step_instance.approved_by = rejected_by
            step_instance.comments = comments or ''
            step_instance.completed_at = timezone.now()
            step_instance.save()
            
            # Rejeita toda a instância
            approval_instance = step_instance.approval_instance
            approval_instance.reject()
            approval_instance.completed_at = timezone.now()
            approval_instance.save()
            
            # Notifica sobre rejeição
            self.notification_service.send_notification(
                'approval_rejected',
                approval_instance.requested_by,
                approval_instance,
                step=step_instance,
                action='rejected'
            )


class BatchOperationService:
    """
    Serviço para operações em lote.
    """
    
    def __init__(self, organization, user):
        self.organization = organization
        self.user = user
    
    def execute_batch_operation(self, action, object_ids, **kwargs):
        """
        Executa uma operação em lote.
        
        Args:
            action: Tipo de operação ('archive', 'finish', 'assign', etc.)
            object_ids: Lista de IDs dos objetos
            **kwargs: Parâmetros específicos da operação
        """
        success_count = 0
        error_count = 0
        errors = []
        processed_objects = []
        
        with transaction.atomic():
            for obj_id in object_ids:
                try:
                    if action in ['archive', 'finish', 'assign', 'change_priority']:
                        # Operações em procedimentos
                        obj = Procedure.objects.get(
                            id=obj_id,
                            organization=self.organization
                        )
                        self._execute_procedure_operation(obj, action, **kwargs)
                    
                    elif action in ['add_comment']:
                        # Operações em tarefas
                        obj = Task.objects.get(
                            id=obj_id,
                            procedure__organization=self.organization
                        )
                        self._execute_task_operation(obj, action, **kwargs)
                    
                    success_count += 1
                    processed_objects.append(obj_id)
                    
                except Exception as e:
                    error_count += 1
                    errors.append({
                        'object_id': obj_id,
                        'error': str(e)
                    })
        
        return {
            'success_count': success_count,
            'error_count': error_count,
            'errors': errors,
            'processed_objects': processed_objects
        }
    
    def _execute_procedure_operation(self, procedure, action, **kwargs):
        """Executa operação em um procedimento"""
        if action == 'archive':
            procedure.archive()
            procedure.save()
        
        elif action == 'finish':
            procedure.finish(self.user)
            procedure.save()
        
        elif action == 'assign':
            if kwargs.get('group_assignee_id'):
                group = GroupRequester.objects.get(
                    id=kwargs['group_assignee_id'],
                    organization=self.organization
                )
                procedure.responsible_group = group
                procedure.save()
        
        elif action == 'change_priority':
            procedure.priority = kwargs['priority']
            procedure.save()
    
    def _execute_task_operation(self, task, action, **kwargs):
        """Executa operação em uma tarefa"""
        if action == 'add_comment':
            from .approval_models import TaskComment
            TaskComment.objects.create(
                task=task,
                comment=kwargs['comment'],
                created_by=self.user
            )
        
        elif action == 'assign':
            if kwargs.get('assignee_id'):
                assignee = ExternalRequester.objects.get(
                    id=kwargs['assignee_id'],
                    organization=self.organization
                )
                task.assignee = assignee
            elif kwargs.get('group_assignee_id'):
                group = GroupRequester.objects.get(
                    id=kwargs['group_assignee_id'],
                    organization=self.organization
                )
                task.group_assignee = group
            
            task.save()


class WorkflowReportService:
    """
    Serviço para geração de relatórios do workflow.
    """
    
    def __init__(self, organization):
        self.organization = organization
    
    def get_procedure_stats(self, start_date=None, end_date=None):
        """Estatísticas de procedimentos"""
        queryset = Procedure.objects.filter(organization=self.organization)
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        stats = {
            'total': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'running': queryset.filter(status='running').count(),
            'started': queryset.filter(status='started').count(),
            'finished': queryset.filter(status='finished').count(),
            'archived': queryset.filter(status='archived').count(),
        }
        
        return stats
    
    def get_task_stats(self, start_date=None, end_date=None):
        """Estatísticas de tarefas"""
        queryset = Task.objects.filter(procedure__organization=self.organization)
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        stats = {
            'total': queryset.count(),
            'draft': queryset.filter(status='draft').count(),
            'running': queryset.filter(status='running').count(),
            'started': queryset.filter(status='started').count(),
            'finished': queryset.filter(status='finished').count(),
            'refused': queryset.filter(status='refused').count(),
        }
        
        return stats
    
    def get_performance_metrics(self, start_date=None, end_date=None):
        """Métricas de performance"""
        procedures = Procedure.objects.filter(organization=self.organization)
        tasks = Task.objects.filter(procedure__organization=self.organization)
        
        if start_date:
            procedures = procedures.filter(created_at__gte=start_date)
            tasks = tasks.filter(created_at__gte=start_date)
        if end_date:
            procedures = procedures.filter(created_at__lte=end_date)
            tasks = tasks.filter(created_at__lte=end_date)
        
        # Tempo médio de conclusão
        finished_procedures = procedures.filter(status='finished')
        avg_completion_time = None
        if finished_procedures.exists():
            from django.db.models import Avg
            from django.db.models import F
            avg_completion_time = finished_procedures.aggregate(
                avg_time=Avg(F('updated_at') - F('created_at'))
            )['avg_time']
        
        # Tarefas em atraso
        overdue_tasks = tasks.filter(
            deadline__lt=timezone.now().date(),
            status__in=['running', 'started']
        ).count()
        
        # Taxa de conclusão no prazo
        on_time_tasks = tasks.filter(
            status='finished',
            deadline__gte=timezone.now().date()
        ).count()
        
        total_finished_tasks = tasks.filter(status='finished').count()
        on_time_rate = (on_time_tasks / total_finished_tasks * 100) if total_finished_tasks > 0 else 0
        
        return {
            'avg_completion_time': avg_completion_time,
            'overdue_tasks': overdue_tasks,
            'on_time_rate': round(on_time_rate, 2),
            'total_finished_tasks': total_finished_tasks
        }


# Tasks Celery para processamento assíncrono

@shared_task
def send_email_notification(notification_log_id):
    """Task para envio de notificação por email"""
    try:
        notification_log = NotificationLog.objects.get(id=notification_log_id)
        
        send_mail(
            subject=notification_log.subject,
            message=notification_log.body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[notification_log.recipient_email],
            fail_silently=False,
        )
        
        notification_log.status = 'sent'
        notification_log.sent_at = timezone.now()
        notification_log.save()
        
        logger.info(f"Email enviado para {notification_log.recipient_email}")
        
    except Exception as e:
        notification_log = NotificationLog.objects.get(id=notification_log_id)
        notification_log.status = 'failed'
        notification_log.error_message = str(e)
        notification_log.save()
        
        logger.error(f"Erro ao enviar email: {str(e)}")


@shared_task
def send_sms_notification(notification_log_id):
    """Task para envio de notificação por SMS"""
    try:
        notification_log = NotificationLog.objects.get(id=notification_log_id)
        
        # Aqui você integraria com um serviço de SMS como Twilio, AWS SNS, etc.
        # Por enquanto, apenas logamos
        logger.info(f"SMS enviado para {notification_log.recipient_phone}: {notification_log.body}")
        
        notification_log.status = 'sent'
        notification_log.sent_at = timezone.now()
        notification_log.save()
        
    except Exception as e:
        notification_log = NotificationLog.objects.get(id=notification_log_id)
        notification_log.status = 'failed'
        notification_log.error_message = str(e)
        notification_log.save()
        
        logger.error(f"Erro ao enviar SMS: {str(e)}")


@shared_task
def process_overdue_tasks():
    """Task para processar tarefas em atraso"""
    from django.utils import timezone
    
    overdue_tasks = Task.objects.filter(
        deadline__lt=timezone.now().date(),
        status__in=['running', 'started']
    )
    
    for task in overdue_tasks:
        # Notifica sobre tarefa em atraso
        notification_service = WorkflowNotificationService(task.procedure.organization)
        
        # Notifica o responsável
        if task.assignee:
            notification_service.send_notification(
                'task_overdue',
                task.assignee,
                task,
                action='overdue'
            )
        elif task.group_assignee:
            for member in task.group_assignee.get_active_members():
                notification_service.send_notification(
                    'task_overdue',
                    member.user,
                    task,
                    action='overdue'
                )
        
        # Notifica o criador do procedimento
        if task.procedure.created_by:
            notification_service.send_notification(
                'task_overdue',
                task.procedure.created_by,
                task,
                action='overdue'
            )
    
    logger.info(f"Processadas {overdue_tasks.count()} tarefas em atraso")


@shared_task
def cleanup_old_notifications():
    """Task para limpeza de notificações antigas"""
    from datetime import timedelta
    
    # Remove logs de notificação mais antigos que 90 dias
    cutoff_date = timezone.now() - timedelta(days=90)
    
    deleted_count = NotificationLog.objects.filter(
        created_at__lt=cutoff_date
    ).delete()[0]
    
    logger.info(f"Removidos {deleted_count} logs de notificação antigos")


@shared_task
def generate_daily_reports():
    """Task para geração de relatórios diários"""
    from ordoc_cloud.models import Organization
    
    for organization in Organization.objects.filter(is_active=True):
        report_service = WorkflowReportService(organization)
        
        # Gera estatísticas do dia
        today = timezone.now().date()
        yesterday = today - timezone.timedelta(days=1)
        
        procedure_stats = report_service.get_procedure_stats(yesterday, today)
        task_stats = report_service.get_task_stats(yesterday, today)
        performance_metrics = report_service.get_performance_metrics(yesterday, today)
        
        # Aqui você poderia salvar em um modelo de relatório ou enviar por email
        logger.info(f"Relatório diário gerado para {organization.name}")
        logger.info(f"Procedimentos: {procedure_stats}")
        logger.info(f"Tarefas: {task_stats}")
        logger.info(f"Performance: {performance_metrics}")


# Configuração das tasks periódicas no Celery Beat
# Adicione no settings.py:
"""
CELERY_BEAT_SCHEDULE = {
    'process-overdue-tasks': {
        'task': 'ordoc_flow.services.process_overdue_tasks',
        'schedule': crontab(hour=8, minute=0),  # Todo dia às 8:00
    },
    'cleanup-old-notifications': {
        'task': 'ordoc_flow.services.cleanup_old_notifications',
        'schedule': crontab(hour=2, minute=0, day_of_week=0),  # Domingo às 2:00
    },
    'generate-daily-reports': {
        'task': 'ordoc_flow.services.generate_daily_reports',
        'schedule': crontab(hour=7, minute=0),  # Todo dia às 7:00
    },
}
"""
