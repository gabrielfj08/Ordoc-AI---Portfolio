"""
Models para o sistema de integrações externas do OrdocAI

Camada de dados para gerenciar integrações com serviços brasileiros
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
import uuid

User = get_user_model()


class IntegrationService(models.Model):
    """
    Registro de serviços de integração disponíveis

    Representa cada serviço externo que pode ser integrado (Gov.br, Receita Federal, etc)
    """

    class ServiceType(models.TextChoices):
        GOVBR = 'govbr', _('Gov.br - Login Único')
        RECEITA_FEDERAL = 'receita_federal', _('Receita Federal')
        SERASA = 'serasa', _('SERASA Experian')
        CARTORIO = 'cartorio', _('Cartórios (CRI/CNJ)')
        DETRAN = 'detran', _('DETRAN')
        TSE = 'tse', _('TSE - Tribunal Superior Eleitoral')
        INSS = 'inss', _('INSS - Previdência')
        ANS = 'ans', _('ANS - Saúde Suplementar')
        CVM = 'cvm', _('CVM - Mercado Financeiro')
        OAB = 'oab', _('OAB - Ordem dos Advogados')
        CRM = 'crm', _('CRM - Conselho Regional de Medicina')
        CRO = 'cro', _('CRO - Conselho Regional de Odontologia')
        CREA = 'crea', _('CREA - Conselho Regional de Engenharia')
        PIX = 'pix', _('PIX - Banco Central')
        NFE = 'nfe', _('NFe/NFSe - Notas Fiscais')
        ESOCIAL = 'esocial', _('eSocial - Eventos Trabalhistas')
        CAGED = 'caged', _('CAGED - Declarações Trabalhistas')
        SINTEGRA = 'sintegra', _('SINTEGRA - Integração Fiscal')
        JUCESP = 'jucesp', _('JUCESP - Junta Comercial')
        CUSTOM = 'custom', _('Integração Customizada')

    class ServiceStatus(models.TextChoices):
        ACTIVE = 'active', _('Ativo')
        INACTIVE = 'inactive', _('Inativo')
        MAINTENANCE = 'maintenance', _('Em Manutenção')
        DEPRECATED = 'deprecated', _('Descontinuado')

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_('ID')
    )

    service_type = models.CharField(
        max_length=50,
        choices=ServiceType.choices,
        unique=True,
        verbose_name=_('Tipo de Serviço'),
        help_text=_('Identificador único do serviço de integração')
    )

    name = models.CharField(
        max_length=200,
        verbose_name=_('Nome do Serviço'),
        help_text=_('Nome legível do serviço')
    )

    description = models.TextField(
        blank=True,
        verbose_name=_('Descrição'),
        help_text=_('Descrição detalhada do que o serviço faz')
    )

    base_url = models.URLField(
        max_length=500,
        verbose_name=_('URL Base'),
        help_text=_('URL base da API do serviço')
    )

    api_version = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_('Versão da API'),
        help_text=_('Versão da API utilizada')
    )

    status = models.CharField(
        max_length=20,
        choices=ServiceStatus.choices,
        default=ServiceStatus.ACTIVE,
        verbose_name=_('Status'),
        db_index=True
    )

    requires_auth = models.BooleanField(
        default=True,
        verbose_name=_('Requer Autenticação'),
        help_text=_('Indica se o serviço requer autenticação')
    )

    auth_type = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_('Tipo de Autenticação'),
        help_text=_('OAuth2, API Key, JWT, etc')
    )

    rate_limit = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(10000)],
        verbose_name=_('Limite de Taxa'),
        help_text=_('Requisições por minuto permitidas')
    )

    timeout_seconds = models.IntegerField(
        default=30,
        validators=[MinValueValidator(1), MaxValueValidator(300)],
        verbose_name=_('Timeout (segundos)'),
        help_text=_('Tempo máximo de espera por resposta')
    )

    retry_attempts = models.IntegerField(
        default=3,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name=_('Tentativas de Retry'),
        help_text=_('Número de tentativas em caso de falha')
    )

    cache_ttl_seconds = models.IntegerField(
        default=3600,
        validators=[MinValueValidator(0), MaxValueValidator(86400)],
        verbose_name=_('TTL do Cache (segundos)'),
        help_text=_('Tempo de vida do cache em segundos (0 = sem cache)')
    )

    config = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('Configuração'),
        help_text=_('Configurações específicas do serviço (JSON)')
    )

    credentials = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('Credenciais'),
        help_text=_('Credenciais de acesso (API keys, secrets, etc) - CRIPTOGRAFADO')
    )

    is_enabled = models.BooleanField(
        default=True,
        verbose_name=_('Habilitado'),
        db_index=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Criado em')
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Atualizado em')
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_integrations',
        verbose_name=_('Criado por')
    )

    class Meta:
        db_table = 'ordoc_integration_services'
        verbose_name = _('Serviço de Integração')
        verbose_name_plural = _('Serviços de Integração')
        ordering = ['name']
        indexes = [
            models.Index(fields=['service_type'], name='idx_service_type'),
            models.Index(fields=['status', 'is_enabled'], name='idx_service_status'),
            models.Index(fields=['created_at'], name='idx_service_created'),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_service_type_display()})"

    @property
    def is_operational(self):
        """Verifica se o serviço está operacional"""
        return self.status == self.ServiceStatus.ACTIVE and self.is_enabled

    def get_cache_key(self, identifier: str) -> str:
        """Gera chave de cache para este serviço"""
        return f"integration:{self.service_type}:{identifier}"


class IntegrationRequest(models.Model):
    """
    Registro de requisições feitas aos serviços de integração

    Armazena histórico e auditoria de todas as chamadas às APIs externas
    """

    class RequestStatus(models.TextChoices):
        PENDING = 'pending', _('Pendente')
        PROCESSING = 'processing', _('Processando')
        SUCCESS = 'success', _('Sucesso')
        FAILED = 'failed', _('Falhou')
        CACHED = 'cached', _('Cache')
        TIMEOUT = 'timeout', _('Timeout')
        RATE_LIMITED = 'rate_limited', _('Rate Limit')

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_('ID')
    )

    service = models.ForeignKey(
        IntegrationService,
        on_delete=models.CASCADE,
        related_name='requests',
        verbose_name=_('Serviço')
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='integration_requests',
        verbose_name=_('Usuário')
    )

    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='integration_requests',
        verbose_name=_('Organização')
    )

    request_identifier = models.CharField(
        max_length=200,
        verbose_name=_('Identificador'),
        help_text=_('CPF, CNPJ, ou outro identificador único da requisição'),
        db_index=True
    )

    request_type = models.CharField(
        max_length=100,
        verbose_name=_('Tipo de Requisição'),
        help_text=_('validate_cpf, get_company_data, etc'),
        db_index=True
    )

    request_params = models.JSONField(
        default=dict,
        verbose_name=_('Parâmetros da Requisição'),
        help_text=_('Parâmetros enviados na requisição')
    )

    status = models.CharField(
        max_length=20,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING,
        verbose_name=_('Status'),
        db_index=True
    )

    response_data = models.JSONField(
        null=True,
        blank=True,
        verbose_name=_('Dados da Resposta'),
        help_text=_('Dados retornados pela API')
    )

    response_code = models.IntegerField(
        null=True,
        blank=True,
        verbose_name=_('Código HTTP'),
        help_text=_('Código de status HTTP da resposta')
    )

    error_message = models.TextField(
        blank=True,
        verbose_name=_('Mensagem de Erro'),
        help_text=_('Mensagem de erro caso a requisição falhe')
    )

    execution_time_ms = models.IntegerField(
        null=True,
        blank=True,
        verbose_name=_('Tempo de Execução (ms)'),
        help_text=_('Tempo de execução em milissegundos')
    )

    retry_count = models.IntegerField(
        default=0,
        verbose_name=_('Tentativas de Retry')
    )

    from_cache = models.BooleanField(
        default=False,
        verbose_name=_('Do Cache'),
        help_text=_('Indica se a resposta veio do cache')
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name=_('Endereço IP')
    )

    user_agent = models.TextField(
        blank=True,
        verbose_name=_('User Agent')
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Criado em'),
        db_index=True
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Completado em')
    )

    class Meta:
        db_table = 'ordoc_integration_requests'
        verbose_name = _('Requisição de Integração')
        verbose_name_plural = _('Requisições de Integração')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['service', 'status'], name='idx_request_service_status'),
            models.Index(fields=['organization', 'created_at'], name='idx_request_org_created'),
            models.Index(fields=['request_identifier', 'request_type'], name='idx_request_id_type'),
            models.Index(fields=['user', 'created_at'], name='idx_request_user_created'),
        ]

    def __str__(self):
        return f"{self.service.name} - {self.request_type} ({self.status})"

    @property
    def is_successful(self):
        """Verifica se a requisição foi bem-sucedida"""
        return self.status in [self.RequestStatus.SUCCESS, self.RequestStatus.CACHED]

    @property
    def duration_seconds(self):
        """Retorna duração em segundos"""
        if self.execution_time_ms:
            return self.execution_time_ms / 1000
        return None


class IntegrationCache(models.Model):
    """
    Cache de respostas de integrações

    Armazena respostas em cache para melhorar performance e reduzir custos
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_('ID')
    )

    service = models.ForeignKey(
        IntegrationService,
        on_delete=models.CASCADE,
        related_name='cache_entries',
        verbose_name=_('Serviço')
    )

    cache_key = models.CharField(
        max_length=500,
        unique=True,
        verbose_name=_('Chave do Cache'),
        db_index=True
    )

    identifier = models.CharField(
        max_length=200,
        verbose_name=_('Identificador'),
        help_text=_('CPF, CNPJ, ou outro identificador'),
        db_index=True
    )

    request_type = models.CharField(
        max_length=100,
        verbose_name=_('Tipo de Requisição'),
        db_index=True
    )

    cached_data = models.JSONField(
        verbose_name=_('Dados em Cache'),
        help_text=_('Dados da resposta armazenados em cache')
    )

    hits = models.IntegerField(
        default=0,
        verbose_name=_('Hits'),
        help_text=_('Número de vezes que este cache foi utilizado')
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Criado em'),
        db_index=True
    )

    expires_at = models.DateTimeField(
        verbose_name=_('Expira em'),
        db_index=True
    )

    last_accessed_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Último Acesso')
    )

    class Meta:
        db_table = 'ordoc_integration_cache'
        verbose_name = _('Cache de Integração')
        verbose_name_plural = _('Caches de Integração')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['service', 'identifier'], name='idx_cache_service_id'),
            models.Index(fields=['expires_at'], name='idx_cache_expires'),
            models.Index(fields=['cache_key'], name='idx_cache_key'),
        ]

    def __str__(self):
        return f"Cache: {self.service.name} - {self.identifier}"

    @property
    def is_expired(self):
        """Verifica se o cache está expirado"""
        from django.utils import timezone
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        """Verifica se o cache ainda é válido"""
        return not self.is_expired

    def increment_hits(self):
        """Incrementa contador de hits"""
        self.hits += 1
        self.save(update_fields=['hits', 'last_accessed_at'])
