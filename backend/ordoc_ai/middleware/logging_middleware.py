"""
Middleware de Logging Estruturado

Registra todas as requests/responses em formato JSON estruturado.
Adiciona request_id único para rastreamento.
"""

import logging
import time
import uuid
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpRequest, HttpResponse

logger = logging.getLogger('ordoc_ai.requests')


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware que loga todas as requests e responses em JSON estruturado.

    Adiciona:
    - request_id único para rastreamento
    - Tempo de execução
    - User/Organization context
    - Status code e método HTTP
    """

    def process_request(self, request: HttpRequest):
        """Adiciona metadata no início da request"""
        # Gerar request_id único
        request.request_id = str(uuid.uuid4())
        request.start_time = time.time()

        # Adicionar ao header da response
        request.META['HTTP_X_REQUEST_ID'] = request.request_id

        return None

    def process_response(self, request: HttpRequest, response: HttpResponse):
        """Loga a request/response ao finalizar"""
        # Calcular tempo de execução
        if hasattr(request, 'start_time'):
            duration_ms = int((time.time() - request.start_time) * 1000)
        else:
            duration_ms = None

        # Adicionar request_id ao header da response
        if hasattr(request, 'request_id'):
            response['X-Request-ID'] = request.request_id

        # Preparar contexto
        context = {
            'request_id': getattr(request, 'request_id', None),
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'duration_ms': duration_ms,
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', 'unknown'),
        }

        # Adicionar user context se autenticado
        if hasattr(request, 'user') and request.user.is_authenticated:
            context['user_id'] = request.user.id
            context['username'] = request.user.username

        # Adicionar organization context se disponível
        if hasattr(request, 'organization') and request.organization:
            context['organization_id'] = request.organization.id
            context['organization_name'] = request.organization.name

        # Logar com nível apropriado
        if response.status_code >= 500:
            logger.error('Server error', extra=context)
        elif response.status_code >= 400:
            logger.warning('Client error', extra=context)
        else:
            logger.info('Request completed', extra=context)

        return response

    def process_exception(self, request: HttpRequest, exception: Exception):
        """Loga exceções não tratadas"""
        context = {
            'request_id': getattr(request, 'request_id', None),
            'method': request.method,
            'path': request.path,
            'exception_type': type(exception).__name__,
            'exception_message': str(exception),
            'ip_address': self._get_client_ip(request),
        }

        if hasattr(request, 'user') and request.user.is_authenticated:
            context['user_id'] = request.user.id

        logger.exception('Unhandled exception', extra=context, exc_info=True)

        return None

    @staticmethod
    def _get_client_ip(request: HttpRequest) -> str:
        """Obtém IP real do cliente (considerando proxies)"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', 'unknown')
        return ip
