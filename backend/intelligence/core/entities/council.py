"""
Council Entities - Domain objects for LLM Council deliberation.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum


class OpinionConfidence(Enum):
    """Confidence level of a council opinion."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    UNCERTAIN = "uncertain"


@dataclass
class CouncilOpinion:
    """
    Opinion from a council member on a document.
    
    Attributes:
        id: Unique identifier for this opinion
        member_domain: Domain of expertise of the member
        analysis: Main analysis content
        findings: List of specific findings
        concerns: List of concerns or issues found
        recommendations: List of recommendations
        confidence: Confidence level of the opinion
        processing_time_ms: Time taken to generate
    """
    id: UUID = field(default_factory=uuid4)
    member_domain: str = ""
    analysis: str = ""
    findings: List[Dict[str, Any]] = field(default_factory=list)
    concerns: List[Dict[str, Any]] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    confidence: OpinionConfidence = OpinionConfidence.MEDIUM
    processing_time_ms: float = 0.0
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert opinion to dictionary representation."""
        return {
            'id': str(self.id),
            'member_domain': self.member_domain,
            'analysis': self.analysis,
            'findings': self.findings,
            'concerns': self.concerns,
            'recommendations': self.recommendations,
            'confidence': self.confidence.value,
            'processing_time_ms': self.processing_time_ms,
            'created_at': self.created_at.isoformat(),
        }


@dataclass
class CouncilDeliberation:
    """
    Final deliberation synthesized by the Chairman.
    
    Attributes:
        id: Unique identifier for this deliberation
        document_id: Reference to the analyzed document
        member_opinions: All opinions from council members
        synthesis: Final synthesized analysis
        consensus_points: Points all members agreed on
        divergence_points: Points where members disagreed
        final_recommendations: Consolidated recommendations
        alerts: Proactive alerts generated
        overall_confidence: Overall confidence in the analysis
    """
    id: UUID = field(default_factory=uuid4)
    document_id: Optional[UUID] = None
    member_opinions: List[CouncilOpinion] = field(default_factory=list)
    synthesis: str = ""
    consensus_points: List[str] = field(default_factory=list)
    divergence_points: List[Dict[str, Any]] = field(default_factory=list)
    final_recommendations: List[Dict[str, Any]] = field(default_factory=list)
    alerts: List[Dict[str, Any]] = field(default_factory=list)
    overall_confidence: OpinionConfidence = OpinionConfidence.MEDIUM
    total_processing_time_ms: float = 0.0
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert deliberation to dictionary representation."""
        return {
            'id': str(self.id),
            'document_id': str(self.document_id) if self.document_id else None,
            'member_opinions': [op.to_dict() for op in self.member_opinions],
            'synthesis': self.synthesis,
            'consensus_points': self.consensus_points,
            'divergence_points': self.divergence_points,
            'final_recommendations': self.final_recommendations,
            'alerts': self.alerts,
            'overall_confidence': self.overall_confidence.value,
            'total_processing_time_ms': self.total_processing_time_ms,
            'created_at': self.created_at.isoformat(),
        }
