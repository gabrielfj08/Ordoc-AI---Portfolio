from django.db import models
from django.contrib.auth.models import AbstractUser, User
from django.core.validators import RegexValidator
from django.utils import timezone
from ordoc_air.models import Organization
import uuid
import pyotp


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
