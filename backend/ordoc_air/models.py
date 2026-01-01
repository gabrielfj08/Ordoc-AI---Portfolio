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
    if instance.directory and instance.directory.department:
        return f"documents/{instance.directory.department.organization.id}/{instance.directory.id}/{filename}"
    return f"documents/orphan/{filename}"


class Tag(models.Model):
    """Modelo para etiquetas/tags de documentos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Nome")
    slug = models.SlugField(max_length=100, verbose_name="Slug")
    color = models.CharField(max_length=7, default="#3B82F6", verbose_name="Cor")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")

    # Relations
    organization = models.ForeignKey(
        'Organization',
        on_delete=models.CASCADE,
        related_name='tags',
        verbose_name="Organização"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']
        unique_together = ['organization', 'slug']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class CategorizationRule(models.Model):
    """Modelo para regras de auto-categorização"""
    
    MATCH_TYPE_CHOICES = [
        ('exact', 'Correspondência Exata'),
        ('contains', 'Contém'),
        ('regex', 'Expressão Regular'),
        ('similarity', 'Similaridade (IA)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome da Regra")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    
    # Matching logic
    match_type = models.CharField(max_length=20, choices=MATCH_TYPE_CHOICES, default='contains', verbose_name="Tipo de Correspondência")
    pattern = models.CharField(max_length=500, verbose_name="Padrão de Busca")
    is_active = models.BooleanField(default=True, verbose_name="Ativa")
    
    # Actions
    target_tag = models.ForeignKey(Tag, on_delete=models.SET_NULL, null=True, blank=True, related_name='rules', verbose_name="Aplicar Tag")
    target_directory = models.ForeignKey(Directory, on_delete=models.SET_NULL, null=True, blank=True, related_name='rules', verbose_name="Mover para Diretório")
    
    # Organization context
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='categorization_rules')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Regra de Categorização"
        verbose_name_plural = "Regras de Categorização"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_match_type_display()})"


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
    ocr_language = models.CharField(max_length=10, blank=True, null=True, verbose_name="Idioma OCR")

    # Storage
    storage_key = models.CharField(max_length=500, blank=True, null=True, verbose_name="Chave de Armazenamento")

    # Archiving
    archived_at = models.DateTimeField(null=True, blank=True, verbose_name="Arquivado em")
    archived_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='archived_documents',
        verbose_name="Arquivado por"
    )

    # Relations
    directory = models.ForeignKey(Directory, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    tags = models.ManyToManyField(Tag, blank=True, related_name='documents', verbose_name="Tags")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Document status for Gmail-like views
    DOCUMENT_STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('archived', 'Arquivado'),
        ('trashed', 'Lixeira'),
        ('draft', 'Rascunho'),
    ]
    document_status = models.CharField(
        max_length=20,
        choices=DOCUMENT_STATUS_CHOICES,
        default='active',
        verbose_name="Status do Documento",
        db_index=True
    )
    
    # Gmail-like flags
    starred = models.BooleanField(default=False, verbose_name="Marcado com Estrela", db_index=True)
    unread = models.BooleanField(default=True, verbose_name="Não Lido")
    needs_signature = models.BooleanField(default=False, verbose_name="Aguardando Assinatura")
    is_shared = models.BooleanField(default=False, verbose_name="Compartilhado", db_index=True)
    
    # Hidden for specific users (when user "deletes" a shared document)
    hidden_for_users = models.ManyToManyField(
        User, 
        blank=True, 
        related_name='hidden_documents',
        verbose_name="Oculto para Usuários"
    )
    
    # User tracking
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_documents')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_documents')
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='deleted_documents')
    
    # Favorites
    favorited_by = models.ManyToManyField(User, related_name='favorite_documents', blank=True, verbose_name="Favoritado por")

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

    def archive(self, user=None):
        """Arquiva o documento"""
        self.archived_at = timezone.now()
        if user:
            self.archived_by = user
        self.save(update_fields=['archived_at', 'archived_by', 'updated_at'])

    def unarchive(self):
        """Remove o documento do arquivo"""
        self.archived_at = None
        self.archived_by = None
        self.save(update_fields=['archived_at', 'archived_by', 'updated_at'])

    @property
    def is_archived(self):
        """Verifica se o documento está arquivado"""
        return self.archived_at is not None

    @property
    def ocr_content(self):
        """Alias for extracted_text for backward compatibility"""
        return self.extracted_text

    @ocr_content.setter
    def ocr_content(self, value):
        """Setter alias for extracted_text"""
        self.extracted_text = value


class ActivityLog(models.Model):
    """Modelo para registro de atividades/auditoria"""

    ACTION_CHOICES = [
        ('create', 'Criação'),
        ('read', 'Leitura'),
        ('update', 'Atualização'),
        ('delete', 'Exclusão'),
        ('download', 'Download'),
        ('share', 'Compartilhamento'),
        ('archive', 'Arquivamento'),
        ('restore', 'Restauração'),
        ('move', 'Movimentação'),
        ('copy', 'Cópia'),
        ('version', 'Nova Versão'),
        ('permission', 'Alteração de Permissão'),
        ('ocr', 'Processamento OCR'),
    ]

    ENTITY_CHOICES = [
        ('document', 'Documento'),
        ('directory', 'Diretório'),
        ('organization', 'Organização'),
        ('department', 'Departamento'),
        ('shareable_link', 'Link Compartilhável'),
        ('permission', 'Permissão'),
        ('tag', 'Tag'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, verbose_name="Ação")
    entity_type = models.CharField(max_length=20, choices=ENTITY_CHOICES, verbose_name="Tipo de Entidade")
    entity_id = models.UUIDField(verbose_name="ID da Entidade")
    entity_name = models.CharField(max_length=500, blank=True, null=True, verbose_name="Nome da Entidade")

    # Details
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    old_values = models.JSONField(blank=True, null=True, verbose_name="Valores Anteriores")
    new_values = models.JSONField(blank=True, null=True, verbose_name="Novos Valores")
    metadata = models.JSONField(blank=True, null=True, verbose_name="Metadados")

    # Context
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name="Endereço IP")
    user_agent = models.TextField(blank=True, null=True, verbose_name="User Agent")

    # Relations
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='activity_logs')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='activity_logs')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Log de Atividade"
        verbose_name_plural = "Logs de Atividade"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['action']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        user_name = self.user.username if self.user else 'Sistema'
        return f"{user_name} - {self.get_action_display()} - {self.entity_name or self.entity_id}"

    @classmethod
    def log(cls, action, entity_type, entity_id, user=None, organization=None,
            entity_name=None, description=None, old_values=None, new_values=None,
            metadata=None, ip_address=None, user_agent=None):
        """Helper method to create activity logs"""
        return cls.objects.create(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            entity_name=entity_name,
            description=description,
            old_values=old_values,
            new_values=new_values,
            metadata=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
            user=user,
            organization=organization,
        )


class ShareableLink(models.Model):
    """Modelo para links compartilháveis de documentos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.CharField(max_length=100, unique=True, verbose_name="Token")
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name="Expira em")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")

    # Access control
    access_count = models.PositiveIntegerField(default=0, verbose_name="Contador de Acessos")
    max_access_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="Máximo de Acessos")
    download_count = models.PositiveIntegerField(default=0, verbose_name="Contador de Downloads")
    max_downloads = models.PositiveIntegerField(null=True, blank=True, verbose_name="Máximo de Downloads")

    # Security
    password = models.CharField(max_length=128, blank=True, null=True, verbose_name="Senha")

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

    def is_expired(self):
        """Verifica se o link está expirado"""
        if not self.is_active:
            return True
        if self.expires_at and timezone.now() > self.expires_at:
            return True
        if self.max_access_count and self.access_count >= self.max_access_count:
            return True
        if self.max_downloads and self.download_count >= self.max_downloads:
            return True
        return False

    def can_access(self):
        """Verifica se o link pode ser acessado"""
        return not self.is_expired()

    def increment_access(self):
        """Incrementa o contador de acessos"""
        self.access_count += 1
        self.save(update_fields=['access_count', 'updated_at'])

    def increment_download(self):
        """Incrementa o contador de downloads"""
        self.download_count += 1
        self.save(update_fields=['download_count', 'updated_at'])


class RecentDocument(models.Model):
    """Modelo para rastrear documentos acessados recentemente"""

    ACCESS_TYPE_CHOICES = [
        ('view', 'Visualização'),
        ('download', 'Download'),
        ('edit', 'Edição'),
        ('share', 'Compartilhamento'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Access tracking
    access_type = models.CharField(
        max_length=20,
        choices=ACCESS_TYPE_CHOICES,
        default='view',
        verbose_name="Tipo de Acesso"
    )

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
        return f"{self.user.username} - {self.document.name} ({self.access_type})"


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


class DocumentTemplate(models.Model):
    """Modelo para templates de documentos"""
    
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('active', 'Ativo'),
        ('archived', 'Arquivado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    category = models.CharField(max_length=100, verbose_name="Categoria")
    version = models.CharField(max_length=20, default='1.0', verbose_name="Versão")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Status")
    
    # Template file
    file = models.FileField(
        upload_to='templates/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'txt', 'odt'])],
        verbose_name="Arquivo Template"
    )
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0, verbose_name="Contador de Uso")
    
    # Relations
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='document_templates',
        verbose_name="Organização"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='templates', verbose_name="Tags")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # User tracking
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_templates')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_templates')
    
    class Meta:
        verbose_name = "Template de Documento"
        verbose_name_plural = "Templates de Documentos"
        ordering = ['-usage_count', 'name']
        unique_together = ['organization', 'name', 'version']
    
    def __str__(self):
        return f"{self.name} v{self.version}"
    
    def increment_usage(self):
        """Incrementa o contador de uso"""
        self.usage_count += 1
        self.save(update_fields=['usage_count', 'updated_at'])


# ============================================
# COMPLIANCE: e-ARQ Brasil + Legal Hold
# ============================================

class RetentionSchedule(models.Model):
    """
    Tabela de Temporalidade (e-ARQ Brasil)
    Define prazos de guarda e destinação final por tipo documental
    """

    PHASE_CHOICES = [
        ('current', 'Corrente'),           # Fase corrente - documentos em uso frequente
        ('intermediate', 'Intermediária'),  # Fase intermediária - uso esporádico
        ('permanent', 'Permanente'),        # Guarda permanente
    ]

    DISPOSITION_CHOICES = [
        ('eliminate', 'Eliminação'),           # Documentos podem ser eliminados
        ('permanent_custody', 'Guarda Permanente'),  # Documentos de valor histórico
        ('review', 'Reavaliação'),             # Requer reavaliação antes de destinação
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Classificação
    code = models.CharField(max_length=50, verbose_name="Código de Classificação")
    activity = models.CharField(max_length=255, verbose_name="Atividade/Tipo Documental")
    description = models.TextField(verbose_name="Descrição")

    # Prazos de guarda (em anos)
    current_phase_years = models.PositiveIntegerField(
        default=2,
        verbose_name="Prazo Fase Corrente (anos)"
    )
    intermediate_phase_years = models.PositiveIntegerField(
        default=5,
        verbose_name="Prazo Fase Intermediária (anos)"
    )

    # Destinação final
    final_disposition = models.CharField(
        max_length=20,
        choices=DISPOSITION_CHOICES,
        verbose_name="Destinação Final"
    )

    # Base legal
    legal_basis = models.TextField(
        blank=True,
        verbose_name="Fundamento Legal"
    )

    # Status
    is_active = models.BooleanField(default=True, verbose_name="Ativa")

    # Relations
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='retention_schedules',
        verbose_name="Organização"
    )
    document_type = models.ForeignKey(
        DocumentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='retention_schedule',
        verbose_name="Tipo de Documento"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # User tracking
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_retention_schedules'
    )

    class Meta:
        verbose_name = "Tabela de Temporalidade"
        verbose_name_plural = "Tabelas de Temporalidade"
        ordering = ['code', 'activity']
        indexes = [
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['code']),
        ]

    def __str__(self):
        return f"{self.code} - {self.activity}"

    def get_total_retention_years(self):
        """Calcula prazo total de guarda"""
        if self.final_disposition == 'permanent_custody':
            return None  # Guarda permanente
        return self.current_phase_years + self.intermediate_phase_years


class DocumentRetentionStatus(models.Model):
    """
    Status de retenção de cada documento conforme tabela de temporalidade
    Permite rastrear ciclo de vida do documento
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relations
    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name='retention_status',
        verbose_name="Documento"
    )
    retention_schedule = models.ForeignKey(
        RetentionSchedule,
        on_delete=models.PROTECT,
        related_name='documents',
        verbose_name="Tabela de Temporalidade"
    )

    # Datas do ciclo de vida
    current_phase_start = models.DateField(
        auto_now_add=True,
        verbose_name="Início Fase Corrente"
    )
    current_phase_end = models.DateField(
        null=True,
        blank=True,
        verbose_name="Fim Fase Corrente"
    )
    intermediate_phase_start = models.DateField(
        null=True,
        blank=True,
        verbose_name="Início Fase Intermediária"
    )
    intermediate_phase_end = models.DateField(
        null=True,
        blank=True,
        verbose_name="Fim Fase Intermediária"
    )

    # Destinação
    disposition_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Data de Destinação"
    )
    disposition_approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_dispositions',
        verbose_name="Aprovado por"
    )

    # Observações
    notes = models.TextField(blank=True, verbose_name="Observações")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Status de Retenção"
        verbose_name_plural = "Status de Retenção"
        indexes = [
            models.Index(fields=['current_phase_end']),
            models.Index(fields=['intermediate_phase_end']),
        ]

    def __str__(self):
        return f"Retenção: {self.document.title}"

    def is_eligible_for_disposition(self):
        """Verifica se documento está elegível para destinação final"""
        if not self.intermediate_phase_end:
            return False
        return timezone.now().date() >= self.intermediate_phase_end


class LegalHold(models.Model):
    """
    Legal Hold - Suspensão legal de eliminação de documentos
    Documentos sob custódia não podem ser alterados/eliminados
    """

    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('released', 'Liberado'),
        ('expired', 'Expirado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Identificação
    case_number = models.CharField(
        max_length=100,
        verbose_name="Número do Processo/Caso"
    )
    title = models.CharField(max_length=255, verbose_name="Título")
    description = models.TextField(verbose_name="Descrição")

    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name="Status"
    )

    # Datas
    effective_date = models.DateField(
        default=timezone.now,
        verbose_name="Data de Vigência"
    )
    release_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Data de Liberação"
    )

    # Autoridade legal
    issuing_authority = models.CharField(
        max_length=255,
        verbose_name="Autoridade Emissora"
    )
    legal_basis = models.TextField(verbose_name="Fundamento Legal")

    # Relations
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='legal_holds',
        verbose_name="Organização"
    )
    documents = models.ManyToManyField(
        Document,
        related_name='legal_holds',
        verbose_name="Documentos"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # User tracking
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_legal_holds',
        verbose_name="Criado por"
    )
    released_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='released_legal_holds',
        verbose_name="Liberado por"
    )

    # Notificações
    custodians_notified = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Custodiantes Notificados"
    )

    class Meta:
        verbose_name = "Legal Hold"
        verbose_name_plural = "Legal Holds"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['case_number']),
            models.Index(fields=['effective_date']),
        ]

    def __str__(self):
        return f"Legal Hold: {self.case_number} - {self.title}"

    def release(self, user):
        """Libera o legal hold"""
        self.status = 'released'
        self.release_date = timezone.now().date()
        self.released_by = user
        self.save()

    def is_document_on_hold(self, document):
        """Verifica se documento está sob legal hold ativo"""
        return self.status == 'active' and document in self.documents.all()
