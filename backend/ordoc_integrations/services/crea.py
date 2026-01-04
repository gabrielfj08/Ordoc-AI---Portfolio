"""
Serviço de Integração - CREA (Conselho Regional de Engenharia e Agronomia)

Validação de licenças profissionais de engenheiros e agrônomos.
"""

import re
from typing import Dict, Any, Optional, List
from .base import BaseIntegrationService, IntegrationException


class CREAService(BaseIntegrationService):
    """
    Serviço para validação de inscrições CREA e consulta de dados de engenheiros.

    Funcionalidades:
    - Validação de número CREA por UF
    - Consulta de situação cadastral (ativo/cancelado/suspenso)
    - Dados do profissional (nome, CPF, atribuições técnicas)
    - Busca por nome ou número CREA
    - Validação de ARTs (Anotações de Responsabilidade Técnica)

    Exemplo de uso:
        >>> service = CREAService(organization_id=1, user_id=1)
        >>> data, request = service.validate_registration('123456', 'SP')
        >>> print(data['valid'])  # True/False
        >>> print(data['technical_attributions'])  # Lista de atribuições
    """

    # Tipos de requisição
    REQUEST_TYPE_VALIDATE = 'validate'
    REQUEST_TYPE_PROFESSIONAL_DATA = 'professional_data'
    REQUEST_TYPE_TECHNICAL_ATTRIBUTIONS = 'technical_attributions'
    REQUEST_TYPE_SEARCH = 'search'
    REQUEST_TYPE_VALIDATE_ART = 'validate_art'

    # Estados brasileiros (UFs)
    VALID_STATES = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    # Modalidades comuns
    ENGINEERING_MODALITIES = [
        'ENGENHARIA CIVIL',
        'ENGENHARIA MECÂNICA',
        'ENGENHARIA ELÉTRICA',
        'ENGENHARIA QUÍMICA',
        'ENGENHARIA DE PRODUÇÃO',
        'ENGENHARIA AMBIENTAL',
        'ENGENHARIA DE ALIMENTOS',
        'ENGENHARIA FLORESTAL',
        'AGRONOMIA',
        'ARQUITETURA E URBANISMO'
    ]

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa o serviço CREA.

        Args:
            organization_id: ID da organização (multi-tenancy)
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='crea',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida formato do número CREA.

        Args:
            identifier: Número CREA (apenas dígitos)

        Returns:
            bool: True se válido
        """
        if not identifier:
            return False

        # Remove caracteres não numéricos
        clean = re.sub(r'\D', '', identifier)

        # CREA geralmente tem 6-11 dígitos
        return len(clean) >= 6 and len(clean) <= 11 and clean.isdigit()

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
        Executa requisição à API do CREA.

        Args:
            identifier: Número CREA ou ART
            request_type: Tipo de requisição
            params: Parâmetros adicionais (state, etc)

        Returns:
            Dict com dados do profissional

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

        elif request_type == self.REQUEST_TYPE_TECHNICAL_ATTRIBUTIONS:
            return self._get_technical_attributions(identifier, state)

        elif request_type == self.REQUEST_TYPE_SEARCH:
            return self._search_professional(params)

        elif request_type == self.REQUEST_TYPE_VALIDATE_ART:
            return self._validate_art(identifier, state, params)

        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_registration(self, crea_number: str, state: str) -> Dict[str, Any]:
        """
        Valida inscrição CREA.

        IMPORTANTE: Esta é uma implementação base/template.
        Substituir pela integração real com API do CONFEA/CREA quando disponível.

        Args:
            crea_number: Número CREA
            state: UF do registro

        Returns:
            Dict com resultado da validação
        """
        # TODO: Integrar com API real do CONFEA/CREA
        # Possíveis fontes:
        # - API CONFEA (Conselho Federal de Engenharia e Agronomia)
        # - APIs dos CREAs estaduais
        # - Sistema CONFEA

        return {
            'valid': False,  # Será True quando integração real estiver ativa
            'crea_number': crea_number,
            'state': state,
            'status': 'pending_integration',
            'message': 'Integração com API CREA em desenvolvimento',
            'integration_ready': False
        }

    def _get_professional_data(self, crea_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém dados completos do profissional.

        Args:
            crea_number: Número CREA
            state: UF do registro

        Returns:
            Dict com dados do profissional
        """
        # TODO: Implementar integração real
        return {
            'crea_number': crea_number,
            'state': state,
            'name': None,
            'cpf': None,
            'registration_date': None,
            'status': 'pending_integration',
            'situation': None,  # 'ATIVO', 'CANCELADO', 'SUSPENSO', 'BAIXADO'
            'entity': None,  # CREA-SP, CREA-RJ, etc
            'modality': None,  # Engenharia Civil, Agronomia, etc
            'professional_category': None,  # 'Engenheiro', 'Técnico', 'Tecnólogo'
            'integration_ready': False
        }

    def _get_technical_attributions(self, crea_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém atribuições técnicas do profissional.

        Args:
            crea_number: Número CREA
            state: UF do registro

        Returns:
            Dict com atribuições técnicas
        """
        # TODO: Implementar integração real
        # Atribuições técnicas definem o que o profissional pode fazer
        # conforme sua formação e registro no CREA
        return {
            'crea_number': crea_number,
            'state': state,
            'attributions': [],
            'modality': None,
            'can_sign_projects': False,
            'can_supervise_works': False,
            'allowed_activities': [],
            'status': 'pending_integration',
            'integration_ready': False
        }

    def _search_professional(self, params: Dict) -> Dict[str, Any]:
        """
        Busca profissional por nome ou número.

        Args:
            params: Parâmetros de busca (name, crea_number, state, modality)

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

    def _validate_art(self, art_number: str, state: str, params: Dict) -> Dict[str, Any]:
        """
        Valida ART (Anotação de Responsabilidade Técnica).

        Args:
            art_number: Número da ART
            state: UF do registro
            params: Dados adicionais (crea_number, project_type, etc)

        Returns:
            Dict com validação da ART
        """
        # TODO: Implementar validação de ART
        # ART é o documento que registra a responsabilidade técnica
        # de um profissional sobre uma obra/projeto/serviço
        return {
            'valid': False,
            'art_number': art_number,
            'state': state,
            'crea_number': params.get('crea_number'),
            'professional_name': None,
            'project_type': None,
            'activity': None,
            'date': None,
            'status': 'pending_integration',
            'integration_ready': False
        }

    # Métodos públicos de conveniência

    def validate_registration(self, crea_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Valida registro CREA.

        Args:
            crea_number: Número CREA
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados da validação
        """
        return self.execute(
            identifier=crea_number,
            request_type=self.REQUEST_TYPE_VALIDATE,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_professional_data(self, crea_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém dados completos do profissional.

        Args:
            crea_number: Número CREA
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados do profissional
        """
        return self.execute(
            identifier=crea_number,
            request_type=self.REQUEST_TYPE_PROFESSIONAL_DATA,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_technical_attributions(self, crea_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém atribuições técnicas do profissional.

        Args:
            crea_number: Número CREA
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com atribuições
        """
        return self.execute(
            identifier=crea_number,
            request_type=self.REQUEST_TYPE_TECHNICAL_ATTRIBUTIONS,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def search_by_name(self, name: str, state: Optional[str] = None,
                       modality: Optional[str] = None, force_refresh: bool = False) -> tuple:
        """
        Busca profissional por nome.

        Args:
            name: Nome do profissional
            state: UF (opcional)
            modality: Filtrar por modalidade (opcional)
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com resultados
        """
        params = {'name': name}
        if state:
            params['state'] = state.upper()
        if modality:
            params['modality'] = modality

        return self.execute(
            identifier=name,
            request_type=self.REQUEST_TYPE_SEARCH,
            params=params,
            force_refresh=force_refresh
        )

    def validate_art(self, art_number: str, state: str, crea_number: Optional[str] = None,
                    force_refresh: bool = False) -> tuple:
        """
        Valida ART (Anotação de Responsabilidade Técnica).

        Args:
            art_number: Número da ART
            state: UF (ex: 'SP')
            crea_number: Número CREA do profissional (opcional)
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com validação
        """
        params = {'state': state.upper()}
        if crea_number:
            params['crea_number'] = crea_number

        return self.execute(
            identifier=art_number,
            request_type=self.REQUEST_TYPE_VALIDATE_ART,
            params=params,
            force_refresh=force_refresh
        )
