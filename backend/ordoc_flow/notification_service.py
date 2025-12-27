from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ordoc_flow.approval_models import NotificationLog, NotificationTemplate
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Serviço para envio de notificações em tempo real
    """
    
    @staticmethod
    def send_notification(recipient, subject, body, notification_type='system', related_object=None):
        """
        Cria e envia notificação em tempo real
        
        Args:
            recipient: OrdocUser que receberá a notificação
            subject: Assunto da notificação
            body: Corpo da mensagem
            notification_type: Tipo de notificação (default: 'system')
            related_object: Objeto relacionado (opcional)
        """
        from django.contrib.contenttypes.models import ContentType
        
        # Criar log de notificação
        notification = NotificationLog.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            subject=subject,
            body=body,
            status='sent',
            sent_at=timezone.now(),
            content_type=ContentType.objects.get_for_model(related_object) if related_object else None,
            object_id=related_object.id if related_object else None,
        )
        
        # Enviar via WebSocket se for notificação do sistema
        if notification_type == 'system':
            NotificationService.send_websocket_notification(recipient, notification)
        
        logger.info(f"Notification sent to {recipient.user.email}: {subject}")
        return notification
    
    @staticmethod
    def send_websocket_notification(recipient, notification):
        """
        Envia notificação via WebSocket
        """
        channel_layer = get_channel_layer()
        room_group_name = f'notifications_{recipient.id}'
        
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'notification_message',
                'notification': {
                    'id': str(notification.id),
                    'subject': notification.subject,
                    'body': notification.body,
                    'created_at': notification.created_at.isoformat(),
                    'status': notification.status,
                }
            }
        )
    
    @staticmethod
    def notify_task_assigned(task, assignee):
        """
        Notifica quando uma tarefa é atribuída
        """
        subject = f"Nova tarefa atribuída: {task.name}"
        body = f"Você foi atribuído à tarefa '{task.name}' no procedimento '{task.procedure.name}'."
        
        return NotificationService.send_notification(
            recipient=assignee,
            subject=subject,
            body=body,
            related_object=task
        )
    
    @staticmethod
    def notify_approval_requested(approval_instance, approver):
        """
        Notifica quando uma aprovação é solicitada
        """
        subject = "Nova solicitação de aprovação"
        body = f"Você tem uma nova solicitação de aprovação pendente."
        
        return NotificationService.send_notification(
            recipient=approver,
            subject=subject,
            body=body,
            related_object=approval_instance
        )
    
    @staticmethod
    def notify_deadline_approaching(task, assignee):
        """
        Notifica quando o prazo está se aproximando
        """
        subject = f"Prazo se aproximando: {task.name}"
        body = f"A tarefa '{task.name}' está próxima do prazo limite."
        
        return NotificationService.send_notification(
            recipient=assignee,
            subject=subject,
            body=body,
            related_object=task
        )
