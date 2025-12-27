from celery import shared_task
from ordoc_cloud.models import RefreshToken
import logging

logger = logging.getLogger(__name__)

@shared_task
def cleanup_expired_refresh_tokens():
    """
    Remove refresh tokens expirados do banco de dados
    Executar diariamente
    """
    try:
        count = RefreshToken.cleanup_expired()
        logger.info(f"Cleaned up {count} expired refresh tokens")
        return count
    except Exception as e:
        logger.exception("Error cleaning up refresh tokens")
        raise
