from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, EmailValidator
from django_fsm import FSMField, transition
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import uuid
import json
from datetime import datetime, date


class ExternalRequester(models.Model):
    """
    Modelo para usuários externos do OrdocFlow - equivalente ao PrinterFlow::ExternalRequester do Rails
    Usuários externos que podem fazer solicitações via workflow sem ter acesso completo ao sistema
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('active', 'Ativo'),
        ('blocked', 'Bloqueado'),
        ('inactive', 'Inativo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic info
    name = models.CharField(max_length=255, verbose_name="Nome")
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        verbose_name="E-mail"
    )
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone")
    
    # Status and authentication
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    failed_attempts = models.PositiveIntegerField(default=0)
    locked_at = models.DateTimeField(null=True, blank=True)
    
    # External requester specific fields
    company = models.CharField(max_length=255, blank=True, null=True, verbose_name="Empresa")
    document_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="CPF/CNPJ")
    
    # Relations
    organization = models.ForeignKey(
        'ordoc_air.Organization', 
        on_delete=models.CASCADE, 
        related_name='external_requesters',
        verbose_name="Organização"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Solicitante Externo"
        verbose_name_plural = "Solicitantes Externos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.email}) - {self.organization.corporate_name}"
    
    @property
    def is_active_user(self):
        """Verifica se o usuário externo está ativo"""
        return self.status == 'active' and self.deleted_at is None
    
    @property
    def is_pending(self):
        """Verifica se o usuário externo está pendente"""
        return self.status == 'pending'
    
    @property
    def is_blocked(self):
        """Verifica se o usuário externo está bloqueado"""
        return self.status == 'blocked'
    
    def increment_failed_attempts(self):
        """Incrementa tentativas de login falhadas"""
        self.failed_attempts += 1
        if self.failed_attempts >= 5:  # MAX_SIGNIN_FAILED_ATTEMPTS
            self.status = 'blocked'
            self.locked_at = models.timezone.now()
        self.save()
    
    def reset_failed_attempts(self):
        """Reseta tentativas de login falhadas"""
        self.failed_attempts = 0
        if self.status == 'blocked':
            self.status = 'active'
            self.locked_at = None
        self.save()
    
    def get_token(self):
        """Gera token JWT para o usuário externo - equivalente ao external_requester.token do Rails"""
        from ordoc_ai.jwt_service import JWTService
        return JWTService.create_external_token(self)


class WorkflowRequest(models.Model):
    """
    Modelo para solicitações de workflow - equivalente ao PrinterFlow::WorkflowRequest
    """

    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('submitted', 'Enviado'),
        ('in_progress', 'Em Andamento'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('completed', 'Concluído'),
        ('cancelled', 'Cancelado'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('medium', 'Média'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Basic info
    title = models.CharField(max_length=255, verbose_name="Título")
    description = models.TextField(verbose_name="Descrição")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')

    # Request data
    request_data = models.JSONField(default=dict, verbose_name="Dados da Solicitação")
    metadata = models.JSONField(default=dict, blank=True, verbose_name="Metadados")

    # Due date
    due_date = models.DateField(null=True, blank=True, verbose_name="Data de Vencimento")

    # Relations
    requester = models.ForeignKey(
        ExternalRequester,
        on_delete=models.CASCADE,
        related_name='workflow_requests',
        verbose_name="Solicitante"
    )
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='workflow_requests',
        verbose_name="Organização"
    )
    assigned_to = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_workflow_requests',
        verbose_name="Atribuído para"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Solicitação de Workflow"
        verbose_name_plural = "Solicitações de Workflow"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['requester', 'status']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['due_date']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.requester.name} ({self.get_status_display()})"

    @property
    def is_draft(self):
        return self.status == 'draft'

    @property
    def is_submitted(self):
        return self.status == 'submitted'

    @property
    def is_completed(self):
        return self.status == 'completed'

    @property
    def is_cancelled(self):
        return self.status == 'cancelled'

    @property
    def is_overdue(self):
        """Verifica se a solicitação está atrasada"""
        if self.due_date and self.status not in ['completed', 'cancelled']:
            return timezone.now().date() > self.due_date
        return False


# ============================================================================
# WORKFLOW AVANÇADO - MODELOS PRINCIPAIS
# ============================================================================

class GroupRequester(models.Model):
    """
    Modelo para grupos de solicitantes/responsáveis.
    Equivalente ao PrinterFlow::GroupRequester do Rails.
    """
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome do Grupo')
    description = models.TextField(blank=True, verbose_name='Descrição')
    
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
        related_name='group_requesters',
        verbose_name='Organização'
    )
    
    # Membros do grupo (usuários internos)
    members = models.ManyToManyField(
        'ordoc_cloud.OrdocUser',
        through='GroupRequesterMember',
        related_name='member_groups',
        verbose_name='Membros'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_group_requesters'
        verbose_name = 'Grupo de Solicitantes'
        verbose_name_plural = 'Grupos de Solicitantes'
        unique_together = ['name', 'organization']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.organization.corporate_name})"
    
    @property
    def is_active(self):
        return self.status == 'active'
    
    def get_active_members(self):
        return self.members.filter(
            grouprequestermember__is_active=True,
            status='active'
        )


class GroupRequesterMember(models.Model):
    """
    Modelo de relacionamento entre grupos e membros.
    """
    
    ROLE_CHOICES = [
        ('member', 'Membro'),
        ('coordinator', 'Coordenador'),
        ('manager', 'Gerente'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    group = models.ForeignKey(
        GroupRequester,
        on_delete=models.CASCADE,
        verbose_name='Grupo'
    )
    
    user = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        verbose_name='Usuário'
    )
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='member',
        verbose_name='Função'
    )
    
    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_group_requester_members'
        verbose_name = 'Membro do Grupo'
        verbose_name_plural = 'Membros do Grupo'
        unique_together = ['group', 'user']
        indexes = [
            models.Index(fields=['group', 'is_active']),
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.name} - {self.group.name} ({self.get_role_display()})"


class ProcedureTemplate(models.Model):
    """
    Modelo para templates de procedimentos.
    Equivalente ao PrinterFlow::ProcedureTemplate do Rails.
    """
    
    SOURCE_CHOICES = [
        ('internal', 'Interno'),
        ('external', 'Externo'),
        ('internal_external', 'Interno e Externo'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome')
    description = models.TextField(blank=True, verbose_name='Descrição')
    
    # Configurações do template
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default='internal',
        verbose_name='Origem'
    )
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Status'
    )
    
    # PRN (Printer Resource Name) - identificador único
    prn = models.CharField(max_length=500, verbose_name='PRN')
    
    # Schema para validação de payload
    schema = models.JSONField(default=dict, blank=True, verbose_name='Schema')
    
    # Relacionamentos
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='procedure_templates',
        verbose_name='Organização'
    )
    
    group_requester = models.ForeignKey(
        GroupRequester,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='procedure_templates',
        verbose_name='Grupo Responsável'
    )
    
    # Hierarquia de templates
    parent_procedure_template = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children_procedure_templates',
        verbose_name='Template Pai'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_procedure_templates'
        verbose_name = 'Template de Procedimento'
        verbose_name_plural = 'Templates de Procedimentos'
        unique_together = ['prn', 'parent_procedure_template']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['source', 'status']),
            models.Index(fields=['parent_procedure_template']),
            models.Index(fields=['prn']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.organization.corporate_name})"
    
    def save(self, *args, **kwargs):
        if not self.prn:
            self.prn = self.generate_prn()
        super().save(*args, **kwargs)
    
    def generate_prn(self):
        """Gera PRN baseado na hierarquia de templates"""
        if self.parent_procedure_template:
            return f"procedure_template/{self.parent_procedure_template.name}/{self.name}"
        else:
            return f"procedure_template/{self.name}"
    
    @property
    def children_count(self):
        return self.children_procedure_templates.count()
    
    @property
    def procedures_count(self):
        return self.procedures.count()
    
    @property
    def is_root(self):
        return self.parent_procedure_template is None
    
    def clean(self):
        # Validação: se tem template pai e é externo, deve ter grupo responsável
        if (self.parent_procedure_template and 
            self.source in ['external', 'internal_external'] and 
            not self.group_requester):
            raise ValidationError({
                'group_requester': 'Grupo responsável é obrigatório para templates externos com pai.'
            })
    
    # FSM Transitions
    @transition(field=status, source='inactive', target='active')
    def activate(self):
        pass
    
    @transition(field=status, source='active', target='inactive')
    def deactivate(self):
        # Não pode desativar se tem filhos ativos
        if self.children_procedure_templates.filter(status='active').exists():
            raise ValidationError('Não é possível desativar template com filhos ativos.')


class Field(models.Model):
    """
    Modelo para campos customizados de procedimentos.
    Equivalente ao PrinterFlow::Field do Rails.
    """
    
    FIELD_TYPE_CHOICES = [
        ('short_text', 'Texto Curto'),
        ('long_text', 'Texto Longo'),
        ('numeric', 'Numérico'),
        ('select_field', 'Campo de Seleção'),
        ('date', 'Data'),
        ('attachment', 'Anexo'),
        ('checkbox', 'Checkbox'),
        ('phone', 'Telefone'),
        ('email', 'E-mail'),
        ('radio', 'Radio Button'),
        ('cpf', 'CPF'),
        ('cnpj', 'CNPJ'),
        ('time', 'Hora'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.CharField(max_length=255, verbose_name='Rótulo')
    field_type = models.CharField(
        max_length=20,
        choices=FIELD_TYPE_CHOICES,
        verbose_name='Tipo do Campo'
    )
    
    required = models.BooleanField(default=False, verbose_name='Obrigatório')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordem')
    
    # Configurações específicas do campo
    placeholder = models.CharField(max_length=255, blank=True, verbose_name='Placeholder')
    help_text = models.TextField(blank=True, verbose_name='Texto de Ajuda')
    default_value = models.TextField(blank=True, verbose_name='Valor Padrão')
    
    # Validações
    min_length = models.PositiveIntegerField(null=True, blank=True, verbose_name='Tamanho Mínimo')
    max_length = models.PositiveIntegerField(null=True, blank=True, verbose_name='Tamanho Máximo')
    min_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Valor Mínimo')
    max_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Valor Máximo')
    
    # Relacionamentos
    procedure_template = models.ForeignKey(
        ProcedureTemplate,
        on_delete=models.CASCADE,
        related_name='fields',
        verbose_name='Template de Procedimento'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_fields'
        verbose_name = 'Campo'
        verbose_name_plural = 'Campos'
        ordering = ['order', 'label']
        indexes = [
            models.Index(fields=['procedure_template', 'order']),
            models.Index(fields=['field_type']),
        ]
    
    def __str__(self):
        return f"{self.label} ({self.get_field_type_display()})"
    
    @property
    def is_selectable(self):
        return self.field_type in ['radio', 'checkbox', 'select_field']


class FieldValueOption(models.Model):
    """
    Modelo para opções de valores de campos selecionáveis.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.CharField(max_length=255, verbose_name='Rótulo')
    value = models.CharField(max_length=255, verbose_name='Valor')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordem')
    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    
    field = models.ForeignKey(
        Field,
        on_delete=models.CASCADE,
        related_name='value_options',
        verbose_name='Campo'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_field_value_options'
        verbose_name = 'Opção de Valor'
        verbose_name_plural = 'Opções de Valores'
        ordering = ['order', 'label']
        unique_together = ['field', 'value']
        indexes = [
            models.Index(fields=['field', 'is_active']),
            models.Index(fields=['order']),
        ]
    
    def __str__(self):
        return f"{self.label} ({self.field.label})"


class Procedure(models.Model):
    """
    Modelo para procedimentos (instâncias de templates).
    Equivalente ao PrinterFlow::Procedure do Rails.
    """
    
    SOURCE_CHOICES = [
        ('internal', 'Interno'),
        ('external', 'Externo'),
    ]
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal'),
        ('high', 'Alta'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('running', 'Em Execução'),
        ('started', 'Iniciado'),
        ('finished', 'Finalizado'),
        ('archived', 'Arquivado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Identificação do processo
    process_number = models.CharField(max_length=50, verbose_name='Número do Processo')
    procedure_template_name = models.CharField(max_length=255, verbose_name='Nome do Template')
    
    # Configurações
    source = models.CharField(
        max_length=10,
        choices=SOURCE_CHOICES,
        default='internal',
        verbose_name='Origem'
    )
    
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='normal',
        verbose_name='Prioridade'
    )
    
    status = FSMField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name='Status'
    )
    
    # Dados do procedimento
    payload = models.JSONField(default=list, blank=True, verbose_name='Dados do Procedimento')
    schema = models.JSONField(default=dict, blank=True, verbose_name='Schema')
    private = models.BooleanField(default=False, verbose_name='Privado')
    
    # Datas importantes
    deadline = models.DateField(null=True, blank=True, verbose_name='Prazo')
    
    # PRN (Printer Resource Name)
    prn = models.CharField(max_length=500, verbose_name='PRN')
    
    # Relacionamentos
    procedure_template = models.ForeignKey(
        ProcedureTemplate,
        on_delete=models.CASCADE,
        related_name='procedures',
        verbose_name='Template de Procedimento'
    )
    
    requester = models.ForeignKey(
        ExternalRequester,
        on_delete=models.CASCADE,
        related_name='procedures',
        verbose_name='Solicitante'
    )
    
    responsible_group = models.ForeignKey(
        GroupRequester,
        on_delete=models.CASCADE,
        related_name='procedures',
        verbose_name='Grupo Responsável'
    )
    
    created_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='created_procedures',
        verbose_name='Criado por'
    )
    
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='procedures',
        verbose_name='Organização'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_procedures'
        verbose_name = 'Procedimento'
        verbose_name_plural = 'Procedimentos'
        unique_together = ['process_number', 'procedure_template']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['procedure_template', 'status']),
            models.Index(fields=['requester', 'status']),
            models.Index(fields=['responsible_group', 'status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['deadline']),
            models.Index(fields=['prn']),
        ]
    
    def __str__(self):
        return f"{self.process_number} - {self.procedure_template_name}"
    
    def save(self, *args, **kwargs):
        if not self.process_number:
            self.process_number = self.generate_process_number()
        if not self.prn:
            self.prn = self.generate_prn()
        if not self.procedure_template_name and self.procedure_template:
            self.procedure_template_name = self.procedure_template.name
        super().save(*args, **kwargs)
    
    def generate_process_number(self):
        """Gera número sequencial do processo baseado no ano"""
        import re
        current_year = timezone.now().year
        
        # Busca o maior número do ano atual para este template
        max_number = 0
        procedures = Procedure.objects.filter(
            procedure_template=self.procedure_template,
            process_number__endswith=f'/{current_year}'
        )
        
        for procedure in procedures:
            match = re.match(r'^(\d+)/\d{4}$', procedure.process_number)
            if match:
                number = int(match.group(1))
                max_number = max(max_number, number)
        
        return f"{max_number + 1}/{current_year}"
    
    def generate_prn(self):
        """Gera PRN do procedimento"""
        return f"{self.procedure_template_name}/{self.process_number}"
    
    @classmethod
    def count_by_status(cls, organization=None, **filters):
        """Conta procedimentos por status"""
        from django.db.models import Count
        
        queryset = cls.objects.all()
        if organization:
            queryset = queryset.filter(organization=organization)
        
        # Aplica filtros adicionais
        if filters:
            queryset = queryset.filter(**filters)
        
        # Conta por status
        result = queryset.values('status').annotate(count=Count('id'))
        
        # Converte para dict
        status_counts = {item['status']: item['count'] for item in result}
        
        # Garante que todos os status estão presentes
        for status, _ in cls.STATUS_CHOICES:
            if status not in status_counts:
                status_counts[status] = 0
                
        # Adiciona total
        status_counts['total'] = sum(status_counts.values())
        
        return status_counts
    
    @property
    def is_closed(self):
        return self.status in ['archived', 'finished']
    
    def clean(self):
        # Validação de payload se schema estiver presente
        if self.schema and not self.payload and self.status != 'draft':
            raise ValidationError('Payload é obrigatório quando schema está presente.')
        
        # Validação de deadline
        if self.deadline and self.deadline < date.today():
             # Se for criação (pk é None), não permite data no passado
             if not self.pk:
                 raise ValidationError('Prazo não pode ser anterior à data atual.')
             # Se for edição, permite manter data antiga
    
    # FSM Transitions
    @transition(field=status, source='archived', target='draft')
    def draft(self):
        pass
    
    @transition(field=status, source='draft', target='running')
    def run(self):
        if self.schema and not self.payload:
            raise ValidationError('Payload deve estar preenchido para executar o procedimento.')
    
    @transition(field=status, source=['archived', 'running'], target='started')
    def start(self):
        pass
    
    @transition(field=status, source='started', target='finished')
    def finish(self, user):
        running_tasks = self.tasks.filter(status__in=['running', 'draft', 'started'])
        if running_tasks.exists():
            raise ValidationError('Todas as tarefas devem estar finalizadas para concluir o procedimento.')
    
    @transition(field=status, source=['draft', 'started'], target='archived')
    def archive(self):
        active_tasks = self.tasks.filter(status__in=['running', 'draft', 'started'])
        if active_tasks.exists():
            raise ValidationError('Não é possível arquivar procedimento com tarefas em andamento.')


class TaskTemplate(models.Model):
    """
    Modelo para templates de tarefas.
    Equivalente ao PrinterFlow::TaskTemplate do Rails.
    """
    
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome')
    description = models.TextField(verbose_name='Descrição')
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Status'
    )
    
    # PRN (Printer Resource Name)
    prn = models.CharField(max_length=500, verbose_name='PRN')
    
    # Relacionamentos
    organization = models.ForeignKey(
        'ordoc_air.Organization',
        on_delete=models.CASCADE,
        related_name='task_templates',
        verbose_name='Organização'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_task_templates'
        verbose_name = 'Template de Tarefa'
        verbose_name_plural = 'Templates de Tarefas'
        unique_together = ['name', 'organization']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['prn']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.organization.corporate_name})"
    
    def save(self, *args, **kwargs):
        if not self.prn:
            self.prn = f"task_template/{self.name}"
        super().save(*args, **kwargs)


class Task(models.Model):
    """
    Modelo para tarefas dentro de procedimentos.
    Equivalente ao PrinterFlow::Task do Rails.
    """
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal'),
        ('high', 'Alta'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('running', 'Em Execução'),
        ('started', 'Iniciada'),
        ('finished', 'Finalizada'),
        ('refused', 'Recusada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Nome')
    description = models.TextField(verbose_name='Descrição')
    
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='normal',
        verbose_name='Prioridade'
    )
    
    status = FSMField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name='Status'
    )
    
    # Datas
    deadline = models.DateField(null=True, blank=True, verbose_name='Prazo')
    
    # PRN (Printer Resource Name)
    prn = models.CharField(max_length=500, verbose_name='PRN')
    
    # Relacionamentos
    procedure = models.ForeignKey(
        Procedure,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='Procedimento'
    )
    
    task_template = models.ForeignKey(
        TaskTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
        verbose_name='Template de Tarefa'
    )
    
    # Atribuições
    assignee = models.ForeignKey(
        ExternalRequester,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks',
        verbose_name='Responsável Individual'
    )
    
    group_assignee = models.ForeignKey(
        GroupRequester,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks',
        verbose_name='Grupo Responsável'
    )
    
    created_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='created_tasks',
        verbose_name='Criado por'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ordoc_flow_tasks'
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
        unique_together = ['name', 'procedure']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['procedure', 'status']),
            models.Index(fields=['assignee', 'status']),
            models.Index(fields=['group_assignee', 'status']),
            models.Index(fields=['created_by']),
            models.Index(fields=['deadline']),
            models.Index(fields=['prn']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.procedure.process_number})"
    
    def save(self, *args, **kwargs):
        if not self.prn:
            self.prn = f"{self.procedure.procedure_template_name}/{self.procedure.process_number}/{self.name}"
        super().save(*args, **kwargs)
    
    @property
    def is_closed(self):
        return self.status in ['finished', 'refused']
    
    def clean(self):
        # Validação de deadline
        if self.deadline and self.deadline < date.today():
             # Se for criação (pk é None), não permite data no passado
             if not self.pk:
                 raise ValidationError('Prazo não pode ser anterior à data atual.')
             # Se for edição, permite manter data antiga
    
    @classmethod
    def count_by_status(cls, organization=None, user=None, group_id=None, **filters):
        """Conta tarefas por status"""
        from django.db.models import Count
        
        queryset = cls.objects.all()
        
        # Filtros de organização
        if organization:
            queryset = queryset.filter(procedure__organization=organization)
        
        # Filtros de usuário
        if user:
            # Para usuários internos (OrdocUser), filtra por grupos
            # Para usuários externos, filtra por assignee direto
            from ordoc_cloud.models import OrdocUser
            
            if isinstance(user, OrdocUser):
                # Usuário interno - busca por grupos onde o usuário é membro
                queryset = queryset.filter(
                    models.Q(group_assignee__members__user=user)
                )
            else:
                # Usuário externo - busca por atribuição direta
                queryset = queryset.filter(
                    models.Q(assignee=user)
                )
        
        # Filtros de grupo
        if group_id:
            queryset = queryset.filter(group_assignee_id=group_id)
        
        # Aplica filtros adicionais
        if filters:
            queryset = queryset.filter(**filters)
        
        # Conta por status
        result = queryset.values('status').annotate(count=Count('id'))
        
        # Converte para dict
        status_counts = {item['status']: item['count'] for item in result}
        
        # Garante que todos os status estão presentes
        for status, _ in cls.STATUS_CHOICES:
            if status not in status_counts:
                status_counts[status] = 0
                
        # Adiciona total
        status_counts['total'] = sum(status_counts.values())
        
        return status_counts
    
    # FSM Transitions
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='running')
    def run(self):
        if self.procedure.status == 'draft':
            self.procedure.run()
            self.procedure.save()
    
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='started')
    def start(self):
        if not self.procedure.status == 'started':
            self.procedure.start()
            self.procedure.save()
    
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='finished')
    def finish(self):
        pass
    
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='refused')
    def refuse(self):
        if not self.procedure.status == 'started':
            self.procedure.start()
            self.procedure.save()


# ============================================================================
# MODELOS DE DOCUMENTOS E ANEXOS
# ============================================================================

class ProcedureDocument(models.Model):
    """
    Modelo para documentos anexados a procedimentos.
    Equivalente ao PrinterFlow::ProcedureDocument do Rails.
    """

    DOCUMENT_TYPE_CHOICES = [
        ('attachment', 'Anexo'),
        ('evidence', 'Evidência'),
        ('report', 'Relatório'),
        ('contract', 'Contrato'),
        ('invoice', 'Fatura'),
        ('certificate', 'Certificado'),
        ('other', 'Outro'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Document info
    name = models.CharField(max_length=255, verbose_name='Nome do Documento')
    description = models.TextField(blank=True, verbose_name='Descrição')
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE_CHOICES,
        default='attachment',
        verbose_name='Tipo do Documento'
    )

    # File info
    file = models.FileField(
        upload_to='procedure_documents/%Y/%m/%d/',
        verbose_name='Arquivo'
    )
    file_name = models.CharField(max_length=255, verbose_name='Nome do Arquivo')
    file_size = models.PositiveIntegerField(verbose_name='Tamanho do Arquivo')
    file_type = models.CharField(max_length=100, verbose_name='Tipo do Arquivo')
    storage_key = models.CharField(max_length=500, blank=True, verbose_name='Chave de Armazenamento')

    # Status
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )

    # Versioning
    version = models.PositiveIntegerField(default=1, verbose_name='Versão')
    is_current = models.BooleanField(default=True, verbose_name='Versão Atual')
    parent_document = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='versions',
        verbose_name='Documento Original'
    )

    # Relations
    procedure = models.ForeignKey(
        Procedure,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Procedimento'
    )

    uploaded_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='uploaded_procedure_documents',
        verbose_name='Enviado por'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ordoc_flow_procedure_documents'
        verbose_name = 'Documento do Procedimento'
        verbose_name_plural = 'Documentos do Procedimento'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['procedure', 'status']),
            models.Index(fields=['document_type']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['is_current']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} - {self.procedure.process_number}"

    def save(self, *args, **kwargs):
        if self.file and not self.file_name:
            self.file_name = self.file.name
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)

    def soft_delete(self):
        """Soft delete do documento"""
        self.deleted_at = timezone.now()
        self.save()

    def create_new_version(self, new_file, uploaded_by):
        """Cria uma nova versão do documento"""
        # Marca a versão atual como não atual
        self.is_current = False
        self.save()

        # Cria nova versão
        new_doc = ProcedureDocument.objects.create(
            name=self.name,
            description=self.description,
            document_type=self.document_type,
            file=new_file,
            file_name=new_file.name,
            file_size=new_file.size,
            file_type=new_file.content_type if hasattr(new_file, 'content_type') else '',
            procedure=self.procedure,
            uploaded_by=uploaded_by,
            version=self.version + 1,
            is_current=True,
            parent_document=self.parent_document or self
        )

        return new_doc


class TaskAttachment(models.Model):
    """
    Modelo para anexos de tarefas.
    Equivalente ao PrinterFlow::TaskAttachment do Rails.
    """

    ATTACHMENT_TYPE_CHOICES = [
        ('document', 'Documento'),
        ('image', 'Imagem'),
        ('video', 'Vídeo'),
        ('audio', 'Áudio'),
        ('spreadsheet', 'Planilha'),
        ('presentation', 'Apresentação'),
        ('other', 'Outro'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Attachment info
    name = models.CharField(max_length=255, verbose_name='Nome do Anexo')
    description = models.TextField(blank=True, verbose_name='Descrição')
    attachment_type = models.CharField(
        max_length=20,
        choices=ATTACHMENT_TYPE_CHOICES,
        default='document',
        verbose_name='Tipo do Anexo'
    )

    # File info
    file = models.FileField(
        upload_to='task_attachments/%Y/%m/%d/',
        verbose_name='Arquivo'
    )
    file_name = models.CharField(max_length=255, verbose_name='Nome do Arquivo')
    file_size = models.PositiveIntegerField(verbose_name='Tamanho do Arquivo')
    file_type = models.CharField(max_length=100, verbose_name='Tipo do Arquivo')
    storage_key = models.CharField(max_length=500, blank=True, verbose_name='Chave de Armazenamento')

    # Thumbnail for images/videos
    thumbnail = models.ImageField(
        upload_to='task_attachments/thumbnails/%Y/%m/%d/',
        null=True,
        blank=True,
        verbose_name='Miniatura'
    )

    # Relations
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='attachments',
        verbose_name='Tarefa'
    )

    uploaded_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        related_name='uploaded_task_attachments',
        verbose_name='Enviado por'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ordoc_flow_task_attachments'
        verbose_name = 'Anexo da Tarefa'
        verbose_name_plural = 'Anexos da Tarefa'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task']),
            models.Index(fields=['attachment_type']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} - {self.task.name}"

    def save(self, *args, **kwargs):
        if self.file and not self.file_name:
            self.file_name = self.file.name
        if self.file and not self.file_size:
            self.file_size = self.file.size

        # Detecta tipo do anexo baseado na extensão
        if not self.attachment_type or self.attachment_type == 'other':
            self._detect_attachment_type()

        super().save(*args, **kwargs)

    def _detect_attachment_type(self):
        """Detecta o tipo de anexo baseado na extensão do arquivo"""
        import mimetypes
        mime_type, _ = mimetypes.guess_type(self.file_name)

        if mime_type:
            if mime_type.startswith('image/'):
                self.attachment_type = 'image'
            elif mime_type.startswith('video/'):
                self.attachment_type = 'video'
            elif mime_type.startswith('audio/'):
                self.attachment_type = 'audio'
            elif mime_type in ['application/pdf', 'application/msword',
                               'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
                self.attachment_type = 'document'
            elif mime_type in ['application/vnd.ms-excel',
                               'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
                self.attachment_type = 'spreadsheet'
            elif mime_type in ['application/vnd.ms-powerpoint',
                               'application/vnd.openxmlformats-officedocument.presentationml.presentation']:
                self.attachment_type = 'presentation'

    def soft_delete(self):
        """Soft delete do anexo"""
        self.deleted_at = timezone.now()
        self.save()

    def generate_thumbnail(self):
        """Gera thumbnail para imagens e vídeos"""
        # Implementação depende de bibliotecas como Pillow ou ffmpeg
        pass


class WorkflowHistory(models.Model):
    """
    Modelo para histórico de ações em procedimentos e tarefas.
    Registra todas as alterações e transições de estado.
    """

    ACTION_CHOICES = [
        ('created', 'Criado'),
        ('updated', 'Atualizado'),
        ('status_changed', 'Status Alterado'),
        ('assigned', 'Atribuído'),
        ('commented', 'Comentado'),
        ('document_added', 'Documento Adicionado'),
        ('document_removed', 'Documento Removido'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('archived', 'Arquivado'),
        ('restored', 'Restaurado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name='Ação'
    )

    description = models.TextField(verbose_name='Descrição')

    # Previous and new values for tracking changes
    old_value = models.JSONField(default=dict, blank=True, verbose_name='Valor Anterior')
    new_value = models.JSONField(default=dict, blank=True, verbose_name='Novo Valor')

    # Generic foreign key para procedimentos ou tarefas
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    workflow_object = GenericForeignKey('content_type', 'object_id')

    # Who performed the action
    performed_by = models.ForeignKey(
        'ordoc_cloud.OrdocUser',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='workflow_history_actions',
        verbose_name='Realizado por'
    )

    external_performed_by = models.ForeignKey(
        ExternalRequester,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='workflow_history_actions',
        verbose_name='Realizado por (Externo)'
    )

    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='Endereço IP')
    user_agent = models.TextField(blank=True, verbose_name='User Agent')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ordoc_flow_workflow_history'
        verbose_name = 'Histórico do Workflow'
        verbose_name_plural = 'Históricos do Workflow'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['action']),
            models.Index(fields=['performed_by']),
            models.Index(fields=['external_performed_by']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        performer = self.performed_by.name if self.performed_by else (
            self.external_performed_by.name if self.external_performed_by else 'Sistema'
        )
        return f"{self.get_action_display()} por {performer}"

    @classmethod
    def log_action(cls, obj, action, description, performed_by=None, external_performed_by=None,
                   old_value=None, new_value=None, request=None):
        """
        Método auxiliar para registrar uma ação no histórico.

        Args:
            obj: Objeto (Procedure ou Task)
            action: Tipo da ação
            description: Descrição da ação
            performed_by: Usuário interno que realizou a ação
            external_performed_by: Usuário externo que realizou a ação
            old_value: Valor anterior (dict)
            new_value: Novo valor (dict)
            request: Request HTTP para capturar IP e User Agent
        """
        history = cls.objects.create(
            content_type=ContentType.objects.get_for_model(obj),
            object_id=obj.id,
            action=action,
            description=description,
            performed_by=performed_by,
            external_performed_by=external_performed_by,
            old_value=old_value or {},
            new_value=new_value or {},
            ip_address=request.META.get('REMOTE_ADDR') if request else None,
            user_agent=request.META.get('HTTP_USER_AGENT', '') if request else ''
        )

        return history
