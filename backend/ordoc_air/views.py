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
from ordoc_ai.base_viewset import BaseViewSet
from .models import Organization, Department, Directory, Document, ShareableLink, RecentDocument
from .serializers import (
    OrganizationSerializer, DepartmentSerializer, DirectorySerializer,
    DocumentSerializer, DocumentDetailSerializer, ShareableLinkSerializer,
    RecentDocumentSerializer, DocumentUploadSerializer, DocumentStatusUpdateSerializer
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
            
            # Use FSM transition methods
            try:
                if new_status == 'processing' and hasattr(document, 'start_processing'):
                    document.start_processing()
                elif new_status == 'processed' and hasattr(document, 'complete_processing'):
                    document.complete_processing()
                elif new_status == 'failed' and hasattr(document, 'fail_processing'):
                    document.fail_processing()
                elif new_status == 'archived' and hasattr(document, 'archive'):
                    document.archive()
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
        
        if document.parent_document:
            # This is a version, get all versions of the parent
            versions = Document.objects.filter(
                parent_document=document.parent_document,
                deleted_at__isnull=True
            ).order_by('-version')
        else:
            # This is the main document, get its versions
            versions = Document.objects.filter(
                parent_document=document,
                deleted_at__isnull=True
            ).order_by('-version')
        
        serializer = DocumentSerializer(versions, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download document file"""
        document = self.get_object()
        
        # Record recent access
        RecentDocument.objects.create(
            document=document,
            user=request.user,
            access_type='download'
        )
        
        # Return file response (implementation depends on storage backend)
        from django.http import HttpResponse
        response = HttpResponse(document.file.read(), content_type=document.mime_type)
        response['Content-Disposition'] = f'attachment; filename="{document.name}"'
        return response


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
