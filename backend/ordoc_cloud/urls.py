"""
URLs for OrdocCloud - Configuration and Settings Module
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.OrdocUserViewSet)
router.register(r'user-groups', views.UserGroupViewSet)
router.register(r'policies', views.PolicyViewSet)
router.register(r'roles', views.UserOrganizationRoleViewSet)
router.register(r'audit-logs', views.AuditLogViewSet)

# LGPD Compliance
router.register(r'lgpd/data-mappings', views.PersonalDataMappingViewSet, basename='personaldatamapping')
router.register(r'lgpd/data-requests', views.DataSubjectRequestViewSet, basename='datasubjectrequest')
router.register(r'lgpd/consents', views.ConsentRecordViewSet, basename='consentrecord')

app_name = 'ordoc_cloud'

urlpatterns = [
    path('', include(router.urls)),
]
