"""
Celery tasks for OrdocAir - Document processing and OCR
"""
from celery import shared_task
from django.conf import settings
import pytesseract
from PIL import Image
import PyPDF2
import io
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def process_document_ocr(self, document_id):
    """
    Task para processar OCR de um documento
    Equivalente ao job de OCR do sistema Rails original
    """
    try:
        from .models import Document
        
        document = Document.objects.get(id=document_id)
        logger.info(f"Iniciando processamento OCR para documento: {document.original_filename}")
        
        # Marcar documento como em processamento
        document.enqueue()
        document.save()
        
        extracted_text = ""
        
        if document.is_pdf():
            # Processar PDF
            extracted_text = extract_text_from_pdf(document.file)
        elif document.is_image():
            # Processar imagem
            extracted_text = extract_text_from_image(document.file)
        
        # Salvar texto extraído
        document.extracted_text = extracted_text
        document.process()  # Marcar como processado
        document.save()
        
        logger.info(f"OCR concluído para documento: {document.original_filename}")
        
        # Indexar no Solr (será implementado posteriormente)
        # index_document_in_solr.delay(document_id)
        
        return {
            'document_id': str(document_id),
            'status': 'success',
            'text_length': len(extracted_text)
        }
        
    except Exception as exc:
        logger.error(f"Erro no processamento OCR: {exc}")
        
        try:
            document = Document.objects.get(id=document_id)
            document.fail()  # Marcar como falhou
            document.save()
        except:
            pass
        
        # Retry com backoff exponencial
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


def extract_text_from_pdf(file_field):
    """
    Extrai texto de um arquivo PDF
    """
    try:
        file_field.open()
        pdf_reader = PyPDF2.PdfReader(file_field)
        text = ""
        
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        file_field.close()
        return text.strip()
        
    except Exception as e:
        logger.error(f"Erro ao extrair texto do PDF: {e}")
        return ""


def extract_text_from_image(file_field):
    """
    Extrai texto de uma imagem usando Tesseract OCR
    """
    try:
        file_field.open()
        image = Image.open(file_field)
        
        # Configurar Tesseract para português
        custom_config = r'--oem 3 --psm 6 -l por'
        text = pytesseract.image_to_string(image, config=custom_config)
        
        file_field.close()
        return text.strip()
        
    except Exception as e:
        logger.error(f"Erro ao extrair texto da imagem: {e}")
        return ""


@shared_task
def index_document_in_solr(document_id):
    """
    Task para indexar documento no Apache Solr
    Será implementada posteriormente
    """
    try:
        from .models import Document
        
        document = Document.objects.get(id=document_id)
        logger.info(f"Indexando documento no Solr: {document.original_filename}")
        
        # TODO: Implementar integração com Solr
        # solr_client = SolrClient(settings.SOLR_URL)
        # solr_client.index_document(document)
        
        return {
            'document_id': str(document_id),
            'status': 'indexed'
        }
        
    except Exception as e:
        logger.error(f"Erro ao indexar documento no Solr: {e}")
        raise


@shared_task
def cleanup_old_documents():
    """
    Task para limpeza de documentos antigos
    Executada periodicamente
    """
    try:
        from .models import Document
        from django.utils import timezone
        from datetime import timedelta
        
        # Remover documentos na lixeira há mais de 30 dias
        cutoff_date = timezone.now() - timedelta(days=30)
        old_documents = Document.objects.filter(
            deleted_at__lt=cutoff_date,
            deleted_at__isnull=False
        )
        
        count = old_documents.count()
        old_documents.delete()
        
        logger.info(f"Removidos {count} documentos antigos da lixeira")
        
        return {
            'status': 'success',
            'deleted_count': count
        }
        
    except Exception as e:
        logger.error(f"Erro na limpeza de documentos: {e}")
        raise


@shared_task
def generate_document_thumbnail(document_id):
    """
    Task para gerar thumbnail de documento
    """
    try:
        from .models import Document
        from PIL import Image
        
        document = Document.objects.get(id=document_id)
        
        if document.is_image():
            # Gerar thumbnail para imagem
            document.file.open()
            image = Image.open(document.file)
            
            # Redimensionar para thumbnail
            image.thumbnail((200, 200), Image.Resampling.LANCZOS)
            
            # Salvar thumbnail (implementar campo thumbnail no modelo)
            # thumbnail_io = io.BytesIO()
            # image.save(thumbnail_io, format='JPEG')
            # document.thumbnail.save(f"thumb_{document.original_filename}.jpg", thumbnail_io)
            
            document.file.close()
        
        logger.info(f"Thumbnail gerado para: {document.original_filename}")
        
        return {
            'document_id': str(document_id),
            'status': 'thumbnail_generated'
        }
        
    except Exception as e:
        logger.error(f"Erro ao gerar thumbnail: {e}")
        raise
