from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from ordoc_ai.base_viewset import BaseViewSet
from .models import OrdocUser, UserOrganizationRole, UserGroup, Policy
from .serializers import OrdocUserSerializer, OrdocUserCreateSerializer, OrdocUserListSerializer, UserGroupSerializer, PolicySerializer


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
    
    def get_queryset(self):
        """Filter user groups by current organization"""
        queryset = super().get_queryset()
        
        if hasattr(self.request, 'current_organization') and self.request.current_organization:
            queryset = queryset.filter(organization=self.request.current_organization)
        
        # Exclude deleted groups
        queryset = queryset.filter(deleted_at__isnull=True)
        
        return queryset
    
    def perform_create(self, serializer):
        """Set organization when creating user group"""
        serializer.save(organization=self.get_current_organization())
    
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
        """Filter policies by current organization"""
        queryset = super().get_queryset()
        
        if hasattr(self.request, 'current_organization') and self.request.current_organization:
            queryset = queryset.filter(organization=self.request.current_organization)
        
        # Exclude deleted policies
        queryset = queryset.filter(deleted_at__isnull=True)
        
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
