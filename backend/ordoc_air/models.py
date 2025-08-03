from django.db import models
from django.contrib.auth.models import User, Group
from django.core.validators import FileExtensionValidator
from django_fsm import FSMField, transition
from django.utils import timezone
import uuid
import os


class Organization(models.Model):
    """Modelo para organizações - equivalente ao Organization do Rails"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    corporate_name = models.CharField(max_length=255, verbose_name="Razão Social")
    cnpj = models.CharField(max_length=14, unique=True, verbose_name="CNPJ")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Telefone")
    contact_name = models.CharField(max_length=255, verbose_name="Nome do Contato")
    contact_phone = models.CharField(max_length=20, verbose_name="Telefone do Contato")
    site = models.URLField(blank=True, null=True, verbose_name="Site")
    subdomain = models.CharField(max_length=100, unique=True, verbose_name="Subdomínio")
    prn = models.CharField(max_length=500, unique=True, verbose_name="PRN")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_organizations')
    
    class Meta:
        verbose_name = "Organização"
        verbose_name_plural = "Organizações"
        ordering = ['corporate_name']
    
    def __str__(self):
        return self.corporate_name


class Department(models.Model):
    """Modelo para departamentos dentro de organizações"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    prn = models.CharField(max_length=500, unique=True, verbose_name="PRN")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    # Relations
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments')
    parent_department = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subdepartments')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
        ordering = ['name']
        unique_together = ['organization', 'name']
    
    def __str__(self):
        return f"{self.organization.corporate_name} - {self.name}"


class Directory(models.Model):
    """Modelo para diretórios - estrutura hierárquica de pastas"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    path = models.TextField(verbose_name="Caminho")
    prn = models.CharField(max_length=500, unique=True, verbose_name="PRN")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    # Relations
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='directories')
    parent_directory = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subdirectories')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # User tracking
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_directories')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_directories')
    
    class Meta:
        verbose_name = "Diretório"
        verbose_name_plural = "Diretórios"
        ordering = ['path', 'name']
    
    def __str__(self):
        return f"{self.path}/{self.name}"
    
    def get_full_path(self):
        """Retorna o caminho completo do diretório"""
        if self.parent_directory:
            return f"{self.parent_directory.get_full_path()}/{self.name}"
        return f"/{self.department.name}/{self.name}"


def document_upload_path(instance, filename):
    """Função para definir o caminho de upload dos documentos"""
    return f"documents/{instance.directory.department.organization.id}/{instance.directory.id}/{filename}"


class Document(models.Model):
    """Modelo principal para documentos - equivalente ao Document do Rails"""
    
    # Status choices - equivalente ao enum do Rails
    STATUS_CHOICES = [
        ('created', 'Criado'),
        ('enqueued', 'Na Fila'),
        ('processed', 'Processado'),
        ('failed', 'Falhou'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=500, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    file_size = models.BigIntegerField(null=True, blank=True, verbose_name="Tamanho do Arquivo")
    mime_type = models.CharField(max_length=100, blank=True, null=True, verbose_name="Tipo MIME")
    prn = models.CharField(max_length=500, unique=True, verbose_name="PRN")

    # Versioning
    version = models.PositiveIntegerField(default=1)
    is_current_version = models.BooleanField(default=True)
    parent_document = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='versions'
    )
    
    # FSM Status field - equivalente ao AASM do Rails
    status = FSMField(default='created', choices=STATUS_CHOICES, verbose_name="Status")
    
    # File fields
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'])],
        verbose_name="Arquivo"
    )
    processed_file = models.FileField(
        upload_to=document_upload_path,
        blank=True,
        null=True,
        verbose_name="Arquivo Processado"
    )
    
    # OCR and search fields
    extracted_text = models.TextField(blank=True, null=True, verbose_name="Texto Extraído")
    ocr_confidence = models.FloatField(null=True, blank=True, verbose_name="Confiança OCR")
    
    # Relations
    directory = models.ForeignKey(Directory, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # User tracking
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_documents')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_documents')
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='deleted_documents')

    # Process tracking
    enqueued_at = models.DateTimeField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)

    enqueued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='enqueued_documents')
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_documents')
    failed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='failed_documents')
    
    class Meta:
        verbose_name = "Documento"
        verbose_name_plural = "Documentos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['directory']),
        ]

    def __str__(self):
        return self.name

    # Backwards compatibility aliases
    @property
    def original_filename(self):  # pragma: no cover - temporary alias
        return self.name

    @original_filename.setter
    def original_filename(self, value):  # pragma: no cover
        self.name = value

    @property
    def content_type(self):  # pragma: no cover
        return self.mime_type

    @content_type.setter
    def content_type(self, value):  # pragma: no cover
        self.mime_type = value

    # FSM Transitions - equivalente ao AASM do Rails
    @transition(field=status, source='created', target='enqueued')
    def enqueue(self, user=None):
        """Enfileira o documento para processamento"""
        from .tasks import process_document_ocr

        self.enqueued_at = timezone.now()
        if user:
            self.enqueued_by = user
            self.updated_by = user
        process_document_ocr.delay(self.id)

    @transition(field=status, source=['enqueued', 'failed'], target='processed')
    def process(self, user=None):
        """Marca o documento como processado"""
        self.processed_at = timezone.now()
        if user:
            self.processed_by = user
            self.updated_by = user

    @transition(field=status, source=['enqueued', 'processed'], target='failed')
    def fail(self, user=None):
        """Marca o documento como falhou"""
        self.failed_at = timezone.now()
        if user:
            self.failed_by = user
            self.updated_by = user
    
    def get_file_extension(self):
        """Retorna a extensão do arquivo"""
        return os.path.splitext(self.name)[1].lower()
    
    def is_image(self):
        """Verifica se o documento é uma imagem"""
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
        return self.get_file_extension() in image_extensions
    
    def is_pdf(self):
        """Verifica se o documento é um PDF"""
        return self.get_file_extension() == '.pdf'

    def get_next_version_number(self):
        """Return the next version number for this document"""
        max_version = self.versions.aggregate(models.Max('version'))['version__max']
        if max_version is None:
            max_version = self.version
        return max_version + 1


class ShareableLink(models.Model):
    """Modelo para links compartilháveis de documentos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.CharField(max_length=100, unique=True, verbose_name="Token")
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name="Expira em")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    access_count = models.PositiveIntegerField(default=0, verbose_name="Contador de Acessos")
    max_access_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="Máximo de Acessos")
    
    # Relations
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='shareable_links')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_links')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Link Compartilhável"
        verbose_name_plural = "Links Compartilháveis"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Link para {self.document.name}"


class RecentDocument(models.Model):
    """Modelo para rastrear documentos acessados recentemente"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relations
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recent_documents')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='recent_accesses')
    
    # Timestamps
    accessed_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Documento Recente"
        verbose_name_plural = "Documentos Recentes"
        ordering = ['-accessed_at']
        unique_together = ['user', 'document']
    
    def __str__(self):
        return f"{self.user.username} - {self.document.name}"


class Permission(models.Model):
    """Modelo para permissões em documentos e diretórios"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relations
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
                             related_name='air_permissions')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True,
                              related_name='air_permissions')
    directory = models.ForeignKey('Directory', on_delete=models.CASCADE, null=True, blank=True,
                                  related_name='permissions')
    document = models.ForeignKey('Document', on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='permissions')

    permission = models.CharField(max_length=100, verbose_name="Permissão")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Permissão"
        verbose_name_plural = "Permissões"

    def __str__(self):
        target = self.directory or self.document
        subject = self.user or self.group
        return f"{subject} -> {self.permission} on {target}"
