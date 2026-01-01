"""
Ollama Extractor - Implementation using local LLM via OllamaClient.
"""
import json
import logging
import re
from typing import Any, Dict, List, Optional

from ..core.entities import ExtractedEntity
from ..core.exceptions import ExtractionFailedException
from .base import BaseExtractor
from .factory import ExtractorFactory
from ..council.ollama_client import OllamaClient

logger = logging.getLogger('intelligence.extractors.ollama')


class OllamaExtractor(BaseExtractor):
    """
    Document entity extractor using Ollama LLMs.
    
    Leverages the already running Ollama infrastructure to perform:
    - Named Entity Recognition (NER)
    - Text Classification
    - Structured JSON Extraction
    
    This replaces the BERT-based GLiNER2, removing NVIDIA/CUDA hardware requirements.
    """
    
    DEFAULT_MODEL = "qwen2.5:3b" # Default lightweight model for extraction tasks
    
    def __init__(self, model_name: str = None, device: str = "cpu"):
        """
        Initialize the Ollama extractor.
        """
        super().__init__(
            model_name=model_name or self.DEFAULT_MODEL,
            device="cpu" # Ollama handles hardware, backend is always CPU
        )
        self._client = None
    
    def load_model(self) -> None:
        """Initialize connection to Ollama."""
        if self._is_loaded:
            return
        
        try:
            self._client = OllamaClient()
            # Note: client.connect() is lazy-called in generate
            self._is_loaded = True
            logger.info(f"OllamaExtractor initialized with model: {self._model_name}")
        except Exception as e:
            logger.error(f"Failed to initialize OllamaExtractor: {e}")
            self._is_loaded = False
    
    def extract_entities(
        self,
        text: str,
        entity_types: List[str],
        include_confidence: bool = False,
        include_spans: bool = False
    ) -> Dict[str, List[ExtractedEntity]]:
        """
        Extract named entities from text using prompt engineering.
        """
        prompt = f"""
        Extract the following entity types from the text provided below: {', '.join(entity_types)}.
        
        Rules:
        1. Return ONLY a valid JSON object.
        2. No explanations, no markdown code blocks.
        3. The JSON keys must be the entity types requested.
        4. The values must be lists of strings (the extracted text).
        5. If an entity type is not found, return an empty list for that key.
        
        Text to analyze:
        ---
        {text[:4000]}
        ---
        """
        
        try:
            # Sync wrapper for async generate if needed, but here we assume the service orchestrates it
            # For simplicity in this implementation, we use a default event loop logic or block
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            response_text = loop.run_until_complete(
                self._client.generate(
                    model=self._model_name,
                    prompt=prompt,
                    system="You are an expert data extractor that speaks only JSON.",
                    temperature=0.1
                )
            )
            loop.close()
            
            # Extract JSON from response (handling potential markdown formatting)
            json_str = self._clean_json_response(response_text)
            raw_data = json.loads(json_str)
            
            entities = {}
            for etype in entity_types:
                entities[etype] = []
                items = raw_data.get(etype, [])
                if isinstance(items, list):
                    for item in items:
                        entities[etype].append(ExtractedEntity(
                            text=str(item),
                            entity_type=etype,
                            confidence=0.9 # Fixed high confidence for LLM extraction
                        ))
            
            return entities
            
        except Exception as e:
            logger.error(f"Ollama entity extraction failed: {e}")
            # Fallback to empty results to avoid crashing the pipeline
            return {etype: [] for etype in entity_types}

    def classify_text(
        self,
        text: str,
        categories: Dict[str, List[str]],
        multi_label: bool = False
    ) -> Dict[str, Any]:
        """Classify text using Ollama."""
        prompt = f"""
        Classify the following text into these categories: {json.dumps(categories)}.
        
        Rules:
        1. Return ONLY a valid JSON object.
        2. Keys should be the category names.
        3. Values should be the chosen label from the possible options.
        
        Text:
        ---
        {text[:2000]}
        ---
        """
        
        try:
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            response_text = loop.run_until_complete(
                self._client.generate(
                    model=self._model_name,
                    prompt=prompt,
                    system="You are an expert classifier that speaks only JSON.",
                    temperature=0.1
                )
            )
            loop.close()
            
            json_str = self._clean_json_response(response_text)
            return json.loads(json_str)
        except Exception as e:
            logger.error(f"Ollama classification failed: {e}")
            return {cat: "unknown" for cat in categories}

    def _clean_json_response(self, text: str) -> str:
        """Deep clean of response to find the JSON block."""
        # Find anything between { and }
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            return match.group(1)
        return text.strip()

    def extract_structured(self, text: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Not implemented for now, reuse classification logic or LLM extraction."""
        return {}

    def extract_relations(self, text: str, relation_types: List[str]) -> Dict[str, List[tuple]]:
        """Not implemented for now."""
        return {}


# Register with factory
ExtractorFactory.register('ollama', OllamaExtractor)
