"""
Base Knowledge Repository - Abstract base for hierarchical knowledge stores.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from uuid import UUID
import logging

from django.db.models import Q, F
from django.utils import timezone

from ..core.interfaces.knowledge import IKnowledgeStore, KnowledgeLayer
from ..models import KnowledgeFeedback, LearnedPattern, PatternFeedbackLink

logger = logging.getLogger('intelligence.knowledge')


class BaseKnowledgeRepository(IKnowledgeStore, ABC):
    """
    Abstract base class for knowledge repositories.
    
    Each repository manages knowledge at a specific layer
    of the hierarchy (user, organization, sector, platform).
    """
    
    def __init__(self, layer: KnowledgeLayer):
        """
        Initialize the repository.
        
        Args:
            layer: The knowledge layer this repository manages
        """
        self._layer = layer
    
    @property
    def layer(self) -> KnowledgeLayer:
        """Return the knowledge layer."""
        return self._layer
    
    @abstractmethod
    def _get_scope_filter(self, **kwargs) -> Q:
        """Get the filter for this scope. Must be implemented by subclasses."""
        pass
    
    async def store_feedback(
        self,
        document_type: str,
        original_value: str,
        corrected_value: str,
        action_type: str,
        context: Dict[str, Any]
    ) -> UUID:
        """Store user feedback for learning."""
        feedback = KnowledgeFeedback.objects.create(
            layer=self._layer.value,
            document_type=document_type,
            sector=context.get('sector', ''),
            field_name=context.get('field_name', ''),
            action_type=action_type,
            original_value=original_value,
            corrected_value=corrected_value,
            context=context,
            user_id=context.get('user_id'),
            organization_id=context.get('organization_id'),
            confidence_before=context.get('confidence_before', 0.0),
            confidence_after=context.get('confidence_after', 1.0),
        )
        
        logger.info(f"Stored feedback {feedback.id} at {self._layer.value} layer")
        return feedback.id
    
    async def get_patterns(
        self,
        document_type: str,
        pattern_type: Optional[str] = None,
        min_confidence: float = 0.7,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Retrieve learned patterns for a document type."""
        queryset = LearnedPattern.objects.filter(
            layer=self._layer.value,
            is_active=True,
            confidence__gte=min_confidence
        )
        
        # Apply scope filter
        scope_filter = self._get_scope_filter(**kwargs)
        if scope_filter:
            queryset = queryset.filter(scope_filter)
        
        # Filter by document type
        queryset = queryset.filter(
            Q(document_type=document_type) | Q(document_type='')
        )
        
        # Filter by pattern type if specified
        if pattern_type:
            queryset = queryset.filter(pattern_type=pattern_type)
        
        patterns = list(queryset.values(
            'id', 'pattern_type', 'name', 'description',
            'condition', 'action', 'confidence', 'occurrences'
        ))
        
        return patterns
    
    async def store_pattern(
        self,
        pattern_type: str,
        condition: Dict[str, Any],
        action: Dict[str, Any],
        confidence: float,
        source_feedbacks: List[UUID],
        **kwargs
    ) -> UUID:
        """Store a detected pattern."""
        pattern = LearnedPattern.objects.create(
            layer=self._layer.value,
            pattern_type=pattern_type,
            condition=condition,
            action=action,
            confidence=confidence,
            occurrences=len(source_feedbacks),
            organization_id=kwargs.get('organization_id'),
            sector=kwargs.get('sector', ''),
            document_type=kwargs.get('document_type', ''),
        )
        
        # Link source feedbacks
        for feedback_id in source_feedbacks:
            PatternFeedbackLink.objects.create(
                pattern=pattern,
                feedback_id=feedback_id
            )
        
        logger.info(f"Stored pattern {pattern.id} at {self._layer.value} layer")
        return pattern.id
    
    async def match_patterns(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Find patterns that match a document."""
        # Get all active patterns for this scope
        patterns = await self.get_patterns(
            document_type=document_metadata.get('document_type', ''),
            min_confidence=0.5,
            **kwargs
        )
        
        matched = []
        for pattern in patterns:
            # TODO: Implement JSONLogic evaluation
            # For now, return all patterns as potential matches
            pattern['matched'] = True
            matched.append(pattern)
        
        return matched
    
    async def aggregate_from_layer(
        self,
        source_layer: KnowledgeLayer,
        aggregation_config: Dict[str, Any]
    ) -> int:
        """Aggregate knowledge from a lower layer."""
        # This would typically be implemented in a Celery task
        # to aggregate patterns from user -> org, org -> sector, etc.
        logger.info(f"Aggregation from {source_layer.value} to {self._layer.value}")
        return 0
    
    def update_pattern_confidence(
        self,
        pattern_id: UUID,
        adjustment: float,
        user_response: str
    ) -> None:
        """
        Update pattern confidence based on user response.
        
        Args:
            pattern_id: ID of the pattern to update
            adjustment: Confidence adjustment (-1.0 to 1.0)
            user_response: Type of response (accepted, rejected, modified)
        """
        LearnedPattern.objects.filter(id=pattern_id).update(
            confidence=F('confidence') + adjustment,
            occurrences=F('occurrences') + 1,
            last_matched_at=timezone.now()
        )
