"""
ViewSets para operações em lote e funcionalidades avançadas do OrdocAir
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Avg, Q, F
from django.db import transaction, models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from rest_framework import viewsets
from ordoc_cloud.models import OrdocUser
from .batch_models import BatchOperation, BatchOperationItem, OCRResult, SolrIndex
from .batch_serializers import (
    BatchOperationSerializer, BatchOperationItemSerializer, OCRResultSerializer,
    SolrIndexSerializer, BatchOperationCreateSerializer, DocumentSearchSerializer,
    DocumentSearchResultSerializer, BatchOperationStatsSerializer, OCRStatsSerializer,
    SolrStatsSerializer
)
from .batch_services import BatchOperationService, OCRService, SolrService
from .batch_tasks import (
    execute_batch_operation, process_document_ocr, index_document_solr,
    batch_process_ocr, batch_index_solr
)
from .models import Document


class BaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet base com funcionalidades comuns para multi-tenant
    """
    
    def get_current_user(self):
        """Obtém o usuário atual"""
        return getattr(self.request, 'ordoc_user', None)
    
    def get_current_organization(self):
        """Obtém a organização atual"""
        user = self.get_current_user()
        return getattr(user, 'current_organization', None) if user else None


class BatchOperationViewSet(BaseViewSet):
    """
    ViewSet para operações em lote
    """
    queryset = BatchOperation.objects.all()
    serializer_class = BatchOperationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'operation_type', 'created_by']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'started_at', 'completed_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filtrar por organização atual
        """
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        
        if organization:
            queryset = queryset.filter(organization=organization)
        
        return queryset
    
    def perform_create(self, serializer):
        """
        Criar operação em lote
        """
        serializer.save(
            created_by=self.get_current_user(),
            organization=self.get_current_organization()
        )
    
    @action(detail=False, methods=['post'])
    def create_and_execute(self, request):
        """
        Criar e executar operação em lote
        """
        serializer = BatchOperationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            # Criar operação
            batch_operation = BatchOperation.objects.create(
                name=serializer.validated_data['name'],
                description=serializer.validated_data.get('description', ''),
                operation_type=serializer.validated_data['operation_type'],
                parameters=serializer.validated_data['parameters'],
                filters=serializer.validated_data['filters'],
                created_by=self.get_current_user(),
                organization=self.get_current_organization()
            )
            
            # Executar imediatamente se solicitado
            if serializer.validated_data.get('execute_immediately', False):
                execute_batch_operation.delay(str(batch_operation.id))
        
        return Response(
            BatchOperationSerializer(batch_operation).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """
        Executar operação em lote
        """
        batch_operation = self.get_object()
        
        if batch_operation.status != 'pending':
            return Response(
                {'error': 'Operação só pode ser executada se estiver pendente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Executar de forma assíncrona
        task = execute_batch_operation.delay(str(batch_operation.id))
        
        return Response({
            'message': 'Operação iniciada',
            'task_id': task.id,
            'batch_operation_id': str(batch_operation.id)
        })
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancelar operação em lote
        """
        batch_operation = self.get_object()
        
        if batch_operation.status not in ['pending', 'running']:
            return Response(
                {'error': 'Operação não pode ser cancelada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        batch_operation.cancel()
        
        return Response({
            'message': 'Operação cancelada',
            'status': batch_operation.status
        })
    
    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        """
        Listar itens da operação em lote
        """
        batch_operation = self.get_object()
        items = batch_operation.items.all()
        
        # Filtros opcionais
        status_filter = request.query_params.get('status')
        if status_filter:
            items = items.filter(status=status_filter)
        
        # Paginação
        page = self.paginate_queryset(items)
        if page is not None:
            serializer = BatchOperationItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BatchOperationItemSerializer(items, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        """
        Obter progresso detalhado da operação
        """
        batch_operation = self.get_object()
        
        # Estatísticas dos itens
        items_stats = batch_operation.items.aggregate(
            total=Count('id'),
            pending=Count('id', filter=Q(status='pending')),
            processing=Count('id', filter=Q(status='processing')),
            completed=Count('id', filter=Q(status='completed')),
            failed=Count('id', filter=Q(status='failed')),
            avg_processing_time=Avg('processing_time')
        )
        
        # Calcular progresso
        total_items = items_stats['total'] or 0
        processed_items = (items_stats['completed'] or 0) + (items_stats['failed'] or 0)
        progress_percentage = (processed_items / total_items * 100) if total_items > 0 else 0
        
        # Estimativa de conclusão
        estimated_completion = None
        if batch_operation.status == 'running' and processed_items > 0:
            elapsed_time = timezone.now() - batch_operation.started_at
            remaining_items = total_items - processed_items
            if remaining_items > 0:
                avg_time_per_item = elapsed_time / processed_items
                estimated_remaining = avg_time_per_item * remaining_items
                estimated_completion = (timezone.now() + estimated_remaining).isoformat()
        
        return Response({
            'batch_operation_id': str(batch_operation.id),
            'status': batch_operation.status,
            'progress_percentage': round(progress_percentage, 2),
            'estimated_completion': estimated_completion,
            'items_stats': items_stats,
            'error_message': batch_operation.error_message
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Estatísticas gerais de operações em lote
        """
        organization = self.get_current_organization()
        queryset = self.get_queryset()
        
        # Estatísticas básicas
        stats = queryset.aggregate(
            total_operations=Count('id'),
            pending_operations=Count('id', filter=Q(status='pending')),
            running_operations=Count('id', filter=Q(status='running')),
            completed_operations=Count('id', filter=Q(status='completed')),
            failed_operations=Count('id', filter=Q(status='failed')),
            total_documents_processed=Count('items__id', filter=Q(items__status='completed')),
            avg_processing_time=Avg('total_time')
        )
        
        # Calcular taxa de sucesso
        total_ops = stats['total_operations'] or 0
        completed_ops = stats['completed_operations'] or 0
        success_rate = (completed_ops / total_ops * 100) if total_ops > 0 else 0
        
        stats['success_rate'] = round(success_rate, 2)
        stats['average_processing_time'] = stats['avg_processing_time'].total_seconds() if stats['avg_processing_time'] else 0
        
        serializer = BatchOperationStatsSerializer(stats)
        return Response(serializer.data)


class OCRResultViewSet(BaseViewSet):
    """
    ViewSet para resultados de OCR
    """
    queryset = OCRResult.objects.all()
    serializer_class = OCRResultSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'engine', 'language']
    search_fields = ['document__name', 'extracted_text']
    ordering_fields = ['created_at', 'processed_at', 'confidence_score']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filtrar por organização atual
        """
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        
        if organization:
            queryset = queryset.filter(
                document__directory__department__organization=organization
            )
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def process_document(self, request):
        """
        Processar OCR de um documento específico
        """
        document_id = request.data.get('document_id')
        if not document_id:
            return Response(
                {'error': 'document_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            document = Document.objects.get(id=document_id)
            
            # Verificar se o documento pertence à organização atual
            if document.directory.department.organization != self.get_current_organization():
                return Response(
                    {'error': 'Documento não encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Iniciar processamento OCR
            task = process_document_ocr.delay(document_id)
            
            return Response({
                'message': 'Processamento OCR iniciado',
                'task_id': task.id,
                'document_id': document_id
            })
            
        except Document.DoesNotExist:
            return Response(
                {'error': 'Documento não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def batch_process(self, request):
        """
        Processar OCR em lote para múltiplos documentos
        """
        document_ids = request.data.get('document_ids', [])
        if not document_ids:
            return Response(
                {'error': 'document_ids é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar se todos os documentos existem e pertencem à organização
        organization = self.get_current_organization()
        valid_documents = Document.objects.filter(
            id__in=document_ids,
            directory__department__organization=organization
        ).values_list('id', flat=True)
        
        valid_document_ids = [str(doc_id) for doc_id in valid_documents]
        
        if not valid_document_ids:
            return Response(
                {'error': 'Nenhum documento válido encontrado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Iniciar processamento em lote
        task = batch_process_ocr.delay(valid_document_ids)
        
        return Response({
            'message': 'Processamento OCR em lote iniciado',
            'task_id': task.id,
            'total_documents': len(valid_document_ids),
            'valid_documents': valid_document_ids
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Estatísticas de OCR
        """
        queryset = self.get_queryset()
        
        # Estatísticas básicas
        stats = queryset.aggregate(
            total_documents=Count('id'),
            processed_documents=Count('id', filter=Q(status='completed')),
            pending_documents=Count('id', filter=Q(status='pending')),
            failed_documents=Count('id', filter=Q(status='failed')),
            avg_confidence=Avg('confidence_score', filter=Q(status='completed')),
            avg_processing_time=Avg('processing_time', filter=Q(status='completed'))
        )
        
        # Idiomas detectados
        languages = queryset.filter(
            status='completed',
            language__isnull=False
        ).values('language').annotate(
            count=Count('id')
        ).order_by('-count')
        
        languages_detected = {lang['language']: lang['count'] for lang in languages}
        
        stats['languages_detected'] = languages_detected
        stats['average_confidence'] = stats['avg_confidence'] or 0
        stats['average_processing_time'] = stats['avg_processing_time'].total_seconds() if stats['avg_processing_time'] else 0
        
        serializer = OCRStatsSerializer(stats)
        return Response(serializer.data)


class SolrIndexViewSet(BaseViewSet):
    """
    ViewSet para índices Solr
    """
    queryset = SolrIndex.objects.all()
    serializer_class = SolrIndexSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['document__name', 'solr_id']
    ordering_fields = ['created_at', 'indexed_at', 'last_sync_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filtrar por organização atual
        """
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        
        if organization:
            queryset = queryset.filter(
                document__directory__department__organization=organization
            )
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def index_document(self, request):
        """
        Indexar um documento específico no Solr
        """
        document_id = request.data.get('document_id')
        if not document_id:
            return Response(
                {'error': 'document_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            document = Document.objects.get(id=document_id)
            
            # Verificar se o documento pertence à organização atual
            if document.directory.department.organization != self.get_current_organization():
                return Response(
                    {'error': 'Documento não encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Iniciar indexação
            task = index_document_solr.delay(document_id)
            
            return Response({
                'message': 'Indexação Solr iniciada',
                'task_id': task.id,
                'document_id': document_id
            })
            
        except Document.DoesNotExist:
            return Response(
                {'error': 'Documento não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def batch_index(self, request):
        """
        Indexar múltiplos documentos no Solr
        """
        document_ids = request.data.get('document_ids', [])
        if not document_ids:
            return Response(
                {'error': 'document_ids é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar se todos os documentos existem e pertencem à organização
        organization = self.get_current_organization()
        valid_documents = Document.objects.filter(
            id__in=document_ids,
            directory__department__organization=organization
        ).values_list('id', flat=True)
        
        valid_document_ids = [str(doc_id) for doc_id in valid_documents]
        
        if not valid_document_ids:
            return Response(
                {'error': 'Nenhum documento válido encontrado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Iniciar indexação em lote
        task = batch_index_solr.delay(valid_document_ids)
        
        return Response({
            'message': 'Indexação Solr em lote iniciada',
            'task_id': task.id,
            'total_documents': len(valid_document_ids),
            'valid_documents': valid_document_ids
        })
    
    @action(detail=False, methods=['post'])
    def reindex_all(self, request):
        """
        Reindexar todos os documentos da organização
        """
        organization = self.get_current_organization()
        
        try:
            solr_service = SolrService()
            solr_service.reindex_all_documents(str(organization.id))
            
            return Response({
                'message': 'Reindexação completa iniciada',
                'organization_id': str(organization.id)
            })
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao iniciar reindexação: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Estatísticas de indexação Solr
        """
        queryset = self.get_queryset()
        
        # Estatísticas básicas
        stats = queryset.aggregate(
            total_documents=Count('id'),
            indexed_documents=Count('id', filter=Q(status='indexed')),
            pending_documents=Count('id', filter=Q(status='pending')),
            failed_documents=Count('id', filter=Q(status='failed'))
        )
        
        # Documentos desatualizados (documento foi modificado após a última sincronização)
        outdated_count = queryset.filter(
            status='indexed',
            document__updated_at__gt=models.F('last_sync_at')
        ).count()
        
        stats['outdated_documents'] = outdated_count
        stats['average_indexing_time'] = 0  # Pode ser implementado se necessário
        
        # Última sincronização
        last_sync = queryset.filter(
            status='indexed'
        ).aggregate(
            last_sync=models.Max('last_sync_at')
        )['last_sync']
        
        stats['last_sync_at'] = last_sync
        
        serializer = SolrStatsSerializer(stats)
        return Response(serializer.data)


class DocumentSearchViewSet(viewsets.GenericViewSet):
    """
    ViewSet para busca de documentos no Solr
    """
    permission_classes = [IsAuthenticated]
    
    def get_current_user(self):
        """Obtém o usuário atual"""
        return getattr(self.request, 'ordoc_user', None)
    
    def get_current_organization(self):
        """Obtém a organização atual"""
        user = self.get_current_user()
        return getattr(user, 'current_organization', None) if user else None
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Buscar documentos no Solr
        """
        serializer = DocumentSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            solr_service = SolrService()
            
            # Adicionar filtro de organização
            filters = serializer.validated_data.get('filters', {})
            organization = self.get_current_organization()
            if organization:
                filters['organization_id'] = str(organization.id)
            
            # Executar busca
            results = solr_service.search_documents(
                query=serializer.validated_data.get('query', ''),
                filters=filters,
                start=serializer.validated_data.get('start', 0),
                rows=serializer.validated_data.get('rows', 10)
            )
            
            # Processar resultados
            documents = []
            for doc in results['docs']:
                doc_data = {
                    'document_id': doc.get('document_id'),
                    'filename': doc.get('filename'),
                    'content': doc.get('content', ''),
                    'mime_type': doc.get('mime_type'),
                    'file_size': doc.get('file_size'),
                    'status': doc.get('status'),
                    'directory_name': doc.get('directory_name'),
                    'created_at': doc.get('created_at'),
                    'updated_at': doc.get('updated_at'),
                    'score': doc.get('score', 0),
                    'highlights': results['highlighting'].get(doc['id'], {})
                }
                documents.append(doc_data)
            
            return Response({
                'documents': DocumentSearchResultSerializer(documents, many=True).data,
                'total_hits': results['hits'],
                'facets': results.get('facets', {}),
                'query_info': {
                    'query': serializer.validated_data.get('query', ''),
                    'start': serializer.validated_data.get('start', 0),
                    'rows': serializer.validated_data.get('rows', 10)
                }
            })
            
        except Exception as e:
            return Response(
                {'error': f'Erro na busca: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """
        Obter sugestões de busca
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'suggestions': []})
        
        try:
            # Implementar sugestões baseadas em documentos existentes
            # Por enquanto, retornar lista vazia
            return Response({'suggestions': []})
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao obter sugestões: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
