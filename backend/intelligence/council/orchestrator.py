"""
Council Orchestrator - Coordinates the LLM Council deliberation process.
"""
from typing import Dict, List, Any, Optional
import asyncio
import time
import logging

from ..core.interfaces import ICouncilMember, IChairman
from ..core.entities import CouncilOpinion, CouncilDeliberation
from ..core.exceptions import CouncilException, DeliberationTimeoutException

logger = logging.getLogger('intelligence.council')


class CouncilOrchestrator:
    """
    Orchestrates the LLM Council deliberation process.
    
    Manages the flow of:
    1. Gathering opinions from all council members
    2. Cross-reviewing opinions between members
    3. Chairman synthesis of final deliberation
    """
    
    def __init__(
        self,
        members: List[ICouncilMember],
        chairman: IChairman,
        timeout_seconds: int = 120
    ):
        """
        Initialize the orchestrator.
        
        Args:
            members: List of council member instances
            chairman: Chairman instance for synthesis
            timeout_seconds: Maximum time for deliberation
        """
        self._members = members
        self._chairman = chairman
        self._timeout = timeout_seconds
        
    @property
    def member_count(self) -> int:
        """Return the number of council members."""
        return len(self._members)
    
    @property
    def member_domains(self) -> List[str]:
        """Return list of member domain specializations."""
        return [m.domain for m in self._members]
    
    async def deliberate(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]] = None
    ) -> CouncilDeliberation:
        """
        Execute full council deliberation on a document.
        
        Args:
            document_content: The document text to analyze
            context: Optional context information
            
        Returns:
            CouncilDeliberation with complete results
        """
        start_time = time.time()
        context = context or {}
        
        logger.info(f"Starting council deliberation with {self.member_count} members")
        
        try:
            # Stage 1: Gather initial opinions from all members
            opinions = await self._gather_opinions(document_content, context)
            logger.info(f"Stage 1 complete: {len(opinions)} opinions gathered")
            
            # Stage 2: Cross-review (each member reviews others' opinions)
            reviews = await self._cross_review(document_content, opinions)
            logger.info(f"Stage 2 complete: {len(reviews)} reviews collected")
            
            # Stage 3: Chairman synthesis
            deliberation = await self._chairman.synthesize(
                document_content,
                opinions,
                reviews
            )
            
            # Generate proactive alerts
            learned_patterns = context.get('learned_patterns', [])
            alerts = await self._chairman.generate_alerts(deliberation, learned_patterns)
            deliberation.alerts = alerts
            
            deliberation.total_processing_time_ms = (time.time() - start_time) * 1000
            
            logger.info(
                f"Deliberation complete in {deliberation.total_processing_time_ms:.2f}ms - "
                f"Alerts: {len(alerts)}"
            )
            
            return deliberation
            
        except asyncio.TimeoutError:
            raise DeliberationTimeoutException(
                f"Council deliberation timed out after {self._timeout} seconds"
            )
        except Exception as e:
            logger.exception("Council deliberation failed")
            raise CouncilException(f"Deliberation failed: {str(e)}")
    
    async def _gather_opinions(
        self,
        document_content: str,
        context: Dict[str, Any]
    ) -> List[CouncilOpinion]:
        """Gather opinions from all members concurrently."""
        tasks = [
            asyncio.wait_for(
                member.analyze(document_content, context),
                timeout=self._timeout / 3
            )
            for member in self._members
        ]
        
        opinions = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out exceptions and log them
        valid_opinions = []
        for i, opinion in enumerate(opinions):
            if isinstance(opinion, Exception):
                logger.warning(f"Member {self._members[i].domain} failed: {opinion}")
            else:
                valid_opinions.append(opinion)
        
        return valid_opinions
    
    async def _cross_review(
        self,
        document_content: str,
        opinions: List[CouncilOpinion]
    ) -> List[Dict[str, Any]]:
        """Have each member review other members' opinions."""
        reviews = []
        
        for member in self._members:
            # Get opinions from other members (anonymized)
            other_opinions = [
                op for op in opinions if op.member_domain != member.domain
            ]
            
            if other_opinions:
                try:
                    review = await asyncio.wait_for(
                        member.review_opinions(document_content, other_opinions),
                        timeout=self._timeout / 3
                    )
                    review['reviewer_domain'] = member.domain
                    reviews.append(review)
                except Exception as e:
                    logger.warning(f"Review by {member.domain} failed: {e}")
        
        return reviews
    
    async def quick_validate(
        self,
        document_content: str,
        validation_rules: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Quick validation without full deliberation.
        
        Uses members in parallel to check specific rules.
        
        Args:
            document_content: The document to validate
            validation_rules: Rules to check
            
        Returns:
            List of validation results
        """
        tasks = [
            member.validate(document_content, validation_rules)
            for member in self._members
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        all_results = []
        for result in results:
            if not isinstance(result, Exception):
                all_results.extend(result)
        
        return all_results
