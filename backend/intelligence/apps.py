from django.apps import AppConfig
import logging

logger = logging.getLogger('intelligence')


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
        """
        Initialize signals and other app-specific setup.

        Registra signals para integração automática com outros módulos.
        """
        try:
            # Import signals to register them
            from . import signals  # noqa: F401
            logger.info("Intelligence signals registered successfully")

            # Carregar padrões built-in na primeira execução
            self._load_builtin_patterns()

        except Exception as e:
            logger.warning(f"Error loading intelligence signals: {e}")

    def _load_builtin_patterns(self):
        """
        Carrega padrões built-in na primeira execução.

        Padrões úteis pré-definidos (compliance, LGPD, etc).
        """
        try:
            from .models import LearnedPattern
            from .knowledge.matchers import get_builtin_patterns

            # Verificar se já existem padrões built-in
            if LearnedPattern.objects.filter(pattern_type='builtin').exists():
                return  # Já carregados

            builtin_patterns = get_builtin_patterns()

            for pattern_data in builtin_patterns:
                LearnedPattern.objects.get_or_create(
                    layer=pattern_data.get('layer', 'platform'),
                    pattern_type='builtin',
                    name=pattern_data['name'],
                    defaults={
                        'description': pattern_data.get('description', ''),
                        'condition': pattern_data['condition'],
                        'action': pattern_data['action'],
                        'confidence': pattern_data.get('confidence', 0.8),
                        'occurrences': 1,
                        'is_active': True
                    }
                )

            logger.info(f"Loaded {len(builtin_patterns)} builtin patterns")

        except Exception as e:
            # Não propagar erro - padrões built-in são opcionais
            logger.debug(f"Could not load builtin patterns: {e}")
