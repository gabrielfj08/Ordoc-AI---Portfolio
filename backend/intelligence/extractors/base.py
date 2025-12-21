"""
Base Extractor - Abstract base class for document extractors.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import time
import logging

from ..core.interfaces import IExtractor
from ..core.entities import ExtractedEntity, ExtractionResult
from ..core.exceptions import ModelNotLoadedException

logger = logging.getLogger('intelligence.extractors')


class BaseExtractor(IExtractor, ABC):
    """
    Abstract base class for document entity extractors.
    
    Provides common functionality and enforces the extractor interface.
    Concrete implementations should override the abstract methods.
    """
    
    def __init__(self, model_name: str = None, device: str = "cpu"):
        """
        Initialize the extractor.
        
        Args:
            model_name: Name/path of the model to use
            device: Device to run on ("cpu" or "cuda")
        """
        self._model_name = model_name
        self._device = device
        self._model = None
        self._is_loaded = False
        
    @property
    def model_name(self) -> str:
        """Return the model name."""
        return self._model_name
    
    @property
    def device(self) -> str:
        """Return the device being used."""
        return self._device
    
    @property
    def is_loaded(self) -> bool:
        """Check if the model is loaded."""
        return self._is_loaded
    
    @abstractmethod
    def load_model(self) -> None:
        """Load the underlying model. Must be implemented by subclasses."""
        pass
    
    def _ensure_loaded(self) -> None:
        """Ensure the model is loaded before use."""
        if not self._is_loaded:
            raise ModelNotLoadedException(
                f"Model {self._model_name} is not loaded. Call load_model() first."
            )
    
    def analyze(self, text: str, config: Optional[Dict] = None) -> ExtractionResult:
        """
        Perform comprehensive analysis on text.
        
        Args:
            text: Input text to analyze
            config: Optional configuration for analysis
            
        Returns:
            ExtractionResult containing all extracted information
        """
        self._ensure_loaded()
        config = config or {}
        
        start_time = time.time()
        result = ExtractionResult()
        
        # Extract entities if configured
        entity_types = config.get('entity_types', [])
        if entity_types:
            result.entities = self.extract_entities(
                text,
                entity_types,
                include_confidence=config.get('include_confidence', False),
                include_spans=config.get('include_spans', False)
            )
        
        # Classify if configured
        classifications = config.get('classifications', {})
        if classifications:
            result.classifications = self.classify_text(
                text,
                classifications,
                multi_label=config.get('multi_label', False)
            )
        
        # Extract structured data if configured
        schema = config.get('structured_schema', {})
        if schema:
            result.structured_data = self.extract_structured(text, schema)
        
        # Extract relations if configured
        relation_types = config.get('relation_types', [])
        if relation_types:
            result.relations = self.extract_relations(text, relation_types)
        
        result.processing_time_ms = (time.time() - start_time) * 1000
        
        logger.info(
            f"Analysis completed in {result.processing_time_ms:.2f}ms - "
            f"Entities: {sum(len(v) for v in result.entities.values())}, "
            f"Classifications: {len(result.classifications)}"
        )
        
        return result
