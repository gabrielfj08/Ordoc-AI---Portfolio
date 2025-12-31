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
    ProcedureTemplate, Field, FieldValueOption, Procedure, TaskTemplate, Task,
    ProcedureDocument, TaskAttachment, WorkflowHistory
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
    WorkflowDashboardSerializer, BatchOperationSerializer, BatchOperationResultSerializer,
    ProcedureDocumentSerializer, TaskAttachmentSerializer, WorkflowHistorySerializer,
    ProcedureDocumentUploadSerializer, TaskAttachmentUploadSerializer
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
    
    def perform_create(self, serializer):
        user = self.get_current_user()
        ordoc_user = self.get_current_ordoc_user()
        organization = self.get_current_organization()
        
        # 1. Obter template para definir grupo responsável
        template = serializer.validated_data.get('procedure_template')
        responsible_group = None
        if template:
            responsible_group = template.group_requester
            
        # 2. Definir Solicitante (Requester)
        requester = None
        if hasattr(user, 'external_requester'):
            requester = user.external_requester
        else:
            # Usuário interno criando procedimento
            # Como o campo requester é obrigatório e aponta para ExternalRequester,
            # usamos um placeholder para procedimentos internos
            requester = ExternalRequester.objects.filter(
                email='internal@system.local',
                organization=organization
            ).first()
            
            if not requester and organization:
                requester = ExternalRequester.objects.create(
                    name='Sistema Interno',
                    email='internal@system.local',
                    organization=organization,
                    status='active'
                )

        serializer.save(
            organization=organization,
            created_by=ordoc_user,
            responsible_group=responsible_group,
            requester=requester
        )
    
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
        queryset = queryset.select_related(
            'procedure__organization', 'procedure__procedure_template',
            'assignee', 'group_assignee', 'created_by', 'task_template'
        ).prefetch_related(
            'task_comments__created_by'
        ).filter(procedure__organization=self.get_current_organization())

        # TODO: Implementar filtros baseados em role após popular banco de dados
        # Por enquanto, todos veem todas as tasks da organização
        return queryset
    
    def perform_create(self, serializer):
        ordoc_user = self.get_current_ordoc_user()
        organization = self.get_current_organization()

        # Validar se o procedimento pertence à organização
        procedure = serializer.validated_data.get('procedure')
        if procedure and procedure.organization != organization:
            raise permissions.exceptions.PermissionDenied(
                "O procedimento não pertence à sua organização."
            )

        # Atribuição manual de responsável, se fornecida no payload
        # Se não fornecida, assignee/group_assignee ficarão nulos (pendente)
        # O usuário atual é sempre o criador
        serializer.save(
            created_by=ordoc_user
        )

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
        ordoc_user = self.get_current_ordoc_user()
        
        # Para usuários internos, busca por tarefas atribuídas diretamente
        # Para usuários externos, busca por external requester
        if hasattr(user, 'external_requester'):
            queryset = self.get_queryset().filter(
                assignee=user.external_requester
            )
        else:
            # Busca tarefas onde o usuário é membro do grupo responsável
            # Fix: Consultar GroupRequesterMember usando OrdocUser
            active_group_ids = []
            if ordoc_user:
                active_group_ids = GroupRequesterMember.objects.filter(
                    user=ordoc_user,
                    is_active=True,
                    group__status='active'
                ).values_list('group_id', flat=True)
            
            queryset = self.get_queryset().filter(
                group_assignee__in=active_group_ids
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
                {'detail': str(e)},
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
        
        from ordoc_flow.models import GroupRequesterMember
        from ordoc_flow.approval_models import ApprovalStepInstance

        # Helper to get user's groups
        ordoc_user = self.get_current_ordoc_user()
        user_groups_ids = GroupRequesterMember.objects.filter(user=ordoc_user).values_list('group_id', flat=True) if ordoc_user else []

        # Aprovações pendentes (assigned to user or their groups)
        # Using ApprovalStepInstance directly as it holds the assignment info
        pending_approvals = ApprovalStepInstance.objects.filter(
            status='pending',
            approval_instance__workflow__organization=organization
        ).filter(
            Q(assigned_to=ordoc_user) | 
            Q(approval_step__approver_group_id__in=user_groups_ids, assigned_to__isnull=True)
        ).count()
        
        # Tarefas em atraso (assigned to user or their groups)
        # Note: Internal users are assigned via group_assignee or created_by
        overdue_tasks = Task.objects.filter(
            procedure__organization=organization,
            deadline__lt=timezone.now().date(),
            status__in=['running', 'started']
        ).filter(
            Q(group_assignee_id__in=user_groups_ids) | Q(created_by=ordoc_user)
        ).count()
        
        # Atividades recentes (últimos 10 procedimentos criados)
        # Optimized with select_related to prevent N+1 when accessing created_by.user
        recent_procedures = Procedure.objects.filter(
            organization=organization
        ).select_related(
            'procedure_template',
            'requester',
            'created_by',
            'created_by__user',  # Prevent N+1 when accessing user details
            'organization'
        ).prefetch_related(
            'tasks'  # Prefetch tasks if serializer needs them
        ).order_by('-created_at')[:10]
        
        recent_activities = []
        for proc in recent_procedures:
            creator_name = proc.created_by.user.get_full_name() or proc.created_by.user.username if proc.created_by else 'Sistema'
            recent_activities.append({
                'id': proc.id,
                'type': 'procedure_created',
                'title': f'Procedimento {proc.process_number} criado',
                'description': f'{proc.procedure_template_name} por {creator_name}',
                'created_at': proc.created_at,
                'status': proc.status
            })
        
        # Team Stats for Widget
        team_stats = []
        if ordoc_user:
            # Get users in same organization
            from ordoc_cloud.models import UserOrganizationRole
            org_users_roles = UserOrganizationRole.objects.filter(
                organization=organization,
                role__in=['admin', 'manager', 'member'] # Filter relevant roles
            ).select_related('user__user')[:5] # Limit to 5 for widget

            for role_entry in org_users_roles:
                 u = role_entry.user
                 # Count overdue approvals
                 overdue_count = ApprovalStepInstance.objects.filter(
                    assigned_to=u,
                    status='pending',
                    due_date__lt=timezone.now()
                 ).count()
                 
                 status_text = "Tudo em dia"
                 status_color = "text-success"
                 if overdue_count > 0:
                     status_text = f"{overdue_count} tarefas atrasadas"
                     status_color = "text-destructive"
                
                 team_stats.append({
                     'name': u.user.get_full_name() or u.user.username,
                     'status': status_text,
                     'statusColor': status_color,
                     'avatar': u.avatar.url if u.avatar else None
                 })

        # --- Calculate Global Stats (Documents & Users) ---
        from ordoc_air.models import Document
        from datetime import timedelta
        
        # 1. Total Documents
        total_documents = Document.objects.filter(department__organization=organization).count()
        
        # Documents Change (last 30 days growth)
        last_30_days = timezone.now() - timedelta(days=30)
        new_docs_count = Document.objects.filter(
            department__organization=organization, 
            created_at__gte=last_30_days
        ).count()
        
        # Simplified change logic: just show how many new docs as percentage of total (growth)
        # or compare to previous month. For simplicity/speed:
        prev_docs_count = total_documents - new_docs_count
        if prev_docs_count > 0:
            doc_change_pct = (new_docs_count / prev_docs_count) * 100
            documents_change = f"+{int(doc_change_pct)}%"
        else:
            documents_change = "+100%" if total_documents > 0 else "+0%"

        # 2. Active Users
        # Count users with roles in this organization
        active_users = UserOrganizationRole.objects.filter(organization=organization).values('user').distinct().count()
        users_change = "+0%" # Placeholder, user growth is slow

        # 3. Approval Rate (Completed Procedures / Total Procedures)
        total_procs = procedure_stats.get('total', 0)
        completed_procs = procedure_stats.get('finished', 0)
        approval_rate = round((completed_procs / total_procs * 100), 1) if total_procs > 0 else 0.0
        approval_rate_change = "+0%" # Placeholder

        dashboard_data = {
            'total_documents': total_documents,
            'active_users': active_users,
            'approval_rate': approval_rate,
            'documents_change': documents_change,
            'users_change': users_change,
            'procedures_change': "+0%", # Placeholder
            'approval_rate_change': approval_rate_change,
            
            'procedure_stats': procedure_stats,
            'task_stats': task_stats,
            'pending_approvals': pending_approvals,
            'overdue_tasks': overdue_tasks,
            'recent_activities': recent_activities,
            'team_stats': team_stats
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


# ViewSets para Documentos e Anexos

class ProcedureDocumentViewSet(BaseViewSet):
    """
    ViewSet para gerenciar documentos de procedimentos.
    """

    queryset = ProcedureDocument.objects.all()
    serializer_class = ProcedureDocumentSerializer
    search_fields = ['name', 'description', 'file_name']
    ordering_fields = ['name', 'created_at', 'document_type']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.select_related(
            'procedure__organization', 'uploaded_by', 'parent_document'
        ).filter(
            procedure__organization=self.get_current_organization(),
            deleted_at__isnull=True
        )

        # Filtro por procedimento
        procedure_id = self.request.query_params.get('procedure')
        if procedure_id:
            queryset = queryset.filter(procedure_id=procedure_id)

        # Filtro por tipo de documento
        document_type = self.request.query_params.get('document_type')
        if document_type:
            queryset = queryset.filter(document_type=document_type)

        # Filtro por versão atual
        current_only = self.request.query_params.get('current_only', 'true')
        if current_only.lower() == 'true':
            queryset = queryset.filter(is_current=True)

        return queryset

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload de novo documento"""
        serializer = ProcedureDocumentUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        procedure_id = request.data.get('procedure')
        if not procedure_id:
            return Response(
                {'error': 'procedure é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            procedure = Procedure.objects.get(
                id=procedure_id,
                organization=self.get_current_organization()
            )

            file = serializer.validated_data['file']
            document = ProcedureDocument.objects.create(
                procedure=procedure,
                file=file,
                file_name=file.name,
                file_size=file.size,
                file_type=file.content_type if hasattr(file, 'content_type') else '',
                name=serializer.validated_data.get('name', file.name),
                description=serializer.validated_data.get('description', ''),
                document_type=serializer.validated_data.get('document_type', 'attachment'),
                uploaded_by=self.get_current_user()
            )

            # Registra no histórico
            WorkflowHistory.log_action(
                obj=procedure,
                action='document_added',
                description=f'Documento "{document.name}" adicionado',
                performed_by=self.get_current_user(),
                new_value={'document_id': str(document.id), 'document_name': document.name},
                request=request
            )

            return Response(
                ProcedureDocumentSerializer(document, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )

        except Procedure.DoesNotExist:
            return Response(
                {'error': 'Procedimento não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def new_version(self, request, pk=None):
        """Cria nova versão de um documento"""
        document = self.get_object()
        file = request.FILES.get('file')

        if not file:
            return Response(
                {'error': 'Arquivo é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_doc = document.create_new_version(
            new_file=file,
            uploaded_by=self.get_current_user()
        )

        # Registra no histórico
        WorkflowHistory.log_action(
            obj=document.procedure,
            action='document_added',
            description=f'Nova versão do documento "{new_doc.name}" (v{new_doc.version})',
            performed_by=self.get_current_user(),
            old_value={'version': document.version},
            new_value={'version': new_doc.version, 'document_id': str(new_doc.id)},
            request=request
        )

        return Response(
            ProcedureDocumentSerializer(new_doc, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def versions(self, request, pk=None):
        """Lista todas as versões de um documento"""
        document = self.get_object()

        if document.parent_document:
            root_document = document.parent_document
        else:
            root_document = document

        # Lista todas as versões
        versions = ProcedureDocument.objects.filter(
            Q(id=root_document.id) | Q(parent_document=root_document)
        ).order_by('-version')

        serializer = ProcedureDocumentSerializer(
            versions, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def soft_delete(self, request, pk=None):
        """Soft delete de documento"""
        document = self.get_object()
        document.soft_delete()

        # Registra no histórico
        WorkflowHistory.log_action(
            obj=document.procedure,
            action='document_removed',
            description=f'Documento "{document.name}" removido',
            performed_by=self.get_current_user(),
            old_value={'document_id': str(document.id), 'document_name': document.name},
            request=request
        )

        return Response({'message': 'Documento removido com sucesso'})


class TaskAttachmentViewSet(BaseViewSet):
    """
    ViewSet para gerenciar anexos de tarefas.
    """

    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    search_fields = ['name', 'description', 'file_name']
    ordering_fields = ['name', 'created_at', 'attachment_type']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.select_related(
            'task__procedure__organization', 'uploaded_by'
        ).filter(
            task__procedure__organization=self.get_current_organization(),
            deleted_at__isnull=True
        )

        # Filtro por tarefa
        task_id = self.request.query_params.get('task')
        if task_id:
            queryset = queryset.filter(task_id=task_id)

        # Filtro por tipo de anexo
        attachment_type = self.request.query_params.get('attachment_type')
        if attachment_type:
            queryset = queryset.filter(attachment_type=attachment_type)

        return queryset

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload de novo anexo"""
        serializer = TaskAttachmentUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        task_id = request.data.get('task')
        if not task_id:
            return Response(
                {'error': 'task é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            task = Task.objects.get(
                id=task_id,
                procedure__organization=self.get_current_organization()
            )

            file = serializer.validated_data['file']
            attachment = TaskAttachment.objects.create(
                task=task,
                file=file,
                file_name=file.name,
                file_size=file.size,
                file_type=file.content_type if hasattr(file, 'content_type') else '',
                name=serializer.validated_data.get('name', file.name),
                description=serializer.validated_data.get('description', ''),
                uploaded_by=self.get_current_user()
            )

            # Registra no histórico
            WorkflowHistory.log_action(
                obj=task,
                action='document_added',
                description=f'Anexo "{attachment.name}" adicionado à tarefa',
                performed_by=self.get_current_user(),
                new_value={'attachment_id': str(attachment.id), 'attachment_name': attachment.name},
                request=request
            )

            return Response(
                TaskAttachmentSerializer(attachment, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )

        except Task.DoesNotExist:
            return Response(
                {'error': 'Tarefa não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['delete'])
    def soft_delete(self, request, pk=None):
        """Soft delete de anexo"""
        attachment = self.get_object()
        attachment.soft_delete()

        # Registra no histórico
        WorkflowHistory.log_action(
            obj=attachment.task,
            action='document_removed',
            description=f'Anexo "{attachment.name}" removido da tarefa',
            performed_by=self.get_current_user(),
            old_value={'attachment_id': str(attachment.id), 'attachment_name': attachment.name},
            request=request
        )

        return Response({'message': 'Anexo removido com sucesso'})


class WorkflowHistoryViewSet(BaseViewSet):
    """
    ViewSet para consultar o histórico de ações do workflow.
    """

    queryset = WorkflowHistory.objects.all()
    serializer_class = WorkflowHistorySerializer
    ordering_fields = ['created_at', 'action']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.select_related(
            'performed_by', 'external_performed_by', 'content_type'
        )

        # Filtro por tipo de objeto
        content_type = self.request.query_params.get('content_type')
        if content_type:
            try:
                ct = ContentType.objects.get(model=content_type)
                queryset = queryset.filter(content_type=ct)
            except ContentType.DoesNotExist:
                pass

        # Filtro por ID do objeto
        object_id = self.request.query_params.get('object_id')
        if object_id:
            queryset = queryset.filter(object_id=object_id)

        # Filtro por ação
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)

        # Filtro por usuário
        performed_by = self.request.query_params.get('performed_by')
        if performed_by:
            queryset = queryset.filter(performed_by_id=performed_by)

        # Filtro por data
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)

        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        return queryset

    @action(detail=False, methods=['get'])
    def procedure_history(self, request):
        """Histórico de um procedimento específico"""
        procedure_id = request.query_params.get('procedure_id')
        if not procedure_id:
            return Response(
                {'error': 'procedure_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ct = ContentType.objects.get_for_model(Procedure)
        queryset = self.get_queryset().filter(
            content_type=ct,
            object_id=procedure_id
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def task_history(self, request):
        """Histórico de uma tarefa específica"""
        task_id = request.query_params.get('task_id')
        if not task_id:
            return Response(
                {'error': 'task_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ct = ContentType.objects.get_for_model(Task)
        queryset = self.get_queryset().filter(
            content_type=ct,
            object_id=task_id
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
