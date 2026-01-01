"""
Intelligence Serializers - DRF serializers for intelligence API.
"""
from rest_framework import serializers
from uuid import UUID
from ..models import (
    KnowledgeFeedback,
    LearnedPattern,
    ProactiveAlert,
    DocumentAnalysis,
    UserBehaviorScore,
    KnowledgeLayer,
    AlertSeverity,
    AlertType,
    UserResponse
)


class ExtractedEntitySerializer(serializers.Serializer):
    """Serializer for extracted entities."""
    text = serializers.CharField()
    entity_type = serializers.CharField()
    confidence = serializers.FloatField(required=False)
    start = serializers.IntegerField(required=False)
    end = serializers.IntegerField(required=False)


class CouncilOpinionSerializer(serializers.Serializer):
    """Serializer for council member opinions."""
    id = serializers.UUIDField(read_only=True)
    member_domain = serializers.CharField()
    analysis = serializers.CharField()
    findings = serializers.ListField(child=serializers.DictField(), required=False)
    concerns = serializers.ListField(child=serializers.DictField(), required=False)
    recommendations = serializers.ListField(child=serializers.CharField(), required=False)
    confidence = serializers.CharField()
    processing_time_ms = serializers.FloatField()


class SuggestedActionSerializer(serializers.Serializer):
    """Serializer for suggested actions."""
    action_type = serializers.CharField()
    label = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    auto_applicable = serializers.BooleanField(default=False)
    payload = serializers.DictField(required=False)


class ProactiveAlertSerializer(serializers.ModelSerializer):
    """Serializer for proactive alerts."""
    suggested_actions = SuggestedActionSerializer(many=True, read_only=True)
    is_read = serializers.SerializerMethodField()
    
    class Meta:
        model = ProactiveAlert
        fields = [
            'id', 'alert_type', 'severity', 'title', 'message', 'details',
            'location', 'suggested_actions', 'document_id', 'document_type_name',
            'user_response', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'is_read']
    
    def get_is_read(self, obj):
        """Return True if alert has been responded to (not pending)."""
        return obj.user_response != 'pending'


class AlertResponseSerializer(serializers.Serializer):
    """Serializer for user response to alerts."""
    alert_id = serializers.UUIDField()
    response = serializers.ChoiceField(choices=UserResponse.choices)
    modifications = serializers.DictField(required=False)


class DocumentAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for document analysis results."""
    
    document_type = serializers.CharField(source='document_type_name', read_only=True)

    class Meta:
        model = DocumentAnalysis
        fields = [
            'id', 'document_id', 'document_type', 'extraction_result',
            'council_deliberation', 'analysis_depth', 'processing_time_ms',
            'status', 'error_message', 'created_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']


class AnalysisRequestSerializer(serializers.Serializer):
    """Serializer for analysis request."""
    document_id = serializers.UUIDField()
    document_content = serializers.CharField()
    document_type = serializers.CharField(required=False, default='unknown')
    analysis_depth = serializers.ChoiceField(
        choices=['quick', 'standard', 'full'],
        default='full'
    )
    context = serializers.DictField(required=False)


class QuickExtractRequestSerializer(serializers.Serializer):
    """Serializer for quick extraction request."""
    text = serializers.CharField()
    entity_types = serializers.ListField(
        child=serializers.CharField(),
        min_length=1
    )


class KnowledgeFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for knowledge feedback."""
    
    class Meta:
        model = KnowledgeFeedback
        fields = [
            'id', 'layer', 'document_type', 'sector', 'field_name',
            'action_type', 'original_value', 'corrected_value', 'context',
            'confidence_before', 'confidence_after', 'created_at'
        ]
        read_only_fields = ['id', 'layer', 'created_at']


class FeedbackSubmitSerializer(serializers.Serializer):
    """Serializer for submitting feedback."""
    document_id = serializers.UUIDField()
    alert_id = serializers.UUIDField()
    action = serializers.ChoiceField(choices=['accept', 'reject', 'modify'])
    modifications = serializers.DictField(required=False)


class LearnedPatternSerializer(serializers.ModelSerializer):
    """Serializer for learned patterns."""
    
    class Meta:
        model = LearnedPattern
        fields = [
            'id', 'layer', 'pattern_type', 'name', 'description',
            'condition', 'action', 'confidence', 'occurrences',
            'is_active', 'created_at', 'last_updated'
        ]
        read_only_fields = ['id', 'created_at', 'last_updated']


class AnalysisResultSerializer(serializers.Serializer):
    """Serializer for complete analysis result."""
    document_id = serializers.UUIDField()
    document_type = serializers.CharField()
    extraction = serializers.DictField()
    deliberation = serializers.DictField(required=False)
    alerts = ProactiveAlertSerializer(many=True, required=False)
    processing_time_ms = serializers.FloatField()


class UserBehaviorScoreSerializer(serializers.ModelSerializer):
    """Serializer for behavior scores."""

    class Meta:
        model = UserBehaviorScore
        fields = [
            'entity_type', 'entity_id', 'score',
            'personal_score', 'department_score',
            'organization_score', 'sector_score', 'last_updated'
        ]


# ============================================
# COMPLIANCE VALIDATION SERIALIZERS
# ============================================

class ComplianceValidationRequestSerializer(serializers.Serializer):
    """Serializer para requisição de validação de compliance."""

    document_id = serializers.UUIDField()
    document_content = serializers.CharField(required=False, allow_blank=True)
    validators = serializers.ListField(
        child=serializers.ChoiceField(choices=['earq', 'legal_hold', 'lgpd']),
        default=['earq', 'legal_hold', 'lgpd']
    )
    context = serializers.DictField(required=False)


class ValidationAlertSerializer(serializers.Serializer):
    """Serializer para alertas de validação de compliance."""

    severity = serializers.CharField()
    alert_type = serializers.CharField()
    field_name = serializers.CharField(required=False, allow_blank=True)
    message = serializers.CharField()
    suggestion = serializers.CharField(required=False, allow_blank=True)
    metadata = serializers.DictField()


class ComplianceValidationResponseSerializer(serializers.Serializer):
    """Serializer para resposta de validação de compliance."""

    document_id = serializers.UUIDField()
    validators_executed = serializers.ListField(child=serializers.CharField())
    alerts = ValidationAlertSerializer(many=True)
    summary = serializers.DictField()
    processing_time_ms = serializers.FloatField()

