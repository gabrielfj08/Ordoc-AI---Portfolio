"""
Serializers for OrdocAir module
Equivalent to Rails serializers and JSON responses
"""
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Organization,
    Department,
    Directory,
    Document,
    ShareableLink,
    RecentDocument,
    Permission,
)
from ordoc_cloud.models import OrdocUser


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
    """
    Serializer for Document model
    Equivalent to Rails DocumentSerializer
    """
    
    # Nested fields
    directory_name = serializers.CharField(source='directory.name', read_only=True)
    directory_path = serializers.CharField(source='directory.get_full_path', read_only=True)
    uploaded_by_name = serializers.SerializerMethodField()
    file_size_formatted = serializers.SerializerMethodField()
    can_transition_to = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'name', 'description', 'file', 'file_size', 'file_size_formatted',
            'file_type', 'mime_type', 'status', 'can_transition_to', 'version',
            'is_current_version', 'parent_document', 'directory', 'directory_name',
            'directory_path', 'organization', 'department', 'uploaded_by',
            'uploaded_by_name', 'ocr_content', 'thumbnail', 'tags', 'metadata',
            'created_at', 'updated_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'file_size_formatted', 'file_type', 'mime_type',
            'status', 'can_transition_to', 'version', 'is_current_version',
            'directory_name', 'directory_path', 'uploaded_by_name', 'ocr_content',
            'thumbnail', 'created_at', 'updated_at', 'processed_at'
        ]
    
    def get_uploaded_by_name(self, obj):
        """Get uploader name"""
        if obj.uploaded_by:
            try:
                ordoc_user = obj.uploaded_by.ordoc_profile
                return obj.uploaded_by.get_full_name() or obj.uploaded_by.username
            except:
                return obj.uploaded_by.username
        return None
    
    def get_file_size_formatted(self, obj):
        """Get formatted file size"""
        return obj.get_file_size_display()
    
    def get_can_transition_to(self, obj):
        """Get available status transitions"""
        return obj.get_available_status_transitions()


class DocumentDetailSerializer(DocumentSerializer):
    """
    Detailed serializer for Document model with additional fields
    Used for single document retrieval
    """
    
    # Additional fields for detail view
    versions = serializers.SerializerMethodField()
    recent_activity = serializers.SerializerMethodField()
    shareable_links = serializers.SerializerMethodField()
    
    class Meta(DocumentSerializer.Meta):
        fields = DocumentSerializer.Meta.fields + ['versions', 'recent_activity', 'shareable_links']
    
    def get_versions(self, obj):
        """Get document versions"""
        if obj.parent_document:
            # This is a version, get all versions of the parent
            versions = Document.objects.filter(
                parent_document=obj.parent_document,
                deleted_at__isnull=True
            ).order_by('-version')
        else:
            # This is the main document, get its versions
            versions = Document.objects.filter(
                parent_document=obj,
                deleted_at__isnull=True
            ).order_by('-version')
        
        return DocumentSerializer(versions, many=True, context=self.context).data
    
    def get_recent_activity(self, obj):
        """Get recent activity for this document"""
        recent_docs = RecentDocument.objects.filter(
            document=obj
        ).select_related('user').order_by('-accessed_at')[:10]
        
        return RecentDocumentSerializer(recent_docs, many=True, context=self.context).data
    
    def get_shareable_links(self, obj):
        """Get active shareable links"""
        links = obj.shareable_links.filter(
            is_active=True,
            deleted_at__isnull=True
        ).order_by('-created_at')
        
        return ShareableLinkSerializer(links, many=True, context=self.context).data


class ShareableLinkSerializer(serializers.ModelSerializer):
    """
    Serializer for ShareableLink model
    """
    
    # Computed fields
    is_expired = serializers.SerializerMethodField()
    access_count = serializers.SerializerMethodField()
    document_name = serializers.CharField(source='document.name', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ShareableLink
        fields = [
            'id', 'token', 'document', 'document_name', 'password',
            'expires_at', 'is_expired', 'max_downloads', 'download_count',
            'access_count', 'is_active', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'token', 'document_name', 'is_expired', 'access_count',
            'download_count', 'created_by_name', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_is_expired(self, obj):
        """Check if link is expired"""
        return obj.is_expired()
    
    def get_access_count(self, obj):
        """Get total access count (placeholder for future implementation)"""
        return obj.download_count  # For now, use download_count
    
    def get_created_by_name(self, obj):
        """Get creator name"""
        if obj.created_by:
            try:
                return obj.created_by.get_full_name() or obj.created_by.username
            except:
                return obj.created_by.username
        return None


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
    """
    Specialized serializer for document upload
    """
    
    class Meta:
        model = Document
        fields = [
            'name', 'description', 'file', 'directory', 'department', 'tags', 'metadata'
        ]
    
    def create(self, validated_data):
        """
        Create document with file processing
        """
        # Set organization and uploaded_by from context
        validated_data['organization'] = self.context['current_organization']
        validated_data['uploaded_by'] = self.context['current_user']
        
        # Create document
        document = super().create(validated_data)
        
        # Trigger async processing
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
        
        if value not in available_transitions:
            raise serializers.ValidationError(
                f"Cannot transition to '{value}'. Available transitions: {available_transitions}"
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
