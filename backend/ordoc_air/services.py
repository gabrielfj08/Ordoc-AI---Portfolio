from django.db.models import Q, Count, Prefetch
from django.utils import timezone
from datetime import timedelta
import re
from .models import CategorizationRule, Document, ActivityLog, RecentDocument

class CategorizationService:
    """Service to handle automatic document categorization"""

    @staticmethod
    def classify_document(document: Document) -> list[str]:
        """
        Apply categorization rules to a document.
        Returns a list of applied rule names.
        """
        if not document.organization or not document.extracted_text:
            return []

        # Get active rules for the organization
        # Assuming Document has indirect relation to organization via Directory -> Department -> Organization
        # But wait, Document model: directory = models.ForeignKey(Directory...)
        # directory -> department -> organization
        
        organization = None
        if document.department and document.department.organization:
            organization = document.department.organization
        elif document.directory and document.directory.department and document.directory.department.organization:
            organization = document.directory.department.organization
            
        if not organization:
            return []

        rules = CategorizationRule.objects.filter(
            organization=organization,
            is_active=True
        )

        applied_rules = []
        text = document.extracted_text.lower()
        title = document.name.lower()

        for rule in rules:
            matched = False
            pattern = rule.pattern.lower()
            
            # Check match
            if rule.match_type == 'exact':
                if pattern == text or pattern == title:
                    matched = True
            elif rule.match_type == 'contains':
                if pattern in text or pattern in title:
                    matched = True
            elif rule.match_type == 'regex':
                try:
                    if re.search(rule.pattern, document.extracted_text, re.IGNORECASE) or \
                       re.search(rule.pattern, document.name, re.IGNORECASE):
                        matched = True
                except re.error:
                    continue  # Invalid regex, skip
            
            if matched:
                # Apply actions
                actions_taken = []
                
                if rule.target_tag:
                    document.tags.add(rule.target_tag)
                    actions_taken.append(f"Tag added: {rule.target_tag.name}")
                
                if rule.target_directory:
                    # Move document
                    # Need to check permissions/logic if needed, but for auto-cat we enforce it
                    old_directory = document.directory
                    document.directory = rule.target_directory
                    document.department = rule.target_directory.department
                    document.save(update_fields=['directory', 'department', 'updated_at'])
                    actions_taken.append(f"Moved to: {rule.target_directory.name}")
                
                if actions_taken:
                    applied_rules.append(rule.name)
                    # Log activity
                    ActivityLog.log(
                        action='update', 
                        entity_type='document',
                        entity_id=document.id,
                        entity_name=document.name,
                        organization=organization,
                        description=f"Auto-categorized by rule '{rule.name}': {', '.join(actions_taken)}",
                        user=None # System action
                    )

        return applied_rules

class DocumentRecommendationService:
    """
    Service for generating document recommendations.

    Optimized to batch-load all necessary data in a few queries
    instead of N+1 queries per document.

    Created as part of Sprint 5 - Performance Backend
    """

    @classmethod
    def get_recommended_documents(cls, user, organization, limit=10):
        """
        Get recommended documents for a user.

        Returns documents based on:
        - User's recent activity
        - User's assigned tasks
        - Favorited documents
        - Popular documents in organization

        Args:
            user: User or ExternalRequester instance
            organization: Organization instance
            limit: Maximum number of documents to return (default: 10)

        Returns:
            List of dicts: [{'doc': Document, 'reasons': set, 'type': str}]
        """
        from django.contrib.auth.models import User
        from ordoc_cloud.models import OrdocUser
        from ordoc_flow.models import Task, TaskAttachment, Procedure, ProcedureDocument, ExternalRequester

        # Track reasons for each document
        doc_meta = {} # doc_id -> {'reasons': set(), 'type': 'dms'}

        def add_doc_ids(ids, reason, source_type='dms'):
            for d_id in ids:
                if d_id not in doc_meta:
                    doc_meta[d_id] = {'reasons': set(), 'type': source_type}
                doc_meta[d_id]['reasons'].add(reason)

        # Identify user context
        django_user = user if isinstance(user, User) else None
        external_user = user if isinstance(user, ExternalRequester) else None
        
        ordoc_user = None
        if django_user:
            try:
                ordoc_user = django_user.ordoc_profile
            except:
                pass

        # 1. Recent documents (Internal users only)
        if django_user:
            recent_doc_ids = list(RecentDocument.objects.filter(
                user=django_user,
                document__department__organization=organization
            ).values_list('document_id', flat=True)[:limit])
            add_doc_ids(recent_doc_ids, 'Recente')

        # 2. Documents from user's procedures (Internal users only)
        # Note: We don't have direct link from ProcedureDocument to DMS Document yet
        # So we skip this for now to avoid FieldError
        pass

        # 4. Popular documents (if needed)
        if len(doc_meta) < limit:
            thirty_days_ago = timezone.now() - timedelta(days=30)
            popular_ids = list(RecentDocument.objects.filter(
                document__department__organization=organization,
                accessed_at__gte=thirty_days_ago
            ).values('document').annotate(
                access_count=Count('id')
            ).order_by('-access_count').values_list('document_id', flat=True)[:limit])
            add_doc_ids(popular_ids, 'Popular na Organização')

        # Fetch and optimize documents in a single query
        all_ids = list(doc_meta.keys())
        if not all_ids:
            return []

        documents = Document.objects.filter(
            id__in=all_ids,
            department__organization=organization,
            deleted_at__isnull=True
        ).select_related(
            'department__organization',
            'department',
            'directory',
            'created_by'
        ).prefetch_related(
            'tags',
            'permissions',
            Prefetch(
                'recent_accesses',
                queryset=RecentDocument.objects.filter(user=django_user).order_by('-accessed_at') if django_user else RecentDocument.objects.none()
            )
        ).distinct()[:limit]

        # Weights for scoring
        weights = {
            'Tarefa Crítica': 100,
            'Próximo Vencimento': 95,
            'Favorito': 90,
            'Recente': 80,
            'Procedimento': 70,
            'Popular na Organização': 50
        }

        # Final structure for view
        results = []
        for doc in documents:
            meta = doc_meta.get(doc.id, {'reasons': set(), 'type': 'dms'})
            
            # Calculate score based on max weight of reasons
            score = max([weights.get(r, 0) for r in meta['reasons']]) if meta['reasons'] else 0
            
            results.append({
                'doc': doc,
                'reasons': meta['reasons'],
                'type': meta['type'],
                'score': score
            })

        # Sort by score desc
        return sorted(results, key=lambda x: x['score'], reverse=True)
