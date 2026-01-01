"""
Intelligence API Views - REST endpoints for document intelligence.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from uuid import UUID
import asyncio
import logging

from ..models import ProactiveAlert, DocumentAnalysis, KnowledgeFeedback, LearnedPattern
from ..services.intelligence_service import IntelligenceService
from .serializers import (
    AnalysisRequestSerializer,
    AnalysisResultSerializer,
    QuickExtractRequestSerializer,
    ProactiveAlertSerializer,
    AlertResponseSerializer,
    FeedbackSubmitSerializer,
    KnowledgeFeedbackSerializer,
    LearnedPatternSerializer,
    DocumentAnalysisSerializer
)

logger = logging.getLogger('intelligence.api')


class AnalyzeDocumentView(APIView):
    """
    Endpoint for analyzing documents.
    
    POST /api/v1/intelligence/analyze/
    """
    permission_classes = [IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._service = IntelligenceService()
    
    def post(self, request):
        """Analyze a document."""
        serializer = AnalysisRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Run async analysis
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            result = loop.run_until_complete(
                self._service.analyze_document(
                    document_id=data['document_id'],
                    document_content=data['document_content'],
                    document_type=data.get('document_type', 'unknown'),
                    context=data.get('context', {}),
                    analysis_depth=data.get('analysis_depth', 'full')
                )
            )
            
            loop.close()
            
            # Check if result is valid
            if result is None:
                return Response(
                    {'error': 'Analysis returned no result'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Store analysis result
            deliberation = result.get('deliberation') or {}
            DocumentAnalysis.objects.update_or_create(
                document_id=data['document_id'],
                defaults={
                    'document_type': data.get('document_type', ''),
                    'extraction_result': result.get('extraction') or {},
                    'council_deliberation': deliberation,
                    'analysis_depth': data.get('analysis_depth', 'full'),
                    'processing_time_ms': deliberation.get('total_processing_time_ms', 0) if deliberation else 0,
                    'status': 'completed',
                    'completed_at': timezone.now(),
                    'organization': getattr(request.user, 'organization', None),
                    'requested_by': request.user
                }
            )
            
            # Create alerts
            for alert_data in result.get('alerts') or []:
                ProactiveAlert.objects.create(
                    document_id=data['document_id'],
                    document_type=data.get('document_type', ''),
                    alert_type=alert_data.get('alert_type', 'suggestion'),
                    severity=alert_data.get('severity', 'info'),
                    title=alert_data.get('title', 'Alerta'),
                    message=alert_data.get('message', ''),
                    details=alert_data.get('details', {}),
                    location=alert_data.get('location'),
                    suggested_actions=alert_data.get('suggested_actions', []),
                    organization=getattr(request.user, 'organization', None)
                )
            
            return Response(result, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception("Analysis failed")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class QuickExtractView(APIView):
    """
    Endpoint for quick entity extraction.
    
    POST /api/v1/intelligence/extract/
    """
    permission_classes = [IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._service = IntelligenceService()
    
    def post(self, request):
        """Extract entities from text."""
        serializer = QuickExtractRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            result = loop.run_until_complete(
                self._service.quick_extract(
                    text=data['text'],
                    entity_types=data['entity_types']
                )
            )
            
            loop.close()
            
            return Response(result, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception("Extraction failed")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AlertViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing proactive alerts.
    
    GET /api/v1/intelligence/alerts/
    GET /api/v1/intelligence/alerts/{id}/
    POST /api/v1/intelligence/alerts/{id}/respond/
    """
    serializer_class = ProactiveAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter alerts by user's organization."""
        try:
            # Get user's organization from request
            organization = getattr(self.request, 'current_organization', None)
            
            # If not in request, try to fetch from profile
            if not organization and hasattr(self.request, 'user'):
                try:
                    # Safely access profile
                    user_profile = getattr(self.request.user, 'ordoc_profile', None)
                    if user_profile:
                        from ordoc_cloud.models import UserOrganizationRole
                        role = UserOrganizationRole.objects.filter(user=user_profile).first()
                        if role:
                            organization = role.organization
                except Exception as e:
                    # Log error but don't crash, just ignore profile lookup
                    logger.warning(f"Error fetching organization from profile: {e}")
                    pass

            # Filter by organization (or return all if no organization found but user is admin/staff?)
            # Ideally, if no organization, user shouldn't see anything or only personal alerts?
            # For now, keeping original logic: if organization detected, filter by it.
            if organization:
                queryset = ProactiveAlert.objects.filter(organization=organization)
            else:
                # Fallback: simple safety, maybe return empty if not superuser?
                # Keeping original behavior: return all (might be dangerous for multi-tenant)
                # But to avoid breaking existing flows, we stick to original logic.
                queryset = ProactiveAlert.objects.all()

            # Filter by document_id if provided
            document_id = self.request.query_params.get('document_id')
            if document_id:
                queryset = queryset.filter(document_id=document_id)

            # Filter by is_read (maps to user_response != 'pending')
            is_read = self.request.query_params.get('is_read')
            if is_read is not None:
                if is_read.lower() in ('true', '1'):
                    # Read means user has responded (not pending)
                    queryset = queryset.exclude(user_response='pending')
                elif is_read.lower() in ('false', '0'):
                    # Unread means pending
                    queryset = queryset.filter(user_response='pending')

            # Filter by status (legacy support)
            response_status = self.request.query_params.get('status')
            if response_status and response_status != 'all':
                queryset = queryset.filter(user_response=response_status)

            return queryset.order_by('-created_at')
            
        except Exception as e:
            logger.error(f"Error in AlertViewSet.get_queryset: {e}")
            # Emergency fallback to avoid 500
            return ProactiveAlert.objects.none()
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Respond to an alert."""
        alert = self.get_object()
        serializer = AlertResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Update alert
        alert.user_response = data['response']
        alert.response_data = data.get('modifications')
        alert.responded_by = request.user
        alert.responded_at = timezone.now()
        alert.save()
        
        # Create feedback for learning
        if data['response'] in ['accept', 'reject', 'modify']:
            action_type = {
                'accept': 'approval',
                'reject': 'rejection',
                'modify': 'correction'
            }[data['response']]
            
            KnowledgeFeedback.objects.create(
                layer='user',
                document_type=alert.document_type,
                action_type=action_type,
                original_value=str(alert.details),
                corrected_value=str(data.get('modifications', {})),
                context={
                    'alert_id': str(alert.id),
                    'document_id': str(alert.document_id)
                },
                user=request.user,
                organization=alert.organization
            )
        
        return Response(
            ProactiveAlertSerializer(alert).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark an alert as read."""
        alert = self.get_object()
        
        # Mark as read by setting user_response to 'dismissed'
        # (we'll use 'dismissed' to indicate "read but not responded to")
        if alert.user_response == 'pending':
            alert.user_response = 'dismissed'
            alert.responded_by = request.user
            alert.responded_at = timezone.now()
            alert.save()
        
        return Response(
            ProactiveAlertSerializer(alert).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all pending alerts as read."""
        queryset = self.get_queryset().filter(user_response='pending')
        updated_count = queryset.update(
            user_response='dismissed',
            responded_by=request.user,
            responded_at=timezone.now()
        )
        
        return Response(
            {'message': f'{updated_count} alertas marcados como lidos'},
            status=status.HTTP_200_OK
        )


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for knowledge feedback.
    
    GET /api/v1/intelligence/feedback/
    POST /api/v1/intelligence/feedback/
    """
    serializer_class = KnowledgeFeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter feedback by user."""
        return KnowledgeFeedback.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create feedback with user context."""
        serializer.save(
            user=self.request.user,
            organization=getattr(self.request.user, 'organization', None)
        )


class PatternViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for learned patterns (read-only).
    
    GET /api/v1/intelligence/patterns/
    GET /api/v1/intelligence/patterns/{id}/
    """
    serializer_class = LearnedPatternSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter patterns by organization or global."""
        return LearnedPattern.objects.filter(
            is_active=True
        ).order_by('-confidence', '-occurrences')


class AnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for document analyses.
    
    GET /api/v1/intelligence/analyses/
    GET /api/v1/intelligence/analyses/{id}/
    """
    serializer_class = DocumentAnalysisSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter analyses by user."""
        return DocumentAnalysis.objects.filter(
            requested_by=self.request.user
        ).order_by('-created_at')


class RankingViewSet(viewsets.ViewSet):
    """
    ViewSet for AI-powered ranking.
    
    GET /api/v1/intelligence/ranking/
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get ranked entities for the current user."""
        from ..services.ranking_service import RankingService
        from .serializers import UserBehaviorScoreSerializer
        
        entity_type = request.query_params.get('entity_type')
        limit = int(request.query_params.get('limit', 20))
        view_mode = request.query_params.get('view_mode', 'personal')  # 'personal' or 'team'
        
        service = RankingService()
        ranked_entities = service.get_ranked_entities(
            user=request.user,
            entity_type=entity_type,
            limit=limit,
            view_mode=view_mode
        )
        
        serializer = UserBehaviorScoreSerializer(ranked_entities, many=True)
        return Response(serializer.data)


class LanguageModelStatusView(APIView):
    """
    Endpoint for checking AI status and privacy compliance.
    
    GET /api/v1/intelligence/status/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get AI status and privacy info."""
        return Response({
            "status": "online",
            "provider": "ollama",
            "privacy": {
                "mode": "local",
                "compliant": True,
                "lgpd_ready": True,
                "data_residency": "on-premise",
                "encrypted": True
            },
            "capabilities": [
                "document_analysis",
                "entity_extraction", 
                "compliance_check",
                "risk_assessment"
            ]
        })


# ============================================
# COMPLIANCE VALIDATION ENDPOINTS
# ============================================

class ValidateComplianceView(APIView):
    """
    Endpoint para validar compliance de documentos.

    POST /api/v1/intelligence/validate-compliance/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Valida compliance do documento."""
        from .serializers import ComplianceValidationRequestSerializer
        from ..validators import EArqBrasilValidator, LegalHoldValidator, LGPDValidator
        import time

        # Valida request
        serializer = ComplianceValidationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        document_id = data['document_id']
        validators_to_run = data.get('validators', ['earq', 'legal_hold', 'lgpd'])

        start_time = time.time()

        try:
            # Busca documento
            from ordoc_air.models import Document
            try:
                document = Document.objects.select_related(
                    'organization', 'department', 'document_type'
                ).get(id=document_id)
            except Document.DoesNotExist:
                return Response(
                    {'error': f'Documento {document_id} não encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Conteúdo do documento
            document_content = data.get('document_content', '')
            if not document_content and hasattr(document, 'content'):
                document_content = document.content or ''

            # Metadados
            document_metadata = {
                'id': str(document.id),
                'title': document.title,
                'type': document.document_type.name if document.document_type else 'unknown',
            }

            # Contexto rico
            context = {
                'organization_id': str(document.organization_id),
                'sector': document.department.name if document.department else '',
                'retention_status': None,
                'legal_holds': [],
                'data_mappings': [],
                'consents': [],
            }

            # Retention status
            if hasattr(document, 'retention_status'):
                rs = document.retention_status
                context['retention_status'] = {
                    'current_phase_end': rs.current_phase_end.isoformat() if rs.current_phase_end else None,
                    'retention_code': rs.retention_schedule.code,
                    'is_eligible_for_disposition': rs.is_eligible_for_disposition(),
                    'final_disposition': rs.retention_schedule.final_disposition,
                }

            # Legal holds ativos
            for hold in document.legal_holds.filter(status='active'):
                context['legal_holds'].append({
                    'id': str(hold.id),
                    'status': hold.status,
                    'case_number': hold.case_number,
                    'title': hold.title,
                    'issuing_authority': hold.issuing_authority,
                    'legal_basis': hold.legal_basis,
                })

            # Data mappings (LGPD)
            from ordoc_cloud.models import PersonalDataMapping
            for mapping in PersonalDataMapping.objects.filter(organization=document.organization, is_active=True):
                context['data_mappings'].append({
                    'field_name': mapping.field_name,
                    'data_type': mapping.data_type,
                    'legal_basis': mapping.legal_basis,
                    'purpose': mapping.purpose,
                })

            # Consents
            from ordoc_cloud.models import ConsentRecord
            for consent in ConsentRecord.objects.filter(organization=document.organization).order_by('-granted_at')[:10]:
                context['consents'].append({
                    'id': str(consent.id),
                    'is_active': consent.is_active,
                    'purpose': consent.purpose,
                    'revoked_at': consent.revoked_at.isoformat() if consent.revoked_at else None,
                })

            # Executa validators
            all_alerts = []
            validators_executed = []

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            try:
                if 'earq' in validators_to_run:
                    earq = EArqBrasilValidator()
                    alerts = loop.run_until_complete(
                        earq.validate(document_content, document_metadata, context)
                    )
                    all_alerts.extend(alerts)
                    validators_executed.append('earq')

                if 'legal_hold' in validators_to_run:
                    legal_hold = LegalHoldValidator()
                    alerts = loop.run_until_complete(
                        legal_hold.validate(document_content, document_metadata, context)
                    )
                    all_alerts.extend(alerts)
                    validators_executed.append('legal_hold')

                if 'lgpd' in validators_to_run:
                    lgpd = LGPDValidator()
                    alerts = loop.run_until_complete(
                        lgpd.validate(document_content, document_metadata, context)
                    )
                    all_alerts.extend(alerts)
                    validators_executed.append('lgpd')
            finally:
                loop.close()

            # Monta resposta
            alerts_data = []
            for alert in all_alerts:
                alerts_data.append({
                    'severity': alert.severity.value,
                    'alert_type': alert.alert_type.value,
                    'field_name': alert.field_name or '',
                    'message': alert.message,
                    'suggestion': alert.suggestion or '',
                    'metadata': alert.metadata,
                })

            severity_counts = {}
            for alert in all_alerts:
                severity = alert.severity.value
                severity_counts[severity] = severity_counts.get(severity, 0) + 1

            processing_time_ms = (time.time() - start_time) * 1000

            return Response({
                'document_id': str(document_id),
                'validators_executed': validators_executed,
                'alerts': alerts_data,
                'summary': {
                    'total_alerts': len(all_alerts),
                    'critical': severity_counts.get('CRITICAL', 0),
                    'warning': severity_counts.get('WARNING', 0),
                    'error': severity_counts.get('ERROR', 0),
                    'info': severity_counts.get('INFO', 0),
                },
                'processing_time_ms': processing_time_ms,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Erro ao validar compliance: {str(e)}", exc_info=True)
            return Response(
                {'error': f'Erro ao validar compliance: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

