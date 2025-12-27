from django.db import models
from django.core.validators import RegexValidator, MinValueValidator
from django_fsm import FSMField, transition
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, Count
import uuid
import re
from datetime import datetime, date


class Procedure(models.Model):
    """
    Modelo para procedimentos (instâncias de templates).
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
        'ordoc_flow.ProcedureTemplate',
        on_delete=models.CASCADE,
        related_name='procedures',
        verbose_name='Template de Procedimento'
    )
    
    requester = models.ForeignKey(
        'ordoc_flow.ExternalRequester',
        on_delete=models.CASCADE,
        related_name='procedures',
        verbose_name='Solicitante'
    )
    
    responsible_group = models.ForeignKey(
        'ordoc_flow.GroupRequester',
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
        current_year = timezone.now().year
        
        # Busca o maior número do ano atual para este template
        if self.procedure_template.parent_procedure_template:
            # Se tem pai, busca em todos os templates filhos
            parent_prn = self.procedure_template.parent_procedure_template.prn
            from .models import ProcedureTemplate
            related_templates = ProcedureTemplate.objects.filter(
                prn__startswith=parent_prn
            )
        else:
            # Se é raiz, busca em todos os templates com mesmo PRN base
            template_prn = self.procedure_template.prn
            from .models import ProcedureTemplate
            related_templates = ProcedureTemplate.objects.filter(
                prn__startswith=template_prn
            )
        
        # Busca o maior número do ano atual
        max_number = 0
        for template in related_templates:
            procedures = template.procedures.filter(
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
        # Validação: payload deve estar preenchido se schema presente
        if self.schema and not self.payload:
            raise ValidationError('Payload deve estar preenchido para executar o procedimento.')
    
    @transition(field=status, source=['archived', 'running'], target='started')
    def start(self):
        pass
    
    @transition(field=status, source='started', target='finished')
    def finish(self, user):
        # Validação: todas as tarefas devem estar finalizadas
        running_tasks = self.tasks.filter(status__in=['running', 'draft', 'started'])
        if running_tasks.exists():
            raise ValidationError('Todas as tarefas devem estar finalizadas para concluir o procedimento.')
        
        # Criar nota de justificativa
        JustificationNote.objects.create(
            justifiable=self,
            note=self.generate_finish_note(user),
            action='finish',
            created_by=user
        )
    
    @transition(field=status, source=['draft', 'started'], target='archived')
    def archive(self):
        # Validação: não pode arquivar se tem tarefas em andamento
        active_tasks = self.tasks.filter(status__in=['running', 'draft', 'started'])
        if active_tasks.exists():
            raise ValidationError('Não é possível arquivar procedimento com tarefas em andamento.')
    
    def unarchive(self):
        """Desarquiva o procedimento"""
        if self.tasks.exclude(status='draft').exists():
            self.start()
        else:
            self.draft()
    
    def generate_finish_note(self, user):
        """Gera nota de finalização"""
        from django.utils.formats import date_format
        now = timezone.now()
        return (f"Processo finalizado por {user.name}, "
                f"CPF: {self.mask_cpf(user.cpf)}, "
                f"no dia {date_format(now.date(), 'd/m/Y')}, "
                f"às {now.strftime('%Hh%M')}")
    
    def mask_cpf(self, cpf):
        """Mascara CPF para exibição"""
        if len(cpf) == 11:
            return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"
        return cpf
    
    @classmethod
    def count_by_status(cls, organization=None):
        """Conta procedimentos por status"""
        queryset = cls.objects.all()
        if organization:
            queryset = queryset.filter(organization=organization)
        
        counts = queryset.values('status').annotate(count=Count('id'))
        result = {status[0]: 0 for status in cls.STATUS_CHOICES}
        
        for item in counts:
            result[item['status']] = item['count']
        
        result['total'] = sum(result.values())
        return result


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
        return f"{self.name} ({self.organization.name})"
    
    def save(self, *args, **kwargs):
        if not self.prn:
            self.prn = f"task_template/{self.name}"
        super().save(*args, **kwargs)
    
    @property
    def procedure_count(self):
        """Conta procedimentos que usam este template"""
        return Procedure.objects.filter(
            tasks__task_template=self
        ).distinct().count()


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
        'ordoc_flow.ExternalRequester',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks',
        verbose_name='Responsável Individual'
    )
    
    group_assignee = models.ForeignKey(
        'ordoc_flow.GroupRequester',
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
    
    @property
    def procedure_info(self):
        """Retorna informações do procedimento"""
        parts = self.prn.split(':')[-1].split('/')
        if len(parts) >= 3:
            template_name, number, year = parts[-3], parts[-2], parts[-1]
            return f"{number}/{year} - {template_name}"
        return self.procedure.process_number
    
    def clean(self):
        # Validação de deadline
        if self.deadline and self.deadline < date.today():
             # Se for criação (pk é None), não permite data no passado
             if not self.pk:
                 raise ValidationError('Prazo não pode ser anterior à data atual.')
             # Se for edição, permite manter data antiga (mas idealmente deveria validar se houve mudança)
             # Simplificando: permite passado se já existe, assumindo que foi válido na criação

        
        # Validação: não pode editar tarefa fechada
        if self.pk and self.is_closed:
            original = Task.objects.get(pk=self.pk)
            if (self.group_assignee != original.group_assignee or 
                self.assignee != original.assignee):
                # Permite apenas mudança de atribuição
                pass
            else:
                raise ValidationError('Tarefa finalizada não pode ser editada.')
    
    # FSM Transitions
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='running')
    def run(self):
        # Inicia o procedimento se estiver em rascunho
        if self.procedure.status == 'draft':
            self.procedure.run()
            self.procedure.save()
    
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='started')
    def start(self):
        # Validação: responsável deve pertencer ao grupo
        if (self.group_assignee and self.assignee and 
            hasattr(self.group_assignee, 'get_active_members')):
            active_members = self.group_assignee.get_active_members()
            if self.assignee not in active_members:
                raise ValidationError('Responsável deve pertencer ao grupo atribuído.')
        
        # Inicia o procedimento se necessário
        if not self.procedure.status == 'started':
            self.procedure.start()
            self.procedure.save()
    
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='finished')
    def finish(self):
        # Validação: deve ter comentários ou campos preenchidos
        if not self.task_comments.exists() and not self.task_fields.exists():
            raise ValidationError('Tarefa deve ter comentários ou campos preenchidos para ser finalizada.')
    
    @transition(field=status, source=['running', 'draft', 'started', 'finished', 'refused'], target='refused')
    def refuse(self):
        # Validação: responsável deve pertencer ao grupo
        if (self.group_assignee and self.assignee and 
            hasattr(self.group_assignee, 'get_active_members')):
            active_members = self.group_assignee.get_active_members()
            if self.assignee not in active_members:
                raise ValidationError('Responsável deve pertencer ao grupo atribuído.')
        
        # Reinicia o procedimento
        if not self.procedure.status == 'started':
            self.procedure.start()
            self.procedure.save()
    
    @classmethod
    def count_by_status(cls, user=None, group_id=None, organization=None):
        """Conta tarefas por status"""
        queryset = cls.objects.all()
        
        if organization:
            queryset = queryset.filter(procedure__organization=organization)
        
        if group_id:
            running_tasks = queryset.filter(
                status='running',
                group_assignee_id=group_id
            ).count()
            
            if user:
                user_tasks = queryset.filter(
                    assignee_id=user.id,
                    group_assignee_id=group_id
                ).values('status').annotate(count=Count('id'))
                
                user_counts = {item['status']: item['count'] for item in user_tasks}
                
                returned_tasks = queryset.filter(
                    created_by=user,
                    status='refused'
                ).count()
                
                return {
                    'running': running_tasks,
                    'started': user_counts.get('started', 0),
                    'finished': user_counts.get('finished', 0) + user_counts.get('refused', 0),
                    'returned': returned_tasks
                }
        
        # Contagem geral
        counts = queryset.values('status').annotate(count=Count('id'))
        result = {status[0]: 0 for status in cls.STATUS_CHOICES}
        
        for item in counts:
            result[item['status']] = item['count']
        
        result['total'] = sum(result.values())
        result['returned'] = 0  # Compatibilidade com o serializer
        return result


class JustificationNote(models.Model):
    """
    Modelo para notas de justificativa em procedimentos e tarefas.
    """
    
    ACTION_CHOICES = [
        ('finish', 'Finalizar'),
        ('refuse', 'Recusar'),
        ('archive', 'Arquivar'),
        ('comment', 'Comentário'),
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
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comment = models.TextField(verbose_name='Comentário')
    
    task = models.ForeignKey(
        Task,
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
