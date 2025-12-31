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

    def __init__(self):
        self.user = None
        self.organization = None

    def get_recommended_documents(self, user, organization, limit=10):
        """
        Get recommended documents for a user.

        Returns documents based on:
        - User's recent activity
        - User's assigned tasks
        - Favorited documents
        - Popular documents in organization

        Args:
            user: OrdocUser instance
            organization: Organization instance
            limit: Maximum number of documents to return (default: 10)

        Returns:
            QuerySet of Document instances with all relationships prefetched
        """
        from ordoc_flow.models import Task, TaskAttachment, Procedure, ProcedureDocument

        self.user = user
        self.organization = organization

        # Collect document IDs from various sources (batch operations)
        document_ids = set()

        # 1. Recent documents (already optimized table)
        recent_doc_ids = RecentDocument.objects.filter(
            user=user.user,
            organization=organization
        ).values_list('document_id', flat=True)[:limit]
        document_ids.update(recent_doc_ids)

        # 2. Documents from user's assigned tasks (batch load)
        user_task_ids = Task.objects.filter(
            Q(assigned_to=user) | Q(group_assignee__grouprequestermember__user=user),
            procedure__organization=organization,
            status__in=['running', 'started']
        ).values_list('id', flat=True)

        task_attachment_doc_ids = TaskAttachment.objects.filter(
            task_id__in=list(user_task_ids)
        ).values_list('document_id', flat=True)
        document_ids.update(task_attachment_doc_ids)

        # 3. Documents from user's procedures (batch load)
        user_procedure_ids = Procedure.objects.filter(
            created_by=user,
            organization=organization
        ).values_list('id', flat=True)[:20]

        procedure_doc_ids = ProcedureDocument.objects.filter(
            procedure_id__in=list(user_procedure_ids)
        ).values_list('document_id', flat=True)
        document_ids.update(procedure_doc_ids)

        # 4. Popular documents (if we don't have enough yet)
        if len(document_ids) < limit:
            # Get documents with most recent activity
            thirty_days_ago = timezone.now() - timedelta(days=30)
            popular_doc_ids = RecentDocument.objects.filter(
                organization=organization,
                accessed_at__gte=thirty_days_ago
            ).values('document').annotate(
                access_count=Count('id')
            ).order_by('-access_count').values_list('document_id', flat=True)[:limit]
            document_ids.update(popular_doc_ids)

        # Build optimized queryset with all relationships
        documents = Document.objects.filter(
            id__in=list(document_ids),
            organization=organization,
            deleted_at__isnull=True
        ).select_related(
            'organization',
            'department',
            'directory',
            'uploaded_by',
            'uploaded_by__user'
        ).prefetch_related(
            'tags',
            'permissions',
            Prefetch(
                'recentdocument_set',
                queryset=RecentDocument.objects.filter(user=user.user).order_by('-accessed_at')
            )
        ).distinct()[:limit]

        return documents
