"""
Base Council Member - Abstract base class for council specialists.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import time
import logging

from ..core.interfaces import ICouncilMember
from ..core.entities import CouncilOpinion, OpinionConfidence
from .ollama_client import OllamaClient

logger = logging.getLogger('intelligence.council.member')


class BaseCouncilMember(ICouncilMember, ABC):
    """
    Abstract base class for council member implementations.
    
    Each council member is a specialist in a specific domain
    and uses an LLM to analyze documents within their expertise.
    """
    
    def __init__(
        self,
        domain: str,
        model_name: str,
        ollama_client: OllamaClient,
        system_prompt: Optional[str] = None
    ):
        """
        Initialize the council member.
        
        Args:
            domain: Domain of expertise
            model_name: Ollama model to use
            ollama_client: Shared Ollama client instance
            system_prompt: Custom system prompt for this specialist
        """
        self._domain = domain
        self._model_name = model_name
        self._client = ollama_client
        self._system_prompt = system_prompt or self._default_system_prompt()
    
    @property
    def domain(self) -> str:
        """Return the domain of expertise."""
        return self._domain
    
    @property
    def model_name(self) -> str:
        """Return the LLM model name."""
        return self._model_name
    
    @abstractmethod
    def _default_system_prompt(self) -> str:
        """Return the default system prompt for this specialist."""
        pass
    
    @abstractmethod
    def _build_analysis_prompt(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Build the analysis prompt for this specialist."""
        pass
    
    async def analyze(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]] = None
    ) -> CouncilOpinion:
        """
        Analyze a document and provide an expert opinion.
        
        Args:
            document_content: The document text to analyze
            context: Optional context information
            
        Returns:
            CouncilOpinion with analysis results
        """
        start_time = time.time()
        
        prompt = self._build_analysis_prompt(document_content, context)
        
        try:
            response = await self._client.generate(
                model=self._model_name,
                prompt=prompt,
                system=self._system_prompt,
                temperature=0.3  # Lower temperature for analysis
            )
            
            opinion = self._parse_opinion(response)
            opinion.member_domain = self._domain
            opinion.processing_time_ms = (time.time() - start_time) * 1000
            
            logger.info(
                f"[{self._domain}] Analysis complete in "
                f"{opinion.processing_time_ms:.2f}ms"
            )
            
            return opinion
            
        except Exception as e:
            logger.error(f"[{self._domain}] Analysis failed: {e}")
            return CouncilOpinion(
                member_domain=self._domain,
                analysis=f"Analysis failed: {str(e)}",
                confidence=OpinionConfidence.UNCERTAIN,
                processing_time_ms=(time.time() - start_time) * 1000
            )
    
    def _parse_opinion(self, response: str) -> CouncilOpinion:
        """
        Parse LLM response into a CouncilOpinion.
        
        Subclasses can override for custom parsing.
        """
        # Basic parsing - extract sections from response
        findings = []
        concerns = []
        recommendations = []
        
        lines = response.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            lower_line = line.lower()
            if 'finding' in lower_line or 'observação' in lower_line:
                current_section = 'findings'
            elif 'concern' in lower_line or 'preocupação' in lower_line:
                current_section = 'concerns'
            elif 'recommend' in lower_line or 'recomendação' in lower_line:
                current_section = 'recommendations'
            elif line.startswith('-') or line.startswith('•'):
                content = line[1:].strip()
                if current_section == 'findings':
                    findings.append({'text': content})
                elif current_section == 'concerns':
                    concerns.append({'text': content, 'severity': 'medium'})
                elif current_section == 'recommendations':
                    recommendations.append(content)
        
        return CouncilOpinion(
            analysis=response,
            findings=findings,
            concerns=concerns,
            recommendations=recommendations,
            confidence=OpinionConfidence.MEDIUM
        )
    
    async def review_opinions(
        self,
        document_content: str,
        other_opinions: List[CouncilOpinion]
    ) -> Dict[str, Any]:
        """
        Review and rank opinions from other council members.
        """
        opinions_text = "\n\n".join([
            f"--- Opinion from {op.member_domain} ---\n{op.analysis}"
            for op in other_opinions
        ])
        
        prompt = f"""
Review the following opinions from other specialists about this document:

DOCUMENT (excerpt):
{document_content[:2000]}

OTHER OPINIONS:
{opinions_text}

Please provide:
1. Your ranking of the opinions (most insightful to least)
2. Points of agreement
3. Points of disagreement
4. Any additional insights the other opinions may have missed
"""
        
        response = await self._client.generate(
            model=self._model_name,
            prompt=prompt,
            system=self._system_prompt,
            temperature=0.3
        )
        
        return {
            'review': response,
            'opinions_reviewed': len(other_opinions)
        }
    
    async def validate(
        self,
        document_content: str,
        validation_rules: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Validate document against specific rules.
        """
        rules_text = "\n".join([
            f"- {rule.get('name', 'Rule')}: {rule.get('description', '')}"
            for rule in validation_rules
        ])
        
        prompt = f"""
Validate this document against the following rules:

RULES:
{rules_text}

DOCUMENT:
{document_content}

For each rule, indicate:
- PASS or FAIL
- Explanation
- Location in document (if applicable)
"""
        
        response = await self._client.generate(
            model=self._model_name,
            prompt=prompt,
            system=self._system_prompt,
            temperature=0.1  # Very low for validation
        )
        
        # Parse validation results
        results = []
        for rule in validation_rules:
            results.append({
                'rule_name': rule.get('name'),
                'raw_response': response,
                'status': 'reviewed'
            })
        
        return results
