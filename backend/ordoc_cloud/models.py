from django.db import models
from django.contrib.auth.models import AbstractUser, User
from django.core.validators import RegexValidator
from django.utils import timezone
from ordoc_air.models import Organization
import uuid
import pyotp
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class OrdocUser(models.Model):
    """
    Modelo para usuários do Ordoc-AI
    Estende o User padrão do Django com funcionalidades específicas do sistema
    """

    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('active', 'Ativo'),
        ('blocked', 'Bloqueado'),
        ('inactive', 'Inativo'),
    ]

    LANGUAGE_CHOICES = [
        ('pt-BR', 'Português (Brasil)'),
        ('en-US', 'English (US)'),
        ('es', 'Español'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ordoc_profile')

    # Status and authentication fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    failed_attempts = models.PositiveIntegerField(default=0)
    locked_at = models.DateTimeField(null=True, blank=True)
    last_login_at = models.DateTimeField(null=True, blank=True, verbose_name="Último login")
    last_login_ip = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP do último login")

    # Password security fields
    must_change_password = models.BooleanField(default=True, verbose_name="Deve trocar senha")
    password_changed_at = models.DateTimeField(null=True, blank=True, verbose_name="Senha alterada em")
    password_reset_token = models.CharField(max_length=100, null=True, blank=True)
    password_reset_sent_at = models.DateTimeField(null=True, blank=True)

    # Two-Factor Authentication
    two_factor_enabled = models.BooleanField(default=False, verbose_name="2FA habilitado")
    two_factor_secret = models.CharField(max_length=32, null=True, blank=True)
    two_factor_backup_codes = models.JSONField(default=list, blank=True)

    # Profile fields
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Telefone"
    )
    cpf = models.CharField(
        max_length=14,
        blank=True,
        null=True,
        verbose_name="CPF"
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        verbose_name="Data de nascimento"
    )
    registration_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Número de registro profissional"
    )
    send_welcome_email = models.BooleanField(
        default=True,
        verbose_name="Enviar email de boas-vindas"
    )
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Profile completion
    profile_complete = models.BooleanField(default=False, verbose_name="Perfil completo")

    # Preferences
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='pt-BR', verbose_name="Idioma")
    timezone = models.CharField(max_length=50, default='America/Sao_Paulo', verbose_name="Fuso horário")
    email_notifications = models.BooleanField(default=True, verbose_name="Notificações por email")
    
    # View mode preference
    VIEW_MODE_CHOICES = [
        ('personal', 'Minha Visão'),
        ('team', 'Visão da Equipe'),
    ]
    view_mode = models.CharField(
        max_length=20,
        choices=VIEW_MODE_CHOICES,
        default='personal',
        verbose_name="Modo de Visualização"
    )


    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Relations
    organizations = models.ManyToManyField(
        Organization,
        through='UserOrganizationRole',
        through_fields=('user', 'organization'),
        related_name='ordoc_users'
    )

    class Meta:
        verbose_name = "Usuário Ordoc"
        verbose_name_plural = "Usuários Ordoc"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.user.email})"

    @property
    def is_active_user(self):
        """Verifica se o usuário está ativo"""
        return self.status == 'active' and self.deleted_at is None

    @property
    def is_pending(self):
        """Verifica se o usuário está pendente"""
        return self.status == 'pending'

    @property
    def is_blocked(self):
        """Verifica se o usuário está bloqueado"""
        return self.status == 'blocked'

    def increment_failed_attempts(self):
        """Incrementa tentativas de login falhadas"""
        self.failed_attempts += 1
        if self.failed_attempts >= 5:  # MAX_SIGNIN_FAILED_ATTEMPTS
            self.status = 'blocked'
            self.locked_at = timezone.now()
        self.save()

    def reset_failed_attempts(self):
        """Reseta tentativas de login falhadas"""
        self.failed_attempts = 0
        self.save()

    def unlock_account(self):
        """Desbloqueia a conta do usuário"""
        self.failed_attempts = 0
        self.status = 'active'
        self.locked_at = None
        self.save()

    def block_account(self, reason=None):
        """Bloqueia a conta do usuário"""
        self.status = 'blocked'
        self.locked_at = timezone.now()
        self.save()

    def activate(self):
        """Ativa a conta do usuário"""
        self.status = 'active'
        self.locked_at = None
        self.failed_attempts = 0
        self.save()

    def deactivate(self):
        """Desativa a conta do usuário"""
        self.status = 'inactive'
        self.save()

    def record_login(self, ip_address=None):
        """Registra login bem-sucedido"""
        self.last_login_at = timezone.now()
        self.last_login_ip = ip_address
        self.failed_attempts = 0
        self.save()

    def get_token(self):
        """Gera token JWT para o usuário - equivalente ao user.token do Rails"""
        from ordoc_ai.jwt_service import JWTService
        return JWTService.create_user_token(self.user)

    @property
    def requires_password_change(self):
        """Verifica se o usuário precisa trocar a senha"""
        return self.must_change_password

    def mark_password_changed(self):
        """Marca que o usuário trocou a senha"""
        self.must_change_password = False
        self.password_changed_at = timezone.now()
        self.password_reset_token = None
        self.password_reset_sent_at = None
        self.save()

    def force_password_change(self):
        """Força o usuário a trocar a senha no próximo login"""
        self.must_change_password = True
        self.save()

    def generate_password_reset_token(self):
        """Gera token para reset de senha"""
        import secrets
        self.password_reset_token = secrets.token_urlsafe(32)
        self.password_reset_sent_at = timezone.now()
        self.save()
        return self.password_reset_token

    def is_password_reset_token_valid(self):
        """Verifica se o token de reset é válido (expira em 2 horas)"""
        if not self.password_reset_token or not self.password_reset_sent_at:
            return False
        from datetime import timedelta
        expiry = self.password_reset_sent_at + timedelta(hours=2)
        return timezone.now() < expiry

    # Two-Factor Authentication methods
    def enable_two_factor(self):
        """Habilita 2FA e gera segredo"""
        self.two_factor_secret = pyotp.random_base32()
        self.two_factor_backup_codes = self._generate_backup_codes()
        self.two_factor_enabled = True
        self.save()
        return self.two_factor_secret

    def disable_two_factor(self):
        """Desabilita 2FA"""
        self.two_factor_enabled = False
        self.two_factor_secret = None
        self.two_factor_backup_codes = []
        self.save()

    def verify_two_factor(self, code):
        """Verifica código 2FA"""
        if not self.two_factor_enabled or not self.two_factor_secret:
            return True  # 2FA não habilitado
        totp = pyotp.TOTP(self.two_factor_secret)
        if totp.verify(code):
            return True
        # Verifica backup codes
        if code in self.two_factor_backup_codes:
            self.two_factor_backup_codes.remove(code)
            self.save()
            return True
        return False

    def _generate_backup_codes(self, count=10):
        """Gera códigos de backup para 2FA"""
        import secrets
        return [secrets.token_hex(4).upper() for _ in range(count)]

    def get_two_factor_uri(self):
        """Retorna URI para QR code do 2FA"""
        if not self.two_factor_secret:
            return None
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.provisioning_uri(
            name=self.user.email,
            issuer_name="OrdocAI"
        )

    def check_profile_complete(self):
        """Verifica e atualiza se o perfil está completo"""
        required_fields = [
            self.user.first_name,
            self.user.last_name,
            self.phone,
            self.cpf,
        ]
        self.profile_complete = all(field for field in required_fields)
        self.save()
        return self.profile_complete


class UserOrganizationRole(models.Model):
    """
    Modelo para relacionar usuários com organizações e seus roles
    Equivalente ao sistema de Roles do Rails
    """

    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('organization_manager', 'Gerente da Organização'),
        ('organization_member', 'Membro da Organização'),
        ('department_manager', 'Gerente do Departamento'),
        ('department_member', 'Membro do Departamento'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(OrdocUser, on_delete=models.CASCADE, related_name='roles')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='user_roles')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    # Status
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    is_primary = models.BooleanField(default=False, verbose_name="Organização primária")

    # Role history
    started_at = models.DateTimeField(auto_now_add=True, verbose_name="Início da função")
    ended_at = models.DateTimeField(null=True, blank=True, verbose_name="Fim da função")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Assigned by
    assigned_by = models.ForeignKey(
        'OrdocUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_roles'
    )

    class Meta:
        verbose_name = "Role do Usuário"
        verbose_name_plural = "Roles dos Usuários"
        unique_together = ['user', 'organization', 'role']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.organization.corporate_name} ({self.get_role_display()})"

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_organization_manager(self):
        return self.role == 'organization_manager'

    @property
    def is_organization_member(self):
        return self.role == 'organization_member'

    def end_role(self):
        """Encerra a função do usuário"""
        self.is_active = False
        self.ended_at = timezone.now()
        self.save()


class UserGroup(models.Model):
    """
    Modelo para grupos de usuários - equivalente ao PrinterCloud::UserGroup
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")

    # Status
    is_active = models.BooleanField(default=True, verbose_name="Ativo")

    # Hierarchy
    parent_group = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='child_groups',
        verbose_name="Grupo pai"
    )

    # Relations
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='user_groups')
    users = models.ManyToManyField(OrdocUser, related_name='user_groups', blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Grupo de Usuários"
        verbose_name_plural = "Grupos de Usuários"
        ordering = ['name']
        unique_together = ['organization', 'name']

    def __str__(self):
        return f"{self.organization.corporate_name} - {self.name}"

    def get_all_users(self):
        """Retorna todos os usuários do grupo e subgrupos"""
        users = set(self.users.all())
        for child in self.child_groups.filter(is_active=True, deleted_at__isnull=True):
            users.update(child.get_all_users())
        return users

    def get_hierarchy_path(self):
        """Retorna o caminho hierárquico do grupo"""
        path = [self.name]
        parent = self.parent_group
        while parent:
            path.insert(0, parent.name)
            parent = parent.parent_group
        return ' > '.join(path)


class Policy(models.Model):
    """
    Modelo para políticas de acesso - equivalente ao PrinterCloud::Policy
    """

    EFFECT_CHOICES = [
        ('allow', 'Permitir'),
        ('deny', 'Negar'),
    ]

    SOURCE_CHOICES = [
        ('system_managed', 'Gerenciado pelo Sistema'),
        ('customer_managed', 'Gerenciado pelo Cliente'),
    ]

    SERVICE_CHOICES = [
        ('ordoc_air', 'OrdocAir - Documentos'),
        ('ordoc_flow', 'OrdocFlow - Workflows'),
        ('ordoc_sign', 'OrdocSign - Assinaturas'),
        ('ordoc_reports', 'OrdocReports - Relatórios'),
        ('ordoc_cloud', 'OrdocCloud - Usuários'),
        ('*', 'Todos os Serviços'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    effect = models.CharField(max_length=10, choices=EFFECT_CHOICES, default='allow')
    service = models.CharField(max_length=100, choices=SERVICE_CHOICES, verbose_name="Serviço")
    resource = models.JSONField(default=list, verbose_name="Recursos")
    actions = models.JSONField(default=list, verbose_name="Ações permitidas")
    conditions = models.JSONField(default=dict, blank=True, verbose_name="Condições")
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='customer_managed')
    is_public = models.BooleanField(default=False, verbose_name="Público")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")

    # Priority (lower = higher priority)
    priority = models.PositiveIntegerField(default=100, verbose_name="Prioridade")

    # Version tracking
    version = models.PositiveIntegerField(default=1)

    # Relations
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='policies')
    user_groups = models.ManyToManyField(UserGroup, related_name='policies', blank=True)
    users = models.ManyToManyField(OrdocUser, related_name='policies', blank=True)

    # Audit
    created_by = models.ForeignKey(
        OrdocUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_policies'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Política"
        verbose_name_plural = "Políticas"
        ordering = ['priority', 'name']

    def __str__(self):
        return f"{self.organization.corporate_name} - {self.name}"

    def check_access(self, action, resource, user=None):
        """Verifica se a política permite o acesso"""
        # Verificar se a ação está nas ações permitidas
        if self.actions and action not in self.actions and '*' not in self.actions:
            return None  # Esta política não se aplica

        # Verificar se o recurso está nos recursos permitidos
        if self.resource and resource not in self.resource and '*' not in self.resource:
            return None  # Esta política não se aplica

        # Verificar condições
        if self.conditions and user:
            if not self._evaluate_conditions(user):
                return None

        return self.effect == 'allow'

    def _evaluate_conditions(self, user):
        """Avalia as condições da política"""
        # Implementar lógica de condições
        # Ex: {"time_range": {"start": "09:00", "end": "18:00"}}
        return True

    def attach_to_user(self, user):
        """Anexa a política a um usuário"""
        self.users.add(user)

    def detach_from_user(self, user):
        """Remove a política de um usuário"""
        self.users.remove(user)

    def attach_to_group(self, group):
        """Anexa a política a um grupo"""
        self.user_groups.add(group)

    def detach_from_group(self, group):
        """Remove a política de um grupo"""
        self.user_groups.remove(group)


class AuditLog(models.Model):
    """
    Modelo para log de auditoria de ações do sistema
    """

    ACTION_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('login_failed', 'Login Falhou'),
        ('password_change', 'Alteração de Senha'),
        ('password_reset', 'Reset de Senha'),
        ('user_create', 'Criação de Usuário'),
        ('user_update', 'Atualização de Usuário'),
        ('user_delete', 'Exclusão de Usuário'),
        ('user_block', 'Bloqueio de Usuário'),
        ('user_unlock', 'Desbloqueio de Usuário'),
        ('role_assign', 'Atribuição de Função'),
        ('role_remove', 'Remoção de Função'),
        ('policy_create', 'Criação de Política'),
        ('policy_update', 'Atualização de Política'),
        ('policy_delete', 'Exclusão de Política'),
        ('2fa_enable', 'Habilitação de 2FA'),
        ('2fa_disable', 'Desabilitação de 2FA'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField(blank=True, null=True)

    # Target
    target_user = models.ForeignKey(
        OrdocUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs_as_target'
    )
    target_type = models.CharField(max_length=50, blank=True, null=True)
    target_id = models.UUIDField(null=True, blank=True)

    # Metadata
    old_values = models.JSONField(default=dict, blank=True)
    new_values = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)

    # Relations
    user = models.ForeignKey(
        OrdocUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs'
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='audit_logs'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Log de Auditoria"
        verbose_name_plural = "Logs de Auditoria"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['organization', 'created_at']),
        ]

    def __str__(self):
        user_name = self.user.user.username if self.user else 'Sistema'
        return f"{user_name} - {self.get_action_display()} - {self.created_at}"

    @classmethod
    def log(cls, action, organization, user=None, target_user=None,
            description=None, old_values=None, new_values=None,
            ip_address=None, user_agent=None, target_type=None, target_id=None):
        """Helper para criar logs de auditoria"""
        return cls.objects.create(
            action=action,
            organization=organization,
            user=user,
            target_user=target_user,
            description=description,
            old_values=old_values or {},
            new_values=new_values or {},
            ip_address=ip_address,
            user_agent=user_agent,
            target_type=target_type,
            target_id=target_id,
        )


class RefreshToken(models.Model):
    """
    Modelo para refresh tokens
    Permite revogação e rotação de tokens para maior segurança
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.CharField(max_length=255, unique=True, db_index=True)
    user = models.ForeignKey(
        OrdocUser,
        on_delete=models.CASCADE,
        related_name='refresh_tokens'
    )
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_reason = models.CharField(max_length=255, blank=True, null=True)
    
    # Expiration
    expires_at = models.DateTimeField()
    
    # Rotation tracking
    replaced_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replaced_tokens'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_used_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Refresh Token"
        verbose_name_plural = "Refresh Tokens"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.token[:20]}... (expires: {self.expires_at})"
    
    @property
    def is_valid(self):
        """Verifica se o token é válido"""
        return (
            self.is_active and
            self.revoked_at is None and
            timezone.now() < self.expires_at
        )
    
    def revoke(self, reason=None):
        """Revoga o refresh token"""
        self.is_active = False
        self.revoked_at = timezone.now()
        self.revoked_reason = reason
        self.save()
    
    @classmethod
    def create_token(cls, user, ip_address=None, user_agent=None):
        """Cria um novo refresh token"""
        import secrets
        from datetime import timedelta
        
        token = secrets.token_urlsafe(64)
        expires_at = timezone.now() + timedelta(days=7)
        
        return cls.objects.create(
            token=token,
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=expires_at
        )
    
    @classmethod
    def cleanup_expired(cls):
        """Remove tokens expirados (task periódica)"""
        expired_tokens = cls.objects.filter(
            expires_at__lt=timezone.now()
        )
        count = expired_tokens.count()
        expired_tokens.delete()
        return count


class Notification(models.Model):
    """
    Modelo para notificações do sistema.
    Suporta notificações para qualquer objeto via GenericForeignKey.
    """
    
    TYPE_CHOICES = [
        ('info', 'Informação'),
        ('success', 'Sucesso'),
        ('warning', 'Aviso'),
        ('error', 'Erro'),
        ('task_assigned', 'Tarefa Atribuída'),
        ('document_shared', 'Documento Compartilhado'),
        ('signature_requested', 'Assinatura Solicitada'),
        ('workflow_update', 'Atualização de Workflow'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Target User
    user = models.ForeignKey(
        OrdocUser,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Usuário'
    )
    
    # Notification Content
    title = models.CharField(max_length=255, verbose_name='Título')
    message = models.TextField(verbose_name='Mensagem')
    link = models.CharField(max_length=500, blank=True, null=True, verbose_name='Link de Ação')
    notification_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='info',
        verbose_name='Tipo'
    )
    
    # Status
    is_read = models.BooleanField(default=False, verbose_name='Lida')
    read_at = models.DateTimeField(null=True, blank=True, verbose_name='Lida em')
    
    # Generic Relation (Source object)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.UUIDField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True, verbose_name='Metadados')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"{self.title} - {self.user}"
        
    def mark_as_read(self):
        self.is_read = True
        self.read_at = timezone.now()
        self.save()


class Comment(models.Model):
    """
    Modelo para comentários e colaboração em qualquer objeto do sistema.
    Suporta threads (respostas) e anexos.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Author
    user = models.ForeignKey(
        OrdocUser,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Autor'
    )
    
    # Content
    content = models.TextField(verbose_name='Conteúdo')
    
    # Generic Relation (Target object - Document, Task, etc)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Threading
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name='Resposta para'
    )
    
    # Attachment
    attachment = models.FileField(
        upload_to='comments/%Y/%m/%d/',
        null=True,
        blank=True,
        verbose_name='Anexo'
    )
    
    # Status
    is_internal = models.BooleanField(default=False, verbose_name='Comentário Interno')
    edited_at = models.DateTimeField(null=True, blank=True, verbose_name='Editado em')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Comentário"
        verbose_name_plural = "Comentários"
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"Comentário de {self.user} em {self.content_object}"
        
    @property
    def is_reply(self):
        return self.parent is not None


# ============================================
# COMPLIANCE: LGPD (Lei Geral de Proteção de Dados)
# ============================================

class PersonalDataMapping(models.Model):
    """
    Mapeamento de dados pessoais/sensíveis no sistema (Art. 5º LGPD)
    Identifica onde dados pessoais são armazenados e processados
    """

    DATA_TYPE_CHOICES = [
        ('personal', 'Dado Pessoal'),           # Art. 5º, I - nome, email, telefone, CPF
        ('sensitive', 'Dado Sensível'),          # Art. 5º, II - saúde, biometria, raça, religião
        ('children', 'Dado de Criança'),         # Art. 14 - menores de 18 anos
        ('anonymous', 'Dado Anonimizado'),       # Art. 5º, III
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Identificação do dado
    field_name = models.CharField(max_length=100, verbose_name="Nome do Campo")
    field_description = models.TextField(verbose_name="Descrição do Dado")
    data_type = models.CharField(
        max_length=20,
        choices=DATA_TYPE_CHOICES,
        verbose_name="Tipo de Dado"
    )

    # Localização
    model_name = models.CharField(max_length=100, verbose_name="Model Django")
    table_name = models.CharField(max_length=100, verbose_name="Tabela no Banco")

    # Base legal (Art. 7º LGPD)
    LEGAL_BASIS_CHOICES = [
        ('consent', 'Consentimento'),                    # Art. 7º, I
        ('legal_obligation', 'Obrigação Legal'),         # Art. 7º, II
        ('contract', 'Execução de Contrato'),            # Art. 7º, V
        ('legitimate_interest', 'Interesse Legítimo'),   # Art. 7º, IX
        ('vital_interest', 'Proteção da Vida'),          # Art. 7º, VII
    ]

    legal_basis = models.CharField(
        max_length=30,
        choices=LEGAL_BASIS_CHOICES,
        verbose_name="Base Legal"
    )

    # Finalidade (Art. 6º, I - princípio da finalidade)
    purpose = models.TextField(verbose_name="Finalidade do Tratamento")

    # Retenção (Art. 6º, V - princípio da necessidade)
    retention_period_days = models.PositiveIntegerField(
        verbose_name="Período de Retenção (dias)"
    )

    # Categorias de titulares
    data_subject_categories = models.JSONField(
        default=list,
        verbose_name="Categorias de Titulares"  # ex: ["clientes", "funcionários"]
    )

    # Compartilhamento (Art. 26 - operadores)
    is_shared = models.BooleanField(default=False, verbose_name="Dados Compartilhados")
    shared_with = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Compartilhado Com"  # ex: ["AWS", "SendGrid"]
    )

    # Status
    is_active = models.BooleanField(default=True, verbose_name="Ativo")

    # Relations
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='personal_data_mappings',
        verbose_name="Organização"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # User tracking
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_data_mappings'
    )

    class Meta:
        verbose_name = "Mapeamento de Dados Pessoais"
        verbose_name_plural = "Mapeamentos de Dados Pessoais"
        ordering = ['model_name', 'field_name']
        indexes = [
            models.Index(fields=['organization', 'data_type']),
            models.Index(fields=['model_name']),
        ]

    def __str__(self):
        return f"{self.model_name}.{self.field_name} ({self.get_data_type_display()})"

    def is_sensitive(self):
        """Verifica se é dado sensível"""
        return self.data_type == 'sensitive'


class DataSubjectRequest(models.Model):
    """
    Solicitações do titular de dados (Arts. 17-19 LGPD)
    Direitos: acesso, correção, anonimização, portabilidade, eliminação
    """

    REQUEST_TYPE_CHOICES = [
        ('access', 'Acesso aos Dados'),              # Art. 18, II
        ('correction', 'Correção de Dados'),         # Art. 18, III
        ('anonymization', 'Anonimização'),           # Art. 18, IV
        ('portability', 'Portabilidade'),            # Art. 18, V
        ('erasure', 'Eliminação'),                   # Art. 18, VI (Direito ao Esquecimento)
        ('revoke_consent', 'Revogação de Consentimento'),  # Art. 18, IX
        ('info_sharing', 'Informação sobre Compartilhamento'),  # Art. 18, VII
    ]

    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluída'),
        ('rejected', 'Rejeitada'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Solicitante
    requester_name = models.CharField(max_length=255, verbose_name="Nome do Solicitante")
    requester_email = models.EmailField(verbose_name="Email do Solicitante")
    requester_cpf = models.CharField(
        max_length=14,
        verbose_name="CPF do Solicitante"
    )

    # Tipo de solicitação
    request_type = models.CharField(
        max_length=20,
        choices=REQUEST_TYPE_CHOICES,
        verbose_name="Tipo de Solicitação"
    )
    description = models.TextField(verbose_name="Descrição")

    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Status"
    )

    # Prazo legal: 15 dias (Art. 19, §3º)
    request_date = models.DateTimeField(auto_now_add=True, verbose_name="Data da Solicitação")
    deadline_date = models.DateTimeField(verbose_name="Prazo Legal (15 dias)")
    completion_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Data de Conclusão"
    )

    # Resposta
    response = models.TextField(blank=True, verbose_name="Resposta")
    rejection_reason = models.TextField(blank=True, verbose_name="Motivo de Rejeição")

    # Evidências (para comprovação)
    evidence_files = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Arquivos de Evidência"
    )

    # Relations
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='data_subject_requests',
        verbose_name="Organização"
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_lgpd_requests',
        verbose_name="Responsável"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Solicitação do Titular (LGPD)"
        verbose_name_plural = "Solicitações dos Titulares (LGPD)"
        ordering = ['-request_date']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['requester_cpf']),
            models.Index(fields=['deadline_date']),
        ]

    def __str__(self):
        return f"{self.get_request_type_display()} - {self.requester_name}"

    def save(self, *args, **kwargs):
        # Calcula deadline (15 dias conforme LGPD)
        if not self.deadline_date:
            from datetime import timedelta
            self.deadline_date = timezone.now() + timedelta(days=15)
        super().save(*args, **kwargs)

    def is_overdue(self):
        """Verifica se passou do prazo legal"""
        return timezone.now() > self.deadline_date and self.status != 'completed'


class ConsentRecord(models.Model):
    """
    Registro de consentimento (Art. 8º LGPD)
    Armazena consentimentos de titulares para processamento de dados
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Titular
    data_subject_cpf = models.CharField(max_length=14, verbose_name="CPF do Titular")
    data_subject_name = models.CharField(max_length=255, verbose_name="Nome do Titular")
    data_subject_email = models.EmailField(verbose_name="Email do Titular")

    # Consentimento
    purpose = models.TextField(verbose_name="Finalidade do Consentimento")
    consent_text = models.TextField(verbose_name="Texto do Consentimento")

    # Status
    is_active = models.BooleanField(default=True, verbose_name="Consentimento Ativo")
    granted_at = models.DateTimeField(auto_now_add=True, verbose_name="Concedido em")
    revoked_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Revogado em"
    )

    # Evidência (Art. 8º, §6º - prova do consentimento)
    ip_address = models.GenericIPAddressField(verbose_name="Endereço IP")
    user_agent = models.TextField(verbose_name="User Agent")
    consent_method = models.CharField(
        max_length=50,
        default='web_form',
        verbose_name="Método de Consentimento"  # web_form, email, paper
    )

    # Relations
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='consent_records',
        verbose_name="Organização"
    )
    data_mapping = models.ForeignKey(
        PersonalDataMapping,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='consents',
        verbose_name="Mapeamento de Dado"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Registro de Consentimento"
        verbose_name_plural = "Registros de Consentimento"
        ordering = ['-granted_at']
        indexes = [
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['data_subject_cpf']),
            models.Index(fields=['granted_at']),
        ]

    def __str__(self):
        return f"Consentimento: {self.data_subject_name} - {self.purpose[:50]}"

    def revoke(self):
        """Revoga o consentimento (Art. 8º, §5º)"""
        self.is_active = False
        self.revoked_at = timezone.now()
        self.save()

