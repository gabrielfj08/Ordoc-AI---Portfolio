"""
Knowledge Entities - Domain objects for hierarchical knowledge storage.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum


class KnowledgeLayer(Enum):
    """Layers of knowledge hierarchy."""
    USER = "user"
    ORGANIZATION = "organization"
    SECTOR = "sector"
    PLATFORM = "platform"


class ActionType(Enum):
    """Types of user actions on documents."""
    CORRECTION = "correction"
    APPROVAL = "approval"
    REJECTION = "rejection"


@dataclass
class KnowledgeFeedback:
    """
    Feedback from user action for learning.
    
    Attributes:
        id: Unique identifier
        layer: Knowledge layer this feedback belongs to
        document_type: Type of document
        sector: Business sector (legal, finance, health)
        action_type: Type of action taken
        original_value: Value before user action
        corrected_value: Value after user action
        field_name: Name of the field that was modified
        context: Additional context
        user_id: ID of the user who provided feedback
        organization_id: ID of the organization
        confidence_before: Model confidence before action
        confidence_after: Updated confidence after action
    """
    id: UUID = field(default_factory=uuid4)
    layer: KnowledgeLayer = KnowledgeLayer.USER
    document_type: str = ""
    sector: str = ""
    action_type: ActionType = ActionType.CORRECTION
    original_value: str = ""
    corrected_value: str = ""
    field_name: str = ""
    context: Dict[str, Any] = field(default_factory=dict)
    user_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    confidence_before: float = 0.0
    confidence_after: float = 1.0
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert feedback to dictionary representation."""
        return {
            'id': str(self.id),
            'layer': self.layer.value,
            'document_type': self.document_type,
            'sector': self.sector,
            'action_type': self.action_type.value,
            'original_value': self.original_value,
            'corrected_value': self.corrected_value,
            'field_name': self.field_name,
            'context': self.context,
            'user_id': str(self.user_id) if self.user_id else None,
            'organization_id': str(self.organization_id) if self.organization_id else None,
            'confidence_before': self.confidence_before,
            'confidence_after': self.confidence_after,
            'created_at': self.created_at.isoformat(),
        }


@dataclass
class LearnedPattern:
    """
    A pattern learned from user feedback.
    
    Attributes:
        id: Unique identifier
        layer: Knowledge layer this pattern belongs to
        pattern_type: Type of pattern (clause_format, value_limit, required_field)
        condition: JSONLogic expression for when pattern applies
        action: Suggested action when pattern matches
        confidence: Confidence score for this pattern
        occurrences: Number of times this pattern was observed
        source_feedbacks: UUIDs of feedbacks that contributed to this pattern
        last_updated: Last time pattern was updated
    """
    id: UUID = field(default_factory=uuid4)
    layer: KnowledgeLayer = KnowledgeLayer.ORGANIZATION
    pattern_type: str = ""
    condition: Dict[str, Any] = field(default_factory=dict)
    action: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 0.5
    occurrences: int = 1
    source_feedbacks: List[UUID] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert pattern to dictionary representation."""
        return {
            'id': str(self.id),
            'layer': self.layer.value,
            'pattern_type': self.pattern_type,
            'condition': self.condition,
            'action': self.action,
            'confidence': self.confidence,
            'occurrences': self.occurrences,
            'source_feedbacks': [str(f) for f in self.source_feedbacks],
            'created_at': self.created_at.isoformat(),
            'last_updated': self.last_updated.isoformat(),
        }
