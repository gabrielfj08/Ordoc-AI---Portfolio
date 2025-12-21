"""
Extraction Entities - Domain objects for document extraction.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
from uuid import UUID, uuid4


@dataclass
class ExtractedEntity:
    """
    Represents an extracted entity from a document.
    
    Attributes:
        text: The extracted text value
        entity_type: Type of entity (person, company, date, etc.)
        confidence: Confidence score (0.0 to 1.0)
        start: Start character position in source text
        end: End character position in source text
        metadata: Additional metadata about the entity
    """
    text: str
    entity_type: str
    confidence: float = 1.0
    start: Optional[int] = None
    end: Optional[int] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self, include_spans: bool = False, include_confidence: bool = False) -> Dict[str, Any]:
        """Convert entity to dictionary representation."""
        result = {'text': self.text}
        
        if include_confidence:
            result['confidence'] = self.confidence
            
        if include_spans and self.start is not None:
            result['start'] = self.start
            result['end'] = self.end
            
        return result


@dataclass
class ExtractionResult:
    """
    Complete result of document extraction.
    
    Attributes:
        id: Unique identifier for this extraction
        document_id: Reference to the source document
        entities: Extracted entities grouped by type
        classifications: Text classifications
        structured_data: Structured data extracted
        relations: Relationships between entities
        processing_time_ms: Time taken to process in milliseconds
    """
    id: UUID = field(default_factory=uuid4)
    document_id: Optional[UUID] = None
    entities: Dict[str, List[ExtractedEntity]] = field(default_factory=dict)
    classifications: Dict[str, Any] = field(default_factory=dict)
    structured_data: Dict[str, Any] = field(default_factory=dict)
    relations: Dict[str, List[tuple]] = field(default_factory=dict)
    processing_time_ms: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert result to dictionary representation."""
        return {
            'id': str(self.id),
            'document_id': str(self.document_id) if self.document_id else None,
            'entities': {
                etype: [e.to_dict() for e in entities]
                for etype, entities in self.entities.items()
            },
            'classifications': self.classifications,
            'structured_data': self.structured_data,
            'relations': self.relations,
            'processing_time_ms': self.processing_time_ms,
        }
