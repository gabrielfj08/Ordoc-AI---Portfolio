"""
Views específicas para usuários externos do OrdocCidadao.
Essas views implementam endpoints que correspondem às chamadas do frontend.
"""
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
    ExternalRequester, Procedure, ProcedureTemplate, Task, Field
)
from .serializers import (
    ExternalRequesterSerializer, ProcedureSerializer, 
    ProcedureTemplateSerializer, TaskSerializer
)
from .filters import (
    ProcedureFilter, TaskFilter
)


class ExternalProcedureViewSet(BaseViewSet):
    """
    ViewSet para procedimentos acessados por usuários externos.
    Corresponde aos endpoints /external/procedures/ chamados pelo frontend.
    """
    
    queryset = Procedure.objects.all()
    serializer_class = ProcedureSerializer
    filterset_class = ProcedureFilter
    search_fields = ['process_number', 'procedure_template_name']
    ordering_fields = ['process_number', 'created_at', 'deadline']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filtra procedimentos baseado no usuário externo logado.
        """
        queryset = super().get_queryset()
        
        # Obtém o usuário atual
        current_user = self.get_current_user()
        organization = self.get_current_organization()
        
        # Se é um usuário externo, filtra apenas seus procedimentos
        if hasattr(current_user, 'external_requester'):
            external_requester = current_user.external_requester
            queryset = queryset.filter(
                requester=external_requester,
                organization=organization
            )
        else:
            # Se é usuário interno, mostra todos os procedimentos externos
            queryset = queryset.filter(
                source='external',
                organization=organization
            )
        
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
        )
    
    def create(self, request, *args, **kwargs):
        """
        Cria um novo procedimento externo.
        Espera: { "procedureTemplateId": <id_do_template> }
        """
        procedure_template_id = request.data.get('procedureTemplateId')
        
        if not procedure_template_id:
            return Response(
                {'error': 'procedureTemplateId é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Busca o template de procedimento
            procedure_template = ProcedureTemplate.objects.get(
                id=procedure_template_id,
                organization=self.get_current_organization(),
                status='active'
            )
            
            # Verifica se o template permite criação externa
            if procedure_template.source not in ['external', 'internal_external']:
                return Response(
                    {'error': 'Template não permite criação externa'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Obtém o usuário externo
            current_user = self.get_current_user()
            if not hasattr(current_user, 'external_requester'):
                return Response(
                    {'error': 'Acesso negado: usuário não é externo'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            external_requester = current_user.external_requester
            
            # Cria o procedimento
            with transaction.atomic():
                procedure = Procedure.objects.create(
                    procedure_template=procedure_template,
                    procedure_template_name=procedure_template.name,
                    source='external',
                    priority='normal',
                    requester=external_requester,
                    responsible_group=procedure_template.group_requester,
                    created_by=current_user,
                    organization=self.get_current_organization(),
                    schema=procedure_template.schema
                )
            
            serializer = self.get_serializer(procedure)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ProcedureTemplate.DoesNotExist:
            return Response(
                {'error': 'Template de procedimento não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, *args, **kwargs):
        """
        Atualiza um procedimento existente com novos dados de campos.
        """
        procedure = self.get_object()
        
        # Verifica se o usuário pode editar este procedimento
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Atualiza o payload com os novos dados
        if 'payload' in request.data:
            procedure.payload = request.data['payload']
            procedure.save()
        
        # Outros campos podem ser atualizados conforme necessário
        return super().update(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        """
        Executa um procedimento externo.
        """
        procedure = self.get_object()
        
        # Verifica permissão
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            procedure.run()
            procedure.save()
            
            serializer = self.get_serializer(procedure)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def request_finish(self, request, pk=None):
        """
        Solicita finalização de um procedimento.
        Usado quando o usuário externo quer marcar o procedimento como completo.
        """
        procedure = self.get_object()
        note = request.data.get('note', '')
        
        # Verifica permissão
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            # Adiciona uma nota de solicitação de finalização
            from .approval_models import JustificationNote
            
            JustificationNote.objects.create(
                content_type=ContentType.objects.get_for_model(Procedure),
                object_id=procedure.id,
                note=note or 'Solicitação de finalização pelo usuário externo',
                created_by=current_user,
                organization=self.get_current_organization()
            )
            
            # Muda status para 'started' se ainda não estiver
            if procedure.status == 'draft' or procedure.status == 'running':
                procedure.start()
                procedure.save()
            
            serializer = self.get_serializer(procedure)
            return Response({
                'message': 'Solicitação de finalização enviada com sucesso',
                'procedure': serializer.data
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def report(self, request, pk=None):
        """
        Gera relatório do procedimento em PDF.
        """
        procedure = self.get_object()
        
        # Verifica permissão
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            # Aqui você implementaria a geração do relatório
            # Por enquanto, retorna um erro informativo
            return Response(
                {'error': 'Geração de relatório não implementada ainda'},
                status=status.HTTP_501_NOT_IMPLEMENTED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ExternalProcedureTemplateViewSet(BaseViewSet):
    """
    ViewSet para templates de procedimentos disponíveis para usuários externos.
    """
    
    queryset = ProcedureTemplate.objects.all()
    serializer_class = ProcedureTemplateSerializer
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        """
        Retorna apenas templates que permitem criação externa.
        """
        return super().get_queryset().filter(
            organization=self.get_current_organization(),
            status='active',
            source__in=['external', 'internal_external']
        ).select_related('organization', 'group_requester').prefetch_related('fields')


class ExternalTaskViewSet(BaseViewSet):
    """
    ViewSet para tarefas relacionadas a procedimentos de usuários externos.
    """
    
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_class = TaskFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'deadline', 'priority']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filtra tarefas baseado no usuário externo logado.
        """
        queryset = super().get_queryset()
        
        # Obtém o usuário atual
        current_user = self.get_current_user()
        organization = self.get_current_organization()
        
        # Se é um usuário externo, filtra apenas tarefas de seus procedimentos
        if hasattr(current_user, 'external_requester'):
            external_requester = current_user.external_requester
            queryset = queryset.filter(
                procedure__requester=external_requester,
                procedure__organization=organization
            )
        else:
            # Se é usuário interno, mostra todas as tarefas de procedimentos externos
            queryset = queryset.filter(
                procedure__source='external',
                procedure__organization=organization
            )
        
        return queryset.select_related(
            'procedure__organization', 'procedure__procedure_template',
            'assignee', 'group_assignee', 'created_by', 'task_template'
        ).prefetch_related(
            'task_comments__created_by',
            'task_fields'
        )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Marca uma tarefa como completa."""
        task = self.get_object()
        
        # Verifica permissão
        current_user = self.get_current_user() 
        if hasattr(current_user, 'external_requester'):
            if task.procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            task.finish()
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Aceita uma tarefa."""
        task = self.get_object()
        
        # Verifica permissão
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if task.procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            task.start()
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def refuse(self, request, pk=None):
        """Recusa uma tarefa."""
        task = self.get_object()
        
        # Verifica permissão
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if task.procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            task.refuse()
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def finish(self, request, pk=None):
        """Finaliza uma tarefa."""
        task = self.get_object()
        
        # Verifica permissão
        current_user = self.get_current_user()
        if hasattr(current_user, 'external_requester'):
            if task.procedure.requester != current_user.external_requester:
                return Response(
                    {'error': 'Acesso negado'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            task.finish()
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
