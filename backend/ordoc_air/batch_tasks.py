"""
Tasks Celery para operações em lote e funcionalidades avançadas do OrdocAir
"""

import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .batch_models import BatchOperation, BatchOperationItem, OCRResult, SolrIndex
from .batch_services import BatchOperationService, OCRService, SolrService
from .models import Document

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def execute_batch_operation(self, batch_operation_id):
    """
    Executa uma operação em lote de forma assíncrona
    """
    try:
        batch_operation = BatchOperation.objects.get(id=batch_operation_id)
        service = BatchOperationService(batch_operation)
        service.execute()
        
        logger.info(f"Operação em lote {batch_operation_id} executada com sucesso")
        return {
            'status': 'success',
            'batch_operation_id': batch_operation_id,
            'total_items': batch_operation.total_items,
            'processed_items': batch_operation.processed_items,
            'failed_items': batch_operation.failed_items
        }
        
    except BatchOperation.DoesNotExist:
        logger.error(f"Operação em lote {batch_operation_id} não encontrada")
        raise
        
    except Exception as e:
        logger.error(f"Erro na execução da operação em lote {batch_operation_id}: {str(e)}")
        
        # Tentar novamente se não excedeu o limite
        if self.request.retries < self.max_retries:
            logger.info(f"Tentativa {self.request.retries + 1} de {self.max_retries + 1}")
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        
        # Marcar como falhou se excedeu tentativas
        try:
            batch_operation = BatchOperation.objects.get(id=batch_operation_id)
            batch_operation.fail(f"Falha após {self.max_retries + 1} tentativas: {str(e)}")
        except:
            pass
        
        raise


@shared_task(bind=True, max_retries=2)
def process_document_ocr(self, document_id):
    """
    Processa OCR de um documento de forma assíncrona
    """
    try:
        document = Document.objects.get(id=document_id)
        ocr_service = OCRService()
        result = ocr_service.process_document(document)
        
        logger.info(f"OCR processado para documento {document_id}")
        return {
            'status': 'success',
            'document_id': document_id,
            'ocr_result_id': str(result.id),
            'extracted_text_length': len(result.extracted_text) if result.extracted_text else 0,
            'confidence_score': result.confidence_score
        }
        
    except Document.DoesNotExist:
        logger.error(f"Documento {document_id} não encontrado")
        raise
        
    except Exception as e:
        logger.error(f"Erro no processamento OCR do documento {document_id}: {str(e)}")
        
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        
        # Marcar OCR como falhou
        try:
            ocr_result = OCRResult.objects.get(document_id=document_id)
            ocr_result.status = 'failed'
            ocr_result.error_message = str(e)
            ocr_result.save()
        except:
            pass
        
        raise


@shared_task(bind=True, max_retries=2)
def index_document_solr(self, document_id):
    """
    Indexa um documento no Solr de forma assíncrona
    """
    try:
        document = Document.objects.get(id=document_id)
        solr_service = SolrService()
        result = solr_service.index_document(document)
        
        logger.info(f"Documento {document_id} indexado no Solr")
        return {
            'status': 'success',
            'document_id': document_id,
            'solr_index_id': str(result.id),
            'solr_id': result.solr_id,
            'indexed_fields': result.indexed_fields
        }
        
    except Document.DoesNotExist:
        logger.error(f"Documento {document_id} não encontrado")
        raise
        
    except Exception as e:
        logger.error(f"Erro na indexação Solr do documento {document_id}: {str(e)}")
        
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        
        # Marcar indexação como falhou
        try:
            solr_index = SolrIndex.objects.get(document_id=document_id)
            solr_index.status = 'failed'
            solr_index.error_message = str(e)
            solr_index.retry_count += 1
            solr_index.save()
        except:
            pass
        
        raise


@shared_task
def batch_process_ocr(document_ids):
    """
    Processa OCR em lote para múltiplos documentos
    """
    results = []
    
    for document_id in document_ids:
        try:
            # Executar task individual
            result = process_document_ocr.delay(document_id)
            results.append({
                'document_id': document_id,
                'task_id': result.id,
                'status': 'queued'
            })
        except Exception as e:
            logger.error(f"Erro ao enfileirar OCR para documento {document_id}: {str(e)}")
            results.append({
                'document_id': document_id,
                'status': 'error',
                'error': str(e)
            })
    
    logger.info(f"OCR em lote iniciado para {len(document_ids)} documentos")
    return {
        'total_documents': len(document_ids),
        'results': results
    }


@shared_task
def batch_index_solr(document_ids):
    """
    Indexa múltiplos documentos no Solr em lote
    """
    results = []
    
    for document_id in document_ids:
        try:
            # Executar task individual
            result = index_document_solr.delay(document_id)
            results.append({
                'document_id': document_id,
                'task_id': result.id,
                'status': 'queued'
            })
        except Exception as e:
            logger.error(f"Erro ao enfileirar indexação Solr para documento {document_id}: {str(e)}")
            results.append({
                'document_id': document_id,
                'status': 'error',
                'error': str(e)
            })
    
    logger.info(f"Indexação Solr em lote iniciada para {len(document_ids)} documentos")
    return {
        'total_documents': len(document_ids),
        'results': results
    }


@shared_task
def cleanup_failed_operations():
    """
    Limpa operações em lote que falharam há muito tempo
    """
    from datetime import timedelta
    
    cutoff_date = timezone.now() - timedelta(days=7)
    
    # Limpar operações falhadas antigas
    failed_operations = BatchOperation.objects.filter(
        status='failed',
        updated_at__lt=cutoff_date
    )
    
    count = failed_operations.count()
    failed_operations.delete()
    
    logger.info(f"Limpas {count} operações em lote falhadas antigas")
    
    # Limpar resultados OCR falhados antigos
    failed_ocr = OCRResult.objects.filter(
        status='failed',
        updated_at__lt=cutoff_date
    )
    
    ocr_count = failed_ocr.count()
    failed_ocr.delete()
    
    logger.info(f"Limpos {ocr_count} resultados OCR falhados antigos")
    
    # Limpar índices Solr falhados antigos
    failed_solr = SolrIndex.objects.filter(
        status='failed',
        updated_at__lt=cutoff_date,
        retry_count__gte=3  # Só limpar após 3 tentativas
    )
    
    solr_count = failed_solr.count()
    failed_solr.delete()
    
    logger.info(f"Limpos {solr_count} índices Solr falhados antigos")
    
    return {
        'cleaned_operations': count,
        'cleaned_ocr_results': ocr_count,
        'cleaned_solr_indexes': solr_count
    }


@shared_task
def retry_failed_solr_indexing():
    """
    Tenta reindexar documentos que falharam na indexação Solr
    """
    # Buscar índices que falharam mas ainda podem ser tentados novamente
    failed_indexes = SolrIndex.objects.filter(
        status='failed',
        retry_count__lt=3
    )
    
    retried_count = 0
    
    for solr_index in failed_indexes:
        try:
            # Tentar indexar novamente
            index_document_solr.delay(str(solr_index.document.id))
            retried_count += 1
            
        except Exception as e:
            logger.error(f"Erro ao tentar reindexar documento {solr_index.document.id}: {str(e)}")
    
    logger.info(f"Tentativa de reindexação iniciada para {retried_count} documentos")
    return {
        'retried_count': retried_count,
        'total_failed': failed_indexes.count()
    }


@shared_task
def process_pending_ocr():
    """
    Processa resultados OCR que estão pendentes há muito tempo
    """
    from datetime import timedelta
    
    # Buscar OCRs pendentes há mais de 1 hora
    cutoff_time = timezone.now() - timedelta(hours=1)
    
    pending_ocr = OCRResult.objects.filter(
        status='pending',
        created_at__lt=cutoff_time
    )
    
    processed_count = 0
    
    for ocr_result in pending_ocr:
        try:
            # Tentar processar novamente
            process_document_ocr.delay(str(ocr_result.document.id))
            processed_count += 1
            
        except Exception as e:
            logger.error(f"Erro ao reprocessar OCR do documento {ocr_result.document.id}: {str(e)}")
    
    logger.info(f"Reprocessamento OCR iniciado para {processed_count} documentos")
    return {
        'processed_count': processed_count,
        'total_pending': pending_ocr.count()
    }


@shared_task
def generate_batch_operation_report(batch_operation_id):
    """
    Gera relatório detalhado de uma operação em lote
    """
    try:
        batch_operation = BatchOperation.objects.get(id=batch_operation_id)
        
        # Estatísticas gerais
        total_items = batch_operation.total_items
        processed_items = batch_operation.processed_items
        failed_items = batch_operation.failed_items
        success_rate = (processed_items / total_items * 100) if total_items > 0 else 0
        
        # Detalhes dos itens
        items = batch_operation.items.all()
        
        successful_items = []
        failed_items_detail = []
        
        for item in items:
            if item.status == 'completed':
                successful_items.append({
                    'document_id': str(item.document.id),
                    'document_name': item.document.original_filename,
                    'processing_time': str(item.processing_time) if item.processing_time else None,
                    'result': item.result
                })
            elif item.status == 'failed':
                failed_items_detail.append({
                    'document_id': str(item.document.id),
                    'document_name': item.document.original_filename,
                    'error': item.error_message
                })
        
        report = {
            'batch_operation': {
                'id': str(batch_operation.id),
                'name': batch_operation.name,
                'operation_type': batch_operation.operation_type,
                'status': batch_operation.status,
                'created_at': batch_operation.created_at.isoformat(),
                'started_at': batch_operation.started_at.isoformat() if batch_operation.started_at else None,
                'completed_at': batch_operation.completed_at.isoformat() if batch_operation.completed_at else None,
                'total_time': str(batch_operation.total_time) if batch_operation.total_time else None
            },
            'statistics': {
                'total_items': total_items,
                'processed_items': processed_items,
                'failed_items': failed_items,
                'success_rate': round(success_rate, 2)
            },
            'successful_items': successful_items,
            'failed_items': failed_items_detail
        }
        
        logger.info(f"Relatório gerado para operação em lote {batch_operation_id}")
        return report
        
    except BatchOperation.DoesNotExist:
        logger.error(f"Operação em lote {batch_operation_id} não encontrada")
        raise
    
    except Exception as e:
        logger.error(f"Erro ao gerar relatório da operação {batch_operation_id}: {str(e)}")
        raise


@shared_task
def sync_solr_indexes():
    """
    Sincroniza índices Solr com documentos no banco de dados
    """
    try:
        solr_service = SolrService()
        
        if not solr_service.solr_available:
            logger.warning("Solr não está disponível para sincronização")
            return {'status': 'skipped', 'reason': 'Solr não disponível'}
        
        # Buscar documentos que precisam ser indexados
        documents_to_index = Document.objects.filter(
            deleted_at__isnull=True
        ).exclude(
            solr_index__status='indexed'
        )
        
        indexed_count = 0
        error_count = 0
        
        for document in documents_to_index:
            try:
                index_document_solr.delay(str(document.id))
                indexed_count += 1
                
            except Exception as e:
                logger.error(f"Erro ao enfileirar indexação do documento {document.id}: {str(e)}")
                error_count += 1
        
        logger.info(f"Sincronização Solr: {indexed_count} documentos enfileirados, {error_count} erros")
        
        return {
            'status': 'completed',
            'indexed_count': indexed_count,
            'error_count': error_count,
            'total_documents': documents_to_index.count()
        }
        
    except Exception as e:
        logger.error(f"Erro na sincronização Solr: {str(e)}")
        raise


@shared_task
def auto_process_new_documents():
    """
    Processa automaticamente novos documentos (OCR + Solr)
    """
    from datetime import timedelta
    
    # Buscar documentos criados nas últimas 24 horas que ainda não foram processados
    cutoff_time = timezone.now() - timedelta(hours=24)
    
    new_documents = Document.objects.filter(
        created_at__gte=cutoff_time,
        deleted_at__isnull=True
    ).exclude(
        ocr_result__status='completed'
    )
    
    processed_count = 0
    
    for document in new_documents:
        try:
            # Processar OCR
            if document.is_pdf() or document.is_image():
                process_document_ocr.delay(str(document.id))
            
            # Indexar no Solr
            index_document_solr.delay(str(document.id))
            
            processed_count += 1
            
        except Exception as e:
            logger.error(f"Erro ao processar documento {document.id}: {str(e)}")
    
    logger.info(f"Processamento automático iniciado para {processed_count} novos documentos")
    
    return {
        'processed_count': processed_count,
        'total_new_documents': new_documents.count()
    }
