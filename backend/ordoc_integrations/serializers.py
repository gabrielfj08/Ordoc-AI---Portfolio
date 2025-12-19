"""
DRF Serializers para OrdocIntegrations

Serialização de dados de integração para API REST
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import IntegrationService, IntegrationRequest, IntegrationCache

User = get_user_model()


class IntegrationServiceSerializer(serializers.ModelSerializer):
    """Serializer para IntegrationService"""

    service_type_display = serializers.CharField(
        source='get_service_type_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    is_operational = serializers.BooleanField(read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = IntegrationService
        fields = [
            'id',
            'service_type',
            'service_type_display',
            'name',
            'description',
            'base_url',
            'api_version',
            'status',
            'status_display',
            'requires_auth',
            'auth_type',
            'rate_limit',
            'timeout_seconds',
            'retry_attempts',
            'cache_ttl_seconds',
            'config',
            'is_enabled',
            'is_operational',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_name',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
        extra_kwargs = {
            'credentials': {'write_only': True},  # Nunca expor credenciais
        }

    def get_created_by_name(self, obj):
        """Retorna nome do criador"""
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return None


class IntegrationServiceListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de serviços"""

    service_type_display = serializers.CharField(
        source='get_service_type_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    is_operational = serializers.BooleanField(read_only=True)

    class Meta:
        model = IntegrationService
        fields = [
            'id',
            'service_type',
            'service_type_display',
            'name',
            'description',
            'status',
            'status_display',
            'is_enabled',
            'is_operational',
            'rate_limit',
            'cache_ttl_seconds',
        ]


class IntegrationRequestSerializer(serializers.ModelSerializer):
    """Serializer para IntegrationRequest"""

    service_name = serializers.CharField(source='service.name', read_only=True)
    service_type = serializers.CharField(source='service.service_type', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    user_name = serializers.SerializerMethodField()
    organization_name = serializers.CharField(
        source='organization.name',
        read_only=True
    )
    is_successful = serializers.BooleanField(read_only=True)
    duration_seconds = serializers.FloatField(read_only=True)

    class Meta:
        model = IntegrationRequest
        fields = [
            'id',
            'service',
            'service_name',
            'service_type',
            'user',
            'user_name',
            'organization',
            'organization_name',
            'request_identifier',
            'request_type',
            'request_params',
            'status',
            'status_display',
            'response_data',
            'response_code',
            'error_message',
            'execution_time_ms',
            'duration_seconds',
            'retry_count',
            'from_cache',
            'is_successful',
            'ip_address',
            'user_agent',
            'created_at',
            'completed_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'completed_at',
            'response_data',
            'response_code',
            'error_message',
            'execution_time_ms',
            'retry_count',
            'from_cache',
        ]

    def get_user_name(self, obj):
        """Retorna nome do usuário"""
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return None


class IntegrationRequestListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de requisições"""

    service_name = serializers.CharField(source='service.name', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    is_successful = serializers.BooleanField(read_only=True)

    class Meta:
        model = IntegrationRequest
        fields = [
            'id',
            'service_name',
            'request_identifier',
            'request_type',
            'status',
            'status_display',
            'is_successful',
            'execution_time_ms',
            'from_cache',
            'created_at',
            'completed_at',
        ]


class IntegrationCacheSerializer(serializers.ModelSerializer):
    """Serializer para IntegrationCache"""

    service_name = serializers.CharField(source='service.name', read_only=True)
    service_type = serializers.CharField(source='service.service_type', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = IntegrationCache
        fields = [
            'id',
            'service',
            'service_name',
            'service_type',
            'cache_key',
            'identifier',
            'request_type',
            'cached_data',
            'hits',
            'is_expired',
            'is_valid',
            'created_at',
            'expires_at',
            'last_accessed_at',
        ]
        read_only_fields = [
            'id',
            'cache_key',
            'hits',
            'created_at',
            'last_accessed_at',
        ]


class IntegrationCacheListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de cache"""

    service_name = serializers.CharField(source='service.name', read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = IntegrationCache
        fields = [
            'id',
            'service_name',
            'identifier',
            'request_type',
            'hits',
            'is_valid',
            'created_at',
            'expires_at',
        ]


# Serializers para execução de integrações

class IntegrationExecuteSerializer(serializers.Serializer):
    """Serializer para executar uma integração"""

    service_type = serializers.ChoiceField(
        choices=IntegrationService.ServiceType.choices,
        help_text="Tipo do serviço de integração"
    )
    identifier = serializers.CharField(
        max_length=200,
        help_text="Identificador (CPF, CNPJ, etc)"
    )
    request_type = serializers.CharField(
        max_length=100,
        help_text="Tipo de requisição (validate_cpf, get_company_data, etc)"
    )
    params = serializers.JSONField(
        required=False,
        default=dict,
        help_text="Parâmetros adicionais (JSON)"
    )
    force_refresh = serializers.BooleanField(
        required=False,
        default=False,
        help_text="Forçar atualização ignorando cache"
    )


class IntegrationExecuteResponseSerializer(serializers.Serializer):
    """Serializer para resposta da execução de integração"""

    success = serializers.BooleanField()
    data = serializers.JSONField()
    request_id = serializers.UUIDField()
    from_cache = serializers.BooleanField()
    execution_time_ms = serializers.IntegerField()
    message = serializers.CharField(required=False)


# Serializers específicos para cada tipo de integração

class CPFValidationSerializer(serializers.Serializer):
    """Serializer para validação de CPF"""

    cpf = serializers.CharField(
        max_length=14,
        help_text="CPF no formato 000.000.000-00 ou 00000000000"
    )


class CNPJValidationSerializer(serializers.Serializer):
    """Serializer para validação de CNPJ"""

    cnpj = serializers.CharField(
        max_length=18,
        help_text="CNPJ no formato 00.000.000/0000-00 ou 00000000000000"
    )


class CreditCheckSerializer(serializers.Serializer):
    """Serializer para consulta de crédito SERASA"""

    cpf = serializers.CharField(max_length=14)
    include_score = serializers.BooleanField(default=True)
    include_protests = serializers.BooleanField(default=True)
    include_debts = serializers.BooleanField(default=True)


class GovBrAuthSerializer(serializers.Serializer):
    """Serializer para autenticação Gov.br"""

    authorization_code = serializers.CharField(
        help_text="Código de autorização OAuth2"
    )
    redirect_uri = serializers.URLField(
        help_text="URI de redirecionamento"
    )
