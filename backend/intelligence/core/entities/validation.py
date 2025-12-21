"""
Validation Entities - Domain objects for proactive validation.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum


class AlertSeverity(Enum):
    """Severity level of a validation alert."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AlertType(Enum):
    """Type of validation alert."""
    COMPLIANCE = "compliance"
    PATTERN = "pattern"
    SUGGESTION = "suggestion"
    ERROR = "error"


class UserResponse(Enum):
    """User response to an alert."""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    MODIFIED = "modified"


@dataclass
class SuggestedAction:
    """
    A suggested action for resolving an alert.
    
    Attributes:
        action_type: Type of action (auto_fix, manual_review, ignore)
        label: Human-readable label for the action
        description: Detailed description of what the action does
        auto_applicable: Whether this action can be applied automatically
        payload: Data needed to execute the action
    """
    action_type: str
    label: str
    description: str = ""
    auto_applicable: bool = False
    payload: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert action to dictionary representation."""
        return {
            'action_type': self.action_type,
            'label': self.label,
            'description': self.description,
            'auto_applicable': self.auto_applicable,
            'payload': self.payload,
        }


@dataclass
class ValidationAlert:
    """
    A proactive validation alert for a document.
    
    Attributes:
        id: Unique identifier for this alert
        document_id: Reference to the document
        alert_type: Type of alert (compliance, pattern, suggestion, error)
        severity: Severity level
        title: Short title for the alert
        message: Detailed message explaining the issue
        location: Location in document (clause, line, field)
        suggested_actions: List of possible actions
        source_pattern_id: Reference to the pattern that generated this alert
        user_response: User's response to the alert
        learning_weight: Weight for learning (higher = more impact on patterns)
    """
    id: UUID = field(default_factory=uuid4)
    document_id: Optional[UUID] = None
    alert_type: AlertType = AlertType.SUGGESTION
    severity: AlertSeverity = AlertSeverity.INFO
    title: str = ""
    message: str = ""
    details: Dict[str, Any] = field(default_factory=dict)
    location: Optional[Dict[str, Any]] = None
    suggested_actions: List[SuggestedAction] = field(default_factory=list)
    source_pattern_id: Optional[UUID] = None
    user_response: UserResponse = UserResponse.PENDING
    learning_weight: float = 1.0
    created_at: datetime = field(default_factory=datetime.now)
    responded_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert alert to dictionary representation."""
        return {
            'id': str(self.id),
            'document_id': str(self.document_id) if self.document_id else None,
            'alert_type': self.alert_type.value,
            'severity': self.severity.value,
            'title': self.title,
            'message': self.message,
            'details': self.details,
            'location': self.location,
            'suggested_actions': [a.to_dict() for a in self.suggested_actions],
            'source_pattern_id': str(self.source_pattern_id) if self.source_pattern_id else None,
            'user_response': self.user_response.value,
            'created_at': self.created_at.isoformat(),
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
        }
