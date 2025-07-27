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
# router.register(r'organizations', views.OrganizationViewSet)
# router.register(r'themes', views.ThemeViewSet)

app_name = 'ordoc_cloud'

urlpatterns = [
    path('', include(router.urls)),
    # Additional custom endpoints can be added here
]
