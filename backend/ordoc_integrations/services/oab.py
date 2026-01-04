"""
Serviço de Integração - OAB (Ordem dos Advogados do Brasil)

Validação de licenças profissionais de advogados.
"""

import re
from typing import Dict, Any, Optional
from .base import BaseIntegrationService, IntegrationException


class OABService(BaseIntegrationService):
    """
    Serviço para validação de inscrições OAB e consulta de dados de advogados.

    Funcionalidades:
    - Validação de número OAB por UF
    - Consulta de situação cadastral (ativo/cancelado/suspenso)
    - Dados do advogado (nome, CPF, data de inscrição)
    - Busca por nome ou número OAB
    - Validação de documentos assinados por advogados

    Exemplo de uso:
        >>> service = OABService(organization_id=1, user_id=1)
        >>> data, request = service.validate_registration('123456', 'SP')
        >>> print(data['valid'])  # True/False
        >>> print(data['name'])   # 'João Silva'
    """

    # Tipos de requisição
    REQUEST_TYPE_VALIDATE = 'validate'
    REQUEST_TYPE_PROFESSIONAL_DATA = 'professional_data'
    REQUEST_TYPE_SEARCH = 'search'
    REQUEST_TYPE_DOCUMENT_VALIDATION = 'document_validation'

    # Estados brasileiros (UFs)
    VALID_STATES = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa o serviço OAB.

        Args:
            organization_id: ID da organização (multi-tenancy)
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='oab',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida formato do número OAB.

        Args:
            identifier: Número OAB (apenas dígitos)

        Returns:
            bool: True se válido
        """
        if not identifier:
            return False

        # Remove caracteres não numéricos
        clean = re.sub(r'\D', '', identifier)

        # OAB geralmente tem 4-8 dígitos
        return len(clean) >= 4 and len(clean) <= 8 and clean.isdigit()

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
        Executa requisição à API da OAB.

        Args:
            identifier: Número OAB
            request_type: Tipo de requisição
            params: Parâmetros adicionais (state, etc)

        Returns:
            Dict com dados do advogado

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

        elif request_type == self.REQUEST_TYPE_SEARCH:
            return self._search_professional(params)

        elif request_type == self.REQUEST_TYPE_DOCUMENT_VALIDATION:
            return self._validate_document(identifier, state, params)

        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_registration(self, oab_number: str, state: str) -> Dict[str, Any]:
        """
        Valida inscrição OAB.

        IMPORTANTE: Esta é uma implementação base/template.
        Substituir pela integração real com API da OAB quando disponível.

        Args:
            oab_number: Número OAB
            state: UF do registro

        Returns:
            Dict com resultado da validação
        """
        # TODO: Integrar com API real da OAB
        # Possíveis fontes:
        # - API OAB Nacional (se disponível)
        # - APIs das seccionais estaduais
        # - Web scraping (último recurso, menos confiável)

        # Por enquanto, retorna estrutura base para testes
        return {
            'valid': False,  # Será True quando integração real estiver ativa
            'oab_number': oab_number,
            'state': state,
            'status': 'pending_integration',
            'message': 'Integração com API OAB em desenvolvimento',
            'integration_ready': False
        }

    def _get_professional_data(self, oab_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém dados completos do advogado.

        Args:
            oab_number: Número OAB
            state: UF do registro

        Returns:
            Dict com dados do profissional
        """
        # TODO: Implementar integração real
        return {
            'oab_number': oab_number,
            'state': state,
            'name': None,
            'cpf': None,
            'registration_date': None,
            'status': 'pending_integration',
            'specializations': [],
            'entity': None,  # OAB/SP, OAB/RJ, etc
            'integration_ready': False
        }

    def _search_professional(self, params: Dict) -> Dict[str, Any]:
        """
        Busca advogado por nome ou número.

        Args:
            params: Parâmetros de busca (name, oab_number, state)

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

    def _validate_document(self, oab_number: str, state: str, params: Dict) -> Dict[str, Any]:
        """
        Valida documento assinado por advogado.

        Args:
            oab_number: Número OAB do signatário
            state: UF do registro
            params: Dados do documento

        Returns:
            Dict com validação do documento
        """
        # TODO: Implementar validação de assinatura
        return {
            'valid': False,
            'oab_number': oab_number,
            'state': state,
            'authorized': False,
            'status': 'pending_integration',
            'integration_ready': False
        }

    # Métodos públicos de conveniência

    def validate_registration(self, oab_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Valida registro OAB.

        Args:
            oab_number: Número OAB
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados da validação
        """
        return self.execute(
            identifier=oab_number,
            request_type=self.REQUEST_TYPE_VALIDATE,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_professional_data(self, oab_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém dados completos do advogado.

        Args:
            oab_number: Número OAB
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados do profissional
        """
        return self.execute(
            identifier=oab_number,
            request_type=self.REQUEST_TYPE_PROFESSIONAL_DATA,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def search_by_name(self, name: str, state: Optional[str] = None, force_refresh: bool = False) -> tuple:
        """
        Busca advogado por nome.

        Args:
            name: Nome do advogado
            state: UF (opcional)
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com resultados
        """
        params = {'name': name}
        if state:
            params['state'] = state.upper()

        return self.execute(
            identifier=name,
            request_type=self.REQUEST_TYPE_SEARCH,
            params=params,
            force_refresh=force_refresh
        )
