import django_filters
from django.db import models
from django.utils import timezone
from datetime import timedelta

from .models import (
    DigitalCertificate, SignatureTemplate, SignatureRequest,
    SignatureRequestSigner, DocumentSignature, SignatureAuditLog,
    SignatureBatch
)


class DigitalCertificateFilter(django_filters.FilterSet):
    """Filtros para certificados digitais"""
    
    certificate_type = django_filters.ChoiceFilter(choices=DigitalCertificate.CERTIFICATE_TYPES)
    status = django_filters.ChoiceFilter(choices=DigitalCertificate.STATUS_CHOICES)
    is_default = django_filters.BooleanFilter()
    is_expired = django_filters.BooleanFilter(method='filter_is_expired')
    expires_in_days = django_filters.NumberFilter(method='filter_expires_in_days')
    
    # Filtros de data
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    valid_from_after = django_filters.DateTimeFilter(field_name='valid_from', lookup_expr='gte')
    valid_until_before = django_filters.DateTimeFilter(field_name='valid_until', lookup_expr='lte')
    
    class Meta:
        model = DigitalCertificate
        fields = [
            'certificate_type', 'status', 'is_default', 'user'
        ]
    
    def filter_is_expired(self, queryset, name, value):
        """Filtrar certificados expirados"""
        now = timezone.now()
        if value:
            return queryset.filter(valid_until__lt=now)
        else:
            return queryset.filter(valid_until__gte=now)
    
    def filter_expires_in_days(self, queryset, name, value):
        """Filtrar certificados que expiram em X dias"""
        target_date = timezone.now() + timedelta(days=value)
        return queryset.filter(valid_until__lte=target_date, valid_until__gte=timezone.now())


class SignatureTemplateFilter(django_filters.FilterSet):
    """Filtros para templates de assinatura"""
    
    signature_type = django_filters.ChoiceFilter(choices=SignatureTemplate.SIGNATURE_TYPES)
    hash_algorithm = django_filters.ChoiceFilter(choices=SignatureTemplate.HASH_ALGORITHMS)
    is_active = django_filters.BooleanFilter()
    is_default = django_filters.BooleanFilter()
    require_approval = django_filters.BooleanFilter()
    
    # Filtros de data
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = SignatureTemplate
        fields = [
            'signature_type', 'hash_algorithm', 'is_active', 'is_default',
            'require_approval', 'created_by'
        ]


class SignatureRequestFilter(django_filters.FilterSet):
    """Filtros para solicitações de assinatura"""
    
    status = django_filters.ChoiceFilter(choices=SignatureRequest.STATUS_CHOICES)
    priority = django_filters.ChoiceFilter(choices=SignatureRequest.PRIORITY_CHOICES)
    is_expired = django_filters.BooleanFilter(method='filter_is_expired')
    expires_soon = django_filters.NumberFilter(method='filter_expires_soon')
    
    # Filtros relacionados
    document = django_filters.UUIDFilter()
    template = django_filters.UUIDFilter()
    created_by = django_filters.UUIDFilter()
    
    # Filtros de data
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    expires_after = django_filters.DateTimeFilter(field_name='expires_at', lookup_expr='gte')
    expires_before = django_filters.DateTimeFilter(field_name='expires_at', lookup_expr='lte')
    completed_after = django_filters.DateTimeFilter(field_name='completed_at', lookup_expr='gte')
    completed_before = django_filters.DateTimeFilter(field_name='completed_at', lookup_expr='lte')
    
    # Filtros booleanos
    require_sequential_signing = django_filters.BooleanFilter()
    allow_decline = django_filters.BooleanFilter()
    require_all_signatures = django_filters.BooleanFilter()
    
    class Meta:
        model = SignatureRequest
        fields = [
            'status', 'priority', 'document', 'template', 'created_by',
            'require_sequential_signing', 'allow_decline', 'require_all_signatures'
        ]
    
    def filter_is_expired(self, queryset, name, value):
        """Filtrar solicitações expiradas"""
        now = timezone.now()
        if value:
            return queryset.filter(expires_at__lt=now)
        else:
            return queryset.exclude(expires_at__lt=now)
    
    def filter_expires_soon(self, queryset, name, value):
        """Filtrar solicitações que expiram em X dias"""
        target_date = timezone.now() + timedelta(days=value)
        return queryset.filter(
            expires_at__lte=target_date,
            expires_at__gte=timezone.now()
        )


class SignatureRequestSignerFilter(django_filters.FilterSet):
    """Filtros para assinantes de solicitação"""
    
    status = django_filters.ChoiceFilter(choices=SignatureRequestSigner.STATUS_CHOICES)
    signer_type = django_filters.ChoiceFilter(choices=SignatureRequestSigner.SIGNER_TYPES)
    require_certificate = django_filters.BooleanFilter()
    
    # Filtros relacionados
    signature_request = django_filters.UUIDFilter()
    user = django_filters.UUIDFilter()
    external_requester = django_filters.UUIDFilter()
    
    # Filtros de data
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    notified_after = django_filters.DateTimeFilter(field_name='notified_at', lookup_expr='gte')
    notified_before = django_filters.DateTimeFilter(field_name='notified_at', lookup_expr='lte')
    signed_after = django_filters.DateTimeFilter(field_name='signed_at', lookup_expr='gte')
    signed_before = django_filters.DateTimeFilter(field_name='signed_at', lookup_expr='lte')
    
    # Filtros de ordem
    signing_order = django_filters.NumberFilter()
    signing_order_gte = django_filters.NumberFilter(field_name='signing_order', lookup_expr='gte')
    signing_order_lte = django_filters.NumberFilter(field_name='signing_order', lookup_expr='lte')
    
    class Meta:
        model = SignatureRequestSigner
        fields = [
            'status', 'signer_type', 'require_certificate', 'signature_request',
            'user', 'external_requester', 'signing_order'
        ]


class DocumentSignatureFilter(django_filters.FilterSet):
    """Filtros para assinaturas de documento"""
    
    signature_type = django_filters.ChoiceFilter(choices=DocumentSignature.SIGNATURE_TYPES)
    status = django_filters.ChoiceFilter(choices=DocumentSignature.STATUS_CHOICES)
    hash_algorithm = django_filters.CharFilter()
    
    # Filtros relacionados
    document = django_filters.UUIDFilter()
    signature_request = django_filters.UUIDFilter()
    signer = django_filters.UUIDFilter()
    certificate = django_filters.UUIDFilter()
    
    # Filtros de data
    signed_after = django_filters.DateTimeFilter(field_name='signed_at', lookup_expr='gte')
    signed_before = django_filters.DateTimeFilter(field_name='signed_at', lookup_expr='lte')
    validated_after = django_filters.DateTimeFilter(field_name='validated_at', lookup_expr='gte')
    validated_before = django_filters.DateTimeFilter(field_name='validated_at', lookup_expr='lte')
    
    # Filtros de posicionamento
    page_number = django_filters.NumberFilter()
    page_number_gte = django_filters.NumberFilter(field_name='page_number', lookup_expr='gte')
    page_number_lte = django_filters.NumberFilter(field_name='page_number', lookup_expr='lte')
    
    class Meta:
        model = DocumentSignature
        fields = [
            'signature_type', 'status', 'hash_algorithm', 'document',
            'signature_request', 'signer', 'certificate', 'page_number'
        ]


class SignatureAuditLogFilter(django_filters.FilterSet):
    """Filtros para logs de auditoria"""
    
    action = django_filters.ChoiceFilter(choices=SignatureAuditLog.ACTION_CHOICES)
    
    # Filtros relacionados
    signature_request = django_filters.UUIDFilter()
    document_signature = django_filters.UUIDFilter()
    certificate = django_filters.UUIDFilter()
    user = django_filters.UUIDFilter()
    
    # Filtros de data
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    # Filtros de período pré-definidos
    period = django_filters.ChoiceFilter(
        choices=[
            ('today', 'Hoje'),
            ('yesterday', 'Ontem'),
            ('this_week', 'Esta Semana'),
            ('last_week', 'Semana Passada'),
            ('this_month', 'Este Mês'),
            ('last_month', 'Mês Passado'),
            ('this_year', 'Este Ano'),
        ],
        method='filter_by_period'
    )
    
    class Meta:
        model = SignatureAuditLog
        fields = [
            'action', 'signature_request', 'document_signature',
            'certificate', 'user', 'user_email'
        ]
    
    def filter_by_period(self, queryset, name, value):
        """Filtrar por período pré-definido"""
        now = timezone.now()
        
        if value == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            return queryset.filter(created_at__gte=start_date)
        
        elif value == 'yesterday':
            yesterday = now - timedelta(days=1)
            start_date = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
            return queryset.filter(created_at__range=[start_date, end_date])
        
        elif value == 'this_week':
            start_date = now - timedelta(days=now.weekday())
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            return queryset.filter(created_at__gte=start_date)
        
        elif value == 'last_week':
            start_date = now - timedelta(days=now.weekday() + 7)
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = start_date + timedelta(days=6)
            end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            return queryset.filter(created_at__range=[start_date, end_date])
        
        elif value == 'this_month':
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            return queryset.filter(created_at__gte=start_date)
        
        elif value == 'last_month':
            if now.month == 1:
                start_date = now.replace(year=now.year-1, month=12, day=1)
            else:
                start_date = now.replace(month=now.month-1, day=1)
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Último dia do mês anterior
            if now.month == 1:
                end_date = now.replace(year=now.year-1, month=12, day=31)
            else:
                import calendar
                last_day = calendar.monthrange(now.year, now.month-1)[1]
                end_date = now.replace(month=now.month-1, day=last_day)
            end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            return queryset.filter(created_at__range=[start_date, end_date])
        
        elif value == 'this_year':
            start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            return queryset.filter(created_at__gte=start_date)
        
        return queryset


class SignatureBatchFilter(django_filters.FilterSet):
    """Filtros para lotes de assinatura"""
    
    status = django_filters.ChoiceFilter(choices=SignatureBatch.STATUS_CHOICES)
    auto_send_notifications = django_filters.BooleanFilter()
    
    # Filtros relacionados
    template = django_filters.UUIDFilter()
    created_by = django_filters.UUIDFilter()
    
    # Filtros de data
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    started_after = django_filters.DateTimeFilter(field_name='started_at', lookup_expr='gte')
    started_before = django_filters.DateTimeFilter(field_name='started_at', lookup_expr='lte')
    completed_after = django_filters.DateTimeFilter(field_name='completed_at', lookup_expr='gte')
    completed_before = django_filters.DateTimeFilter(field_name='completed_at', lookup_expr='lte')
    expires_after = django_filters.DateTimeFilter(field_name='expires_at', lookup_expr='gte')
    expires_before = django_filters.DateTimeFilter(field_name='expires_at', lookup_expr='lte')
    
    # Filtros de progresso
    progress_gte = django_filters.NumberFilter(method='filter_progress_gte')
    progress_lte = django_filters.NumberFilter(method='filter_progress_lte')
    
    class Meta:
        model = SignatureBatch
        fields = [
            'status', 'template', 'created_by', 'auto_send_notifications'
        ]
    
    def filter_progress_gte(self, queryset, name, value):
        """Filtrar lotes com progresso maior ou igual a X%"""
        # Calcular progresso usando anotação
        from django.db.models import Case, When, IntegerField, F
        
        queryset = queryset.annotate(
            progress=Case(
                When(total_documents=0, then=0),
                default=F('processed_documents') * 100 / F('total_documents'),
                output_field=IntegerField()
            )
        )
        return queryset.filter(progress__gte=value)
    
    def filter_progress_lte(self, queryset, name, value):
        """Filtrar lotes com progresso menor ou igual a X%"""
        from django.db.models import Case, When, IntegerField, F
        
        queryset = queryset.annotate(
            progress=Case(
                When(total_documents=0, then=0),
                default=F('processed_documents') * 100 / F('total_documents'),
                output_field=IntegerField()
            )
        )
        return queryset.filter(progress__lte=value)
