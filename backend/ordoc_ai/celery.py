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


# Celery Beat Schedule - Tarefas periódicas de INTELIGÊNCIA AMPLA
app.conf.beat_schedule = {
    # ========================================
    # APRENDIZADO E AGREGAÇÃO
    # ========================================

    # Intelligence: Agregação de padrões (a cada hora)
    'intelligence-aggregate-patterns-hourly': {
        'task': 'intelligence.tasks.aggregate_patterns_periodic',
        'schedule': crontab(minute=0),  # A cada hora cheia (00:00, 01:00, etc)
        'options': {'expires': 3600}  # Expira em 1h se não executar
    },

    # ========================================
    # ANÁLISE PROATIVA
    # ========================================

    # Intelligence: Análise proativa de documentos (a cada 6 horas)
    'intelligence-proactive-analysis': {
        'task': 'intelligence.tasks.proactive_document_analysis',
        'schedule': crontab(minute=0, hour='*/6'),  # 00:00, 06:00, 12:00, 18:00
        'options': {'expires': 21600}  # Expira em 6h
    },

    # Intelligence: Análise de saúde de pastas (a cada 6 horas)
    'intelligence-directories-health-analysis': {
        'task': 'intelligence.tasks.analyze_directories_health',
        'schedule': crontab(minute=30, hour='*/6'),  # 00:30, 06:30, 12:30, 18:30
        'options': {'expires': 21600}  # Expira em 6h
    },

    # ========================================
    # COMPLIANCE E SEGURANÇA
    # ========================================

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

    # ========================================
    # INSIGHTS E RELATÓRIOS
    # ========================================

    # Intelligence: Relatório de insights (semanalmente às segundas 9h)
    'intelligence-weekly-insights': {
        'task': 'intelligence.tasks.generate_insights_report',
        'schedule': crontab(hour=9, minute=0, day_of_week=1),  # Segunda-feira 9h
        'options': {'expires': 86400}
    },

    # Intelligence: Análise de padrões de auditoria (diariamente às 2h)
    'intelligence-audit-patterns-analysis': {
        'task': 'intelligence.tasks.analyze_audit_patterns',
        'schedule': crontab(hour=2, minute=0),  # 02:00 todos os dias
        'options': {'expires': 86400}  # Expira em 24h
    },
    
    # ========================================
    # NOTIFICAÇÕES
    # ========================================
    
    # Notifications: Verificar prazos próximos (a cada hora)
    'notifications-check-deadlines-hourly': {
        'task': 'ordoc_flow.tasks.check_approaching_deadlines',
        'schedule': crontab(minute=0),  # A cada hora cheia
        'options': {'expires': 3600}  # Expira em 1h
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
