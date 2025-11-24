"""
URLs for OrdocFlow - Workflow Management Module
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExternalRequesterViewSet, GroupRequesterViewSet, ProcedureTemplateViewSet,
    ProcedureViewSet, TaskViewSet, WorkflowDashboardViewSet, BatchOperationViewSet,
    ApprovalWorkflowViewSet, ApprovalInstanceViewSet, NotificationTemplateViewSet,
    NotificationLogViewSet, WorkflowRequestViewSet, WorkflowSearchViewSet,
    WorkflowAnalyticsViewSet
)
from .external_views import (
    ExternalProcedureViewSet, ExternalProcedureTemplateViewSet, ExternalTaskViewSet
)

# Router principal para as APIs REST
router = DefaultRouter()

# Registro dos ViewSets principais
router.register(r'external-requesters', ExternalRequesterViewSet, basename='external-requester')
router.register(r'group-requesters', GroupRequesterViewSet, basename='group-requester')
router.register(r'procedure-templates', ProcedureTemplateViewSet, basename='procedure-template')
router.register(r'procedures', ProcedureViewSet, basename='procedure')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'workflow-requests', WorkflowRequestViewSet, basename='workflow-request')

# ViewSets para sistema de aprovação
router.register(r'approval-workflows', ApprovalWorkflowViewSet, basename='approval-workflow')
router.register(r'approval-instances', ApprovalInstanceViewSet, basename='approval-instance')

# ViewSets para sistema de notificações
router.register(r'notification-templates', NotificationTemplateViewSet, basename='notification-template')
router.register(r'notification-logs', NotificationLogViewSet, basename='notification-log')

# ViewSets especiais
router.register(r'dashboard', WorkflowDashboardViewSet, basename='workflow-dashboard')
router.register(r'batch-operations', BatchOperationViewSet, basename='batch-operation')
router.register(r'search', WorkflowSearchViewSet, basename='workflow-search')
router.register(r'analytics', WorkflowAnalyticsViewSet, basename='workflow-analytics')

app_name = 'ordoc_flow'

urlpatterns = [
    # APIs REST
    path('api/', include(router.urls)),
    
    # APIs específicas para usuários externos (OrdocCidadao)
    path('api/external/', include([
        path('procedures/', ExternalProcedureViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }), name='external-procedure-list'),
        path('procedures/<uuid:pk>/', ExternalProcedureViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update'
        }), name='external-procedure-detail'),
        path('procedures/<uuid:pk>/run/', ExternalProcedureViewSet.as_view({
            'post': 'run'
        }), name='external-procedure-run'),
        path('procedures/<uuid:pk>/request_finish/', ExternalProcedureViewSet.as_view({
            'post': 'request_finish'
        }), name='external-procedure-request-finish'),
        path('procedures/<uuid:pk>/report/', ExternalProcedureViewSet.as_view({
            'get': 'report'
        }), name='external-procedure-report'),
        
        path('procedure-templates/', ExternalProcedureTemplateViewSet.as_view({
            'get': 'list'
        }), name='external-procedure-template-list'),
        path('procedure-templates/<uuid:pk>/', ExternalProcedureTemplateViewSet.as_view({
            'get': 'retrieve'
        }), name='external-procedure-template-detail'),
        
        path('tasks/', ExternalTaskViewSet.as_view({
            'get': 'list'
        }), name='external-task-list'),
        path('tasks/<uuid:pk>/', ExternalTaskViewSet.as_view({
            'get': 'retrieve'
        }), name='external-task-detail'),
        path('tasks/<uuid:pk>/complete/', ExternalTaskViewSet.as_view({
            'post': 'complete'
        }), name='external-task-complete'),
        path('tasks/<uuid:pk>/accept/', ExternalTaskViewSet.as_view({
            'post': 'accept'
        }), name='external-task-accept'),
        path('tasks/<uuid:pk>/refuse/', ExternalTaskViewSet.as_view({
            'post': 'refuse'
        }), name='external-task-refuse'),
        path('tasks/<uuid:pk>/finish/', ExternalTaskViewSet.as_view({
            'post': 'finish'
        }), name='external-task-finish'),
    ])),
    
    # URLs customizadas adicionais se necessário
    # path('api/custom-endpoint/', custom_view, name='custom-endpoint'),
]
