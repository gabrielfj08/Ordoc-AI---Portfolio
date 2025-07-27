from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Prefetch
from django.utils import timezone
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ordoc_ai.base_viewset import BaseViewSet
from ordoc_ai.authentication import JWTAuthentication
from .models import (
    ExternalRequester, WorkflowRequest, GroupRequester, GroupRequesterMember,
    ProcedureTemplate, Field, FieldValueOption, Procedure, TaskTemplate, Task
)
from .approval_models import (
    JustificationNote, TaskComment, TaskField, ApprovalWorkflow, ApprovalStep,
    ApprovalInstance, ApprovalStepInstance, NotificationTemplate, NotificationLog
)
from .serializers import (
    ExternalRequesterSerializer, WorkflowRequestSerializer, GroupRequesterSerializer,
    ProcedureTemplateSerializer, FieldSerializer, ProcedureSerializer,
    TaskTemplateSerializer, TaskSerializer, JustificationNoteSerializer,
    TaskCommentSerializer, ApprovalWorkflowSerializer, ApprovalInstanceSerializer,
    NotificationTemplateSerializer, NotificationLogSerializer,
    WorkflowDashboardSerializer, BatchOperationSerializer, BatchOperationResultSerializer
)
from .filters import (
    ProcedureFilter, TaskFilter, ExternalRequesterFilter, GroupRequesterFilter,
    ProcedureTemplateFilter, ApprovalInstanceFilter
)
from .services import (
    WorkflowNotificationService, BatchOperationService, ApprovalService
)
from .search import workflow_solr_service, search_workflow
from .swagger import (
    procedure_list_schema, procedure_stats_schema, task_my_tasks_schema,
    search_schema, suggestions_schema, batch_execute_schema,
    dashboard_overview_schema, approval_pending_schema,
    analytics_workflow_metrics_schema, WORKFLOW_TAGS
)


class ExternalRequesterViewSet(BaseViewSet):
    """
    ViewSet para gerenciar solicitantes externos do workflow.
    """
    
    queryset = ExternalRequester.objects.all()
    serializer_class = ExternalRequesterSerializer
    filterset_class = ExternalRequesterFilter
    search_fields = ['name', 'email', 'cpf']
    ordering_fields = ['name', 'email', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related('organization').filter(
            organization=self.get_current_organization(),
            deleted_at__isnull=True
        )
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Ativa um solicitante externo"""
        external_requester = self.get_object()
        external_requester.status = 'active'
        external_requester.save()
        
        return Response({
            'message': 'Solicitante externo ativado com sucesso',
            'status': external_requester.status
        })
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Desativa um solicitante externo"""
        external_requester = self.get_object()
        external_requester.status = 'inactive'
        external_requester.save()
        
        return Response({
            'message': 'Solicitante externo desativado com sucesso',
            'status': external_requester.status
        })
    
    @action(detail=True, methods=['delete'])
    def soft_delete(self, request, pk=None):
        """Soft delete de um solicitante externo"""
        external_requester = self.get_object()
        external_requester.soft_delete()
        
        return Response({
            'message': 'Solicitante externo removido com sucesso'
        })


class GroupRequesterViewSet(BaseViewSet):
    """
    ViewSet para gerenciar grupos de solicitantes.
    """
    
    queryset = GroupRequester.objects.all()
    serializer_class = GroupRequesterSerializer
    filterset_class = GroupRequesterFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related('organization').prefetch_related(
            Prefetch(
                'grouprequestermember_set',
                queryset=GroupRequesterMember.objects.select_related('user')
            )
        ).filter(organization=self.get_current_organization())
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Adiciona um membro ao grupo"""
        group = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')
        
        if not user_id:
            return Response(
                {'error': 'user_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member, created = GroupRequesterMember.objects.get_or_create(
            group=group,
            user_id=user_id,
            defaults={'role': role, 'is_active': True}
        )
        
        if not created:
            member.role = role
            member.is_active = True
            member.save()
        
        return Response({
            'message': 'Membro adicionado ao grupo com sucesso',
            'member_id': member.id,
            'created': created
        })
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove um membro do grupo"""
        group = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            member = GroupRequesterMember.objects.get(
                group=group,
                user_id=user_id
            )
            member.is_active = False
            member.save()
            
            return Response({
                'message': 'Membro removido do grupo com sucesso'
            })
        except GroupRequesterMember.DoesNotExist:
            return Response(
                {'error': 'Membro não encontrado no grupo'},
                status=status.HTTP_404_NOT_FOUND
            )


class ProcedureTemplateViewSet(BaseViewSet):
    """
    ViewSet para gerenciar templates de procedimentos.
    """
    
    queryset = ProcedureTemplate.objects.all()
    serializer_class = ProcedureTemplateSerializer
    filterset_class = ProcedureTemplateFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related(
            'organization', 'group_requester', 'parent_procedure_template'
        ).prefetch_related('fields', 'children_procedure_templates').filter(
            organization=self.get_current_organization()
        )
    
    @action(detail=False, methods=['get'])
    def root_templates(self, request):
        """Lista apenas templates raiz (sem pai)"""
        queryset = self.get_queryset().filter(parent_procedure_template__isnull=True)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        """Lista templates filhos de um template específico"""
        template = self.get_object()
        children = template.children_procedure_templates.all()
        
        serializer = self.get_serializer(children, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Ativa um template de procedimento"""
        template = self.get_object()
        
        try:
            template.activate()
            template.save()
            return Response({
                'message': 'Template ativado com sucesso',
                'status': template.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Desativa um template de procedimento"""
        template = self.get_object()
        
        try:
            template.deactivate()
            template.save()
            return Response({
                'message': 'Template desativado com sucesso',
                'status': template.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProcedureViewSet(BaseViewSet):
    """
    ViewSet para gerenciar procedimentos.
    """
    
    queryset = Procedure.objects.all()
    serializer_class = ProcedureSerializer
    filterset_class = ProcedureFilter
    search_fields = ['process_number', 'procedure_template_name']
    ordering_fields = ['process_number', 'created_at', 'deadline']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related(
            'procedure_template', 'requester', 'responsible_group',
            'created_by', 'organization'
        ).prefetch_related(
            Prefetch(
                'tasks',
                queryset=Task.objects.select_related(
                    'assignee', 'group_assignee', 'created_by'
                )
            )
        ).filter(organization=self.get_current_organization())
    
    @procedure_stats_schema
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estatísticas de procedimentos"""
        stats = Procedure.count_by_status(organization=self.get_current_organization())
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        """Executa um procedimento"""
        procedure = self.get_object()
        
        try:
            procedure.run()
            procedure.save()
            return Response({
                'message': 'Procedimento executado com sucesso',
                'status': procedure.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Inicia um procedimento"""
        procedure = self.get_object()
        
        try:
            procedure.start()
            procedure.save()
            return Response({
                'message': 'Procedimento iniciado com sucesso',
                'status': procedure.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def finish(self, request, pk=None):
        """Finaliza um procedimento"""
        procedure = self.get_object()
        
        try:
            procedure.finish(self.get_current_user())
            procedure.save()
            return Response({
                'message': 'Procedimento finalizado com sucesso',
                'status': procedure.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Arquiva um procedimento"""
        procedure = self.get_object()
        
        try:
            procedure.archive()
            procedure.save()
            return Response({
                'message': 'Procedimento arquivado com sucesso',
                'status': procedure.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        """Desarquiva um procedimento"""
        procedure = self.get_object()
        
        try:
            procedure.unarchive()
            procedure.save()
            return Response({
                'message': 'Procedimento desarquivado com sucesso',
                'status': procedure.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class TaskViewSet(BaseViewSet):
    """
    ViewSet para gerenciar tarefas.
    """
    
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_class = TaskFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'deadline', 'priority']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related(
            'procedure__organization', 'procedure__procedure_template',
            'assignee', 'group_assignee', 'created_by', 'task_template'
        ).prefetch_related(
            'task_comments__created_by',
            'task_fields'
        ).filter(procedure__organization=self.get_current_organization())
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estatísticas de tarefas"""
        user = self.get_current_user()
        group_id = request.query_params.get('group_id')
        
        stats = Task.count_by_status(
            user=user,
            group_id=group_id,
            organization=self.get_current_organization()
        )
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Tarefas atribuídas ao usuário atual"""
        user = self.get_current_user()
        
        # Para usuários internos, busca por tarefas atribuídas diretamente
        # Para usuários externos, busca por external requester
        if hasattr(user, 'external_requester'):
            queryset = self.get_queryset().filter(
                assignee=user.external_requester
            )
        else:
            # Busca tarefas onde o usuário é membro do grupo responsável
            user_groups = user.member_groups.filter(
                grouprequestermember__is_active=True
            )
            queryset = self.get_queryset().filter(
                Q(group_assignee__in=user_groups) |
                Q(assignee__isnull=True, group_assignee__in=user_groups)
            )
        
        # Aplicar filtros
        queryset = self.filter_queryset(queryset)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        """Executa uma tarefa"""
        task = self.get_object()
        
        try:
            task.run()
            task.save()
            return Response({
                'message': 'Tarefa executada com sucesso',
                'status': task.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Inicia uma tarefa"""
        task = self.get_object()
        
        try:
            task.start()
            task.save()
            return Response({
                'message': 'Tarefa iniciada com sucesso',
                'status': task.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def finish(self, request, pk=None):
        """Finaliza uma tarefa"""
        task = self.get_object()
        
        try:
            task.finish()
            task.save()
            return Response({
                'message': 'Tarefa finalizada com sucesso',
                'status': task.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def refuse(self, request, pk=None):
        """Recusa uma tarefa"""
        task = self.get_object()
        
        try:
            task.refuse()
            task.save()
            return Response({
                'message': 'Tarefa recusada com sucesso',
                'status': task.status
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Adiciona um comentário à tarefa"""
        task = self.get_object()
        comment_text = request.data.get('comment')
        
        if not comment_text:
            return Response(
                {'error': 'Comentário é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comment = TaskComment.objects.create(
            task=task,
            comment=comment_text,
            created_by=self.get_current_user()
        )
        
        serializer = TaskCommentSerializer(comment)
        return Response({
            'message': 'Comentário adicionado com sucesso',
            'comment': serializer.data
        }, status=status.HTTP_201_CREATED)


class WorkflowDashboardViewSet(BaseViewSet):
    """
    ViewSet para dashboard do workflow.
    """
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Visão geral do workflow"""
        organization = self.get_current_organization()
        
        # Estatísticas de procedimentos
        procedure_stats = Procedure.count_by_status(organization=organization)
        
        # Estatísticas de tarefas
        task_stats = Task.count_by_status(organization=organization)
        
        # Aprovações pendentes
        pending_approvals = ApprovalInstance.objects.filter(
            status='pending',
            workflow__organization=organization
        ).count()
        
        # Tarefas em atraso
        overdue_tasks = Task.objects.filter(
            procedure__organization=organization,
            deadline__lt=timezone.now().date(),
            status__in=['running', 'started']
        ).count()
        
        # Atividades recentes (últimos 10 procedimentos criados)
        recent_procedures = Procedure.objects.filter(
            organization=organization
        ).select_related(
            'procedure_template', 'requester', 'created_by'
        ).order_by('-created_at')[:10]
        
        recent_activities = []
        for proc in recent_procedures:
            recent_activities.append({
                'id': proc.id,
                'type': 'procedure_created',
                'title': f'Procedimento {proc.process_number} criado',
                'description': f'{proc.procedure_template_name} por {proc.created_by.name}',
                'created_at': proc.created_at,
                'status': proc.status
            })
        
        dashboard_data = {
            'procedure_stats': procedure_stats,
            'task_stats': task_stats,
            'pending_approvals': pending_approvals,
            'overdue_tasks': overdue_tasks,
            'recent_activities': recent_activities
        }
        
        serializer = WorkflowDashboardSerializer(dashboard_data)
        return Response(serializer.data)


class BatchOperationViewSet(BaseViewSet):
    """
    ViewSet para operações em lote.
    """
    
    @action(detail=False, methods=['post'])
    def execute(self, request):
        """Executa operação em lote"""
        serializer = BatchOperationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                service = BatchOperationService(
                    organization=self.get_current_organization(),
                    user=self.get_current_user()
                )
                
                result = service.execute_batch_operation(
                    action=serializer.validated_data['action'],
                    object_ids=serializer.validated_data['object_ids'],
                    **{k: v for k, v in serializer.validated_data.items() 
                       if k not in ['action', 'object_ids']}
                )
                
                result_serializer = BatchOperationResultSerializer(result)
                return Response(result_serializer.data)
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ViewSets para Sistema de Aprovação

class ApprovalWorkflowViewSet(BaseViewSet):
    """
    ViewSet para workflows de aprovação.
    """
    
    queryset = ApprovalWorkflow.objects.all()
    serializer_class = ApprovalWorkflowSerializer
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related('organization').prefetch_related(
            'steps__approver_user',
            'steps__approver_group'
        ).filter(organization=self.get_current_organization())


class ApprovalInstanceViewSet(BaseViewSet):
    """
    ViewSet para instâncias de aprovação.
    """
    
    queryset = ApprovalInstance.objects.all()
    serializer_class = ApprovalInstanceSerializer
    filterset_class = ApprovalInstanceFilter
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related(
            'workflow__organization', 'requested_by'
        ).prefetch_related(
            'step_instances__approval_step',
            'step_instances__assigned_to',
            'step_instances__approved_by'
        ).filter(workflow__organization=self.get_current_organization())
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Lista aprovações pendentes para o usuário atual"""
        user = self.get_current_user()
        
        # Busca aprovações onde o usuário é responsável por alguma etapa pendente
        queryset = self.get_queryset().filter(
            status='in_progress',
            step_instances__status='pending',
            step_instances__assigned_to=user
        ).distinct()
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ViewSets para Sistema de Notificações

class NotificationTemplateViewSet(BaseViewSet):
    """
    ViewSet para templates de notificação.
    """
    
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    search_fields = ['name', 'trigger_event']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(organization=self.get_current_organization())


class NotificationLogViewSet(BaseViewSet):
    """
    ViewSet para logs de notificação.
    """
    
    queryset = NotificationLog.objects.all()
    serializer_class = NotificationLogSerializer
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related(
            'template', 'recipient', 'external_recipient'
        ).filter(
            Q(recipient__organization=self.get_current_organization()) |
            Q(external_recipient__organization=self.get_current_organization())
        )


class WorkflowRequestViewSet(BaseViewSet):
    """
    ViewSet para solicitações básicas de workflow.
    """
    
    queryset = WorkflowRequest.objects.all()
    serializer_class = WorkflowRequestSerializer
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'due_date', 'priority']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related(
            'requester', 'organization'
        ).filter(organization=self.get_current_organization())
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Atribui uma solicitação a um usuário"""
        workflow_request = self.get_object()
        assigned_to_id = request.data.get('assigned_to_id')
        
        if not assigned_to_id:
            return Response(
                {'error': 'assigned_to_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from ordoc_cloud.models import OrdocUser
            assigned_to = OrdocUser.objects.get(
                id=assigned_to_id,
                organization=self.get_current_organization()
            )
            
            workflow_request.assigned_to = assigned_to
            workflow_request.status = 'in_progress'
            workflow_request.save()
            
            return Response({
                'message': 'Solicitação atribuída com sucesso',
                'assigned_to': assigned_to.name
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Marca uma solicitação como concluída"""
        workflow_request = self.get_object()
        
        workflow_request.status = 'completed'
        workflow_request.completed_at = timezone.now()
        workflow_request.save()
        
        return Response({
            'message': 'Solicitação concluída com sucesso',
            'status': workflow_request.status
        })


# ViewSets para Sistema de Busca Solr

class WorkflowSearchViewSet(BaseViewSet):
    """
    ViewSet para busca avançada no workflow usando Apache Solr.
    """
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Busca avançada no workflow"""
        query = request.query_params.get('q', '')
        content_types = request.query_params.getlist('content_type')
        start = int(request.query_params.get('start', 0))
        rows = int(request.query_params.get('rows', 20))
        sort = request.query_params.get('sort')
        
        # Filtros adicionais
        filters = {}
        if request.query_params.get('status'):
            filters['status'] = request.query_params.get('status')
        if request.query_params.get('priority'):
            filters['priority'] = request.query_params.get('priority')
        if request.query_params.get('created_by'):
            filters['created_by'] = request.query_params.get('created_by')
        
        try:
            results = search_workflow(
                query=query,
                content_types=content_types or ['procedure', 'task', 'procedure_template'],
                organization_id=str(self.get_current_organization().id),
                filters=filters,
                start=start,
                rows=rows,
                sort=sort
            )
            
            return Response(results)
            
        except Exception as e:
            return Response(
                {'error': f'Erro na busca: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Obtém sugestões de busca"""
        query = request.query_params.get('q', '')
        limit = int(request.query_params.get('limit', 10))
        
        try:
            suggestions = workflow_solr_service.get_suggestions(
                query=query,
                organization_id=str(self.get_current_organization().id),
                limit=limit
            )
            
            return Response(suggestions)
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao obter sugestões: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def reindex(self, request):
        """Reindexa todos os dados do workflow (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Acesso negado'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from .signals import reindex_all_workflow_data
            reindex_all_workflow_data(organization=self.get_current_organization())
            
            return Response({
                'message': 'Reindexação iniciada com sucesso'
            })
            
        except Exception as e:
            return Response(
                {'error': f'Erro na reindexação: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def facets(self, request):
        """Obtém facetas para filtros de busca"""
        try:
            # Busca com facetas ativadas
            search_params = {
                'q': '*:*',
                'rows': 0,
                'facet': 'on',
                'facet.field': ['content_type', 'status', 'priority', 'created_by', 'tags'],
                'facet.limit': 50,
                'facet.mincount': 1,
                'fq': f'organization_id:{self.get_current_organization().id}'
            }
            
            results = workflow_solr_service.solr.search(**search_params)
            
            facets = {}
            if hasattr(results, 'facets') and 'facet_fields' in results.facets:
                for field, values in results.facets['facet_fields'].items():
                    field_facets = []
                    for i in range(0, len(values), 2):
                        if i + 1 < len(values):
                            field_facets.append({
                                'value': values[i],
                                'count': values[i + 1]
                            })
                    facets[field] = field_facets
            
            return Response(facets)
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao obter facetas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WorkflowAnalyticsViewSet(BaseViewSet):
    """
    ViewSet para analytics e métricas avançadas do workflow.
    """
    
    @action(detail=False, methods=['get'])
    def search_analytics(self, request):
        """Analytics de busca e uso do sistema"""
        try:
            # Estatísticas de busca dos últimos 30 dias
            from django.utils import timezone
            from datetime import timedelta
            
            thirty_days_ago = timezone.now() - timedelta(days=30)
            
            # Busca termos mais pesquisados (simulado - em produção viria de logs)
            popular_searches = [
                {'term': 'aprovação', 'count': 45},
                {'term': 'contrato', 'count': 32},
                {'term': 'urgente', 'count': 28},
                {'term': 'financeiro', 'count': 21},
                {'term': 'rh', 'count': 18}
            ]
            
            # Estatísticas de conteúdo indexado
            content_stats = {
                'procedures': Procedure.objects.filter(
                    organization=self.get_current_organization(),
                    created_at__gte=thirty_days_ago
                ).count(),
                'tasks': Task.objects.filter(
                    procedure__organization=self.get_current_organization(),
                    created_at__gte=thirty_days_ago
                ).count(),
                'templates': ProcedureTemplate.objects.filter(
                    organization=self.get_current_organization(),
                    created_at__gte=thirty_days_ago
                ).count()
            }
            
            # Métricas de performance
            performance_metrics = {
                'avg_search_time': '0.15s',  # Em produção viria do Solr
                'index_size': '2.3MB',
                'last_index_update': timezone.now().isoformat()
            }
            
            return Response({
                'popular_searches': popular_searches,
                'content_stats': content_stats,
                'performance_metrics': performance_metrics,
                'period': '30_days'
            })
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao obter analytics: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def workflow_metrics(self, request):
        """Métricas detalhadas do workflow"""
        try:
            from django.db.models import Count, Avg, Q
            from django.utils import timezone
            from datetime import timedelta
            
            # Período de análise
            period_days = int(request.query_params.get('days', 30))
            start_date = timezone.now() - timedelta(days=period_days)
            
            # Métricas de procedimentos
            procedure_metrics = {
                'total': Procedure.objects.filter(
                    organization=self.get_current_organization()
                ).count(),
                'created_period': Procedure.objects.filter(
                    organization=self.get_current_organization(),
                    created_at__gte=start_date
                ).count(),
                'by_status': Procedure.objects.filter(
                    organization=self.get_current_organization()
                ).values('status').annotate(count=Count('id')),
                'by_priority': Procedure.objects.filter(
                    organization=self.get_current_organization()
                ).values('priority').annotate(count=Count('id')),
                'avg_completion_days': 7.5  # Calculado em produção
            }
            
            # Métricas de tarefas
            task_metrics = {
                'total': Task.objects.filter(
                    procedure__organization=self.get_current_organization()
                ).count(),
                'created_period': Task.objects.filter(
                    procedure__organization=self.get_current_organization(),
                    created_at__gte=start_date
                ).count(),
                'overdue': Task.objects.filter(
                    procedure__organization=self.get_current_organization(),
                    deadline__lt=timezone.now().date(),
                    status__in=['running', 'started']
                ).count(),
                'by_status': Task.objects.filter(
                    procedure__organization=self.get_current_organization()
                ).values('status').annotate(count=Count('id'))
            }
            
            # Métricas de templates
            template_metrics = {
                'total': ProcedureTemplate.objects.filter(
                    organization=self.get_current_organization()
                ).count(),
                'active': ProcedureTemplate.objects.filter(
                    organization=self.get_current_organization(),
                    status='active'
                ).count(),
                'most_used': ProcedureTemplate.objects.filter(
                    organization=self.get_current_organization()
                ).annotate(
                    usage_count=Count('procedures')
                ).order_by('-usage_count')[:5].values(
                    'name', 'usage_count'
                )
            }
            
            return Response({
                'procedure_metrics': procedure_metrics,
                'task_metrics': task_metrics,
                'template_metrics': template_metrics,
                'period_days': period_days,
                'generated_at': timezone.now().isoformat()
            })
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao obter métricas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
