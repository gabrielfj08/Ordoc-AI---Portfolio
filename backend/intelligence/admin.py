"""
Intelligence Admin - Django admin configuration for intelligence models.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    KnowledgeFeedback,
    LearnedPattern,
    PatternFeedbackLink,
    ProactiveAlert,
    DocumentAnalysis
)


@admin.register(KnowledgeFeedback)
class KnowledgeFeedbackAdmin(admin.ModelAdmin):
    """Admin for KnowledgeFeedback model."""
    
    list_display = [
        'id_short', 'action_type', 'document_type', 'layer',
        'user', 'organization', 'processed', 'created_at'
    ]
    list_filter = ['layer', 'action_type', 'processed', 'sector', 'created_at']
    search_fields = ['document_type', 'field_name', 'original_value', 'corrected_value']
    readonly_fields = ['id', 'created_at', 'processed_at']
    date_hierarchy = 'created_at'
    
    fieldsets = [
        ('Identificação', {
            'fields': ['id', 'layer', 'document_type', 'sector', 'field_name']
        }),
        ('Ação', {
            'fields': ['action_type', 'original_value', 'corrected_value']
        }),
        ('Contexto', {
            'fields': ['user', 'organization', 'context']
        }),
        ('Confiança', {
            'fields': ['confidence_before', 'confidence_after']
        }),
        ('Status', {
            'fields': ['processed', 'processed_at', 'created_at']
        }),
    ]
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'


@admin.register(LearnedPattern)
class LearnedPatternAdmin(admin.ModelAdmin):
    """Admin for LearnedPattern model."""
    
    list_display = [
        'id_short', 'pattern_type', 'name', 'layer',
        'confidence_display', 'occurrences', 'is_active', 'last_updated'
    ]
    list_filter = ['layer', 'pattern_type', 'is_active', 'sector']
    search_fields = ['name', 'description', 'pattern_type']
    readonly_fields = ['id', 'created_at', 'last_updated', 'last_matched_at']
    
    fieldsets = [
        ('Identificação', {
            'fields': ['id', 'pattern_type', 'name', 'description', 'layer']
        }),
        ('Definição', {
            'fields': ['condition', 'action']
        }),
        ('Escopo', {
            'fields': ['organization', 'sector', 'document_type']
        }),
        ('Métricas', {
            'fields': ['confidence', 'occurrences', 'is_active']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'last_updated', 'last_matched_at']
        }),
    ]
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def confidence_display(self, obj):
        color = 'green' if obj.confidence >= 0.7 else ('orange' if obj.confidence >= 0.4 else 'red')
        return format_html(
            '<span style="color: {};">{:.0%}</span>',
            color, obj.confidence
        )
    confidence_display.short_description = 'Confiança'


@admin.register(ProactiveAlert)
class ProactiveAlertAdmin(admin.ModelAdmin):
    """Admin for ProactiveAlert model."""
    
    list_display = [
        'id_short', 'severity_badge', 'title', 'alert_type',
        'user_response', 'document_id_short', 'created_at'
    ]
    list_filter = ['severity', 'alert_type', 'user_response', 'created_at']
    search_fields = ['title', 'message']
    readonly_fields = ['id', 'created_at', 'responded_at']
    
    fieldsets = [
        ('Alerta', {
            'fields': ['id', 'alert_type', 'severity', 'title', 'message', 'details']
        }),
        ('Documento', {
            'fields': ['document_id', 'document_type', 'location']
        }),
        ('Ações', {
            'fields': ['suggested_actions', 'source_pattern']
        }),
        ('Resposta', {
            'fields': ['user_response', 'response_data', 'responded_by', 'responded_at']
        }),
        ('Metadados', {
            'fields': ['organization', 'learning_weight', 'created_at', 'expires_at']
        }),
    ]
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def document_id_short(self, obj):
        return str(obj.document_id)[:8]
    document_id_short.short_description = 'Doc ID'
    
    def severity_badge(self, obj):
        colors = {
            'info': '#17a2b8',
            'warning': '#ffc107',
            'error': '#dc3545',
            'critical': '#6f42c1'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 4px;">{}</span>',
            colors.get(obj.severity, '#6c757d'),
            obj.get_severity_display()
        )
    severity_badge.short_description = 'Severidade'


@admin.register(DocumentAnalysis)
class DocumentAnalysisAdmin(admin.ModelAdmin):
    """Admin for DocumentAnalysis model."""
    
    list_display = [
        'id_short', 'document_id_short', 'document_type',
        'status', 'processing_time', 'created_at'
    ]
    list_filter = ['status', 'analysis_depth', 'created_at']
    search_fields = ['document_type']
    readonly_fields = ['id', 'created_at', 'completed_at', 'processing_time_ms']
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def document_id_short(self, obj):
        return str(obj.document_id)[:8]
    document_id_short.short_description = 'Doc ID'
    
    def processing_time(self, obj):
        if obj.processing_time_ms:
            return f"{obj.processing_time_ms:.0f}ms"
        return "-"
    processing_time.short_description = 'Tempo'


@admin.register(PatternFeedbackLink)
class PatternFeedbackLinkAdmin(admin.ModelAdmin):
    """Admin for PatternFeedbackLink model."""
    
    list_display = ['pattern', 'feedback', 'contribution_weight', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['id', 'created_at']
