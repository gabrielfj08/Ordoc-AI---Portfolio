"""
Compliance Validators - e-ARQ Brasil + Legal Hold + LGPD

Validators integrados com Council para validações de compliance
com prompts robustos e metadados ricos para Graph DB/RAG.
"""
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from django.utils import timezone

from ..core.interfaces.validator import IValidator
from ..core.entities.validation import ValidationAlert, AlertSeverity, AlertType
from ..council.ollama_client import OllamaClient

logger = logging.getLogger('intelligence.validators.compliance')


class EArqBrasilValidator(IValidator):
    """
    Validator para e-ARQ Brasil (Temporalidade Documental)

    Valida:
    - Classificação correta de documentos
    - Prazos de guarda (fase corrente + intermediária)
    - Destinação final adequada
    - Conformidade com tabela de temporalidade

    Metadados gerados para Graph DB/RAG:
    - Tipo documental sugerido
    - Código de classificação
    - Justificativa legal
    - Relações com outros documentos
    """

    def __init__(self, ollama_client: Optional[OllamaClient] = None):
        self.ollama_client = ollama_client or OllamaClient()
        self._validator_type = "e-arq_brasil"

    @property
    def validator_type(self) -> str:
        return self._validator_type

    async def validate(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> List[ValidationAlert]:
        """
        Valida documento contra e-ARQ Brasil

        Context esperado:
        - organization_id: UUID da organização
        - document_type: Tipo do documento
        - sector: Setor organizacional
        - current_retention: Retenção atual (se existir)
        """
        alerts = []

        # 1. Sugere classificação documental
        classification_alert = await self._suggest_classification(
            document_content,
            document_metadata,
            context
        )
        if classification_alert:
            alerts.append(classification_alert)

        # 2. Valida prazos de guarda
        retention_alert = await self._validate_retention_schedule(
            document_metadata,
            context
        )
        if retention_alert:
            alerts.append(retention_alert)

        # 3. Alerta documentos elegíveis para disposição
        disposition_alert = await self._check_disposition_eligibility(
            document_metadata,
            context
        )
        if disposition_alert:
            alerts.append(disposition_alert)

        return alerts

    async def _suggest_classification(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Optional[ValidationAlert]:
        """
        Sugere classificação documental usando Council

        Prompt robusto com:
        - Conteúdo completo do documento
        - Metadados organizacionais
        - Contexto setorial
        - Exemplos de classificação e-ARQ Brasil

        Metadados RAG:
        - activity: Atividade sugerida
        - code: Código de classificação
        - legal_basis: Base legal
        - justification: Justificativa completa
        """

        # Prompt robusto para o Council
        prompt = self._build_classification_prompt(
            document_content,
            document_metadata,
            context
        )

        try:
            # Chama Council para análise
            response = await self.ollama_client.generate(
                prompt=prompt,
                model="qwen2.5:7b",
                system=self._get_earq_system_prompt()
            )

            # Parse da resposta estruturada
            classification = self._parse_classification_response(response)

            if classification:
                return ValidationAlert(
                    severity=AlertSeverity.INFO,
                    alert_type=AlertType.SUGGESTION,
                    field_name='classification',
                    message=f"Classificação e-ARQ sugerida: {classification['code']} - {classification['activity']}",
                    suggestion=classification['activity'],
                    metadata={
                        # Metadados ricos para Graph DB
                        'classification_code': classification['code'],
                        'activity': classification['activity'],
                        'legal_basis': classification.get('legal_basis', ''),
                        'justification': classification.get('justification', ''),
                        'current_phase_years': classification.get('current_phase_years', 2),
                        'intermediate_phase_years': classification.get('intermediate_phase_years', 5),
                        'final_disposition': classification.get('final_disposition', 'eliminate'),

                        # Dados para busca conversacional
                        'keywords': classification.get('keywords', []),
                        'related_activities': classification.get('related_activities', []),
                        'sector_context': context.get('sector', '') if context else '',

                        # Timestamp para RAG temporal
                        'validated_at': datetime.now().isoformat(),
                        'validator': 'e-arq_brasil',
                        'confidence': classification.get('confidence', 0.85),
                    }
                )

        except Exception as e:
            logger.error(f"Erro ao sugerir classificação e-ARQ: {str(e)}")
            return None

    def _build_classification_prompt(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> str:
        """
        Constrói prompt robusto para classificação

        Não usa keywords - usa contexto completo para conversação natural
        """

        doc_title = document_metadata.get('title', 'Sem título')
        doc_type = document_metadata.get('type', 'Não especificado')
        sector = context.get('sector', 'Não especificado') if context else 'Não especificado'

        # Extrai primeiros 500 chars do conteúdo para contexto
        content_preview = document_content[:500] if document_content else "Sem conteúdo"

        return f"""# TAREFA: Classificação Documental e-ARQ Brasil

## CONTEXTO ORGANIZACIONAL
- Título do documento: {doc_title}
- Tipo de documento: {doc_type}
- Setor: {sector}

## CONTEÚDO DO DOCUMENTO (Preview)
{content_preview}...

## OBJETIVO
Analise o documento acima e sugira a classificação adequada conforme o e-ARQ Brasil (Modelo de Requisitos para Sistemas Informatizados de Gestão Arquivística de Documentos).

## INFORMAÇÕES A FORNECER

1. **Código de Classificação**: Código numérico do Plano de Classificação (ex: 020.2, 050.1, 100.3)

2. **Atividade/Tipo Documental**: Descrição da atividade que gerou o documento (ex: "Contratos de prestação de serviços", "Folhas de pagamento")

3. **Prazos de Guarda**:
   - Fase Corrente (anos): Período em que o documento permanece no arquivo corrente
   - Fase Intermediária (anos): Período no arquivo intermediário

4. **Destinação Final**: Uma das opções:
   - "eliminate": Documento pode ser eliminado após prazos
   - "permanent_custody": Guarda permanente (valor histórico/probatório)
   - "review": Necessita reavaliação antes de destinação

5. **Base Legal**: Legislação ou norma que fundamenta os prazos (ex: "Lei 8.159/1991", "Resolução CONARQ nº 14/2001")

6. **Justificativa**: Explicação detalhada do porquê desta classificação

7. **Palavras-chave**: Lista de termos relevantes para busca

8. **Atividades Relacionadas**: Outras classificações que podem ter relação

## FORMATO DE RESPOSTA (JSON)
```json
{{
  "code": "020.2",
  "activity": "Contratos de prestação de serviços",
  "current_phase_years": 5,
  "intermediate_phase_years": 5,
  "final_disposition": "eliminate",
  "legal_basis": "Lei 8.666/1993 Art. 55; Resolução CONARQ nº 14/2001",
  "justification": "Contratos devem permanecer 5 anos na fase corrente para consultas frequentes, depois 5 anos na intermediária para eventuais verificações fiscais. Após 10 anos podem ser eliminados conforme legislação.",
  "keywords": ["contrato", "prestação de serviços", "fornecedor", "licitação"],
  "related_activities": ["020.1 - Processos licitatórios", "050.2 - Pagamentos"],
  "confidence": 0.90
}}
```

Responda APENAS com o JSON, sem texto adicional."""

    def _get_earq_system_prompt(self) -> str:
        """System prompt para especialista e-ARQ Brasil"""
        return """Você é um especialista em gestão documental e arquivística, com profundo conhecimento em:

- e-ARQ Brasil (Modelo de Requisitos para Sistemas Informatizados de Gestão Arquivística de Documentos)
- Plano de Classificação de Documentos
- Tabela de Temporalidade Documental
- Lei de Arquivos (Lei 8.159/1991)
- Resoluções do CONARQ (Conselho Nacional de Arquivos)
- Gestão de documentos nas fases corrente, intermediária e permanente
- Avaliação documental e destinação final

Sua função é analisar documentos e sugerir classificações arquivísticas precisas, considerando:
1. O contexto organizacional
2. O valor primário e secundário dos documentos
3. A legislação aplicável
4. As boas práticas arquivísticas brasileiras

Seja preciso, justifique suas sugestões e cite sempre a base legal quando aplicável.
Responda sempre em português brasileiro de forma estruturada."""

    def _parse_classification_response(self, response: str) -> Optional[Dict[str, Any]]:
        """Parse da resposta JSON do modelo"""
        import json
        try:
            # Remove markdown se houver
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]

            return json.loads(response.strip())
        except Exception as e:
            logger.error(f"Erro ao fazer parse da resposta: {str(e)}")
            return None

    async def _validate_retention_schedule(
        self,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Optional[ValidationAlert]:
        """
        Valida se documento está com retenção correta

        Dados estruturados para validação:
        - retention_schedule_id
        - current_phase_end
        - intermediate_phase_end
        """

        retention_status = context.get('retention_status') if context else None
        if not retention_status:
            return None

        # Verifica se está próximo de transição de fase
        current_phase_end = retention_status.get('current_phase_end')
        if current_phase_end:
            from datetime import date
            if isinstance(current_phase_end, str):
                current_phase_end = date.fromisoformat(current_phase_end)

            days_until_transition = (current_phase_end - date.today()).days

            if 0 <= days_until_transition <= 30:
                return ValidationAlert(
                    severity=AlertSeverity.WARNING,
                    alert_type=AlertType.COMPLIANCE,
                    field_name='retention_phase',
                    message=f'Documento próximo de transição para fase intermediária ({days_until_transition} dias)',
                    suggestion='Revisar documento antes da transição de fase',
                    metadata={
                        'current_phase_end': current_phase_end.isoformat(),
                        'days_remaining': days_until_transition,
                        'next_action': 'transfer_to_intermediate',
                        'retention_code': retention_status.get('retention_code', ''),
                    }
                )

        return None

    async def _check_disposition_eligibility(
        self,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Optional[ValidationAlert]:
        """
        Verifica se documento está elegível para destinação final
        """

        retention_status = context.get('retention_status') if context else None
        if not retention_status:
            return None

        is_eligible = retention_status.get('is_eligible_for_disposition', False)
        final_disposition = retention_status.get('final_disposition')

        if is_eligible:
            if final_disposition == 'eliminate':
                return ValidationAlert(
                    severity=AlertSeverity.CRITICAL,
                    alert_type=AlertType.COMPLIANCE,
                    field_name='disposition',
                    message='Documento elegível para ELIMINAÇÃO',
                    suggestion='Criar Termo de Eliminação e submeter para aprovação',
                    metadata={
                        'final_disposition': 'eliminate',
                        'requires_approval': True,
                        'next_steps': [
                            'Gerar listagem de eliminação',
                            'Obter aprovação da comissão',
                            'Criar termo de eliminação',
                            'Executar eliminação'
                        ],
                        'legal_requirements': 'Resolução CONARQ nº 40/2014',
                    }
                )
            elif final_disposition == 'permanent_custody':
                return ValidationAlert(
                    severity=AlertSeverity.INFO,
                    alert_type=AlertType.COMPLIANCE,
                    field_name='disposition',
                    message='Documento de GUARDA PERMANENTE',
                    suggestion='Transferir para arquivo permanente',
                    metadata={
                        'final_disposition': 'permanent_custody',
                        'historical_value': True,
                        'requires_preservation': True,
                    }
                )

        return None

    async def check_compliance(
        self,
        document_content: str,
        compliance_rules: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        """Verifica conformidade com regras e-ARQ"""
        # Implementação específica de compliance
        return []

    async def check_patterns(
        self,
        document_content: str,
        learned_patterns: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        """Verifica padrões aprendidos de classificação"""
        # Implementação de aprendizado de padrões
        return []


class LegalHoldValidator(IValidator):
    """
    Validator para Legal Hold (Suspensão Legal)

    Valida:
    - Documentos sob custódia judicial
    - Bloqueio de eliminação
    - Alertas de holds ativos

    CRÍTICO: IA NUNCA deve sugerir eliminação se legal hold ativo
    """

    def __init__(self):
        self._validator_type = "legal_hold"

    @property
    def validator_type(self) -> str:
        return self._validator_type

    async def validate(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> List[ValidationAlert]:
        """
        Valida se documento está sob legal hold

        Context esperado:
        - legal_holds: Lista de legal holds ativos
        - document_id: UUID do documento
        """
        alerts = []

        legal_holds = context.get('legal_holds', []) if context else []

        # Filtra apenas holds ativos
        active_holds = [h for h in legal_holds if h.get('status') == 'active']

        if active_holds:
            for hold in active_holds:
                alerts.append(
                    ValidationAlert(
                        severity=AlertSeverity.CRITICAL,
                        alert_type=AlertType.COMPLIANCE,
                        field_name='legal_hold',
                        message=f'Documento sob LEGAL HOLD: {hold.get("case_number")} - {hold.get("title")}',
                        suggestion='BLOQUEADO para alteração/eliminação',
                        metadata={
                            'legal_hold_id': hold.get('id'),
                            'case_number': hold.get('case_number'),
                            'issuing_authority': hold.get('issuing_authority'),
                            'effective_date': hold.get('effective_date'),
                            'legal_basis': hold.get('legal_basis'),

                            # FLAGS CRÍTICOS para IA
                            'can_delete': False,
                            'can_modify': False,
                            'can_export': True,  # Pode exportar para processos

                            # Metadados para Graph
                            'related_documents': hold.get('total_documents', 0),
                            'custodians_notified': hold.get('custodians_notified', []),
                        }
                    )
                )

        return alerts

    async def check_compliance(
        self,
        document_content: str,
        compliance_rules: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        return []

    async def check_patterns(
        self,
        document_content: str,
        learned_patterns: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        return []


class LGPDValidator(IValidator):
    """
    Validator para LGPD (Lei Geral de Proteção de Dados)

    Valida:
    - Base legal vs finalidade
    - Dados sensíveis sem consentimento
    - Solicitações de titular atrasadas
    - Consentimentos revogados
    """

    def __init__(self, ollama_client: Optional[OllamaClient] = None):
        self.ollama_client = ollama_client or OllamaClient()
        self._validator_type = "lgpd"

    @property
    def validator_type(self) -> str:
        return self._validator_type

    async def validate(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> List[ValidationAlert]:
        """Valida conformidade LGPD"""
        alerts = []

        # 1. Verifica se processa dados sensíveis
        sensitive_data_alert = await self._check_sensitive_data(
            document_content,
            document_metadata,
            context
        )
        if sensitive_data_alert:
            alerts.append(sensitive_data_alert)

        # 2. Valida base legal vs finalidade
        legal_basis_alert = await self._validate_legal_basis(
            document_metadata,
            context
        )
        if legal_basis_alert:
            alerts.append(legal_basis_alert)

        # 3. Verifica consentimento ativo
        consent_alert = await self._check_consent_status(
            document_metadata,
            context
        )
        if consent_alert:
            alerts.append(consent_alert)

        return alerts

    async def _check_sensitive_data(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Optional[ValidationAlert]:
        """
        Detecta dados sensíveis usando Council

        Dados sensíveis (Art. 5º, II LGPD):
        - Origem racial ou étnica
        - Convicção religiosa
        - Opinião política
        - Filiação sindical
        - Dados genéticos/biométricos
        - Dados sobre saúde
        - Vida sexual/orientação sexual
        """

        # Prompt robusto para detecção
        prompt = f"""# TAREFA: Detectar Dados Sensíveis (LGPD Art. 5º, II)

## DOCUMENTO
{document_content[:1000]}

## DADOS SENSÍVEIS A DETECTAR
Conforme LGPD Art. 5º, II, dados sensíveis são:
1. Origem racial ou étnica
2. Convicção religiosa
3. Opinião política
4. Filiação a sindicato ou organização religiosa/filosófica/política
5. Dados genéticos ou biométricos
6. Dados sobre saúde
7. Dados sobre vida sexual ou orientação sexual

## OBJETIVO
Analise o documento e identifique se contém dados sensíveis.

## RESPOSTA (JSON)
```json
{{
  "has_sensitive_data": true/false,
  "types_detected": ["saúde", "biométricos"],
  "fields_identified": ["diagnóstico médico", "impressão digital"],
  "severity": "high/medium/low",
  "recommendation": "Verificar base legal específica para dados sensíveis"
}}
```"""

        try:
            response = await self.ollama_client.generate(
                prompt=prompt,
                model="qwen2.5:7b",
                system=self._get_lgpd_system_prompt()
            )

            result = self._parse_classification_response(response)

            if result and result.get('has_sensitive_data'):
                return ValidationAlert(
                    severity=AlertSeverity.CRITICAL,
                    alert_type=AlertType.COMPLIANCE,
                    field_name='sensitive_data',
                    message=f'DADOS SENSÍVEIS detectados: {", ".join(result.get("types_detected", []))}',
                    suggestion='Verificar base legal específica (LGPD Art. 11)',
                    metadata={
                        'types_detected': result.get('types_detected', []),
                        'fields_identified': result.get('fields_identified', []),
                        'legal_requirement': 'LGPD Art. 11 - Tratamento de dados sensíveis',
                        'required_basis': 'consent_explicit',  # Consentimento específico
                    }
                )

        except Exception as e:
            logger.error(f"Erro ao detectar dados sensíveis: {str(e)}")

        return None

    async def _validate_legal_basis(
        self,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Optional[ValidationAlert]:
        """Valida se base legal é adequada para a finalidade"""

        data_mappings = context.get('data_mappings', []) if context else []

        for mapping in data_mappings:
            legal_basis = mapping.get('legal_basis')
            purpose = mapping.get('purpose', '')
            data_type = mapping.get('data_type')

            # Dados sensíveis exigem consentimento específico (Art. 11)
            if data_type == 'sensitive' and legal_basis != 'consent':
                return ValidationAlert(
                    severity=AlertSeverity.CRITICAL,
                    alert_type=AlertType.COMPLIANCE,
                    field_name='legal_basis',
                    message=f'Dado sensível sem consentimento específico: {mapping.get("field_name")}',
                    suggestion='Obter consentimento específico conforme LGPD Art. 11',
                    metadata={
                        'field_name': mapping.get('field_name'),
                        'current_basis': legal_basis,
                        'required_basis': 'consent',
                        'article': 'LGPD Art. 11',
                    }
                )

        return None

    async def _check_consent_status(
        self,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> Optional[ValidationAlert]:
        """Verifica se consentimento está ativo"""

        consents = context.get('consents', []) if context else []

        for consent in consents:
            if not consent.get('is_active'):
                return ValidationAlert(
                    severity=AlertSeverity.CRITICAL,
                    alert_type=AlertType.COMPLIANCE,
                    field_name='consent',
                    message='Consentimento REVOGADO - Parar processamento',
                    suggestion='Anonimizar ou eliminar dados conforme LGPD Art. 18, VI',
                    metadata={
                        'consent_id': consent.get('id'),
                        'revoked_at': consent.get('revoked_at'),
                        'data_subject': consent.get('data_subject_name'),

                        # FLAGS para IA
                        'can_process': False,
                        'action_required': 'anonymize_or_delete',
                        'legal_deadline_days': 15,  # Art. 19, §3º
                    }
                )

        return None

    def _get_lgpd_system_prompt(self) -> str:
        """System prompt para especialista LGPD"""
        return """Você é um especialista em privacidade e proteção de dados, com profundo conhecimento em:

- LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)
- GDPR (General Data Protection Regulation)
- Princípios de proteção de dados (finalidade, necessidade, transparência)
- Direitos dos titulares
- Base legal para tratamento de dados
- Dados pessoais vs sensíveis

Sua função é identificar e classificar dados pessoais/sensíveis em documentos, considerando:
1. Definições da LGPD (Art. 5º)
2. Dados sensíveis (Art. 5º, II)
3. Base legal aplicável (Art. 7º e 11)
4. Direitos dos titulares (Art. 18)

Seja preciso e cite sempre os artigos da LGPD.
Responda sempre em português brasileiro de forma estruturada."""

    def _parse_classification_response(self, response: str) -> Optional[Dict[str, Any]]:
        """Parse JSON"""
        import json
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            return json.loads(response.strip())
        except:
            return None

    async def check_compliance(
        self,
        document_content: str,
        compliance_rules: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        return []

    async def check_patterns(
        self,
        document_content: str,
        learned_patterns: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        return []
