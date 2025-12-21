"""
Intelligence Module Exceptions - Custom exception classes.
"""


class IntelligenceException(Exception):
    """Base exception for intelligence module."""
    pass


class ExtractorException(IntelligenceException):
    """Exception raised by extractors."""
    pass


class ModelNotLoadedException(ExtractorException):
    """Raised when trying to use an extractor without loading the model."""
    pass


class ExtractionFailedException(ExtractorException):
    """Raised when entity extraction fails."""
    pass


class CouncilException(IntelligenceException):
    """Exception raised by council operations."""
    pass


class MemberNotAvailableException(CouncilException):
    """Raised when a council member is not available."""
    pass


class DeliberationTimeoutException(CouncilException):
    """Raised when council deliberation times out."""
    pass


class KnowledgeException(IntelligenceException):
    """Exception raised by knowledge store operations."""
    pass


class PatternNotFoundException(KnowledgeException):
    """Raised when a requested pattern is not found."""
    pass


class FeedbackStorageException(KnowledgeException):
    """Raised when feedback cannot be stored."""
    pass


class ValidationException(IntelligenceException):
    """Exception raised by validation operations."""
    pass


class ComplianceCheckFailedException(ValidationException):
    """Raised when compliance check fails to execute."""
    pass


class OllamaException(IntelligenceException):
    """Exception raised by Ollama client operations."""
    pass


class OllamaConnectionException(OllamaException):
    """Raised when cannot connect to Ollama server."""
    pass


class ModelNotFoundException(OllamaException):
    """Raised when a requested model is not available in Ollama."""
    pass
