"""
Extractor Interface - Contract for document entity extraction.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from ..entities import ExtractedEntity, ExtractionResult


class IExtractor(ABC):
    """
    Interface for document entity extractors.
    
    Implementations should extract structured information from text,
    including entities, classifications, and relationships.
    """
    
    @abstractmethod
    def extract_entities(
        self,
        text: str,
        entity_types: List[str],
        include_confidence: bool = False,
        include_spans: bool = False
    ) -> Dict[str, List[ExtractedEntity]]:
        """
        Extract named entities from text.
        
        Args:
            text: Input text to analyze
            entity_types: List of entity types to extract (e.g., ["person", "company", "date"])
            include_confidence: Whether to include confidence scores
            include_spans: Whether to include character positions
            
        Returns:
            Dictionary mapping entity types to lists of extracted entities
        """
        pass
    
    @abstractmethod
    def classify_text(
        self,
        text: str,
        categories: Dict[str, List[str]],
        multi_label: bool = False
    ) -> Dict[str, Any]:
        """
        Classify text into predefined categories.
        
        Args:
            text: Input text to classify
            categories: Dictionary of category names to possible labels
            multi_label: Whether multiple labels can be assigned
            
        Returns:
            Dictionary mapping category names to assigned labels
        """
        pass
    
    @abstractmethod
    def extract_structured(
        self,
        text: str,
        schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Extract structured data according to a schema.
        
        Args:
            text: Input text to analyze
            schema: Dictionary defining the structure to extract
            
        Returns:
            Extracted structured data matching the schema
        """
        pass
    
    @abstractmethod
    def extract_relations(
        self,
        text: str,
        relation_types: List[str]
    ) -> Dict[str, List[tuple]]:
        """
        Extract relationships between entities.
        
        Args:
            text: Input text to analyze
            relation_types: List of relation types to extract
            
        Returns:
            Dictionary mapping relation types to lists of (head, tail) tuples
        """
        pass
    
    def analyze(self, text: str, config: Optional[Dict] = None) -> ExtractionResult:
        """
        Perform comprehensive analysis on text.
        
        Args:
            text: Input text to analyze
            config: Optional configuration for analysis
            
        Returns:
            ExtractionResult containing all extracted information
        """
        pass
