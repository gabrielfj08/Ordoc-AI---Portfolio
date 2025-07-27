"""
Modelos para operações em lote (Batch Operations) do OrdocAir
Permite executar operações em massa em documentos e diretórios
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django_fsm import FSMField, transition
import uuid
import json


class BatchOperation(models.Model):
    """
    Modelo para operações em lote
    Permite executar operações em massa em documentos
    """
    
    OPERATION_CHOICES = [
        ('move', 'Mover Documentos'),
        ('copy', 'Copiar Documentos'),
        ('delete', 'Excluir Documentos'),
        ('update_metadata', 'Atualizar Metadados'),
        ('process_ocr', 'Processar OCR'),
        ('change_status', 'Alterar Status'),
        ('export', 'Exportar Documentos'),
        ('index_solr', 'Indexar no Solr'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('running', 'Executando'),
        ('completed', 'Concluído'),
        ('failed', 'Falhou'),
        ('cancelled', 'Cancelado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Operation info
    name = models.CharField(max_length=255, verbose_name='Nome da Operação')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    operation_type = models.CharField(
        max_length=20,
        choices=OPERATION_CHOICES,
        verbose_name='Tipo de Operação'
    )
    status = FSMField(
        default='pending',
        choices=STATUS_CHOICES,
        verbose_name='Status'
    )
    
    # Configuration
    parameters = models.JSONField(
        default=dict,
        help_text='Parâmetros da operação em formato JSON',
        verbose_name='Parâmetros'
    )
    filters = models.JSONField(
        default=dict,
        help_text='Filtros para seleção de documentos',
        verbose_name='Filtros'
    )
    
    # Progress tracking
    total_items = models.PositiveIntegerField(default=0, verbose_name='Total de Itens')
    processed_items = models.PositiveIntegerField(default=0, verbose_name='Itens Processados')
    failed_items = models.PositiveIntegerField(default=0, verbose_name='Itens com Falha')
    
    # Results
    results = models.JSONField(
        default=dict,
        help_text='Resultados da operação',
        verbose_name='Resultados'
    )
    error_message = models.TextField(blank=True, null=True, verbose_name='Mensagem de Erro')
    
    # Timing
    started_at = models.DateTimeField(null=True, blank=True, verbose_name='Iniciado em')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Concluído em')
    estimated_duration = models.DurationField(null=True, blank=True, verbose_name='Duração Estimada')
    
    # Relations
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='batch_operations',
        verbose_name='Organização'
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_batch_operations',
        verbose_name='Criado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_air_batch_operations'
        verbose_name = 'Operação em Lote'
        verbose_name_plural = 'Operações em Lote'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['operation_type', 'status']),
            models.Index(fields=['created_by']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_operation_type_display()})"
    
    # FSM Transitions
    @transition(field=status, source='pending', target='running')
    def start(self):
        """Inicia a operação"""
        self.started_at = timezone.now()
        self.save()
    
    @transition(field=status, source='running', target='completed')
    def complete(self):
        """Marca a operação como concluída"""
        self.completed_at = timezone.now()
        self.save()
    
    @transition(field=status, source='running', target='failed')
    def fail(self, error_message=None):
        """Marca a operação como falhou"""
        self.completed_at = timezone.now()
        if error_message:
            self.error_message = error_message
        self.save()
    
    @transition(field=status, source=['pending', 'running'], target='cancelled')
    def cancel(self):
        """Cancela a operação"""
        self.completed_at = timezone.now()
        self.save()
    
    @property
    def progress_percentage(self):
        """Calcula a porcentagem de progresso"""
        if self.total_items == 0:
            return 0
        return (self.processed_items / self.total_items) * 100
    
    @property
    def success_rate(self):
        """Calcula a taxa de sucesso"""
        if self.processed_items == 0:
            return 0
        successful_items = self.processed_items - self.failed_items
        return (successful_items / self.processed_items) * 100
    
    @property
    def duration(self):
        """Calcula a duração da operação"""
        if self.started_at and self.completed_at:
            return self.completed_at - self.started_at
        elif self.started_at:
            return timezone.now() - self.started_at
        return None
    
    def get_affected_documents(self):
        """Retorna os documentos que serão afetados pela operação"""
        from .models import Document
        
        queryset = Document.objects.filter(
            directory__department__organization=self.organization,
            deleted_at__isnull=True
        )
        
        # Aplicar filtros
        if self.filters:
            if 'directory_ids' in self.filters:
                queryset = queryset.filter(directory_id__in=self.filters['directory_ids'])
            
            if 'status' in self.filters:
                queryset = queryset.filter(status__in=self.filters['status'])
            
            if 'file_types' in self.filters:
                queryset = queryset.filter(
                    original_filename__iregex=r'\.(' + '|'.join(self.filters['file_types']) + ')$'
                )
            
            if 'date_range' in self.filters:
                date_range = self.filters['date_range']
                if 'start' in date_range:
                    queryset = queryset.filter(created_at__gte=date_range['start'])
                if 'end' in date_range:
                    queryset = queryset.filter(created_at__lte=date_range['end'])
        
        return queryset


class BatchOperationItem(models.Model):
    """
    Modelo para itens individuais de uma operação em lote
    Rastreia o status de cada documento processado
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('completed', 'Concluído'),
        ('failed', 'Falhou'),
        ('skipped', 'Ignorado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relations
    batch_operation = models.ForeignKey(
        BatchOperation,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Operação em Lote'
    )
    document = models.ForeignKey(
        'ordoc_air.Document',
        on_delete=models.CASCADE,
        related_name='batch_items',
        verbose_name='Documento'
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    
    # Results
    result_data = models.JSONField(
        default=dict,
        help_text='Dados do resultado da operação',
        verbose_name='Dados do Resultado'
    )
    error_message = models.TextField(blank=True, null=True, verbose_name='Mensagem de Erro')
    
    # Timing
    started_at = models.DateTimeField(null=True, blank=True, verbose_name='Iniciado em')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Concluído em')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_air_batch_operation_items'
        verbose_name = 'Item de Operação em Lote'
        verbose_name_plural = 'Itens de Operação em Lote'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['batch_operation', 'status']),
            models.Index(fields=['document']),
            models.Index(fields=['status']),
        ]
        unique_together = ['batch_operation', 'document']
    
    def __str__(self):
        return f"{self.batch_operation.name} - {self.document.original_filename}"
    
    def start_processing(self):
        """Marca o item como em processamento"""
        self.status = 'processing'
        self.started_at = timezone.now()
        self.save()
    
    def complete_processing(self, result_data=None):
        """Marca o item como concluído"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        if result_data:
            self.result_data = result_data
        self.save()
    
    def fail_processing(self, error_message=None):
        """Marca o item como falhou"""
        self.status = 'failed'
        self.completed_at = timezone.now()
        if error_message:
            self.error_message = error_message
        self.save()
    
    def skip_processing(self, reason=None):
        """Marca o item como ignorado"""
        self.status = 'skipped'
        self.completed_at = timezone.now()
        if reason:
            self.error_message = reason
        self.save()
    
    @property
    def duration(self):
        """Calcula a duração do processamento"""
        if self.started_at and self.completed_at:
            return self.completed_at - self.started_at
        elif self.started_at:
            return timezone.now() - self.started_at
        return None


class OCRResult(models.Model):
    """
    Modelo para armazenar resultados de OCR
    Armazena texto extraído e metadados de processamento
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('completed', 'Concluído'),
        ('failed', 'Falhou'),
    ]
    
    ENGINE_CHOICES = [
        ('tesseract', 'Tesseract'),
        ('google_vision', 'Google Vision API'),
        ('aws_textract', 'AWS Textract'),
        ('azure_cognitive', 'Azure Cognitive Services'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relations
    document = models.OneToOneField(
        'ordoc_air.Document',
        on_delete=models.CASCADE,
        related_name='ocr_result',
        verbose_name='Documento'
    )
    
    # OCR Info
    engine = models.CharField(
        max_length=20,
        choices=ENGINE_CHOICES,
        default='tesseract',
        verbose_name='Engine OCR'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    
    # Results
    extracted_text = models.TextField(blank=True, null=True, verbose_name='Texto Extraído')
    confidence_score = models.FloatField(
        null=True,
        blank=True,
        help_text='Pontuação de confiança (0-100)',
        verbose_name='Pontuação de Confiança'
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        help_text='Metadados do processamento OCR',
        verbose_name='Metadados'
    )
    language = models.CharField(
        max_length=10,
        default='por',
        help_text='Código do idioma detectado',
        verbose_name='Idioma'
    )
    
    # Processing info
    processing_time = models.DurationField(null=True, blank=True, verbose_name='Tempo de Processamento')
    error_message = models.TextField(blank=True, null=True, verbose_name='Mensagem de Erro')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True, verbose_name='Processado em')
    
    class Meta:
        db_table = 'ordoc_air_ocr_results'
        verbose_name = 'Resultado OCR'
        verbose_name_plural = 'Resultados OCR'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['document']),
            models.Index(fields=['status']),
            models.Index(fields=['engine']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"OCR: {self.document.original_filename} ({self.get_status_display()})"
    
    def get_text_preview(self, max_length=100):
        """Retorna uma prévia do texto extraído"""
        if not self.extracted_text:
            return "Nenhum texto extraído"
        
        if len(self.extracted_text) <= max_length:
            return self.extracted_text
        
        return self.extracted_text[:max_length] + "..."
    
    def get_word_count(self):
        """Retorna o número de palavras extraídas"""
        if not self.extracted_text:
            return 0
        return len(self.extracted_text.split())
    
    def get_character_count(self):
        """Retorna o número de caracteres extraídos"""
        if not self.extracted_text:
            return 0
        return len(self.extracted_text)


class SolrIndex(models.Model):
    """
    Modelo para controlar indexação no Solr
    Rastreia quais documentos foram indexados e quando
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('indexing', 'Indexando'),
        ('indexed', 'Indexado'),
        ('failed', 'Falhou'),
        ('outdated', 'Desatualizado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relations
    document = models.OneToOneField(
        'ordoc_air.Document',
        on_delete=models.CASCADE,
        related_name='solr_index',
        verbose_name='Documento'
    )
    
    # Index info
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    solr_id = models.CharField(
        max_length=255,
        unique=True,
        help_text='ID do documento no Solr',
        verbose_name='ID no Solr'
    )
    
    # Indexing metadata
    indexed_fields = models.JSONField(
        default=list,
        help_text='Lista de campos indexados',
        verbose_name='Campos Indexados'
    )
    boost_factor = models.FloatField(
        default=1.0,
        help_text='Fator de boost para relevância',
        verbose_name='Fator de Boost'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    indexed_at = models.DateTimeField(null=True, blank=True, verbose_name='Indexado em')
    last_sync_at = models.DateTimeField(null=True, blank=True, verbose_name='Última Sincronização')
    
    # Error tracking
    error_message = models.TextField(blank=True, null=True, verbose_name='Mensagem de Erro')
    retry_count = models.PositiveIntegerField(default=0, verbose_name='Tentativas')
    
    class Meta:
        db_table = 'ordoc_air_solr_indexes'
        verbose_name = 'Índice Solr'
        verbose_name_plural = 'Índices Solr'
        ordering = ['-indexed_at']
        indexes = [
            models.Index(fields=['document']),
            models.Index(fields=['status']),
            models.Index(fields=['indexed_at']),
            models.Index(fields=['last_sync_at']),
        ]
    
    def __str__(self):
        return f"Solr: {self.document.original_filename} ({self.get_status_display()})"
    
    def mark_as_outdated(self):
        """Marca o índice como desatualizado"""
        self.status = 'outdated'
        self.save()
    
    def needs_reindex(self):
        """Verifica se o documento precisa ser reindexado"""
        if self.status in ['pending', 'failed', 'outdated']:
            return True
        
        # Verifica se o documento foi modificado após a última indexação
        if self.indexed_at and self.document.updated_at > self.indexed_at:
            return True
        
        return False
