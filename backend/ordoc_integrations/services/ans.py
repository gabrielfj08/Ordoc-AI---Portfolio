"""
Integração com ANS - Agência Nacional de Saúde Suplementar

Serviço de consulta de dados sobre planos de saúde, operadoras e beneficiários
API Pública da ANS para verificação de regularidade e dados cadastrais do setor de saúde suplementar
"""

import logging
from typing import Dict, Any, Optional
from datetime import datetime

from .base import BaseIntegrationService, IntegrationException
from ordoc_integrations.utils import clean_cpf, clean_cnpj, format_cpf, format_cnpj, validate_cpf, validate_cnpj

logger = logging.getLogger(__name__)


class ANSService(BaseIntegrationService):
    """
    Serviço de integração com ANS (Agência Nacional de Saúde Suplementar)

    Funcionalidades:
    - Consulta de planos de saúde ativos
    - Verificação de operadoras (registro ANS, situação)
    - Consulta de beneficiários por CPF
    - Dados de cobertura e abrangência geográfica

    API Base: https://api.ans.gov.br
    Autenticação: Nenhuma (API pública)
    Rate Limit: 100 req/min (configurável)
    Dados: Informações públicas do setor de saúde suplementar
    """

    # Tipos de requisição suportados
    REQUEST_TYPE_BENEFICIARY = 'beneficiary'
    REQUEST_TYPE_HEALTH_PLAN = 'health_plan'
    REQUEST_TYPE_OPERATOR = 'operator'
    REQUEST_TYPE_OPERATOR_LIST = 'operator_list'

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa serviço ANS

        Args:
            organization_id: ID da organização
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='ans',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida identificador (CPF para beneficiários, CNPJ para operadoras, código ANS para planos)

        Args:
            identifier: CPF, CNPJ ou código de registro ANS

        Returns:
            bool: True se válido
        """
        # Aceita CPF, CNPJ ou código ANS (6 dígitos numéricos)
        cleaned = identifier.replace('.', '').replace('-', '').replace('/', '')

        # CPF (11 dígitos)
        if len(cleaned) == 11:
            return validate_cpf(cleaned)

        # CNPJ (14 dígitos)
        elif len(cleaned) == 14:
            return validate_cnpj(cleaned)

        # Código ANS (6 dígitos)
        elif len(cleaned) == 6 and cleaned.isdigit():
            return True

        return False

    def _make_request(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Faz requisição à API da ANS

        Args:
            identifier: CPF, CNPJ ou código ANS
            request_type: Tipo de consulta
            params: Parâmetros adicionais

        Returns:
            Dict com dados da consulta

        Raises:
            IntegrationException: Em caso de erro
        """
        cleaned_identifier = identifier.replace('.', '').replace('-', '').replace('/', '')

        if request_type == self.REQUEST_TYPE_BENEFICIARY:
            return self._get_beneficiary_data(cleaned_identifier)
        elif request_type == self.REQUEST_TYPE_HEALTH_PLAN:
            return self._get_health_plan_data(cleaned_identifier)
        elif request_type == self.REQUEST_TYPE_OPERATOR:
            return self._get_operator_data(cleaned_identifier)
        elif request_type == self.REQUEST_TYPE_OPERATOR_LIST:
            return self._get_operator_list(params or {})
        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _get_beneficiary_data(self, cpf: str) -> Dict[str, Any]:
        """
        Consulta dados de beneficiário por CPF

        Args:
            cpf: CPF limpo (apenas números)

        Returns:
            Dict com dados do beneficiário
        """
        try:
            url = f"{self.base_url}/beneficiaries/{cpf}"

            response = self.session.get(url, timeout=self.timeout)

            if response.status_code == 200:
                data = response.json()
                return self._normalize_beneficiary(cpf, data)
            elif response.status_code == 404:
                return self._create_not_found_response(cpf, 'beneficiary')
            elif response.status_code == 429:
                raise IntegrationException("Rate limit excedido na API da ANS")
            else:
                raise IntegrationException(
                    f"Erro ao consultar ANS: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao consultar beneficiário ANS: {str(e)}")
            raise IntegrationException(f"Erro ao consultar beneficiário: {str(e)}")

    def _get_health_plan_data(self, plan_code: str) -> Dict[str, Any]:
        """
        Consulta dados de plano de saúde por código ANS

        Args:
            plan_code: Código de registro ANS do plano (6 dígitos)

        Returns:
            Dict com dados do plano
        """
        try:
            url = f"{self.base_url}/health-plans/{plan_code}"

            response = self.session.get(url, timeout=self.timeout)

            if response.status_code == 200:
                data = response.json()
                return self._normalize_health_plan(plan_code, data)
            elif response.status_code == 404:
                return self._create_not_found_response(plan_code, 'health_plan')
            else:
                raise IntegrationException(
                    f"Erro ao consultar plano de saúde: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao consultar plano ANS: {str(e)}")
            raise IntegrationException(f"Erro ao consultar plano: {str(e)}")

    def _get_operator_data(self, cnpj_or_code: str) -> Dict[str, Any]:
        """
        Consulta dados de operadora por CNPJ ou código ANS

        Args:
            cnpj_or_code: CNPJ ou código ANS da operadora

        Returns:
            Dict com dados da operadora
        """
        try:
            url = f"{self.base_url}/operators/{cnpj_or_code}"

            response = self.session.get(url, timeout=self.timeout)

            if response.status_code == 200:
                data = response.json()
                return self._normalize_operator(cnpj_or_code, data)
            elif response.status_code == 404:
                return self._create_not_found_response(cnpj_or_code, 'operator')
            else:
                raise IntegrationException(
                    f"Erro ao consultar operadora: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao consultar operadora ANS: {str(e)}")
            raise IntegrationException(f"Erro ao consultar operadora: {str(e)}")

    def _get_operator_list(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Lista operadoras com filtros

        Args:
            filters: Filtros de busca (state, city, modality, etc)

        Returns:
            Dict com lista de operadoras
        """
        try:
            url = f"{self.base_url}/operators"

            response = self.session.get(url, params=filters, timeout=self.timeout)

            if response.status_code == 200:
                data = response.json()
                return self._normalize_operator_list(data)
            else:
                raise IntegrationException(
                    f"Erro ao listar operadoras: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao listar operadoras ANS: {str(e)}")
            raise IntegrationException(f"Erro ao listar operadoras: {str(e)}")

    def _normalize_beneficiary(self, cpf: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normaliza resposta de beneficiário"""
        return {
            'valid': True,
            'cpf': format_cpf(cpf),
            'request_type': 'beneficiary',
            'source': 'ANS',
            'beneficiary': {
                'name': data.get('name'),
                'birth_date': data.get('birth_date'),
                'has_active_plan': data.get('has_active_plan', False),
                'plan_count': data.get('plan_count', 0),
            },
            'active_plans': [
                {
                    'plan_code': plan.get('plan_code'),
                    'plan_name': plan.get('plan_name'),
                    'operator_code': plan.get('operator_code'),
                    'operator_name': plan.get('operator_name'),
                    'start_date': plan.get('start_date'),
                    'modality': plan.get('modality'),  # 'individual', 'coletivo', 'empresarial'
                    'coverage_type': plan.get('coverage_type'),  # 'ambulatorial', 'hospitalar', 'odontológico'
                }
                for plan in data.get('active_plans', [])
            ],
            'consulted_at': datetime.now().isoformat(),
        }

    def _normalize_health_plan(self, plan_code: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normaliza resposta de plano de saúde"""
        return {
            'valid': True,
            'plan_code': plan_code,
            'request_type': 'health_plan',
            'source': 'ANS',
            'plan': {
                'name': data.get('name'),
                'commercial_name': data.get('commercial_name'),
                'registration_number': data.get('registration_number'),
                'registration_date': data.get('registration_date'),
                'status': data.get('status'),  # 'ativo', 'suspenso', 'cancelado'
                'modality': data.get('modality'),
                'coverage_type': data.get('coverage_type'),
                'contract_type': data.get('contract_type'),  # 'individual', 'coletivo'
                'segmentation': data.get('segmentation'),  # 'ambulatorial', 'hospitalar', 'referência'
            },
            'operator': {
                'code': data.get('operator_code'),
                'name': data.get('operator_name'),
                'cnpj': data.get('operator_cnpj'),
            },
            'coverage': {
                'geographic_area': data.get('geographic_area'),  # 'municipal', 'estadual', 'nacional'
                'states': data.get('covered_states', []),
                'cities': data.get('covered_cities', []),
            },
            'consulted_at': datetime.now().isoformat(),
        }

    def _normalize_operator(self, identifier: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normaliza resposta de operadora"""
        cnpj = data.get('cnpj', identifier if len(identifier) == 14 else None)

        return {
            'valid': True,
            'identifier': identifier,
            'request_type': 'operator',
            'source': 'ANS',
            'operator': {
                'code': data.get('code'),
                'name': data.get('name'),
                'commercial_name': data.get('commercial_name'),
                'cnpj': format_cnpj(cnpj) if cnpj else None,
                'registration_number': data.get('registration_number'),
                'registration_date': data.get('registration_date'),
                'status': data.get('status'),  # 'ativa', 'suspensa', 'liquidada', 'cancelada'
                'modality': data.get('modality'),  # 'medicina de grupo', 'cooperativa médica', 'seguradora', etc
            },
            'contact': {
                'phone': data.get('phone'),
                'email': data.get('email'),
                'website': data.get('website'),
            },
            'address': {
                'street': data.get('address', {}).get('street'),
                'number': data.get('address', {}).get('number'),
                'complement': data.get('address', {}).get('complement'),
                'neighborhood': data.get('address', {}).get('neighborhood'),
                'city': data.get('address', {}).get('city'),
                'state': data.get('address', {}).get('state'),
                'zip_code': data.get('address', {}).get('zip_code'),
            },
            'stats': {
                'active_plans': data.get('active_plans_count', 0),
                'beneficiaries': data.get('beneficiaries_count', 0),
            },
            'consulted_at': datetime.now().isoformat(),
        }

    def _normalize_operator_list(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normaliza lista de operadoras"""
        operators = data.get('operators', [])

        return {
            'valid': True,
            'request_type': 'operator_list',
            'source': 'ANS',
            'total': data.get('total', len(operators)),
            'operators': [
                {
                    'code': op.get('code'),
                    'name': op.get('name'),
                    'cnpj': format_cnpj(op.get('cnpj')) if op.get('cnpj') else None,
                    'status': op.get('status'),
                    'modality': op.get('modality'),
                    'state': op.get('state'),
                }
                for op in operators
            ],
            'consulted_at': datetime.now().isoformat(),
        }

    def _create_not_found_response(self, identifier: str, request_type: str) -> Dict[str, Any]:
        """Cria resposta padronizada para não encontrado"""
        return {
            'valid': False,
            'identifier': identifier,
            'request_type': request_type,
            'source': 'ANS',
            'found': False,
            'message': 'Registro não encontrado na base de dados da ANS',
            'consulted_at': datetime.now().isoformat(),
        }

    # --- Métodos de conveniência ---

    def check_beneficiary(self, cpf: str, force_refresh: bool = False):
        """Verifica dados de beneficiário"""
        return self.execute(
            identifier=cpf,
            request_type=self.REQUEST_TYPE_BENEFICIARY,
            force_refresh=force_refresh
        )

    def get_health_plan(self, plan_code: str, force_refresh: bool = False):
        """Obtém dados de plano de saúde"""
        return self.execute(
            identifier=plan_code,
            request_type=self.REQUEST_TYPE_HEALTH_PLAN,
            force_refresh=force_refresh
        )

    def get_operator(self, cnpj_or_code: str, force_refresh: bool = False):
        """Obtém dados de operadora"""
        return self.execute(
            identifier=cnpj_or_code,
            request_type=self.REQUEST_TYPE_OPERATOR,
            force_refresh=force_refresh
        )

    def list_operators(self, filters: Dict[str, Any] = None, force_refresh: bool = False):
        """Lista operadoras com filtros"""
        # Para lista, usamos um identificador genérico
        return self.execute(
            identifier='list',
            request_type=self.REQUEST_TYPE_OPERATOR_LIST,
            params=filters or {},
            force_refresh=force_refresh
        )
