"""
URLs para operações em lote e funcionalidades avançadas do OrdocAir
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .batch_views import (
    BatchOperationViewSet, OCRResultViewSet, SolrIndexViewSet, DocumentSearchViewSet
)

# Router para as APIs REST
router = DefaultRouter()
router.register(r'batch-operations', BatchOperationViewSet, basename='batch-operations')
router.register(r'ocr-results', OCRResultViewSet, basename='ocr-results')
router.register(r'solr-indexes', SolrIndexViewSet, basename='solr-indexes')
router.register(r'search', DocumentSearchViewSet, basename='document-search')

urlpatterns = [
    # APIs REST das funcionalidades avançadas
    path('api/', include(router.urls)),
    
    # URLs específicas para funcionalidades avançadas
    path('api/batch-operations/<uuid:pk>/execute/', 
         BatchOperationViewSet.as_view({'post': 'execute'}), 
         name='batch-operation-execute'),
    
    path('api/batch-operations/<uuid:pk>/cancel/', 
         BatchOperationViewSet.as_view({'post': 'cancel'}), 
         name='batch-operation-cancel'),
    
    path('api/batch-operations/<uuid:pk>/items/', 
         BatchOperationViewSet.as_view({'get': 'items'}), 
         name='batch-operation-items'),
    
    path('api/batch-operations/<uuid:pk>/progress/', 
         BatchOperationViewSet.as_view({'get': 'progress'}), 
         name='batch-operation-progress'),
    
    path('api/batch-operations/stats/', 
         BatchOperationViewSet.as_view({'get': 'stats'}), 
         name='batch-operations-stats'),
    
    path('api/batch-operations/create-and-execute/', 
         BatchOperationViewSet.as_view({'post': 'create_and_execute'}), 
         name='batch-operation-create-execute'),
    
    # URLs para OCR
    path('api/ocr/process-document/', 
         OCRResultViewSet.as_view({'post': 'process_document'}), 
         name='ocr-process-document'),
    
    path('api/ocr/batch-process/', 
         OCRResultViewSet.as_view({'post': 'batch_process'}), 
         name='ocr-batch-process'),
    
    path('api/ocr/stats/', 
         OCRResultViewSet.as_view({'get': 'stats'}), 
         name='ocr-stats'),
    
    # URLs para Solr
    path('api/solr/index-document/', 
         SolrIndexViewSet.as_view({'post': 'index_document'}), 
         name='solr-index-document'),
    
    path('api/solr/batch-index/', 
         SolrIndexViewSet.as_view({'post': 'batch_index'}), 
         name='solr-batch-index'),
    
    path('api/solr/reindex-all/', 
         SolrIndexViewSet.as_view({'post': 'reindex_all'}), 
         name='solr-reindex-all'),
    
    path('api/solr/stats/', 
         SolrIndexViewSet.as_view({'get': 'stats'}), 
         name='solr-stats'),
    
    # URLs para busca
    path('api/search/documents/', 
         DocumentSearchViewSet.as_view({'post': 'search'}), 
         name='document-search'),
    
    path('api/search/suggestions/', 
         DocumentSearchViewSet.as_view({'get': 'suggestions'}), 
         name='search-suggestions'),
]
