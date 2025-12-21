"""
GLiNER2 Extractor - Implementation using the GLiNER2 library.
"""
from typing import Dict, List, Any, Optional
import logging

from .base import BaseExtractor
from .factory import ExtractorFactory
from ..core.entities import ExtractedEntity
from ..core.exceptions import ExtractionFailedException, ModelNotLoadedException

logger = logging.getLogger('intelligence.extractors.gliner2')


class GLiNER2Extractor(BaseExtractor):
    """
    Document entity extractor using GLiNER2.
    
    GLiNER2 is a unified model for:
    - Named Entity Recognition
    - Text Classification
    - Structured Data Extraction
    - Relation Extraction
    
    All running locally on CPU with a 205M parameter model.
    """
    
    DEFAULT_MODEL = "fastino/gliner2-base-v1"
    
    def __init__(self, model_name: str = None, device: str = "cpu"):
        """
        Initialize the GLiNER2 extractor.
        
        Args:
            model_name: Model to use (default: fastino/gliner2-base-v1)
            device: Device to run on (default: cpu)
        """
        super().__init__(
            model_name=model_name or self.DEFAULT_MODEL,
            device=device
        )
        self._gliner = None
    
    def load_model(self) -> None:
        """Load the GLiNER2 model."""
        if self._is_loaded:
            logger.debug(f"Model {self._model_name} already loaded")
            return
        
        try:
            # Import here to avoid loading heavy dependencies at import time
            from gliner2 import GLiNER2
            
            logger.info(f"Loading GLiNER2 model: {self._model_name}")
            self._gliner = GLiNER2.from_pretrained(self._model_name)
            self._is_loaded = True
            logger.info(f"GLiNER2 model loaded successfully on {self._device}")
            
        except ImportError:
            raise ModelNotLoadedException(
                "gliner2 package not installed. Run: pip install gliner2"
            )
        except Exception as e:
            raise ModelNotLoadedException(f"Failed to load GLiNER2 model: {e}")
    
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
            entity_types: List of entity types to extract
            include_confidence: Whether to include confidence scores
            include_spans: Whether to include character positions
            
        Returns:
            Dictionary mapping entity types to lists of extracted entities
        """
        self._ensure_loaded()
        
        try:
            # Call GLiNER2 extraction
            result = self._gliner.extract_entities(
                text,
                entity_types,
                include_confidence=include_confidence,
                include_spans=include_spans
            )
            
            # Convert to our domain entities
            entities = {}
            raw_entities = result.get('entities', {})
            
            for etype, items in raw_entities.items():
                entities[etype] = []
                for item in items:
                    if isinstance(item, dict):
                        entity = ExtractedEntity(
                            text=item.get('text', str(item)),
                            entity_type=etype,
                            confidence=item.get('confidence', 1.0),
                            start=item.get('start'),
                            end=item.get('end')
                        )
                    else:
                        entity = ExtractedEntity(
                            text=str(item),
                            entity_type=etype
                        )
                    entities[etype].append(entity)
            
            return entities
            
        except Exception as e:
            logger.error(f"Entity extraction failed: {e}")
            raise ExtractionFailedException(f"Failed to extract entities: {e}")
    
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
        self._ensure_loaded()
        
        try:
            result = self._gliner.classify_text(text, categories)
            return result
            
        except Exception as e:
            logger.error(f"Text classification failed: {e}")
            raise ExtractionFailedException(f"Failed to classify text: {e}")
    
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
        self._ensure_loaded()
        
        try:
            result = self._gliner.extract_json(text, schema)
            return result
            
        except Exception as e:
            logger.error(f"Structured extraction failed: {e}")
            raise ExtractionFailedException(f"Failed to extract structured data: {e}")
    
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
        self._ensure_loaded()
        
        try:
            result = self._gliner.extract_relations(text, relation_types)
            return result.get('relation_extraction', {})
            
        except Exception as e:
            logger.error(f"Relation extraction failed: {e}")
            raise ExtractionFailedException(f"Failed to extract relations: {e}")


# Register the extractor with the factory
ExtractorFactory.register('gliner2', GLiNER2Extractor)
