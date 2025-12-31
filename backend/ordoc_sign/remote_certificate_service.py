"""
Serviço para integração com certificados A3 em nuvem (Cloud Certificate)
Suporta provedores: Certisign, Serasa, Valid
"""

import requests
import hashlib
import base64
from typing import Tuple, Optional, Dict, Any
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


class RemoteCertificateService:
    """
    Integração com serviços de certificado A3 em nuvem
    Permite assinatura sem necessidade de hardware local
    """
    
    # URLs base dos provedores
    PROVIDERS = {
        'certisign': {
            'base_url': 'https://api.certisign.com.br/v1',
            'auth_endpoint': '/auth/token',
            'sign_endpoint': '/sign/document',
            'verify_endpoint': '/verify/signature'
        },
        'serasa': {
            'base_url': 'https://api.serasa.com.br/certificado',
            'auth_endpoint': '/oauth/token',
            'sign_endpoint': '/assinatura/assinar',
            'verify_endpoint': '/assinatura/verificar'
        },
        'valid': {
            'base_url': 'https://api.valid.com.br/cloud-cert',
            'auth_endpoint': '/v1/auth',
            'sign_endpoint': '/v1/sign',
            'verify_endpoint': '/v1/verify'
        }
    }
    
    @staticmethod
    def get_provider_config(provider: str) -> Optional[Dict]:
        """Retorna configuração do provedor"""
        return RemoteCertificateService.PROVIDERS.get(provider.lower())
    
    @staticmethod
    def authenticate(provider: str, credentials: Dict[str, str]) -> Tuple[bool, Optional[str]]:
        """
        Autentica com o provedor de certificado cloud
        
        Args:
            provider: Nome do provedor (certisign, serasa, valid)
            credentials: Credenciais (api_key, api_secret, etc.)
            
        Returns:
            Tuple[bool, Optional[str]]: (sucesso, access_token)
        """
        try:
            config = RemoteCertificateService.get_provider_config(provider)
            if not config:
                return False, None
            
            # Verificar cache
            cache_key = f"remote_cert_token_{provider}_{credentials.get('api_key', '')}"
            cached_token = cache.get(cache_key)
            if cached_token:
                logger.info(f"Token em cache para {provider}")
                return True, cached_token
            
            # Autenticar
            auth_url = config['base_url'] + config['auth_endpoint']
            
            response = requests.post(
                auth_url,
                json=credentials,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                access_token = data.get('access_token') or data.get('token')
                
                # Cachear token (geralmente válido por 1h)
                cache.set(cache_key, access_token, timeout=3000)
                
                logger.info(f"Autenticação bem-sucedida com {provider}")
                return True, access_token
            else:
                logger.error(f"Falha na autenticação com {provider}: {response.status_code}")
                return False, None
                
        except Exception as e:
            logger.error(f"Erro ao autenticar com {provider}: {str(e)}")
            return False, None
    
    @staticmethod
    def sign_with_remote_a3(
        provider: str,
        access_token: str,
        document_hash: str,
        certificate_id: str,
        **kwargs
    ) -> Tuple[bool, Optional[str]]:
        """
        Assina documento usando certificado A3 remoto
        
        Args:
            provider: Nome do provedor
            access_token: Token de autenticação
            document_hash: Hash SHA-256 do documento
            certificate_id: ID do certificado no provedor
            **kwargs: Parâmetros adicionais (reason, location, etc.)
            
        Returns:
            Tuple[bool, Optional[str]]: (sucesso, assinatura_base64)
        """
        try:
            config = RemoteCertificateService.get_provider_config(provider)
            if not config:
                return False, None
            
            sign_url = config['base_url'] + config['sign_endpoint']
            
            # Preparar payload (formato varia por provedor)
            payload = {
                'certificate_id': certificate_id,
                'document_hash': document_hash,
                'hash_algorithm': 'SHA256',
                'reason': kwargs.get('reason', 'Assinatura Digital'),
                'location': kwargs.get('location', ''),
                'contact': kwargs.get('contact', '')
            }
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                sign_url,
                json=payload,
                headers=headers,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                signature = data.get('signature') or data.get('assinatura')
                
                logger.info(f"Documento assinado com sucesso via {provider}")
                return True, signature
            else:
                logger.error(f"Falha na assinatura via {provider}: {response.status_code}")
                return False, None
                
        except Exception as e:
            logger.error(f"Erro ao assinar via {provider}: {str(e)}")
            return False, None
    
    @staticmethod
    def verify_remote_signature(
        provider: str,
        access_token: str,
        document_hash: str,
        signature: str
    ) -> Tuple[bool, str]:
        """
        Verifica assinatura usando serviço remoto
        
        Args:
            provider: Nome do provedor
            access_token: Token de autenticação
            document_hash: Hash do documento
            signature: Assinatura a verificar
            
        Returns:
            Tuple[bool, str]: (válida, mensagem)
        """
        try:
            config = RemoteCertificateService.get_provider_config(provider)
            if not config:
                return False, "Provedor não configurado"
            
            verify_url = config['base_url'] + config['verify_endpoint']
            
            payload = {
                'document_hash': document_hash,
                'signature': signature,
                'hash_algorithm': 'SHA256'
            }
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                verify_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                is_valid = data.get('valid') or data.get('valida')
                
                if is_valid:
                    return True, "Assinatura válida"
                else:
                    return False, data.get('message', 'Assinatura inválida')
            else:
                return False, f"Erro na verificação: {response.status_code}"
                
        except Exception as e:
            logger.error(f"Erro ao verificar assinatura via {provider}: {str(e)}")
            return False, f"Erro na verificação: {str(e)}"
    
    @staticmethod
    def list_certificates(
        provider: str,
        access_token: str,
        user_id: str
    ) -> Tuple[bool, list]:
        """
        Lista certificados disponíveis para um usuário
        
        Args:
            provider: Nome do provedor
            access_token: Token de autenticação
            user_id: ID do usuário no provedor
            
        Returns:
            Tuple[bool, list]: (sucesso, lista_certificados)
        """
        try:
            config = RemoteCertificateService.get_provider_config(provider)
            if not config:
                return False, []
            
            # Endpoint varia por provedor
            list_url = f"{config['base_url']}/certificates/user/{user_id}"
            
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            
            response = requests.get(
                list_url,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                certificates = data.get('certificates', [])
                return True, certificates
            else:
                return False, []
                
        except Exception as e:
            logger.error(f"Erro ao listar certificados via {provider}: {str(e)}")
            return False, []
