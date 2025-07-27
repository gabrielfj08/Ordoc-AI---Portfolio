from django.db import models
from django.core.validators import RegexValidator, EmailValidator
from django_fsm import FSMField, transition
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, Count
import uuid
from datetime import datetime, date


class JustificationNote(models.Model):
    """
    Modelo para notas de justificativa em procedimentos e tarefas.
    Equivalente ao PrinterFlow::JustificationNote do Rails.
    """
    
    ACTION_CHOICES = [
        ('finish', 'Finalizar'),
        ('refuse', 'Recusar'),
        ('archive', 'Arquivar'),
        ('comment', 'Comentário'),
        ('approve', 'Aprovar'),
        ('reject', 'Rejeitar'),
        ('delegate', 'Delegar'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note = models.TextField(verbose_name='Nota')
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name='Ação'
    )
    
    # Generic foreign key para procedimentos ou tarefas
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    justifiable = GenericForeignKey('content_type', 'object_id')
    
    created_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='justification_notes',
        verbose_name='Criado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_justification_notes'
        verbose_name = 'Nota de Justificativa'
        verbose_name_plural = 'Notas de Justificativas'
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['created_by']),
            models.Index(fields=['action']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.created_by.name}"


class TaskComment(models.Model):
    """
    Modelo para comentários em tarefas.
    Equivalente ao PrinterFlow::TaskComment do Rails.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comment = models.TextField(verbose_name='Comentário')
    
    task = models.ForeignKey(
        'ordoc_flow.Task',
        on_delete=models.CASCADE,
        related_name='task_comments',
        verbose_name='Tarefa'
    )
    
    created_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='task_comments',
        verbose_name='Criado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_task_comments'
        verbose_name = 'Comentário da Tarefa'
        verbose_name_plural = 'Comentários das Tarefas'
        indexes = [
            models.Index(fields=['task', 'created_at']),
            models.Index(fields=['created_by']),
        ]
    
    def __str__(self):
        return f"Comentário em {self.task.name} por {self.created_by.name}"


class TaskField(models.Model):
    """
    Modelo para campos customizados preenchidos em tarefas.
    Equivalente ao PrinterFlow::TaskField do Rails.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field_name = models.CharField(max_length=255, verbose_name='Nome do Campo')
    field_type = models.CharField(max_length=50, verbose_name='Tipo do Campo')
    value = models.TextField(null=True, blank=True, verbose_name='Valor')
    array_values = models.JSONField(default=list, blank=True, verbose_name='Valores Array')
    
    # Generic foreign key para tarefas ou templates
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    fieldable = GenericForeignKey('content_type', 'object_id')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_task_fields'
        verbose_name = 'Campo da Tarefa'
        verbose_name_plural = 'Campos das Tarefas'
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['field_name']),
        ]
    
    def __str__(self):
        return f"{self.field_name}: {self.value or str(self.array_values)}"


class ApprovalWorkflow(models.Model):
    """
    Modelo para workflow de aprovação de procedimentos e tarefas.
    Define as etapas de aprovação necessárias.
    """
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
    ]
    
    APPROVAL_TYPE_CHOICES = [
        ('sequential', 'Sequencial'),
        ('parallel', 'Paralelo'),
        ('any_one', 'Qualquer Um'),
        ('majority', 'Maioria'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome do Workflow')
    description = models.TextField(blank=True, verbose_name='Descrição')
    
    approval_type = models.CharField(
        max_length=20,
        choices=APPROVAL_TYPE_CHOICES,
        default='sequential',
        verbose_name='Tipo de Aprovação'
    )
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Status'
    )
    
    # Relacionamentos
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='approval_workflows',
        verbose_name='Organização'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_approval_workflows'
        verbose_name = 'Workflow de Aprovação'
        verbose_name_plural = 'Workflows de Aprovação'
        unique_together = ['name', 'organization']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['approval_type']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.organization.name})"


class ApprovalStep(models.Model):
    """
    Modelo para etapas de aprovação dentro de um workflow.
    """
    
    STEP_TYPE_CHOICES = [
        ('user', 'Usuário Específico'),
        ('group', 'Grupo'),
        ('role', 'Função/Role'),
        ('department', 'Departamento'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome da Etapa')
    order = models.PositiveIntegerField(verbose_name='Ordem')
    
    step_type = models.CharField(
        max_length=20,
        choices=STEP_TYPE_CHOICES,
        verbose_name='Tipo da Etapa'
    )
    
    is_required = models.BooleanField(default=True, verbose_name='Obrigatório')
    timeout_hours = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        verbose_name='Timeout (horas)'
    )
    
    # Relacionamentos
    workflow = models.ForeignKey(
        ApprovalWorkflow,
        on_delete=models.CASCADE,
        related_name='steps',
        verbose_name='Workflow'
    )
    
    # Aprovadores específicos
    approver_user = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='approval_steps',
        verbose_name='Usuário Aprovador'
    )
    
    approver_group = models.ForeignKey(
        'ordoc_flow.GroupRequester',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='approval_steps',
        verbose_name='Grupo Aprovador'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_approval_steps'
        verbose_name = 'Etapa de Aprovação'
        verbose_name_plural = 'Etapas de Aprovação'
        unique_together = ['workflow', 'order']
        ordering = ['order']
        indexes = [
            models.Index(fields=['workflow', 'order']),
            models.Index(fields=['step_type']),
            models.Index(fields=['approver_user']),
            models.Index(fields=['approver_group']),
        ]
    
    def __str__(self):
        return f"{self.workflow.name} - Etapa {self.order}: {self.name}"


class ApprovalInstance(models.Model):
    """
    Modelo para instâncias de aprovação de procedimentos/tarefas específicas.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('timeout', 'Timeout'),
        ('cancelled', 'Cancelado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    status = FSMField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    
    # Relacionamentos
    workflow = models.ForeignKey(
        ApprovalWorkflow,
        on_delete=models.CASCADE,
        related_name='instances',
        verbose_name='Workflow'
    )
    
    # Generic foreign key para procedimentos ou tarefas
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    approvable = GenericForeignKey('content_type', 'object_id')
    
    requested_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='requested_approvals',
        verbose_name='Solicitado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_flow_approval_instances'
        verbose_name = 'Instância de Aprovação'
        verbose_name_plural = 'Instâncias de Aprovação'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['workflow']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['requested_by']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Aprovação {self.workflow.name} - {self.get_status_display()}"
    
    # FSM Transitions
    @transition(field=status, source='pending', target='in_progress')
    def start_approval(self):
        pass
    
    @transition(field=status, source='in_progress', target='approved')
    def approve(self):
        self.completed_at = timezone.now()
    
    @transition(field=status, source='in_progress', target='rejected')
    def reject(self):
        self.completed_at = timezone.now()
    
    @transition(field=status, source=['pending', 'in_progress'], target='cancelled')
    def cancel(self):
        self.completed_at = timezone.now()


class ApprovalStepInstance(models.Model):
    """
    Modelo para instâncias específicas de etapas de aprovação.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('timeout', 'Timeout'),
        ('skipped', 'Pulado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    status = FSMField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    
    comments = models.TextField(blank=True, verbose_name='Comentários')
    
    # Relacionamentos
    approval_instance = models.ForeignKey(
        ApprovalInstance,
        on_delete=models.CASCADE,
        related_name='step_instances',
        verbose_name='Instância de Aprovação'
    )
    
    approval_step = models.ForeignKey(
        ApprovalStep,
        on_delete=models.CASCADE,
        related_name='step_instances',
        verbose_name='Etapa de Aprovação'
    )
    
    assigned_to = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='assigned_approval_steps',
        verbose_name='Atribuído para'
    )
    
    approved_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='approved_steps',
        verbose_name='Aprovado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True, verbose_name='Data Limite')
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_flow_approval_step_instances'
        verbose_name = 'Instância de Etapa de Aprovação'
        verbose_name_plural = 'Instâncias de Etapas de Aprovação'
        unique_together = ['approval_instance', 'approval_step']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['approval_instance']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['approved_by']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.approval_step.name} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        # Define data limite baseada no timeout da etapa
        if not self.due_date and self.approval_step.timeout_hours:
            self.due_date = timezone.now() + timezone.timedelta(
                hours=self.approval_step.timeout_hours
            )
        super().save(*args, **kwargs)
    
    # FSM Transitions
    @transition(field=status, source='pending', target='approved')
    def approve(self, user):
        self.approved_by = user
        self.completed_at = timezone.now()
    
    @transition(field=status, source='pending', target='rejected')
    def reject(self, user):
        self.approved_by = user
        self.completed_at = timezone.now()
    
    @transition(field=status, source='pending', target='skipped')
    def skip(self):
        self.completed_at = timezone.now()


class NotificationTemplate(models.Model):
    """
    Modelo para templates de notificação.
    """
    
    NOTIFICATION_TYPE_CHOICES = [
        ('email', 'E-mail'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('system', 'Notificação do Sistema'),
    ]
    
    TRIGGER_EVENT_CHOICES = [
        ('task_created', 'Tarefa Criada'),
        ('task_assigned', 'Tarefa Atribuída'),
        ('task_completed', 'Tarefa Concluída'),
        ('task_refused', 'Tarefa Recusada'),
        ('procedure_started', 'Procedimento Iniciado'),
        ('procedure_finished', 'Procedimento Finalizado'),
        ('approval_requested', 'Aprovação Solicitada'),
        ('approval_approved', 'Aprovação Concedida'),
        ('approval_rejected', 'Aprovação Rejeitada'),
        ('deadline_approaching', 'Prazo se Aproximando'),
        ('deadline_exceeded', 'Prazo Excedido'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome do Template')
    
    notification_type = models.CharField(
        max_length=10,
        choices=NOTIFICATION_TYPE_CHOICES,
        verbose_name='Tipo de Notificação'
    )
    
    trigger_event = models.CharField(
        max_length=30,
        choices=TRIGGER_EVENT_CHOICES,
        verbose_name='Evento Gatilho'
    )
    
    # Templates de conteúdo
    subject_template = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name='Template do Assunto'
    )
    body_template = models.TextField(verbose_name='Template do Corpo')
    
    # Configurações
    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    send_to_requester = models.BooleanField(default=True, verbose_name='Enviar para Solicitante')
    send_to_assignee = models.BooleanField(default=True, verbose_name='Enviar para Responsável')
    send_to_group = models.BooleanField(default=False, verbose_name='Enviar para Grupo')
    
    # Relacionamentos
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='notification_templates',
        verbose_name='Organização'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_notification_templates'
        verbose_name = 'Template de Notificação'
        verbose_name_plural = 'Templates de Notificação'
        unique_together = ['name', 'organization']
        indexes = [
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['trigger_event']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_notification_type_display()})"


class NotificationLog(models.Model):
    """
    Modelo para log de notificações enviadas.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('sent', 'Enviado'),
        ('failed', 'Falhou'),
        ('delivered', 'Entregue'),
        ('read', 'Lido'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    notification_type = models.CharField(max_length=10, verbose_name='Tipo')
    recipient_email = models.EmailField(null=True, blank=True, verbose_name='E-mail Destinatário')
    recipient_phone = models.CharField(max_length=20, null=True, blank=True, verbose_name='Telefone Destinatário')
    
    subject = models.CharField(max_length=255, blank=True, verbose_name='Assunto')
    body = models.TextField(verbose_name='Corpo da Mensagem')
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    
    error_message = models.TextField(blank=True, verbose_name='Mensagem de Erro')
    
    # Relacionamentos
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='logs',
        verbose_name='Template'
    )
    
    recipient = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='received_notifications',
        verbose_name='Destinatário'
    )
    
    external_recipient = models.ForeignKey(
        'ordoc_flow.ExternalRequester',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='received_notifications',
        verbose_name='Destinatário Externo'
    )
    
    # Generic foreign key para o objeto relacionado
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    related_object = GenericForeignKey('content_type', 'object_id')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ordoc_flow_notification_logs'
        verbose_name = 'Log de Notificação'
        verbose_name_plural = 'Logs de Notificações'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['recipient']),
            models.Index(fields=['external_recipient']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        recipient_name = self.recipient.name if self.recipient else (
            self.external_recipient.name if self.external_recipient else 'Desconhecido'
        )
        return f"Notificação para {recipient_name} - {self.get_status_display()}"
