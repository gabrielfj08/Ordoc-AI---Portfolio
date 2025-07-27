"""
Serializers para operações em lote e funcionalidades avançadas do OrdocAir
"""

from rest_framework import serializers
from django.utils import timezone
from .batch_models import BatchOperation, BatchOperationItem, OCRResult, SolrIndex
from .models import Document, Directory
from ordoc_cloud.models import OrdocUser


class BatchOperationSerializer(serializers.ModelSerializer):
    """
    Serializer para operações em lote
    """
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    estimated_completion = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()
    
    class Meta:
        model = BatchOperation
        fields = [
            'id', 'name', 'description', 'operation_type', 'status',
            'parameters', 'filters', 'total_items', 'processed_items',
            'failed_items', 'created_by', 'created_by_name', 'created_at',
            'started_at', 'completed_at', 'total_time', 'progress_percentage',
            'estimated_completion', 'can_cancel', 'error_message'
        ]
        read_only_fields = [
            'id', 'status', 'total_items', 'processed_items', 'failed_items',
            'started_at', 'completed_at', 'total_time', 'error_message'
        ]
    
    def get_progress_percentage(self, obj):
        """
        Calcula a porcentagem de progresso
        """
        if obj.total_items == 0:
            return 0
        return round((obj.processed_items / obj.total_items) * 100, 2)
    
    def get_estimated_completion(self, obj):
        """
        Estima o tempo de conclusão baseado no progresso atual
        """
        if obj.status != 'running' or obj.processed_items == 0:
            return None
        
        elapsed_time = timezone.now() - obj.started_at
        remaining_items = obj.total_items - obj.processed_items
        
        if remaining_items == 0:
            return None
        
        avg_time_per_item = elapsed_time / obj.processed_items
        estimated_remaining = avg_time_per_item * remaining_items
        
        return (timezone.now() + estimated_remaining).isoformat()
    
    def get_can_cancel(self, obj):
        """
        Verifica se a operação pode ser cancelada
        """
        return obj.status in ['pending', 'running']
    
    def validate_operation_type(self, value):
        """
        Valida o tipo de operação
        """
        valid_operations = [
            'move', 'copy', 'delete', 'update_metadata',
            'process_ocr', 'change_status', 'index_solr'
        ]
        
        if value not in valid_operations:
            raise serializers.ValidationError(
                f"Tipo de operação inválido. Opções válidas: {', '.join(valid_operations)}"
            )
        
        return value
    
    def validate_parameters(self, value):
        """
        Valida os parâmetros baseados no tipo de operação
        """
        operation_type = self.initial_data.get('operation_type')
        
        if operation_type in ['move', 'copy']:
            if not value.get('target_directory_id'):
                raise serializers.ValidationError(
                    "target_directory_id é obrigatório para operações de mover/copiar"
                )
            
            # Verificar se o diretório existe
            try:
                Directory.objects.get(id=value['target_directory_id'])
            except Directory.DoesNotExist:
                raise serializers.ValidationError("Diretório de destino não encontrado")
        
        elif operation_type == 'change_status':
            if not value.get('new_status'):
                raise serializers.ValidationError(
                    "new_status é obrigatório para operação de alterar status"
                )
        
        elif operation_type == 'update_metadata':
            if not value.get('metadata_updates'):
                raise serializers.ValidationError(
                    "metadata_updates é obrigatório para operação de atualizar metadados"
                )
        
        return value


class BatchOperationItemSerializer(serializers.ModelSerializer):
    """
    Serializer para itens de operação em lote
    """
    document_name = serializers.CharField(source='document.original_filename', read_only=True)
    document_size = serializers.IntegerField(source='document.file_size', read_only=True)
    processing_duration = serializers.SerializerMethodField()
    
    class Meta:
        model = BatchOperationItem
        fields = [
            'id', 'document', 'document_name', 'document_size', 'status',
            'started_at', 'completed_at', 'processing_time', 'processing_duration',
            'result', 'error_message'
        ]
        read_only_fields = [
            'id', 'status', 'started_at', 'completed_at', 'processing_time',
            'result', 'error_message'
        ]
    
    def get_processing_duration(self, obj):
        """
        Retorna a duração do processamento em segundos
        """
        if obj.processing_time:
            return obj.processing_time.total_seconds()
        return None


class OCRResultSerializer(serializers.ModelSerializer):
    """
    Serializer para resultados de OCR
    """
    document_name = serializers.CharField(source='document.original_filename', read_only=True)
    document_size = serializers.IntegerField(source='document.file_size', read_only=True)
    processing_duration = serializers.SerializerMethodField()
    text_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = OCRResult
        fields = [
            'id', 'document', 'document_name', 'document_size', 'status',
            'engine', 'extracted_text', 'text_preview', 'confidence_score',
            'language', 'processing_time', 'processing_duration', 'processed_at',
            'error_message', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'extracted_text', 'confidence_score', 'language',
            'processing_time', 'processed_at', 'error_message', 'created_at',
            'updated_at'
        ]
    
    def get_processing_duration(self, obj):
        """
        Retorna a duração do processamento em segundos
        """
        if obj.processing_time:
            return obj.processing_time.total_seconds()
        return None
    
    def get_text_preview(self, obj):
        """
        Retorna uma prévia do texto extraído (primeiros 200 caracteres)
        """
        if obj.extracted_text:
            return obj.extracted_text[:200] + ('...' if len(obj.extracted_text) > 200 else '')
        return None


class SolrIndexSerializer(serializers.ModelSerializer):
    """
    Serializer para índices Solr
    """
    document_name = serializers.CharField(source='document.original_filename', read_only=True)
    document_size = serializers.IntegerField(source='document.file_size', read_only=True)
    sync_status = serializers.SerializerMethodField()
    
    class Meta:
        model = SolrIndex
        fields = [
            'id', 'document', 'document_name', 'document_size', 'solr_id',
            'status', 'sync_status', 'indexed_fields', 'indexed_at',
            'last_sync_at', 'retry_count', 'error_message', 'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id', 'solr_id', 'status', 'indexed_fields', 'indexed_at',
            'last_sync_at', 'retry_count', 'error_message', 'created_at',
            'updated_at'
        ]
    
    def get_sync_status(self, obj):
        """
        Retorna o status de sincronização
        """
        if obj.status == 'indexed':
            if obj.last_sync_at and obj.document.updated_at > obj.last_sync_at:
                return 'outdated'
            return 'synced'
        elif obj.status == 'failed' and obj.retry_count >= 3:
            return 'failed_permanently'
        return obj.status


class BatchOperationCreateSerializer(serializers.Serializer):
    """
    Serializer para criar operações em lote
    """
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    operation_type = serializers.ChoiceField(choices=[
        ('move', 'Mover'),
        ('copy', 'Copiar'),
        ('delete', 'Excluir'),
        ('update_metadata', 'Atualizar Metadados'),
        ('process_ocr', 'Processar OCR'),
        ('change_status', 'Alterar Status'),
        ('index_solr', 'Indexar no Solr')
    ])
    parameters = serializers.JSONField()
    filters = serializers.JSONField()
    execute_immediately = serializers.BooleanField(default=False)
    
    def validate_filters(self, value):
        """
        Valida os filtros para seleção de documentos
        """
        if not value:
            raise serializers.ValidationError("Filtros são obrigatórios")
        
        # Verificar se pelo menos um filtro foi especificado
        valid_filters = [
            'directory_ids', 'document_ids', 'status', 'mime_types',
            'created_after', 'created_before', 'size_min', 'size_max',
            'has_ocr', 'indexed_in_solr'
        ]
        
        has_valid_filter = any(key in value for key in valid_filters)
        if not has_valid_filter:
            raise serializers.ValidationError(
                f"Pelo menos um filtro válido deve ser especificado: {', '.join(valid_filters)}"
            )
        
        return value


class DocumentSearchSerializer(serializers.Serializer):
    """
    Serializer para busca de documentos no Solr
    """
    query = serializers.CharField(required=False, allow_blank=True)
    filters = serializers.JSONField(required=False)
    start = serializers.IntegerField(default=0, min_value=0)
    rows = serializers.IntegerField(default=10, min_value=1, max_value=100)
    sort = serializers.CharField(required=False)
    highlight = serializers.BooleanField(default=True)
    facets = serializers.BooleanField(default=False)
    
    def validate_sort(self, value):
        """
        Valida o campo de ordenação
        """
        if value:
            valid_sorts = [
                'score desc', 'created_at desc', 'created_at asc',
                'updated_at desc', 'updated_at asc', 'filename asc',
                'filename desc', 'file_size desc', 'file_size asc'
            ]
            
            if value not in valid_sorts:
                raise serializers.ValidationError(
                    f"Ordenação inválida. Opções válidas: {', '.join(valid_sorts)}"
                )
        
        return value


class DocumentSearchResultSerializer(serializers.Serializer):
    """
    Serializer para resultados de busca de documentos
    """
    document_id = serializers.CharField()
    filename = serializers.CharField()
    content = serializers.CharField()
    mime_type = serializers.CharField()
    file_size = serializers.IntegerField()
    status = serializers.CharField()
    directory_name = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    score = serializers.FloatField()
    highlights = serializers.JSONField(required=False)


class BatchOperationStatsSerializer(serializers.Serializer):
    """
    Serializer para estatísticas de operações em lote
    """
    total_operations = serializers.IntegerField()
    pending_operations = serializers.IntegerField()
    running_operations = serializers.IntegerField()
    completed_operations = serializers.IntegerField()
    failed_operations = serializers.IntegerField()
    total_documents_processed = serializers.IntegerField()
    average_processing_time = serializers.FloatField()
    success_rate = serializers.FloatField()


class OCRStatsSerializer(serializers.Serializer):
    """
    Serializer para estatísticas de OCR
    """
    total_documents = serializers.IntegerField()
    processed_documents = serializers.IntegerField()
    pending_documents = serializers.IntegerField()
    failed_documents = serializers.IntegerField()
    average_confidence = serializers.FloatField()
    average_processing_time = serializers.FloatField()
    languages_detected = serializers.JSONField()


class SolrStatsSerializer(serializers.Serializer):
    """
    Serializer para estatísticas de indexação Solr
    """
    total_documents = serializers.IntegerField()
    indexed_documents = serializers.IntegerField()
    pending_documents = serializers.IntegerField()
    failed_documents = serializers.IntegerField()
    outdated_documents = serializers.IntegerField()
    average_indexing_time = serializers.FloatField()
    last_sync_at = serializers.DateTimeField()
