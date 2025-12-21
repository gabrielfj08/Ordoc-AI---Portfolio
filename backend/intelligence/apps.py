from django.apps import AppConfig


class IntelligenceConfig(AppConfig):
    """
    Django app configuration for the Intelligence module.
    
    This module provides AI-powered document analysis, validation,
    and learning capabilities using a hierarchical knowledge architecture.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'intelligence'
    verbose_name = 'Ordoc Intelligence'
    
    def ready(self):
        """Initialize signals and other app-specific setup."""
        pass
