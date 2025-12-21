"""
Council Interface - Contracts for LLM Council members and Chairman.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from ..entities import CouncilOpinion, CouncilDeliberation


class ICouncilMember(ABC):
    """
    Interface for LLM Council members (specialists).
    
    Each member represents an expert in a specific domain
    (e.g., legal, financial, health) and provides opinions
    on documents within their area of expertise.
    """
    
    @property
    @abstractmethod
    def domain(self) -> str:
        """Return the domain of expertise for this member."""
        pass
    
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the LLM model name used by this member."""
        pass
    
    @abstractmethod
    async def analyze(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]] = None
    ) -> CouncilOpinion:
        """
        Analyze a document and provide an expert opinion.
        
        Args:
            document_content: The document text to analyze
            context: Optional context (document type, organization, etc.)
            
        Returns:
            CouncilOpinion with analysis results
        """
        pass
    
    @abstractmethod
    async def review_opinions(
        self,
        document_content: str,
        other_opinions: List[CouncilOpinion]
    ) -> Dict[str, Any]:
        """
        Review and rank opinions from other council members.
        
        Args:
            document_content: The document being analyzed
            other_opinions: Anonymized opinions from other members
            
        Returns:
            Dictionary with rankings and review notes
        """
        pass
    
    @abstractmethod
    async def validate(
        self,
        document_content: str,
        validation_rules: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Validate document against specific rules.
        
        Args:
            document_content: The document to validate
            validation_rules: List of rules to check
            
        Returns:
            List of validation results (pass/fail with details)
        """
        pass


class IChairman(ABC):
    """
    Interface for the Council Chairman.
    
    The Chairman synthesizes opinions from all council members
    and produces a final consolidated response with recommendations.
    """
    
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the LLM model name used by the Chairman."""
        pass
    
    @abstractmethod
    async def synthesize(
        self,
        document_content: str,
        member_opinions: List[CouncilOpinion],
        member_reviews: List[Dict[str, Any]]
    ) -> CouncilDeliberation:
        """
        Synthesize all opinions into a final deliberation.
        
        Args:
            document_content: The document being analyzed
            member_opinions: All opinions from council members
            member_reviews: Cross-review results from members
            
        Returns:
            CouncilDeliberation with final synthesis and recommendations
        """
        pass
    
    @abstractmethod
    async def generate_alerts(
        self,
        deliberation: CouncilDeliberation,
        learned_patterns: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Generate proactive alerts based on deliberation and patterns.
        
        Args:
            deliberation: The final council deliberation
            learned_patterns: Patterns learned from knowledge base
            
        Returns:
            List of alerts with severity and suggested actions
        """
        pass
