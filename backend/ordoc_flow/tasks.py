from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from ordoc_flow.models import Task
from ordoc_flow.notification_service import NotificationService
import logging

logger = logging.getLogger(__name__)


@shared_task
def check_approaching_deadlines():
    """
    Verifica tarefas com prazo próximo (24h) e envia notificações
    """
    tomorrow = timezone.now() + timedelta(days=1)
    today = timezone.now()
    
    # Buscar tarefas com deadline nas próximas 24h
    tasks = Task.objects.filter(
        deadline__gte=today,
        deadline__lte=tomorrow,
        status__in=['pending', 'in_progress']
    ).select_related('assignee')
    
    count = 0
    for task in tasks:
        if task.assignee:
            try:
                NotificationService.notify_deadline_approaching(
                    task=task,
                    assignee=task.assignee
                )
                count += 1
                logger.info(f"Deadline notification sent for task {task.id}")
            except Exception as e:
                logger.error(f"Failed to send deadline notification for task {task.id}: {e}")
    
    logger.info(f"Checked {tasks.count()} tasks with approaching deadlines, sent {count} notifications")
    return f"Checked {tasks.count()} tasks, sent {count} notifications"
