import uuid
import base64
import hashlib
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.db import transaction
from django.contrib.auth import get_user_model
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.exceptions import InvalidSignature
import logging

from .models import (
    DigitalCertificate, SignatureTemplate, SignatureRequest,
    SignatureRequestSigner, DocumentSignature, SignatureAuditLog,
    SignatureBatch
)
from ordoc_air.models import Document
from django.core.files.base import ContentFile
from io import BytesIO
import os

# PyHanko imports
try:
    from pyhanko.sign import signers, pdf_signer
    from pyhanko.sign.fields import SigSeedSubFilter
    from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
    from pyhanko.keys import load_cert_from_pem, load_private_key_from_pem
except ImportError:
    PYHANKO_AVAILABLE = False
else:
    PYHANKO_AVAILABLE = True

User = get_user_model()
logger = logging.getLogger(__name__)


class CertificateService:
    """Serviço para gerenciamento de certificados digitais"""
    
    @staticmethod
    def upload_certificate(user, organization, certificate_file, password=None, certificate_type='A1'):
        """
        Faz upload e processa um certificado digital
        """
        try:
            # Ler dados do certificado
            cert_data = certificate_file.read()
            
            if certificate_type == 'A1':
                # Processar certificado A1 (arquivo .p12/.pfx)
                return CertificateService._process_a1_certificate(
                    user, organization, cert_data, password
                )
            else:
                # Processar certificado A3 ou outros tipos
                return CertificateService._process_other_certificate(
                    user, organization, cert_data, certificate_type
                )
                
        except Exception as e:
            logger.error(f"Erro ao processar certificado: {str(e)}")
            return False, f"Erro ao processar certificado: {str(e)}"
    
    @staticmethod
    def _process_a1_certificate(user, organization, cert_data, password):
        """Processa certificado A1 (arquivo)"""
        try:
            from cryptography.hazmat.primitives import serialization
            from cryptography.hazmat.primitives.serialization import pkcs12
            from cryptography import x509
            import hashlib
            
            # Carregar certificado PKCS#12
            private_key, certificate, additional_certificates = pkcs12.load_key_and_certificates(
                cert_data, password.encode() if password else None
            )
            
            # Extrair informações do certificado
            subject_name = certificate.subject.rfc4514_string()
            issuer_name = certificate.issuer.rfc4514_string()
            serial_number = str(certificate.serial_number)
            valid_from = certificate.not_valid_before
            valid_until = certificate.not_valid_after
            
            # Converter para PEM
            cert_pem = certificate.public_bytes(serialization.Encoding.PEM).decode()
            public_key_pem = certificate.public_key().public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ).decode()
            private_key_pem = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ).decode()
            
            # Calcular fingerprint
            fingerprint = hashlib.sha256(certificate.public_bytes(serialization.Encoding.DER)).hexdigest()
            
            # Extrair extensões
            key_usage = []
            extended_key_usage = []
            
            try:
                ku = certificate.extensions.get_extension_for_oid(x509.oid.ExtensionOID.KEY_USAGE).value
                if ku.digital_signature:
                    key_usage.append('digital_signature')
                if ku.key_encipherment:
                    key_usage.append('key_encipherment')
                if ku.data_encipherment:
                    key_usage.append('data_encipherment')
            except x509.ExtensionNotFound:
                pass
            
            try:
                eku = certificate.extensions.get_extension_for_oid(x509.oid.ExtensionOID.EXTENDED_KEY_USAGE).value
                for usage in eku:
                    extended_key_usage.append(usage.dotted_string)
            except x509.ExtensionNotFound:
                pass
            
            # Criar registro no banco
            digital_cert = DigitalCertificate.objects.create(
                organization=organization,
                user=user,
                certificate_type='A1',
                subject_name=subject_name,
                issuer_name=issuer_name,
                serial_number=serial_number,
                certificate_data=cert_pem,
                public_key=public_key_pem,
                private_key=private_key_pem,
                valid_from=valid_from,
                valid_until=valid_until,
                fingerprint_sha256=fingerprint,
                key_usage=key_usage,
                extended_key_usage=extended_key_usage,
                status='active'
            )
            
            # Log de auditoria
            SignatureAuditLog.objects.create(
                organization=organization,
                certificate=digital_cert,
                action='certificate_uploaded',
                description=f'Certificado A1 carregado: {subject_name}',
                user=user,
                user_email=user.email,
                user_name=user.get_full_name() or user.username
            )
            
            return True, digital_cert
            
        except Exception as e:
            logger.error(f"Erro ao processar certificado A1: {str(e)}")
            return False, f"Erro ao processar certificado A1: {str(e)}"
    
    @staticmethod
    def _process_other_certificate(user, organization, cert_data, certificate_type):
        """Processa outros tipos de certificado"""
        try:
            # Para certificados A3, apenas armazenar informações públicas
            certificate = x509.load_pem_x509_certificate(cert_data)
            
            subject_name = certificate.subject.rfc4514_string()
            issuer_name = certificate.issuer.rfc4514_string()
            serial_number = str(certificate.serial_number)
            valid_from = certificate.not_valid_before
            valid_until = certificate.not_valid_after
            
            cert_pem = certificate.public_bytes(serialization.Encoding.PEM).decode()
            public_key_pem = certificate.public_key().public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ).decode()
            
            fingerprint = hashlib.sha256(certificate.public_bytes(serialization.Encoding.DER)).hexdigest()
            
            digital_cert = DigitalCertificate.objects.create(
                organization=organization,
                user=user,
                certificate_type=certificate_type,
                subject_name=subject_name,
                issuer_name=issuer_name,
                serial_number=serial_number,
                certificate_data=cert_pem,
                public_key=public_key_pem,
                valid_from=valid_from,
                valid_until=valid_until,
                fingerprint_sha256=fingerprint,
                status='active'
            )
            
            return True, digital_cert
            
        except Exception as e:
            logger.error(f"Erro ao processar certificado {certificate_type}: {str(e)}")
            return False, f"Erro ao processar certificado: {str(e)}"
    
    @staticmethod
    def verify_certificate(certificate: DigitalCertificate) -> Tuple[bool, str]:
        """Verifica a validade de um certificado"""
        try:
            # Verificações básicas
            now = timezone.now()
            
            if certificate.status == 'revoked':
                return False, "Certificado revogado"

            if certificate.status != 'active':
                return False, f"Certificado com status: {certificate.get_status_display()}"
            
            if now < certificate.valid_from:
                return False, "Certificado ainda não é válido"
            
            if now > certificate.valid_until:
                if certificate.status != 'expired':
                    certificate.status = 'expired'
                    certificate.save(update_fields=["status"])
                return False, "Certificado expirado"

            # Validar uso da chave
            if certificate.key_usage and "digital_signature" not in certificate.key_usage:
                return False, "Certificado não permite assinatura digital"

            # Verificar integridade do certificado
            try:
                x509.load_pem_x509_certificate(certificate.certificate_data.encode())
                return True, "Certificado válido"
            except Exception as e:
                return False, f"Erro na verificação do certificado: {str(e)}"
                
        except Exception as e:
            logger.error(f"Erro ao verificar certificado {certificate.id}: {str(e)}")
            return False, f"Erro na verificação: {str(e)}"


class SignatureService:
    """Serviço principal para assinaturas digitais"""
    
    @staticmethod
    def create_signature_request(
        organization, 
        document, 
        template, 
        title, 
        signers_data: List[Dict],
        created_by,
        **kwargs
    ) -> Tuple[bool, Any]:
        """
        Cria uma nova solicitação de assinatura
        """
        try:
            with transaction.atomic():
                # Criar solicitação
                signature_request = SignatureRequest.objects.create(
                    organization=organization,
                    document=document,
                    template=template,
                    title=title,
                    description=kwargs.get('description', ''),
                    priority=kwargs.get('priority', 'normal'),
                    expires_at=kwargs.get('expires_at'),
                    require_sequential_signing=kwargs.get('require_sequential_signing', False),
                    allow_decline=kwargs.get('allow_decline', True),
                    require_all_signatures=kwargs.get('require_all_signatures', True),
                    signing_reason=kwargs.get('signing_reason', ''),
                    signing_location=kwargs.get('signing_location', ''),
                    contact_info=kwargs.get('contact_info', ''),
                    created_by=created_by
                )
                
                # Adicionar assinantes
                for i, signer_data in enumerate(signers_data, 1):
                    signer = SignatureRequestSigner.objects.create(
                        signature_request=signature_request,
                        signer_type=signer_data.get('signer_type', 'email_only'),
                        user=signer_data.get('user'),
                        external_requester=signer_data.get('external_requester'),
                        email=signer_data['email'],
                        full_name=signer_data['full_name'],
                        phone=signer_data.get('phone', ''),
                        signing_order=signer_data.get('signing_order', i),
                        require_certificate=signer_data.get('require_certificate', True)
                    )
                    
                    # Gerar token de acesso para assinantes externos
                    if signer_data.get('signer_type') in ['external', 'email_only']:
                        signer.generate_access_token()
                
                # Log de auditoria
                SignatureAuditLog.objects.create(
                    organization=organization,
                    signature_request=signature_request,
                    action='request_created',
                    description=f'Solicitação de assinatura criada: {title}',
                    user=created_by,
                    user_email=created_by.email,
                    user_name=created_by.get_full_name() or created_by.username
                )
                
                return True, signature_request
                
        except Exception as e:
            logger.error(f"Erro ao criar solicitação de assinatura: {str(e)}")
            return False, f"Erro ao criar solicitação: {str(e)}"
    
    @staticmethod
    def submit_signature_request(signature_request: SignatureRequest, user) -> Tuple[bool, str]:
        """Submete uma solicitação de assinatura"""
        try:
            if signature_request.status != 'draft':
                return False, "Solicitação já foi submetida"
            
            # Verificar se há assinantes
            if not signature_request.signers.exists():
                return False, "Solicitação deve ter pelo menos um assinante"
            
            # Transição de estado
            signature_request.submit()
            signature_request.save()
            
            # Enviar notificações
            SignatureService._send_signature_notifications(signature_request)
            
            # Log de auditoria
            SignatureAuditLog.objects.create(
                organization=signature_request.organization,
                signature_request=signature_request,
                action='request_submitted',
                description=f'Solicitação submetida para assinatura',
                user=user,
                user_email=user.email,
                user_name=user.get_full_name() or user.username
            )
            
            return True, "Solicitação submetida com sucesso"
            
        except Exception as e:
            logger.error(f"Erro ao submeter solicitação {signature_request.id}: {str(e)}")
            return False, f"Erro ao submeter solicitação: {str(e)}"
    
    @staticmethod
    def _resolve_document_to_sign(signature_request):
        """Retorna o documento mais recente para assinar (suporta assinatura sequencial)"""
        # Verificar se já existem assinaturas válidas para pegar o documento resultante
        last_signature = signature_request.signatures.filter(status='valid').order_by('-signed_at').first()
        if last_signature:
            # Assinar a versão resultante da última assinatura
            return last_signature.document
        # Caso contrário, assinar o documento original
        return signature_request.document

    @staticmethod
    def _create_signed_version(original_document, signed_content, signer):
        """Cria uma nova versão do documento com a assinatura"""
        new_version_number = original_document.get_next_version_number()
        
        # Nome do arquivo: original_v2_signed.pdf
        base_name, ext = os.path.splitext(original_document.name)
        # Remove sufixos anteriores se existirem para evitar _v2_v3_v4
        import re
        base_name = re.sub(r'_v\d+.*$', '', base_name)
        new_filename = f"{base_name}_v{new_version_number}_signed{ext}"
        
        new_doc = Document.objects.create(
            name=new_filename,
            description=f"Versão {new_version_number} assinada por {signer.full_name}",
            file_size=len(signed_content),
            mime_type='application/pdf',
            prn=f"{original_document.prn}_v{new_version_number}", # Unique PRN
            version=new_version_number,
            is_current_version=True,
            parent_document=original_document,
            directory=original_document.directory,
            department=original_document.department,
            created_by=signer.user, # Pode ser None se externo
            status='processed'
        )
        
        # Salvar arquivo
        new_doc.file.save(new_filename, ContentFile(signed_content), save=True)
        
        # Atualizar flag is_current do pai e irmãos
        # Excluir o próprio documento recém-criado
        original_document.versions.exclude(id=new_doc.id).update(is_current_version=False)
        original_document.is_current_version = False
        original_document.save()
        
        return new_doc

    @staticmethod
    def _sign_pdf_pades(input_stream, private_key_pem, cert_pem, signer_id, reason=None, location=None):
        """Executa assinatura PAdES usando pyHanko"""
        if not PYHANKO_AVAILABLE:
            raise ImportError("pyHanko não está instalado.")

        # Carregar chaves
        cert = load_cert_from_pem(cert_pem.encode())
        key = load_private_key_from_pem(private_key_pem.encode())
        
        signer = signers.SimpleSigner(
            signing_cert=cert,
            signing_key=key,
            cert_registry=None
        )
        
        # Preparar output
        output = BytesIO()
        
        # Assinar
        pdf_signer.sign_pdf(
            IncrementalPdfFileWriter(input_stream),
            signers.PdfSignatureMetadata(
                field_name=f'Signature_{signer_id}',
                reason=reason,
                location=location,
                subfilter=SigSeedSubFilter.ADOBE_PKCS7_DETACHED
            ),
            signer=signer,
            output=output,
        )
        
        return output.getvalue()

    @staticmethod
    def sign_document(
        signature_request: SignatureRequest,
        signer: SignatureRequestSigner,
        certificate: DigitalCertificate,
        signature_data: str, # Mantido para compatibilidade, mas ignorado no fluxo backend
        **kwargs
    ) -> Tuple[bool, Any]:
        """
        Aplica assinatura digital a um documento
        """
        try:
            with transaction.atomic():
                # Verificar se pode assinar
                if signer.status not in ['pending', 'notified', 'viewed']:
                    return False, "Assinante não pode mais assinar este documento"
                
                # Verificar certificado
                cert_valid, cert_msg = CertificateService.verify_certificate(certificate)
                if not cert_valid:
                    return False, f"Certificado inválido: {cert_msg}"
                
                # Calcular hash do documento (simbólico aqui pois validaremos o PDF assinado depois)
                # documento alvo
                target_document = SignatureService._resolve_document_to_sign(signature_request)
                
                # Ler arquivo original
                try:
                    if not target_document.file:
                        return False, "Arquivo do documento não encontrado"
                        
                    input_stream = target_document.file.open('rb')
                except Exception as e:
                    return False, f"Erro ao abrir arquivo: {str(e)}"

                # Executar assinatura PAdES real
                try:
                    signed_content = SignatureService._sign_pdf_pades(
                        input_stream,
                        certificate.private_key, # Decrypted by field
                        certificate.certificate_data,
                        signer.id,
                        reason=kwargs.get('signing_reason'),
                        location=kwargs.get('signing_location')
                    )
                except Exception as e:
                    logger.error(f"Erro no pyHanko: {str(e)}")
                    # Fallback para simulação apenas se não crítico? Não, erro de assinatura é crítico.
                    return False, f"Falha na assinatura digital: {str(e)}"
                
                if not signed_content:
                    return False, "Falha ao gerar conteúdo assinado"

                # Criar NOVA VERSÃO do documento com o conteúdo assinado
                signed_document = SignatureService._create_signed_version(
                    target_document, 
                    signed_content, 
                    signer
                )
                
                # Calcular hash do NOVO documento
                document_hash = hashlib.sha256(signed_content).hexdigest()
                
                # Criar assinatura linkada ao NOVO documento
                document_signature = DocumentSignature.objects.create(
                    organization=signature_request.organization,
                    document=signed_document, # Link to the output document
                    signature_request=signature_request,
                    signer=signer,
                    certificate=certificate,
                    signature_type='digital',
                    signature_data='PAdES-Embedded', # Marker
                    hash_algorithm='SHA256',
                    document_hash=document_hash,
                    signing_reason=kwargs.get('signing_reason', ''),
                    signing_location=kwargs.get('signing_location', ''),
                    contact_info=kwargs.get('contact_info', ''),
                    ip_address=kwargs.get('ip_address'),
                    user_agent=kwargs.get('user_agent', ''),
                    geolocation=kwargs.get('geolocation', {})
                )
                
                # Atualizar status do assinante
                signer.sign()
                signer.save()
                
                # Atualizar certificado
                certificate.last_used_at = timezone.now()
                certificate.save()
                
                # Verificar se todas as assinaturas foram concluídas
                SignatureService._check_completion(signature_request)
                
                # Log de auditoria
                SignatureAuditLog.objects.create(
                    organization=signature_request.organization,
                    signature_request=signature_request,
                    document_signature=document_signature,
                    action='document_signed',
                    description=f'Documento assinado digitalmente por {signer.full_name} (versão {signed_document.version})',
                    user_email=signer.email,
                    user_name=signer.full_name,
                    ip_address=kwargs.get('ip_address'),
                    user_agent=kwargs.get('user_agent', '')
                )
                
                return True, document_signature
                
        except Exception as e:
            logger.error(f"Erro ao assinar documento: {str(e)}")
            return False, f"Erro ao assinar documento: {str(e)}"
    
    @staticmethod
    def verify_document_signature(document_signature: DocumentSignature) -> Tuple[bool, str]:
        """Verifica uma assinatura de documento"""
        try:
            # Verificar certificado
            cert_valid, cert_msg = CertificateService.verify_certificate(document_signature.certificate)
            if not cert_valid:
                document_signature.status = 'invalid'
                document_signature.save()
                return False, f"Certificado inválido: {cert_msg}"
            
            # Verificar hash do documento
            current_hash = SignatureService._calculate_document_hash(document_signature.document)
            if current_hash != document_signature.document_hash:
                document_signature.status = 'invalid'
                document_signature.save()
                return False, "Documento foi modificado após a assinatura"
            
            # Verificar assinatura digital
            if document_signature.signature_data == 'PAdES-Embedded':
                # Validação Robusta PAdES (com CRL/OCSP)
                if not document_signature.document.file:
                    return False, "Arquivo do documento não encontrado para validação"
                
                with document_signature.document.file.open('rb') as f:
                    content = f.read()
                    
                signature_valid, sig_msg = SignatureService._verify_pades_signature(content, document_signature.certificate)
                
                if not signature_valid:
                    document_signature.status = 'invalid'
                    document_signature.save()
                    return False, f"Assinatura PAdES inválida: {sig_msg}"
            else:
                # Validação Legada (Apenas hash criptográfico)
                signature_valid = SignatureService._verify_digital_signature(
                    document_signature.signature_data,
                    document_signature.document_hash,
                    document_signature.certificate
                )
                
                if not signature_valid:
                    document_signature.status = 'invalid'
                    document_signature.save()
                    return False, "Assinatura digital inválida"
            
            # Atualizar status
            document_signature.status = 'valid'
            document_signature.validated_at = timezone.now()
            document_signature.save()
            
            # Log de auditoria
            SignatureAuditLog.objects.create(
                organization=document_signature.organization,
                signature_request=document_signature.signature_request,
                document_signature=document_signature,
                action='signature_verified',
                description='Assinatura verificada com sucesso',
                user_email='system@ordoc.ai',
                user_name='Sistema'
            )
            
            return True, "Assinatura válida"
            
        except Exception as e:
            logger.error(f"Erro ao verificar assinatura {document_signature.id}: {str(e)}")
            return False, f"Erro na verificação: {str(e)}"
    
    @staticmethod
    def _calculate_document_hash(document) -> str:
        """Calcula hash SHA-256 do documento"""
        try:
            # Implementação específica dependeria do tipo de documento
            # Por enquanto, usar um hash simples baseado no conteúdo
            content = f"{document.name}_{document.file_size}_{document.created_at.isoformat()}"
            return hashlib.sha256(content.encode()).hexdigest()
        except Exception as e:
            logger.error(f"Erro ao calcular hash do documento: {str(e)}")
            return ""
    
    @staticmethod
    def _verify_pades_signature(signed_pdf_content: bytes, certificate: DigitalCertificate) -> Tuple[bool, str]:
        """
        Verifica a assinatura PAdES de forma robusta, incluindo integridade do PDF e revogação.
        """
        if not PYHANKO_AVAILABLE:
            return False, "pyHanko não instalado"

        try:
            from pyhanko.sign import validation
            from pyhanko.pdf_utils.reader import PdfFileReader
            from pyhanko_certvalidator import ValidationContext

            # Criar leitor PDF
            input_stream = BytesIO(signed_pdf_content)
            pdf_reader = PdfFileReader(input_stream)
            
            # Verificar assinaturas presentes
            if not pdf_reader.embedded_signatures:
                return False, "Nenhuma assinatura PAdES encontrada no PDF"

            # Validar última assinatura
            sig_status = validation.validate_pdf_signature(
                pdf_reader.embedded_signatures[-1],
                validation_context=ValidationContext(allow_fetching=True) # Habilita CRL/OCSP online
            )
            
            # Verificar integridade e confiança
            if not sig_status.intact:
                return False, "Integridade do documento comprometida (hash mismatch)"
            
            if not sig_status.valid:
                return False, f"Assinatura inválida: {sig_status.summary()}"
                
            if sig_status.revoked:
                return False, "Certificado revogado (verificado via CRL/OCSP)"
            
            # Verificação extra: match com o certificado esperado
            signer_cert = sig_status.signing_cert
            stored_cert = x509.load_pem_x509_certificate(certificate.certificate_data.encode())
            
            if signer_cert.public_bytes(serialization.Encoding.DER) != stored_cert.public_bytes(serialization.Encoding.DER):
                return False, "Assinatura válida mas não corresponde ao certificado informado"

            return True, "Assinatura PAdES válida e verificada"

        except Exception as e:
            logger.error(f"Erro na validação PAdES robusta: {str(e)}")
            return False, f"Erro na validação PAdES: {str(e)}"

    @staticmethod
    def _verify_digital_signature(signature_data: str, document_hash: str, certificate: DigitalCertificate) -> bool:
        """
        [DEPRECATED] Mantido apenas para assinaturas legadas não-PAdES.
        Use _verify_pades_signature para novos documentos.
        """
        try:
            # Decodificar dados da assinatura
            signature_bytes = base64.b64decode(signature_data)
            
            # Carregar chave pública do certificado
            cert = x509.load_pem_x509_certificate(certificate.certificate_data.encode())
            public_key = cert.public_key()
            
            # Verificar assinatura
            public_key.verify(
                signature_bytes,
                document_hash.encode(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            
            return True
            
        except InvalidSignature:
            return False
        except Exception as e:
            logger.error(f"Erro ao verificar assinatura digital: {str(e)}")
            return False
    
    @staticmethod
    def _send_signature_notifications(signature_request: SignatureRequest):
        """Envia notificações para os assinantes"""
        try:
            for signer in signature_request.signers.filter(status='pending'):
                # Enviar email de notificação
                subject = f"Solicitação de Assinatura: {signature_request.title}"
                
                context = {
                    'signer': signer,
                    'signature_request': signature_request,
                    'document': signature_request.document,
                    'access_url': f"{settings.FRONTEND_URL}/sign/{signer.access_token}"
                }
                
                message = render_to_string('ordoc_sign/signature_notification.html', context)
                
                send_mail(
                    subject=subject,
                    message='',
                    html_message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[signer.email],
                    fail_silently=False
                )
                
                # Atualizar status do assinante
                signer.notify()
                signer.save()
                
                # Log de auditoria
                SignatureAuditLog.objects.create(
                    organization=signature_request.organization,
                    signature_request=signature_request,
                    action='signer_notified',
                    description=f'Assinante notificado: {signer.email}',
                    user_email='system@ordoc.ai',
                    user_name='Sistema'
                )
                
        except Exception as e:
            logger.error(f"Erro ao enviar notificações: {str(e)}")
    
    @staticmethod
    def _check_completion(signature_request: SignatureRequest):
        """Verifica se a solicitação de assinatura foi concluída"""
        try:
            total_signers = signature_request.signers.count()
            signed_signers = signature_request.signers.filter(status='signed').count()
            
            if signature_request.require_all_signatures:
                # Todas as assinaturas são obrigatórias
                if signed_signers == total_signers:
                    signature_request.complete()
                    signature_request.save()
                    
                    # Log de auditoria
                    SignatureAuditLog.objects.create(
                        organization=signature_request.organization,
                        signature_request=signature_request,
                        action='request_completed',
                        description='Solicitação de assinatura concluída',
                        user_email='system@ordoc.ai',
                        user_name='Sistema'
                    )
            else:
                # Pelo menos uma assinatura é suficiente
                if signed_signers > 0:
                    signature_request.complete()
                    signature_request.save()
                    
        except Exception as e:
            logger.error(f"Erro ao verificar conclusão da solicitação: {str(e)}")


class SignatureBatchService:
    """Serviço para processamento em lote de assinaturas"""
    
    @staticmethod
    def create_signature_batch(
        organization,
        name: str,
        template: SignatureTemplate,
        documents: List,
        signers_data: List[Dict],
        created_by,
        **kwargs
    ) -> Tuple[bool, Any]:
        """Cria um lote de assinaturas"""
        try:
            with transaction.atomic():
                # Criar lote
                batch = SignatureBatch.objects.create(
                    organization=organization,
                    name=name,
                    description=kwargs.get('description', ''),
                    template=template,
                    total_documents=len(documents),
                    auto_send_notifications=kwargs.get('auto_send_notifications', True),
                    expires_at=kwargs.get('expires_at'),
                    created_by=created_by
                )
                
                # Adicionar documentos
                batch.documents.set(documents)
                
                # Criar solicitações individuais para cada documento
                for document in documents:
                    success, signature_request = SignatureService.create_signature_request(
                        organization=organization,
                        document=document,
                        template=template,
                        title=f"{name} - {document.name}",
                        signers_data=signers_data,
                        created_by=created_by,
                        **kwargs
                    )
                    
                    if success and batch.auto_send_notifications:
                        SignatureService.submit_signature_request(signature_request, created_by)
                
                return True, batch
                
        except Exception as e:
            logger.error(f"Erro ao criar lote de assinaturas: {str(e)}")
            return False, f"Erro ao criar lote: {str(e)}"
    
    @staticmethod
    def process_signature_batch(batch: SignatureBatch) -> Tuple[bool, str]:
        """Processa um lote de assinaturas"""
        try:
            if batch.status != 'pending':
                return False, "Lote já foi processado"
            
            batch.start_processing()
            batch.save()
            
            # Processar cada documento do lote
            for document in batch.documents.all():
                try:
                    # Buscar solicitação de assinatura para este documento
                    signature_requests = document.signature_requests.filter(
                        title__startswith=batch.name
                    )
                    
                    for signature_request in signature_requests:
                        if signature_request.status == 'draft':
                            SignatureService.submit_signature_request(
                                signature_request, 
                                batch.created_by
                            )
                    
                    batch.processed_documents += 1
                    batch.save()
                    
                except Exception as e:
                    logger.error(f"Erro ao processar documento {document.id} no lote: {str(e)}")
                    batch.failed_signatures += 1
                    batch.save()
            
            # Finalizar lote
            batch.complete()
            batch.save()
            
            return True, "Lote processado com sucesso"
            
        except Exception as e:
            logger.error(f"Erro ao processar lote {batch.id}: {str(e)}")
            batch.fail()
            batch.save()
            return False, f"Erro ao processar lote: {str(e)}"


class SignatureReportService:
    """Serviço para relatórios de assinaturas"""
    
    @staticmethod
    def generate_signature_statistics(organization, start_date=None, end_date=None) -> Dict:
        """Gera estatísticas de assinaturas"""
        try:
            from django.db.models import Count, Q
            from datetime import datetime, timedelta
            
            if not start_date:
                start_date = timezone.now() - timedelta(days=30)
            if not end_date:
                end_date = timezone.now()
            
            # Estatísticas básicas
            total_requests = SignatureRequest.objects.filter(
                organization=organization,
                created_at__range=[start_date, end_date]
            ).count()
            
            completed_requests = SignatureRequest.objects.filter(
                organization=organization,
                created_at__range=[start_date, end_date],
                status='completed'
            ).count()
            
            pending_requests = SignatureRequest.objects.filter(
                organization=organization,
                status__in=['pending', 'in_progress']
            ).count()
            
            total_signatures = DocumentSignature.objects.filter(
                organization=organization,
                signed_at__range=[start_date, end_date]
            ).count()
            
            # Estatísticas por status
            status_stats = SignatureRequest.objects.filter(
                organization=organization,
                created_at__range=[start_date, end_date]
            ).values('status').annotate(count=Count('id'))
            
            # Certificados mais utilizados
            cert_stats = DocumentSignature.objects.filter(
                organization=organization,
                signed_at__range=[start_date, end_date]
            ).values(
                'certificate__subject_name',
                'certificate__certificate_type'
            ).annotate(count=Count('id')).order_by('-count')[:10]
            
            return {
                'period': {
                    'start_date': start_date,
                    'end_date': end_date
                },
                'summary': {
                    'total_requests': total_requests,
                    'completed_requests': completed_requests,
                    'pending_requests': pending_requests,
                    'total_signatures': total_signatures,
                    'completion_rate': (completed_requests / total_requests * 100) if total_requests > 0 else 0
                },
                'status_distribution': {item['status']: item['count'] for item in status_stats},
                'top_certificates': list(cert_stats),
                'generated_at': timezone.now()
            }
            
        except Exception as e:
            logger.error(f"Erro ao gerar estatísticas de assinatura: {str(e)}")
            return {}
