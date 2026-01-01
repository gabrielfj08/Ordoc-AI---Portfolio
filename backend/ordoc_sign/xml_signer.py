"""
Módulo para assinatura XML de documentos fiscais (NF-e, NFC-e, CT-e)
Implementa padrão XML-DSig conforme especificação SEFAZ
"""

import hashlib
import base64
from typing import Tuple, Optional
from lxml import etree
from signxml import XMLSigner, XMLVerifier, methods
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import logging

logger = logging.getLogger(__name__)


class NFeSigner:
    """
    Assinador de XML para documentos fiscais eletrônicos
    Suporta: NF-e, NFC-e, CT-e, MDF-e
    """
    
    # Namespaces padrão SEFAZ
    NAMESPACES = {
        'nfe': 'http://www.portalfiscal.inf.br/nfe',
        'ds': 'http://www.w3.org/2000/09/xmldsig#'
    }
    
    @staticmethod
    def sign_nfe(
        xml_content: str,
        certificate_pem: str,
        private_key_pem: str,
        reference_uri: str = ''
    ) -> Tuple[bool, str]:
        """
        Assina XML de NF-e com certificado digital A1
        
        Args:
            xml_content: XML da NF-e (string)
            certificate_pem: Certificado em formato PEM
            private_key_pem: Chave privada em formato PEM
            reference_uri: URI de referência (geralmente ID da NFe)
            
        Returns:
            Tuple[bool, str]: (sucesso, xml_assinado ou mensagem_erro)
        """
        try:
            # Parse XML
            root = etree.fromstring(xml_content.encode('utf-8'))
            
            # Carregar certificado e chave
            cert = x509.load_pem_x509_certificate(certificate_pem.encode())
            key = serialization.load_pem_private_key(
                private_key_pem.encode(),
                password=None
            )
            
            # Configurar assinador
            signer = XMLSigner(
                method=methods.enveloped,
                signature_algorithm='rsa-sha256',
                digest_algorithm='sha256',
                c14n_algorithm='http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
            )
            
            # Assinar XML
            signed_root = signer.sign(
                root,
                key=key,
                cert=cert,
                reference_uri=reference_uri
            )
            
            # Converter de volta para string
            signed_xml = etree.tostring(
                signed_root,
                encoding='unicode',
                pretty_print=True
            )
            
            logger.info(f"XML assinado com sucesso. Referência: {reference_uri}")
            return True, signed_xml
            
        except Exception as e:
            error_msg = f"Erro ao assinar XML: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
    
    @staticmethod
    def verify_nfe(signed_xml: str) -> Tuple[bool, str]:
        """
        Verifica assinatura de XML de NF-e
        
        Args:
            signed_xml: XML assinado (string)
            
        Returns:
            Tuple[bool, str]: (válido, mensagem)
        """
        try:
            # Parse XML
            root = etree.fromstring(signed_xml.encode('utf-8'))
            
            # Verificar assinatura
            verifier = XMLVerifier()
            verified_data = verifier.verify(root)
            
            # Extrair informações do certificado
            cert_info = verified_data.signed_xml
            
            logger.info("Assinatura XML verificada com sucesso")
            return True, "Assinatura válida"
            
        except Exception as e:
            error_msg = f"Assinatura inválida: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
    
    @staticmethod
    def extract_signature_info(signed_xml: str) -> Optional[dict]:
        """
        Extrai informações da assinatura digital do XML
        
        Args:
            signed_xml: XML assinado
            
        Returns:
            dict: Informações da assinatura (certificado, data, etc.)
        """
        try:
            root = etree.fromstring(signed_xml.encode('utf-8'))
            
            # Buscar elemento Signature
            signature = root.find('.//ds:Signature', namespaces=NFeSigner.NAMESPACES)
            if signature is None:
                return None
            
            # Extrair informações
            info = {
                'signature_method': None,
                'digest_value': None,
                'signature_value': None,
                'certificate': None
            }
            
            # Método de assinatura
            sig_method = signature.find('.//ds:SignatureMethod', namespaces=NFeSigner.NAMESPACES)
            if sig_method is not None:
                info['signature_method'] = sig_method.get('Algorithm')
            
            # Digest
            digest_value = signature.find('.//ds:DigestValue', namespaces=NFeSigner.NAMESPACES)
            if digest_value is not None:
                info['digest_value'] = digest_value.text
            
            # Valor da assinatura
            sig_value = signature.find('.//ds:SignatureValue', namespaces=NFeSigner.NAMESPACES)
            if sig_value is not None:
                info['signature_value'] = sig_value.text
            
            # Certificado
            cert_data = signature.find('.//ds:X509Certificate', namespaces=NFeSigner.NAMESPACES)
            if cert_data is not None:
                info['certificate'] = cert_data.text
            
            return info
            
        except Exception as e:
            logger.error(f"Erro ao extrair informações da assinatura: {str(e)}")
            return None
    
    @staticmethod
    def calculate_digest(xml_content: str) -> str:
        """
        Calcula digest SHA-256 do XML (usado para validação)
        
        Args:
            xml_content: Conteúdo XML
            
        Returns:
            str: Digest em base64
        """
        digest = hashlib.sha256(xml_content.encode('utf-8')).digest()
        return base64.b64encode(digest).decode('utf-8')


class CTeSigner(NFeSigner):
    """
    Assinador específico para CT-e (Conhecimento de Transporte Eletrônico)
    Herda de NFeSigner com ajustes específicos
    """
    
    NAMESPACES = {
        'cte': 'http://www.portalfiscal.inf.br/cte',
        'ds': 'http://www.w3.org/2000/09/xmldsig#'
    }


class MDFeSigner(NFeSigner):
    """
    Assinador específico para MDF-e (Manifesto de Documentos Fiscais Eletrônicos)
    """
    
    NAMESPACES = {
        'mdfe': 'http://www.portalfiscal.inf.br/mdfe',
        'ds': 'http://www.w3.org/2000/09/xmldsig#'
    }
