"""
Knowledge Repositories - Layer-specific implementations.
"""
from typing import Dict, Any, Optional
from uuid import UUID
from django.db.models import Q

from ...core.interfaces.knowledge import KnowledgeLayer
from .base import BaseKnowledgeRepository


class UserKnowledgeRepository(BaseKnowledgeRepository):
    """
    Repository for user-level knowledge.
    
    Stores and retrieves patterns specific to individual users.
    """
    
    def __init__(self):
        super().__init__(KnowledgeLayer.USER)
        self._user_id: Optional[UUID] = None
    
    def set_user(self, user_id: UUID) -> 'UserKnowledgeRepository':
        """Set the user context for this repository."""
        self._user_id = user_id
        return self
    
    def _get_scope_filter(self, **kwargs) -> Q:
        """Filter by user."""
        user_id = kwargs.get('user_id', self._user_id)
        if user_id:
            return Q(organization__isnull=True)  # User patterns don't have org
        return Q()


class OrganizationKnowledgeRepository(BaseKnowledgeRepository):
    """
    Repository for organization-level knowledge.
    
    Stores and retrieves patterns learned from all users
    within an organization.
    """
    
    def __init__(self):
        super().__init__(KnowledgeLayer.ORGANIZATION)
        self._organization_id: Optional[UUID] = None
    
    def set_organization(self, organization_id: UUID) -> 'OrganizationKnowledgeRepository':
        """Set the organization context for this repository."""
        self._organization_id = organization_id
        return self
    
    def _get_scope_filter(self, **kwargs) -> Q:
        """Filter by organization."""
        org_id = kwargs.get('organization_id', self._organization_id)
        if org_id:
            return Q(organization_id=org_id)
        return Q()


class SectorKnowledgeRepository(BaseKnowledgeRepository):
    """
    Repository for sector-level knowledge.
    
    Stores and retrieves patterns specific to business sectors
    (legal, financial, health, etc.).
    """
    
    def __init__(self):
        super().__init__(KnowledgeLayer.SECTOR)
        self._sector: Optional[str] = None
    
    def set_sector(self, sector: str) -> 'SectorKnowledgeRepository':
        """Set the sector context for this repository."""
        self._sector = sector
        return self
    
    def _get_scope_filter(self, **kwargs) -> Q:
        """Filter by sector."""
        sector = kwargs.get('sector', self._sector)
        if sector:
            return Q(sector=sector)
        return Q()


class PlatformKnowledgeRepository(BaseKnowledgeRepository):
    """
    Repository for platform-level knowledge.
    
    Stores and retrieves global patterns applicable
    across all organizations and sectors.
    """
    
    def __init__(self):
        super().__init__(KnowledgeLayer.PLATFORM)
    
    def _get_scope_filter(self, **kwargs) -> Q:
        """Platform level has no scope filter - returns all global patterns."""
        return Q(organization__isnull=True, sector='')


# Factory function
def get_repository(layer: KnowledgeLayer) -> BaseKnowledgeRepository:
    """
    Get the appropriate repository for a knowledge layer.
    
    Args:
        layer: The knowledge layer
        
    Returns:
        Repository instance for that layer
    """
    repositories = {
        KnowledgeLayer.USER: UserKnowledgeRepository,
        KnowledgeLayer.ORGANIZATION: OrganizationKnowledgeRepository,
        KnowledgeLayer.SECTOR: SectorKnowledgeRepository,
        KnowledgeLayer.PLATFORM: PlatformKnowledgeRepository,
    }
    return repositories[layer]()
