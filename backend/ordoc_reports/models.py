from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid
import json
from datetime import datetime, timedelta


class ReportTemplate(models.Model):
    """
    Modelo para templates de relatórios
    Define a estrutura e configuração de relatórios reutilizáveis
    """
    
    CATEGORY_CHOICES = [
        ('documents', 'Documentos'),
        ('workflow', 'Workflow'),
        ('users', 'Usuários'),
        ('system', 'Sistema'),
        ('custom', 'Personalizado'),
    ]
    
    TYPE_CHOICES = [
        ('table', 'Tabela'),
        ('chart', 'Gráfico'),
        ('dashboard', 'Dashboard'),
        ('export', 'Exportação'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
        ('draft', 'Rascunho'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    name = models.CharField(max_length=255, verbose_name='Nome do Template')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name='Categoria')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, verbose_name='Tipo')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='Status')
    
    # Configuration
    query_config = models.JSONField(
        default=dict,
        help_text='Configuração da consulta SQL/ORM',
        verbose_name='Configuração da Consulta'
    )
    display_config = models.JSONField(
        default=dict,
        help_text='Configuração de exibição (colunas, gráficos, etc.)',
        verbose_name='Configuração de Exibição'
    )
    filter_config = models.JSONField(
        default=dict,
        help_text='Configuração de filtros disponíveis',
        verbose_name='Configuração de Filtros'
    )
    export_config = models.JSONField(
        default=dict,
        help_text='Configuração de exportação (PDF, Excel, CSV)',
        verbose_name='Configuração de Exportação'
    )
    
    # Permissions and access
    is_public = models.BooleanField(default=False, verbose_name='Público')
    allowed_roles = models.JSONField(
        default=list,
        help_text='Roles permitidas para acessar este template',
        verbose_name='Roles Permitidas'
    )
    
    # Relations
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='report_templates',
        verbose_name='Organização'
    )
    
    created_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='created_report_templates',
        verbose_name='Criado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_reports_templates'
        verbose_name = 'Template de Relatório'
        verbose_name_plural = 'Templates de Relatórios'
        unique_together = ['name', 'organization']
        indexes = [
            models.Index(fields=['organization', 'category']),
            models.Index(fields=['status', 'is_public']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
    
    def is_active(self):
        return self.status == 'active'
    
    def can_user_access(self, user):
        """Verifica se o usuário pode acessar este template"""
        if self.is_public:
            return True
        
        # Verifica se o usuário tem uma das roles permitidas
        user_roles = user.get_organization_roles(self.organization)
        return any(role.name in self.allowed_roles for role in user_roles)


class Report(models.Model):
    """
    Modelo para instâncias de relatórios gerados
    Representa um relatório específico gerado a partir de um template
    """
    
    STATUS_CHOICES = [
        ('generating', 'Gerando'),
        ('completed', 'Concluído'),
        ('failed', 'Falhou'),
        ('scheduled', 'Agendado'),
    ]
    
    FORMAT_CHOICES = [
        ('html', 'HTML'),
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
        ('json', 'JSON'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    title = models.CharField(max_length=255, verbose_name='Título')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='generating', verbose_name='Status')
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='html', verbose_name='Formato')
    
    # Configuration and data
    filters_applied = models.JSONField(
        default=dict,
        help_text='Filtros aplicados na geração do relatório',
        verbose_name='Filtros Aplicados'
    )
    parameters = models.JSONField(
        default=dict,
        help_text='Parâmetros específicos do relatório',
        verbose_name='Parâmetros'
    )
    data = models.JSONField(
        default=dict,
        help_text='Dados do relatório (cache)',
        verbose_name='Dados'
    )
    metadata = models.JSONField(
        default=dict,
        help_text='Metadados do relatório (estatísticas, tempo de geração, etc.)',
        verbose_name='Metadados'
    )
    
    # File storage
    file_path = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        help_text='Caminho do arquivo gerado',
        verbose_name='Caminho do Arquivo'
    )
    file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='Tamanho do Arquivo (bytes)'
    )
    
    # Scheduling
    scheduled_at = models.DateTimeField(null=True, blank=True, verbose_name='Agendado para')
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Expira em')
    
    # Error handling
    error_message = models.TextField(blank=True, null=True, verbose_name='Mensagem de Erro')
    generation_time = models.DurationField(null=True, blank=True, verbose_name='Tempo de Geração')
    
    # Relations
    template = models.ForeignKey(
        ReportTemplate,
        on_delete=models.CASCADE,
        related_name='reports',
        verbose_name='Template'
    )
    
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='reports',
        verbose_name='Organização'
    )
    
    generated_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='generated_reports',
        verbose_name='Gerado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_reports_reports'
        verbose_name = 'Relatório'
        verbose_name_plural = 'Relatórios'
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['template', 'status']),
            models.Index(fields=['generated_by']),
            models.Index(fields=['created_at']),
            models.Index(fields=['scheduled_at']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
    
    def is_completed(self):
        return self.status == 'completed'
    
    def is_expired(self):
        return self.expires_at and timezone.now() > self.expires_at
    
    def get_file_url(self):
        """Retorna URL do arquivo gerado"""
        if self.file_path:
            return f"/media/reports/{self.file_path}"
        return None
    
    def set_default_expiry(self, days=30):
        """Define expiração padrão do relatório"""
        self.expires_at = timezone.now() + timedelta(days=days)


class ReportSchedule(models.Model):
    """
    Modelo para agendamento de relatórios
    Permite gerar relatórios automaticamente em intervalos regulares
    """
    
    FREQUENCY_CHOICES = [
        ('daily', 'Diário'),
        ('weekly', 'Semanal'),
        ('monthly', 'Mensal'),
        ('quarterly', 'Trimestral'),
        ('yearly', 'Anual'),
        ('custom', 'Personalizado'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
        ('paused', 'Pausado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    name = models.CharField(max_length=255, verbose_name='Nome do Agendamento')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Status')
    
    # Scheduling configuration
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, verbose_name='Frequência')
    cron_expression = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Expressão cron para agendamentos personalizados',
        verbose_name='Expressão Cron'
    )
    
    # Execution times
    next_run = models.DateTimeField(verbose_name='Próxima Execução')
    last_run = models.DateTimeField(null=True, blank=True, verbose_name='Última Execução')
    
    # Configuration
    default_format = models.CharField(
        max_length=20,
        choices=Report.FORMAT_CHOICES,
        default='pdf',
        verbose_name='Formato Padrão'
    )
    default_filters = models.JSONField(
        default=dict,
        help_text='Filtros padrão para aplicar nos relatórios',
        verbose_name='Filtros Padrão'
    )
    
    # Notification settings
    notify_on_completion = models.BooleanField(default=True, verbose_name='Notificar ao Completar')
    notify_on_error = models.BooleanField(default=True, verbose_name='Notificar em Erro')
    notification_emails = models.JSONField(
        default=list,
        help_text='Lista de emails para notificação',
        verbose_name='Emails de Notificação'
    )
    
    # Relations
    template = models.ForeignKey(
        ReportTemplate,
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name='Template'
    )
    
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='report_schedules',
        verbose_name='Organização'
    )
    
    created_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='created_report_schedules',
        verbose_name='Criado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_reports_schedules'
        verbose_name = 'Agendamento de Relatório'
        verbose_name_plural = 'Agendamentos de Relatórios'
        unique_together = ['name', 'organization']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['next_run', 'status']),
            models.Index(fields=['template']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_frequency_display()})"
    
    def is_active(self):
        return self.status == 'active'
    
    def calculate_next_run(self):
        """Calcula a próxima execução baseada na frequência"""
        now = timezone.now()
        
        if self.frequency == 'daily':
            self.next_run = now + timedelta(days=1)
        elif self.frequency == 'weekly':
            self.next_run = now + timedelta(weeks=1)
        elif self.frequency == 'monthly':
            self.next_run = now + timedelta(days=30)  # Aproximado
        elif self.frequency == 'quarterly':
            self.next_run = now + timedelta(days=90)  # Aproximado
        elif self.frequency == 'yearly':
            self.next_run = now + timedelta(days=365)  # Aproximado
        # Para 'custom', usa a cron_expression (implementar com django-crontab ou similar)
        
        self.save()


class ReportShare(models.Model):
    """
    Modelo para compartilhamento de relatórios
    Permite compartilhar relatórios com usuários específicos ou via link público
    """
    
    ACCESS_TYPE_CHOICES = [
        ('view', 'Visualizar'),
        ('download', 'Baixar'),
        ('full', 'Acesso Completo'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('expired', 'Expirado'),
        ('revoked', 'Revogado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Share configuration
    share_token = models.CharField(
        max_length=64,
        unique=True,
        help_text='Token único para acesso ao relatório',
        verbose_name='Token de Compartilhamento'
    )
    access_type = models.CharField(
        max_length=20,
        choices=ACCESS_TYPE_CHOICES,
        default='view',
        verbose_name='Tipo de Acesso'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Status'
    )
    
    # Access control
    is_public = models.BooleanField(
        default=False,
        help_text='Se verdadeiro, qualquer pessoa com o link pode acessar',
        verbose_name='Público'
    )
    password_protected = models.BooleanField(default=False, verbose_name='Protegido por Senha')
    access_password = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='Senha de Acesso'
    )
    
    # Expiration
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Expira em')
    max_access_count = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Número máximo de acessos permitidos',
        verbose_name='Máximo de Acessos'
    )
    access_count = models.PositiveIntegerField(default=0, verbose_name='Contagem de Acessos')
    
    # Relations
    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='shares',
        verbose_name='Relatório'
    )
    
    shared_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='shared_reports',
        verbose_name='Compartilhado por'
    )
    
    shared_with = models.ManyToManyField(
        'ordoc_cloud.OrdocUser',
        blank=True,
        related_name='received_report_shares',
        verbose_name='Compartilhado com'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True, verbose_name='Último Acesso')
    
    class Meta:
        db_table = 'ordoc_reports_shares'
        verbose_name = 'Compartilhamento de Relatório'
        verbose_name_plural = 'Compartilhamentos de Relatórios'
        indexes = [
            models.Index(fields=['share_token']),
            models.Index(fields=['status', 'expires_at']),
            models.Index(fields=['report']),
        ]
    
    def __str__(self):
        return f"Compartilhamento: {self.report.title}"
    
    def is_active(self):
        return self.status == 'active'
    
    def is_expired(self):
        if self.expires_at and timezone.now() > self.expires_at:
            return True
        if self.max_access_count and self.access_count >= self.max_access_count:
            return True
        return False
    
    def can_access(self, user=None, password=None):
        """Verifica se o acesso é permitido"""
        if not self.is_active() or self.is_expired():
            return False
        
        if self.password_protected and password != self.access_password:
            return False
        
        if not self.is_public and user:
            return self.shared_with.filter(id=user.id).exists()
        
        return True
    
    def record_access(self):
        """Registra um acesso ao compartilhamento"""
        self.access_count += 1
        self.last_accessed_at = timezone.now()
        
        if self.is_expired():
            self.status = 'expired'
        
        self.save()
    
    def save(self, *args, **kwargs):
        if not self.share_token:
            import secrets
            self.share_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)


class ReportMetric(models.Model):
    """
    Modelo para métricas e KPIs dos relatórios
    Armazena estatísticas de uso e performance dos relatórios
    """
    
    METRIC_TYPE_CHOICES = [
        ('generation_time', 'Tempo de Geração'),
        ('access_count', 'Contagem de Acessos'),
        ('download_count', 'Contagem de Downloads'),
        ('error_rate', 'Taxa de Erro'),
        ('user_satisfaction', 'Satisfação do Usuário'),
        ('custom', 'Personalizado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Metric info
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPE_CHOICES, verbose_name='Tipo de Métrica')
    metric_name = models.CharField(max_length=255, verbose_name='Nome da Métrica')
    metric_value = models.FloatField(verbose_name='Valor da Métrica')
    metric_unit = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Unidade da métrica (segundos, %, etc.)',
        verbose_name='Unidade'
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        help_text='Metadados adicionais da métrica',
        verbose_name='Metadados'
    )
    
    # Time period
    period_start = models.DateTimeField(verbose_name='Início do Período')
    period_end = models.DateTimeField(verbose_name='Fim do Período')
    
    # Relations
    report_template = models.ForeignKey(
        ReportTemplate,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='metrics',
        verbose_name='Template de Relatório'
    )
    
    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='metrics',
        verbose_name='Relatório'
    )
    
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='report_metrics',
        verbose_name='Organização'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ordoc_reports_metrics'
        verbose_name = 'Métrica de Relatório'
        verbose_name_plural = 'Métricas de Relatórios'
        indexes = [
            models.Index(fields=['organization', 'metric_type']),
            models.Index(fields=['report_template', 'metric_type']),
            models.Index(fields=['period_start', 'period_end']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.metric_name}: {self.metric_value} {self.metric_unit or ''}"
    
    @classmethod
    def calculate_average(cls, organization, metric_type, days=30):
        """Calcula a média de uma métrica nos últimos N dias"""
        from django.db.models import Avg
        from django.utils import timezone
        
        start_date = timezone.now() - timedelta(days=days)
        
        return cls.objects.filter(
            organization=organization,
            metric_type=metric_type,
            created_at__gte=start_date
        ).aggregate(avg_value=Avg('metric_value'))['avg_value'] or 0
    
    @classmethod
    def get_trend(cls, organization, metric_type, days=30):
        """Obtém a tendência de uma métrica"""
        from django.db.models import Avg
        from django.utils import timezone
        
        now = timezone.now()
        current_period = now - timedelta(days=days)
        previous_period = current_period - timedelta(days=days)
        
        current_avg = cls.objects.filter(
            organization=organization,
            metric_type=metric_type,
            created_at__gte=current_period
        ).aggregate(avg_value=Avg('metric_value'))['avg_value'] or 0
        
        previous_avg = cls.objects.filter(
            organization=organization,
            metric_type=metric_type,
            created_at__gte=previous_period,
            created_at__lt=current_period
        ).aggregate(avg_value=Avg('metric_value'))['avg_value'] or 0
        
        if previous_avg > 0:
            trend = ((current_avg - previous_avg) / previous_avg) * 100
        else:
            trend = 0
        
        return {
            'current': current_avg,
            'previous': previous_avg,
            'trend_percentage': trend,
            'trend_direction': 'up' if trend > 0 else 'down' if trend < 0 else 'stable'
        }
