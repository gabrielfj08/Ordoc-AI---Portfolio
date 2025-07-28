"""
User Registration Views for Ordoc-AI
Handles user registration and account creation
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import transaction
from ordoc_cloud.models import OrdocUser, Organization
from ordoc_flow.models import ExternalRequester
from .password_validator import PasswordValidator
import uuid
import re


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new internal user
    Creates both Django User and OrdocUser profile
    """
    try:
        # Extract data from request
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        name = request.data.get('name', '').strip()
        subdomain = request.data.get('subdomain', '').strip().lower()
        
        # Validation
        if not email or not password or not name:
            return Response({
                'error': 'Email, password, and name are required',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate email format
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({
                'error': 'Invalid email format',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password strength using custom validator
        user_info = {
            'name': name,
            'email': email
        }
        is_valid, errors = PasswordValidator.validate_password(password, user_info)

        if not is_valid:
            return Response({
                'error': 'Password does not meet security requirements',
                'details': errors,
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'User with this email already exists',
                'status': 409
            }, status=status.HTTP_409_CONFLICT)
        
        # Get or create organization
        organization = None
        if subdomain:
            try:
                organization = Organization.objects.get(
                    subdomain=subdomain, 
                    deleted_at__isnull=True
                )
            except Organization.DoesNotExist:
                # Create a new organization if it doesn't exist
                organization = Organization.objects.create(
                    id=uuid.uuid4(),
                    corporate_name=f"Organização {subdomain.title()}",
                    subdomain=subdomain,
                    cnpj="12345678000195",  # Valid fake CNPJ format (14 digits)
                    email=email,
                    is_active=True
                )
        
        # Create user in transaction
        with transaction.atomic():
            # Create Django User
            django_user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name.split()[0] if name.split() else '',
                last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
            )
            
            # Create OrdocUser profile
            ordoc_user = OrdocUser.objects.create(
                id=uuid.uuid4(),
                user=django_user,
                status='active',  # Use status field instead of is_active_user property
                failed_attempts=0
            )
            
            # Associate with organization if provided
            if organization:
                ordoc_user.organizations.add(organization)
        
        # Generate JWT token
        token = ordoc_user.get_token()
        
        return Response({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': str(ordoc_user.id),
                'name': django_user.get_full_name() or django_user.username,
                'email': django_user.email,
                'type': 'internal_user',
            },
            'organization': {
                'id': str(organization.id),
                'name': organization.corporate_name,
                'subdomain': organization.subdomain,
            } if organization else None,
            'status': 201
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Registration failed: {str(e)}',
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_external_requester(request):
    """
    Register a new external requester
    External requesters don't have passwords, they use magic links
    """
    try:
        # Extract data from request
        email = request.data.get('email', '').strip().lower()
        name = request.data.get('name', '').strip()
        company = request.data.get('company', '').strip()
        phone = request.data.get('phone', '').strip()
        subdomain = request.data.get('subdomain', '').strip().lower()
        
        # Validation
        if not email or not name:
            return Response({
                'error': 'Email and name are required',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate email format
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({
                'error': 'Invalid email format',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get organization
        organization = None
        if subdomain:
            try:
                organization = Organization.objects.get(
                    subdomain=subdomain, 
                    deleted_at__isnull=True
                )
            except Organization.DoesNotExist:
                return Response({
                    'error': 'Organization not found',
                    'status': 404
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if external requester already exists
        if ExternalRequester.objects.filter(email=email, organization=organization).exists():
            return Response({
                'error': 'External requester with this email already exists in this organization',
                'status': 409
            }, status=status.HTTP_409_CONFLICT)
        
        # Create external requester
        external_requester = ExternalRequester.objects.create(
            id=uuid.uuid4(),
            name=name,
            email=email,
            company=company or '',
            phone=phone or '',
            organization=organization,
            is_active_user=True
        )
        
        # Generate JWT token (for testing purposes)
        token = external_requester.get_token()
        
        return Response({
            'message': 'External requester registered successfully',
            'token': token,
            'user': {
                'id': str(external_requester.id),
                'name': external_requester.name,
                'email': external_requester.email,
                'type': 'external_requester',
                'company': external_requester.company,
                'phone': external_requester.phone,
            },
            'organization': {
                'id': str(organization.id),
                'name': organization.corporate_name,
                'subdomain': organization.subdomain,
            } if organization else None,
            'status': 201
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Registration failed: {str(e)}',
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_email(request):
    """
    Check if email is already registered
    Useful for frontend validation
    """
    email = request.GET.get('email', '').strip().lower()
    
    if not email:
        return Response({
            'error': 'Email parameter is required',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check in both User and ExternalRequester
    user_exists = User.objects.filter(email=email).exists()
    external_exists = ExternalRequester.objects.filter(email=email).exists()
    
    return Response({
        'email': email,
        'exists': user_exists or external_exists,
        'user_type': 'internal' if user_exists else 'external' if external_exists else None,
        'status': 200
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def create_demo_organization(request):
    """
    Create a demo organization for testing purposes
    """
    try:
        subdomain = request.data.get('subdomain', 'demo').strip().lower()
        name = request.data.get('name', f'Organização {subdomain.title()}').strip()
        
        # Check if organization already exists
        if Organization.objects.filter(subdomain=subdomain).exists():
            return Response({
                'error': 'Organization with this subdomain already exists',
                'status': 409
            }, status=status.HTTP_409_CONFLICT)
        
        # Create organization
        organization = Organization.objects.create(
            id=uuid.uuid4(),
            corporate_name=name,
            subdomain=subdomain,
            cnpj="12345678000195",  # Valid fake CNPJ format (14 digits)
            email=f"admin@{subdomain}.com",
            is_active=True
        )
        
        return Response({
            'message': 'Demo organization created successfully',
            'organization': {
                'id': str(organization.id),
                'name': organization.corporate_name,
                'subdomain': organization.subdomain,
                'email': organization.email,
            },
            'status': 201
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Organization creation failed: {str(e)}',
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
