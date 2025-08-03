from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import (
    ReportTemplate, Report, ReportSchedule, 
    ReportShare, ReportMetric
)


class ReportTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer para templates de relatórios
    """
    
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    is_active_status = serializers.BooleanField(source='is_active', read_only=True)
    reports_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportTemplate
        fields = [
            'id', 'name', 'description', 'category', 'category_display',
            'type', 'type_display', 'status', 'status_display',
            'query_config', 'display_config', 'filter_config', 'export_config',
            'is_public', 'allowed_roles', 'organization', 'created_by',
            'created_by_name', 'is_active_status', 'reports_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization', 'created_by']
    
    def get_reports_count(self, obj):
        """Retorna o número de relatórios gerados a partir deste template"""
        return obj.reports.count()
    
    def validate_query_config(self, value):
        """Valida a configuração da consulta"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Configuração da consulta deve ser um objeto JSON válido")
        
        # Validações básicas da estrutura
        required_fields = ['model', 'fields']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Campo '{field}' é obrigatório na configuração da consulta")
        
        return value
    
    def validate_display_config(self, value):
        """Valida a configuração de exibição"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Configuração de exibição deve ser um objeto JSON válido")
        
        return value
    
    def validate_allowed_roles(self, value):
        """Valida as roles permitidas"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Roles permitidas devem ser uma lista")
        
        return value


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer para relatórios gerados
    """
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    format_display = serializers.CharField(source='get_format_display', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.name', read_only=True)
    file_url = serializers.CharField(source='get_file_url', read_only=True)
    is_completed_status = serializers.BooleanField(source='is_completed', read_only=True)
    is_expired_status = serializers.BooleanField(source='is_expired', read_only=True)
    file_size_mb = serializers.SerializerMethodField()
    generation_time_seconds = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'title', 'description', 'status', 'status_display',
            'format', 'format_display', 'filters_applied', 'parameters',
            'data', 'metadata', 'file_path', 'file_url', 'file_size',
            'file_size_mb', 'scheduled_at', 'expires_at', 'error_message',
            'generation_time', 'generation_time_seconds', 'template',
            'template_name', 'organization', 'generated_by', 'generated_by_name',
            'is_completed_status', 'is_expired_status', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'data', 'metadata', 'file_path', 'file_size',
            'error_message', 'generation_time', 'organization', 'generated_by',
            'created_at', 'updated_at'
        ]
    
    def get_file_size_mb(self, obj):
        """Retorna o tamanho do arquivo em MB"""
        if obj.file_size:
            return round(obj.file_size / (1024 * 1024), 2)
        return None
    
    def get_generation_time_seconds(self, obj):
        """Retorna o tempo de geração em segundos"""
        if obj.generation_time:
            return obj.generation_time.total_seconds()
        return None
    
    def validate_filters_applied(self, value):
        """Valida os filtros aplicados"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Filtros aplicados devem ser um objeto JSON válido")
        
        return value
    
    def validate_parameters(self, value):
        """Valida os parâmetros do relatório"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Parâmetros devem ser um objeto JSON válido")
        
        return value


class ReportScheduleSerializer(serializers.ModelSerializer):
    """
    Serializer para agendamentos de relatórios
    """
    
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    is_active_status = serializers.BooleanField(source='is_active', read_only=True)
    next_run_in_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportSchedule
        fields = [
            'id', 'name', 'description', 'status', 'status_display',
            'frequency', 'frequency_display', 'cron_expression',
            'next_run', 'next_run_in_hours', 'last_run', 'default_format',
            'default_filters', 'notify_on_completion', 'notify_on_error',
            'notification_emails', 'template', 'template_name',
            'organization', 'created_by', 'created_by_name',
            'is_active_status', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'last_run', 'organization', 'created_by',
            'created_at', 'updated_at'
        ]
    
    def get_next_run_in_hours(self, obj):
        """Retorna quantas horas faltam para a próxima execução"""
        if obj.next_run:
            delta = obj.next_run - timezone.now()
            return round(delta.total_seconds() / 3600, 1)
        return None
    
    def validate_notification_emails(self, value):
        """Valida a lista de emails de notificação"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Emails de notificação devem ser uma lista")
        
        # Valida formato dos emails
        from django.core.validators import EmailValidator
        email_validator = EmailValidator()
        
        for email in value:
            try:
                email_validator(email)
            except serializers.ValidationError:
                raise serializers.ValidationError(f"Email inválido: {email}")
        
        return value

    def validate_default_filters(self, value):
        """Valida os filtros padrão"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Filtros padrão devem ser um objeto JSON válido")

        return value

    def validate_next_run(self, value):
        """Garante que a próxima execução não esteja no passado"""
        if value and value < timezone.now():
            raise serializers.ValidationError(
                "Próxima execução deve ser uma data futura"
            )
        return value

    def validate_cron_expression(self, value):
        """Valida a expressão cron (básica)"""
        if self.initial_data.get('frequency') == 'custom':
            if not value or not value.strip():
                raise serializers.ValidationError(
                    "Expressão cron é obrigatória para frequência personalizada"
                )
            parts = value.strip().split()
            if len(parts) != 5:
                raise serializers.ValidationError(
                    "Expressão cron deve ter 5 campos (minuto hora dia mês dia_semana)"
                )

        return value


class ReportShareSerializer(serializers.ModelSerializer):
    """
    Serializer para compartilhamentos de relatórios
    """
    
    access_type_display = serializers.CharField(source='get_access_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    report_title = serializers.CharField(source='report.title', read_only=True)
    shared_by_name = serializers.CharField(source='shared_by.name', read_only=True)
    is_active_status = serializers.BooleanField(source='is_active', read_only=True)
    is_expired_status = serializers.BooleanField(source='is_expired', read_only=True)
    shared_with_names = serializers.SerializerMethodField()
    share_url = serializers.SerializerMethodField()
    expires_in_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportShare
        fields = [
            'id', 'share_token', 'access_type', 'access_type_display',
            'status', 'status_display', 'is_public', 'password_protected',
            'access_password', 'expires_at', 'expires_in_hours',
            'max_access_count', 'access_count', 'report', 'report_title',
            'shared_by', 'shared_by_name', 'shared_with', 'shared_with_names',
            'is_active_status', 'is_expired_status', 'share_url',
            'created_at', 'updated_at', 'last_accessed_at'
        ]
        read_only_fields = [
            'id', 'share_token', 'access_count', 'shared_by',
            'last_accessed_at', 'created_at', 'updated_at'
        ]
    
    def get_shared_with_names(self, obj):
        """Retorna os nomes dos usuários com quem foi compartilhado"""
        return [user.name for user in obj.shared_with.all()]
    
    def get_share_url(self, obj):
        """Retorna a URL de compartilhamento"""
        return f"/reports/shared/{obj.share_token}/"
    
    def get_expires_in_hours(self, obj):
        """Retorna quantas horas faltam para expirar"""
        if obj.expires_at:
            delta = obj.expires_at - timezone.now()
            if delta.total_seconds() > 0:
                return round(delta.total_seconds() / 3600, 1)
            return 0
        return None
    
    def validate_expires_at(self, value):
        """Valida a data de expiração"""
        if value and value <= timezone.now():
            raise serializers.ValidationError("Data de expiração deve ser no futuro")
        
        return value
    
    def validate_max_access_count(self, value):
        """Valida o número máximo de acessos"""
        if value is not None and value <= 0:
            raise serializers.ValidationError("Número máximo de acessos deve ser maior que zero")
        
        return value


class ReportMetricSerializer(serializers.ModelSerializer):
    """
    Serializer para métricas de relatórios
    """
    
    metric_type_display = serializers.CharField(source='get_metric_type_display', read_only=True)
    report_template_name = serializers.CharField(source='report_template.name', read_only=True)
    report_title = serializers.CharField(source='report.title', read_only=True)
    period_duration_days = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportMetric
        fields = [
            'id', 'metric_type', 'metric_type_display', 'metric_name',
            'metric_value', 'metric_unit', 'metadata', 'period_start',
            'period_end', 'period_duration_days', 'report_template',
            'report_template_name', 'report', 'report_title',
            'organization', 'created_at'
        ]
        read_only_fields = ['id', 'organization', 'created_at']
    
    def get_period_duration_days(self, obj):
        """Retorna a duração do período em dias"""
        if obj.period_start and obj.period_end:
            delta = obj.period_end - obj.period_start
            return delta.days
        return None
    
    def validate_period_dates(self, attrs):
        """Valida as datas do período"""
        period_start = attrs.get('period_start')
        period_end = attrs.get('period_end')
        
        if period_start and period_end:
            if period_start >= period_end:
                raise serializers.ValidationError("Data de início deve ser anterior à data de fim")
        
        return attrs
    
    def validate_metric_value(self, value):
        """Valida o valor da métrica"""
        if value < 0:
            raise serializers.ValidationError("Valor da métrica não pode ser negativo")
        
        return value


# Serializers específicos para dashboards e relatórios

class DashboardMetricsSerializer(serializers.Serializer):
    """
    Serializer para métricas do dashboard
    """
    
    total_reports = serializers.IntegerField(read_only=True)
    reports_this_month = serializers.IntegerField(read_only=True)
    active_templates = serializers.IntegerField(read_only=True)
    active_schedules = serializers.IntegerField(read_only=True)
    avg_generation_time = serializers.FloatField(read_only=True)
    most_used_template = serializers.CharField(read_only=True)
    reports_by_status = serializers.DictField(read_only=True)
    reports_by_format = serializers.DictField(read_only=True)
    monthly_trend = serializers.ListField(read_only=True)
    error_rate = serializers.FloatField(read_only=True)


class ReportGenerationRequestSerializer(serializers.Serializer):
    """
    Serializer para solicitações de geração de relatório
    """
    
    template_id = serializers.UUIDField(required=True)
    title = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=False, allow_blank=True)
    format = serializers.ChoiceField(
        choices=Report.FORMAT_CHOICES,
        default='html'
    )
    filters = serializers.JSONField(default=dict)
    parameters = serializers.JSONField(default=dict)
    expires_in_days = serializers.IntegerField(default=30, min_value=1, max_value=365)
    
    def validate_template_id(self, value):
        """Valida se o template existe e está ativo"""
        try:
            template = ReportTemplate.objects.get(id=value)
            if not template.is_active():
                raise serializers.ValidationError("Template não está ativo")
            return value
        except ReportTemplate.DoesNotExist:
            raise serializers.ValidationError("Template não encontrado")
    
    def validate_filters(self, value):
        """Valida os filtros"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Filtros devem ser um objeto JSON válido")
        
        return value
    
    def validate_parameters(self, value):
        """Valida os parâmetros"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Parâmetros devem ser um objeto JSON válido")
        
        return value


class ReportExportSerializer(serializers.Serializer):
    """
    Serializer para exportação de relatórios
    """
    
    report_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1,
        max_length=50
    )
    export_format = serializers.ChoiceField(
        choices=[('zip', 'ZIP'), ('tar', 'TAR')],
        default='zip'
    )
    include_metadata = serializers.BooleanField(default=True)
    
    def validate_report_ids(self, value):
        """Valida se os relatórios existem"""
        existing_reports = Report.objects.filter(id__in=value).count()
        if existing_reports != len(value):
            raise serializers.ValidationError("Alguns relatórios não foram encontrados")
        
        return value
