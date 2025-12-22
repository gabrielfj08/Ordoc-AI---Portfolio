"""
Pattern Matching - Sistema SIMPLES de matching de padrões.

Em vez de JSONLogic complexo, usa regras simples e diretas:
- Tipo de documento
- Campos específicos
- Valores regex
- Condições básicas

Princípio: "Simple rules that actually work > Complex system that nobody uses"
"""
import re
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger('intelligence.matchers')


class SimplePatternMatcher:
    """
    Matcher de padrões usando regras simples.

    Suporta:
    - document_type: tipo exato ou wildcard
    - field_contains: texto contém valor
    - field_matches: regex match
    - field_equals: igualdade exata
    """

    def match(self, pattern: Dict[str, Any], document_data: Dict[str, Any]) -> bool:
        """
        Verifica se um padrão aplica a um documento.

        Args:
            pattern: Dicionário com a condição do padrão
            document_data: Dados do documento para avaliar

        Returns:
            True se o padrão se aplica, False caso contrário
        """
        try:
            condition = pattern.get('condition', {})

            # Regra 1: document_type
            if 'document_type' in condition:
                expected_type = condition['document_type']
                actual_type = document_data.get('document_type', '')

                # Suporta wildcard
                if expected_type != '*' and expected_type != actual_type:
                    return False

            # Regra 2: trigger (quando o padrão deve ser verificado)
            if 'trigger' in condition:
                trigger = condition['trigger']
                current_trigger = document_data.get('trigger', 'on_create')

                if trigger != current_trigger:
                    return False

            # Regra 3: field_contains (campo contém texto)
            if 'field_contains' in condition:
                for field, value in condition['field_contains'].items():
                    field_value = str(document_data.get(field, '')).lower()
                    search_value = str(value).lower()

                    if search_value not in field_value:
                        return False

            # Regra 4: field_matches (campo match regex)
            if 'field_matches' in condition:
                for field, regex_pattern in condition['field_matches'].items():
                    field_value = str(document_data.get(field, ''))

                    if not re.search(regex_pattern, field_value, re.IGNORECASE):
                        return False

            # Regra 5: field_equals (igualdade exata)
            if 'field_equals' in condition:
                for field, expected_value in condition['field_equals'].items():
                    actual_value = document_data.get(field)

                    if actual_value != expected_value:
                        return False

            # Regra 6: min_confidence (confiança mínima de extração)
            if 'min_confidence' in condition:
                min_conf = condition['min_confidence']
                actual_conf = document_data.get('confidence', 1.0)

                if actual_conf < min_conf:
                    return False

            # Se passou por todas as regras, o padrão se aplica
            return True

        except Exception as e:
            logger.warning(f"Erro ao avaliar padrão: {e}")
            return False

    def match_all(
        self,
        patterns: List[Dict[str, Any]],
        document_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Encontra todos os padrões que se aplicam a um documento.

        Args:
            patterns: Lista de padrões
            document_data: Dados do documento

        Returns:
            Lista de padrões que matched
        """
        matched = []

        for pattern in patterns:
            if self.match(pattern, document_data):
                matched.append(pattern)

        logger.debug(f"Pattern matching: {len(matched)}/{len(patterns)} matched")
        return matched


class PatternBuilder:
    """
    Helper para construir padrões de forma programática.

    Facilita a criação de padrões sem precisar montar JSON manualmente.
    """

    @staticmethod
    def for_document_type(
        document_type: str,
        suggestion_message: str,
        field_contains: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Cria padrão simples para tipo de documento.

        Example:
            pattern = PatternBuilder.for_document_type(
                'contract',
                'Revisar cláusula de rescisão',
                field_contains={'content': 'rescisão'}
            )
        """
        condition = {'document_type': document_type, 'trigger': 'on_create'}

        if field_contains:
            condition['field_contains'] = field_contains

        return {
            'condition': condition,
            'action': {
                'type': 'suggestion',
                'message': suggestion_message,
                'auto_applicable': False
            }
        }

    @staticmethod
    def for_common_correction(
        document_type: str,
        field_name: str,
        suggested_value: str,
        confidence: float = 0.8
    ) -> Dict[str, Any]:
        """
        Cria padrão para correção comum.

        Example:
            pattern = PatternBuilder.for_common_correction(
                'invoice',
                'payment_term',
                '30 dias',
                confidence=0.9
            )
        """
        return {
            'condition': {
                'document_type': document_type,
                'trigger': 'on_create'
            },
            'action': {
                'type': 'auto_fill',
                'field': field_name,
                'value': suggested_value,
                'message': f'Geralmente o campo "{field_name}" é preenchido com "{suggested_value}"',
                'auto_applicable': confidence >= 0.9  # Só auto-aplica se confiança >= 90%
            }
        }

    @staticmethod
    def for_compliance_check(
        document_type: str,
        required_fields: List[str],
        severity: str = 'warning'
    ) -> Dict[str, Any]:
        """
        Cria padrão para verificação de compliance.

        Example:
            pattern = PatternBuilder.for_compliance_check(
                'contract',
                ['parties', 'value', 'signature_date'],
                severity='error'
            )
        """
        return {
            'condition': {
                'document_type': document_type,
                'trigger': 'on_save'
            },
            'action': {
                'type': 'compliance_check',
                'required_fields': required_fields,
                'message': f'Verificar campos obrigatórios: {", ".join(required_fields)}',
                'severity': severity,
                'auto_applicable': False
            }
        }


# Exemplos de padrões pré-definidos úteis
BUILTIN_PATTERNS = [
    # Padrão 1: Contratos devem ter cláusula de rescisão
    {
        'layer': 'platform',
        'pattern_type': 'compliance',
        'name': 'Verificar cláusula de rescisão em contratos',
        'condition': {
            'document_type': 'contract',
            'trigger': 'on_create',
            'field_contains': {'content': 'contrato'}
        },
        'action': {
            'type': 'suggestion',
            'message': 'Contratos devem incluir cláusula de rescisão. Verifique se está presente.',
            'auto_applicable': False
        },
        'confidence': 0.8
    },

    # Padrão 2: Documentos financeiros com valores altos
    {
        'layer': 'platform',
        'pattern_type': 'compliance',
        'name': 'Valores altos requerem aprovação',
        'condition': {
            'document_type': 'financial',
            'trigger': 'on_create',
            'field_matches': {'value': r'R\$\s*[1-9][0-9]{5,}'}  # R$ 100k+
        },
        'action': {
            'type': 'approval_required',
            'message': 'Documentos financeiros acima de R$ 100.000 requerem aprovação do diretor.',
            'auto_applicable': False
        },
        'confidence': 0.9
    },

    # Padrão 3: LGPD - Documentos com dados sensíveis
    {
        'layer': 'platform',
        'pattern_type': 'compliance',
        'name': 'Dados sensíveis - LGPD',
        'condition': {
            'trigger': 'on_create',
            'field_contains': {
                'content': 'cpf|rg|dados pessoais|endereço|telefone'
            }
        },
        'action': {
            'type': 'suggestion',
            'message': 'Documento contém dados pessoais. Verifique conformidade com LGPD.',
            'auto_applicable': False
        },
        'confidence': 0.7
    }
]


def get_builtin_patterns() -> List[Dict[str, Any]]:
    """Retorna padrões pré-definidos úteis."""
    return BUILTIN_PATTERNS.copy()
