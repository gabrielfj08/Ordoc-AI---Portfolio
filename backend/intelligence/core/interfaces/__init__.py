# Core Interfaces - Abstract base contracts
from .extractor import IExtractor
from .council import ICouncilMember, IChairman
from .knowledge import IKnowledgeStore
from .validator import IValidator

__all__ = [
    'IExtractor',
    'ICouncilMember',
    'IChairman',
    'IKnowledgeStore',
    'IValidator',
]
