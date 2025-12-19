"""
Django Admin para OrdocIntegrations

Interface administrativa para gerenciar integrações
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone

from .models import IntegrationService, IntegrationRequest, IntegrationCache


@admin.register(IntegrationService)
class IntegrationServiceAdmin(admin.ModelAdmin):
    """Admin para IntegrationService"""

    list_display = [
        'name',
        'service_type',
        'status_badge',
        'is_enabled',
        'rate_limit',
        'cache_ttl_seconds',
        'created_at',
    ]
    list_filter = [
        'service_type',
        'status',
        'is_enabled',
        'requires_auth',
        'created_at',
    ]
    search_fields = [
        'name',
        'description',
        'service_type',
        'base_url',
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'created_by',
    ]
    fieldsets = (
        ('Informações Básicas', {
            'fields': (
                'id',
                'service_type',
                'name',
                'description',
                'status',
                'is_enabled',
            )
        }),
        ('Configuração de API', {
            'fields': (
                'base_url',
                'api_version',
                'requires_auth',
                'auth_type',
            )
        }),
        ('Limites e Performance', {
            'fields': (
                'rate_limit',
                'timeout_seconds',
                'retry_attempts',
                'cache_ttl_seconds',
            )
        }),
        ('Configuração Avançada', {
            'fields': (
                'config',
                'credentials',
            ),
            'classes': ('collapse',)
        }),
        ('Metadados', {
            'fields': (
                'created_at',
                'updated_at',
                'created_by',
            )
        }),
    )

    def status_badge(self, obj):
        """Exibe status com badge colorido"""
        colors = {
            'active': 'green',
            'inactive': 'gray',
            'maintenance': 'orange',
            'deprecated': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def save_model(self, request, obj, form, change):
        """Define created_by ao criar"""
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(IntegrationRequest)
class IntegrationRequestAdmin(admin.ModelAdmin):
    """Admin para IntegrationRequest"""

    list_display = [
        'id_short',
        'service',
        'request_identifier',
        'request_type',
        'status_badge',
        'execution_time_ms',
        'from_cache_icon',
        'created_at',
    ]
    list_filter = [
        'service',
        'status',
        'from_cache',
        'created_at',
        'completed_at',
    ]
    search_fields = [
        'id',
        'request_identifier',
        'request_type',
        'ip_address',
    ]
    readonly_fields = [
        'id',
        'service',
        'user',
        'organization',
        'request_identifier',
        'request_type',
        'request_params',
        'status',
        'response_data',
        'response_code',
        'error_message',
        'execution_time_ms',
        'retry_count',
        'from_cache',
        'ip_address',
        'user_agent',
        'created_at',
        'completed_at',
    ]
    date_hierarchy = 'created_at'

    def id_short(self, obj):
        """Exibe ID abreviado"""
        return str(obj.id)[:8] + '...'
    id_short.short_description = 'ID'

    def status_badge(self, obj):
        """Exibe status com badge colorido"""
        colors = {
            'pending': 'gray',
            'processing': 'blue',
            'success': 'green',
            'failed': 'red',
            'cached': 'purple',
            'timeout': 'orange',
            'rate_limited': 'orange',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def from_cache_icon(self, obj):
        """Ícone indicando se veio do cache"""
        if obj.from_cache:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: gray;">-</span>')
    from_cache_icon.short_description = 'Cache'

    def has_add_permission(self, request):
        """Não permite criar manualmente"""
        return False

    def has_delete_permission(self, request, obj=None):
        """Permite deletar apenas para admins"""
        return request.user.is_superuser


@admin.register(IntegrationCache)
class IntegrationCacheAdmin(admin.ModelAdmin):
    """Admin para IntegrationCache"""

    list_display = [
        'id_short',
        'service',
        'identifier',
        'request_type',
        'hits',
        'is_valid_icon',
        'created_at',
        'expires_at',
    ]
    list_filter = [
        'service',
        'request_type',
        'created_at',
        'expires_at',
    ]
    search_fields = [
        'identifier',
        'cache_key',
    ]
    readonly_fields = [
        'id',
        'service',
        'cache_key',
        'identifier',
        'request_type',
        'cached_data',
        'hits',
        'created_at',
        'expires_at',
        'last_accessed_at',
    ]
    date_hierarchy = 'created_at'

    def id_short(self, obj):
        """Exibe ID abreviado"""
        return str(obj.id)[:8] + '...'
    id_short.short_description = 'ID'

    def is_valid_icon(self, obj):
        """Ícone indicando se o cache é válido"""
        if obj.is_valid:
            return format_html('<span style="color: green;">✓ Válido</span>')
        return format_html('<span style="color: red;">✗ Expirado</span>')
    is_valid_icon.short_description = 'Válido'

    def has_add_permission(self, request):
        """Não permite criar manualmente"""
        return False

    actions = ['clear_expired_cache']

    def clear_expired_cache(self, request, queryset):
        """Action para limpar cache expirado"""
        deleted_count, _ = queryset.filter(
            expires_at__lt=timezone.now()
        ).delete()
        self.message_user(
            request,
            f'{deleted_count} entradas de cache expiradas foram removidas.'
        )
    clear_expired_cache.short_description = 'Remover cache expirado'
