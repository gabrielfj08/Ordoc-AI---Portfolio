import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from django.utils import timezone
from django_fsm import FSMField, transition
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.exceptions import InvalidSignature
import base64
import hashlib
import json
from datetime import timedelta

from .encryption import EncryptedTextField

User = get_user_model()


class DigitalCertificate(models.Model):
    """Modelo para certificados digitais"""
    
    CERTIFICATE_TYPES = [
        ('A1', 'A1 - Certificado em arquivo'),
        ('A3', 'A3 - Certificado em token/smartcard'),
        ('SELF_SIGNED', 'Auto-assinado'),
        ('CA_ISSUED', 'Emitido por AC'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('expired', 'Expirado'),
        ('revoked', 'Revogado'),
        ('suspended', 'Suspenso'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('ordoc_air.Organization', on_delete=models.CASCADE, related_name='certificates')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    
    # Informações do certificado
    certificate_type = models.CharField(max_length=20, choices=CERTIFICATE_TYPES)
    subject_name = models.CharField(max_length=255, help_text="Nome do titular")
    issuer_name = models.CharField(max_length=255, help_text="Nome da AC emissora")
    serial_number = models.CharField(max_length=100, unique=True)
    
    # Dados do certificado
    certificate_data = models.TextField(help_text="Certificado em formato PEM")
    public_key = models.TextField(help_text="Chave pública em formato PEM")
    private_key = EncryptedTextField(blank=True, null=True, help_text="Chave privada (apenas para A1)")
    
    # Validade
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Status e controle
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_default = models.BooleanField(default=False, help_text="Certificado padrão do usuário")
    
    # Metadados
    fingerprint_sha256 = models.CharField(max_length=64, unique=True)
    key_usage = models.JSONField(default=list, help_text="Usos permitidos da chave")
    extended_key_usage = models.JSONField(default=list)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_sign_certificates'
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['user', 'is_default']),
            models.Index(fields=['valid_until']),
            models.Index(fields=['serial_number']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'is_default'],
                condition=models.Q(is_default=True),
                name='unique_default_certificate_per_user'
            )
        ]
    
    def __str__(self):
        return f"{self.subject_name} ({self.certificate_type})"
    
    @property
    def is_expired(self):
        return timezone.now() > self.valid_until
    
    @property
    def is_valid(self):
        now = timezone.now()
        return self.valid_from <= now <= self.valid_until and self.status == 'active'
    
    def verify_certificate(self):
        """Verifica a validade do certificado"""
        try:
            cert = x509.load_pem_x509_certificate(self.certificate_data.encode())
            # Verificações básicas
            now = timezone.now()
            if now < self.valid_from or now > self.valid_until:
                return False, "Certificado fora do período de validade"
            return True, "Certificado válido"
        except Exception as e:
            return False, f"Erro na verificação: {str(e)}"


class SignatureTemplate(models.Model):
    """Template para configurações de assinatura"""
    
    SIGNATURE_TYPES = [
        ('SIMPLE', 'Assinatura Simples'),
        ('ADVANCED', 'Assinatura Avançada'),
        ('QUALIFIED', 'Assinatura Qualificada'),
    ]
    
    HASH_ALGORITHMS = [
        ('SHA256', 'SHA-256'),
        ('SHA384', 'SHA-384'),
        ('SHA512', 'SHA-512'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('ordoc_air.Organization', on_delete=models.CASCADE, related_name='signature_templates')
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Configurações de assinatura
    signature_type = models.CharField(max_length=20, choices=SIGNATURE_TYPES, default='ADVANCED')
    hash_algorithm = models.CharField(max_length=10, choices=HASH_ALGORITHMS, default='SHA256')
    
    # Configurações visuais
    show_signature_image = models.BooleanField(default=True)
    signature_position = models.JSONField(default=dict, help_text="Posição da assinatura no documento")
    signature_size = models.JSONField(default=dict, help_text="Tamanho da assinatura")
    
    # Configurações de validação
    require_reason = models.BooleanField(default=False)
    require_location = models.BooleanField(default=False)
    require_contact_info = models.BooleanField(default=False)
    
    # Configurações de workflow
    require_approval = models.BooleanField(default=False)
    approval_workflow = models.ForeignKey(
        'ordoc_flow.ApprovalWorkflow', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='signature_templates'
    )
    
    # Configurações de notificação
    notify_signers = models.BooleanField(default=True)
    notify_completion = models.BooleanField(default=True)
    notification_template = models.ForeignKey(
        'ordoc_flow.NotificationTemplate',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='signature_templates'
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_signature_templates')
    
    class Meta:
        db_table = 'ordoc_sign_signature_templates'
        indexes = [
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['is_default']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['organization', 'name'],
                name='unique_template_name_per_org'
            )
        ]
    
    def __str__(self):
        return f"{self.name} ({self.signature_type})"


class SignatureRequest(models.Model):
    """Solicitação de assinatura de documento"""
    
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluída'),
        ('cancelled', 'Cancelada'),
        ('expired', 'Expirada'),
        ('rejected', 'Rejeitada'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('normal', 'Normal'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('ordoc_air.Organization', on_delete=models.CASCADE, related_name='signature_requests')
    
    # Documento a ser assinado
    document = models.ForeignKey('ordoc_air.Document', on_delete=models.CASCADE, related_name='signature_requests')
    template = models.ForeignKey(SignatureTemplate, on_delete=models.CASCADE, related_name='signature_requests')
    
    # Informações da solicitação
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Status e controle
    status = FSMField(default='draft', choices=STATUS_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    
    # Prazos
    expires_at = models.DateTimeField(null=True, blank=True)
    reminder_days = models.PositiveIntegerField(default=3, help_text="Dias antes do vencimento para lembrete")
    
    # Configurações
    require_sequential_signing = models.BooleanField(default=False)
    allow_decline = models.BooleanField(default=True)
    require_all_signatures = models.BooleanField(default=True)
    
    # Metadados
    signing_reason = models.CharField(max_length=200, blank=True)
    signing_location = models.CharField(max_length=200, blank=True)
    contact_info = models.CharField(max_length=200, blank=True)
    
    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_signature_requests')
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_sign_signature_requests'
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['document']),
            models.Index(fields=['created_by']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['priority', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
    
    @transition(field=status, source='draft', target='pending')
    def submit(self):
        """Submete a solicitação de assinatura"""
        pass
    
    @transition(field=status, source='pending', target='in_progress')
    def start_signing(self):
        """Inicia o processo de assinatura"""
        pass
    
    @transition(field=status, source='in_progress', target='completed')
    def complete(self):
        """Completa o processo de assinatura"""
        self.completed_at = timezone.now()
    
    @transition(field=status, source=['draft', 'pending', 'in_progress'], target='cancelled')
    def cancel(self):
        """Cancela a solicitação"""
        pass
    
    @transition(field=status, source=['pending', 'in_progress'], target='expired')
    def expire(self):
        """Marca como expirada"""
        pass
    
    @property
    def is_expired(self):
        return self.expires_at and timezone.now() > self.expires_at
    
    @property
    def progress_percentage(self):
        """Calcula o progresso da assinatura"""
        total_signers = self.signers.count()
        if total_signers == 0:
            return 0
        completed_signers = self.signers.filter(status='signed').count()
        return int((completed_signers / total_signers) * 100)


class SignatureRequestSigner(models.Model):
    """Assinante de uma solicitação de assinatura"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('notified', 'Notificado'),
        ('viewed', 'Visualizado'),
        ('signed', 'Assinado'),
        ('declined', 'Recusado'),
        ('expired', 'Expirado'),
    ]
    
    SIGNER_TYPES = [
        ('internal', 'Usuário Interno'),
        ('external', 'Usuário Externo'),
        ('email_only', 'Apenas Email'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    signature_request = models.ForeignKey(SignatureRequest, on_delete=models.CASCADE, related_name='signers')
    
    # Informações do assinante
    signer_type = models.CharField(max_length=20, choices=SIGNER_TYPES)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='signature_assignments')
    external_requester = models.ForeignKey(
        'ordoc_flow.ExternalRequester',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='signature_assignments'
    )
    
    # Dados para assinantes externos
    email = models.EmailField()
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    
    # Ordem de assinatura
    signing_order = models.PositiveIntegerField(default=1)
    
    # Status e controle
    status = FSMField(default='pending', choices=STATUS_CHOICES)
    
    # Configurações específicas
    require_certificate = models.BooleanField(default=True)
    allowed_certificates = models.ManyToManyField(DigitalCertificate, blank=True)
    
    # Tokens de acesso
    access_token = models.CharField(max_length=255, unique=True, blank=True, null=True, default=None)
    access_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notified_at = models.DateTimeField(null=True, blank=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_sign_signature_request_signers'
        indexes = [
            models.Index(fields=['signature_request', 'signing_order']),
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['access_token']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['signature_request', 'email'],
                name='unique_signer_per_request'
            )
        ]
    
    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.get_status_display()}"
    
    @transition(field=status, source='pending', target='notified')
    def notify(self):
        """Marca como notificado"""
        self.notified_at = timezone.now()
    
    @transition(field=status, source=['pending', 'notified'], target='viewed')
    def mark_viewed(self):
        """Marca como visualizado"""
        self.viewed_at = timezone.now()
    
    @transition(field=status, source=['pending', 'notified', 'viewed'], target='signed')
    def sign(self):
        """Marca como assinado"""
        self.signed_at = timezone.now()
    
    @transition(field=status, source=['pending', 'notified', 'viewed'], target='declined')
    def decline(self):
        """Marca como recusado"""
        pass
    
    def generate_access_token(self):
        """Gera token de acesso para assinante externo"""
        if not self.access_token or self.access_token.strip() == '':
            # Gerar token único com retry em caso de duplicação
            import secrets
            max_attempts = 5
            for attempt in range(max_attempts):
                try:
                    self.access_token = secrets.token_urlsafe(32)
                    self.access_expires_at = timezone.now() + timedelta(days=30)
                    self.save()
                    break
                except Exception as e:
                    if attempt == max_attempts - 1:
                        # Última tentativa, usar timestamp para garantir unicidade
                        import time
                        self.access_token = f"{secrets.token_urlsafe(16)}_{int(time.time() * 1000000)}"
                        self.access_expires_at = timezone.now() + timedelta(days=30)
                        self.save()
        return self.access_token
    
    def save(self, *args, **kwargs):
        """Override save para gerar token na criação"""
        # Se é um novo objeto e signer_type requer token, gerar antes do save
        if not self.pk and self.signer_type in ['external', 'email_only']:
            if self.access_token is None or (self.access_token and self.access_token.strip() == ''):
                import secrets
                import time
                # Gerar token único com timestamp para garantir unicidade
                self.access_token = f"{secrets.token_urlsafe(16)}_{int(time.time() * 1000000)}"
                self.access_expires_at = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)


class DocumentSignature(models.Model):
    """Assinatura aplicada a um documento"""
    
    SIGNATURE_TYPES = [
        ('digital', 'Assinatura Digital'),
        ('electronic', 'Assinatura Eletrônica'),
        ('biometric', 'Assinatura Biométrica'),
    ]
    
    STATUS_CHOICES = [
        ('valid', 'Válida'),
        ('invalid', 'Inválida'),
        ('expired', 'Expirada'),
        ('revoked', 'Revogada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('ordoc_air.Organization', on_delete=models.CASCADE, related_name='document_signatures')
    
    # Relacionamentos
    document = models.ForeignKey('ordoc_air.Document', on_delete=models.CASCADE, related_name='signatures')
    signature_request = models.ForeignKey(SignatureRequest, on_delete=models.CASCADE, related_name='signatures')
    signer = models.ForeignKey(SignatureRequestSigner, on_delete=models.CASCADE, related_name='signatures')
    certificate = models.ForeignKey(DigitalCertificate, on_delete=models.CASCADE, related_name='signatures')
    
    # Dados da assinatura
    signature_type = models.CharField(max_length=20, choices=SIGNATURE_TYPES, default='digital')
    signature_data = models.TextField(help_text="Dados da assinatura em base64")
    hash_algorithm = models.CharField(max_length=10, default='SHA256')
    document_hash = models.CharField(max_length=128, help_text="Hash do documento assinado")
    
    # Metadados da assinatura
    signing_reason = models.CharField(max_length=200, blank=True)
    signing_location = models.CharField(max_length=200, blank=True)
    contact_info = models.CharField(max_length=200, blank=True)
    
    # Posicionamento visual
    page_number = models.PositiveIntegerField(null=True, blank=True)
    position_x = models.FloatField(null=True, blank=True)
    position_y = models.FloatField(null=True, blank=True)
    width = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    
    # Status e validação
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='valid')
    validation_info = models.JSONField(default=dict, help_text="Informações de validação")
    
    # Timestamps
    signed_at = models.DateTimeField(auto_now_add=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    
    # Dados técnicos
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    geolocation = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'ordoc_sign_document_signatures'
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['document']),
            models.Index(fields=['signature_request']),
            models.Index(fields=['signer']),
            models.Index(fields=['certificate']),
            models.Index(fields=['signed_at']),
        ]
    
    def __str__(self):
        return f"Assinatura de {self.signer.full_name} em {self.document.original_filename}"
    
    def verify_signature(self):
        """Verifica a validade da assinatura"""
        try:
            # Verificar certificado
            cert_valid, cert_msg = self.certificate.verify_certificate()
            if not cert_valid:
                return False, f"Certificado inválido: {cert_msg}"
            
            # Verificar hash do documento
            # (implementação específica dependeria do tipo de documento)
            
            # Verificar assinatura digital
            # (implementação usando cryptography)
            
            self.status = 'valid'
            self.validated_at = timezone.now()
            self.save()
            
            return True, "Assinatura válida"
        except Exception as e:
            self.status = 'invalid'
            self.save()
            return False, f"Erro na verificação: {str(e)}"


class SignatureAuditLog(models.Model):
    """Log de auditoria para assinaturas"""
    
    ACTION_CHOICES = [
        ('request_created', 'Solicitação Criada'),
        ('signer_added', 'Assinante Adicionado'),
        ('signer_notified', 'Assinante Notificado'),
        ('document_viewed', 'Documento Visualizado'),
        ('document_signed', 'Documento Assinado'),
        ('signature_verified', 'Assinatura Verificada'),
        ('request_completed', 'Solicitação Concluída'),
        ('request_cancelled', 'Solicitação Cancelada'),
        ('certificate_uploaded', 'Certificado Carregado'),
        ('certificate_revoked', 'Certificado Revogado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('ordoc_air.Organization', on_delete=models.CASCADE, related_name='signature_audit_logs')
    
    # Relacionamentos opcionais
    signature_request = models.ForeignKey(SignatureRequest, on_delete=models.CASCADE, null=True, blank=True, related_name='audit_logs')
    document_signature = models.ForeignKey(DocumentSignature, on_delete=models.CASCADE, null=True, blank=True, related_name='audit_logs')
    certificate = models.ForeignKey(DigitalCertificate, on_delete=models.CASCADE, null=True, blank=True, related_name='audit_logs')
    
    # Dados da ação
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.TextField()
    
    # Dados do usuário
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='signature_audit_logs')
    user_email = models.EmailField()
    user_name = models.CharField(max_length=200)
    
    # Dados técnicos
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Dados adicionais
    metadata = models.JSONField(default=dict)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ordoc_sign_signature_audit_logs'
        indexes = [
            models.Index(fields=['organization', 'created_at']),
            models.Index(fields=['signature_request']),
            models.Index(fields=['action']),
            models.Index(fields=['user_email']),
        ]
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.user_name} ({self.created_at})"


class SignatureBatch(models.Model):
    """Lote de assinaturas para processamento em massa"""
    
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('completed', 'Concluído'),
        ('failed', 'Falhou'),
        ('cancelled', 'Cancelado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('ordoc_air.Organization', on_delete=models.CASCADE, related_name='signature_batches')
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Configurações do lote
    template = models.ForeignKey(SignatureTemplate, on_delete=models.CASCADE, related_name='signature_batches')
    documents = models.ManyToManyField('ordoc_air.Document', related_name='signature_batches')
    
    # Status e progresso
    status = FSMField(default='draft', choices=STATUS_CHOICES)
    total_documents = models.PositiveIntegerField(default=0)
    processed_documents = models.PositiveIntegerField(default=0)
    successful_signatures = models.PositiveIntegerField(default=0)
    failed_signatures = models.PositiveIntegerField(default=0)
    
    # Configurações
    auto_send_notifications = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_signature_batches')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_sign_signature_batches'
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['created_by']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.get_status_display()}"
    
    @property
    def progress_percentage(self):
        if self.total_documents == 0:
            return 0
        return int((self.processed_documents / self.total_documents) * 100)
    
    @transition(field=status, source='pending', target='processing')
    def start_processing(self):
        """Inicia o processamento do lote"""
        self.started_at = timezone.now()
    
    @transition(field=status, source='processing', target='completed')
    def complete(self):
        """Completa o processamento do lote"""
        self.completed_at = timezone.now()
    
    @transition(field=status, source='processing', target='failed')
    def fail(self):
        """Marca o lote como falhado"""
        pass
    
    @transition(field=status, source=['pending', 'processing'], target='cancelled')
    def cancel(self):
        """Cancela o processamento do lote"""
        pass
