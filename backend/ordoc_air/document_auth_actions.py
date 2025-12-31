"""
Actions para DocumentViewSet - Integração com Certificados e SEFAZ
Adicionar ao arquivo ordoc_air/views.py no DocumentViewSet
"""

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from lxml import etree
import logging

from ordoc_sign.models import DigitalCertificate, DocumentSignature
from ordoc_sign.services import SignatureService, CertificateService
from ordoc_sign.xml_signer import NFeSigner
from ordoc_sign.sefaz_nfe_client import SefazNFeClient
from ordoc_sign.nfse_nacional_client import NFSeNacionalClient
from .document_auth_serializers import (
    DocumentSignRequestSerializer,
    DocumentSignatureSerializer,
    NFeValidationRequestSerializer,
    NFeValidationResponseSerializer,
    NFSeValidationRequestSerializer,
    CertificateUploadSerializer,
    CertificateSerializer
)

logger = logging.getLogger(__name__)


# ========== ADICIONAR ESTAS ACTIONS AO DocumentViewSet ==========

@action(detail=True, methods=['post'])
def sign_document(self, request, pk=None):
    """
    Assina documento digitalmente com certificado A1
    
    POST /api/v1/ordoc-air/documents/{id}/sign_document/
    Body: {
        "certificate_id": "uuid",
        "signature_reason": "Aprovação do documento",
        "signature_location": "São Paulo, SP",
        "contact_info": "contato@empresa.com"
    }
    """
    document = self.get_object()
    serializer = DocumentSignRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Obter certificado
        certificate = DigitalCertificate.objects.get(
            id=serializer.validated_data['certificate_id'],
            user=request.user,
            organization=self.get_current_organization()
        )
        
        # Verificar validade do certificado
        cert_valid, cert_msg = CertificateService.verify_certificate(certificate)
        if not cert_valid:
            return Response(
                {'error': f'Certificado inválido: {cert_msg}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar se documento tem arquivo
        if not document.file:
            return Response(
                {'error': 'Documento não possui arquivo para assinar'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Assinar documento (PDF)
        from ordoc_sign.services import SignatureService
        from io import BytesIO
        
        # Ler arquivo
        with document.file.open('rb') as f:
            pdf_content = f.read()
        
        # Assinar com pyHanko
        signed_content = SignatureService._sign_pdf_pades(
            BytesIO(pdf_content),
            certificate.private_key,
            certificate.certificate_data,
            str(document.id),
            reason=serializer.validated_data.get('signature_reason'),
            location=serializer.validated_data.get('signature_location')
        )
        
        # Criar nova versão do documento com assinatura
        from django.core.files.base import ContentFile
        import os
        
        new_version = document.version + 1
        base_name, ext = os.path.splitext(document.name)
        new_filename = f"{base_name}_v{new_version}_signed{ext}"
        
        # Criar novo documento (versão assinada)
        from ordoc_air.models import Document
        signed_doc = Document.objects.create(
            name=new_filename,
            description=f"Versão {new_version} assinada digitalmente",
            file_size=len(signed_content),
            mime_type='application/pdf',
            prn=f"{document.prn}_v{new_version}",
            version=new_version,
            is_current_version=True,
            parent_document=document,
            directory=document.directory,
            department=document.department,
            created_by=request.user,
            status='processed'
        )
        
        # Salvar arquivo assinado
        signed_doc.file.save(new_filename, ContentFile(signed_content), save=True)
        
        # Marcar versão anterior como não atual
        document.is_current_version = False
        document.save()
        
        # Registrar assinatura
        import hashlib
        doc_signature = DocumentSignature.objects.create(
            organization=self.get_current_organization(),
            document=signed_doc,
            certificate=certificate,
            signature_type='digital',
            signature_data='PAdES-Embedded',
            hash_algorithm='SHA256',
            document_hash=hashlib.sha256(signed_content).hexdigest(),
            signing_reason=serializer.validated_data.get('signature_reason', ''),
            signing_location=serializer.validated_data.get('signature_location', ''),
            contact_info=serializer.validated_data.get('contact_info', ''),
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Atualizar último uso do certificado
        certificate.last_used_at = timezone.now()
        certificate.save()
        
        return Response({
            'success': True,
            'message': 'Documento assinado com sucesso',
            'signed_document_id': str(signed_doc.id),
            'signature_id': str(doc_signature.id),
            'version': new_version
        }, status=status.HTTP_200_OK)
        
    except DigitalCertificate.DoesNotExist:
        return Response(
            {'error': 'Certificado não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Erro ao assinar documento: {str(e)}")
        return Response(
            {'error': f'Erro ao assinar documento: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@action(detail=True, methods=['post'])
def validate_nfe(self, request, pk=None):
    """
    Valida NF-e contra SEFAZ
    
    POST /api/v1/ordoc-air/documents/{id}/validate_nfe/
    Body: {
        "chave_acesso": "35250112345678000190550010000000011234567890"
    }
    """
    document = self.get_object()
    serializer = NFeValidationRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        chave_acesso = serializer.validated_data['chave_acesso']
        
        # Determinar UF pela chave de acesso (primeiros 2 dígitos)
        uf_code = chave_acesso[:2]
        uf_map = {
            '35': 'SP',
            '33': 'RJ',
            '31': 'MG',
            '43': 'RS',
            '41': 'PR',
            '42': 'SC'
        }
        uf = uf_map.get(uf_code, 'SVRS')
        
        # Criar cliente SEFAZ
        client = SefazNFeClient(
            uf=uf,
            ambiente='producao'  # Usar produção para validação
        )
        
        # Consultar NF-e
        success, nfe_xml = client.consultar_nfe(chave_acesso)
        
        if success:
            # Parsear XML da resposta
            root = etree.fromstring(nfe_xml.encode())
            
            # Extrair informações
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            
            if c_stat == '100':  # Autorizada
                # Extrair dados da NF-e
                inf_nfe = root.find('.//{http://www.portalfiscal.inf.br/nfe}infNFe')
                emit = inf_nfe.find('.//{http://www.portalfiscal.inf.br/nfe}emit')
                dest = inf_nfe.find('.//{http://www.portalfiscal.inf.br/nfe}dest')
                total = inf_nfe.find('.//{http://www.portalfiscal.inf.br/nfe}total')
                
                response_data = {
                    'valid': True,
                    'chave_acesso': chave_acesso,
                    'status': 'Autorizada',
                    'emitente': {
                        'cnpj': emit.find('.//{http://www.portalfiscal.inf.br/nfe}CNPJ').text,
                        'nome': emit.find('.//{http://www.portalfiscal.inf.br/nfe}xNome').text
                    },
                    'destinatario': {
                        'cnpj': dest.find('.//{http://www.portalfiscal.inf.br/nfe}CNPJ').text if dest.find('.//{http://www.portalfiscal.inf.br/nfe}CNPJ') is not None else None,
                        'nome': dest.find('.//{http://www.portalfiscal.inf.br/nfe}xNome').text
                    },
                    'valor_total': total.find('.//{http://www.portalfiscal.inf.br/nfe}vNF').text,
                    'protocolo': root.find('.//{http://www.portalfiscal.inf.br/nfe}nProt').text
                }
                
                # Adicionar metadados ao documento
                document.description = f"{document.description}\n\n[VALIDADO SEFAZ] NF-e {chave_acesso} - Autorizada"
                document.save()
                
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                x_motivo = root.find('.//{http://www.portalfiscal.inf.br/nfe}xMotivo').text
                return Response({
                    'valid': False,
                    'chave_acesso': chave_acesso,
                    'status': c_stat,
                    'message': x_motivo
                }, status=status.HTTP_200_OK)
        else:
            return Response({
                'valid': False,
                'chave_acesso': chave_acesso,
                'message': 'Erro ao consultar SEFAZ'
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        logger.error(f"Erro ao validar NF-e: {str(e)}")
        return Response(
            {'error': f'Erro ao validar NF-e: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@action(detail=True, methods=['post'])
def validate_nfse(self, request, pk=None):
    """
    Valida NFS-e contra Sistema Nacional
    
    POST /api/v1/ordoc-air/documents/{id}/validate_nfse/
    Body: {
        "chave_acesso": "35250112345678000190550010000000011234567890",
        "codigo_municipio": "3550308"
    }
    """
    document = self.get_object()
    serializer = NFSeValidationRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        chave_acesso = serializer.validated_data['chave_acesso']
        
        # Criar cliente NFS-e Nacional
        client = NFSeNacionalClient(ambiente='producao')
        
        # Consultar NFS-e
        success, nfse_xml = client.consultar_nfse(chave_acesso)
        
        if success:
            # Adicionar metadados ao documento
            document.description = f"{document.description}\n\n[VALIDADO SEFIN] NFS-e {chave_acesso} - Válida"
            document.save()
            
            return Response({
                'valid': True,
                'chave_acesso': chave_acesso,
                'status': 'Válida',
                'message': 'NFS-e encontrada e validada no Sistema Nacional'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'valid': False,
                'chave_acesso': chave_acesso,
                'message': 'NFS-e não encontrada ou inválida'
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        logger.error(f"Erro ao validar NFS-e: {str(e)}")
        return Response(
            {'error': f'Erro ao validar NFS-e: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@action(detail=True, methods=['get'])
def signatures(self, request, pk=None):
    """
    Lista todas as assinaturas de um documento
    
    GET /api/v1/ordoc-air/documents/{id}/signatures/
    """
    document = self.get_object()
    
    # Buscar assinaturas do documento e suas versões
    from ordoc_sign.models import DocumentSignature
    
    signatures = DocumentSignature.objects.filter(
        document__in=[document] + list(document.versions.all())
    ).select_related('certificate', 'signer').order_by('-signed_at')
    
    serializer = DocumentSignatureSerializer(signatures, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@action(detail=False, methods=['post'])
def upload_certificate(self, request):
    """
    Upload de certificado digital A1
    
    POST /api/v1/ordoc-air/documents/upload_certificate/
    Body (multipart/form-data): {
        "certificate_file": <file>,
        "password": "senha123",
        "certificate_type": "A1",
        "is_default": false
    }
    """
    serializer = CertificateUploadSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        certificate_file = serializer.validated_data['certificate_file']
        password = serializer.validated_data['password']
        cert_type = serializer.validated_data['certificate_type']
        
        # Processar certificado
        success, result = CertificateService.upload_certificate(
            user=request.user,
            organization=self.get_current_organization(),
            certificate_file=certificate_file,
            password=password,
            certificate_type=cert_type
        )
        
        if success:
            certificate = result
            
            # Definir como padrão se solicitado
            if serializer.validated_data.get('is_default'):
                # Remover padrão de outros certificados
                DigitalCertificate.objects.filter(
                    user=request.user,
                    organization=self.get_current_organization()
                ).update(is_default=False)
                
                certificate.is_default = True
                certificate.save()
            
            cert_serializer = CertificateSerializer(certificate)
            
            return Response({
                'success': True,
                'message': 'Certificado carregado com sucesso',
                'certificate': cert_serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': result
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Erro ao fazer upload de certificado: {str(e)}")
        return Response(
            {'error': f'Erro ao processar certificado: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@action(detail=False, methods=['get'])
def my_certificates(self, request):
    """
    Lista certificados do usuário
    
    GET /api/v1/ordoc-air/documents/my_certificates/
    """
    certificates = DigitalCertificate.objects.filter(
        user=request.user,
        organization=self.get_current_organization()
    ).order_by('-is_default', '-created_at')
    
    serializer = CertificateSerializer(certificates, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
