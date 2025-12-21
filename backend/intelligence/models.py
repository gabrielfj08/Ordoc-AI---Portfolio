"""
Intelligence Models - Django models for hierarchical knowledge storage.
"""
from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class KnowledgeLayer(models.TextChoices):
    """Layers of knowledge hierarchy."""
    USER = 'user', 'Usuário'
    ORGANIZATION = 'organization', 'Organização'
    SECTOR = 'sector', 'Setor'
    PLATFORM = 'platform', 'Plataforma'


class ActionType(models.TextChoices):
    """Types of user actions on documents."""
    CORRECTION = 'correction', 'Correção'
    APPROVAL = 'approval', 'Aprovação'
    REJECTION = 'rejection', 'Rejeição'


class AlertSeverity(models.TextChoices):
    """Severity levels for alerts."""
    INFO = 'info', 'Informação'
    WARNING = 'warning', 'Aviso'
    ERROR = 'error', 'Erro'
    CRITICAL = 'critical', 'Crítico'


class AlertType(models.TextChoices):
    """Types of validation alerts."""
    COMPLIANCE = 'compliance', 'Conformidade'
    PATTERN = 'pattern', 'Padrão'
    SUGGESTION = 'suggestion', 'Sugestão'
    ERROR = 'error', 'Erro'


class UserResponse(models.TextChoices):
    """User response to an alert."""
    PENDING = 'pending', 'Pendente'
    ACCEPTED = 'accepted', 'Aceito'
    REJECTED = 'rejected', 'Rejeitado'
    MODIFIED = 'modified', 'Modificado'


class KnowledgeFeedback(models.Model):
    """
    Feedback from user actions for learning.
    
    Captures user corrections, approvals, and rejections
    to build the knowledge base.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Knowledge layer
    layer = models.CharField(
        max_length=20,
        choices=KnowledgeLayer.choices,
        default=KnowledgeLayer.USER,
        db_index=True
    )
    
    # Document context
    document_type = models.CharField(max_length=100, db_index=True)
    sector = models.CharField(max_length=100, blank=True, db_index=True)
    field_name = models.CharField(max_length=200, blank=True)
    
    # Action details
    action_type = models.CharField(
        max_length=20,
        choices=ActionType.choices,
        default=ActionType.CORRECTION
    )
    original_value = models.TextField(blank=True)
    corrected_value = models.TextField(blank=True)
    
    # Context (JSON fields for flexibility)
    context = models.JSONField(default=dict, blank=True)
    
    # Relationships
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='knowledge_feedbacks'
    )
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='knowledge_feedbacks'
    )
    
    # Confidence tracking
    confidence_before = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    confidence_after = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Knowledge Feedback'
        verbose_name_plural = 'Knowledge Feedbacks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['layer', 'document_type']),
            models.Index(fields=['organization', 'document_type']),
            models.Index(fields=['processed', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.action_type} - {self.document_type} ({self.layer})"


class LearnedPattern(models.Model):
    """
    A pattern learned from aggregated user feedback.
    
    Patterns are used to generate proactive alerts
    when similar situations are detected.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Knowledge layer
    layer = models.CharField(
        max_length=20,
        choices=KnowledgeLayer.choices,
        default=KnowledgeLayer.ORGANIZATION,
        db_index=True
    )
    
    # Pattern identification
    pattern_type = models.CharField(max_length=100, db_index=True)
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    
    # Pattern definition (JSONLogic expression)
    condition = models.JSONField(default=dict, help_text="JSONLogic condition")
    
    # Action to suggest when pattern matches
    action = models.JSONField(default=dict, help_text="Suggested action")
    
    # Confidence and usage
    confidence = models.FloatField(
        default=0.5,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    occurrences = models.PositiveIntegerField(default=1)
    
    # Scope
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='learned_patterns'
    )
    sector = models.CharField(max_length=100, blank=True, db_index=True)
    document_type = models.CharField(max_length=100, blank=True, db_index=True)
    
    # Status
    is_active = models.BooleanField(default=True, db_index=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    last_matched_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Learned Pattern'
        verbose_name_plural = 'Learned Patterns'
        ordering = ['-confidence', '-occurrences']
        indexes = [
            models.Index(fields=['layer', 'pattern_type', 'is_active']),
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['sector', 'document_type', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.pattern_type}: {self.name or 'Unnamed'} ({self.confidence:.0%})"


class PatternFeedbackLink(models.Model):
    """
    Links patterns to the feedbacks that contributed to them.
    
    Tracks which user feedbacks were used to create or update a pattern.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    pattern = models.ForeignKey(
        LearnedPattern,
        on_delete=models.CASCADE,
        related_name='source_feedbacks'
    )
    feedback = models.ForeignKey(
        KnowledgeFeedback,
        on_delete=models.CASCADE,
        related_name='derived_patterns'
    )
    
    contribution_weight = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Pattern Feedback Link'
        verbose_name_plural = 'Pattern Feedback Links'
        unique_together = ['pattern', 'feedback']


class ProactiveAlert(models.Model):
    """
    A proactive alert generated for a document.
    
    Alerts are generated when patterns match or
    compliance issues are detected.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Alert classification
    alert_type = models.CharField(
        max_length=20,
        choices=AlertType.choices,
        default=AlertType.SUGGESTION
    )
    severity = models.CharField(
        max_length=20,
        choices=AlertSeverity.choices,
        default=AlertSeverity.INFO
    )
    
    # Alert content
    title = models.CharField(max_length=255)
    message = models.TextField()
    details = models.JSONField(default=dict, blank=True)
    
    # Location in document
    location = models.JSONField(null=True, blank=True)
    
    # Suggested actions
    suggested_actions = models.JSONField(default=list)
    
    # Source
    source_pattern = models.ForeignKey(
        LearnedPattern,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_alerts'
    )
    
    # Document reference (generic for flexibility)
    document_id = models.UUIDField(db_index=True)
    document_type = models.CharField(max_length=100, blank=True)
    
    # User response
    user_response = models.CharField(
        max_length=20,
        choices=UserResponse.choices,
        default=UserResponse.PENDING
    )
    response_data = models.JSONField(null=True, blank=True)
    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alert_responses'
    )
    responded_at = models.DateTimeField(null=True, blank=True)
    
    # Learning weight
    learning_weight = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    
    # Organization
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='proactive_alerts'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Proactive Alert'
        verbose_name_plural = 'Proactive Alerts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['document_id', 'user_response']),
            models.Index(fields=['organization', 'user_response', 'created_at']),
            models.Index(fields=['severity', 'user_response']),
        ]
    
    def __str__(self):
        return f"[{self.severity}] {self.title}"


class DocumentAnalysis(models.Model):
    """
    Stores the complete analysis result for a document.
    
    Includes extraction results, council deliberation,
    and generated alerts.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Document reference
    document_id = models.UUIDField(db_index=True, unique=True)
    document_type = models.CharField(max_length=100, blank=True)
    
    # Analysis results
    extraction_result = models.JSONField(default=dict)
    council_deliberation = models.JSONField(default=dict)
    
    # Processing info
    analysis_depth = models.CharField(max_length=20, default='full')
    processing_time_ms = models.FloatField(default=0.0)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendente'),
            ('processing', 'Processando'),
            ('completed', 'Completo'),
            ('failed', 'Falhou'),
        ],
        default='pending',
        db_index=True
    )
    error_message = models.TextField(blank=True)
    
    # Organization
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='document_analyses'
    )
    
    # User who requested
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='document_analyses'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Document Analysis'
        verbose_name_plural = 'Document Analyses'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Analysis {self.document_id} ({self.status})"
