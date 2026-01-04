"""
Serviço de Integração - CRO (Conselho Regional de Odontologia)

Validação de licenças profissionais de dentistas.
"""

import re
from typing import Dict, Any, Optional
from .base import BaseIntegrationService, IntegrationException


class CROService(BaseIntegrationService):
    """
    Serviço para validação de inscrições CRO e consulta de dados de dentistas.

    Funcionalidades:
    - Validação de número CRO por UF
    - Consulta de situação cadastral (ativo/cancelado/suspenso)
    - Dados do dentista (nome, CPF, especialidades)
    - Busca por nome ou número CRO
    - Validação de atestados odontológicos

    Exemplo de uso:
        >>> service = CROService(organization_id=1, user_id=1)
        >>> data, request = service.validate_registration('123456', 'SP')
        >>> print(data['valid'])  # True/False
        >>> print(data['specialties'])  # ['Ortodontia', 'Implantodontia']
    """

    # Tipos de requisição
    REQUEST_TYPE_VALIDATE = 'validate'
    REQUEST_TYPE_PROFESSIONAL_DATA = 'professional_data'
    REQUEST_TYPE_SPECIALTIES = 'specialties'
    REQUEST_TYPE_SEARCH = 'search'
    REQUEST_TYPE_VALIDATE_CERTIFICATE = 'validate_certificate'

    # Estados brasileiros (UFs)
    VALID_STATES = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa o serviço CRO.

        Args:
            organization_id: ID da organização (multi-tenancy)
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='cro',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida formato do número CRO.

        Args:
            identifier: Número CRO (apenas dígitos)

        Returns:
            bool: True se válido
        """
        if not identifier:
            return False

        # Remove caracteres não numéricos
        clean = re.sub(r'\D', '', identifier)

        # CRO geralmente tem 4-6 dígitos
        return len(clean) >= 4 and len(clean) <= 7 and clean.isdigit()

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
        Executa requisição à API do CRO.

        Args:
            identifier: Número CRO
            request_type: Tipo de requisição
            params: Parâmetros adicionais (state, etc)

        Returns:
            Dict com dados do dentista

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

        elif request_type == self.REQUEST_TYPE_VALIDATE_CERTIFICATE:
            return self._validate_certificate(identifier, state, params)

        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_registration(self, cro_number: str, state: str) -> Dict[str, Any]:
        """
        Valida inscrição CRO.

        IMPORTANTE: Esta é uma implementação base/template.
        Substituir pela integração real com API do CFO/CRO quando disponível.

        Args:
            cro_number: Número CRO
            state: UF do registro

        Returns:
            Dict com resultado da validação
        """
        # TODO: Integrar com API real do CFO/CRO
        # Possíveis fontes:
        # - API CFO (Conselho Federal de Odontologia)
        # - APIs dos CROs estaduais
        # - Portal CFO

        return {
            'valid': False,  # Será True quando integração real estiver ativa
            'cro_number': cro_number,
            'state': state,
            'status': 'pending_integration',
            'message': 'Integração com API CRO em desenvolvimento',
            'integration_ready': False
        }

    def _get_professional_data(self, cro_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém dados completos do dentista.

        Args:
            cro_number: Número CRO
            state: UF do registro

        Returns:
            Dict com dados do profissional
        """
        # TODO: Implementar integração real
        return {
            'cro_number': cro_number,
            'state': state,
            'name': None,
            'cpf': None,
            'registration_date': None,
            'status': 'pending_integration',
            'situation': None,  # 'ATIVO', 'CANCELADO', 'SUSPENSO'
            'entity': None,  # CRO-SP, CRO-RJ, etc
            'inscription_type': None,  # 'Principal', 'Secundária'
            'integration_ready': False
        }

    def _get_specialties(self, cro_number: str, state: str) -> Dict[str, Any]:
        """
        Obtém especialidades do dentista.

        Args:
            cro_number: Número CRO
            state: UF do registro

        Returns:
            Dict com especialidades odontológicas
        """
        # TODO: Implementar integração real
        # Especialidades comuns: Ortodontia, Endodontia, Periodontia,
        # Implantodontia, Cirurgia Bucomaxilofacial, etc.
        return {
            'cro_number': cro_number,
            'state': state,
            'specialties': [],
            'primary_specialty': None,
            'certifications': [],
            'status': 'pending_integration',
            'integration_ready': False
        }

    def _search_professional(self, params: Dict) -> Dict[str, Any]:
        """
        Busca dentista por nome ou número.

        Args:
            params: Parâmetros de busca (name, cro_number, state, specialty)

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

    def _validate_certificate(self, cro_number: str, state: str, params: Dict) -> Dict[str, Any]:
        """
        Valida atestado odontológico.

        Args:
            cro_number: Número CRO do dentista
            state: UF do registro
            params: Dados do documento (tipo, data, etc)

        Returns:
            Dict com validação do documento
        """
        # TODO: Implementar validação de atestado
        return {
            'valid': False,
            'cro_number': cro_number,
            'state': state,
            'authorized': False,
            'document_type': params.get('document_type'),  # 'atestado', 'laudo'
            'status': 'pending_integration',
            'integration_ready': False
        }

    # Métodos públicos de conveniência

    def validate_registration(self, cro_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Valida registro CRO.

        Args:
            cro_number: Número CRO
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados da validação
        """
        return self.execute(
            identifier=cro_number,
            request_type=self.REQUEST_TYPE_VALIDATE,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_professional_data(self, cro_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém dados completos do dentista.

        Args:
            cro_number: Número CRO
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados do profissional
        """
        return self.execute(
            identifier=cro_number,
            request_type=self.REQUEST_TYPE_PROFESSIONAL_DATA,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_specialties(self, cro_number: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém especialidades do dentista.

        Args:
            cro_number: Número CRO
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com especialidades
        """
        return self.execute(
            identifier=cro_number,
            request_type=self.REQUEST_TYPE_SPECIALTIES,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def search_by_name(self, name: str, state: Optional[str] = None,
                       specialty: Optional[str] = None, force_refresh: bool = False) -> tuple:
        """
        Busca dentista por nome.

        Args:
            name: Nome do dentista
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

    def validate_certificate(self, cro_number: str, state: str,
                           document_type: str = 'atestado', force_refresh: bool = False) -> tuple:
        """
        Valida atestado ou laudo odontológico.

        Args:
            cro_number: Número CRO
            state: UF (ex: 'SP')
            document_type: Tipo ('atestado' ou 'laudo')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com validação
        """
        return self.execute(
            identifier=cro_number,
            request_type=self.REQUEST_TYPE_VALIDATE_CERTIFICATE,
            params={
                'state': state.upper(),
                'document_type': document_type
            },
            force_refresh=force_refresh
        )
