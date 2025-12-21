"""
Custom Authentication Backend for Ordoc-AI
Equivalent to Rails BaseController.authenticate method
"""
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from django.http import HttpRequest
import logging
from ordoc_cloud.models import OrdocUser
from ordoc_flow.models import ExternalRequester
from ordoc_air.models import Organization
from .jwt_service import JWTService, JWTError
from typing import Tuple, Optional, Union

logger = logging.getLogger(__name__)


class JWTAuthentication(BaseAuthentication):
    """
    Custom JWT Authentication for Ordoc-AI
    Equivalent to Rails BaseController.authenticate method
    
    Supports both internal users (OrdocUser) and external requesters (ExternalRequester)
    """
    
    def authenticate(self, request: HttpRequest) -> Optional[Tuple[Union[User, ExternalRequester], dict]]:
        """
        Authenticate user based on JWT token
        Returns tuple of (user, token_data) or None if authentication fails
        """
        # Get token from Authorization header
        token = self.get_token_from_header(request)
        if not token:
            return None
        
        try:
            # Decode JWT token
            token_data = JWTService.decode(token)
            
            # Check if it's an external requester or internal user
            if 'subject' in token_data and token_data.get('type') == 'external_requester':
                # External requester authentication
                user = self.authenticate_external_requester(token_data)
            elif 'sub' in token_data:
                # Internal user authentication
                user = self.authenticate_internal_user(token_data)
            else:
                raise AuthenticationFailed('Invalid token format')
            
            # Get organization from subdomain
            organization = self.get_organization_from_request(request)
            if organization:
                token_data['organization'] = organization
            
            return (user, token_data)
            
        except JWTError as e:
            raise AuthenticationFailed(str(e))
        except Exception as e:
            logger.exception("Unexpected authentication error")
            raise AuthenticationFailed('Authentication failed') from e
    
    def get_token_from_header(self, request: HttpRequest) -> Optional[str]:
        """
        Extract JWT token from Authorization header
        Supports both 'Bearer <token>' and 'Token <token>' formats
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
        
        try:
            # Support both 'Bearer' and 'Token' prefixes
            prefix, token = auth_header.split(' ', 1)
            if prefix.lower() in ['bearer', 'token']:
                return token
        except ValueError:
            pass
        
        return None
    
    def authenticate_internal_user(self, token_data: dict) -> User:
        """
        Authenticate internal user (OrdocUser)
        Equivalent to Rails User.active.find(claims[:sub])
        """
        try:
            user_id = token_data['sub']
            user = User.objects.get(id=user_id, is_active=True)
            
            # Check if user has OrdocUser profile and is active
            if hasattr(user, 'ordoc_profile'):
                ordoc_user = user.ordoc_profile
                if not ordoc_user.is_active_user:
                    raise AuthenticationFailed('User account is not active')
            
            return user
            
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found or inactive')
    
    def authenticate_external_requester(self, token_data: dict) -> ExternalRequester:
        """
        Authenticate external requester
        Equivalent to Rails ExternalRequester.active.find(claims[:subject])
        """
        try:
            requester_id = token_data['subject']
            requester = ExternalRequester.objects.get(id=requester_id)
            
            if not requester.is_active_user:
                raise AuthenticationFailed('External requester account is not active')
            
            return requester
            
        except ExternalRequester.DoesNotExist:
            raise AuthenticationFailed('External requester not found or inactive')
    
    def get_organization_from_request(self, request: HttpRequest) -> Optional[Organization]:
        """
        Get organization from X-Api-Subdomain header
        Equivalent to Rails organization_by_subdomain method
        """
        subdomain = request.META.get('HTTP_X_API_SUBDOMAIN')
        if not subdomain:
            # Fallback to older header name
            subdomain = request.META.get('HTTP_X_SUBDOMAIN')
            
        if not subdomain:
            return None
        
        try:
            return Organization.objects.get(subdomain=subdomain, deleted_at__isnull=True)
        except Organization.DoesNotExist:
            return None
    
    def authenticate_header(self, request: HttpRequest) -> str:
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response.
        """
        return 'Bearer realm="api"'


class OrganizationMiddleware:
    """
    Middleware to set current organization based on subdomain
    Equivalent to Rails organization_by_subdomain functionality
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Get organization from subdomain header
        subdomain = request.META.get('HTTP_X_API_SUBDOMAIN')
        if not subdomain:
            subdomain = request.META.get('HTTP_X_SUBDOMAIN')
            
        if subdomain:
            try:
                organization = Organization.objects.get(
                    subdomain=subdomain, 
                    deleted_at__isnull=True
                )
                request.current_organization = organization
            except Organization.DoesNotExist:
                request.current_organization = None
        else:
            request.current_organization = None
        
        response = self.get_response(request)
        return response


def get_current_user(request) -> Optional[Union[User, ExternalRequester]]:
    """
    Helper function to get current authenticated user
    Equivalent to Rails current_user method
    """
    if hasattr(request, 'user') and request.user.is_authenticated:
        return request.user
    return None


def get_current_organization(request) -> Optional[Organization]:
    """
    Helper function to get current organization
    Equivalent to Rails current_organization method
    
    Tries multiple methods to find organization:
    1. From request.current_organization (set by middleware)
    2. From user's organization role
    3. Default organization (fallback)
    """
    # Try from middleware first
    if hasattr(request, 'current_organization') and request.current_organization:
        return request.current_organization
    
    # Try from user's organization role
    user = get_current_user(request)
    if user and hasattr(user, 'ordoc_profile'):
        ordoc_user = user.ordoc_profile
        from ordoc_cloud.models import UserOrganizationRole
        role = UserOrganizationRole.objects.filter(user=ordoc_user).first()
        if role:
            return role.organization
    
    # Fallback to first organization (for development/testing)
    return Organization.objects.first()


def get_current_ordoc_user(request) -> Optional[OrdocUser]:
    """
    Helper function to get current OrdocUser profile
    """
    user = get_current_user(request)
    if user and hasattr(user, 'ordoc_profile'):
        return user.ordoc_profile
    return None
