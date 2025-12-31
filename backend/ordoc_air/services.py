from django.db.models import Q
import re
from .models import CategorizationRule, Document, ActivityLog

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
    """Service to unifiy and recommend documents efficiently"""

    @staticmethod
    def get_recommended_documents(user, organization, limit=10):
        """
        Unifies and ranks documents from multiple sources with optimized queries.
        """
        from ordoc_flow.models import Task, TaskAttachment, ProcedureDocument, GroupRequesterMember
        from ordoc_air.models import RecentDocument
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Prefetch

        scored_items = {} # {id: {'score': int, 'reasons': set(), 'doc': object, 'type': str}}

        # 1. Get user groups for task filtering
        active_group_ids = GroupRequesterMember.objects.filter(
            user__user=user,
            is_active=True
        ).values_list('group_id', flat=True)

        # 2. Optimized Task Query
        tasks = Task.objects.filter(
            procedure__organization=organization,
            status__in=['running', 'started']
        ).filter(
            Q(assignee__user=user) | Q(group_assignee_id__in=active_group_ids)
        ).select_related('procedure')

        today = timezone.now().date()
        critical_tasks = tasks.filter(Q(priority='high') | Q(deadline__lt=today))
        upcoming_tasks = tasks.filter(deadline__gte=today, deadline__lte=today + timedelta(days=3))

        # 3. Batch load Workflow Attachments
        def process_workflow_docs(task_qs, score, reason):
            if not task_qs.exists():
                return

            # TaskAttachments bulk
            attachments = TaskAttachment.objects.filter(
                task__in=task_qs, 
                deleted_at__isnull=True
            ).select_related('task')
            
            for att in attachments:
                doc_id = str(att.id)
                if doc_id not in scored_items:
                    scored_items[doc_id] = {'score': 0, 'reasons': set(), 'doc': att, 'type': 'workflow'}
                scored_items[doc_id]['score'] += score
                scored_items[doc_id]['reasons'].add(reason)

            # ProcedureDocuments bulk
            proc_ids = task_qs.values_list('procedure_id', flat=True)
            proc_docs = ProcedureDocument.objects.filter(
                procedure_id__in=proc_ids,
                deleted_at__isnull=True
            ).exclude(file='')
            
            for pd in proc_docs:
                doc_id = str(pd.id)
                if doc_id not in scored_items:
                    scored_items[doc_id] = {'score': 0, 'reasons': set(), 'doc': pd, 'type': 'workflow'}
                scored_items[doc_id]['score'] += score
                scored_items[doc_id]['reasons'].add(reason)

        process_workflow_docs(critical_tasks, 50, 'Tarefa Crítica')
        process_workflow_docs(upcoming_tasks, 30, 'Próximo Vencimento')

        # 4. Optimized DMS Favorites
        fav_docs = Document.objects.filter(
            favorited_by=user,
            deleted_at__isnull=True,
            document_status='active'
        ).select_related('department__organization', 'directory')

        for doc in fav_docs:
            doc_id = str(doc.id)
            if doc_id not in scored_items:
                scored_items[doc_id] = {'score': 0, 'reasons': set(), 'doc': doc, 'type': 'dms'}
            scored_items[doc_id]['score'] += 20
            scored_items[doc_id]['reasons'].add('Favorito')

        # 5. Optimized Recent Documents
        recents = RecentDocument.objects.filter(
            user=user
        ).select_related(
            'document__department__organization', 
            'document__directory'
        ).order_by('-accessed_at')[:limit]

        for rd in recents:
            doc = rd.document
            if not doc or doc.deleted_at or doc.document_status != 'active':
                continue
            
            doc_id = str(doc.id)
            if doc_id not in scored_items:
                scored_items[doc_id] = {'score': 0, 'reasons': set(), 'doc': doc, 'type': 'dms'}
            scored_items[doc_id]['score'] += 10
            scored_items[doc_id]['reasons'].add('Recente')

        # 6. Final Ranking and Formatting
        ranked_list = sorted(scored_items.values(), key=lambda x: x['score'], reverse=True)[:limit]
        
        return ranked_list
