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
    
    # URLs customizadas adicionais se necessário
    # path('api/custom-endpoint/', custom_view, name='custom-endpoint'),
]
