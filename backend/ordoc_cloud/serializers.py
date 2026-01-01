from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import uuid
from .models import (
    OrdocUser, UserOrganizationRole, UserGroup, Policy, AuditLog,
    PersonalDataMapping, DataSubjectRequest, ConsentRecord
)
from ordoc_air.models import Organization, Department


class UserSerializer(serializers.ModelSerializer):
    """Serializer for Django User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']


class UserOrganizationRoleSerializer(serializers.ModelSerializer):
    """Serializer for UserOrganizationRole model"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    user_name = serializers.SerializerMethodField()
    organization_name = serializers.CharField(source='organization.corporate_name', read_only=True)
    assigned_by_name = serializers.SerializerMethodField()

    class Meta:
        model = UserOrganizationRole
        fields = [
            'id', 'user', 'user_name', 'organization', 'organization_name',
            'role', 'role_display', 'is_active', 'is_primary',
            'started_at', 'ended_at', 'assigned_by', 'assigned_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'started_at']

    def get_user_name(self, obj):
        return obj.user.user.get_full_name() or obj.user.user.username

    def get_assigned_by_name(self, obj):
        if obj.assigned_by:
            return obj.assigned_by.user.get_full_name() or obj.assigned_by.user.username
        return None


class OrdocUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating OrdocUser instances"""
    # User fields (write_only for creation)
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    
    # New single name field to support frontend UX
    name = serializers.CharField(write_only=True, required=False)
    
    # Role field
    role = serializers.CharField(write_only=True, required=False, allow_blank=True, default='organization_member')
    
    # Fields that don't exist in model but might be sent (ignored)
    cpf = serializers.CharField(write_only=True, required=False)
    date_of_birth = serializers.DateField(write_only=True, required=False)
    registration_number = serializers.CharField(write_only=True, required=False)
    send_welcome_email = serializers.BooleanField(write_only=True, required=False)
    
    class Meta:
        model = OrdocUser
        fields = [
            'username', 'email', 'name', 'first_name', 'last_name', 'password',
            'phone', 'avatar', 'status', 'must_change_password', 'role',
            'cpf', 'date_of_birth', 'registration_number', 'send_welcome_email'
        ]
        extra_kwargs = {
            'phone': {'required': False},
            'status': {'default': 'active'},
            'must_change_password': {'default': True},
        }
    
    def validate(self, attrs):
        """Derived fields validation"""
        # Handle Name splitting
        name = attrs.get('name')
        if name:
            parts = name.strip().split(' ', 1)
            if not attrs.get('first_name'):
                attrs['first_name'] = parts[0]
            if not attrs.get('last_name'):
                attrs['last_name'] = parts[1] if len(parts) > 1 else ''
                
        # Handle auto-username
        email = attrs.get('email')
        if not attrs.get('username') and email:
            # Use email local part as base username
            username = email.split('@')[0]
            # Ensure uniqueness
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            attrs['username'] = username
            
        # Require basics if they weren't derived
        if not attrs.get('first_name'):
             # Fallback if no name provided
             pass 
             
        return attrs

    def create(self, validated_data):
        """Create User and OrdocUser instances"""
        # Remove auxiliary fields
        validated_data.pop('name', None)
        
        # Extract User fields
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        password = validated_data.pop('password', None)
        role = validated_data.pop('role', 'organization_member')
        
        # Handle empty role string
        if not role:
            role = 'organization_member'
        
        # All fields now exist in the OrdocUser model
        
        # Generate password if not provided
        if not password:
            password = str(uuid.uuid4())[:8]  # Generate temporary password
        
        # Create Django User
        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=make_password(password),
            is_active=True
        )
        
        # Create OrdocUser
        ordoc_user = OrdocUser.objects.create(
            user=user,
            **validated_data
        )
        
        # Create role relationship if organization is available
        if hasattr(self.context.get('request'), 'current_organization'):
            organization = self.context['request'].current_organization
            if organization:
                UserOrganizationRole.objects.create(
                    user=ordoc_user,
                    organization=organization,
                    role=role
                )
        
        return ordoc_user
        
    def validate_phone(self, value):
        """Clean phone format"""
        import re
        if not value:
            return value
        return re.sub(r'[^0-9]', '', value)

    def validate_cpf(self, value):
        """Clean CPF format"""
        import re
        if not value:
            return value
        return re.sub(r'[^0-9]', '', value)
    
    def to_representation(self, instance):
        """Return complete user data after creation"""
        return {
            'id': str(instance.id),
            'username': instance.user.username,
            'email': instance.user.email,
            'first_name': instance.user.first_name,
            'last_name': instance.user.last_name,
            'phone': instance.phone,
            'cpf': instance.cpf,
            'date_of_birth': instance.date_of_birth.isoformat() if instance.date_of_birth else None,
            'registration_number': instance.registration_number,
            'avatar': instance.avatar.url if instance.avatar else None,
            'status': instance.status,
            'must_change_password': instance.must_change_password,
            'send_welcome_email': instance.send_welcome_email,
            'created_at': instance.created_at.isoformat() if instance.created_at else None,
        }


class OrdocUserSerializer(serializers.ModelSerializer):
    """Serializer for OrdocUser model"""
    # User fields
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    # OrdocUser fields
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    is_external = serializers.SerializerMethodField()

    # Related fields
    roles = UserOrganizationRoleSerializer(many=True, read_only=True)

    class Meta:
        model = OrdocUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined',
            'status', 'status_display', 'is_external', 'phone', 'cpf', 'date_of_birth',
            'registration_number', 'avatar', 'profile_complete',
            'language', 'language_display', 'timezone', 'email_notifications',
            'must_change_password', 'password_changed_at', 'failed_attempts',
            'last_login_at', 'last_login_ip', 'two_factor_enabled',
            'created_at', 'updated_at', 'roles'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'failed_attempts',
            'last_login_at', 'last_login_ip', 'profile_complete'
        ]

    def get_is_external(self, obj):
        """Determine if user is external based on roles"""
        # For now, consider all users as internal unless specified otherwise
        # This can be enhanced based on business logic
        return False


class OrdocUserListSerializer(serializers.ModelSerializer):
    """Simplified serializer for user lists"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_external = serializers.SerializerMethodField()
    
    # Current organization role
    current_role = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    
    class Meta:
        model = OrdocUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_active',
            'status', 'status_display', 'is_external', 'avatar',
            'current_role', 'department', 'created_at'
        ]
    
    def get_is_external(self, obj):
        """Determine if user is external"""
        return False
    
    def get_current_role(self, obj):
        """Get user's role in current organization"""
        request = self.context.get('request')
        if not request or not hasattr(request, 'current_organization'):
            return None
        
        try:
            role = obj.roles.filter(organization=request.current_organization).first()
            if role:
                return {
                    'id': role.id,
                    'name': role.get_role_display(),
                    'code': role.role
                }
        except:
            pass
        return None
    
    def get_department(self, obj):
        """Get user's department in current organization"""
        request = self.context.get('request')
        if not request or not hasattr(request, 'current_organization'):
            return None
        
        # This would need to be implemented based on how departments are linked to users
        # For now, return None as the relationship isn't clearly defined in the models
        return None


class UserGroupSerializer(serializers.ModelSerializer):
    """Serializer for UserGroup model"""
    users_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserGroup
        fields = ['id', 'name', 'description', 'is_active', 'users_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_users_count(self, obj):
        return obj.users.count()


class UserGroupCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating UserGroup with optional organization_id"""
    organization_id = serializers.UUIDField(required=False, write_only=True)
    
    class Meta:
        model = UserGroup
        fields = ['name', 'description', 'is_active', 'organization_id']
        extra_kwargs = {
            'is_active': {'default': True}
        }
        
    def validate(self, attrs):
        """Check for duplicate group name in organization"""
        request = self.context.get('request')
        name = attrs.get('name')
        organization_id = attrs.get('organization_id')
        
        # Determine organization
        organization = None
        if organization_id:
            try:
                organization = Organization.objects.get(id=organization_id)
            except Organization.DoesNotExist:
                pass
        elif request and hasattr(request, 'current_organization'):
            organization = request.current_organization
            
        if organization and name:
            if UserGroup.objects.filter(organization=organization, name=name).exists():
                raise serializers.ValidationError(
                    {"name": "Já existe um grupo com este nome nesta organização."}
                )
        
        return attrs
        
    def create(self, validated_data):
        organization_id = validated_data.pop('organization_id', None)
        # Remove organization if injected by BaseViewSet.perform_create
        injected_org = validated_data.pop('organization', None)
        
        request = self.context.get('request')
        
        # Determine organization
        organization = None
        if organization_id:
            try:
                # Validate if user has access to this organization
                # In a real scenario, we should check UserOrganizationRole
                organization = Organization.objects.get(id=organization_id)
            except Organization.DoesNotExist:
                raise serializers.ValidationError({"organization_id": "Organization not found"})
        elif injected_org:
            organization = injected_org
        elif request and hasattr(request, 'current_organization'):
            organization = request.current_organization
            
        if not organization:
            raise serializers.ValidationError({"organization_id": "Organization is required"})
            
        # Create group
        group = UserGroup.objects.create(organization=organization, **validated_data)
        return group



class PolicySerializer(serializers.ModelSerializer):
    """Serializer for Policy model"""
    effect_display = serializers.CharField(source='get_effect_display', read_only=True)
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    service_display = serializers.CharField(source='get_service_display', read_only=True)
    user_groups_count = serializers.SerializerMethodField()
    users_count = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Policy
        fields = [
            'id', 'name', 'description', 'effect', 'effect_display',
            'service', 'service_display', 'resource', 'actions', 'conditions',
            'source', 'source_display', 'is_public', 'is_active', 'priority', 'version',
            'user_groups_count', 'users_count', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'version']
        extra_kwargs = {
            'resource': {'required': False, 'allow_null': True},
            'actions': {'required': False, 'allow_null': True},
            'conditions': {'required': False, 'allow_null': True},
            'user_groups': {'required': False},
            'users': {'required': False},
            'service': {'required': False, 'default': '*'}, # Default to all services
        }
    
    def to_internal_value(self, data):
        """Pre-validation input normalization"""
        # Create a mutable copy if data is QueryDict
        if hasattr(data, 'copy'):
            data = data.copy()
            
        # Normalize effect case (Allow -> allow)
        if 'effect' in data and isinstance(data['effect'], str):
            data['effect'] = data['effect'].lower()
            
        # Normalize service
        if 'service' in data and isinstance(data['service'], str):
            data['service'] = data['service'].lower()
            
        return super().to_internal_value(data)

    def create(self, validated_data):
        """Set default values"""
        if not validated_data.get('service'):
            validated_data['service'] = '*'
        return super().create(validated_data)

    def get_user_groups_count(self, obj):
        return obj.user_groups.count()

    def get_users_count(self, obj):
        return obj.users.count()

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.user.get_full_name() or obj.created_by.user.username
        return None


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for AuditLog model"""
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    user_name = serializers.SerializerMethodField()
    target_user_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'action', 'action_display', 'description',
            'user', 'user_name', 'target_user', 'target_user_name',
            'target_type', 'target_id', 'old_values', 'new_values',
            'ip_address', 'user_agent', 'organization', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.user.get_full_name() or obj.user.user.username
        return 'Sistema'

    def get_target_user_name(self, obj):
        if obj.target_user:
            return obj.target_user.user.get_full_name() or obj.target_user.user.username
        return None


# ============================================
# LGPD COMPLIANCE SERIALIZERS
# ============================================

class PersonalDataMappingSerializer(serializers.ModelSerializer):
    """Serializer para Mapeamento de Dados Pessoais"""

    organization_name = serializers.CharField(source='organization.corporate_name', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    data_type_display = serializers.CharField(source='get_data_type_display', read_only=True)
    legal_basis_display = serializers.CharField(source='get_legal_basis_display', read_only=True)

    class Meta:
        model = PersonalDataMapping
        fields = [
            'id', 'field_name', 'field_description',
            'data_type', 'data_type_display',
            'model_name', 'table_name',
            'legal_basis', 'legal_basis_display',
            'purpose', 'retention_period_days',
            'data_subject_categories',
            'is_shared', 'shared_with',
            'is_active',
            'organization', 'organization_name',
            'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organization', 'created_at', 'updated_at']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return 'Sistema'


class DataSubjectRequestSerializer(serializers.ModelSerializer):
    """Serializer para Solicitações do Titular"""

    organization_name = serializers.CharField(source='organization.corporate_name', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    request_type_display = serializers.CharField(source='get_request_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = DataSubjectRequest
        fields = [
            'id', 'requester_name', 'requester_email', 'requester_cpf',
            'request_type', 'request_type_display',
            'description', 'status', 'status_display',
            'request_date', 'deadline_date', 'completion_date',
            'response', 'rejection_reason',
            'evidence_files',
            'organization', 'organization_name',
            'assigned_to', 'assigned_to_name',
            'is_overdue', 'days_remaining',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organization', 'request_date', 'deadline_date', 'created_at', 'updated_at']

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None

    def get_is_overdue(self, obj):
        return obj.is_overdue()

    def get_days_remaining(self, obj):
        from django.utils import timezone
        if obj.status == 'completed':
            return 0
        delta = obj.deadline_date - timezone.now()
        return max(0, delta.days)


class ConsentRecordSerializer(serializers.ModelSerializer):
    """Serializer para Registro de Consentimento"""

    organization_name = serializers.CharField(source='organization.corporate_name', read_only=True)
    data_mapping_description = serializers.CharField(source='data_mapping.field_description', read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = ConsentRecord
        fields = [
            'id', 'data_subject_cpf', 'data_subject_name', 'data_subject_email',
            'purpose', 'consent_text',
            'is_active', 'granted_at', 'revoked_at',
            'ip_address', 'user_agent', 'consent_method',
            'organization', 'organization_name',
            'data_mapping', 'data_mapping_description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organization', 'granted_at', 'revoked_at', 'created_at', 'updated_at']


class ConsentRevokeSerializer(serializers.Serializer):
    """Serializer para revogação de consentimento"""

    reason = serializers.CharField(required=False, allow_blank=True)
