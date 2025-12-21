"""
Chairman - Council leader who synthesizes opinions.
"""
from typing import Dict, List, Any, Optional
import time
import logging

from ..core.interfaces import IChairman
from ..core.entities import (
    CouncilOpinion, 
    CouncilDeliberation, 
    OpinionConfidence,
    ValidationAlert,
    AlertSeverity,
    AlertType,
    SuggestedAction
)
from .ollama_client import OllamaClient

logger = logging.getLogger('intelligence.council.chairman')


class Chairman(IChairman):
    """
    Council Chairman who synthesizes opinions from all members.
    
    Responsible for:
    - Consolidating member opinions into a unified analysis
    - Resolving disagreements between members
    - Generating final recommendations
    - Creating proactive alerts based on patterns
    """
    
    def __init__(
        self,
        ollama_client: OllamaClient,
        model_name: str = "qwen2.5:7b"
    ):
        """
        Initialize the Chairman.
        
        Args:
            ollama_client: Shared Ollama client
            model_name: Model to use for synthesis
        """
        self._client = ollama_client
        self._model_name = model_name
        self._system_prompt = self._default_system_prompt()
    
    @property
    def model_name(self) -> str:
        """Return the model name."""
        return self._model_name
    
    def _default_system_prompt(self) -> str:
        """Return the Chairman system prompt."""
        return """Você é o Chairman do Conselho de Análise de Documentos.
Sua função é sintetizar as opiniões de especialistas em diferentes áreas
(jurídico, financeiro, geral) e produzir uma análise consolidada.

Responsabilidades:
1. Identificar pontos de consenso entre os especialistas
2. Resolver divergências citando a opinião mais fundamentada
3. Priorizar recomendações por impacto e urgência
4. Gerar alertas claros e acionáveis

Seja objetivo, prático e sempre forneça ações concretas.
Responda sempre em português brasileiro."""
    
    async def synthesize(
        self,
        document_content: str,
        member_opinions: List[CouncilOpinion],
        member_reviews: List[Dict[str, Any]]
    ) -> CouncilDeliberation:
        """
        Synthesize all opinions into a final deliberation.
        """
        start_time = time.time()
        
        # Build synthesis prompt
        opinions_text = "\n\n".join([
            f"### Especialista: {op.member_domain.upper()}\n"
            f"Análise: {op.analysis}\n"
            f"Preocupações: {len(op.concerns)}\n"
            f"Recomendações: {len(op.recommendations)}"
            for op in member_opinions
        ])
        
        reviews_text = "\n\n".join([
            f"Revisão por {r.get('reviewer_domain', 'unknown')}: {r.get('review', '')[:500]}"
            for r in member_reviews
        ]) if member_reviews else "Nenhuma revisão cruzada disponível."
        
        prompt = f"""Sintetize as seguintes opiniões de especialistas sobre este documento:

DOCUMENTO (resumo):
{document_content[:3000]}

OPINIÕES DOS ESPECIALISTAS:
{opinions_text}

REVISÕES CRUZADAS:
{reviews_text}

Por favor, forneça uma análise consolidada incluindo:

## Síntese
- Resumo geral da análise do conselho

## Pontos de Consenso
- Liste os pontos em que todos os especialistas concordam

## Pontos de Divergência
- Liste os pontos de discordância e sua resolução

## Recomendações Finais (priorizadas)
1. [Alta prioridade] ...
2. [Média prioridade] ...
3. [Baixa prioridade] ...

## Alertas
- Liste alertas que requerem ação imediata do usuário
"""
        
        try:
            response = await self._client.generate(
                model=self._model_name,
                prompt=prompt,
                system=self._system_prompt,
                temperature=0.2
            )
            
            # Parse the response
            deliberation = self._parse_deliberation(response, member_opinions)
            deliberation.total_processing_time_ms = (time.time() - start_time) * 1000
            
            logger.info(
                f"Chairman synthesis complete in "
                f"{deliberation.total_processing_time_ms:.2f}ms"
            )
            
            return deliberation
            
        except Exception as e:
            logger.error(f"Chairman synthesis failed: {e}")
            return CouncilDeliberation(
                member_opinions=member_opinions,
                synthesis=f"Síntese falhou: {str(e)}",
                overall_confidence=OpinionConfidence.UNCERTAIN,
                total_processing_time_ms=(time.time() - start_time) * 1000
            )
    
    def _parse_deliberation(
        self,
        response: str,
        member_opinions: List[CouncilOpinion]
    ) -> CouncilDeliberation:
        """Parse LLM response into a CouncilDeliberation."""
        # Basic parsing
        consensus_points = []
        divergence_points = []
        recommendations = []
        
        sections = response.split('##')
        
        for section in sections:
            section_lower = section.lower()
            lines = [l.strip() for l in section.split('\n') if l.strip()]
            
            if 'consenso' in section_lower:
                consensus_points = [
                    l[2:] if l.startswith('- ') else l 
                    for l in lines[1:] if l.startswith('-') or l.startswith('•')
                ]
            elif 'divergência' in section_lower or 'divergencia' in section_lower:
                for l in lines[1:]:
                    if l.startswith('-') or l.startswith('•'):
                        divergence_points.append({'point': l[2:]})
            elif 'recomendações' in section_lower or 'recomendacoes' in section_lower:
                for l in lines[1:]:
                    if l and (l[0].isdigit() or l.startswith('-')):
                        priority = 'high' if 'alta' in l.lower() else (
                            'low' if 'baixa' in l.lower() else 'medium'
                        )
                        recommendations.append({
                            'text': l,
                            'priority': priority
                        })
        
        return CouncilDeliberation(
            member_opinions=member_opinions,
            synthesis=response,
            consensus_points=consensus_points,
            divergence_points=divergence_points,
            final_recommendations=recommendations,
            overall_confidence=OpinionConfidence.MEDIUM
        )
    
    async def generate_alerts(
        self,
        deliberation: CouncilDeliberation,
        learned_patterns: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Generate proactive alerts based on deliberation and patterns.
        """
        alerts = []
        
        # Generate alerts from concerns in member opinions
        for opinion in deliberation.member_opinions:
            for concern in opinion.concerns:
                alert = ValidationAlert(
                    alert_type=AlertType.COMPLIANCE,
                    severity=self._map_severity(concern.get('severity', 'medium')),
                    title=f"[{opinion.member_domain.upper()}] Preocupação identificada",
                    message=concern.get('text', str(concern)),
                    details={
                        'source_domain': opinion.member_domain,
                        'source_opinion_id': str(opinion.id)
                    },
                    suggested_actions=[
                        SuggestedAction(
                            action_type='review',
                            label='Revisar',
                            description='Revisar o ponto indicado'
                        )
                    ]
                )
                alerts.append(alert.to_dict())
        
        # Check against learned patterns
        for pattern in learned_patterns:
            if pattern.get('matched'):
                alert = ValidationAlert(
                    alert_type=AlertType.PATTERN,
                    severity=AlertSeverity.INFO,
                    title="Padrão organizacional identificado",
                    message=pattern.get('action', {}).get('message', 'Padrão detectado'),
                    details={'pattern_id': pattern.get('id')},
                    suggested_actions=[
                        SuggestedAction(
                            action_type=pattern.get('action', {}).get('type', 'review'),
                            label=pattern.get('action', {}).get('label', 'Aplicar'),
                            auto_applicable=pattern.get('action', {}).get('auto', False),
                            payload=pattern.get('action', {}).get('payload', {})
                        )
                    ]
                )
                alerts.append(alert.to_dict())
        
        return alerts
    
    def _map_severity(self, severity_str: str) -> AlertSeverity:
        """Map string severity to AlertSeverity enum."""
        mapping = {
            'low': AlertSeverity.INFO,
            'medium': AlertSeverity.WARNING,
            'high': AlertSeverity.ERROR,
            'critical': AlertSeverity.CRITICAL
        }
        return mapping.get(severity_str.lower(), AlertSeverity.WARNING)
