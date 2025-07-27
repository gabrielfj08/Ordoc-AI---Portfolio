from django.db import models
from django.contrib.auth.models import AbstractUser, User
from django.core.validators import RegexValidator
from ordoc_air.models import Organization
import uuid


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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ordoc_profile')
    
    # Status and authentication fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    failed_attempts = models.PositiveIntegerField(default=0)
    locked_at = models.DateTimeField(null=True, blank=True)
    
    # Password security fields
    must_change_password = models.BooleanField(default=True, verbose_name="Deve trocar senha")
    password_changed_at = models.DateTimeField(null=True, blank=True, verbose_name="Senha alterada em")
    
    # Profile fields
    phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^(\(\d{2}\)\s?\d{4,5}-\d{4}|\d{2}\s?\d{4,5}-\d{4}|\+55\s?\d{2}\s?\d{4,5}-?\d{4})$',
            message="Formato de telefone inválido. Use: (11) 99999-9999 ou 11 99999-9999"
        )],
        blank=True,
        null=True
    )
    cpf = models.CharField(
        max_length=14,
        validators=[RegexValidator(regex=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', message="CPF deve estar no formato XXX.XXX.XXX-XX")],
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
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Relations
    organizations = models.ManyToManyField(Organization, through='UserOrganizationRole', related_name='ordoc_users')
    
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
            self.locked_at = models.timezone.now()
        self.save()
    
    def reset_failed_attempts(self):
        """Reseta tentativas de login falhadas"""
        self.failed_attempts = 0
        if self.status == 'blocked':
            self.status = 'active'
            self.locked_at = None
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
        from django.utils import timezone
        self.must_change_password = False
        self.password_changed_at = timezone.now()
        self.save()
    
    def force_password_change(self):
        """Força o usuário a trocar a senha no próximo login"""
        self.must_change_password = True
        self.save()


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
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
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


class UserGroup(models.Model):
    """
    Modelo para grupos de usuários - equivalente ao PrinterCloud::UserGroup
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    
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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    effect = models.CharField(max_length=10, choices=EFFECT_CHOICES, default='allow')
    service = models.CharField(max_length=100, verbose_name="Serviço")
    resource = models.JSONField(default=list, verbose_name="Recursos")
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='customer_managed')
    is_public = models.BooleanField(default=False, verbose_name="Público")
    
    # Relations
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='policies')
    user_groups = models.ManyToManyField(UserGroup, related_name='policies', blank=True)
    users = models.ManyToManyField(OrdocUser, related_name='policies', blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Política"
        verbose_name_plural = "Políticas"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.organization.corporate_name} - {self.name}"
