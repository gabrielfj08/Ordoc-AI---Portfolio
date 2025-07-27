from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import uuid
from .models import OrdocUser, UserOrganizationRole, UserGroup, Policy
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
    
    class Meta:
        model = UserOrganizationRole
        fields = ['id', 'role', 'role_display', 'created_at']


class OrdocUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating OrdocUser instances"""
    # User fields (write_only for creation)
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=False)
    
    # Role field
    role = serializers.CharField(write_only=True, required=False, default='organization_member')
    
    # Fields that don't exist in model but might be sent (ignored)
    cpf = serializers.CharField(write_only=True, required=False)
    date_of_birth = serializers.DateField(write_only=True, required=False)
    registration_number = serializers.CharField(write_only=True, required=False)
    send_welcome_email = serializers.BooleanField(write_only=True, required=False)
    
    class Meta:
        model = OrdocUser
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password',
            'phone', 'avatar', 'status', 'must_change_password', 'role',
            'cpf', 'date_of_birth', 'registration_number', 'send_welcome_email'
        ]
        extra_kwargs = {
            'phone': {'required': False},
            'status': {'default': 'active'},
            'must_change_password': {'default': True},
        }
    
    def create(self, validated_data):
        """Create User and OrdocUser instances"""
        # Extract User fields
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        password = validated_data.pop('password', None)
        role = validated_data.pop('role', 'organization_member')
        
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
    is_external = serializers.SerializerMethodField()
    
    # Related fields
    roles = UserOrganizationRoleSerializer(many=True, read_only=True)
    
    class Meta:
        model = OrdocUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined',
            'status', 'status_display', 'is_external', 'phone', 'avatar',
            'must_change_password', 'password_changed_at', 'failed_attempts',
            'created_at', 'updated_at', 'roles'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'failed_attempts']
    
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
        fields = ['id', 'name', 'description', 'users_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_users_count(self, obj):
        return obj.users.count()


class PolicySerializer(serializers.ModelSerializer):
    """Serializer for Policy model"""
    effect_display = serializers.CharField(source='get_effect_display', read_only=True)
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    user_groups_count = serializers.SerializerMethodField()
    users_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Policy
        fields = [
            'id', 'name', 'description', 'effect', 'effect_display',
            'service', 'resource', 'source', 'source_display', 'is_public',
            'user_groups_count', 'users_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_groups_count(self, obj):
        return obj.user_groups.count()
    
    def get_users_count(self, obj):
        return obj.users.count()
