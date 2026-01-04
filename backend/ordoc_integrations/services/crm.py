"""
Serviço de Integração - CRM (Conselho Regional de Medicina)

Validação de licenças profissionais de médicos.
"""

import re
from typing import Dict, Any, Optional, List
from .base import BaseIntegrationService, IntegrationException


class CRMService(BaseIntegrationService):
    """
    Serviço para validação de inscrições CRM e consulta de dados de médicos.

    Funcionalidades:
    - Validação de número CRM por UF
    - Consulta de situação cadastral (ativo/cancelado/suspenso)
    - Dados do médico (nome, CPF, especialidades)
    - Busca por nome ou número CRM
    - Validação de atestados e receitas médicas

    Exemplo de uso:
        >>> service = CRMService(organization_id=1, user_id=1)
        >>> data, request = service.validate_registration('123456', 'SP')
        >>> print(data['valid'])  # True/False
        >>> print(data['specialties'])  # ['Cardiologia', 'Clínica Geral']
    """

    # Tipos de requisição
    REQUEST_TYPE_VALIDATE = 'validate'
    REQUEST_TYPE_PROFESSIONAL_DATA = 'professional_data'
    REQUEST_TYPE_SPECIALTIES = 'specialties'
    REQUEST_TYPE_SEARCH = 'search'
    REQUEST_TYPE_VALIDATE_PRESCRIPTION = 'validate_prescription'

    # Estados brasileiros (UFs)
    VALID_STATES = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa o serviço CRM.

        Args:
            organization_id: ID da organização (multi-tenancy)
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='crm',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida formato do número CRM.

        Args:
            identifier: Número CRM (apenas dígitos)

        Returns:
            bool: True se válido
        """
        if not identifier:
            return False

        # Remove caracteres não numéricos
        clean = re.sub(r'\D', '', identifier)

        # CRM geralmente tem 4-6 dígitos
        return len(clean) >= 4 and len(clean) <= 6 and clean.isdigit()

    def validate_state(self, state: str) -> bool:
        """
        Valida se a UF é válida.

        Args:
            state: Sigla do estado (ex: 'SP', 'RJ')

        Returns:
            bool: True se válido
        """
        return state and state.upper() in self.VALID_STATES

    def _make_request(self, identifier: str, request_type: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Executa requisição à API do CRM.

        Args:
            identifier: Número CRM
            request_type: Tipo de requisição
            params: Parâmetros adicionais (state, etc)

        Returns:
            Dict com dados do médico

        Raises:
            IntegrationException: Se houver erro na requisição
        """
        params = params or {}
        state = params.get('state', '').upper()

        if not self.validate_state(state):
            raise IntegrationException(f"UF inválida: {state}")

        if request_type == self.REQUEST_TYPE_VALIDATE:
            return self._validate_registration(identifier, state)

        elif request_type == self.REQUEST_TYPE_PROFESSIONAL_DATA:
            return self._get_professional_data(identifier, state)

        elif request_type == self.REQUEST_TYPE_SPECIALTIES:
            return self._get_specialties(identifier, state)

        elif request_type == self.REQUEST_TYPE_SEARCH:
            return self._search_professional(params)

        elif request_type == self.REQUEST_TYPE_VALIDATE_PRESCRIPTION:
            return self._validate_prescription(identifier, state, params)

        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_registration(self, crm_number: str, state: str) -> Dict[str, Any]:
        """
        Valida inscrição CRM.

        IMPORTANTE: Esta é uma implementação base/template.
        Substituir pela integração real com API do CFM/CRM quando disponível.

        Args:
            crm_number: Número CRM
            state: UF do registro

        Returns:
            Dict com resultado da validação
        """
        # TODO: Integrar com API real do CFM/CRM
        # Possíveis fontes:
        # - API CFM (Conselho Federal de Medicina)
        # - APIs dos CRMs estaduais
        # - Portal de Transparência CFM

        return {
            'valid': False,  # Será True quando integração real estiver ativa
            'crm_number': crm_number,
            'state': state,
            'status': 'pending_integration',
            'message': 'Integração com API CRM em desenvolvimento',
            'integration_ready': False
        }

    def _get_professional_data(self, crm_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém dados completos do médico.

        Args:
            crm_number: Número CRM
            state: UF do registro

        Returns:
            Dict com dados do profissional
        """
        # TODO: Implementar integração real
        return {
            'crm_number': crm_number,
            'state': state,
            'name': None,
            'cpf': None,
            'registration_date': None,
            'status': 'pending_integration',
            'situation': None,  # 'ATIVO', 'CANCELADO', 'SUSPENSO'
            'entity': None,  # CRM/SP, CRM/RJ, etc
            'inscription_type': None,  # 'Principal', 'Secundária'
            'integration_ready': False
        }

    def _get_specialties(self, crm_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém especialidades do médico.

        Args:
            crm_number: Número CRM
            state: UF do registro

        Returns:
            Dict com especialidades
        """
        # TODO: Implementar integração real
        return {
            'crm_number': crm_number,
            'state': state,
            'specialties': [],
            'primary_specialty': None,
            'certifications': [],
            'status': 'pending_integration',
            'integration_ready': False
        }

    def _search_professional(self, params: Dict) -> Dict[str, Any]:
        """
        Busca médico por nome ou número.

        Args:
            params: Parâmetros de busca (name, crm_number, state, specialty)

        Returns:
            Dict com resultados da busca
        """
        # TODO: Implementar integração real
        return {
            'results': [],
            'count': 0,
            'status': 'pending_integration',
            'integration_ready': False
        }

    def _validate_prescription(self, crm_number: str, state: str, params: Dict) -> Dict[str, Any]:
        """
        Valida receita/atestado médico.

        Args:
            crm_number: Número CRM do médico
            state: UF do registro
            params: Dados do documento (tipo, data, etc)

        Returns:
            Dict com validação do documento
        """
        # TODO: Implementar validação de receita
        return {
            'valid': False,
            'crm_number': crm_number,
            'state': state,
            'authorized': False,
            'can_prescribe': False,
            'document_type': params.get('document_type'),  # 'receita', 'atestado'
            'status': 'pending_integration',
            'integration_ready': False
        }

    # Métodos públicos de conveniência

    def validate_registration(self, crm_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Valida registro CRM.

        Args:
            crm_number: Número CRM
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados da validação
        """
        return self.execute(
            identifier=crm_number,
            request_type=self.REQUEST_TYPE_VALIDATE,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_professional_data(self, crm_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém dados completos do médico.

        Args:
            crm_number: Número CRM
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados do profissional
        """
        return self.execute(
            identifier=crm_number,
            request_type=self.REQUEST_TYPE_PROFESSIONAL_DATA,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_specialties(self, crm_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém especialidades do médico.

        Args:
            crm_number: Número CRM
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com especialidades
        """
        return self.execute(
            identifier=crm_number,
            request_type=self.REQUEST_TYPE_SPECIALTIES,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def search_by_name(self, name: str, state: Optional[str] = None,
                       specialty: Optional[str] = None, force_refresh: bool = False) -> tuple:
        """
        Busca médico por nome.

        Args:
            name: Nome do médico
            state: UF (opcional)
            specialty: Filtrar por especialidade (opcional)
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com resultados
        """
        params = {'name': name}
        if state:
            params['state'] = state.upper()
        if specialty:
            params['specialty'] = specialty

        return self.execute(
            identifier=name,
            request_type=self.REQUEST_TYPE_SEARCH,
            params=params,
            force_refresh=force_refresh
        )

    def validate_prescription(self, crm_number: str, state: str,
                            document_type: str = 'receita', force_refresh: bool = False) -> tuple:
        """
        Valida receita ou atestado médico.

        Args:
            crm_number: Número CRM
            state: UF (ex: 'SP')
            document_type: Tipo ('receita' ou 'atestado')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com validação
        """
        return self.execute(
            identifier=crm_number,
            request_type=self.REQUEST_TYPE_VALIDATE_PRESCRIPTION,
            params={
                'state': state.upper(),
                'document_type': document_type
            },
            force_refresh=force_refresh
        )
