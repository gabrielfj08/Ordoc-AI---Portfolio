"""
ViewSets for OrdocAir module
Equivalent to Rails controllers with authentication and organization context
"""
from rest_framework import status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.http import Http404
from guardian.shortcuts import assign_perm, remove_perm
from ordoc_ai.base_viewset import BaseViewSet
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
)
from .serializers import (
    OrganizationSerializer,
    DepartmentSerializer,
    DirectorySerializer,
    DocumentSerializer,
    DocumentDetailSerializer,
    ShareableLinkSerializer,
    RecentDocumentSerializer,
    DocumentUploadSerializer,
    DocumentStatusUpdateSerializer,
    PermissionSerializer,
    TagSerializer,
    ActivityLogSerializer,
    CategorizationRuleSerializer,
)
from .filters import DocumentFilter, DirectoryFilter
import uuid


class OrganizationViewSet(BaseViewSet):
    """
    ViewSet for Organization management
    Equivalent to Rails OrganizationsController
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    filterset_fields = ['is_active', 'corporate_name', 'cnpj']
    search_fields = ['corporate_name', 'cnpj', 'email', 'contact_name']
    ordering_fields = ['corporate_name', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Override to show only current organization or all if admin
        """
        queryset = super().get_queryset()
        
        # Get current user
        current_user = self.get_current_ordoc_user()
        
        # If user is admin or superuser, show all organizations
        if (current_user and current_user.roles.filter(role='admin').exists()) or \
           (hasattr(self.request, 'user') and self.request.user.is_superuser):
            return queryset
        
        # Otherwise, show only current organization
        current_org = self.get_current_organization()
        if current_org:
            return queryset.filter(id=current_org.id)
        
        # If no organization context and not admin, return empty queryset
        return queryset.none()
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate organization"""
        organization = self.get_object()
        organization.is_active = True
        organization.save()
        return Response({'message': 'Organization activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate organization"""
        organization = self.get_object()
        organization.is_active = False
        organization.save()
        return Response({'message': 'Organization deactivated successfully'})


class DepartmentViewSet(BaseViewSet):
    """
    ViewSet for Department management
    Equivalent to Rails DepartmentsController
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    filterset_fields = ['parent']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        """Get department children"""
        department = self.get_object()
        children = department.children.filter(deleted_at__isnull=True)
        serializer = self.get_serializer(children, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get department tree structure"""
        organization = self.get_current_organization()
        if not organization:
            return Response({'error': 'Organization not found'}, status=404)
        
        # Get root departments (no parent)
        root_departments = Department.objects.filter(
            organization=organization,
            parent__isnull=True,
            deleted_at__isnull=True
        )
        
        def build_tree(departments):
            result = []
            for dept in departments:
                dept_data = self.get_serializer(dept).data
                children = dept.children.filter(deleted_at__isnull=True)
                if children.exists():
                    dept_data['children'] = build_tree(children)
                result.append(dept_data)
            return result
        
        tree_data = build_tree(root_departments)
        return Response(tree_data)


class DirectoryViewSet(BaseViewSet):
    """
    ViewSet for Directory management
    Equivalent to Rails DirectoriesController
    """
    queryset = Directory.objects.all()
    serializer_class = DirectorySerializer
    filterset_class = DirectoryFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def perform_create(self, serializer):
        """Override to set automatic fields on directory creation"""
        from django.utils.text import slugify
        import uuid
        
        # Get department (required)
        department = serializer.validated_data.get('department')
        if not department:
            # Try to get first department from current organization
            organization = self.get_current_organization()
            department = organization.departments.first()
            if not department:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({"department": "No department available"})
        
        # Auto-generate path if not provided
        path = serializer.validated_data.get('path')
        if not path:
            name = serializer.validated_data.get('name', 'unnamed')
            parent = serializer.validated_data.get('parent_directory')
            if parent:
                path = f"{parent.path}/{slugify(name)}"
            else:
                path = f"/{slugify(name)}"
        
        # Auto-generate PRN if not provided
        prn = serializer.validated_data.get('prn')
        if not prn:
            prn = f"dir:{department.prn}:{uuid.uuid4().hex[:12]}"
        
        # Save with auto-filled fields
        serializer.save(
            department=department,
            path=path,
            prn=prn,
            created_by=self.request.user,
            updated_by=self.request.user
        )
    
    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        """Get directory children"""
        directory = self.get_object()
        children = directory.children.filter(deleted_at__isnull=True)
        serializer = self.get_serializer(children, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """Get documents in directory"""
        directory = self.get_object()
        documents = directory.documents.filter(deleted_at__isnull=True)
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            documents = documents.filter(status=status_filter)
        
        # Paginate
        page = self.paginate_queryset(documents)
        if page is not None:
            serializer = DocumentSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = DocumentSerializer(documents, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get directory tree structure"""
        organization = self.get_current_organization()
        department_id = request.query_params.get('department')
        
        queryset = Directory.objects.filter(organization=organization, deleted_at__isnull=True)
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        # Get root directories (no parent)
        root_directories = queryset.filter(parent__isnull=True)
        
        def build_tree(directories):
            result = []
            for directory in directories:
                dir_data = self.get_serializer(directory).data
                children = directory.children.filter(deleted_at__isnull=True)
                if children.exists():
                    dir_data['children'] = build_tree(children)
                result.append(dir_data)
            return result
        
        tree_data = build_tree(root_directories)
        return Response(tree_data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get directory statistics and insights"""
        from django.db.models import Sum
        from django.utils import timezone
        
        directory = self.get_object()
        
        # Buscar documentos da pasta
        documents = directory.documents.filter(deleted_at__isnull=True)
        
        # Estatísticas básicas
        total_documents = documents.count()
        total_size = documents.aggregate(total=Sum('file_size'))['total'] or 0
        
        # Análise de categorização
        uncategorized = documents.filter(tags__isnull=True).count()
        
        # Análise de idade
        now = timezone.now()
        old_docs = documents.filter(
            created_at__lt=now - timezone.timedelta(days=365)
        ).count()
        
        recent_docs = documents.filter(
            created_at__gte=now - timezone.timedelta(days=7)
        ).count()
        
        # Status dos documentos
        status_breakdown = {}
        for status_choice in Document.STATUS_CHOICES:
            status_code = status_choice[0]
            count = documents.filter(status=status_code).count()
            if count > 0:
                status_breakdown[status_code] = count
        
        # IA analisa saúde da pasta
        health_status = 'healthy'
        insights = []
        pending_actions = 0
        
        if uncategorized > 0:
            insights.append({
                'type': 'warning',
                'message': f'{uncategorized} documento{"s" if uncategorized > 1 else ""} sem tags',
                'count': uncategorized,
                'action': 'categorize'
            })
            health_status = 'needs_attention'
            pending_actions += uncategorized
        
        if old_docs > 5:
            insights.append({
                'type': 'info',
                'message': f'{old_docs} documentos com mais de 1 ano',
                'count': old_docs,
                'action': 'review'
            })
        
        if total_documents == 0:
            insights.append({
                'type': 'info',
                'message': 'Pasta vazia',
            })
        elif total_documents > 100:
            insights.append({
                'type': 'warning',
                'message': 'Pasta com muitos documentos - considere organizar em subpastas',
                'count': total_documents,
                'action': 'organize'
            })
            health_status = 'needs_attention'
        
        if pending_actions > 20:
            health_status = 'critical'
        
        if not insights:
            insights.append({
                'type': 'success',
                'message': 'Pasta organizada',
            })
        
        return Response({
            'id': directory.id,
            'name': directory.name,
            'total_documents': total_documents,
            'total_size': total_size,
            'uncategorized': uncategorized,
            'old_documents': old_docs,
            'recent_documents': recent_docs,
            'status_breakdown': status_breakdown,
            'health_status': health_status,
            'insights': insights,
            'pending_actions': pending_actions,
        })


class DocumentViewSet(BaseViewSet):
    """
    ViewSet for Document management
    Equivalent to Rails DocumentsController
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filterset_class = DocumentFilter
    search_fields = ['name', 'description', 'ocr_content', 'tags']
    ordering_fields = ['name', 'created_at', 'updated_at', 'file_size']
    ordering = ['-created_at']
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return DocumentDetailSerializer
        elif self.action == 'create':
            return DocumentUploadSerializer
        elif self.action == 'update_status':
            return DocumentStatusUpdateSerializer
        return DocumentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'current_user': self.get_current_user(),
            'current_organization': self.get_current_organization(),
        })
        return context
    
    def get_queryset(self):
        """Override to filter current versions by default"""
        queryset = super().get_queryset()
        
        # By default, show only current versions
        show_all_versions = self.request.query_params.get('all_versions', 'false').lower() == 'true'
        if not show_all_versions:
            queryset = queryset.filter(is_current_version=True)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update document status using FSM transitions"""
        document = self.get_object()
        serializer = DocumentStatusUpdateSerializer(
            data=request.data,
            context={'document': document}
        )
        
        if serializer.is_valid():
            new_status = serializer.validated_data['status']
            current_user = self.get_current_user()

            try:
                if new_status == 'enqueued':
                    if not getattr(document, 'can_enqueue', lambda: False)():
                        return Response(
                            {'error': f'Invalid status transition to {new_status}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    document.enqueue(user=current_user)
                elif new_status == 'processed':
                    if not getattr(document, 'can_process', lambda: False)():
                        return Response(
                            {'error': f'Invalid status transition to {new_status}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    document.process(user=current_user)
                elif new_status == 'failed':
                    if not getattr(document, 'can_fail', lambda: False)():
                        return Response(
                            {'error': f'Invalid status transition to {new_status}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    document.fail(user=current_user)
                else:
                    return Response(
                        {'error': f'Invalid status transition to {new_status}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                document.save()
                return Response({
                    'message': f'Document status updated to {new_status}',
                    'status': document.status
                })

            except Exception as e:
                return Response(
                    {'error': f'Status transition failed: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def create_version(self, request, pk=None):
        """Create new version of document"""
        parent_document = self.get_object()
        
        # Use upload serializer for new version
        serializer = DocumentUploadSerializer(data=request.data, context=self.get_serializer_context())
        
        if serializer.is_valid():
            # Create new version
            new_document = serializer.save(
                parent_document=parent_document,
                directory=parent_document.directory,
                department=parent_document.department,
                version=parent_document.get_next_version_number()
            )
            
            # Mark parent as not current version
            parent_document.is_current_version = False
            parent_document.save()
            
            return Response(
                DocumentSerializer(new_document, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def versions(self, request, pk=None):
        """Get all versions of document"""
        document = self.get_object()
        parent = document.parent_document or document
        versions = Document.objects.filter(
            Q(parent_document=parent) | Q(id=parent.id),
            deleted_at__isnull=True
        ).order_by('-version')
        serializer = DocumentSerializer(versions, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download document file"""
        document = self.get_object()

        # Record recent access
        RecentDocument.objects.update_or_create(
            document=document,
            user=request.user,
            defaults={'access_type': 'download'}
        )

        # Log activity
        org = self.get_current_organization()
        if org:
            ActivityLog.log(
                action='download',
                entity_type='document',
                entity_id=document.id,
                entity_name=document.name,
                user=request.user,
                organization=org,
            )

        # Return file response (implementation depends on storage backend)
        from django.http import HttpResponse
        response = HttpResponse(document.file.read(), content_type=document.mime_type)
        response['Content-Disposition'] = f'attachment; filename="{document.name}"'
        return response

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive document"""
        document = self.get_object()
        document.archive(user=request.user)

        # Log activity
        org = self.get_current_organization()
        if org:
            ActivityLog.log(
                action='archive',
                entity_type='document',
                entity_id=document.id,
                entity_name=document.name,
                user=request.user,
                organization=org,
            )

        return Response({
            'message': 'Document archived successfully',
            'archived_at': document.archived_at
        })

    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        """Unarchive document"""
        document = self.get_object()
        document.unarchive()

        # Log activity
        org = self.get_current_organization()
        if org:
            ActivityLog.log(
                action='restore',
                entity_type='document',
                entity_id=document.id,
                entity_name=document.name,
                user=request.user,
                organization=org,
            )

        return Response({'message': 'Document unarchived successfully'})

    @action(detail=True, methods=['post'])
    def add_tags(self, request, pk=None):
        """Add tags to document"""
        document = self.get_object()
        tag_ids = request.data.get('tag_ids', [])

        if not tag_ids:
            return Response({'error': 'tag_ids is required'}, status=status.HTTP_400_BAD_REQUEST)

        tags = Tag.objects.filter(id__in=tag_ids)
        document.tags.add(*tags)

        return Response({
            'message': 'Tags added successfully',
            'tags': TagSerializer(document.tags.all(), many=True).data
        })

    @action(detail=True, methods=['post'])
    def remove_tags(self, request, pk=None):
        """Remove tags from document"""
        document = self.get_object()
        tag_ids = request.data.get('tag_ids', [])

        if not tag_ids:
            return Response({'error': 'tag_ids is required'}, status=status.HTTP_400_BAD_REQUEST)

        tags = Tag.objects.filter(id__in=tag_ids)
        document.tags.remove(*tags)

        return Response({
            'message': 'Tags removed successfully',
            'tags': TagSerializer(document.tags.all(), many=True).data
        })

    @action(detail=False, methods=['get'])
    def archived(self, request):
        """List archived documents"""
        queryset = self.get_queryset().filter(archived_at__isnull=False)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Full-text search in documents"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(extracted_text__icontains=query)
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TagViewSet(BaseViewSet):
    """ViewSet for Tag management"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filterset_fields = ['organization']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter by current organization"""
        queryset = super().get_queryset()
        org = self.get_current_organization()
        if org:
            return queryset.filter(organization=org)
        return queryset.none()

    def perform_create(self, serializer):
        """Set organization on creation"""
        org = self.get_current_organization()
        serializer.save(organization=org)

    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """Get documents with this tag"""
        tag = self.get_object()
        documents = tag.documents.filter(deleted_at__isnull=True)
        page = self.paginate_queryset(documents)
        if page is not None:
            serializer = DocumentSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = DocumentSerializer(documents, many=True, context={'request': request})
        return Response(serializer.data)


class ActivityLogViewSet(BaseViewSet):
    """ViewSet for ActivityLog (read-only)"""
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    filterset_fields = ['action', 'entity_type', 'user']
    search_fields = ['entity_name', 'description']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    http_method_names = ['get', 'head', 'options']  # Read-only

    def get_queryset(self):
        """Filter by current organization"""
        queryset = super().get_queryset()
        org = self.get_current_organization()
        if org:
            return queryset.filter(organization=org)
        return queryset.none()

    @action(detail=False, methods=['get'])
    def by_entity(self, request):
        """Get activity logs for a specific entity"""
        entity_type = request.query_params.get('entity_type')
        entity_id = request.query_params.get('entity_id')

        if not entity_type or not entity_id:
            return Response(
                {'error': 'entity_type and entity_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(
            entity_type=entity_type,
            entity_id=entity_id
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get activity logs for a specific user"""
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset().filter(user_id=user_id)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ShareableLinkViewSet(BaseViewSet):
    """
    ViewSet for ShareableLink management
    Equivalent to Rails ShareableLinksController
    """
    queryset = ShareableLink.objects.all()
    serializer_class = ShareableLinkSerializer
    filterset_fields = ['document', 'is_active']
    search_fields = ['document__name']
    ordering_fields = ['created_at', 'expires_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        """Set created_by on creation"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate shareable link"""
        link = self.get_object()
        link.is_active = True
        link.save()
        return Response({'message': 'Link activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate shareable link"""
        link = self.get_object()
        link.is_active = False
        link.save()
        return Response({'message': 'Link deactivated successfully'})
    
    @action(detail=False, methods=['get'])
    def by_token(self, request):
        """Get shareable link by token (public endpoint)"""
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=400)
        
        try:
            link = ShareableLink.objects.get(
                token=token,
                is_active=True,
                deleted_at__isnull=True
            )
            
            if link.is_expired():
                return Response({'error': 'Link has expired'}, status=410)
            
            serializer = self.get_serializer(link)
            return Response(serializer.data)
            
        except ShareableLink.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=404)
    
    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        """Get documents shared with the current user"""
        # For now, return empty list - this feature needs proper implementation
        # with a SharedDocument model or similar to track who documents are shared with
        return Response({'results': [], 'count': 0})


class RecentDocumentViewSet(BaseViewSet):
    """
    ViewSet for RecentDocument tracking
    Equivalent to Rails RecentDocumentsController
    """
    queryset = RecentDocument.objects.all()
    serializer_class = RecentDocumentSerializer
    filterset_fields = ['access_type']
    ordering_fields = ['accessed_at']
    ordering = ['-accessed_at']
    
    def get_queryset(self):
        """Filter by current user"""
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Set user on creation"""
        serializer.save(user=self.request.user)


class PermissionViewSet(BaseViewSet):
    """ViewSet for managing permissions"""

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

    def perform_create(self, serializer):
        permission = serializer.save()
        target = permission.directory or permission.document
        user_or_group = permission.user or permission.group
        assign_perm(permission.permission, user_or_group, target)

    def perform_destroy(self, instance):
        target = instance.directory or instance.document
        user_or_group = instance.user or instance.group
        remove_perm(instance.permission, user_or_group, target)
        instance.delete()


class CategorizationRuleViewSet(BaseViewSet):
    """ViewSet for CategorizationRule management"""
    queryset = CategorizationRule.objects.all()
    serializer_class = CategorizationRuleSerializer
    filterset_fields = ['is_active', 'match_type']
    search_fields = ['name', 'description', 'pattern']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter by current organization"""
        queryset = super().get_queryset()
        org = self.get_current_organization()
        if org:
            return queryset.filter(organization=org)
        return queryset.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['current_organization'] = self.get_current_organization()
        return context

    @action(detail=False, methods=['post'])
    def test_rule(self, request):
        """Test a rule against a sample text"""
        pattern = request.data.get('pattern')
        match_type = request.data.get('match_type', 'contains')
        text = request.data.get('text', '')
        
        if not pattern or not text:
            return Response({'error': 'Pattern and text are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        matched = False
        import re
        
        try:
            if match_type == 'exact':
                matched = pattern.lower() == text.lower()
            elif match_type == 'contains':
                matched = pattern.lower() in text.lower()
            elif match_type == 'regex':
                matched = bool(re.search(pattern, text, re.IGNORECASE))
        except re.error as e:
            return Response({'error': f'Invalid regex: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({'matched': matched})


class TagViewSet(BaseViewSet):
    """ViewSet for Tag management with AI suggestions"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        """Filter by current organization"""
        queryset = super().get_queryset()
        org = self.get_current_organization()
        if org:
            return queryset.filter(organization=org)
        return queryset.none()
    
    def perform_create(self, serializer):
        """Set organization on creation"""
        serializer.save(organization=self.get_current_organization())
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """IA sugere categorias baseado em padrões de documentos não categorizados"""
        import re
        org = self.get_current_organization()
        
        if not org:
            return Response({'error': 'Organization not found'}, status=404)
        
        # Buscar documentos sem tags
        uncategorized_docs = Document.objects.filter(
            department__organization=org,
            tags__isnull=True,
            deleted_at__isnull=True
        ).values_list('name', flat=True)
        
        suggestions = []
        
        # Detectar padrão: Protocolos (PROT-YYYY-XXX)
        protocol_pattern = r'PROT-\d{4}-\d+'
        protocol_docs = [doc for doc in uncategorized_docs if re.match(protocol_pattern, doc)]
        if len(protocol_docs) >= 5:
            suggestions.append({
                'id': f'suggested_protocol_{uuid.uuid4()}',
                'name': 'Protocolos 2024',
                'description': 'Agrupamento automático de protocolos detectados',
                'doc_count': len(protocol_docs),
                'status': 'active',
                'last_update': None,
                'is_ai_suggested': True,
                'confidence': 0.92,
                'suggestion_reason': f'Detectados {len(protocol_docs)} arquivos com padrão PROT-2024-XXX dispersos.',
                'tags': ['protocolos', 'automático']
            })
        
        # Detectar padrão: Contratos (CNPJ no nome)
        cnpj_pattern = r'\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}'
        contract_docs = [doc for doc in uncategorized_docs if re.search(cnpj_pattern, doc) or 'contrato' in doc.lower()]
        if len(contract_docs) >= 3:
            suggestions.append({
                'id': f'suggested_contracts_{uuid.uuid4()}',
                'name': 'Fornecedores Externos',
                'description': 'Contratos de terceiros identificados recentemente',
                'doc_count': len(contract_docs),
                'status': 'active',
                'last_update': None,
                'is_ai_suggested': True,
                'confidence': 0.85,
                'suggestion_reason': f'Múltiplos contratos de CNPJs externos sem classificação.',
                'tags': ['fornecedores', 'contratos']
            })
        
        return Response(suggestions)
