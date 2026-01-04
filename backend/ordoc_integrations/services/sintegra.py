"""
Serviço de Integração - SINTEGRA
Sistema Integrado de Informações sobre Operações Interestaduais com Mercadorias

Consulta de inscrição estadual e situação cadastral de empresas.
"""

import re
from typing import Dict, Any, Optional
from .base import BaseIntegrationService, IntegrationException


class SINTEGRAService(BaseIntegrationService):
    """
    Serviço para consulta de inscrição estadual via SINTEGRA.

    Funcionalidades:
    - Consulta de inscrição estadual
    - Validação de situação cadastral (ativo/baixado/suspenso)
    - Dados cadastrais de empresas por estado
    - Histórico de alterações cadastrais
    - Suporte a todos os 27 estados (APIs diferentes)

    IMPORTANTE: Cada estado brasileiro possui sua própria API SINTEGRA
    com formatos e endpoints diferentes.

    Uso estratégico:
    - Validação de empresas em processos licitatórios
    - Verificação de regularidade fiscal estadual
    - Autenticação de documentos empresariais
    - Apoio a operações comerciais interestaduais

    Exemplo de uso:
        >>> service = SINTEGRAService(organization_id=1, user_id=1)
        >>> data, request = service.validate_ie('123456789', 'SP')
        >>> print(data['valid'])  # True/False
        >>> print(data['razao_social'])  # Nome da empresa
    """

    # Tipos de requisição
    REQUEST_TYPE_VALIDATE = 'validate'
    REQUEST_TYPE_EMPRESA = 'empresa'
    REQUEST_TYPE_HISTORY = 'history'

    # Estados brasileiros com seus códigos
    STATES = {
        'AC': {'name': 'Acre', 'ie_format': r'^\d{13}$'},
        'AL': {'name': 'Alagoas', 'ie_format': r'^\d{9}$'},
        'AP': {'name': 'Amapá', 'ie_format': r'^\d{9}$'},
        'AM': {'name': 'Amazonas', 'ie_format': r'^\d{9}$'},
        'BA': {'name': 'Bahia', 'ie_format': r'^\d{8,9}$'},
        'CE': {'name': 'Ceará', 'ie_format': r'^\d{9}$'},
        'DF': {'name': 'Distrito Federal', 'ie_format': r'^\d{13}$'},
        'ES': {'name': 'Espírito Santo', 'ie_format': r'^\d{9}$'},
        'GO': {'name': 'Goiás', 'ie_format': r'^\d{9}$'},
        'MA': {'name': 'Maranhão', 'ie_format': r'^\d{9}$'},
        'MT': {'name': 'Mato Grosso', 'ie_format': r'^\d{11}$'},
        'MS': {'name': 'Mato Grosso do Sul', 'ie_format': r'^\d{9}$'},
        'MG': {'name': 'Minas Gerais', 'ie_format': r'^\d{13}$'},
        'PA': {'name': 'Pará', 'ie_format': r'^\d{9}$'},
        'PB': {'name': 'Paraíba', 'ie_format': r'^\d{9}$'},
        'PR': {'name': 'Paraná', 'ie_format': r'^\d{10}$'},
        'PE': {'name': 'Pernambuco', 'ie_format': r'^\d{9}$'},
        'PI': {'name': 'Piauí', 'ie_format': r'^\d{9}$'},
        'RJ': {'name': 'Rio de Janeiro', 'ie_format': r'^\d{8}$'},
        'RN': {'name': 'Rio Grande do Norte', 'ie_format': r'^\d{9,10}$'},
        'RS': {'name': 'Rio Grande do Sul', 'ie_format': r'^\d{10}$'},
        'RO': {'name': 'Rondônia', 'ie_format': r'^\d{14}$'},
        'RR': {'name': 'Roraima', 'ie_format': r'^\d{9}$'},
        'SC': {'name': 'Santa Catarina', 'ie_format': r'^\d{9}$'},
        'SP': {'name': 'São Paulo', 'ie_format': r'^\d{12}$'},
        'SE': {'name': 'Sergipe', 'ie_format': r'^\d{9}$'},
        'TO': {'name': 'Tocantins', 'ie_format': r'^\d{11}$'}
    }

    # URLs base dos SINTEGRAs estaduais (alguns exemplos)
    # TODO: Completar com todas as URLs oficiais
    STATE_URLS = {
        'AC': 'http://www.sefaz.ac.gov.br/sintegra',
        'AL': 'http://www.sefaz.al.gov.br/sintegra',
        'SP': 'https://www.fazenda.sp.gov.br/sintegra',
        'RJ': 'http://www4.fazenda.rj.gov.br/sintegra-web',
        'MG': 'http://www8.fazenda.mg.gov.br/sintegra',
        'PR': 'http://www.fazenda.pr.gov.br/sintegra',
        'RS': 'https://www.sefaz.rs.gov.br/sat/sintegra',
        # Adicionar os demais estados conforme necessário
    }

    def __init__(self, organization_id: Optional[int] = None, user_id: Optional[int] = None):
        """
        Inicializa o serviço SINTEGRA.

        Args:
            organization_id: ID da organização (multi-tenancy)
            user_id: ID do usuário fazendo a requisição
        """
        super().__init__(
            service_type='sintegra',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        """
        Valida formato básico da inscrição estadual.

        Args:
            identifier: Número da inscrição estadual

        Returns:
            bool: True se válido
        """
        if not identifier:
            return False

        # Remove caracteres não numéricos
        clean = re.sub(r'\D', '', identifier)

        # IE geralmente tem 8-14 dígitos dependendo do estado
        return len(clean) >= 8 and len(clean) <= 14 and clean.isdigit()

    def validate_state(self, state: str) -> bool:
        """
        Valida se a UF é válida.

        Args:
            state: Sigla do estado (ex: 'SP', 'RJ')

        Returns:
            bool: True se válido
        """
        return state and state.upper() in self.STATES

    def validate_ie_format(self, ie: str, state: str) -> bool:
        """
        Valida formato da IE conforme regras do estado.

        Args:
            ie: Inscrição estadual
            state: UF

        Returns:
            bool: True se formato válido para o estado
        """
        if not self.validate_state(state):
            return False

        clean_ie = re.sub(r'\D', '', ie)
        state_info = self.STATES[state.upper()]
        pattern = state_info['ie_format']

        return re.match(pattern, clean_ie) is not None

    def _make_request(self, identifier: str, request_type: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Executa requisição ao SINTEGRA estadual.

        Args:
            identifier: Inscrição estadual
            request_type: Tipo de requisição
            params: Parâmetros adicionais (state obrigatório)

        Returns:
            Dict com dados da empresa

        Raises:
            IntegrationException: Se houver erro na requisição
        """
        params = params or {}
        state = params.get('state', '').upper()

        if not self.validate_state(state):
            raise IntegrationException(f"UF inválida: {state}")

        if not self.validate_ie_format(identifier, state):
            raise IntegrationException(
                f"Formato de IE inválido para {state}. "
                f"Esperado: {self.STATES[state]['ie_format']}"
            )

        if request_type == self.REQUEST_TYPE_VALIDATE:
            return self._validate_ie(identifier, state)

        elif request_type == self.REQUEST_TYPE_EMPRESA:
            return self._get_empresa_data(identifier, state)

        elif request_type == self.REQUEST_TYPE_HISTORY:
            return self._get_history(identifier, state)

        else:
            raise IntegrationException(f"Tipo de requisição inválido: {request_type}")

    def _validate_ie(self, ie: str, state: str) -> Dict[str, Any]:
        """
        Valida inscrição estadual.

        IMPORTANTE: Implementação base/template.
        Cada estado possui sua própria API com formato diferente.

        Args:
            ie: Inscrição estadual
            state: UF

        Returns:
            Dict com resultado da validação
        """
        # TODO: Implementar integração real com cada SINTEGRA estadual
        # Desafios:
        # 1. 27 APIs diferentes (uma por estado)
        # 2. Formatos de resposta variados (alguns XML, outros JSON, outros HTML)
        # 3. Alguns estados têm captcha ou requerem autenticação
        # 4. Necessidade de normalização de dados

        return {
            'valid': False,
            'ie': ie,
            'state': state,
            'state_name': self.STATES[state]['name'],
            'status': 'pending_integration',
            'message': f'Integração com SINTEGRA {state} em desenvolvimento',
            'sintegra_url': self.STATE_URLS.get(state, 'URL não disponível'),
            'integration_ready': False
        }

    def _get_empresa_data(self, ie: str, state: str) -> Dict[str, Any]:
        """
        Obtém dados completos da empresa via SINTEGRA.

        Args:
            ie: Inscrição estadual
            state: UF

        Returns:
            Dict com dados da empresa
        """
        # TODO: Implementar integração real
        # Dados típicos retornados pelo SINTEGRA:
        # - Razão social
        # - Nome fantasia
        # - CNPJ
        # - Endereço
        # - Situação cadastral
        # - Data de início de atividades
        # - Regime de apuração

        return {
            'ie': ie,
            'state': state,
            'cnpj': None,
            'razao_social': None,
            'nome_fantasia': None,
            'situacao': None,  # 'ATIVO', 'BAIXADO', 'SUSPENSO', 'INAPTO'
            'data_inicio_atividade': None,
            'endereco': {
                'logradouro': None,
                'numero': None,
                'complemento': None,
                'bairro': None,
                'municipio': None,
                'uf': state,
                'cep': None
            },
            'regime_apuracao': None,  # 'Normal', 'Simples Nacional', etc
            'atividade_principal': None,
            'data_consulta': None,
            'status': 'pending_integration',
            'integration_ready': False
        }

    def _get_history(self, ie: str, state: str) -> Dict[str, Any]:
        """
        Obtém histórico de alterações cadastrais.

        Args:
            ie: Inscrição estadual
            state: UF

        Returns:
            Dict com histórico
        """
        # TODO: Implementar integração real
        # Alguns SINTEGRAs fornecem histórico de alterações
        return {
            'ie': ie,
            'state': state,
            'alteracoes': [],
            'count': 0,
            'status': 'pending_integration',
            'integration_ready': False
        }

    def _get_state_specific_url(self, state: str, ie: str) -> str:
        """
        Monta URL específica para consulta no SINTEGRA estadual.

        Args:
            state: UF
            ie: Inscrição estadual

        Returns:
            str: URL de consulta
        """
        base_url = self.STATE_URLS.get(state)
        if not base_url:
            return f"SINTEGRA {state} - URL não configurada"

        # Cada estado tem seu padrão de URL
        # Exemplos (simplificados):
        # SP: https://www.fazenda.sp.gov.br/sintegra/consulta.asp?ie=XXXXX
        # RJ: http://www4.fazenda.rj.gov.br/sintegra-web/consulta?ie=XXXXX
        # TODO: Implementar padrões reais de cada estado

        return f"{base_url}?ie={ie}"

    # Métodos públicos de conveniência

    def validate_ie(self, ie: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Valida inscrição estadual.

        Args:
            ie: Inscrição estadual
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com resultado da validação
        """
        return self.execute(
            identifier=ie,
            request_type=self.REQUEST_TYPE_VALIDATE,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_empresa(self, ie: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém dados completos da empresa.

        Args:
            ie: Inscrição estadual
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com dados da empresa
        """
        return self.execute(
            identifier=ie,
            request_type=self.REQUEST_TYPE_EMPRESA,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_history(self, ie: str, state: str, force_refresh: bool = False) -> tuple:
        """
        Obtém histórico de alterações cadastrais.

        Args:
            ie: Inscrição estadual
            state: UF (ex: 'SP')
            force_refresh: Ignorar cache

        Returns:
            Tupla (data, request) com histórico
        """
        return self.execute(
            identifier=ie,
            request_type=self.REQUEST_TYPE_HISTORY,
            params={'state': state.upper()},
            force_refresh=force_refresh
        )

    def get_consultation_url(self, ie: str, state: str) -> str:
        """
        Retorna URL para consulta manual no SINTEGRA estadual.

        Args:
            ie: Inscrição estadual
            state: UF

        Returns:
            str: URL de consulta
        """
        if not self.validate_state(state):
            raise IntegrationException(f"UF inválida: {state}")

        return self._get_state_specific_url(state.upper(), ie)
