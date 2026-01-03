"""
API Views for Dynamic Document Filters

This module provides endpoints for retrieving dynamic filters
based on actual document data in the tenant's organization.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from ordoc_air.models import Document
from ordoc_ai.authentication import get_current_organization


class DocumentFiltersView(APIView):
    """
    GET /api/v1/ordoc-air/api/documents/filters/
    
    Returns dynamic filters based on documents that exist in the tenant's organization.
    Filters are auto-generated from actual data, not hardcoded.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get organization (respecting middleware/token context)
        organization = get_current_organization(request)
        
        # Fallback for development/testing if no subdomain context but logged in
        if not organization and request.user.is_authenticated:
            try:
                # Try to get from user profile roles
                # Note: related_name is 'ordoc_profile' on User model
                ordoc_user = request.user.ordoc_profile
                role = ordoc_user.roles.filter(is_active=True).select_related('organization').first()
                if role:
                    organization = role.organization
            except Exception:
                pass

        if not organization:
             return Response({
                'type_filters': [],
                'flag_filters': [],
                'total_documents': 0
             })

        # Filter documents by user's organization (through department)
        base_queryset = Document.objects.filter(
            department__organization=organization
        ).exclude(
            status='failed'
        )
        
        # 1. Aggregate document types that exist (with counts)
        type_counts = base_queryset.values(
            'document_type'
        ).annotate(
            count=Count('id')
        ).filter(
            document_type__isnull=False
        ).exclude(
            document_type='other'
        ).order_by('-count')
        
        # Get display names for document types
        type_dict = dict(Document.DOCUMENT_TYPE_CHOICES)
        type_filters = [
            {
                'value': t['document_type'],
                'label': type_dict.get(t['document_type'], t['document_type']),
                'count': t['count']
            }
            for t in type_counts if t['count'] > 0
        ]
        
        # 2. Aggregate flags that have documents
        flag_filters = []
        
        # LGPD - Sensitive Data
        lgpd_count = base_queryset.filter(contains_sensitive_data=True).count()
        if lgpd_count > 0:
            flag_filters.append({
                'id': 'lgpd',
                'label': '🔒 LGPD',
                'field': 'contains_sensitive_data',
                'value': True,
                'count': lgpd_count
            })
        
        # Pending Signature
        signature_count = base_queryset.filter(requires_signature=True).count()
        if signature_count > 0:
            flag_filters.append({
                'id': 'pending_signature',
                'label': '✍️ Assinar',
                'field': 'requires_signature',
                'value': True,
                'count': signature_count
            })
        
        # With Deadline
        deadline_count = base_queryset.filter(has_deadline=True).count()
        if deadline_count > 0:
            flag_filters.append({
                'id': 'with_deadline',
                'label': '🔴 Com Prazo',
                'field': 'has_deadline',
                'value': True,
                'count': deadline_count
            })
        
        # From External Source
        external_count = base_queryset.filter(is_from_external_source=True).count()
        if external_count > 0:
            flag_filters.append({
                'id': 'from_external',
                'label': '📥 Externo',
                'field': 'is_from_external_source',
                'value': True,
                'count': external_count
            })
        
        # Restricted (not public)
        restricted_count = base_queryset.filter(is_public=False).count()
        if restricted_count > 0:
            flag_filters.append({
                'id': 'restricted',
                'label': '🔒 Restrito',
                'field': 'is_public',
                'value': False,
                'count': restricted_count
            })
        
        # Critical documents
        critical_count = base_queryset.filter(
            Q(criticality='critical') | Q(criticality='high')
        ).count()
        if critical_count > 0:
            flag_filters.append({
                'id': 'critical',
                'label': '⚠️ Crítico',
                'field': 'criticality__in',
                'value': ['critical', 'high'],
                'count': critical_count
            })
        
        # 3. Get top tags (if tags field exists and is used)
        # Note: This assumes tags is a ManyToMany or similar
        # Adjust based on actual implementation
        
        return Response({
            'type_filters': type_filters[:6],  # Top 6 types
            'flag_filters': flag_filters,
            'total_documents': base_queryset.count(),
        })
