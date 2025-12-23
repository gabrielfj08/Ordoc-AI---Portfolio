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
