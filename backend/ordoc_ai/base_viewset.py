"""
Base ViewSet for Ordoc-AI
Equivalent to Rails BaseController with authentication and organization handling
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser
from ordoc_flow.models import ExternalRequester
from ordoc_air.models import Organization
from .authentication import get_current_user, get_current_organization, get_current_ordoc_user
from typing import Union, Optional


class BaseViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet for all Ordoc-AI APIs
    Equivalent to Rails BaseController
    
    Provides:
    - JWT Authentication
    - Organization context
    - Current user helpers
    - Standard error handling
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_current_user(self) -> Optional[Union[User, ExternalRequester]]:
        """
        Get current authenticated user
        Equivalent to Rails current_user method
        """
        return get_current_user(self.request)
    
    def get_current_organization(self) -> Optional[Organization]:
        """
        Get current organization from subdomain
        Equivalent to Rails current_organization method
        """
        return get_current_organization(self.request)
    
    def get_current_ordoc_user(self) -> Optional[OrdocUser]:
        """
        Get current OrdocUser profile
        """
        return get_current_ordoc_user(self.request)
    
    def is_external_requester(self) -> bool:
        """
        Check if current user is an external requester
        """
        return isinstance(self.get_current_user(), ExternalRequester)
    
    def is_internal_user(self) -> bool:
        """
        Check if current user is an internal user
        """
        return isinstance(self.get_current_user(), User)

    def get_user_roles(self) -> list:
        """
        Get all roles of the current user in the current organization
        Returns: list of role codes (e.g., ['admin', 'organization_manager'])
        """
        ordoc_user = self.get_current_ordoc_user()
        organization = self.get_current_organization()

        if not ordoc_user or not organization:
            return []

        from ordoc_cloud.models import UserOrganizationRole

        roles = UserOrganizationRole.objects.filter(
            user=ordoc_user,
            organization=organization,
            is_active=True
        ).values_list('role', flat=True)

        return list(roles)

    def is_admin(self) -> bool:
        """
        Check if current user has admin role
        """
        return 'admin' in self.get_user_roles()

    def is_organization_manager(self) -> bool:
        """
        Check if current user has organization_manager role
        """
        return 'organization_manager' in self.get_user_roles()

    def is_department_manager(self) -> bool:
        """
        Check if current user has department_manager role
        """
        return 'department_manager' in self.get_user_roles()

    def is_organization_member(self) -> bool:
        """
        Check if current user has organization_member role (lowest permission)
        """
        return 'organization_member' in self.get_user_roles()

    def get_user_department(self):
        """
        Get the department of the current user
        Returns the first department found in user's roles
        """
        ordoc_user = self.get_current_ordoc_user()
        organization = self.get_current_organization()

        if not ordoc_user or not organization:
            return None

        # Try to get department from tasks assigned to user
        from ordoc_flow.models import Task
        task_with_dept = Task.objects.filter(
            assignee=ordoc_user,
            procedure__organization=organization
        ).exclude(
            procedure__requester__isnull=True
        ).first()

        # For now, return None as department is not directly linked to user
        # This can be enhanced later
        return None

    def should_show_deleted(self):
        """
        Override in subclasses to control soft-delete filtering.
        By default, hides deleted items.

        Example:
            def should_show_deleted(self):
                # Show deleted items when in_trash=true
                return self.request.query_params.get('in_trash', 'false').lower() == 'true'
        """
        return False

    def get_queryset(self):
        """
        Override to filter by organization if available.
        Automatically filters soft-deleted records unless should_show_deleted() returns True.
        """
        queryset = super().get_queryset()

        # Filter by organization if model has organization field
        organization = self.get_current_organization()
        if organization and hasattr(queryset.model, 'organization'):
            queryset = queryset.filter(organization=organization)

        # Filter soft-deleted records (can be overridden by subclasses)
        if hasattr(queryset.model, 'deleted_at'):
            if self.should_show_deleted():
                # Subclass wants to show deleted items (e.g., trash view)
                # Don't filter deleted_at
                pass
            else:
                # Default: hide deleted items
                queryset = queryset.filter(deleted_at__isnull=True)

        return queryset
    
    def perform_create(self, serializer):
        """
        Override to set organization and user on creation
        """
        # Set organization if model has organization field
        organization = self.get_current_organization()
        if organization and hasattr(serializer.Meta.model, 'organization'):
            serializer.save(organization=organization)
        else:
            serializer.save()
    
    def handle_exception(self, exc):
        """
        Custom exception handling
        """
        response = super().handle_exception(exc)
        
        # Add custom error format similar to Rails
        if hasattr(response, 'data') and isinstance(response.data, dict):
            if 'detail' in response.data:
                response.data = {
                    'error': response.data['detail'],
                    'status': response.status_code
                }
        
        return response
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get current user information
        Equivalent to Rails current_user endpoint
        """
        user = self.get_current_user()
        organization = self.get_current_organization()
        
        if self.is_external_requester():
            # External requester data
            data = {
                'id': str(user.id),
                'name': user.name,
                'email': user.email,
                'type': 'external_requester',
                'organization': {
                    'id': str(organization.id) if organization else None,
                    'name': organization.corporate_name if organization else None,
                    'subdomain': organization.subdomain if organization else None,
                } if organization else None
            }
        else:
            # Internal user data
            ordoc_user = self.get_current_ordoc_user()
            data = {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'type': 'internal_user',
                'status': ordoc_user.status if ordoc_user else 'active',
                'organization': {
                    'id': str(organization.id) if organization else None,
                    'name': organization.corporate_name if organization else None,
                    'subdomain': organization.subdomain if organization else None,
                } if organization else None
            }
        
        return Response(data)


class BaseAPIViewSet(BaseViewSet):
    """
    Base ViewSet for API endpoints with versioning
    Equivalent to Rails V2::BaseController, V3::BaseController, etc.
    """
    
    def get_serializer_context(self):
        """
        Add extra context to serializers
        """
        context = super().get_serializer_context()
        context.update({
            'current_user': self.get_current_user(),
            'current_organization': self.get_current_organization(),
            'current_ordoc_user': self.get_current_ordoc_user(),
            'request': self.request,
        })
        return context
    
    def list(self, request, *args, **kwargs):
        """
        Override list to add pagination info similar to Rails
        """
        response = super().list(request, *args, **kwargs)
        
        # Add pagination metadata similar to Rails
        if hasattr(response, 'data') and 'results' in response.data:
            paginator = self.paginate_queryset(self.get_queryset())
            if paginator is not None:
                response.data['pagination'] = {
                    'current_page': getattr(self.paginator, 'page', {}).number if hasattr(self.paginator, 'page') else 1,
                    'total_pages': getattr(self.paginator, 'page', {}).paginator.num_pages if hasattr(self.paginator, 'page') else 1,
                    'total_count': self.get_queryset().count(),
                    'per_page': self.paginator.page_size if hasattr(self, 'paginator') else 20,
                }
        
        return response
