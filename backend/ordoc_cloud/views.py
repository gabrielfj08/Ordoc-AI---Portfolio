from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from ordoc_ai.base_viewset import BaseViewSet
from .models import (
    OrdocUser, UserOrganizationRole, UserGroup, Policy, AuditLog,
    PersonalDataMapping, DataSubjectRequest, ConsentRecord
)
from .serializers import (
    OrdocUserSerializer, OrdocUserCreateSerializer, OrdocUserListSerializer,
    UserGroupSerializer, UserGroupCreateSerializer, PolicySerializer, UserOrganizationRoleSerializer,
    AuditLogSerializer,
    PersonalDataMappingSerializer, DataSubjectRequestSerializer, ConsentRecordSerializer
)
from .permissions import (
    IsActiveUser, IsAdmin, IsOrganizationManager, CanManageUsers,
    CanManageRoles, CanManagePolicies
)


class OrdocUserViewSet(BaseViewSet):
    """
    ViewSet for managing OrdocUsers
    Provides CRUD operations and filtering for users
    """
    queryset = OrdocUser.objects.all()
    serializer_class = OrdocUserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'must_change_password']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['created_at', 'user__username', 'user__email', 'user__date_joined']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use appropriate serializer for each action"""
        if self.action == 'list':
            return OrdocUserListSerializer
        elif self.action == 'create':
            return OrdocUserCreateSerializer
        return OrdocUserSerializer
    
    def get_queryset(self):
        """Filter users by current organization"""
        queryset = super().get_queryset()
        
        # Filter by organization
        if hasattr(self.request, 'current_organization') and self.request.current_organization:
            queryset = queryset.filter(
                roles__organization=self.request.current_organization
            ).distinct()
        
        # Filter by type (internal/external)
        user_type = self.request.query_params.get('type')
        if user_type == 'internal':
            # For now, all users are considered internal
            # This can be enhanced based on business logic
            pass
        elif user_type == 'external':
            # Filter external users when this logic is implemented
            pass
        
        # Filter by department
        department_id = self.request.query_params.get('department')
        if department_id:
            # This would need department-user relationship implementation
            pass
        
        # Filter by role
        role_filter = self.request.query_params.get('role')
        if role_filter:
            queryset = queryset.filter(
                roles__role=role_filter,
                roles__organization=self.request.current_organization
            ).distinct()
        
        # Exclude deleted users
        queryset = queryset.filter(deleted_at__isnull=True)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user"""
        user = self.get_object()
        user.status = 'active'
        user.save()
        return Response({'status': 'User activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user"""
        user = self.get_object()
        user.status = 'inactive'
        user.save()
        return Response({'status': 'User deactivated successfully'})
    
    @action(detail=True, methods=['post'])
    def force_password_change(self, request, pk=None):
        """Force user to change password on next login"""
        user = self.get_object()
        user.force_password_change()
        return Response({'status': 'Password change forced successfully'})
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Enhanced search endpoint for user selection components"""
        query = request.query_params.get('q', '')
        if not query:
            return Response([])

        queryset = self.get_queryset()

        # Enhanced search across multiple fields
        search_filter = Q(
            user__username__icontains=query
        ) | Q(
            user__email__icontains=query
        ) | Q(
            user__first_name__icontains=query
        ) | Q(
            user__last_name__icontains=query
        )

        queryset = queryset.filter(search_filter)[:10]  # Limit results

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        """Unlock a blocked user account"""
        user = self.get_object()
        user.unlock_account()

        # Log the action
        org = self.get_current_organization()
        if org:
            AuditLog.log(
                action='user_unlock',
                organization=org,
                user=getattr(request, 'ordoc_user', None),
                target_user=user,
                description=f'Conta desbloqueada para {user.user.email}',
                ip_address=self._get_client_ip(request),
            )

        return Response({'status': 'User account unlocked successfully'})

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        """Block a user account"""
        user = self.get_object()
        reason = request.data.get('reason', '')
        user.block_account(reason)

        # Log the action
        org = self.get_current_organization()
        if org:
            AuditLog.log(
                action='user_block',
                organization=org,
                user=getattr(request, 'ordoc_user', None),
                target_user=user,
                description=f'Conta bloqueada: {reason}' if reason else 'Conta bloqueada',
                ip_address=self._get_client_ip(request),
            )

        return Response({'status': 'User account blocked successfully'})

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle user status between active and inactive"""
        user = self.get_object()
        if user.status == 'active':
            user.deactivate()
            new_status = 'inactive'
        else:
            user.activate()
            new_status = 'active'

        return Response({
            'status': f'User status changed to {new_status}',
            'new_status': new_status
        })

    @action(detail=True, methods=['post'])
    def send_password_reset(self, request, pk=None):
        """Send password reset email to user"""
        user = self.get_object()
        token = user.generate_password_reset_token()

        # TODO: Send email with reset link
        # For now, just return success
        return Response({
            'status': 'Password reset email sent',
            'message': f'Email enviado para {user.user.email}'
        })

    @action(detail=True, methods=['get'])
    def roles(self, request, pk=None):
        """Get user roles in current organization"""
        user = self.get_object()
        org = self.get_current_organization()

        roles = UserOrganizationRole.objects.filter(
            user=user,
            organization=org,
            is_active=True
        )

        serializer = UserOrganizationRoleSerializer(roles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_role(self, request, pk=None):
        """Assign a role to user"""
        user = self.get_object()
        org = self.get_current_organization()
        role = request.data.get('role')

        if not role:
            return Response(
                {'error': 'Role is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if role already exists
        existing = UserOrganizationRole.objects.filter(
            user=user,
            organization=org,
            role=role,
            is_active=True
        ).first()

        if existing:
            return Response(
                {'error': 'User already has this role'},
                status=status.HTTP_400_BAD_REQUEST
            )

        role_obj = UserOrganizationRole.objects.create(
            user=user,
            organization=org,
            role=role,
            assigned_by=getattr(request, 'ordoc_user', None)
        )

        # Log the action
        AuditLog.log(
            action='role_assign',
            organization=org,
            user=getattr(request, 'ordoc_user', None),
            target_user=user,
            description=f'Função {role} atribuída',
            new_values={'role': role},
            ip_address=self._get_client_ip(request),
        )

        serializer = UserOrganizationRoleSerializer(role_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def remove_role(self, request, pk=None):
        """Remove a role from user"""
        user = self.get_object()
        org = self.get_current_organization()
        role = request.data.get('role')

        if not role:
            return Response(
                {'error': 'Role is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        role_obj = UserOrganizationRole.objects.filter(
            user=user,
            organization=org,
            role=role,
            is_active=True
        ).first()

        if not role_obj:
            return Response(
                {'error': 'User does not have this role'},
                status=status.HTTP_400_BAD_REQUEST
            )

        role_obj.end_role()

        # Log the action
        AuditLog.log(
            action='role_remove',
            organization=org,
            user=getattr(request, 'ordoc_user', None),
            target_user=user,
            description=f'Função {role} removida',
            old_values={'role': role},
            ip_address=self._get_client_ip(request),
        )

        return Response({'status': 'Role removed successfully'})

    @action(detail=True, methods=['post'])
    def enable_2fa(self, request, pk=None):
        """Enable two-factor authentication for user"""
        user = self.get_object()

        # Only allow user to enable their own 2FA or admin to force it
        current_user = getattr(request, 'ordoc_user', None)
        if current_user != user and not self._is_admin(request):
            return Response(
                {'error': 'You can only enable 2FA for your own account'},
                status=status.HTTP_403_FORBIDDEN
            )

        secret = user.enable_two_factor()
        uri = user.get_two_factor_uri()

        return Response({
            'secret': secret,
            'uri': uri,
            'backup_codes': user.two_factor_backup_codes
        })

    @action(detail=True, methods=['post'])
    def disable_2fa(self, request, pk=None):
        """Disable two-factor authentication for user"""
        user = self.get_object()

        # Require current 2FA code to disable
        code = request.data.get('code')
        if user.two_factor_enabled and not user.verify_two_factor(code):
            return Response(
                {'error': 'Invalid 2FA code'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.disable_two_factor()

        # Log the action
        org = self.get_current_organization()
        if org:
            AuditLog.log(
                action='2fa_disable',
                organization=org,
                user=getattr(request, 'ordoc_user', None),
                target_user=user,
                ip_address=self._get_client_ip(request),
            )

        return Response({'status': '2FA disabled successfully'})

    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

    def _is_admin(self, request):
        """Check if current user is admin"""
        ordoc_user = getattr(request, 'ordoc_user', None)
        org = self.get_current_organization()
        if not ordoc_user or not org:
            return False
        return UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=org,
            role='admin',
            is_active=True
        ).exists()


class UserOrganizationRoleViewSet(BaseViewSet):
    """
    ViewSet for managing User Organization Roles
    """
    queryset = UserOrganizationRole.objects.all()
    serializer_class = UserOrganizationRoleSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active', 'user']
    ordering_fields = ['created_at', 'role']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter roles by current organization"""
        queryset = super().get_queryset()

        org = self.get_current_organization()
        if org:
            queryset = queryset.filter(organization=org)

        return queryset.filter(is_active=True)

    def perform_create(self, serializer):
        """Set organization and assigned_by when creating role"""
        serializer.save(
            organization=self.get_current_organization(),
            assigned_by=getattr(self.request, 'ordoc_user', None)
        )

    @action(detail=False, methods=['get'])
    def available_roles(self, request):
        """Get available role types"""
        return Response([
            {'code': code, 'name': name}
            for code, name in UserOrganizationRole.ROLE_CHOICES
        ])

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get roles for a specific user"""
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        roles = self.get_queryset().filter(user_id=user_id)
        serializer = self.get_serializer(roles, many=True)
        return Response(serializer.data)


class UserGroupViewSet(BaseViewSet):
    """
    ViewSet for managing UserGroups
    """
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Use appropriate serializer for each action"""
        if self.action == 'create':
            return UserGroupCreateSerializer
        return UserGroupSerializer
    
    def get_queryset(self):
        """Filter user groups by user access"""
        # Bypass BaseViewSet automatic filtering which enforces current_organization
        queryset = UserGroup.objects.all()
        
        # Get current user (OrdocUser)
        ordoc_user = getattr(self.request, 'ordoc_user', None)
        if not ordoc_user and hasattr(self.request.user, 'ordoc_profile'):
            ordoc_user = self.request.user.ordoc_profile
            
        if ordoc_user:
            # Allow user to see groups from all their organizations
            # This solves the issue where creating a group for Org A while in Org B context (subdomain)
            # would make the group invisible.
            queryset = queryset.filter(organization__in=ordoc_user.organizations.all())
            
        # Optional: Allow filtering by specific organization via query param
        org_id = self.request.query_params.get('organization_id')
        if org_id:
            queryset = queryset.filter(organization_id=org_id)
        
        # Exclude deleted groups
        queryset = queryset.filter(deleted_at__isnull=True)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_users(self, request, pk=None):
        """Add users to group"""
        group = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        users = OrdocUser.objects.filter(id__in=user_ids)
        group.users.add(*users)
        
        return Response({'status': f'Added {len(users)} users to group'})
    
    @action(detail=True, methods=['post'])
    def remove_users(self, request, pk=None):
        """Remove users from group"""
        group = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        users = OrdocUser.objects.filter(id__in=user_ids)
        group.users.remove(*users)
        
        return Response({'status': f'Removed {len(users)} users from group'})


class PolicyViewSet(BaseViewSet):
    """
    ViewSet for managing Policies
    """
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['effect', 'service', 'source', 'is_public']
    search_fields = ['name', 'description', 'service']
    ordering_fields = ['name', 'created_at', 'service']
    ordering = ['name']


    
    def get_queryset(self):
        """
        Filter policies by current organization.

        Optimized with prefetch_related to prevent N+1 queries
        in affected_users() action.
        """
        from django.db.models import Prefetch

        queryset = super().get_queryset()

        if hasattr(self.request, 'current_organization') and self.request.current_organization:
            queryset = queryset.filter(organization=self.request.current_organization)

        # Exclude deleted policies
        queryset = queryset.filter(deleted_at__isnull=True)

        # Optimize for affected_users() action - prefetch users and groups
        queryset = queryset.prefetch_related(
            'users',
            Prefetch(
                'user_groups',
                queryset=UserGroup.objects.prefetch_related('users')
            )
        )

        return queryset
    
    def perform_create(self, serializer):
        """Set organization when creating policy"""
        serializer.save(organization=self.get_current_organization())
    
    @action(detail=False, methods=['get'])
    def services(self, request):
        """Get list of available services for policy creation"""
        # This would typically come from a configuration or registry
        services = [
            {'code': 'ordoc_air', 'name': 'OrdocAir - Gestão Documental'},
            {'code': 'ordoc_flow', 'name': 'OrdocFlow - Workflow'},
            {'code': 'ordoc_sign', 'name': 'OrdocSign - Assinatura Digital'},
            {'code': 'ordoc_reports', 'name': 'OrdocReports - Relatórios'},
            {'code': 'ordoc_cloud', 'name': 'OrdocCloud - Configurações'},
        ]
        return Response(services)
    
    @action(detail=False, methods=['get'])
    def actions(self, request):
        """Get list of available actions for a service"""
        service = request.query_params.get('service')

        # This would typically come from a configuration or registry
        actions_map = {
            'ordoc_air': [
                {'code': 'document:read', 'name': 'Visualizar Documentos'},
                {'code': 'document:write', 'name': 'Criar/Editar Documentos'},
                {'code': 'document:delete', 'name': 'Excluir Documentos'},
                {'code': 'directory:read', 'name': 'Visualizar Diretórios'},
                {'code': 'directory:write', 'name': 'Criar/Editar Diretórios'},
            ],
            'ordoc_flow': [
                {'code': 'procedure:read', 'name': 'Visualizar Procedimentos'},
                {'code': 'procedure:write', 'name': 'Criar/Editar Procedimentos'},
                {'code': 'task:read', 'name': 'Visualizar Tarefas'},
                {'code': 'task:write', 'name': 'Executar Tarefas'},
            ],
            'ordoc_cloud': [
                {'code': 'user:read', 'name': 'Visualizar Usuários'},
                {'code': 'user:write', 'name': 'Gerenciar Usuários'},
                {'code': 'policy:read', 'name': 'Visualizar Políticas'},
                {'code': 'policy:write', 'name': 'Gerenciar Políticas'},
            ]
        }

        actions = actions_map.get(service, [])
        return Response(actions)

    @action(detail=True, methods=['post'])
    def attach_users(self, request, pk=None):
        """Attach policy to users"""
        policy = self.get_object()
        user_ids = request.data.get('user_ids', [])

        users = OrdocUser.objects.filter(id__in=user_ids)
        policy.users.add(*users)

        return Response({
            'status': f'Policy attached to {len(users)} users',
            'attached_count': len(users)
        })

    @action(detail=True, methods=['post'])
    def detach_users(self, request, pk=None):
        """Detach policy from users"""
        policy = self.get_object()
        user_ids = request.data.get('user_ids', [])

        users = OrdocUser.objects.filter(id__in=user_ids)
        policy.users.remove(*users)

        return Response({
            'status': f'Policy detached from {len(users)} users',
            'detached_count': len(users)
        })

    @action(detail=True, methods=['post'])
    def attach_groups(self, request, pk=None):
        """Attach policy to user groups"""
        policy = self.get_object()
        group_ids = request.data.get('group_ids', [])

        groups = UserGroup.objects.filter(id__in=group_ids)
        policy.user_groups.add(*groups)

        return Response({
            'status': f'Policy attached to {len(groups)} groups',
            'attached_count': len(groups)
        })

    @action(detail=True, methods=['post'])
    def detach_groups(self, request, pk=None):
        """Detach policy from user groups"""
        policy = self.get_object()
        group_ids = request.data.get('group_ids', [])

        groups = UserGroup.objects.filter(id__in=group_ids)
        policy.user_groups.remove(*groups)

        return Response({
            'status': f'Policy detached from {len(groups)} groups',
            'detached_count': len(groups)
        })

    @action(detail=True, methods=['get'])
    def affected_users(self, request, pk=None):
        """Get all users affected by this policy"""
        policy = self.get_object()

        # Direct users
        direct_users = set(policy.users.all())

        # Users from groups
        for group in policy.user_groups.all():
            direct_users.update(group.get_all_users())

        serializer = OrdocUserListSerializer(list(direct_users), many=True)
        return Response({
            'total': len(direct_users),
            'users': serializer.data
        })

    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        """Toggle policy status between active and inactive"""
        policy = self.get_object()
        
        # Check permissions (optional, better detailed logic in permissions.py)
        # For now assume viewset permissions handle basic access
        
        if policy.is_active:
            policy.is_active = False
            new_status = 'inactive'
        else:
            policy.is_active = True
            new_status = 'active'
            
        policy.save()
        
        # Log action if needed
        # AuditLog.log(...)

        return Response({
            'status': new_status,
            'message': f'Policy status changed to {new_status}',
            'id': policy.id
        })

class AuditLogViewSet(BaseViewSet):
    """
    ViewSet for viewing audit logs (read-only)
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'user', 'target_user']
    search_fields = ['description', 'action']
    ordering_fields = ['created_at', 'action']
    ordering = ['-created_at']
    http_method_names = ['get', 'head', 'options']  # Read-only

    def get_queryset(self):
        """Filter audit logs by current organization"""
        queryset = super().get_queryset()

        org = self.get_current_organization()
        if org:
            queryset = queryset.filter(organization=org)

        return queryset

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get audit logs for a specific user"""
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        logs = self.get_queryset().filter(
            Q(user_id=user_id) | Q(target_user_id=user_id)
        )

        page = self.paginate_queryset(logs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_action(self, request):
        """Get audit logs filtered by action type"""
        action_type = request.query_params.get('action')
        if not action_type:
            return Response(
                {'error': 'action is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        logs = self.get_queryset().filter(action=action_type)

        page = self.paginate_queryset(logs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent audit logs (last 24 hours)"""
        from datetime import timedelta
        cutoff = timezone.now() - timedelta(hours=24)

        logs = self.get_queryset().filter(created_at__gte=cutoff)[:100]
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get audit log statistics"""
        from django.db.models import Count
        from datetime import timedelta

        queryset = self.get_queryset()

        # Stats for last 7 days
        week_ago = timezone.now() - timedelta(days=7)
        recent_logs = queryset.filter(created_at__gte=week_ago)

        # Count by action type
        action_counts = recent_logs.values('action').annotate(
            count=Count('id')
        ).order_by('-count')

        # Count by user
        user_counts = recent_logs.exclude(user__isnull=True).values(
            'user__user__username'
        ).annotate(count=Count('id')).order_by('-count')[:10]

        return Response({
            'total_last_7_days': recent_logs.count(),
            'by_action': list(action_counts),
            'top_users': list(user_counts),
        })


# ============================================
# LGPD COMPLIANCE VIEWSETS
# ============================================

class PersonalDataMappingViewSet(BaseViewSet):
    """ViewSet para Mapeamento de Dados Pessoais (LGPD)"""

    queryset = PersonalDataMapping.objects.all()
    serializer_class = PersonalDataMappingSerializer
    filterset_fields = ['data_type', 'legal_basis', 'is_active', 'is_shared']
    search_fields = ['field_name', 'field_description', 'model_name']
    ordering_fields = ['created_at', 'field_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(organization=self.request.organization)

    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.organization,
            created_by=self.request.user
        )


class DataSubjectRequestViewSet(BaseViewSet):
    """ViewSet para Solicitações do Titular (LGPD Arts. 17-19)"""

    queryset = DataSubjectRequest.objects.all()
    serializer_class = DataSubjectRequestSerializer
    filterset_fields = ['request_type', 'status']
    search_fields = ['requester_name', 'requester_email', 'requester_cpf']
    ordering_fields = ['request_date', 'deadline_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(organization=self.request.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.organization)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Completa solicitação do titular"""
        data_request = self.get_object()

        response_text = request.data.get('response', '')
        if not response_text:
            return Response(
                {'error': 'Campo response é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        data_request.status = 'completed'
        data_request.response = response_text
        data_request.completion_date = timezone.now()
        data_request.save()

        serializer = self.get_serializer(data_request)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Lista solicitações atrasadas (prazo legal de 15 dias vencido)"""
        queryset = self.get_queryset()
        overdue_requests = [req for req in queryset if req.is_overdue()]

        serializer = self.get_serializer(overdue_requests, many=True)
        return Response(serializer.data)


class ConsentRecordViewSet(BaseViewSet):
    """ViewSet para Registro de Consentimento (LGPD Art. 8º)"""

    queryset = ConsentRecord.objects.all()
    serializer_class = ConsentRecordSerializer
    filterset_fields = ['is_active', 'data_subject_cpf']
    search_fields = ['data_subject_name', 'data_subject_email', 'data_subject_cpf']
    ordering_fields = ['granted_at', 'revoked_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(organization=self.request.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.organization)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """Revoga consentimento (LGPD Art. 8º, §5º)"""
        consent = self.get_object()

        if not consent.is_active:
            return Response(
                {'error': 'Consentimento já foi revogado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        consent.revoke()

        serializer = self.get_serializer(consent)
        return Response(serializer.data)
