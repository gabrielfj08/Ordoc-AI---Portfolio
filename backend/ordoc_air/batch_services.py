"""
Serviços para operações em lote e funcionalidades avançadas do OrdocAir
Inclui batch operations, OCR e integração com Solr
"""

import os
import logging
import tempfile
import subprocess
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.core.files.storage import default_storage
from .batch_models import BatchOperation, BatchOperationItem, OCRResult, SolrIndex
from .models import Document, Directory

logger = logging.getLogger(__name__)


class BatchOperationService:
    """
    Serviço para executar operações em lote em documentos
    """
    
    def __init__(self, batch_operation: BatchOperation):
        self.batch_operation = batch_operation
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    def execute(self):
        """
        Executa a operação em lote
        """
        try:
            self.logger.info(f"Iniciando operação em lote: {self.batch_operation.name}")
            
            # Marcar como iniciada
            self.batch_operation.start()
            
            # Obter documentos afetados
            documents = self.batch_operation.get_affected_documents()
            self.batch_operation.total_items = documents.count()
            self.batch_operation.save()
            
            # Criar itens da operação
            self._create_operation_items(documents)
            
            # Executar operação específica
            operation_method = getattr(self, f'_execute_{self.batch_operation.operation_type}', None)
            if not operation_method:
                raise ValueError(f"Operação não suportada: {self.batch_operation.operation_type}")
            
            operation_method()
            
            # Marcar como concluída
            self.batch_operation.complete()
            self.logger.info(f"Operação em lote concluída: {self.batch_operation.name}")
            
        except Exception as e:
            self.logger.error(f"Erro na operação em lote {self.batch_operation.name}: {str(e)}")
            self.batch_operation.fail(str(e))
            raise
    
    def _create_operation_items(self, documents):
        """
        Cria itens individuais para cada documento
        """
        items = []
        for document in documents:
            items.append(BatchOperationItem(
                batch_operation=self.batch_operation,
                document=document
            ))
        
        BatchOperationItem.objects.bulk_create(items, ignore_conflicts=True)
    
    def _execute_move(self):
        """
        Executa operação de mover documentos
        """
        target_directory_id = self.batch_operation.parameters.get('target_directory_id')
        if not target_directory_id:
            raise ValueError("target_directory_id é obrigatório para operação de mover")
        
        try:
            target_directory = Directory.objects.get(id=target_directory_id)
        except Directory.DoesNotExist:
            raise ValueError(f"Diretório de destino não encontrado: {target_directory_id}")
        
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                # Mover documento
                old_directory = item.document.directory
                item.document.directory = target_directory
                item.document.save()
                
                item.complete_processing({
                    'old_directory': old_directory.name,
                    'new_directory': target_directory.name
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _execute_copy(self):
        """
        Executa operação de copiar documentos
        """
        target_directory_id = self.batch_operation.parameters.get('target_directory_id')
        if not target_directory_id:
            raise ValueError("target_directory_id é obrigatório para operação de copiar")
        
        try:
            target_directory = Directory.objects.get(id=target_directory_id)
        except Directory.DoesNotExist:
            raise ValueError(f"Diretório de destino não encontrado: {target_directory_id}")
        
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                # Copiar documento
                original_doc = item.document
                new_doc = Document.objects.create(
                    original_filename=f"Cópia de {original_doc.original_filename}",
                    file=original_doc.file,
                    mime_type=original_doc.mime_type,
                    file_size=original_doc.file_size,
                    directory=target_directory,
                    created_by=self.batch_operation.created_by,
                    parent_document=original_doc
                )
                
                item.complete_processing({
                    'original_document_id': str(original_doc.id),
                    'new_document_id': str(new_doc.id),
                    'target_directory': target_directory.name
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _execute_delete(self):
        """
        Executa operação de excluir documentos
        """
        soft_delete = self.batch_operation.parameters.get('soft_delete', True)
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                if soft_delete:
                    # Soft delete
                    item.document.deleted_at = timezone.now()
                    item.document.deleted_by = self.batch_operation.created_by
                    item.document.save()
                else:
                    # Hard delete
                    if item.document.file:
                        default_storage.delete(item.document.file.name)
                    item.document.delete()
                
                item.complete_processing({
                    'deleted_type': 'soft' if soft_delete else 'hard',
                    'filename': item.document.original_filename
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _execute_update_metadata(self):
        """
        Executa operação de atualizar metadados
        """
        metadata_updates = self.batch_operation.parameters.get('metadata_updates', {})
        if not metadata_updates:
            raise ValueError("metadata_updates é obrigatório para operação de atualizar metadados")
        
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                # Atualizar metadados
                old_metadata = item.document.metadata.copy()
                item.document.metadata.update(metadata_updates)
                item.document.save()
                
                item.complete_processing({
                    'old_metadata': old_metadata,
                    'new_metadata': item.document.metadata,
                    'updated_fields': list(metadata_updates.keys())
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _execute_process_ocr(self):
        """
        Executa operação de processar OCR
        """
        ocr_service = OCRService()
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                # Processar OCR
                result = ocr_service.process_document(item.document)
                
                item.complete_processing({
                    'ocr_status': result.status,
                    'extracted_text_length': len(result.extracted_text) if result.extracted_text else 0,
                    'confidence_score': result.confidence_score
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _execute_change_status(self):
        """
        Executa operação de alterar status
        """
        new_status = self.batch_operation.parameters.get('new_status')
        if not new_status:
            raise ValueError("new_status é obrigatório para operação de alterar status")
        
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                old_status = item.document.status
                
                # Alterar status usando FSM se possível
                if hasattr(item.document, new_status):
                    transition_method = getattr(item.document, new_status)
                    transition_method()
                else:
                    # Alteração direta (cuidado com FSM)
                    item.document.status = new_status
                    item.document.save()
                
                item.complete_processing({
                    'old_status': old_status,
                    'new_status': new_status
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _execute_index_solr(self):
        """
        Executa operação de indexar no Solr
        """
        solr_service = SolrService()
        items = self.batch_operation.items.filter(status='pending')
        
        for item in items:
            try:
                item.start_processing()
                
                # Indexar no Solr
                result = solr_service.index_document(item.document)
                
                item.complete_processing({
                    'solr_id': result.solr_id,
                    'indexed_fields': result.indexed_fields,
                    'status': result.status
                })
                
                self._update_progress()
                
            except Exception as e:
                item.fail_processing(str(e))
                self.batch_operation.failed_items += 1
                self.batch_operation.save()
    
    def _update_progress(self):
        """
        Atualiza o progresso da operação
        """
        self.batch_operation.processed_items += 1
        self.batch_operation.save()


class OCRService:
    """
    Serviço para processamento de OCR em documentos
    """
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    def process_document(self, document: Document) -> OCRResult:
        """
        Processa OCR em um documento
        """
        # Verificar se já existe resultado OCR
        ocr_result, created = OCRResult.objects.get_or_create(
            document=document,
            defaults={
                'status': 'pending',
                'engine': 'tesseract'
            }
        )
        
        if not created and ocr_result.status == 'completed':
            self.logger.info(f"OCR já processado para documento {document.id}")
            return ocr_result
        
        try:
            ocr_result.status = 'processing'
            ocr_result.save()
            
            start_time = timezone.now()
            
            # Processar baseado no tipo de arquivo
            if document.is_pdf():
                extracted_text = self._process_pdf(document)
            elif document.is_image():
                extracted_text = self._process_image(document)
            else:
                raise ValueError(f"Tipo de arquivo não suportado para OCR: {document.get_file_extension()}")
            
            end_time = timezone.now()
            processing_time = end_time - start_time
            
            # Salvar resultado
            ocr_result.extracted_text = extracted_text
            ocr_result.status = 'completed'
            ocr_result.processing_time = processing_time
            ocr_result.processed_at = end_time
            ocr_result.confidence_score = self._calculate_confidence(extracted_text)
            ocr_result.language = self._detect_language(extracted_text)
            ocr_result.save()
            
            self.logger.info(f"OCR processado com sucesso para documento {document.id}")
            return ocr_result
            
        except Exception as e:
            ocr_result.status = 'failed'
            ocr_result.error_message = str(e)
            ocr_result.save()
            
            self.logger.error(f"Erro no processamento OCR do documento {document.id}: {str(e)}")
            raise
    
    def _process_pdf(self, document: Document) -> str:
        """
        Processa OCR em arquivo PDF
        """
        try:
            # Usar pdf2image + tesseract para PDFs
            import pdf2image
            import pytesseract
            from PIL import Image
            
            # Converter PDF para imagens
            with tempfile.TemporaryDirectory() as temp_dir:
                # Salvar arquivo temporariamente
                temp_pdf_path = os.path.join(temp_dir, 'document.pdf')
                with open(temp_pdf_path, 'wb') as temp_file:
                    for chunk in document.file.chunks():
                        temp_file.write(chunk)
                
                # Converter para imagens
                images = pdf2image.convert_from_path(temp_pdf_path)
                
                # Processar cada página
                extracted_texts = []
                for i, image in enumerate(images):
                    text = pytesseract.image_to_string(image, lang='por')
                    extracted_texts.append(f"=== Página {i+1} ===\n{text}")
                
                return '\n\n'.join(extracted_texts)
                
        except ImportError:
            # Fallback para pdfplumber se pdf2image não estiver disponível
            return self._process_pdf_fallback(document)
    
    def _process_pdf_fallback(self, document: Document) -> str:
        """
        Fallback para processar PDF sem OCR (apenas texto)
        """
        try:
            import pdfplumber
            
            with tempfile.TemporaryDirectory() as temp_dir:
                temp_pdf_path = os.path.join(temp_dir, 'document.pdf')
                with open(temp_pdf_path, 'wb') as temp_file:
                    for chunk in document.file.chunks():
                        temp_file.write(chunk)
                
                extracted_texts = []
                with pdfplumber.open(temp_pdf_path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        text = page.extract_text()
                        if text:
                            extracted_texts.append(f"=== Página {i+1} ===\n{text}")
                
                return '\n\n'.join(extracted_texts)
                
        except ImportError:
            raise ValueError("Bibliotecas de processamento PDF não estão disponíveis")
    
    def _process_image(self, document: Document) -> str:
        """
        Processa OCR em arquivo de imagem
        """
        try:
            import pytesseract
            from PIL import Image
            
            with tempfile.TemporaryDirectory() as temp_dir:
                # Salvar imagem temporariamente
                temp_image_path = os.path.join(temp_dir, f'image{document.get_file_extension()}')
                with open(temp_image_path, 'wb') as temp_file:
                    for chunk in document.file.chunks():
                        temp_file.write(chunk)
                
                # Processar OCR
                image = Image.open(temp_image_path)
                text = pytesseract.image_to_string(image, lang='por')
                
                return text
                
        except ImportError:
            raise ValueError("Tesseract não está disponível para processamento de imagens")
    
    def _calculate_confidence(self, text: str) -> float:
        """
        Calcula uma pontuação de confiança baseada no texto extraído
        """
        if not text:
            return 0.0
        
        # Métricas simples de qualidade do texto
        total_chars = len(text)
        if total_chars == 0:
            return 0.0
        
        # Contar caracteres válidos (letras, números, espaços, pontuação comum)
        valid_chars = sum(1 for c in text if c.isalnum() or c.isspace() or c in '.,!?;:()-')
        
        # Calcular porcentagem de caracteres válidos
        confidence = (valid_chars / total_chars) * 100
        
        # Ajustar baseado no tamanho do texto
        if total_chars < 10:
            confidence *= 0.5  # Penalizar textos muito curtos
        elif total_chars > 1000:
            confidence = min(confidence * 1.1, 100)  # Bonus para textos longos
        
        return round(confidence, 2)
    
    def _detect_language(self, text: str) -> str:
        """
        Detecta o idioma do texto extraído
        """
        # Implementação simples - pode ser melhorada com bibliotecas como langdetect
        if not text:
            return 'unknown'
        
        # Palavras comuns em português
        portuguese_words = ['o', 'a', 'de', 'do', 'da', 'em', 'um', 'uma', 'com', 'não', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'numa', 'pelos', 'pelas', 'esse', 'eles', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'pelas', 'seu', 'sua']
        
        words = text.lower().split()
        if not words:
            return 'unknown'
        
        portuguese_count = sum(1 for word in words if word in portuguese_words)
        portuguese_ratio = portuguese_count / len(words)
        
        if portuguese_ratio > 0.1:  # Se mais de 10% das palavras são comuns em português
            return 'por'
        
        return 'unknown'


class SolrService:
    """
    Serviço para integração com Apache Solr
    """
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
        self.solr_available = False
        try:
            import pysolr
            solr_url = getattr(settings, 'SOLR_URL', 'http://localhost:8983/solr')
            collection = getattr(settings, 'SOLR_COLLECTION', 'documents')
            username = getattr(settings, 'SOLR_USERNAME', None)
            password = getattr(settings, 'SOLR_PASSWORD', None)
            auth = (username, password) if username and password else None
            self.solr = pysolr.Solr(f"{solr_url.rstrip('/')}/{collection}", auth=auth)
            self.solr.ping()
            self.solr_available = True
        except Exception as e:
            self.logger.warning(f"Solr não está disponível: {str(e)}")
            self.solr = None

    def add(self, docs: List[Dict[str, Any]]):
        if not self.solr_available:
            raise ValueError("Solr não está disponível")
        self.solr.add(docs)

    def commit(self):
        if not self.solr_available:
            raise ValueError("Solr não está disponível")
        self.solr.commit()
    
    def index_document(self, document: Document) -> SolrIndex:
        """
        Indexa um documento no Solr
        """
        if not self.solr_available:
            raise ValueError("Solr não está disponível")
        
        # Verificar se já existe índice
        solr_index, created = SolrIndex.objects.get_or_create(
            document=document,
            defaults={
                'status': 'pending',
                'solr_id': f"doc_{document.id}"
            }
        )
        
        try:
            solr_index.status = 'indexing'
            solr_index.save()

            # Preparar dados para indexação
            doc_data = self._prepare_document_data(document)

            # Indexar documento
            self.add([doc_data])
            self.commit()
            
            # Atualizar status
            solr_index.status = 'indexed'
            solr_index.indexed_at = timezone.now()
            solr_index.last_sync_at = timezone.now()
            solr_index.indexed_fields = list(doc_data.keys())
            solr_index.save()
            
            self.logger.info(f"Documento {document.id} indexado no Solr com sucesso")
            return solr_index
            
        except Exception as e:
            solr_index.status = 'failed'
            solr_index.error_message = str(e)
            solr_index.retry_count += 1
            solr_index.save()
            
            self.logger.error(f"Erro ao indexar documento {document.id} no Solr: {str(e)}")
            raise
    
    def _prepare_document_data(self, document: Document) -> Dict[str, Any]:
        """
        Prepara os dados do documento para indexação no Solr
        """
        # Obter texto OCR se disponível
        extracted_text = ""
        if hasattr(document, 'ocr_result') and document.ocr_result.extracted_text:
            extracted_text = document.ocr_result.extracted_text
        
        # Preparar dados
        doc_data = {
            'id': f"doc_{document.id}",
            'document_id': str(document.id),
            'filename': document.original_filename,
            'content': extracted_text,
            'mime_type': getattr(document, 'content_type', '') or '',
            'file_size': document.file_size or 0,
            'status': document.status,
            'directory_id': str(document.directory.id) if document.directory else '',
            'directory_name': document.directory.name if document.directory else '',
            'organization_id': str(document.directory.department.organization.id) if document.directory and document.directory.department else '',
            'created_at': document.created_at.isoformat() if document.created_at else '',
            'updated_at': document.updated_at.isoformat() if document.updated_at else '',
            'created_by': document.created_by.username if document.created_by else '',
            'metadata': getattr(document, 'metadata', {}) or {},
        }
        
        # Adicionar campos de boost baseados na relevância
        if document.is_pdf():
            doc_data['boost'] = 1.2  # PDFs são mais relevantes
        elif document.is_image():
            doc_data['boost'] = 0.8  # Imagens são menos relevantes para busca textual
        
        return doc_data
    
    def search_documents(self, query: str, filters: Dict[str, Any] = None, 
                        start: int = 0, rows: int = 10) -> Dict[str, Any]:
        """
        Busca documentos no Solr
        """
        if not self.solr_available:
            raise ValueError("Solr não está disponível")
        
        try:
            # Preparar query
            search_query = query if query else '*:*'
            
            # Preparar filtros
            filter_queries = []
            if filters:
                for field, value in filters.items():
                    if isinstance(value, list):
                        filter_queries.append(f"{field}:({' OR '.join(value)})")
                    else:
                        filter_queries.append(f"{field}:{value}")
            
            # Executar busca
            results = self.solr.search(
                search_query,
                fq=filter_queries,
                start=start,
                rows=rows,
                highlight=True,
                hl_fl='content,filename',
                hl_simple_pre='<mark>',
                hl_simple_post='</mark>'
            )
            
            return {
                'docs': results.docs,
                'hits': results.hits,
                'highlighting': results.highlighting,
                'facets': results.facets if hasattr(results, 'facets') else {}
            }
            
        except Exception as e:
            self.logger.error(f"Erro na busca Solr: {str(e)}")
            raise
    
    def delete_document(self, document: Document):
        """
        Remove um documento do índice Solr
        """
        if not self.solr_available:
            return
        
        try:
            # Remover do Solr
            self.solr.delete(id=f"doc_{document.id}")
            self.commit()
            
            # Remover registro local
            if hasattr(document, 'solr_index'):
                document.solr_index.delete()
            
            self.logger.info(f"Documento {document.id} removido do Solr")
            
        except Exception as e:
            self.logger.error(f"Erro ao remover documento {document.id} do Solr: {str(e)}")
    
    def reindex_all_documents(self, organization_id: str = None):
        """
        Reindexa todos os documentos
        """
        if not self.solr_available:
            raise ValueError("Solr não está disponível")
        
        from .models import Document
        
        queryset = Document.objects.filter(deleted_at__isnull=True)
        
        if organization_id:
            queryset = queryset.filter(
                directory__department__organization_id=organization_id
            )
        
        total_docs = queryset.count()
        processed = 0
        
        self.logger.info(f"Iniciando reindexação de {total_docs} documentos")
        
        for document in queryset.iterator():
            try:
                self.index_document(document)
                processed += 1
                
                if processed % 100 == 0:
                    self.logger.info(f"Reindexados {processed}/{total_docs} documentos")
                    
            except Exception as e:
                self.logger.error(f"Erro ao reindexar documento {document.id}: {str(e)}")
        
        self.logger.info(f"Reindexação concluída: {processed}/{total_docs} documentos processados")
