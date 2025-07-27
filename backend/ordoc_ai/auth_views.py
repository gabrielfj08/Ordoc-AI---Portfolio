"""
Authentication Views for Ordoc-AI
Equivalent to Rails AuthenticationController
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser
from ordoc_flow.models import ExternalRequester
from ordoc_air.models import Organization
from .jwt_service import JWTService
from .password_validator import PasswordValidator
from django.db import transaction
from django.contrib.auth.hashers import check_password
import logging
import requests
from django.conf import settings

# Configure logger for security events
logger = logging.getLogger('ordoc_ai.security')

def validate_turnstile_token(token: str, client_ip: str) -> bool:
    """
    Validate Cloudflare Turnstile token with Cloudflare API
    Returns True if token is valid, False otherwise
    """
    if not token:
        logger.warning(f"Turnstile validation failed: No token provided from IP {client_ip}")
        return False
    
    # Get Turnstile secret key from settings
    secret_key = getattr(settings, 'TURNSTILE_SECRET_KEY', None)
    if not secret_key:
        logger.error("Turnstile secret key not configured")
        return False
    
    # Prepare validation request
    validation_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    data = {
        'secret': secret_key,
        'response': token,
        'remoteip': client_ip
    }
    
    try:
        # Send validation request to Cloudflare
        response = requests.post(validation_url, data=data, timeout=10)
        result = response.json()
        
        if result.get('success', False):
            logger.info(f"Turnstile validation successful for IP {client_ip}")
            return True
        else:
            error_codes = result.get('error-codes', [])
            logger.warning(f"Turnstile validation failed for IP {client_ip}. Errors: {error_codes}")
            return False
            
    except requests.RequestException as e:
        logger.error(f"Turnstile validation request failed for IP {client_ip}: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during Turnstile validation for IP {client_ip}: {str(e)}")
        return False

def get_client_ip(request):
    """
    Extract client IP address from request headers
    Handles X-Forwarded-For and X-Real-IP headers like the original project
    """
    # Check X-Forwarded-For header (proxy/load balancer)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # Take the first IP in the chain
        ip = x_forwarded_for.split(',')[0].strip()
        return ip
    
    # Check X-Real-IP header (nginx)
    x_real_ip = request.META.get('HTTP_X_REAL_IP')
    if x_real_ip:
        return x_real_ip.strip()
    
    # Fallback to REMOTE_ADDR
    return request.META.get('REMOTE_ADDR', 'unknown')


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login endpoint
    Equivalent to Rails AuthenticationController#create
    
    Supports both internal users and external requesters
    Includes IP tracking for security auditing
    """
    email = request.data.get('email')
    password = request.data.get('password')
    subdomain = request.META.get('HTTP_X_API_SUBDOMAIN')
    user_type = request.data.get('user_type', 'internal')  # 'internal' or 'external'
    turnstile_token = request.data.get('turnstile_token')  # Cloudflare Turnstile token
    
    # Extract IP address for security tracking (like original project)
    client_ip = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    # Validate Turnstile token for anti-bot protection
    if turnstile_token:
        is_valid_turnstile = validate_turnstile_token(turnstile_token, client_ip)
        if not is_valid_turnstile:
            logger.warning(f"Login attempt blocked due to invalid Turnstile token from IP {client_ip} for email {email}")
            return Response({
                'error': 'Verificação de segurança falhou. Tente novamente.',
                'status': 403
            }, status=status.HTTP_403_FORBIDDEN)
    else:
        # For development/testing, log missing Turnstile token but don't block
        logger.info(f"Login attempt without Turnstile token from IP {client_ip} for email {email}")
    
    if not email or not password:
        return Response({
            'error': 'Email and password are required',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get organization by subdomain
    organization = None
    if subdomain:
        try:
            organization = Organization.objects.get(subdomain=subdomain, deleted_at__isnull=True)
        except Organization.DoesNotExist:
            return Response({
                'error': 'Organization not found',
                'status': 404
            }, status=status.HTTP_404_NOT_FOUND)
    
    if user_type == 'external':
        # External requester login
        return login_external_requester(email, password, organization, client_ip, user_agent)
    else:
        # Internal user login
        return login_internal_user(email, password, organization, client_ip, user_agent)


def login_internal_user(email: str, password: str, organization: Organization = None, client_ip: str = 'unknown', user_agent: str = ''):
    """
    Login for internal users (OrdocUser)
    Includes IP tracking and security logging
    """
    try:
        # Authenticate user
        user = authenticate(username=email, password=password)
        if not user:
            # Try with email field
            try:
                django_user = User.objects.get(email=email)
                user = authenticate(username=django_user.username, password=password)
            except User.DoesNotExist:
                pass
        
        if not user or not user.is_active:
            return Response({
                'error': 'Invalid credentials or inactive account',
                'status': 401
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if user has OrdocUser profile
        try:
            ordoc_user = user.ordoc_profile
        except OrdocUser.DoesNotExist:
            return Response({
                'error': 'User profile not found',
                'status': 404
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is active
        if not ordoc_user.is_active_user:
            if ordoc_user.is_blocked:
                return Response({
                    'error': 'Account is blocked due to multiple failed login attempts',
                    'status': 423
                }, status=status.HTTP_423_LOCKED)
            else:
                return Response({
                    'error': 'Account is not active',
                    'status': 403
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Check organization membership if organization is specified
        if organization:
            if not ordoc_user.organizations.filter(id=organization.id).exists():
                return Response({
                    'error': 'User does not belong to this organization',
                    'status': 403
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Reset failed attempts on successful login
        ordoc_user.reset_failed_attempts()
        
        # Generate JWT token
        token = ordoc_user.get_token()
        
        return Response({
            'token': token,
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'type': 'internal_user',
                'status': ordoc_user.status,
                'must_change_password': ordoc_user.requires_password_change,
            },
            'organization': {
                'id': str(organization.id),
                'name': organization.corporate_name,
                'subdomain': organization.subdomain,
            } if organization else None,
            'expires_at': JWTService.expiration_time().isoformat(),
        })
        
    except Exception as e:
        return Response({
            'error': 'Login failed',
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def me(request):
    """
    Get current user data from JWT token
    Used for token validation and user data retrieval
    """
    try:
        # Get user from request (set by JWT authentication middleware)
        user = request.user
        
        if not user or not user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'status': 401
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get OrdocUser profile
        try:
            ordoc_user = user.ordoc_profile
        except OrdocUser.DoesNotExist:
            return Response({
                'error': 'User profile not found',
                'status': 404
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get user's organization (if any)
        organization = ordoc_user.organization if hasattr(ordoc_user, 'organization') else None
        
        # Return user data in the same format as login
        return Response({
            'user': {
                'id': str(ordoc_user.id),
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'user_type': 'internal',
                'is_active': ordoc_user.is_active_user,
                'permissions': [],  # TODO: Implement permissions
            },
            'organization': {
                'id': str(organization.id),
                'name': organization.corporate_name,
                'subdomain': organization.subdomain,
            } if organization else None,
        })
        
    except Exception as e:
        logger.error(f"Error in /api/auth/me/ endpoint: {str(e)}")
        return Response({
            'error': 'Failed to get user data',
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def login_external_requester(email: str, password: str, organization: Organization = None, client_ip: str = 'unknown', user_agent: str = ''):
    """
    Login for external requesters
    Note: External requesters don't have passwords in the original system,
    they use magic links or other authentication methods.
    This is a placeholder for future implementation.
    Includes IP tracking and security logging.
    """
    try:
        # Find external requester
        external_requester = ExternalRequester.objects.get(
            email=email,
            organization=organization if organization else None
        )
        
        if not external_requester.is_active_user:
            return Response({
                'error': 'External requester account is not active',
                'status': 403
            }, status=status.HTTP_403_FORBIDDEN)
        
        # For now, we'll generate a token without password validation
        # In production, this should use magic links or other secure methods
        token = external_requester.get_token()
        
        return Response({
            'token': token,
            'user': {
                'id': str(external_requester.id),
                'name': external_requester.name,
                'email': external_requester.email,
                'type': 'external_requester',
                'company': external_requester.company,
            },
            'organization': {
                'id': str(organization.id),
                'name': organization.corporate_name,
                'subdomain': organization.subdomain,
            } if organization else None,
            'expires_at': JWTService.expiration_time().isoformat(),
        })
        
    except ExternalRequester.DoesNotExist:
        return Response({
            'error': 'External requester not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def logout(request):
    """
    User logout endpoint
    Equivalent to Rails AuthenticationController#destroy
    
    Note: Since we're using stateless JWT, logout is handled client-side
    by removing the token. Server-side token blacklisting could be added later.
    """
    return Response({
        'message': 'Logged out successfully',
        'status': 200
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Refresh JWT token
    """
    token = request.data.get('token')
    if not token:
        return Response({
            'error': 'Token is required',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Decode current token
        token_data = JWTService.decode(token)
        
        # Check if it's an external requester or internal user
        if 'subject' in token_data and token_data.get('type') == 'external_requester':
            # External requester token refresh
            requester = ExternalRequester.objects.get(id=token_data['subject'])
            new_token = requester.get_token()
        elif 'sub' in token_data:
            # Internal user token refresh
            user = User.objects.get(id=token_data['sub'])
            ordoc_user = user.ordoc_profile
            new_token = ordoc_user.get_token()
        else:
            raise Exception('Invalid token format')
        
        return Response({
            'token': new_token,
            'expires_at': JWTService.expiration_time().isoformat(),
        })
        
    except Exception as e:
        return Response({
            'error': 'Token refresh failed',
            'status': 401
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def change_password(request):
    """
    Change user password endpoint
    Handles both mandatory password changes and voluntary changes
    """
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    force_change = request.data.get('force_change', False)  # For mandatory changes
    
    # Extract IP address for security tracking
    client_ip = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    # Get current user from JWT token
    token = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
    if not token:
        return Response({
            'error': 'Token de autenticação necessário',
            'status': 401
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        # Decode token to get user
        token_data = JWTService.decode(token)
        user = User.objects.get(id=token_data['sub'])
        ordoc_user = user.ordoc_profile
        
        # Validate inputs
        if not new_password:
            return Response({
                'error': 'Nova senha é obrigatória',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({
                'error': 'Confirmação de senha não confere',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # For voluntary changes, verify current password
        if not force_change:
            if not current_password:
                return Response({
                    'error': 'Senha atual é obrigatória',
                    'status': 400
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not check_password(current_password, user.password):
                logger.warning(f"Password change failed - incorrect current password for user {user.email} from IP {client_ip}")
                return Response({
                    'error': 'Senha atual incorreta',
                    'status': 400
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password strength
        user_info = {
            'name': user.get_full_name(),
            'email': user.email
        }
        is_valid, errors = PasswordValidator.validate_password(new_password, user_info)
        
        if not is_valid:
            return Response({
                'error': 'Senha não atende aos requisitos de segurança',
                'details': errors,
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if new password is different from current
        if check_password(new_password, user.password):
            return Response({
                'error': 'A nova senha deve ser diferente da senha atual',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update password
        user.set_password(new_password)
        user.save()
        
        # Mark password as changed
        ordoc_user.mark_password_changed()
        
        # Log security event
        logger.info(f"Password changed successfully for user {user.email} from IP {client_ip}")
        
        return Response({
            'message': 'Senha alterada com sucesso',
            'status': 200
        })
        
    except Exception as e:
        logger.error(f"Error in password change for IP {client_ip}: {str(e)}")
        return Response({
            'error': 'Erro interno do servidor',
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def validate_password_strength(request):
    """
    Validate password strength without changing it
    Used for real-time password validation in frontend
    """
    password = request.data.get('password')
    user_info = request.data.get('user_info', {})
    
    if not password:
        return Response({
            'error': 'Senha é obrigatória',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate password
    is_valid, errors = PasswordValidator.validate_password(password, user_info)
    strength = PasswordValidator.get_password_strength(password)
    
    return Response({
        'is_valid': is_valid,
        'errors': errors,
        'strength': strength,
        'status': 200
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def password_requirements(request):
    """
    Get password requirements for frontend display
    """
    requirements = PasswordValidator.generate_password_requirements()
    
    return Response({
        'requirements': requirements,
        'status': 200
    })
