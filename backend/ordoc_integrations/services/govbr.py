"""
Serviço de Integração Gov.br (Login Único)
"""
import base64
from typing import Dict, Any, Optional
from urllib.parse import urlencode

from django.conf import settings
from ordoc_integrations.services.base import BaseIntegrationService, IntegrationException

class GovBrService(BaseIntegrationService):
    """
    Integração com OAuth 2.0 / OpenID Connect do Gov.br
    
    Responsável pelo fluxo de autenticação e obtenção de dados do cidadão.
    """
    
    # Endpoints relativos (Base URL definida no banco)
    # Staging: https://sso.staging.acesso.gov.br
    # Production: https://sso.acesso.gov.br
    AUTHORIZE_ENDPOINT = '/authorize'
    TOKEN_ENDPOINT = '/token'
    USERINFO_ENDPOINT = '/userinfo'
    
    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """Inicializa serviço Gov.br"""
        super().__init__('govbr', organization_id, user_id)
        
        # Carregar credenciais (do banco ou settings como fallback)
        self.client_id = self.service_config.credentials.get('client_id')
        self.client_secret = self.service_config.credentials.get('client_secret')
        self.redirect_uri = self.service_config.config.get('redirect_uri')
        
        # Fallbacks para desenvolvimento local (se configurado no settings.py)
        if not self.client_id:
            self.client_id = getattr(settings, 'GOVBR_CLIENT_ID', None)
        if not self.client_secret:
            self.client_secret = getattr(settings, 'GOVBR_CLIENT_SECRET', None)
        if not self.redirect_uri:
            self.redirect_uri = getattr(settings, 'GOVBR_REDIRECT_URI', 'http://localhost:3000/api/auth/govbr/callback')
        
        # Scopes padrão: openid email profile phone cpf
        # profile: nome, foto
        # cpf: cpf
        self.scopes = self.service_config.config.get('scopes', 'openid email profile phone cpf')

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida identificador. No caso de OAuth, não validamos input inicial,
        mas podemos usar para validar CPF se necessário.
        """
        return True

    def _make_request(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Implementação genérica para chamadas de API via execute()
        Pode ser usado para chamadas futuras de dados específicos
        """
        # Exemplo: Consultar nível da conta (se houver endpoint específico)
        pass

    def get_authorization_url(self, state: str, nonce: str) -> str:
        """
        Gera URL para redirecionar usuário para login Gov.br
        
        Args:
            state: String aleatória para proteção CSRF
            nonce: String aleatória para proteção de replay
            
        Returns:
            URL completa de autorização
        """
        if not self.client_id or not self.redirect_uri:
            raise IntegrationException("Credenciais Gov.br (client_id, redirect_uri) não configuradas")

        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'scope': self.scopes,
            'redirect_uri': self.redirect_uri,
            'state': state,
            'nonce': nonce,
            # 'govbr_cor': 'azul', # Opcional: Customização visual
        }
        return f"{self.base_url}{self.AUTHORIZE_ENDPOINT}?{urlencode(params)}"

    def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """
        Troca authorization code por tokens (Access Token + ID Token)
        
        Args:
            code: Authorization code recebido no callback
            
        Returns:
            Dict com tokens (access_token, id_token, expires_in, etc)
        """
        if not self.client_secret:
            raise IntegrationException("Client Secret Gov.br não configurado")

        # Basic Auth com Client ID e Client Secret
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_header = base64.b64encode(auth_string.encode()).decode()
        
        headers = {
            'Authorization': f"Basic {auth_header}",
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.redirect_uri
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}{self.TOKEN_ENDPOINT}",
                headers=headers,
                data=data,
                timeout=self.timeout
            )
            
            if response.status_code != 200:
                # Log error
                raise IntegrationException(f"Erro Gov.br Token: {response.status_code} - {response.text}")
                
            return response.json()
            
        except Exception as e:
            raise IntegrationException(f"Falha na comunicação com Gov.br: {str(e)}")

    def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """
        Obtém dados do usuário (UserInfo endpoint)
        
        Args:
            access_token: Token de acesso válido
            
        Returns:
            Dict com dados do perfil (sub, name, email, cpf, etc)
        """
        headers = {'Authorization': f"Bearer {access_token}"}
        
        try:
            response = self.session.get(
                f"{self.base_url}{self.USERINFO_ENDPOINT}",
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code != 200:
                raise IntegrationException(f"Erro Gov.br UserInfo: {response.status_code} - {response.text}")
                
            return response.json()
            
        except Exception as e:
            raise IntegrationException(f"Falha ao obter dados do usuário Gov.br: {str(e)}")
