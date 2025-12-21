"""
Integração com Receita Federal

Serviços de validação de CPF e CNPJ via API da Receita Federal
Implementa o padrão Provider para suportar múltiplas fontes de dados (BrasilAPI, ReceitaWS)
"""

import re
import requests
import logging
from typing import Dict, Any, Optional, List
from abc import ABC, abstractmethod
from datetime import datetime

from .base import BaseIntegrationService, IntegrationException
from ordoc_integrations.utils import (
    clean_cpf,
    clean_cnpj,
    format_cpf,
    format_cnpj,
    validate_cpf,
    validate_cnpj,
)

logger = logging.getLogger(__name__)

# --- Providers Interface ---

class CNPJProvider(ABC):
    """Interface para provedores de dados de CNPJ"""
    
    def __init__(self, session: requests.Session, timeout: int):
        self.session = session
        self.timeout = timeout
        
    @abstractmethod
    def get_company_data(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """
        Consulta dados do CNPJ
        Retorna None se falhar ou não encontrar
        Retorna Dict normalizado se sucesso
        """
        pass

    def _normalize_response(self, cnpj: str, data: Dict[str, Any], source: str) -> Dict[str, Any]:
        """Normaliza resposta para formato padrão Ordoc"""
        return {
            'valid': True,
            'cnpj': format_cnpj(cnpj),
            'validation_type': 'api',
            'source': source,
            'company': {
                'nome': data.get('nome'),
                'fantasia': data.get('fantasia'),
                'situacao': data.get('situacao'),
                'tipo': data.get('tipo'),
                'porte': data.get('porte'),
                'natureza_juridica': data.get('natureza_juridica'),
                'capital_social': data.get('capital_social'),
                'abertura': data.get('abertura'),
                'email': data.get('email'),
                'telefone': data.get('telefone'),
            },
            'address': {
                'logradouro': data.get('logradouro'),
                'numero': data.get('numero'),
                'complemento': data.get('complemento'),
                'bairro': data.get('bairro'),
                'municipio': data.get('municipio'),
                'uf': data.get('uf'),
                'cep': data.get('cep'),
            },
            'activities': data.get('activities', {'primary': None, 'secondary': []}),
            'partners': data.get('partners', []),
            'updated_at': data.get('updated_at'),
            'validated_at': datetime.now().isoformat(),
        }

class BrasilAPIProvider(CNPJProvider):
    """Provedor gratuito (BrasilAPI)"""
    BASE_URL = 'https://brasilapi.com.br/api/cnpj/v1'
    
    def get_company_data(self, cnpj: str) -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.BASE_URL}/{cnpj}"
            response = self.session.get(url, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                return self._normalize(cnpj, data)
            elif response.status_code == 404:
                return None # CNPJ não encontrado
                
            logger.warning(f"BrasilAPI error: {response.status_code}")
            return None
        except Exception as e:
            logger.warning(f"BrasilAPI exception: {str(e)}")
            return None

    def _normalize(self, cnpj: str, data: Dict[str, Any]) -> Dict[str, Any]:
        # Formatar dados específicos da BrasilAPI para o formato Ordoc
        normalized_data = {
            'nome': data.get('razao_social'),
            'fantasia': data.get('nome_fantasia'),
            'situacao': data.get('situacao_cadastral_descricao'),
            'tipo': data.get('descricao_identificador_matriz_filial'),
            'porte': data.get('porte_descricao'),
            'natureza_juridica': data.get('natureza_juridica_descricao'),
            'capital_social': data.get('capital_social'),
            'abertura': data.get('data_inicio_atividade'),
            'email': data.get('email'),
            'telefone': f"({data.get('ddd_telefone_1')[:2]}) {data.get('ddd_telefone_1')[2:]}" if data.get('ddd_telefone_1') else None,
            
            'logradouro': data.get('logradouro'),
            'numero': data.get('numero'),
            'complemento': data.get('complemento'),
            'bairro': data.get('bairro'),
            'municipio': data.get('municipio'),
            'uf': data.get('uf'),
            'cep': str(data.get('cep')),
            
            'updated_at': data.get('data_situacao_cadastral'),
            
            'activities': {
                'primary': {
                    'code': str(data.get('cnae_fiscal_principal', {}).get('codigo')),
                    'text': data.get('cnae_fiscal_principal', {}).get('descricao')
                } if data.get('cnae_fiscal_principal') else None,
                'secondary': [
                    {'code': str(cnae.get('codigo')), 'text': cnae.get('descricao')}
                    for cnae in data.get('cnaes_fiscais_secundarias', [])
                ]
            },
            'partners': [
                {'nome': qsa.get('nome_socio'), 'qualificacao': qsa.get('qualificacao_socio')}
                for qsa in data.get('qsa', [])
            ]
        }
        return self._normalize_response(cnpj, normalized_data, source='BrasilAPI')

class ReceitaWSProvider(CNPJProvider):
    """Provedor ReceitaWS (Freemium/Pago)"""
    BASE_URL = 'https://www.receitaws.com.br/v1/cnpj'
    
    def get_company_data(self, cnpj: str) -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.BASE_URL}/{cnpj}"
            response = self.session.get(url, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ERROR':
                    return None
                return self._normalize(cnpj, data)
                
            logger.warning(f"ReceitaWS error: {response.status_code}")
            return None
        except Exception as e:
            logger.warning(f"ReceitaWS exception: {str(e)}")
            return None

    def _normalize(self, cnpj: str, data: Dict[str, Any]) -> Dict[str, Any]:
        # ReceitaWS já retorna campos compatíveis com nosso modelo anterior
        normalized_data = {
            'nome': data.get('nome'),
            'fantasia': data.get('fantasia'),
            'situacao': data.get('situacao'),
            'tipo': data.get('tipo'),
            'porte': data.get('porte'),
            'natureza_juridica': data.get('natureza_juridica'),
            'capital_social': data.get('capital_social'),
            'abertura': data.get('abertura'),
            'email': data.get('email'),
            'telefone': data.get('telefone'),
            
            'logradouro': data.get('logradouro'),
            'numero': data.get('numero'),
            'complemento': data.get('complemento'),
            'bairro': data.get('bairro'),
            'municipio': data.get('municipio'),
            'uf': data.get('uf'),
            'cep': data.get('cep'),
            
            'updated_at': data.get('ultima_atualizacao'),
            
            'activities': {
                'primary': {
                    'code': data.get('atividade_principal', [{}])[0].get('code'),
                    'text': data.get('atividade_principal', [{}])[0].get('text'),
                } if data.get('atividade_principal') else None,
                'secondary': [
                    {'code': act.get('code'), 'text': act.get('text')}
                    for act in data.get('atividades_secundarias', [])
                ] if data.get('atividades_secundarias') else [],
            },
            'partners': [
                {'nome': p.get('nome'), 'qualificacao': p.get('qual')}
                for p in data.get('qsa', [])
            ]
        }
        return self._normalize_response(cnpj, normalized_data, source='ReceitaWS')


# --- Service Implementation ---

class ReceitaFederalService(BaseIntegrationService):
    """
    Serviço de integração com Receita Federal
    
    Funcionalidades:
    - Validação de CPF (ReceitaWS/Offline)
    - Validação/Consulta de CNPJ (Multi-provider: BrasilAPI -> ReceitaWS -> Offline)
    """

    REQUEST_TYPE_VALIDATE_CPF = 'validate_cpf'
    REQUEST_TYPE_VALIDATE_CNPJ = 'validate_cnpj'
    REQUEST_TYPE_COMPANY_DATA = 'company_data'

    def __init__(
        self,
        organization_id: Optional[int] = None,
        user_id: Optional[int] = None
    ):
        """Inicializa serviço Receita Federal"""
        super().__init__(
            service_type='receita_federal',
            organization_id=organization_id,
            user_id=user_id
        )
        
        # Inicializar providers
        self.providers: List[CNPJProvider] = [
            BrasilAPIProvider(self.session, self.timeout),
            ReceitaWSProvider(self.session, self.timeout)
        ]

    def validate_identifier(self, identifier: str) -> bool:
        """Valida identificador (CPF ou CNPJ)"""
        clean_id = re.sub(r'[^0-9]', '', identifier)
        if len(clean_id) == 11:
            return validate_cpf(identifier)
        elif len(clean_id) == 14:
            return validate_cnpj(identifier)
        return False

    def validate_cpf_data(self, cpf: str) -> Dict[str, Any]:
        return self.execute(
            identifier=cpf,
            request_type=self.REQUEST_TYPE_VALIDATE_CPF
        )[0]

    def validate_cnpj_data(self, cnpj: str) -> Dict[str, Any]:
        return self.execute(
            identifier=cnpj,
            request_type=self.REQUEST_TYPE_VALIDATE_CNPJ
        )[0]

    def get_company_data(self, cnpj: str) -> Dict[str, Any]:
        # Alias para validate_cnpj_data pois ambos retornam dados da empresa
        return self.validate_cnpj_data(cnpj)

    def _make_request(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Faz requisição à API usando providers"""
        clean_id = re.sub(r'[^0-9]', '', identifier)

        if request_type == self.REQUEST_TYPE_VALIDATE_CPF:
            return self._validate_cpf_api(clean_id)
        elif request_type in [self.REQUEST_TYPE_VALIDATE_CNPJ, self.REQUEST_TYPE_COMPANY_DATA]:
            return self._validate_cnpj_api(clean_id)
        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_cpf_api(self, cpf: str) -> Dict[str, Any]:
        """
        Valida CPF
        Atualmente offline, futuro: consultar API
        """
        if not validate_cpf(cpf):
            return {
                'valid': False,
                'cpf': format_cpf(cpf),
                'message': 'CPF inválido',
                'validation_type': 'offline',
            }

        return {
            'valid': True,
            'cpf': format_cpf(cpf),
            'message': 'CPF válido (validação offline)',
            'validation_type': 'offline',
            'validated_at': datetime.now().isoformat(),
        }

    def _validate_cnpj_api(self, cnpj: str) -> Dict[str, Any]:
        """Valida CNPJ usando providers"""
        
        # 1. Validação offline
        if not validate_cnpj(cnpj):
            return {
                'valid': False,
                'cnpj': format_cnpj(cnpj),
                'message': 'CNPJ inválido de acordo com algoritmo',
                'validation_type': 'offline',
            }

        # 2. Tentar providers em ordem
        for provider in self.providers:
            result = provider.get_company_data(cnpj)
            if result:
                 logger.info(f"CNPJ found via {result.get('source')}")
                 return result
        
        # 3. Fallback se nenhum provider achar (mas for válido offline)
        # Pode significar API down, ou CNPJ inexistente na base deles, mas válido matematicamente
        logger.warning(f"CNPJ {cnpj} valid offline but not found in providers")
        
        return {
            'valid': True, # Matematicamente válido
            'cnpj': format_cnpj(cnpj),
            'message': 'CNPJ válido (Estruturalmente)',
            'validation_type': 'offline',
            'warning': 'Não foi possível consultar dados atualizados na Receita Federal',
            'validated_at': datetime.now().isoformat(),
        }

# Factory function
def get_receita_federal_service(
    organization_id: Optional[int] = None,
    user_id: Optional[int] = None
) -> ReceitaFederalService:
    return ReceitaFederalService(
        organization_id=organization_id,
        user_id=user_id
    )
