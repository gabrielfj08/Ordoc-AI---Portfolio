"""
Integração com TSE - Tribunal Superior Eleitoral

Serviço de consulta de situação eleitoral de cidadãos brasileiros
API Pública do TSE para verificação de dados cadastrais e situação regular perante a Justiça Eleitoral
"""

import logging
from typing import Dict, Any, Optional
from datetime import datetime

from .base import BaseIntegrationService, IntegrationException
from ordoc_integrations.utils import clean_cpf, format_cpf, validate_cpf

logger = logging.getLogger(__name__)


class TSEService(BaseIntegrationService):
    """
    Serviço de integração com TSE (Tribunal Superior Eleitoral)

    Funcionalidades:
    - Consulta de situação eleitoral (regular/irregular)
    - Verificação de título de eleitor
    - Consulta de zona e seção eleitoral
    - Histórico de comparecimento às eleições

    API Base: https://api.tse.jus.br (dados públicos)
    Autenticação: Nenhuma (API pública)
    Rate Limit: 100 req/min (configurável)
    """

    # Tipos de requisição suportados
    REQUEST_TYPE_VOTER_STATUS = 'voter_status'
    REQUEST_TYPE_ELECTION_HISTORY = 'election_history'
    REQUEST_TYPE_REGISTRATION_DATA = 'registration_data'

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa serviço TSE

        Args:
            organization_id: ID da organização
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='tse',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida CPF (identificador usado pelo TSE)

        Args:
            identifier: CPF do eleitor

        Returns:
            bool: True se CPF válido
        """
        cleaned_cpf = clean_cpf(identifier)
        return validate_cpf(cleaned_cpf)

    def _make_request(
        self,
        identifier: str,
        request_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Faz requisição à API do TSE

        Args:
            identifier: CPF do eleitor
            request_type: Tipo de consulta
            params: Parâmetros adicionais

        Returns:
            Dict com dados da situação eleitoral

        Raises:
            IntegrationException: Em caso de erro
        """
        cleaned_cpf = clean_cpf(identifier)

        if request_type == self.REQUEST_TYPE_VOTER_STATUS:
            return self._get_voter_status(cleaned_cpf)
        elif request_type == self.REQUEST_TYPE_ELECTION_HISTORY:
            return self._get_election_history(cleaned_cpf)
        elif request_type == self.REQUEST_TYPE_REGISTRATION_DATA:
            return self._get_registration_data(cleaned_cpf)
        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _get_voter_status(self, cpf: str) -> Dict[str, Any]:
        """
        Consulta situação eleitoral do cidadão

        Args:
            cpf: CPF limpo (apenas números)

        Returns:
            Dict com situação eleitoral
        """
        try:
            # Endpoint TSE para consulta de situação
            url = f"{self.base_url}/voter-status"

            response = self.session.get(
                url,
                params={'cpf': cpf},
                timeout=self.timeout
            )

            if response.status_code == 200:
                data = response.json()
                return self._normalize_voter_status(cpf, data)
            elif response.status_code == 404:
                # CPF não encontrado na base do TSE
                return self._create_not_found_response(cpf)
            elif response.status_code == 429:
                raise IntegrationException("Rate limit excedido na API do TSE")
            else:
                raise IntegrationException(
                    f"Erro ao consultar TSE: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao consultar TSE: {str(e)}")
            raise IntegrationException(f"Erro ao consultar situação eleitoral: {str(e)}")

    def _get_election_history(self, cpf: str) -> Dict[str, Any]:
        """
        Consulta histórico de comparecimento às eleições

        Args:
            cpf: CPF limpo

        Returns:
            Dict com histórico eleitoral
        """
        try:
            url = f"{self.base_url}/election-history"

            response = self.session.get(
                url,
                params={'cpf': cpf},
                timeout=self.timeout
            )

            if response.status_code == 200:
                data = response.json()
                return self._normalize_election_history(cpf, data)
            elif response.status_code == 404:
                return self._create_not_found_response(cpf, 'election_history')
            else:
                raise IntegrationException(
                    f"Erro ao consultar histórico eleitoral: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao consultar histórico eleitoral: {str(e)}")
            raise IntegrationException(f"Erro ao consultar histórico: {str(e)}")

    def _get_registration_data(self, cpf: str) -> Dict[str, Any]:
        """
        Consulta dados cadastrais do eleitor

        Args:
            cpf: CPF limpo

        Returns:
            Dict com dados cadastrais
        """
        try:
            url = f"{self.base_url}/registration-data"

            response = self.session.get(
                url,
                params={'cpf': cpf},
                timeout=self.timeout
            )

            if response.status_code == 200:
                data = response.json()
                return self._normalize_registration_data(cpf, data)
            elif response.status_code == 404:
                return self._create_not_found_response(cpf, 'registration_data')
            else:
                raise IntegrationException(
                    f"Erro ao consultar dados cadastrais: HTTP {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Erro ao consultar dados cadastrais: {str(e)}")
            raise IntegrationException(f"Erro ao consultar cadastro: {str(e)}")

    def _normalize_voter_status(self, cpf: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normaliza resposta de situação eleitoral

        Args:
            cpf: CPF
            data: Dados brutos da API

        Returns:
            Dict normalizado
        """
        return {
            'valid': True,
            'cpf': format_cpf(cpf),
            'request_type': 'voter_status',
            'source': 'TSE',
            'voter_status': {
                'regular': data.get('regular', False),
                'status': data.get('status'),  # 'regular', 'irregular', 'cancelado', 'suspenso'
                'status_description': data.get('status_description'),
                'inscription_number': data.get('inscription_number'),  # Número do título
                'zone': data.get('zone'),
                'section': data.get('section'),
                'municipality': data.get('municipality'),
                'state': data.get('state'),
            },
            'voter_info': {
                'name': data.get('name'),
                'birth_date': data.get('birth_date'),
                'mother_name': data.get('mother_name'),
            },
            'consulted_at': datetime.now().isoformat(),
            'metadata': {
                'last_update': data.get('last_update'),
                'data_source': 'TSE - Tribunal Superior Eleitoral',
            }
        }

    def _normalize_election_history(self, cpf: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normaliza resposta de histórico eleitoral

        Args:
            cpf: CPF
            data: Dados brutos da API

        Returns:
            Dict normalizado
        """
        elections = data.get('elections', [])

        return {
            'valid': True,
            'cpf': format_cpf(cpf),
            'request_type': 'election_history',
            'source': 'TSE',
            'history': {
                'total_elections': len(elections),
                'elections': [
                    {
                        'year': election.get('year'),
                        'round': election.get('round'),
                        'election_type': election.get('type'),  # 'municipal', 'estadual', 'federal'
                        'attendance': election.get('attendance'),  # True/False
                        'justification': election.get('justification'),
                    }
                    for election in elections
                ],
                'attendance_rate': data.get('attendance_rate', 0),
                'total_absences': data.get('total_absences', 0),
                'has_pending_justifications': data.get('has_pending_justifications', False),
            },
            'consulted_at': datetime.now().isoformat(),
        }

    def _normalize_registration_data(self, cpf: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normaliza resposta de dados cadastrais

        Args:
            cpf: CPF
            data: Dados brutos da API

        Returns:
            Dict normalizado
        """
        return {
            'valid': True,
            'cpf': format_cpf(cpf),
            'request_type': 'registration_data',
            'source': 'TSE',
            'registration': {
                'inscription_number': data.get('inscription_number'),
                'inscription_date': data.get('inscription_date'),
                'zone': data.get('zone'),
                'section': data.get('section'),
                'polling_place': data.get('polling_place'),
                'address': {
                    'street': data.get('address', {}).get('street'),
                    'number': data.get('address', {}).get('number'),
                    'complement': data.get('address', {}).get('complement'),
                    'neighborhood': data.get('address', {}).get('neighborhood'),
                    'city': data.get('address', {}).get('city'),
                    'state': data.get('address', {}).get('state'),
                    'zip_code': data.get('address', {}).get('zip_code'),
                },
            },
            'personal_data': {
                'name': data.get('name'),
                'birth_date': data.get('birth_date'),
                'mother_name': data.get('mother_name'),
                'father_name': data.get('father_name'),
            },
            'consulted_at': datetime.now().isoformat(),
        }

    def _create_not_found_response(self, cpf: str, request_type: str = 'voter_status') -> Dict[str, Any]:
        """
        Cria resposta padronizada para CPF não encontrado

        Args:
            cpf: CPF
            request_type: Tipo de requisição

        Returns:
            Dict com resposta de não encontrado
        """
        return {
            'valid': False,
            'cpf': format_cpf(cpf),
            'request_type': request_type,
            'source': 'TSE',
            'found': False,
            'message': 'CPF não encontrado na base de dados do TSE',
            'consulted_at': datetime.now().isoformat(),
        }

    # --- Métodos de conveniência ---

    def check_voter_status(self, cpf: str, force_refresh: bool = False):
        """
        Verifica situação eleitoral

        Args:
            cpf: CPF do eleitor
            force_refresh: Forçar atualização do cache

        Returns:
            Tuple[dados, request]: Dados e objeto de requisição
        """
        return self.execute(
            identifier=cpf,
            request_type=self.REQUEST_TYPE_VOTER_STATUS,
            force_refresh=force_refresh
        )

    def get_election_history(self, cpf: str, force_refresh: bool = False):
        """
        Obtém histórico de comparecimento

        Args:
            cpf: CPF do eleitor
            force_refresh: Forçar atualização do cache

        Returns:
            Tuple[dados, request]: Dados e objeto de requisição
        """
        return self.execute(
            identifier=cpf,
            request_type=self.REQUEST_TYPE_ELECTION_HISTORY,
            force_refresh=force_refresh
        )

    def get_registration_data(self, cpf: str, force_refresh: bool = False):
        """
        Obtém dados cadastrais do eleitor

        Args:
            cpf: CPF do eleitor
            force_refresh: Forçar atualização do cache

        Returns:
            Tuple[dados, request]: Dados e objeto de requisição
        """
        return self.execute(
            identifier=cpf,
            request_type=self.REQUEST_TYPE_REGISTRATION_DATA,
            force_refresh=force_refresh
        )
