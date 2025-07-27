from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from .models import (
    ExternalRequester, WorkflowRequest, GroupRequester, GroupRequesterMember,
    ProcedureTemplate, Field, FieldValueOption, Procedure, TaskTemplate, Task
)
from .approval_models import (
    JustificationNote, TaskComment, TaskField, ApprovalWorkflow, ApprovalStep,
    ApprovalInstance, ApprovalStepInstance, NotificationTemplate, NotificationLog
)


class ExternalRequesterSerializer(serializers.ModelSerializer):
    """Serializer para solicitantes externos"""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = ExternalRequester
        fields = [
            'id', 'name', 'email', 'phone', 'cpf', 'notification_type',
            'status', 'organization', 'organization_name', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_cpf(self, value):
        """Validação básica de CPF"""
        import re
        if not re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', value):
            raise serializers.ValidationError('CPF deve estar no formato XXX.XXX.XXX-XX')
        return value


class GroupRequesterMemberSerializer(serializers.ModelSerializer):
    """Serializer para membros de grupos"""
    
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = GroupRequesterMember
        fields = [
            'id', 'user', 'user_name', 'user_email', 'role', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class GroupRequesterSerializer(serializers.ModelSerializer):
    """Serializer para grupos de solicitantes"""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    members_detail = GroupRequesterMemberSerializer(
        source='grouprequestermember_set', 
        many=True, 
        read_only=True
    )
    active_members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = GroupRequester
        fields = [
            'id', 'name', 'description', 'status', 'organization', 
            'organization_name', 'members_detail', 'active_members_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_active_members_count(self, obj):
        return obj.get_active_members().count()


class FieldValueOptionSerializer(serializers.ModelSerializer):
    """Serializer para opções de valores de campos"""
    
    class Meta:
        model = FieldValueOption
        fields = [
            'id', 'label', 'value', 'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FieldSerializer(serializers.ModelSerializer):
    """Serializer para campos customizados"""
    
    value_options = FieldValueOptionSerializer(many=True, read_only=True)
    is_selectable = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Field
        fields = [
            'id', 'label', 'field_type', 'required', 'order',
            'placeholder', 'help_text', 'default_value',
            'min_length', 'max_length', 'min_value', 'max_value',
            'procedure_template', 'value_options', 'is_selectable',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProcedureTemplateSerializer(serializers.ModelSerializer):
    """Serializer para templates de procedimentos"""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    group_requester_name = serializers.CharField(source='group_requester.name', read_only=True)
    parent_name = serializers.CharField(source='parent_procedure_template.name', read_only=True)
    fields = FieldSerializer(many=True, read_only=True)
    children_count = serializers.IntegerField(read_only=True)
    procedures_count = serializers.IntegerField(read_only=True)
    is_root = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = ProcedureTemplate
        fields = [
            'id', 'name', 'description', 'source', 'status', 'prn', 'schema',
            'organization', 'organization_name', 'group_requester', 'group_requester_name',
            'parent_procedure_template', 'parent_name', 'fields',
            'children_count', 'procedures_count', 'is_root',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'prn', 'created_at', 'updated_at']


class TaskTemplateSerializer(serializers.ModelSerializer):
    """Serializer para templates de tarefas"""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    procedure_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = TaskTemplate
        fields = [
            'id', 'name', 'description', 'status', 'prn',
            'organization', 'organization_name', 'procedure_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'prn', 'created_at', 'updated_at']


class TaskCommentSerializer(serializers.ModelSerializer):
    """Serializer para comentários de tarefas"""
    
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = TaskComment
        fields = [
            'id', 'comment', 'task', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskFieldSerializer(serializers.ModelSerializer):
    """Serializer para campos de tarefas"""
    
    class Meta:
        model = TaskField
        fields = [
            'id', 'field_name', 'field_type', 'value', 'array_values',
            'content_type', 'object_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskSerializer(serializers.ModelSerializer):
    """Serializer para tarefas"""
    
    procedure_number = serializers.CharField(source='procedure.process_number', read_only=True)
    procedure_template_name = serializers.CharField(source='procedure.procedure_template_name', read_only=True)
    assignee_name = serializers.CharField(source='assignee.name', read_only=True)
    group_assignee_name = serializers.CharField(source='group_assignee.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    task_comments = TaskCommentSerializer(many=True, read_only=True)
    task_fields = TaskFieldSerializer(many=True, read_only=True)
    is_closed = serializers.BooleanField(read_only=True)
    procedure_info = serializers.CharField(read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'name', 'description', 'priority', 'status', 'deadline', 'prn',
            'procedure', 'procedure_number', 'procedure_template_name',
            'task_template', 'assignee', 'assignee_name',
            'group_assignee', 'group_assignee_name',
            'created_by', 'created_by_name',
            'task_comments', 'task_fields', 'is_closed', 'procedure_info',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'prn', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validações customizadas"""
        if data.get('deadline') and data['deadline'] < timezone.now().date():
            raise serializers.ValidationError({
                'deadline': 'Prazo não pode ser anterior à data atual.'
            })
        return data


class ProcedureSerializer(serializers.ModelSerializer):
    """Serializer para procedimentos"""
    
    procedure_template_name = serializers.CharField(read_only=True)
    requester_name = serializers.CharField(source='requester.name', read_only=True)
    responsible_group_name = serializers.CharField(source='responsible_group.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    is_closed = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Procedure
        fields = [
            'id', 'process_number', 'procedure_template_name', 'source', 'priority',
            'status', 'payload', 'schema', 'private', 'deadline', 'prn',
            'procedure_template', 'requester', 'requester_name',
            'responsible_group', 'responsible_group_name',
            'created_by', 'created_by_name',
            'organization', 'organization_name',
            'tasks', 'is_closed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'process_number', 'prn', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validações customizadas"""
        if data.get('deadline') and data['deadline'] < timezone.now().date():
            raise serializers.ValidationError({
                'deadline': 'Prazo não pode ser anterior à data atual.'
            })
        return data


class WorkflowRequestSerializer(serializers.ModelSerializer):
    """Serializer para solicitações de workflow"""
    
    requester_name = serializers.CharField(source='requester.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True)
    
    class Meta:
        model = WorkflowRequest
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'metadata',
            'requester', 'requester_name', 'organization', 'organization_name',
            'assigned_to', 'assigned_to_name', 'due_date',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']


class JustificationNoteSerializer(serializers.ModelSerializer):
    """Serializer para notas de justificativa"""
    
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = JustificationNote
        fields = [
            'id', 'note', 'action', 'content_type', 'object_id',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# Serializers para Sistema de Aprovação

class ApprovalStepSerializer(serializers.ModelSerializer):
    """Serializer para etapas de aprovação"""
    
    approver_user_name = serializers.CharField(source='approver_user.name', read_only=True)
    approver_group_name = serializers.CharField(source='approver_group.name', read_only=True)
    
    class Meta:
        model = ApprovalStep
        fields = [
            'id', 'name', 'order', 'step_type', 'is_required', 'timeout_hours',
            'workflow', 'approver_user', 'approver_user_name',
            'approver_group', 'approver_group_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApprovalWorkflowSerializer(serializers.ModelSerializer):
    """Serializer para workflows de aprovação"""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    steps = ApprovalStepSerializer(many=True, read_only=True)
    
    class Meta:
        model = ApprovalWorkflow
        fields = [
            'id', 'name', 'description', 'approval_type', 'status',
            'organization', 'organization_name', 'steps',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApprovalStepInstanceSerializer(serializers.ModelSerializer):
    """Serializer para instâncias de etapas de aprovação"""
    
    approval_step_name = serializers.CharField(source='approval_step.name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.name', read_only=True)
    
    class Meta:
        model = ApprovalStepInstance
        fields = [
            'id', 'status', 'comments', 'approval_instance', 'approval_step',
            'approval_step_name', 'assigned_to', 'assigned_to_name',
            'approved_by', 'approved_by_name', 'due_date', 'completed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'due_date', 'completed_at', 'created_at', 'updated_at']


class ApprovalInstanceSerializer(serializers.ModelSerializer):
    """Serializer para instâncias de aprovação"""
    
    workflow_name = serializers.CharField(source='workflow.name', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.name', read_only=True)
    step_instances = ApprovalStepInstanceSerializer(many=True, read_only=True)
    
    class Meta:
        model = ApprovalInstance
        fields = [
            'id', 'status', 'workflow', 'workflow_name', 'content_type', 'object_id',
            'requested_by', 'requested_by_name', 'step_instances',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'completed_at', 'created_at', 'updated_at']


# Serializers para Sistema de Notificações

class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer para templates de notificação"""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'name', 'notification_type', 'trigger_event',
            'subject_template', 'body_template', 'is_active',
            'send_to_requester', 'send_to_assignee', 'send_to_group',
            'organization', 'organization_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationLogSerializer(serializers.ModelSerializer):
    """Serializer para logs de notificação"""
    
    template_name = serializers.CharField(source='template.name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.name', read_only=True)
    external_recipient_name = serializers.CharField(source='external_recipient.name', read_only=True)
    
    class Meta:
        model = NotificationLog
        fields = [
            'id', 'notification_type', 'recipient_email', 'recipient_phone',
            'subject', 'body', 'status', 'error_message',
            'template', 'template_name', 'recipient', 'recipient_name',
            'external_recipient', 'external_recipient_name',
            'content_type', 'object_id',
            'created_at', 'sent_at', 'delivered_at', 'read_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'sent_at', 'delivered_at', 'read_at'
        ]


# Serializers para Estatísticas e Relatórios

class ProcedureStatsSerializer(serializers.Serializer):
    """Serializer para estatísticas de procedimentos"""
    
    total = serializers.IntegerField()
    draft = serializers.IntegerField()
    running = serializers.IntegerField()
    started = serializers.IntegerField()
    finished = serializers.IntegerField()
    archived = serializers.IntegerField()


class TaskStatsSerializer(serializers.Serializer):
    """Serializer para estatísticas de tarefas"""
    
    total = serializers.IntegerField()
    draft = serializers.IntegerField()
    running = serializers.IntegerField()
    started = serializers.IntegerField()
    finished = serializers.IntegerField()
    refused = serializers.IntegerField()
    returned = serializers.IntegerField(required=False)


class WorkflowDashboardSerializer(serializers.Serializer):
    """Serializer para dashboard do workflow"""
    
    procedure_stats = ProcedureStatsSerializer()
    task_stats = TaskStatsSerializer()
    pending_approvals = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    recent_activities = serializers.ListField(child=serializers.DictField())


# Serializers para Batch Operations

class BatchOperationSerializer(serializers.Serializer):
    """Serializer para operações em lote"""
    
    action = serializers.ChoiceField(choices=[
        ('archive', 'Arquivar'),
        ('finish', 'Finalizar'),
        ('assign', 'Atribuir'),
        ('change_priority', 'Alterar Prioridade'),
        ('add_comment', 'Adicionar Comentário'),
    ])
    
    object_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1,
        max_length=100
    )
    
    # Parâmetros opcionais baseados na ação
    assignee_id = serializers.UUIDField(required=False)
    group_assignee_id = serializers.UUIDField(required=False)
    priority = serializers.ChoiceField(
        choices=[('normal', 'Normal'), ('high', 'Alta')],
        required=False
    )
    comment = serializers.CharField(max_length=1000, required=False)
    
    def validate(self, data):
        action = data.get('action')
        
        if action == 'assign':
            if not data.get('assignee_id') and not data.get('group_assignee_id'):
                raise serializers.ValidationError(
                    'Para atribuir, é necessário informar assignee_id ou group_assignee_id'
                )
        
        elif action == 'change_priority':
            if not data.get('priority'):
                raise serializers.ValidationError(
                    'Para alterar prioridade, é necessário informar a nova prioridade'
                )
        
        elif action == 'add_comment':
            if not data.get('comment'):
                raise serializers.ValidationError(
                    'Para adicionar comentário, é necessário informar o comentário'
                )
        
        return data


class BatchOperationResultSerializer(serializers.Serializer):
    """Serializer para resultado de operações em lote"""
    
    success_count = serializers.IntegerField()
    error_count = serializers.IntegerField()
    errors = serializers.ListField(child=serializers.DictField())
    processed_objects = serializers.ListField(child=serializers.UUIDField())
