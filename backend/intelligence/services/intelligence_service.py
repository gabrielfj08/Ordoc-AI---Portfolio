"""
Intelligence Service - Main orchestration service for document analysis.
"""
from typing import Dict, List, Any, Optional
from uuid import UUID
import asyncio
import logging

from ..core.entities import (
    ExtractionResult,
    CouncilDeliberation,
    ValidationAlert
)
from ..models import KnowledgeFeedback, KnowledgeLayer, ActionType
from ..extractors import ExtractorFactory
from ..council import (
    CouncilOrchestrator,
    Chairman,
    OllamaClient,
    LegalExpert,
    FinancialExpert,
    GeneralExpert
)

logger = logging.getLogger('intelligence.services')


class IntelligenceService:
    """
    Main service for document intelligence analysis.
    
    Orchestrates the complete flow:
    1. Entity extraction (GLiNER2)
    2. Council deliberation (LLM specialists)
    3. Pattern matching (Knowledge base)
    4. Alert generation
    """
    
    def __init__(
        self,
        ollama_endpoint: str = None,
        extractor_name: str = "gliner2",
        model_name: str = "qwen2.5:7b"
    ):
        """
        Initialize the intelligence service.
        
        Args:
            ollama_endpoint: URL of the Ollama server
            extractor_name: Name of the extractor to use
            model_name: Default model for council members
        """
        self._ollama_endpoint = ollama_endpoint
        self._extractor_name = extractor_name
        self._model_name = model_name
        
        self._extractor = None
        self._council = None
        self._ollama_client = None
        self._initialized = False
    
    async def initialize(self) -> None:
        """Initialize all components."""
        if self._initialized:
            return
        
        logger.info("Initializing Intelligence Service")
        
        # Initialize Ollama client
        self._ollama_client = OllamaClient(endpoint=self._ollama_endpoint)
        await self._ollama_client.connect()
        
        # Initialize extractor
        self._extractor = ExtractorFactory.get_or_create(self._extractor_name)
        
        # Initialize council members
        members = [
            LegalExpert(self._ollama_client, self._model_name),
            FinancialExpert(self._ollama_client, self._model_name),
            GeneralExpert(self._ollama_client, "qwen2.5:3b"),
        ]
        
        chairman = Chairman(self._ollama_client, self._model_name)
        
        self._council = CouncilOrchestrator(
            members=members,
            chairman=chairman
        )
        
        self._initialized = True
        logger.info("Intelligence Service initialized successfully")
    
    async def analyze_document(
        self,
        document_id: UUID,
        document_content: str,
        document_type: str = "unknown",
        context: Optional[Dict[str, Any]] = None,
        analysis_depth: str = "full"
    ) -> Dict[str, Any]:
        """
        Perform complete document analysis.
        
        Args:
            document_id: ID of the document
            document_content: Text content of the document
            document_type: Type of document
            context: Additional context
            analysis_depth: "quick" (extraction only), "standard" (+ classification), "full" (+ council)
            
        Returns:
            Dictionary with all analysis results
        """
        if not self._initialized:
            await self.initialize()
        
        context = context or {}
        context['document_type'] = document_type
        
        result = {
            'document_id': str(document_id),
            'document_type': document_type,
            'extraction': None,
            'deliberation': None,
            'alerts': []
        }
        
        # Step 1: Entity extraction
        extraction = self._extractor.analyze(
            document_content,
            config={
                'entity_types': self._get_entity_types(document_type),
                'include_confidence': True,
                'include_spans': True
            }
        )
        extraction.document_id = document_id
        result['extraction'] = extraction.to_dict()
        
        if analysis_depth == "quick":
            return result
        
        # Step 2: Classification
        classification = self._extractor.classify_text(
            document_content,
            {
                'category': ['legal', 'financial', 'health', 'hr', 'general'],
                'urgency': ['low', 'medium', 'high', 'critical']
            }
        )
        result['extraction']['classifications'] = classification
        
        if analysis_depth == "standard":
            return result
        
        # Step 3: Council deliberation (full analysis)
        # Get learned patterns from context or empty list
        learned_patterns = context.get('learned_patterns', [])
        context['learned_patterns'] = learned_patterns
        
        deliberation = await self._council.deliberate(
            document_content,
            context
        )
        deliberation.document_id = document_id
        result['deliberation'] = deliberation.to_dict()
        result['alerts'] = deliberation.alerts
        
        return result
    
    async def quick_extract(
        self,
        text: str,
        entity_types: List[str]
    ) -> Dict[str, List[Dict]]:
        """
        Quick entity extraction without full analysis.
        
        Args:
            text: Text to extract from
            entity_types: Types of entities to extract
            
        Returns:
            Dictionary of extracted entities
        """
        if not self._initialized:
            await self.initialize()
        
        entities = self._extractor.extract_entities(
            text,
            entity_types,
            include_confidence=True
        )
        
        return {
            etype: [e.to_dict(include_confidence=True) for e in elist]
            for etype, elist in entities.items()
        }
    
    async def submit_feedback(
        self,
        document_id: UUID,
        alert_id: UUID,
        action: str,
        modifications: Optional[Dict[str, Any]] = None,
        user_id: Optional[UUID] = None,
        organization_id: Optional[UUID] = None
    ) -> KnowledgeFeedback:
        """
        Submit user feedback for learning.
        
        Args:
            document_id: ID of the document
            alert_id: ID of the alert being responded to
            action: User action (accept, reject, modify)
            modifications: Any modifications made
            user_id: ID of the user
            organization_id: ID of the organization
            
        Returns:
            Created KnowledgeFeedback object
        """
        action_type = {
            'accept': ActionType.APPROVAL,
            'reject': ActionType.REJECTION,
            'modify': ActionType.CORRECTION
        }.get(action, ActionType.CORRECTION)
        
        feedback = KnowledgeFeedback(
            layer=KnowledgeLayer.USER,
            action_type=action_type,
            original_value=str(modifications.get('original', '')) if modifications else '',
            corrected_value=str(modifications.get('corrected', '')) if modifications else '',
            context={
                'document_id': str(document_id),
                'alert_id': str(alert_id),
                'modifications': modifications
            },
            user_id=user_id,
            organization_id=organization_id
        )
        
        # TODO: Store feedback in knowledge repository
        logger.info(f"Feedback received: {action} for alert {alert_id}")
        
        return feedback
    
    def _get_entity_types(self, document_type: str) -> List[str]:
        """Get relevant entity types for a document type."""
        common = ['person', 'organization', 'date', 'value', 'location']
        
        type_specific = {
            'legal': ['clause', 'law_reference', 'obligation', 'party'],
            'financial': ['amount', 'percentage', 'payment_term', 'account'],
            'health': ['patient', 'medication', 'dosage', 'symptom'],
            'hr': ['employee', 'position', 'salary', 'benefit', 'department'],
        }
        
        return common + type_specific.get(document_type, [])
