"""
URLs for OrdocAir - Document Management Module
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet,
    DepartmentViewSet,
    DirectoryViewSet,
    DocumentViewSet,
    ShareableLinkViewSet,
    RecentDocumentViewSet,
    PermissionViewSet,
)

# Create router for OrdocAir API endpoints
router = DefaultRouter()

# Register ViewSets
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'directories', DirectoryViewSet, basename='directory')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'shareable-links', ShareableLinkViewSet, basename='shareablelink')
router.register(r'recent-documents', RecentDocumentViewSet, basename='recentdocument')
router.register(r'permissions', PermissionViewSet, basename='permission')

app_name = 'ordoc_air'

urlpatterns = [
    path('', include(router.urls)),
    
    # Funcionalidades avançadas (Batch Operations, OCR, Solr)
    path('advanced/', include('ordoc_air.batch_urls')),
]
