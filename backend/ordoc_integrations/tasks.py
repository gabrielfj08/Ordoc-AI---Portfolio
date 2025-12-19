"""
Celery Tasks para OrdocIntegrations

Tarefas assíncronas para integrações externas
"""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task(name='ordoc_integrations.clear_expired_cache')
def clear_expired_cache():
    """
    Remove entradas de cache expiradas

    Executar diariamente via Celery Beat
    """
    from ordoc_integrations.models import IntegrationCache

    deleted_count, _ = IntegrationCache.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()

    logger.info(f"Cleared {deleted_count} expired cache entries")
    return {
        'success': True,
        'deleted_count': deleted_count,
        'executed_at': timezone.now().isoformat(),
    }


@shared_task(name='ordoc_integrations.cleanup_old_requests')
def cleanup_old_requests(days: int = 90):
    """
    Remove requisições antigas (padrão: 90 dias)

    Args:
        days: Número de dias para manter histórico

    Executar semanalmente via Celery Beat
    """
    from ordoc_integrations.models import IntegrationRequest

    cutoff_date = timezone.now() - timedelta(days=days)

    deleted_count, _ = IntegrationRequest.objects.filter(
        created_at__lt=cutoff_date
    ).delete()

    logger.info(f"Cleaned up {deleted_count} old integration requests (>{days} days)")
    return {
        'success': True,
        'deleted_count': deleted_count,
        'cutoff_date': cutoff_date.isoformat(),
        'executed_at': timezone.now().isoformat(),
    }


@shared_task(name='ordoc_integrations.generate_service_stats')
def generate_service_stats(service_id: str):
    """
    Gera estatísticas para um serviço específico

    Args:
        service_id: UUID do serviço

    Returns:
        Dict com estatísticas
    """
    from ordoc_integrations.models import IntegrationService, IntegrationRequest
    from django.db.models import Count, Avg, Q

    try:
        service = IntegrationService.objects.get(id=service_id)

        # Últimos 30 dias
        since = timezone.now() - timedelta(days=30)

        requests_qs = IntegrationRequest.objects.filter(
            service=service,
            created_at__gte=since
        )

        # Métricas
        total_requests = requests_qs.count()
        successful = requests_qs.filter(status__in=['success', 'cached']).count()
        failed = requests_qs.filter(status='failed').count()
        cached = requests_qs.filter(from_cache=True).count()

        avg_time = requests_qs.filter(
            execution_time_ms__isnull=False
        ).aggregate(avg=Avg('execution_time_ms'))['avg'] or 0

        stats = {
            'service_id': str(service.id),
            'service_name': service.name,
            'period_days': 30,
            'total_requests': total_requests,
            'successful_requests': successful,
            'failed_requests': failed,
            'cached_requests': cached,
            'success_rate': (successful / total_requests * 100) if total_requests > 0 else 0,
            'cache_hit_rate': (cached / total_requests * 100) if total_requests > 0 else 0,
            'avg_execution_time_ms': round(avg_time, 2),
            'generated_at': timezone.now().isoformat(),
        }

        logger.info(f"Generated stats for service {service.name}: {stats}")
        return stats

    except Exception as e:
        logger.error(f"Error generating stats for service {service_id}: {str(e)}")
        return {
            'success': False,
            'error': str(e),
        }


@shared_task(name='ordoc_integrations.execute_integration_async')
def execute_integration_async(
    service_type: str,
    identifier: str,
    request_type: str,
    organization_id: int,
    user_id: int = None,
    params: dict = None,
    force_refresh: bool = False
):
    """
    Executa integração de forma assíncrona

    Args:
        service_type: Tipo do serviço (receita_federal, govbr, etc)
        identifier: Identificador (CPF, CNPJ, etc)
        request_type: Tipo de requisição
        organization_id: ID da organização
        user_id: ID do usuário (opcional)
        params: Parâmetros adicionais
        force_refresh: Forçar refresh do cache

    Returns:
        Dict com resultado da integração
    """
    from ordoc_integrations.services.receita_federal import ReceitaFederalService
    from ordoc_integrations.services.base import IntegrationException

    try:
        # Factory pattern para instanciar serviço correto
        if service_type == 'receita_federal':
            service = ReceitaFederalService(
                organization_id=organization_id,
                user_id=user_id
            )
        else:
            raise IntegrationException(f"Serviço não implementado: {service_type}")

        # Executar integração
        data, request_obj = service.execute(
            identifier=identifier,
            request_type=request_type,
            params=params or {},
            force_refresh=force_refresh
        )

        logger.info(
            f"Async integration completed: {service_type}:{request_type}:{identifier}"
        )

        return {
            'success': True,
            'data': data,
            'request_id': str(request_obj.id),
            'from_cache': request_obj.from_cache,
            'execution_time_ms': request_obj.execution_time_ms,
        }

    except Exception as e:
        logger.error(
            f"Async integration failed: {service_type}:{request_type}:{identifier}",
            exc_info=True
        )
        return {
            'success': False,
            'error': str(e),
            'service_type': service_type,
            'identifier': identifier,
        }


@shared_task(name='ordoc_integrations.bulk_validate_identifiers')
def bulk_validate_identifiers(
    identifiers: list,
    service_type: str,
    request_type: str,
    organization_id: int,
    user_id: int = None
):
    """
    Valida múltiplos identificadores em batch

    Args:
        identifiers: Lista de identificadores (CPF, CNPJ, etc)
        service_type: Tipo do serviço
        request_type: Tipo de requisição
        organization_id: ID da organização
        user_id: ID do usuário (opcional)

    Returns:
        Dict com resultados de todas as validações
    """
    from ordoc_integrations.services.receita_federal import ReceitaFederalService
    from ordoc_integrations.services.base import IntegrationException

    results = {
        'total': len(identifiers),
        'successful': 0,
        'failed': 0,
        'results': []
    }

    try:
        # Factory pattern para instanciar serviço correto
        if service_type == 'receita_federal':
            service = ReceitaFederalService(
                organization_id=organization_id,
                user_id=user_id
            )
        else:
            raise IntegrationException(f"Serviço não implementado: {service_type}")

        # Executar validações
        for identifier in identifiers:
            try:
                data, request_obj = service.execute(
                    identifier=identifier,
                    request_type=request_type
                )

                results['successful'] += 1
                results['results'].append({
                    'identifier': identifier,
                    'success': True,
                    'data': data,
                    'request_id': str(request_obj.id),
                })

            except Exception as e:
                results['failed'] += 1
                results['results'].append({
                    'identifier': identifier,
                    'success': False,
                    'error': str(e),
                })

        logger.info(
            f"Bulk validation completed: {results['successful']}/{results['total']} successful"
        )

        return results

    except Exception as e:
        logger.error(f"Bulk validation failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
        }


@shared_task(name='ordoc_integrations.health_check_services')
def health_check_services():
    """
    Verifica saúde de todos os serviços ativos

    Executar a cada hora via Celery Beat
    """
    from ordoc_integrations.models import IntegrationService

    services = IntegrationService.objects.filter(
        is_enabled=True,
        status='active'
    )

    results = {
        'total_services': services.count(),
        'healthy': 0,
        'unhealthy': 0,
        'services': []
    }

    for service in services:
        try:
            # TODO: Implementar health check específico para cada serviço
            # Por enquanto, apenas verificar se está configurado

            is_healthy = bool(service.base_url)

            if is_healthy:
                results['healthy'] += 1
            else:
                results['unhealthy'] += 1

            results['services'].append({
                'service_type': service.service_type,
                'name': service.name,
                'healthy': is_healthy,
            })

        except Exception as e:
            results['unhealthy'] += 1
            results['services'].append({
                'service_type': service.service_type,
                'name': service.name,
                'healthy': False,
                'error': str(e),
            })

    logger.info(
        f"Health check completed: {results['healthy']}/{results['total_services']} healthy"
    )

    return results
