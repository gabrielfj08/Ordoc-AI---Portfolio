"""
RBAC Permission Classes for OrdocCloud
Implements role-based access control for the platform
"""

from rest_framework import permissions
from .models import OrdocUser, UserOrganizationRole, Policy


class IsActiveUser(permissions.BasePermission):
    """
    Verifica se o usuário está ativo e não bloqueado
    """
    message = "Sua conta não está ativa."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        if not ordoc_user:
            try:
                ordoc_user = request.user.ordoc_profile
            except OrdocUser.DoesNotExist:
                return False

        return ordoc_user.is_active_user


class IsAdmin(permissions.BasePermission):
    """
    Verifica se o usuário é administrador da organização
    """
    message = "Você precisa ser administrador para realizar esta ação."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role='admin',
            is_active=True
        ).exists()


class IsOrganizationManager(permissions.BasePermission):
    """
    Verifica se o usuário é gerente da organização
    """
    message = "Você precisa ser gerente da organização para realizar esta ação."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role__in=['admin', 'organization_manager'],
            is_active=True
        ).exists()


class IsOrganizationMember(permissions.BasePermission):
    """
    Verifica se o usuário é membro da organização
    """
    message = "Você precisa ser membro da organização para acessar este recurso."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            is_active=True
        ).exists()


class IsDepartmentManager(permissions.BasePermission):
    """
    Verifica se o usuário é gerente do departamento
    """
    message = "Você precisa ser gerente do departamento para realizar esta ação."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role__in=['admin', 'organization_manager', 'department_manager'],
            is_active=True
        ).exists()


class HasPolicyPermission(permissions.BasePermission):
    """
    Verifica se o usuário tem permissão via política de acesso
    """

    def __init__(self, service=None, action=None, resource=None):
        self.service = service
        self.action = action
        self.resource = resource

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        # Determinar service, action e resource do contexto
        service = self.service or getattr(view, 'policy_service', None)
        action = self.action or request.method.lower()
        resource = self.resource or getattr(view, 'policy_resource', '*')

        return check_user_permission(ordoc_user, organization, service, action, resource)


def check_user_permission(user, organization, service, action, resource):
    """
    Verifica se o usuário tem permissão para a ação
    Retorna True se permitido, False se negado
    """
    # Administradores têm acesso total
    if UserOrganizationRole.objects.filter(
        user=user,
        organization=organization,
        role='admin',
        is_active=True
    ).exists():
        return True

    # Buscar políticas aplicáveis ao usuário
    user_policies = Policy.objects.filter(
        organization=organization,
        is_active=True,
        deleted_at__isnull=True,
        users=user
    )

    # Buscar políticas aplicáveis aos grupos do usuário
    user_groups = user.user_groups.filter(
        organization=organization,
        is_active=True,
        deleted_at__isnull=True
    )
    group_policies = Policy.objects.filter(
        organization=organization,
        is_active=True,
        deleted_at__isnull=True,
        user_groups__in=user_groups
    )

    # Combinar e ordenar por prioridade
    all_policies = (user_policies | group_policies).distinct().order_by('priority')

    # Avaliar políticas
    for policy in all_policies:
        # Verificar se a política se aplica ao serviço
        if policy.service != '*' and policy.service != service:
            continue

        result = policy.check_access(action, resource, user)
        if result is not None:
            return result

    # Sem política explícita, negar por padrão
    return False


class CanManageUsers(permissions.BasePermission):
    """
    Permissão para gerenciar usuários
    """
    message = "Você não tem permissão para gerenciar usuários."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        # Admin ou Organization Manager podem gerenciar usuários
        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role__in=['admin', 'organization_manager'],
            is_active=True
        ).exists()

    def has_object_permission(self, request, view, obj):
        """Verificar permissão no objeto específico"""
        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        # Não pode modificar a si mesmo (exceto para leitura)
        if obj == ordoc_user and request.method not in permissions.SAFE_METHODS:
            # Exceto para atualização de perfil próprio
            if view.action not in ['update', 'partial_update']:
                return True

        # Admin pode tudo
        if UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role='admin',
            is_active=True
        ).exists():
            return True

        # Organization Manager pode gerenciar membros, mas não admins
        if UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role='organization_manager',
            is_active=True
        ).exists():
            # Verificar se o target é admin
            if UserOrganizationRole.objects.filter(
                user=obj,
                organization=organization,
                role='admin',
                is_active=True
            ).exists():
                return False
            return True

        return False


class CanManageRoles(permissions.BasePermission):
    """
    Permissão para gerenciar funções/roles
    """
    message = "Você não tem permissão para gerenciar funções."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        # Apenas Admin pode gerenciar roles
        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role='admin',
            is_active=True
        ).exists()


class CanManagePolicies(permissions.BasePermission):
    """
    Permissão para gerenciar políticas
    """
    message = "Você não tem permissão para gerenciar políticas."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        ordoc_user = getattr(request, 'ordoc_user', None)
        organization = getattr(request, 'organization', None)

        if not ordoc_user or not organization:
            return False

        # Admin ou Organization Manager podem gerenciar políticas
        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            role__in=['admin', 'organization_manager'],
            is_active=True
        ).exists()


class ReadOnly(permissions.BasePermission):
    """
    Permite apenas operações de leitura
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
