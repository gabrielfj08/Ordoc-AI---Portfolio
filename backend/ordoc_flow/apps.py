from django.apps import AppConfig


class OrdocFlowConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ordoc_flow'
    verbose_name = 'OrdocFlow - Workflow Management'
    
    def ready(self):
        """Carrega os signals quando a aplicação estiver pronta"""
        import ordoc_flow.signals  # noqa
