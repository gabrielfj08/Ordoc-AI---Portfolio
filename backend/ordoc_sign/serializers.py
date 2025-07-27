from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from .models import (
    DigitalCertificate, SignatureTemplate, SignatureRequest,
    SignatureRequestSigner, DocumentSignature, SignatureAuditLog,
    SignatureBatch
)
from ordoc_air.models import Document, Organization
from ordoc_flow.models import ExternalRequester
from ordoc_flow.approval_models import ApprovalWorkflow, NotificationTemplate

User = get_user_model()


class DigitalCertificateSerializer(serializers.ModelSerializer):
    """Serializer para certificados digitais"""
    
    is_expired = serializers.ReadOnlyField()
    is_valid = serializers.ReadOnlyField()
    days_until_expiry = serializers.SerializerMethodField()
    usage_count = serializers.SerializerMethodField()
    
    class Meta:
        model = DigitalCertificate
        fields = [
            'id', 'certificate_type', 'subject_name', 'issuer_name',
            'serial_number', 'valid_from', 'valid_until', 'status',
            'is_default', 'fingerprint_sha256', 'key_usage',
            'extended_key_usage', 'created_at', 'updated_at',
            'last_used_at', 'is_expired', 'is_valid', 'days_until_expiry',
            'usage_count'
        ]
        read_only_fields = [
            'id', 'fingerprint_sha256', 'created_at', 'updated_at',
            'last_used_at', 'is_expired', 'is_valid'
        ]
    
    def get_days_until_expiry(self, obj):
        """Calcula dias até expiração"""
        if obj.valid_until:
            delta = obj.valid_until.date() - timezone.now().date()
            return delta.days
        return None
    
    def get_usage_count(self, obj):
        """Conta quantas vezes o certificado foi usado"""
        return obj.signatures.count()


class DigitalCertificateCreateSerializer(serializers.Serializer):
    """Serializer para upload de certificado"""
    
    certificate_file = serializers.FileField()
    password = serializers.CharField(required=False, write_only=True)
    certificate_type = serializers.ChoiceField(
        choices=DigitalCertificate.CERTIFICATE_TYPES,
        default='A1'
    )
    is_default = serializers.BooleanField(default=False)
    
    def validate_certificate_file(self, value):
        """Valida arquivo de certificado"""
        allowed_extensions = ['.p12', '.pfx', '.pem', '.crt', '.cer']
        file_extension = '.' + value.name.split('.')[-1].lower()
        
        if file_extension not in allowed_extensions:
            raise serializers.ValidationError(
                f"Tipo de arquivo não suportado. Use: {', '.join(allowed_extensions)}"
            )
        
        # Limite de tamanho: 5MB
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Arquivo muito grande. Máximo: 5MB")
        
        return value


class SignatureTemplateSerializer(serializers.ModelSerializer):
    """Serializer para templates de assinatura"""
    
    usage_count = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = SignatureTemplate
        fields = [
            'id', 'name', 'description', 'signature_type', 'hash_algorithm',
            'show_signature_image', 'signature_position', 'signature_size',
            'require_reason', 'require_location', 'require_contact_info',
            'require_approval', 'approval_workflow', 'notify_signers',
            'notify_completion', 'notification_template', 'is_active',
            'is_default', 'created_at', 'updated_at', 'created_by',
            'created_by_name', 'usage_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def get_usage_count(self, obj):
        """Conta quantas solicitações usaram este template"""
        return obj.signature_requests.count()
    
    def validate_name(self, value):
        """Valida nome único por organização"""
        request = self.context.get('request')
        if request and hasattr(request, 'organization'):
            existing = SignatureTemplate.objects.filter(
                organization=request.organization,
                name=value
            )
            
            if self.instance:
                existing = existing.exclude(id=self.instance.id)
            
            if existing.exists():
                raise serializers.ValidationError(
                    "Já existe um template com este nome na organização"
                )
        
        return value


class SignatureRequestSignerSerializer(serializers.ModelSerializer):
    """Serializer para assinantes de solicitação"""
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    external_requester_name = serializers.CharField(
        source='external_requester.full_name', 
        read_only=True
    )
    can_sign = serializers.SerializerMethodField()
    signing_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SignatureRequestSigner
        fields = [
            'id', 'signer_type', 'user', 'user_name', 'external_requester',
            'external_requester_name', 'email', 'full_name', 'phone',
            'signing_order', 'status', 'require_certificate',
            'access_token', 'access_expires_at', 'created_at',
            'updated_at', 'notified_at', 'viewed_at', 'signed_at',
            'can_sign', 'signing_url'
        ]
        read_only_fields = [
            'id', 'access_token', 'access_expires_at', 'created_at',
            'updated_at', 'notified_at', 'viewed_at', 'signed_at'
        ]
    
    def get_can_sign(self, obj):
        """Verifica se o assinante pode assinar"""
        return obj.status in ['pending', 'notified', 'viewed']
    
    def get_signing_url(self, obj):
        """Gera URL de assinatura"""
        if obj.access_token:
            from django.conf import settings
            return f"{getattr(settings, 'FRONTEND_URL', '')}/sign/{obj.access_token}"
        return None


class SignatureRequestSerializer(serializers.ModelSerializer):
    """Serializer para solicitações de assinatura"""
    
    document_name = serializers.CharField(source='document.original_filename', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    signers = SignatureRequestSignerSerializer(many=True, read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    days_until_expiry = serializers.SerializerMethodField()
    signature_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SignatureRequest
        fields = [
            'id', 'document', 'document_name', 'template', 'template_name',
            'title', 'description', 'status', 'priority', 'expires_at',
            'reminder_days', 'require_sequential_signing', 'allow_decline',
            'require_all_signatures', 'signing_reason', 'signing_location',
            'contact_info', 'created_at', 'updated_at', 'created_by',
            'created_by_name', 'completed_at', 'signers', 'progress_percentage',
            'is_expired', 'days_until_expiry', 'signature_count'
        ]
        read_only_fields = [
            'id', 'status', 'created_at', 'updated_at', 'created_by',
            'completed_at', 'progress_percentage', 'is_expired'
        ]
    
    def get_days_until_expiry(self, obj):
        """Calcula dias até expiração"""
        if obj.expires_at:
            delta = obj.expires_at.date() - timezone.now().date()
            return delta.days
        return None
    
    def get_signature_count(self, obj):
        """Conta assinaturas aplicadas"""
        return obj.signatures.count()
    
    def validate_expires_at(self, value):
        """Valida data de expiração"""
        if value and value <= timezone.now():
            raise serializers.ValidationError(
                "Data de expiração deve ser no futuro"
            )
        return value


class SignatureRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de solicitação de assinatura"""
    
    signers = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        help_text="Lista de assinantes"
    )
    
    class Meta:
        model = SignatureRequest
        fields = [
            'document', 'template', 'title', 'description', 'priority',
            'expires_at', 'reminder_days', 'require_sequential_signing',
            'allow_decline', 'require_all_signatures', 'signing_reason',
            'signing_location', 'contact_info', 'signers'
        ]
    
    def validate_signers(self, value):
        """Valida dados dos assinantes"""
        if not value:
            raise serializers.ValidationError("Deve haver pelo menos um assinante")
        
        emails = []
        for i, signer in enumerate(value):
            # Campos obrigatórios
            if 'email' not in signer or 'full_name' not in signer:
                raise serializers.ValidationError(
                    f"Assinante {i+1}: email e full_name são obrigatórios"
                )
            
            # Email único
            email = signer['email'].lower()
            if email in emails:
                raise serializers.ValidationError(
                    f"Email duplicado: {email}"
                )
            emails.append(email)
            
            # Validar tipo de assinante
            signer_type = signer.get('signer_type', 'email_only')
            if signer_type not in ['internal', 'external', 'email_only']:
                raise serializers.ValidationError(
                    f"Tipo de assinante inválido: {signer_type}"
                )
        
        return value
    
    def create(self, validated_data):
        """Criar solicitação de assinatura com assinantes"""
        from .services import SignatureService
        
        # A organização é passada via perform_create do ViewSet
        organization = validated_data.pop('organization', None)
        if not organization:
            from ordoc_ai.authentication import get_current_organization
            organization = get_current_organization()
            
        created_by = self.context['request'].user
        
        # Extrair dados dos assinantes
        signers_data = validated_data.pop('signers', [])
        
        success, result = SignatureService.create_signature_request(
            organization,  # Passar como argumento posicional
            validated_data.pop('document'),
            validated_data.pop('template'),
            validated_data.pop('title'),
            signers_data,
            created_by,
            **validated_data
        )
        
        if not success:
            raise serializers.ValidationError(result)
            
        return result


class DocumentSignatureSerializer(serializers.ModelSerializer):
    """Serializer para assinaturas de documento"""
    
    document_name = serializers.CharField(source='document.original_filename', read_only=True)
    signer_name = serializers.CharField(source='signer.full_name', read_only=True)
    signer_email = serializers.CharField(source='signer.email', read_only=True)
    certificate_subject = serializers.CharField(source='certificate.subject_name', read_only=True)
    is_valid_signature = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentSignature
        fields = [
            'id', 'document', 'document_name', 'signature_request',
            'signer', 'signer_name', 'signer_email', 'certificate',
            'certificate_subject', 'signature_type', 'hash_algorithm',
            'document_hash', 'signing_reason', 'signing_location',
            'contact_info', 'page_number', 'position_x', 'position_y',
            'width', 'height', 'status', 'validation_info',
            'signed_at', 'validated_at', 'ip_address', 'user_agent',
            'geolocation', 'is_valid_signature'
        ]
        read_only_fields = [
            'id', 'document_hash', 'signed_at', 'validated_at',
            'validation_info', 'is_valid_signature'
        ]
    
    def get_is_valid_signature(self, obj):
        """Verifica se a assinatura é válida"""
        return obj.status == 'valid'


class SignatureAuditLogSerializer(serializers.ModelSerializer):
    """Serializer para logs de auditoria"""
    
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    signature_request_title = serializers.CharField(
        source='signature_request.title', 
        read_only=True
    )
    
    class Meta:
        model = SignatureAuditLog
        fields = [
            'id', 'signature_request', 'signature_request_title',
            'document_signature', 'certificate', 'action', 'action_display',
            'description', 'user', 'user_email', 'user_name',
            'ip_address', 'user_agent', 'metadata', 'created_at'
        ]
        read_only_fields = [
            'id', 'signature_request', 'signature_request_title',
            'document_signature', 'certificate', 'action', 'action_display',
            'description', 'user', 'user_email', 'user_name',
            'ip_address', 'user_agent', 'metadata', 'created_at'
        ]


class SignatureBatchSerializer(serializers.ModelSerializer):
    """Serializer para lotes de assinatura"""
    
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    documents_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SignatureBatch
        fields = [
            'id', 'name', 'description', 'template', 'template_name',
            'status', 'total_documents', 'processed_documents',
            'successful_signatures', 'failed_signatures', 'documents_count',
            'auto_send_notifications', 'expires_at', 'created_at',
            'updated_at', 'created_by', 'created_by_name', 'started_at',
            'completed_at', 'progress_percentage'
        ]
        read_only_fields = [
            'id', 'status', 'total_documents', 'processed_documents',
            'successful_signatures', 'failed_signatures', 'created_at',
            'updated_at', 'created_by', 'started_at', 'completed_at',
            'progress_percentage'
        ]
    
    def get_documents_count(self, obj):
        """Conta documentos no lote"""
        return obj.documents.count()


class SignatureBatchCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de lote de assinatura"""
    
    documents = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        help_text="Lista de IDs dos documentos"
    )
    signers = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        help_text="Lista de assinantes"
    )
    
    class Meta:
        model = SignatureBatch
        fields = [
            'name', 'description', 'template', 'documents', 'signers',
            'auto_send_notifications', 'expires_at'
        ]
    
    def validate_documents(self, value):
        """Valida documentos do lote"""
        if not value:
            raise serializers.ValidationError("Deve haver pelo menos um documento")
        
        from ordoc_ai.authentication import get_current_organization
        organization = get_current_organization(self.context['request'])
        
        # Verificar se todos os documentos existem e pertencem à organização
        existing_docs = Document.objects.filter(
            id__in=value,
            department__organization=organization
        ).values_list('id', flat=True)
        
        missing_docs = set(value) - set(existing_docs)
        if missing_docs:
            raise serializers.ValidationError(
                f"Documentos não encontrados: {list(missing_docs)}"
            )
        
        return value
    
    def validate_signers(self, value):
        """Valida assinantes do lote"""
        if not value:
            raise serializers.ValidationError("Deve haver pelo menos um assinante")
        
        # Reutilizar validação do SignatureRequestCreateSerializer
        serializer = SignatureRequestCreateSerializer()
        return serializer.validate_signers(value)
    
    def create(self, validated_data):
        """Cria lote de assinatura"""
        from .services import SignatureBatchService
        
        documents_ids = validated_data.pop('documents')
        signers_data = validated_data.pop('signers')
        
        # A organização é passada via perform_create do ViewSet
        organization = validated_data.pop('organization', None)
        if not organization:
            from ordoc_ai.authentication import get_current_organization
            organization = get_current_organization(self.context['request'])
            
        created_by = self.context['request'].user
        
        # Buscar documentos
        documents = Document.objects.filter(
            id__in=documents_ids,
            department__organization=organization
        )
        
        success, result = SignatureBatchService.create_signature_batch(
            organization=organization,
            documents=list(documents),
            signers_data=signers_data,
            created_by=created_by,
            **validated_data
        )
        
        if not success:
            raise serializers.ValidationError(result)
        
        return result


class SignatureStatsSerializer(serializers.Serializer):
    """Serializer para estatísticas de assinatura"""
    
    period = serializers.DictField(read_only=True)
    summary = serializers.DictField(read_only=True)
    status_distribution = serializers.DictField(read_only=True)
    top_certificates = serializers.ListField(read_only=True)
    generated_at = serializers.DateTimeField(read_only=True)


class SignDocumentSerializer(serializers.Serializer):
    """Serializer para assinar documento"""
    
    certificate_id = serializers.UUIDField()
    signature_data = serializers.CharField(help_text="Dados da assinatura em base64")
    signing_reason = serializers.CharField(required=False, allow_blank=True)
    signing_location = serializers.CharField(required=False, allow_blank=True)
    contact_info = serializers.CharField(required=False, allow_blank=True)
    
    # Posicionamento visual (opcional)
    page_number = serializers.IntegerField(required=False, min_value=1)
    position_x = serializers.FloatField(required=False, min_value=0)
    position_y = serializers.FloatField(required=False, min_value=0)
    width = serializers.FloatField(required=False, min_value=0)
    height = serializers.FloatField(required=False, min_value=0)
    
    def validate_certificate_id(self, value):
        """Valida se o certificado existe e é válido"""
        try:
            certificate = DigitalCertificate.objects.get(id=value)
            
            if not certificate.is_valid:
                raise serializers.ValidationError("Certificado inválido ou expirado")
            
            return value
        except DigitalCertificate.DoesNotExist:
            raise serializers.ValidationError("Certificado não encontrado")
    
    def validate_signature_data(self, value):
        """Valida dados da assinatura"""
        try:
            # Verificar se é base64 válido
            import base64
            base64.b64decode(value)
            return value
        except Exception:
            raise serializers.ValidationError("Dados de assinatura inválidos")


class CertificateVerificationSerializer(serializers.Serializer):
    """Serializer para verificação de certificado"""
    
    is_valid = serializers.BooleanField(read_only=True)
    message = serializers.CharField(read_only=True)
    details = serializers.DictField(read_only=True)


class SignatureVerificationSerializer(serializers.Serializer):
    """Serializer para verificação de assinatura"""
    
    is_valid = serializers.BooleanField(read_only=True)
    message = serializers.CharField(read_only=True)
    certificate_valid = serializers.BooleanField(read_only=True)
    document_integrity = serializers.BooleanField(read_only=True)
    signature_valid = serializers.BooleanField(read_only=True)
    verified_at = serializers.DateTimeField(read_only=True)
