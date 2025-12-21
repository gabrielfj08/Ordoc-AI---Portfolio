"""
Ollama Client - Client for interacting with local Ollama server.
"""
from typing import Dict, List, Any, Optional, AsyncIterator
import logging
import asyncio
import os

from ..core.exceptions import OllamaConnectionException, ModelNotFoundException

logger = logging.getLogger('intelligence.council.ollama')


class OllamaClient:
    """
    Client for interacting with local Ollama LLM server.
    
    Provides async methods for generating responses
    from locally hosted language models.
    """
    
    # Use env var, or Docker hostname, or localhost as fallback
    DEFAULT_ENDPOINT = os.environ.get('OLLAMA_HOST', 'http://ollama:11434')
    
    def __init__(self, endpoint: str = None, timeout: int = 120):
        """
        Initialize the Ollama client.
        
        Args:
            endpoint: Ollama server URL (default: http://localhost:11434)
            timeout: Request timeout in seconds
        """
        self._endpoint = endpoint or self.DEFAULT_ENDPOINT
        self._timeout = timeout
        self._client = None
        self._available_models: List[str] = []
    
    @property
    def endpoint(self) -> str:
        """Return the Ollama endpoint URL."""
        return self._endpoint
    
    async def connect(self) -> bool:
        """
        Connect to Ollama server and verify it's running.
        
        Returns:
            True if connection successful
            
        Raises:
            OllamaConnectionException: If cannot connect
        """
        try:
            # Import here to avoid loading at module level
            import ollama
            
            self._client = ollama.AsyncClient(host=self._endpoint)
            
            # Test connection by listing models
            response = await self._client.list()
            self._available_models = [
                model.get('name') or model.get('model', '') for model in response.get('models', [])
            ]
            
            logger.info(
                f"Connected to Ollama at {self._endpoint} - "
                f"Available models: {len(self._available_models)}"
            )
            return True
            
        except ImportError:
            raise OllamaConnectionException(
                "ollama package not installed. Run: pip install ollama"
            )
        except Exception as e:
            raise OllamaConnectionException(
                f"Failed to connect to Ollama at {self._endpoint}: {e}"
            )
    
    @property
    def available_models(self) -> List[str]:
        """Return list of available models."""
        return self._available_models
    
    def is_model_available(self, model_name: str) -> bool:
        """Check if a model is available."""
        return model_name in self._available_models
    
    async def ensure_model(self, model_name: str) -> bool:
        """
        Ensure a model is available, pulling if necessary.
        
        Args:
            model_name: Name of the model to ensure
            
        Returns:
            True if model is available
        """
        if self.is_model_available(model_name):
            return True
        
        logger.info(f"Pulling model: {model_name}")
        try:
            await self._client.pull(model_name)
            self._available_models.append(model_name)
            return True
        except Exception as e:
            logger.error(f"Failed to pull model {model_name}: {e}")
            return False
    
    async def generate(
        self,
        model: str,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs
    ) -> str:
        """
        Generate a response from the model.
        
        Args:
            model: Model name to use
            prompt: User prompt
            system: Optional system prompt
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            **kwargs: Additional Ollama parameters
            
        Returns:
            Generated text response
        """
        if not self._client:
            await self.connect()
        
        if not self.is_model_available(model):
            if not await self.ensure_model(model):
                raise ModelNotFoundException(f"Model {model} not available")
        
        try:
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            
            response = await self._client.chat(
                model=model,
                messages=messages,
                options={
                    "temperature": temperature,
                    "num_predict": max_tokens,
                    **kwargs
                }
            )
            
            return response['message']['content']
            
        except Exception as e:
            logger.error(f"Generation failed for model {model}: {e}")
            raise
    
    async def generate_stream(
        self,
        model: str,
        prompt: str,
        system: Optional[str] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """
        Generate a streaming response from the model.
        
        Args:
            model: Model name to use
            prompt: User prompt
            system: Optional system prompt
            **kwargs: Additional Ollama parameters
            
        Yields:
            Chunks of generated text
        """
        if not self._client:
            await self.connect()
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        async for chunk in await self._client.chat(
            model=model,
            messages=messages,
            stream=True,
            **kwargs
        ):
            if chunk.get('message', {}).get('content'):
                yield chunk['message']['content']
