from django.apps import AppConfig


class OrdocIntegrationsConfig(AppConfig):
    """
    Configuração do app OrdocIntegrations

    Gerencia integrações com serviços externos brasileiros
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ordoc_integrations'
    verbose_name = 'Integrações Externas'

    def ready(self):
        """Importar signals quando o app estiver pronto"""
        # import ordoc_integrations.signals
        pass
