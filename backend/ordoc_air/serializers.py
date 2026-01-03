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
    CategorizationRule,
    DocumentTemplate,
    RetentionSchedule,
    DocumentRetentionStatus,
    LegalHold,
)
from ordoc_cloud.models import OrdocUser


class CategorizationRuleSerializer(serializers.ModelSerializer):
    """Serializer for CategorizationRule"""
    
    target_tag_name = serializers.CharField(source='target_tag.name', read_only=True)
    target_directory_path = serializers.CharField(source='target_directory.get_full_path', read_only=True)
    
    class Meta:
        model = CategorizationRule
        fields = [
            'id', 'name', 'description', 'match_type', 'pattern', 'is_active',
            'target_tag', 'target_tag_name', 
            'target_directory', 'target_directory_path',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'target_tag_name', 'target_directory_path']

    def create(self, validated_data):
        """Set organization from context"""
        validated_data['organization'] = self.context['current_organization']
        return super().create(validated_data)


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    
    doc_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    last_update = serializers.DateTimeField(source='updated_at', read_only=True, format='%Y-%m-%d')

    class Meta:
        model = Tag
        fields = [
            'id', 'name', 'slug', 'color', 'description', 'organization', 
            'doc_count', 'status', 'last_update', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'organization', 'doc_count', 'status', 'last_update', 'created_at', 'updated_at']
    
    def get_doc_count(self, obj):
        """Count active documents with this tag"""
        return obj.documents.filter(deleted_at__isnull=True).count()
    
    def get_status(self, obj):
        """Return 'active' status (tags don't have archived state in current model)"""
        return 'active'


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
                           'total_documents', 'total_users', 'prn']
        extra_kwargs = {
            'subdomain': {'required': False},
            'cnpj': {'max_length': 20}  # Allow mask characters
        }
    
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

    def create(self, validated_data):
        """Auto-generate PRN and Subdomain if missing"""
        # Ensure PRN is set (frontend doesn't send it)
        if not validated_data.get('prn'):
            validated_data['prn'] = str(uuid.uuid4())
        
        # Auto-generate subdomain from corporate name if missing
        if not validated_data.get('subdomain'):
            from django.utils.text import slugify
            base_slug = slugify(validated_data.get('corporate_name', ''))[:50]
            if not base_slug:
                base_slug = "org"
            
            # Ensure unique subdomain
            slug = base_slug
            counter = 1
            while Organization.objects.filter(subdomain=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            validated_data['subdomain'] = slug
            
        return super().create(validated_data)
        
    def validate_cnpj(self, value):
        """Clean CNPJ format to ensure digits only"""
        import re
        clean_value = re.sub(r'[^0-9]', '', value)
        if len(clean_value) != 14:
            raise serializers.ValidationError("CNPJ deve ter 14 dígitos")
        return clean_value
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
    parent_name = serializers.CharField(source='parent_directory.name', read_only=True)
    full_path = serializers.SerializerMethodField()
    children_count = serializers.SerializerMethodField()
    documents_count = serializers.SerializerMethodField()
    
    # Make department optional - will be auto-filled by perform_create
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Directory
        fields = [
            'id', 'name', 'description', 'parent_directory', 'parent_name',
            'department', 'full_path', 'children_count', 'prn', 'path',
            'documents_count', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'parent_name', 
                           'full_path', 'children_count', 'documents_count', 'prn', 'path']
    
    def get_full_path(self, obj):
        """Get full directory path"""
        return obj.get_full_path()
    
    def get_children_count(self, obj):
        """Get number of child directories"""
        return obj.subdirectories.filter(deleted_at__isnull=True).count()
    
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
    
    # Intelligence fields - human-readable labels
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    criticality_display = serializers.CharField(source='get_criticality_display', read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'name', 'description', 'file', 'file_size',
            'mime_type', 'status', 'version', 'is_current_version',
            'parent_document', 'prn', 'directory', 'directory_name',
            'department', 'tags', 'tag_ids', 'extracted_text', 'ocr_content',
            'ocr_confidence', 'ocr_language', 'storage_key',
            'is_archived', 'archived_at', 'archived_by',
            # Intelligence fields
            'document_type', 'document_type_display',
            'contains_sensitive_data', 'requires_signature',
            'criticality', 'criticality_display',
            # Dynamic filter fields
            'has_deadline', 'deadline_date',
            'is_from_external_source', 'external_source_name',
            'is_public',
            'created_at', 'updated_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'mime_type', 'status', 'version',
            'is_current_version', 'parent_document', 'prn',
            'directory_name', 'tags', 'ocr_content', 'is_archived',
            'document_type_display', 'criticality_display',
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


class DocumentTemplateSerializer(serializers.ModelSerializer):
    """Serializer for DocumentTemplate model"""
    
    created_by_name = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='category', read_only=True)
    last_update = serializers.DateTimeField(source='updated_at', read_only=True, format='%Y-%m-%d')
    
    class Meta:
        model = DocumentTemplate
        fields = [
            'id', 'name', 'description', 'category', 'category_display', 'version', 
            'status', 'file', 'usage_count', 'organization', 'tags', 
            'created_by', 'created_by_name', 'last_update', 
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'usage_count', 'organization', 'created_by', 'created_by_name', 
            'last_update', 'created_at', 'updated_at', 'category_display'
        ]
    
    def get_created_by_name(self, obj):
        """Get creator name"""
        if obj.created_by:
            try:
                return obj.created_by.get_full_name() or obj.created_by.username
            except Exception:
                return obj.created_by.username
        return 'Sistema'
    
    def update(self, instance, validated_data):
        """Set updated_by from context"""
        validated_data['updated_by'] = self.context.get('current_user')
        return super().update(instance, validated_data)


# ============================================
# COMPLIANCE SERIALIZERS (e-ARQ + Legal Hold)
# ============================================

class RetentionScheduleSerializer(serializers.ModelSerializer):
    """Serializer para Tabela de Temporalidade"""

    organization_name = serializers.CharField(source='organization.corporate_name', read_only=True)
    document_type_name = serializers.CharField(source='document_type.name', read_only=True)
    total_retention_years = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = RetentionSchedule
        fields = [
            'id', 'code', 'activity', 'description',
            'current_phase_years', 'intermediate_phase_years',
            'final_disposition', 'legal_basis', 'is_active',
            'organization', 'organization_name',
            'document_type', 'document_type_name',
            'total_retention_years', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organization', 'created_at', 'updated_at']

    def get_total_retention_years(self, obj):
        return obj.get_total_retention_years()

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return 'Sistema'


class DocumentRetentionStatusSerializer(serializers.ModelSerializer):
    """Serializer para Status de Retenção de Documentos"""

    document_title = serializers.CharField(source='document.title', read_only=True)
    retention_schedule_code = serializers.CharField(source='retention_schedule.code', read_only=True)
    is_eligible = serializers.SerializerMethodField()

    class Meta:
        model = DocumentRetentionStatus
        fields = [
            'id', 'document', 'document_title',
            'retention_schedule', 'retention_schedule_code',
            'current_phase_start', 'current_phase_end',
            'intermediate_phase_start', 'intermediate_phase_end',
            'disposition_date', 'disposition_approved_by',
            'notes', 'is_eligible',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_is_eligible(self, obj):
        return obj.is_eligible_for_disposition()


class LegalHoldSerializer(serializers.ModelSerializer):
    """Serializer para Legal Hold"""

    organization_name = serializers.CharField(source='organization.corporate_name', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    released_by_name = serializers.SerializerMethodField()
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = LegalHold
        fields = [
            'id', 'case_number', 'title', 'description',
            'status', 'effective_date', 'release_date',
            'issuing_authority', 'legal_basis',
            'organization', 'organization_name',
            'documents', 'document_count',
            'custodians_notified',
            'created_by', 'created_by_name',
            'released_by', 'released_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organization', 'created_at', 'updated_at']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return 'Sistema'

    def get_released_by_name(self, obj):
        if obj.released_by:
            return obj.released_by.get_full_name() or obj.released_by.username
        return None

    def get_document_count(self, obj):
        return obj.documents.count()


class LegalHoldReleaseSerializer(serializers.Serializer):
    """Serializer para liberação de Legal Hold"""

    reason = serializers.CharField(required=False, allow_blank=True)
