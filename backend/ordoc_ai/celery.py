"""
Celery configuration for Ordoc-AI
"""
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')

app = Celery('ordoc_ai')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


# Celery Beat Schedule - Tarefas periódicas
app.conf.beat_schedule = {
    # Intelligence: Agregação de padrões (a cada hora)
    'intelligence-aggregate-patterns-hourly': {
        'task': 'intelligence.tasks.aggregate_patterns_periodic',
        'schedule': crontab(minute=0),  # A cada hora cheia (00:00, 01:00, etc)
        'options': {'expires': 3600}  # Expira em 1h se não executar
    },

    # Intelligence: Alertas de compliance (diariamente às 8h)
    'intelligence-compliance-alerts-daily': {
        'task': 'intelligence.tasks.generate_compliance_alerts',
        'schedule': crontab(hour=8, minute=0),  # 8:00 AM todos os dias
        'options': {'expires': 86400}  # Expira em 24h
    },

    # Intelligence: Limpeza de alertas expirados (diariamente à meia-noite)
    'intelligence-cleanup-alerts-daily': {
        'task': 'intelligence.tasks.cleanup_expired_alerts',
        'schedule': crontab(hour=0, minute=0),  # 00:00 todos os dias
        'options': {'expires': 86400}
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
