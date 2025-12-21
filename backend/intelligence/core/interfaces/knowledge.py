"""
Knowledge Store Interface - Contract for hierarchical knowledge persistence.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from enum import Enum
from uuid import UUID


class KnowledgeLayer(Enum):
    """Layers of knowledge hierarchy."""
    USER = "user"
    ORGANIZATION = "organization"
    SECTOR = "sector"
    PLATFORM = "platform"


class IKnowledgeStore(ABC):
    """
    Interface for hierarchical knowledge storage.
    
    Knowledge is stored and retrieved at different layers:
    - User: Individual user preferences and patterns
    - Organization: Company-specific templates and rules
    - Sector: Industry-specific knowledge (legal, health, finance)
    - Platform: Global patterns and best practices
    """
    
    @property
    @abstractmethod
    def layer(self) -> KnowledgeLayer:
        """Return the knowledge layer this store manages."""
        pass
    
    @abstractmethod
    async def store_feedback(
        self,
        document_type: str,
        original_value: str,
        corrected_value: str,
        action_type: str,
        context: Dict[str, Any]
    ) -> UUID:
        """
        Store user feedback for learning.
        
        Args:
            document_type: Type of document
            original_value: Original value before correction
            corrected_value: Value after user correction
            action_type: Type of action (correction, approval, rejection)
            context: Additional context (user_id, org_id, etc.)
            
        Returns:
            UUID of the stored feedback
        """
        pass
    
    @abstractmethod
    async def get_patterns(
        self,
        document_type: str,
        pattern_type: Optional[str] = None,
        min_confidence: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Retrieve learned patterns for a document type.
        
        Args:
            document_type: Type of document
            pattern_type: Optional filter by pattern type
            min_confidence: Minimum confidence threshold
            
        Returns:
            List of learned patterns
        """
        pass
    
    @abstractmethod
    async def store_pattern(
        self,
        pattern_type: str,
        condition: Dict[str, Any],
        action: Dict[str, Any],
        confidence: float,
        source_feedbacks: List[UUID]
    ) -> UUID:
        """
        Store a detected pattern.
        
        Args:
            pattern_type: Type of pattern (clause_format, value_limit, etc.)
            condition: JSONLogic expression for when pattern applies
            action: Suggested action when pattern matches
            confidence: Confidence score
            source_feedbacks: UUIDs of feedbacks that generated this pattern
            
        Returns:
            UUID of the stored pattern
        """
        pass
    
    @abstractmethod
    async def match_patterns(
        self,
        document_content: str,
        document_metadata: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Find patterns that match a document.
        
        Args:
            document_content: Content of the document
            document_metadata: Metadata (type, sector, etc.)
            
        Returns:
            List of matching patterns with suggested actions
        """
        pass
    
    @abstractmethod
    async def aggregate_from_layer(
        self,
        source_layer: KnowledgeLayer,
        aggregation_config: Dict[str, Any]
    ) -> int:
        """
        Aggregate knowledge from a lower layer.
        
        Args:
            source_layer: Layer to aggregate from
            aggregation_config: Configuration for aggregation
            
        Returns:
            Number of patterns created/updated
        """
        pass
