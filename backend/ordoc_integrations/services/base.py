"""
Base Integration Service

Classe abstrata que define a interface para todos os serviços de integração
Fornece funcionalidades comuns: cache, rate limiting, retry logic, logging
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
import time
import hashlib
import json

import requests
from django.core.cache import cache
from django.utils import timezone
from django.db import transaction

from ordoc_integrations.models import (
    IntegrationService,
    IntegrationRequest,
    IntegrationCache
)

logger = logging.getLogger(__name__)


class IntegrationException(Exception):
    """Exceção base para erros de integração"""
    pass


class IntegrationTimeoutException(IntegrationException):
    """Exceção para timeout de integração"""
    pass


class IntegrationRateLimitException(IntegrationException):
    """Exceção para rate limit excedido"""
    pass


class IntegrationAuthException(IntegrationException):
    """Exceção para erro de autenticação"""
    pass


class BaseIntegrationService(ABC):
    """
    Classe abstrata base para todos os serviços de integração

    Fornece:
    - Caching automático com Redis e DB
    - Rate limiting
    - Retry logic com exponential backoff
    - Logging estruturado
    - Métricas e auditoria
    - Error handling padronizado
    """

    # Configurações padrão (podem ser sobrescritas)
    DEFAULT_TIMEOUT = 30
    DEFAULT_RETRY_ATTEMPTS = 3
    DEFAULT_CACHE_TTL = 3600  # 1 hora
    DEFAULT_RATE_LIMIT = 100  # requisições por minuto

    def __init__(
        self,
        service_type: str,
        organization_id: Optional[int] = None,
        user_id: Optional[int] = None
    ):
        """
        Inicializa o serviço de integração

        Args:
            service_type: Tipo do serviço (govbr, receita_federal, etc)
            organization_id: ID da organização fazendo a requisição
            user_id: ID do usuário fazendo a requisição
        """
        self.service_type = service_type
        self.organization_id = organization_id
        self.user_id = user_id

        # Carregar configuração do serviço do banco
        try:
            self.service_config = IntegrationService.objects.get(
                service_type=service_type,
                is_enabled=True
            )
        except IntegrationService.DoesNotExist:
            raise IntegrationException(
                f"Serviço de integração '{service_type}' não encontrado ou não habilitado"
            )

        # Configurações do serviço
        self.base_url = self.service_config.base_url
        self.timeout = self.service_config.timeout_seconds or self.DEFAULT_TIMEOUT
        self.retry_attempts = self.service_config.retry_attempts or self.DEFAULT_RETRY_ATTEMPTS
        self.cache_ttl = self.service_config.cache_ttl_seconds or self.DEFAULT_CACHE_TTL
        self.rate_limit = self.service_config.rate_limit or self.DEFAULT_RATE_LIMIT

        # Session HTTP reutilizável
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'OrdocAI-Integration/1.0',
            'Accept': 'application/json',
        })

        logger.info(
            f"Initialized {self.service_type} integration service",
            extra={
                'service_type': service_type,
                'organization_id': organization_id,
                'user_id': user_id
            }
        )

    @abstractmethod
    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida o identificador (CPF, CNPJ, etc)

        Args:
            identifier: Identificador a validar

        Returns:
            bool: True se válido, False caso contrário
        """
        pass

    @abstractmethod
    def _make_request(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Faz a requisição à API externa (DEVE SER IMPLEMENTADO)

        Args:
            identifier: Identificador (CPF, CNPJ, etc)
            request_type: Tipo de requisição
            params: Parâmetros adicionais

        Returns:
            Dict com os dados da resposta

        Raises:
            IntegrationException: Em caso de erro
        """
        pass

    def execute(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None,
        force_refresh: bool = False
    ) -> Tuple[Dict[str, Any], IntegrationRequest]:
        """
        Executa a integração com todas as camadas (cache, rate limit, retry, logging)

        Args:
            identifier: Identificador (CPF, CNPJ, etc)
            request_type: Tipo de requisição
            params: Parâmetros adicionais
            force_refresh: Forçar atualização ignorando cache

        Returns:
            Tuple[dados, request_object]: Dados da resposta e objeto de request

        Raises:
            IntegrationException: Em caso de erro
        """
        start_time = time.time()

        # Validar identificador
        if not self.validate_identifier(identifier):
            raise IntegrationException(f"Identificador inválido: {identifier}")

        # Criar registro de request
        integration_request = self._create_request_record(
            identifier=identifier,
            request_type=request_type,
            params=params or {}
        )

        try:
            # 1. Verificar cache (se não forçar refresh)
            if not force_refresh:
                cached_data = self._get_from_cache(identifier, request_type)
                if cached_data is not None:
                    execution_time_ms = int((time.time() - start_time) * 1000)
                    self._update_request_success(
                        integration_request,
                        cached_data,
                        200,
                        execution_time_ms,
                        from_cache=True
                    )
                    logger.info(
                        f"Cache HIT for {self.service_type}:{request_type}:{identifier}",
                        extra={'execution_time_ms': execution_time_ms}
                    )
                    return cached_data, integration_request

            # 2. Verificar rate limit
            self._check_rate_limit()

            # 3. Fazer requisição com retry logic
            response_data = self._execute_with_retry(
                identifier=identifier,
                request_type=request_type,
                params=params,
                integration_request=integration_request
            )

            # 4. Salvar em cache
            if self.cache_ttl > 0:
                self._save_to_cache(identifier, request_type, response_data)

            # 5. Atualizar request com sucesso
            execution_time_ms = int((time.time() - start_time) * 1000)
            self._update_request_success(
                integration_request,
                response_data,
                200,
                execution_time_ms,
                from_cache=False
            )

            logger.info(
                f"Integration SUCCESS for {self.service_type}:{request_type}:{identifier}",
                extra={'execution_time_ms': execution_time_ms}
            )

            return response_data, integration_request

        except IntegrationRateLimitException as e:
            execution_time_ms = int((time.time() - start_time) * 1000)
            self._update_request_failure(
                integration_request,
                str(e),
                429,
                execution_time_ms,
                status='rate_limited'
            )
            raise

        except IntegrationTimeoutException as e:
            execution_time_ms = int((time.time() - start_time) * 1000)
            self._update_request_failure(
                integration_request,
                str(e),
                408,
                execution_time_ms,
                status='timeout'
            )
            raise

        except Exception as e:
            execution_time_ms = int((time.time() - start_time) * 1000)
            self._update_request_failure(
                integration_request,
                str(e),
                500,
                execution_time_ms,
                status='failed'
            )
            logger.error(
                f"Integration FAILED for {self.service_type}:{request_type}:{identifier}",
                exc_info=True,
                extra={'execution_time_ms': execution_time_ms}
            )
            raise IntegrationException(f"Erro na integração: {str(e)}")

    def _execute_with_retry(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]],
        integration_request: IntegrationRequest
    ) -> Dict[str, Any]:
        """
        Executa requisição com retry logic (exponential backoff)

        Args:
            identifier: Identificador
            request_type: Tipo de requisição
            params: Parâmetros
            integration_request: Objeto de request para tracking

        Returns:
            Dict com dados da resposta

        Raises:
            IntegrationException: Em caso de falha após todas as tentativas
        """
        last_exception = None

        for attempt in range(self.retry_attempts):
            try:
                logger.debug(
                    f"Attempt {attempt + 1}/{self.retry_attempts} for {self.service_type}:{request_type}",
                    extra={'identifier': identifier}
                )

                response_data = self._make_request(identifier, request_type, params)

                # Sucesso - resetar retry count
                integration_request.retry_count = attempt
                integration_request.save(update_fields=['retry_count'])

                return response_data

            except (requests.Timeout, IntegrationTimeoutException) as e:
                last_exception = IntegrationTimeoutException(str(e))
                logger.warning(
                    f"Timeout on attempt {attempt + 1}/{self.retry_attempts}",
                    extra={'identifier': identifier}
                )

            except requests.RequestException as e:
                last_exception = IntegrationException(str(e))
                logger.warning(
                    f"Request error on attempt {attempt + 1}/{self.retry_attempts}: {str(e)}",
                    extra={'identifier': identifier}
                )

            # Exponential backoff (2^attempt seconds)
            if attempt < self.retry_attempts - 1:
                wait_time = 2 ** attempt
                logger.debug(f"Waiting {wait_time}s before retry...")
                time.sleep(wait_time)

        # Todas as tentativas falharam
        integration_request.retry_count = self.retry_attempts
        integration_request.save(update_fields=['retry_count'])

        raise last_exception or IntegrationException("Todas as tentativas falharam")

    def _check_rate_limit(self):
        """
        Verifica se o rate limit foi excedido

        Usa Redis para controlar requisições por minuto

        Raises:
            IntegrationRateLimitException: Se rate limit excedido
        """
        cache_key = f"rate_limit:{self.service_type}:{self.organization_id}"
        current_count = cache.get(cache_key, 0)

        if current_count >= self.rate_limit:
            raise IntegrationRateLimitException(
                f"Rate limit excedido para {self.service_type}: "
                f"{current_count}/{self.rate_limit} req/min"
            )

        # Incrementar contador (expira em 60 segundos)
        cache.set(cache_key, current_count + 1, 60)

    def _get_from_cache(
        self,
        identifier: str,
        request_type: str
    ) -> Optional[Dict[str, Any]]:
        """
        Busca dados do cache (Redis primeiro, depois DB)

        Args:
            identifier: Identificador
            request_type: Tipo de requisição

        Returns:
            Dados do cache ou None se não encontrado/expirado
        """
        cache_key = self._generate_cache_key(identifier, request_type)

        # 1. Tentar Redis primeiro (mais rápido)
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            logger.debug(f"Redis cache HIT: {cache_key}")
            return cached_data

        # 2. Tentar banco de dados
        try:
            cache_entry = IntegrationCache.objects.get(
                service=self.service_config,
                cache_key=cache_key,
                expires_at__gt=timezone.now()
            )

            # Incrementar hits e atualizar Redis
            cache_entry.increment_hits()
            cache.set(cache_key, cache_entry.cached_data, self.cache_ttl)

            logger.debug(f"DB cache HIT: {cache_key}")
            return cache_entry.cached_data

        except IntegrationCache.DoesNotExist:
            logger.debug(f"Cache MISS: {cache_key}")
            return None

    def _save_to_cache(
        self,
        identifier: str,
        request_type: str,
        data: Dict[str, Any]
    ):
        """
        Salva dados no cache (Redis e DB)

        Args:
            identifier: Identificador
            request_type: Tipo de requisição
            data: Dados a cachear
        """
        cache_key = self._generate_cache_key(identifier, request_type)
        expires_at = timezone.now() + timedelta(seconds=self.cache_ttl)

        # 1. Salvar no Redis
        cache.set(cache_key, data, self.cache_ttl)

        # 2. Salvar no banco (com upsert)
        IntegrationCache.objects.update_or_create(
            service=self.service_config,
            cache_key=cache_key,
            defaults={
                'identifier': identifier,
                'request_type': request_type,
                'cached_data': data,
                'expires_at': expires_at,
            }
        )

        logger.debug(f"Cached data: {cache_key} (TTL: {self.cache_ttl}s)")

    def _generate_cache_key(self, identifier: str, request_type: str) -> str:
        """
        Gera chave única para cache

        Args:
            identifier: Identificador
            request_type: Tipo de requisição

        Returns:
            String com chave do cache
        """
        # Hash do identificador para garantir tamanho fixo
        identifier_hash = hashlib.md5(identifier.encode()).hexdigest()[:16]
        return f"integration:{self.service_type}:{request_type}:{identifier_hash}"

    def _create_request_record(
        self,
        identifier: str,
        request_type: str,
        params: Dict[str, Any]
    ) -> IntegrationRequest:
        """
        Cria registro de request no banco

        Args:
            identifier: Identificador
            request_type: Tipo de requisição
            params: Parâmetros

        Returns:
            IntegrationRequest object
        """
        from ordoc_cloud.models import Organization
        from django.contrib.auth import get_user_model

        User = get_user_model()

        # Buscar organização e usuário
        organization = None
        user = None

        if self.organization_id:
            try:
                organization = Organization.objects.get(id=self.organization_id)
            except Organization.DoesNotExist:
                pass

        if self.user_id:
            try:
                user = User.objects.get(id=self.user_id)
            except User.DoesNotExist:
                pass

        return IntegrationRequest.objects.create(
            service=self.service_config,
            user=user,
            organization=organization,
            request_identifier=identifier,
            request_type=request_type,
            request_params=params,
            status='processing'
        )

    def _update_request_success(
        self,
        integration_request: IntegrationRequest,
        response_data: Dict[str, Any],
        response_code: int,
        execution_time_ms: int,
        from_cache: bool = False
    ):
        """Atualiza request com sucesso"""
        integration_request.status = 'cached' if from_cache else 'success'
        integration_request.response_data = response_data
        integration_request.response_code = response_code
        integration_request.execution_time_ms = execution_time_ms
        integration_request.from_cache = from_cache
        integration_request.completed_at = timezone.now()
        integration_request.save()

    def _update_request_failure(
        self,
        integration_request: IntegrationRequest,
        error_message: str,
        response_code: int,
        execution_time_ms: int,
        status: str = 'failed'
    ):
        """Atualiza request com falha"""
        integration_request.status = status
        integration_request.error_message = error_message
        integration_request.response_code = response_code
        integration_request.execution_time_ms = execution_time_ms
        integration_request.completed_at = timezone.now()
        integration_request.save()

    def __del__(self):
        """Cleanup ao destruir objeto"""
        if hasattr(self, 'session'):
            self.session.close()
