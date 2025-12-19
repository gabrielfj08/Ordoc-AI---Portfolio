"""
Integração com Receita Federal

Serviços de validação de CPF e CNPJ via API da Receita Federal
"""

import re
import requests
from typing import Dict, Any, Optional
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


class ReceitaFederalService(BaseIntegrationService):
    """
    Serviço de integração com Receita Federal

    Funcionalidades:
    - Validação de CPF
    - Validação de CNPJ
    - Consulta de situação cadastral
    - Dados de empresas

    API Base: https://www.receitaws.com.br/v1 (API pública não oficial)
    Nota: Para produção, usar API oficial da Receita Federal
    """

    REQUEST_TYPE_VALIDATE_CPF = 'validate_cpf'
    REQUEST_TYPE_VALIDATE_CNPJ = 'validate_cnpj'
    REQUEST_TYPE_COMPANY_DATA = 'company_data'
    REQUEST_TYPE_CPF_SITUATION = 'cpf_situation'

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

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida identificador (CPF ou CNPJ)

        Args:
            identifier: CPF ou CNPJ

        Returns:
            bool: True se válido
        """
        clean_id = re.sub(r'[^0-9]', '', identifier)

        # Verificar tamanho
        if len(clean_id) == 11:
            return validate_cpf(identifier)
        elif len(clean_id) == 14:
            return validate_cnpj(identifier)
        else:
            return False

    def validate_cpf_data(self, cpf: str) -> Dict[str, Any]:
        """
        Valida CPF e retorna dados (se disponível)

        Args:
            cpf: CPF a validar

        Returns:
            Dict com dados do CPF

        Raises:
            IntegrationException: Em caso de erro
        """
        return self.execute(
            identifier=cpf,
            request_type=self.REQUEST_TYPE_VALIDATE_CPF
        )[0]

    def validate_cnpj_data(self, cnpj: str) -> Dict[str, Any]:
        """
        Valida CNPJ e retorna dados da empresa

        Args:
            cnpj: CNPJ a validar

        Returns:
            Dict com dados da empresa

        Raises:
            IntegrationException: Em caso de erro
        """
        return self.execute(
            identifier=cnpj,
            request_type=self.REQUEST_TYPE_VALIDATE_CNPJ
        )[0]

    def get_company_data(self, cnpj: str) -> Dict[str, Any]:
        """
        Obtém dados completos da empresa

        Args:
            cnpj: CNPJ da empresa

        Returns:
            Dict com dados da empresa

        Raises:
            IntegrationException: Em caso de erro
        """
        return self.execute(
            identifier=cnpj,
            request_type=self.REQUEST_TYPE_COMPANY_DATA
        )[0]

    def _make_request(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Faz requisição à API da Receita Federal

        Args:
            identifier: CPF ou CNPJ
            request_type: Tipo de requisição
            params: Parâmetros adicionais

        Returns:
            Dict com dados da resposta

        Raises:
            IntegrationException: Em caso de erro
        """
        clean_id = re.sub(r'[^0-9]', '', identifier)

        # Determinar tipo de consulta
        if request_type == self.REQUEST_TYPE_VALIDATE_CPF:
            return self._validate_cpf_api(clean_id)
        elif request_type in [self.REQUEST_TYPE_VALIDATE_CNPJ, self.REQUEST_TYPE_COMPANY_DATA]:
            return self._validate_cnpj_api(clean_id)
        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_cpf_api(self, cpf: str) -> Dict[str, Any]:
        """
        Valida CPF via API

        Nota: API pública não oficial. Para produção, usar API oficial.

        Args:
            cpf: CPF limpo (apenas números)

        Returns:
            Dict com resultado da validação

        Raises:
            IntegrationException: Em caso de erro
        """
        # Validação offline primeiro
        is_valid = validate_cpf(cpf)

        if not is_valid:
            return {
                'valid': False,
                'cpf': format_cpf(cpf),
                'message': 'CPF inválido',
                'validation_type': 'offline',
            }

        # Para produção, consultar API real da Receita Federal
        # Por enquanto, retornar validação offline
        return {
            'valid': True,
            'cpf': format_cpf(cpf),
            'message': 'CPF válido (validação offline)',
            'validation_type': 'offline',
            'validated_at': datetime.now().isoformat(),
        }

    def _validate_cnpj_api(self, cnpj: str) -> Dict[str, Any]:
        """
        Valida CNPJ e obtém dados da empresa

        Usa ReceitaWS como exemplo (API não oficial)
        Para produção, substituir por API oficial

        Args:
            cnpj: CNPJ limpo (apenas números)

        Returns:
            Dict com dados da empresa

        Raises:
            IntegrationException: Em caso de erro
        """
        # Validação offline primeiro
        if not validate_cnpj(cnpj):
            return {
                'valid': False,
                'cnpj': format_cnpj(cnpj),
                'message': 'CNPJ inválido',
                'validation_type': 'offline',
            }

        # Tentar consultar API ReceitaWS (exemplo)
        try:
            url = f"{self.base_url}/cnpj/{cnpj}"
            response = self.session.get(url, timeout=self.timeout)

            if response.status_code == 200:
                data = response.json()

                # Verificar se retornou erro
                if data.get('status') == 'ERROR':
                    return {
                        'valid': False,
                        'cnpj': format_cnpj(cnpj),
                        'message': data.get('message', 'Erro ao consultar CNPJ'),
                        'validation_type': 'api',
                    }

                # Processar dados
                return self._process_cnpj_response(cnpj, data)

            elif response.status_code == 429:
                # Rate limit - retornar validação offline
                return {
                    'valid': True,
                    'cnpj': format_cnpj(cnpj),
                    'message': 'CNPJ válido (validação offline - rate limit na API)',
                    'validation_type': 'offline',
                }

            else:
                raise IntegrationException(
                    f"Erro ao consultar CNPJ: HTTP {response.status_code}"
                )

        except requests.RequestException as e:
            # Em caso de erro na API, retornar validação offline
            return {
                'valid': True,
                'cnpj': format_cnpj(cnpj),
                'message': 'CNPJ válido (validação offline - API indisponível)',
                'validation_type': 'offline',
                'api_error': str(e),
            }

    def _process_cnpj_response(self, cnpj: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processa resposta da API de CNPJ

        Args:
            cnpj: CNPJ consultado
            data: Dados retornados pela API

        Returns:
            Dict com dados processados
        """
        return {
            'valid': True,
            'cnpj': format_cnpj(cnpj),
            'validation_type': 'api',
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
                {
                    'nome': partner.get('nome'),
                    'qualificacao': partner.get('qual'),
                }
                for partner in data.get('qsa', [])
            ] if data.get('qsa') else [],
            'updated_at': data.get('ultima_atualizacao'),
            'validated_at': datetime.now().isoformat(),
        }


# Factory function
def get_receita_federal_service(
    organization_id: Optional[int] = None,
    user_id: Optional[int] = None
) -> ReceitaFederalService:
    """
    Factory para criar instância do serviço Receita Federal

    Args:
        organization_id: ID da organização
        user_id: ID do usuário

    Returns:
        ReceitaFederalService instance
    """
    return ReceitaFederalService(
        organization_id=organization_id,
        user_id=user_id
    )
