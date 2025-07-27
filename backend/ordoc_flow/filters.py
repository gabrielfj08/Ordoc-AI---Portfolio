import django_filters
from django.db.models import Q
from django.utils import timezone
from .models import (
    ExternalRequester, WorkflowRequest, GroupRequester, 
    ProcedureTemplate, Procedure, Task
)
from .approval_models import ApprovalInstance


class ExternalRequesterFilter(django_filters.FilterSet):
    """Filtros para solicitantes externos"""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    cpf = django_filters.CharFilter(lookup_expr='exact')
    status = django_filters.ChoiceFilter(choices=[
        ('active', 'Ativo'),
        ('inactive', 'Inativo')
    ])
    notification_type = django_filters.ChoiceFilter(choices=[
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('both', 'Ambos')
    ])
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = ExternalRequester
        fields = ['name', 'email', 'cpf', 'status', 'notification_type']


class GroupRequesterFilter(django_filters.FilterSet):
    """Filtros para grupos de solicitantes"""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=[
        ('active', 'Ativo'),
        ('inactive', 'Inativo')
    ])
    has_members = django_filters.BooleanFilter(method='filter_has_members')
    
    class Meta:
        model = GroupRequester
        fields = ['name', 'description', 'status']
    
    def filter_has_members(self, queryset, name, value):
        if value:
            return queryset.filter(grouprequestermember__is_active=True).distinct()
        else:
            return queryset.exclude(grouprequestermember__is_active=True).distinct()


class ProcedureTemplateFilter(django_filters.FilterSet):
    """Filtros para templates de procedimentos"""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    source = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=[
        ('active', 'Ativo'),
        ('inactive', 'Inativo')
    ])
    group_requester = django_filters.ModelChoiceFilter(
        queryset=GroupRequester.objects.all()
    )
    parent_procedure_template = django_filters.ModelChoiceFilter(
        queryset=ProcedureTemplate.objects.all()
    )
    is_root = django_filters.BooleanFilter(method='filter_is_root')
    has_children = django_filters.BooleanFilter(method='filter_has_children')
    
    class Meta:
        model = ProcedureTemplate
        fields = ['name', 'description', 'source', 'status', 'group_requester']
    
    def filter_is_root(self, queryset, name, value):
        if value:
            return queryset.filter(parent_procedure_template__isnull=True)
        else:
            return queryset.filter(parent_procedure_template__isnull=False)
    
    def filter_has_children(self, queryset, name, value):
        if value:
            return queryset.filter(children_procedure_templates__isnull=False).distinct()
        else:
            return queryset.filter(children_procedure_templates__isnull=True).distinct()


class ProcedureFilter(django_filters.FilterSet):
    """Filtros para procedimentos"""
    
    process_number = django_filters.CharFilter(lookup_expr='icontains')
    procedure_template_name = django_filters.CharFilter(lookup_expr='icontains')
    source = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=[
        ('draft', 'Rascunho'),
        ('running', 'Em execução'),
        ('started', 'Iniciado'),
        ('finished', 'Finalizado'),
        ('archived', 'Arquivado')
    ])
    priority = django_filters.ChoiceFilter(choices=[
        ('normal', 'Normal'),
        ('high', 'Alta')
    ])
    private = django_filters.BooleanFilter()
    procedure_template = django_filters.ModelChoiceFilter(
        queryset=ProcedureTemplate.objects.all()
    )
    requester = django_filters.ModelChoiceFilter(
        queryset=ExternalRequester.objects.all()
    )
    responsible_group = django_filters.ModelChoiceFilter(
        queryset=GroupRequester.objects.all()
    )
    created_by = django_filters.CharFilter(field_name='created_by__name', lookup_expr='icontains')
    
    # Filtros de data
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    deadline_after = django_filters.DateFilter(field_name='deadline', lookup_expr='gte')
    deadline_before = django_filters.DateFilter(field_name='deadline', lookup_expr='lte')
    
    # Filtros especiais
    overdue = django_filters.BooleanFilter(method='filter_overdue')
    has_tasks = django_filters.BooleanFilter(method='filter_has_tasks')
    year = django_filters.NumberFilter(field_name='created_at__year')
    month = django_filters.NumberFilter(field_name='created_at__month')
    
    class Meta:
        model = Procedure
        fields = [
            'process_number', 'procedure_template_name', 'source', 'status',
            'priority', 'private', 'procedure_template', 'requester',
            'responsible_group', 'created_by'
        ]
    
    def filter_overdue(self, queryset, name, value):
        if value:
            return queryset.filter(
                deadline__lt=timezone.now().date(),
                status__in=['running', 'started']
            )
        return queryset
    
    def filter_has_tasks(self, queryset, name, value):
        if value:
            return queryset.filter(tasks__isnull=False).distinct()
        else:
            return queryset.filter(tasks__isnull=True).distinct()


class TaskFilter(django_filters.FilterSet):
    """Filtros para tarefas"""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=[
        ('draft', 'Rascunho'),
        ('running', 'Em execução'),
        ('started', 'Iniciado'),
        ('finished', 'Finalizado'),
        ('refused', 'Recusado'),
        ('returned', 'Devolvido')
    ])
    priority = django_filters.ChoiceFilter(choices=[
        ('normal', 'Normal'),
        ('high', 'Alta')
    ])
    procedure = django_filters.ModelChoiceFilter(
        queryset=Procedure.objects.all()
    )
    procedure_template = django_filters.ModelChoiceFilter(
        field_name='procedure__procedure_template',
        queryset=ProcedureTemplate.objects.all()
    )
    assignee = django_filters.ModelChoiceFilter(
        queryset=ExternalRequester.objects.all()
    )
    group_assignee = django_filters.ModelChoiceFilter(
        queryset=GroupRequester.objects.all()
    )
    created_by = django_filters.CharFilter(field_name='created_by__name', lookup_expr='icontains')
    
    # Filtros de data
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    deadline_after = django_filters.DateFilter(field_name='deadline', lookup_expr='gte')
    deadline_before = django_filters.DateFilter(field_name='deadline', lookup_expr='lte')
    
    # Filtros especiais
    overdue = django_filters.BooleanFilter(method='filter_overdue')
    assigned_to_me = django_filters.BooleanFilter(method='filter_assigned_to_me')
    my_group_tasks = django_filters.BooleanFilter(method='filter_my_group_tasks')
    has_comments = django_filters.BooleanFilter(method='filter_has_comments')
    
    class Meta:
        model = Task
        fields = [
            'name', 'description', 'status', 'priority', 'procedure',
            'assignee', 'group_assignee', 'created_by'
        ]
    
    def filter_overdue(self, queryset, name, value):
        if value:
            return queryset.filter(
                deadline__lt=timezone.now().date(),
                status__in=['running', 'started']
            )
        return queryset
    
    def filter_assigned_to_me(self, queryset, name, value):
        if value and hasattr(self.request, 'user'):
            user = self.request.user
            if hasattr(user, 'external_requester'):
                return queryset.filter(assignee=user.external_requester)
            else:
                # Para usuários internos, busca por grupos
                user_groups = user.member_groups.filter(
                    grouprequestermember__is_active=True
                )
                return queryset.filter(group_assignee__in=user_groups)
        return queryset
    
    def filter_my_group_tasks(self, queryset, name, value):
        if value and hasattr(self.request, 'user'):
            user = self.request.user
            user_groups = user.member_groups.filter(
                grouprequestermember__is_active=True
            )
            return queryset.filter(group_assignee__in=user_groups)
        return queryset
    
    def filter_has_comments(self, queryset, name, value):
        if value:
            return queryset.filter(task_comments__isnull=False).distinct()
        else:
            return queryset.filter(task_comments__isnull=True).distinct()


class WorkflowRequestFilter(django_filters.FilterSet):
    """Filtros para solicitações de workflow"""
    
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=[
        ('pending', 'Pendente'),
        ('in_progress', 'Em andamento'),
        ('completed', 'Concluído'),
        ('cancelled', 'Cancelado')
    ])
    priority = django_filters.ChoiceFilter(choices=[
        ('low', 'Baixa'),
        ('normal', 'Normal'),
        ('high', 'Alta'),
        ('urgent', 'Urgente')
    ])
    requester = django_filters.ModelChoiceFilter(
        queryset=ExternalRequester.objects.all()
    )
    assigned_to = django_filters.CharFilter(field_name='assigned_to__name', lookup_expr='icontains')
    
    # Filtros de data
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    due_after = django_filters.DateFilter(field_name='due_date', lookup_expr='gte')
    due_before = django_filters.DateFilter(field_name='due_date', lookup_expr='lte')
    completed_after = django_filters.DateFilter(field_name='completed_at', lookup_expr='gte')
    completed_before = django_filters.DateFilter(field_name='completed_at', lookup_expr='lte')
    
    # Filtros especiais
    overdue = django_filters.BooleanFilter(method='filter_overdue')
    assigned_to_me = django_filters.BooleanFilter(method='filter_assigned_to_me')
    
    class Meta:
        model = WorkflowRequest
        fields = [
            'title', 'description', 'status', 'priority', 
            'requester', 'assigned_to'
        ]
    
    def filter_overdue(self, queryset, name, value):
        if value:
            return queryset.filter(
                due_date__lt=timezone.now().date(),
                status__in=['pending', 'in_progress']
            )
        return queryset
    
    def filter_assigned_to_me(self, queryset, name, value):
        if value and hasattr(self.request, 'user'):
            return queryset.filter(assigned_to=self.request.user)
        return queryset


class ApprovalInstanceFilter(django_filters.FilterSet):
    """Filtros para instâncias de aprovação"""
    
    status = django_filters.ChoiceFilter(choices=[
        ('pending', 'Pendente'),
        ('in_progress', 'Em andamento'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('cancelled', 'Cancelado')
    ])
    workflow = django_filters.ModelChoiceFilter(
        queryset=None  # Será definido no __init__
    )
    requested_by = django_filters.CharFilter(
        field_name='requested_by__name', 
        lookup_expr='icontains'
    )
    
    # Filtros de data
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    completed_after = django_filters.DateFilter(field_name='completed_at', lookup_expr='gte')
    completed_before = django_filters.DateFilter(field_name='completed_at', lookup_expr='lte')
    
    # Filtros especiais
    pending_for_me = django_filters.BooleanFilter(method='filter_pending_for_me')
    approved_by_me = django_filters.BooleanFilter(method='filter_approved_by_me')
    
    class Meta:
        model = ApprovalInstance
        fields = ['status', 'workflow', 'requested_by']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Importação dinâmica para evitar circular imports
        from .approval_models import ApprovalWorkflow
        self.filters['workflow'].queryset = ApprovalWorkflow.objects.all()
    
    def filter_pending_for_me(self, queryset, name, value):
        if value and hasattr(self.request, 'user'):
            return queryset.filter(
                status='in_progress',
                step_instances__status='pending',
                step_instances__assigned_to=self.request.user
            ).distinct()
        return queryset
    
    def filter_approved_by_me(self, queryset, name, value):
        if value and hasattr(self.request, 'user'):
            return queryset.filter(
                step_instances__approved_by=self.request.user
            ).distinct()
        return queryset


# Filtros customizados para relatórios e dashboards

class ProcedureReportFilter(django_filters.FilterSet):
    """Filtros específicos para relatórios de procedimentos"""
    
    # Períodos pré-definidos
    period = django_filters.ChoiceFilter(
        method='filter_period',
        choices=[
            ('today', 'Hoje'),
            ('yesterday', 'Ontem'),
            ('this_week', 'Esta semana'),
            ('last_week', 'Semana passada'),
            ('this_month', 'Este mês'),
            ('last_month', 'Mês passado'),
            ('this_quarter', 'Este trimestre'),
            ('last_quarter', 'Trimestre passado'),
            ('this_year', 'Este ano'),
            ('last_year', 'Ano passado')
        ]
    )
    
    # Agrupamentos
    group_by = django_filters.ChoiceFilter(
        method='filter_group_by',
        choices=[
            ('status', 'Status'),
            ('template', 'Template'),
            ('group', 'Grupo responsável'),
            ('month', 'Mês'),
            ('quarter', 'Trimestre'),
            ('year', 'Ano')
        ]
    )
    
    class Meta:
        model = Procedure
        fields = []
    
    def filter_period(self, queryset, name, value):
        now = timezone.now()
        today = now.date()
        
        if value == 'today':
            return queryset.filter(created_at__date=today)
        elif value == 'yesterday':
            yesterday = today - timezone.timedelta(days=1)
            return queryset.filter(created_at__date=yesterday)
        elif value == 'this_week':
            start_week = today - timezone.timedelta(days=today.weekday())
            return queryset.filter(created_at__date__gte=start_week)
        elif value == 'last_week':
            start_last_week = today - timezone.timedelta(days=today.weekday() + 7)
            end_last_week = start_last_week + timezone.timedelta(days=6)
            return queryset.filter(
                created_at__date__gte=start_last_week,
                created_at__date__lte=end_last_week
            )
        elif value == 'this_month':
            return queryset.filter(
                created_at__year=today.year,
                created_at__month=today.month
            )
        elif value == 'last_month':
            if today.month == 1:
                last_month = 12
                last_year = today.year - 1
            else:
                last_month = today.month - 1
                last_year = today.year
            return queryset.filter(
                created_at__year=last_year,
                created_at__month=last_month
            )
        elif value == 'this_year':
            return queryset.filter(created_at__year=today.year)
        elif value == 'last_year':
            return queryset.filter(created_at__year=today.year - 1)
        
        return queryset
    
    def filter_group_by(self, queryset, name, value):
        # Este método não filtra, apenas indica como agrupar os resultados
        # A lógica de agrupamento será implementada nas views
        return queryset


class TaskReportFilter(django_filters.FilterSet):
    """Filtros específicos para relatórios de tarefas"""
    
    # Filtros similares ao ProcedureReportFilter
    period = django_filters.ChoiceFilter(
        method='filter_period',
        choices=[
            ('today', 'Hoje'),
            ('yesterday', 'Ontem'),
            ('this_week', 'Esta semana'),
            ('last_week', 'Semana passada'),
            ('this_month', 'Este mês'),
            ('last_month', 'Mês passado'),
            ('this_quarter', 'Este trimestre'),
            ('last_quarter', 'Trimestre passado'),
            ('this_year', 'Este ano'),
            ('last_year', 'Ano passado')
        ]
    )
    
    performance = django_filters.ChoiceFilter(
        method='filter_performance',
        choices=[
            ('on_time', 'No prazo'),
            ('overdue', 'Em atraso'),
            ('completed_early', 'Concluído antecipadamente'),
            ('completed_late', 'Concluído com atraso')
        ]
    )
    
    class Meta:
        model = Task
        fields = []
    
    def filter_period(self, queryset, name, value):
        # Implementação similar ao ProcedureReportFilter
        now = timezone.now()
        today = now.date()
        
        if value == 'today':
            return queryset.filter(created_at__date=today)
        elif value == 'this_month':
            return queryset.filter(
                created_at__year=today.year,
                created_at__month=today.month
            )
        # ... outros períodos
        
        return queryset
    
    def filter_performance(self, queryset, name, value):
        if value == 'on_time':
            return queryset.filter(
                status='finished',
                deadline__gte=timezone.now().date()
            )
        elif value == 'overdue':
            return queryset.filter(
                deadline__lt=timezone.now().date(),
                status__in=['running', 'started']
            )
        elif value == 'completed_early':
            return queryset.filter(
                status='finished',
                updated_at__date__lt=F('deadline')
            )
        elif value == 'completed_late':
            return queryset.filter(
                status='finished',
                updated_at__date__gt=F('deadline')
            )
        
        return queryset
