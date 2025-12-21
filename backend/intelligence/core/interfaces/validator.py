"""
Validator Interface - Contract for proactive document validation.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from ..entities import ValidationAlert, AlertSeverity


class IValidator(ABC):
    """
    Interface for proactive document validators.
    
    Validators check documents against compliance rules,
    learned patterns, and organizational standards.
    """
    
    @property
    @abstractmethod
    def validator_type(self) -> str:
        """Return the type of validation performed."""
        pass
    
    @abstractmethod
    async def validate(
        self,
        document_content: str,
        document_metadata: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> List[ValidationAlert]:
        """
        Validate a document and generate alerts.
        
        Args:
            document_content: The document text to validate
            document_metadata: Metadata about the document
            context: Optional additional context
            
        Returns:
            List of ValidationAlert objects
        """
        pass
    
    @abstractmethod
    async def check_compliance(
        self,
        document_content: str,
        compliance_rules: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        """
        Check document against specific compliance rules.
        
        Args:
            document_content: The document text to check
            compliance_rules: List of compliance rules to verify
            
        Returns:
            List of compliance alerts
        """
        pass
    
    @abstractmethod
    async def check_patterns(
        self,
        document_content: str,
        learned_patterns: List[Dict[str, Any]]
    ) -> List[ValidationAlert]:
        """
        Check document against learned organizational patterns.
        
        Args:
            document_content: The document text to check
            learned_patterns: Patterns from knowledge base
            
        Returns:
            List of pattern-based alerts
        """
        pass
