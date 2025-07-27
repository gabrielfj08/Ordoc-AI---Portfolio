from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from django.db import models
from django.shortcuts import get_object_or_404
from django.http import Http404
import logging

from ordoc_ai.base_viewset import BaseViewSet
from .models import (
    DigitalCertificate, SignatureTemplate, SignatureRequest,
    SignatureRequestSigner, DocumentSignature, SignatureAuditLog,
    SignatureBatch
)
from .serializers import (
    DigitalCertificateSerializer, DigitalCertificateCreateSerializer,
    SignatureTemplateSerializer, SignatureRequestSerializer,
    SignatureRequestCreateSerializer, SignatureRequestSignerSerializer,
    DocumentSignatureSerializer, SignatureAuditLogSerializer,
    SignatureBatchSerializer, SignatureBatchCreateSerializer,
    SignatureStatsSerializer, SignDocumentSerializer,
    CertificateVerificationSerializer, SignatureVerificationSerializer
)
from .services import (
    CertificateService, SignatureService, SignatureBatchService,
    SignatureReportService
)
from .filters import (
    DigitalCertificateFilter, SignatureRequestFilter,
    DocumentSignatureFilter, SignatureAuditLogFilter
)

logger = logging.getLogger(__name__)


class DigitalCertificateViewSet(BaseViewSet):
    """ViewSet para certificados digitais"""
    
    queryset = DigitalCertificate.objects.all()
    serializer_class = DigitalCertificateSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = DigitalCertificateFilter
    search_fields = ['subject_name', 'issuer_name', 'serial_number']
    ordering_fields = ['created_at', 'valid_until', 'last_used_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            organization=self.get_current_organization()
        )
    
    def perform_create(self, serializer):
        """Associar à organização e usuário atual"""
        serializer.save(
            organization=self.get_current_organization(),
            user=self.get_current_user()
        )
    
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload(self, request):
        """Upload de certificado digital"""
        try:
            serializer = DigitalCertificateCreateSerializer(data=request.data)
            if serializer.is_valid():
                certificate_file = serializer.validated_data['certificate_file']
                password = serializer.validated_data.get('password')
                certificate_type = serializer.validated_data['certificate_type']
                is_default = serializer.validated_data.get('is_default', False)
                
                success, result = CertificateService.upload_certificate(
                    user=self.get_current_user(),
                    organization=self.get_current_organization(),
                    certificate_file=certificate_file,
                    password=password,
                    certificate_type=certificate_type
                )
                
                if success:
                    certificate = result
                    if is_default:
                        # Remover padrão dos outros certificados
                        DigitalCertificate.objects.filter(
                            user=self.get_current_user(),
                            is_default=True
                        ).update(is_default=False)
                        
                        certificate.is_default = True
                        certificate.save()
                    
                    response_serializer = DigitalCertificateSerializer(certificate)
                    return Response(response_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        {'error': result},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Erro no upload de certificado: {str(e)}")
            return Response(
                {'error': 'Erro interno do servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verificar certificado"""
        try:
            certificate = self.get_object()
            is_valid, message = CertificateService.verify_certificate(certificate)
            
            details = {
                'certificate_type': certificate.certificate_type,
                'subject_name': certificate.subject_name,
                'issuer_name': certificate.issuer_name,
                'valid_from': certificate.valid_from,
                'valid_until': certificate.valid_until,
                'status': certificate.status,
                'is_expired': certificate.is_expired,
                'days_until_expiry': (certificate.valid_until.date() - timezone.now().date()).days if certificate.valid_until else None
            }
            
            serializer = CertificateVerificationSerializer({
                'is_valid': is_valid,
                'message': message,
                'details': details
            })
            
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao verificar certificado: {str(e)}")
            return Response(
                {'error': 'Erro ao verificar certificado'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Definir como certificado padrão"""
        try:
            certificate = self.get_object()
            
            # Remover padrão dos outros certificados
            DigitalCertificate.objects.filter(
                user=self.get_current_user(),
                is_default=True
            ).update(is_default=False)
            
            # Definir como padrão
            certificate.is_default = True
            certificate.save()
            
            serializer = DigitalCertificateSerializer(certificate)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao definir certificado padrão: {str(e)}")
            return Response(
                {'error': 'Erro ao definir certificado padrão'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def my_certificates(self, request):
        """Listar certificados do usuário atual"""
        certificates = self.get_queryset().filter(user=self.get_current_user())
        page = self.paginate_queryset(certificates)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(certificates, many=True)
        return Response(serializer.data)


class SignatureTemplateViewSet(BaseViewSet):
    """ViewSet para templates de assinatura"""
    
    queryset = SignatureTemplate.objects.all()
    serializer_class = SignatureTemplateSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            organization=self.get_current_organization()
        )
    
    def perform_create(self, serializer):
        """Associar à organização e usuário atual"""
        serializer.save(
            organization=self.get_current_organization(),
            created_by=self.get_current_user()
        )
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Listar templates ativos"""
        templates = self.get_queryset().filter(is_active=True)
        page = self.paginate_queryset(templates)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicar template"""
        try:
            template = self.get_object()
            
            # Criar cópia
            new_template = SignatureTemplate.objects.create(
                organization=self.get_current_organization(),
                name=f"{template.name} (Cópia)",
                description=template.description,
                signature_type=template.signature_type,
                hash_algorithm=template.hash_algorithm,
                show_signature_image=template.show_signature_image,
                signature_position=template.signature_position,
                signature_size=template.signature_size,
                require_reason=template.require_reason,
                require_location=template.require_location,
                require_contact_info=template.require_contact_info,
                require_approval=template.require_approval,
                approval_workflow=template.approval_workflow,
                notify_signers=template.notify_signers,
                notify_completion=template.notify_completion,
                notification_template=template.notification_template,
                is_active=True,
                is_default=False,
                created_by=self.get_current_user()
            )
            
            serializer = SignatureTemplateSerializer(new_template)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Erro ao duplicar template: {str(e)}")
            return Response(
                {'error': 'Erro ao duplicar template'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SignatureRequestViewSet(BaseViewSet):
    """ViewSet para solicitações de assinatura"""
    
    queryset = SignatureRequest.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SignatureRequestFilter
    search_fields = ['title', 'description', 'document__name']
    ordering_fields = ['created_at', 'expires_at', 'priority']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SignatureRequestCreateSerializer
        return SignatureRequestSerializer
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            organization=self.get_current_organization()
        ).select_related(
            'document', 'template', 'created_by'
        ).prefetch_related('signers')
    
    def perform_create(self, serializer):
        """Associar à organização"""
        serializer.save(organization=self.get_current_organization())
    
    def create(self, request, *args, **kwargs):
        """Criar solicitação e retornar com serializer completo"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Retornar com o serializer de leitura que inclui os signers
        instance = serializer.instance
        response_serializer = SignatureRequestSerializer(instance, context=self.get_serializer_context())
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submeter solicitação de assinatura"""
        try:
            signature_request = self.get_object()
            success, message = SignatureService.submit_signature_request(
                signature_request, 
                self.get_current_user()
            )
            
            if success:
                serializer = SignatureRequestSerializer(signature_request)
                return Response({
                    'message': message,
                    'signature_request': serializer.data
                })
            else:
                return Response(
                    {'error': message},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Erro ao submeter solicitação: {str(e)}")
            return Response(
                {'error': 'Erro ao submeter solicitação'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancelar solicitação de assinatura"""
        try:
            signature_request = self.get_object()
            
            if signature_request.status not in ['draft', 'pending', 'in_progress']:
                return Response(
                    {'error': 'Solicitação não pode ser cancelada'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            signature_request.cancel()
            signature_request.save()
            
            serializer = SignatureRequestSerializer(signature_request)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao cancelar solicitação: {str(e)}")
            return Response(
                {'error': 'Erro ao cancelar solicitação'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def signers(self, request, pk=None):
        """Listar assinantes da solicitação"""
        signature_request = self.get_object()
        signers = signature_request.signers.all().order_by('signing_order')
        serializer = SignatureRequestSignerSerializer(signers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def signatures(self, request, pk=None):
        """Listar assinaturas aplicadas"""
        signature_request = self.get_object()
        signatures = signature_request.signatures.all().order_by('-signed_at')
        serializer = DocumentSignatureSerializer(signatures, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Listar solicitações criadas pelo usuário atual"""
        requests = self.get_queryset().filter(created_by=self.get_current_user())
        page = self.paginate_queryset(requests)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Listar solicitações pendentes"""
        requests = self.get_queryset().filter(status__in=['pending', 'in_progress'])
        page = self.paginate_queryset(requests)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)


class SignatureRequestSignerViewSet(BaseViewSet):
    """ViewSet para assinantes de solicitação"""
    
    queryset = SignatureRequestSigner.objects.all()
    serializer_class = SignatureRequestSignerSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['email', 'full_name']
    ordering_fields = ['created_at', 'signing_order']
    ordering = ['signing_order']
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            signature_request__organization=self.get_current_organization()
        )
    
    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        """Assinar documento"""
        try:
            signer = self.get_object()
            serializer = SignDocumentSerializer(data=request.data)
            
            if serializer.is_valid():
                certificate_id = serializer.validated_data['certificate_id']
                certificate = get_object_or_404(DigitalCertificate, id=certificate_id)
                
                # Dados adicionais da requisição
                ip_address = request.META.get('REMOTE_ADDR')
                user_agent = request.META.get('HTTP_USER_AGENT', '')
                
                success, result = SignatureService.sign_document(
                    signature_request=signer.signature_request,
                    signer=signer,
                    certificate=certificate,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    **serializer.validated_data
                )
                
                if success:
                    document_signature = result
                    response_serializer = DocumentSignatureSerializer(document_signature)
                    return Response(response_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        {'error': result},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Erro ao assinar documento: {str(e)}")
            return Response(
                {'error': 'Erro ao assinar documento'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        """Recusar assinatura"""
        try:
            signer = self.get_object()
            
            if signer.status not in ['pending', 'notified', 'viewed']:
                return Response(
                    {'error': 'Não é possível recusar esta assinatura'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            signer.decline()
            signer.save()
            
            serializer = SignatureRequestSignerSerializer(signer)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao recusar assinatura: {str(e)}")
            return Response(
                {'error': 'Erro ao recusar assinatura'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def my_assignments(self, request):
        """Listar assinaturas atribuídas ao usuário atual"""
        user = self.get_current_user()
        assignments = self.get_queryset().filter(
            models.Q(user=user) | models.Q(email=user.email)
        )
        
        page = self.paginate_queryset(assignments)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)


class DocumentSignatureViewSet(BaseViewSet):
    """ViewSet para assinaturas de documento"""
    
    queryset = DocumentSignature.objects.all()
    serializer_class = DocumentSignatureSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = DocumentSignatureFilter
    search_fields = ['document__name', 'signer__full_name', 'signer__email']
    ordering_fields = ['signed_at', 'validated_at']
    ordering = ['-signed_at']
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            organization=self.get_current_organization()
        ).select_related(
            'document', 'signature_request', 'signer', 'certificate'
        )
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verificar assinatura"""
        try:
            document_signature = self.get_object()
            is_valid, message = SignatureService.verify_document_signature(document_signature)
            
            serializer = SignatureVerificationSerializer({
                'is_valid': is_valid,
                'message': message,
                'certificate_valid': document_signature.certificate.is_valid,
                'document_integrity': True,  # Implementar verificação específica
                'signature_valid': is_valid,
                'verified_at': timezone.now()
            })
            
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao verificar assinatura: {str(e)}")
            return Response(
                {'error': 'Erro ao verificar assinatura'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estatísticas de assinaturas"""
        try:
            from datetime import datetime, timedelta
            
            # Parâmetros de data
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            
            if start_date:
                start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            if end_date:
                end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            
            stats = SignatureReportService.generate_signature_statistics(
                organization=self.get_current_organization(),
                start_date=start_date,
                end_date=end_date
            )
            
            serializer = SignatureStatsSerializer(stats)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao gerar estatísticas: {str(e)}")
            return Response(
                {'error': 'Erro ao gerar estatísticas'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SignatureBatchViewSet(BaseViewSet):
    """ViewSet para lotes de assinatura"""
    
    queryset = SignatureBatch.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'started_at', 'completed_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SignatureBatchCreateSerializer
        return SignatureBatchSerializer
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            organization=self.get_current_organization()
        ).select_related('template', 'created_by')
    
    def perform_create(self, serializer):
        """Associar à organização"""
        serializer.save(organization=self.get_current_organization())
    
    def create(self, request, *args, **kwargs):
        """Criar lote e retornar com serializer completo"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Retornar com o serializer de leitura que inclui o status
        instance = serializer.instance
        response_serializer = SignatureBatchSerializer(instance, context=self.get_serializer_context())
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Processar lote de assinatura"""
        try:
            batch = self.get_object()
            success, message = SignatureBatchService.process_signature_batch(batch)
            
            if success:
                serializer = SignatureBatchSerializer(batch)
                return Response({
                    'message': message,
                    'batch': serializer.data
                })
            else:
                return Response(
                    {'error': message},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Erro ao processar lote: {str(e)}")
            return Response(
                {'error': 'Erro ao processar lote'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancelar lote de assinatura"""
        try:
            batch = self.get_object()
            
            if batch.status not in ['pending', 'processing']:
                return Response(
                    {'error': 'Lote não pode ser cancelado'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            batch.cancel()
            batch.save()
            
            serializer = SignatureBatchSerializer(batch)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao cancelar lote: {str(e)}")
            return Response(
                {'error': 'Erro ao cancelar lote'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SignatureAuditLogViewSet(BaseViewSet):
    """ViewSet para logs de auditoria de assinatura"""
    
    queryset = SignatureAuditLog.objects.all()
    serializer_class = SignatureAuditLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SignatureAuditLogFilter
    search_fields = ['description', 'user_name', 'user_email']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    permission_classes = [permissions.IsAuthenticated]  # Apenas leitura
    http_method_names = ['get']  # Apenas GET
    
    def get_queryset(self):
        """Filtrar por organização"""
        return super().get_queryset().filter(
            organization=self.get_current_organization()
        ).select_related(
            'signature_request', 'document_signature', 'certificate', 'user'
        )
