"""
Serializers for OrdocAir module
Equivalent to Rails serializers and JSON responses
"""
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db import models
import uuid
from .models import (
    Organization,
    Department,
    Directory,
    Document,
    ShareableLink,
    RecentDocument,
    Permission,
    Tag,
    ActivityLog,
)
from ordoc_cloud.models import OrdocUser


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'color', 'description', 'organization', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for ActivityLog model"""

    user_name = serializers.SerializerMethodField()
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    entity_type_display = serializers.CharField(source='get_entity_type_display', read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id', 'action', 'action_display', 'entity_type', 'entity_type_display',
            'entity_id', 'entity_name', 'description', 'old_values', 'new_values',
            'metadata', 'ip_address', 'user', 'user_name', 'organization', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user_name', 'action_display', 'entity_type_display']

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return 'Sistema'


class OrganizationSerializer(serializers.ModelSerializer):
    """
    Serializer for Organization model
    Equivalent to Rails OrganizationSerializer
    """
    
    # Read-only computed fields
    total_storage_used = serializers.SerializerMethodField()
    total_documents = serializers.SerializerMethodField()
    total_users = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'corporate_name', 'cnpj', 'subdomain', 'prn', 'phone', 
            'email', 'contact_name', 'contact_phone', 'site', 'is_active',
            'total_storage_used', 'total_documents', 'total_users', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_storage_used', 
                           'total_documents', 'total_users']
    
    def get_total_storage_used(self, obj):
        """Calculate total storage used by organization"""
        # TODO: Implement storage calculation logic
        # For now, return 0 as placeholder
        return 0
    
    def get_total_documents(self, obj):
        """Get total number of documents"""
        # Count documents through departments
        from .models import Document
        return Document.objects.filter(
            directory__department__organization=obj,
            deleted_at__isnull=True
        ).count()
    
    def get_total_users(self, obj):
        """Get total number of users"""
        # Count users through UserOrganizationRole
        from ordoc_cloud.models import UserOrganizationRole
        return UserOrganizationRole.objects.filter(
            organization=obj,
            user__deleted_at__isnull=True
        ).count()


class DepartmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Department model
    """
    
    # Nested fields
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    children_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = [
            'id', 'name', 'description', 'parent', 'parent_name',
            'organization', 'children_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'parent_name', 'children_count']
    
    def get_children_count(self, obj):
        """Get number of child departments"""
        return obj.children.filter(deleted_at__isnull=True).count()


class DirectorySerializer(serializers.ModelSerializer):
    """
    Serializer for Directory model
    """
    
    # Nested fields
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    full_path = serializers.SerializerMethodField()
    children_count = serializers.SerializerMethodField()
    documents_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Directory
        fields = [
            'id', 'name', 'description', 'parent', 'parent_name',
            'organization', 'department', 'full_path', 'children_count',
            'documents_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'parent_name', 
                           'full_path', 'children_count', 'documents_count']
    
    def get_full_path(self, obj):
        """Get full directory path"""
        return obj.get_full_path()
    
    def get_children_count(self, obj):
        """Get number of child directories"""
        return obj.children.filter(deleted_at__isnull=True).count()
    
    def get_documents_count(self, obj):
        """Get number of documents in directory"""
        return obj.documents.filter(deleted_at__isnull=True).count()


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model with versioning support."""

    directory_name = serializers.CharField(source='directory.name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source='tags'
    )
    is_archived = serializers.BooleanField(read_only=True)
    ocr_content = serializers.CharField(source='extracted_text', read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'name', 'description', 'file', 'file_size',
            'mime_type', 'status', 'version', 'is_current_version',
            'parent_document', 'prn', 'directory', 'directory_name',
            'department', 'tags', 'tag_ids', 'extracted_text', 'ocr_content',
            'ocr_confidence', 'ocr_language', 'storage_key',
            'is_archived', 'archived_at', 'archived_by',
            'created_at', 'updated_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'mime_type', 'status', 'version',
            'is_current_version', 'parent_document', 'prn',
            'directory_name', 'tags', 'ocr_content', 'is_archived',
            'created_at', 'updated_at', 'processed_at'
        ]


class DocumentDetailSerializer(DocumentSerializer):
    """Detailed serializer including all document versions."""

    versions = serializers.SerializerMethodField()

    class Meta(DocumentSerializer.Meta):
        fields = DocumentSerializer.Meta.fields + ['versions']

    def get_versions(self, obj):
        parent = obj.parent_document or obj
        versions = Document.objects.filter(
            models.Q(parent_document=parent) | models.Q(id=parent.id),
            deleted_at__isnull=True
        ).order_by('-version')
        return DocumentSerializer(versions, many=True, context=self.context).data


class ShareableLinkSerializer(serializers.ModelSerializer):
    """
    Serializer for ShareableLink model
    """

    # Computed fields
    is_expired = serializers.SerializerMethodField()
    can_access = serializers.SerializerMethodField()
    document_name = serializers.CharField(source='document.name', read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ShareableLink
        fields = [
            'id', 'token', 'document', 'document_name', 'password',
            'expires_at', 'is_expired', 'can_access',
            'max_downloads', 'download_count',
            'max_access_count', 'access_count',
            'is_active', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'token', 'document_name', 'is_expired', 'can_access',
            'access_count', 'download_count', 'created_by_name',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_is_expired(self, obj):
        """Check if link is expired"""
        return obj.is_expired()

    def get_can_access(self, obj):
        """Check if link can be accessed"""
        return obj.can_access()

    def get_created_by_name(self, obj):
        """Get creator name"""
        if obj.created_by:
            try:
                return obj.created_by.get_full_name() or obj.created_by.username
            except Exception:
                return obj.created_by.username
        return None

    def create(self, validated_data):
        """Create shareable link with hashed password if provided"""
        password = validated_data.pop('password', None)
        if password:
            from django.contrib.auth.hashers import make_password
            validated_data['password'] = make_password(password)
        if 'token' not in validated_data:
            import secrets
            validated_data['token'] = secrets.token_urlsafe(32)
        return super().create(validated_data)


class RecentDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for RecentDocument model
    """
    
    # Nested fields
    document_name = serializers.CharField(source='document.name', read_only=True)
    document_status = serializers.CharField(source='document.status', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = RecentDocument
        fields = [
            'id', 'document', 'document_name', 'document_status',
            'user', 'user_name', 'accessed_at', 'access_type'
        ]
        read_only_fields = ['id', 'document_name', 'document_status', 'user_name']
    
    def get_user_name(self, obj):
        """Get user name"""
        if obj.user:
            try:
                return obj.user.get_full_name() or obj.user.username
            except:
                return obj.user.username
        return None


class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer used for uploading documents and creating versions."""
    
    # Accept directory as UUID
    directory = serializers.PrimaryKeyRelatedField(
        queryset=Directory.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Document
        fields = [
            'name', 'description', 'file', 'directory', 'department',
            'prn', 'parent_document', 'version', 'is_current_version'
        ]
        # PRN is auto-generated in create(), so mark as read-only
        read_only_fields = ['prn', 'parent_document', 'version', 'is_current_version']

    def create(self, validated_data):
        """Create document and populate upload metadata."""
        file = validated_data.get('file')
        if not file:
            raise serializers.ValidationError({'file': 'File is required.'})
            
        validated_data.setdefault('name', file.name)
        validated_data['file_size'] = getattr(file, 'size', None)
        validated_data['mime_type'] = getattr(file, 'content_type', None)
        validated_data.setdefault('prn', str(uuid.uuid4()))
        
        # Set department from directory or current organization
        if not validated_data.get('department') and validated_data.get('directory'):
            validated_data['department'] = validated_data['directory'].department
        elif not validated_data.get('department'):
            # If no department and no directory, use organization's first department
            org = self.context.get('current_organization')
            if org:
                from .models import Department
                dept = Department.objects.filter(organization=org).first()
                if dept:
                    validated_data['department'] = dept
                    
        validated_data['created_by'] = self.context.get('current_user')
        document = super().create(validated_data)
        from .tasks import process_document_upload
        process_document_upload.delay(str(document.id))
        return document


class DocumentStatusUpdateSerializer(serializers.Serializer):
    """
    Serializer for document status updates
    """
    status = serializers.CharField()
    
    def validate_status(self, value):
        """
        Validate status transition
        """
        document = self.context['document']
        available_transitions = document.get_available_status_transitions()
        available_targets = [t.target for t in available_transitions]

        if value not in available_targets:
            raise serializers.ValidationError(
                f"Cannot transition to '{value}'. Available transitions: {available_targets}"
            )

        return value


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer for Permission model"""

    class Meta:
        model = Permission
        fields = ['id', 'user', 'group', 'directory', 'document', 'permission', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        user = attrs.get('user')
        group = attrs.get('group')
        directory = attrs.get('directory')
        document = attrs.get('document')

        if not user and not group:
            raise serializers.ValidationError('User or group must be provided.')
        if user and group:
            raise serializers.ValidationError('Provide either user or group, not both.')
        if not directory and not document:
            raise serializers.ValidationError('Directory or document must be provided.')
        if directory and document:
            raise serializers.ValidationError('Provide either directory or document, not both.')
        return attrs
