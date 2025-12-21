"""
Extractor Factory - Factory for creating extractor instances.
"""
from typing import Dict, Type, Optional
import logging

from .base import BaseExtractor
from ..core.exceptions import ExtractorException

logger = logging.getLogger('intelligence.extractors')


class ExtractorFactory:
    """
    Factory for creating and managing extractor instances.
    
    Uses the Factory pattern to decouple extractor creation
    from the code that uses them.
    """
    
    _extractors: Dict[str, Type[BaseExtractor]] = {}
    _instances: Dict[str, BaseExtractor] = {}
    
    @classmethod
    def register(cls, name: str, extractor_class: Type[BaseExtractor]) -> None:
        """
        Register an extractor class.
        
        Args:
            name: Name to register the extractor under
            extractor_class: The extractor class to register
        """
        cls._extractors[name] = extractor_class
        logger.info(f"Registered extractor: {name}")
    
    @classmethod
    def create(
        cls,
        name: str,
        model_name: Optional[str] = None,
        device: str = "cpu",
        auto_load: bool = True
    ) -> BaseExtractor:
        """
        Create an extractor instance.
        
        Args:
            name: Name of the registered extractor
            model_name: Optional model name override
            device: Device to run on
            auto_load: Whether to automatically load the model
            
        Returns:
            Configured extractor instance
            
        Raises:
            ExtractorException: If extractor is not registered
        """
        if name not in cls._extractors:
            raise ExtractorException(f"Unknown extractor: {name}")
        
        extractor = cls._extractors[name](model_name=model_name, device=device)
        
        if auto_load:
            extractor.load_model()
        
        return extractor
    
    @classmethod
    def get_or_create(
        cls,
        name: str,
        model_name: Optional[str] = None,
        device: str = "cpu"
    ) -> BaseExtractor:
        """
        Get an existing instance or create a new one.
        
        Uses singleton pattern for each unique configuration.
        
        Args:
            name: Name of the registered extractor
            model_name: Optional model name override
            device: Device to run on
            
        Returns:
            Extractor instance
        """
        key = f"{name}:{model_name or 'default'}:{device}"
        
        if key not in cls._instances:
            cls._instances[key] = cls.create(name, model_name, device)
        
        return cls._instances[key]
    
    @classmethod
    def available_extractors(cls) -> list:
        """Return list of registered extractor names."""
        return list(cls._extractors.keys())
