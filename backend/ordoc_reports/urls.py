"""
URLs for OrdocReports - Reports and Analytics Module
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para as APIs REST
router = DefaultRouter()

# Registra os ViewSets
router.register(r'templates', views.ReportTemplateViewSet, basename='reporttemplate')
router.register(r'reports', views.ReportViewSet, basename='report')
router.register(r'schedules', views.ReportScheduleViewSet, basename='reportschedule')
router.register(r'shares', views.ReportShareViewSet, basename='reportshare')
router.register(r'metrics', views.ReportMetricViewSet, basename='reportmetric')

app_name = 'ordoc_reports'

urlpatterns = [
    # APIs REST
    path('api/', include(router.urls)),
    
    # URLs específicas para acesso público
    path('shared/<str:token>/', views.ReportShareViewSet.as_view({'get': 'public_access'}), name='public-report-access'),
]
