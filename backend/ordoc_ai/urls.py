"""
URL configuration for ordoc_ai project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .auth_views import login, logout, refresh_token, me, change_password, validate_password_strength, password_requirements
from .registration_views import register_user, register_external_requester, check_email, create_demo_organization

# Create API router
api_router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication endpoints
    path('api/auth/', include([
        path('login/', login, name='auth_login'),
        path('logout/', logout, name='auth_logout'),
        path('refresh/', refresh_token, name='auth_refresh'),
        path('me/', me, name='auth_me'),
        path('change-password/', change_password, name='auth_change_password'),
        path('validate-password/', validate_password_strength, name='auth_validate_password'),
        path('password-requirements/', password_requirements, name='auth_password_requirements'),
        path('register/', register_user, name='auth_register'),
        path('register-external/', register_external_requester, name='auth_register_external'),
        path('check-email/', check_email, name='auth_check_email'),
        path('create-demo-org/', create_demo_organization, name='auth_create_demo_org'),
    ])),
    
    # API Routes
    path('api/v1/', include([
        # Main modules
        path('ordoc-air/', include('ordoc_air.urls')),
        path('ordoc-flow/', include('ordoc_flow.urls')),
        path('ordoc-cloud/', include('ordoc_cloud.urls')),
        path('ordoc-sign/', include('ordoc_sign.urls')),
        path('ordoc-reports/', include('ordoc_reports.urls')),
    ])),
    
    # API v2 (for backward compatibility)
    path('api/v2/', include([
        path('ordoc-air/', include(('ordoc_air.urls', 'ordoc_air'), namespace='ordoc_air_v2')),
        path('ordoc-flow/', include(('ordoc_flow.urls', 'ordoc_flow'), namespace='ordoc_flow_v2')),
        path('ordoc-cloud/', include(('ordoc_cloud.urls', 'ordoc_cloud'), namespace='ordoc_cloud_v2')),
        path('ordoc-sign/', include(('ordoc_sign.urls', 'ordoc_sign'), namespace='ordoc_sign_v2')),
        path('ordoc-reports/', include(('ordoc_reports.urls', 'ordoc_reports'), namespace='ordoc_reports_v2')),
    ])),
    
    # API v3 (latest)
    path('api/v3/', include([
        path('ordoc-air/', include(('ordoc_air.urls', 'ordoc_air'), namespace='ordoc_air_v3')),
        path('ordoc-flow/', include(('ordoc_flow.urls', 'ordoc_flow'), namespace='ordoc_flow_v3')),
        path('ordoc-cloud/', include(('ordoc_cloud.urls', 'ordoc_cloud'), namespace='ordoc_cloud_v3')),
        path('ordoc-sign/', include(('ordoc_sign.urls', 'ordoc_sign'), namespace='ordoc_sign_v3')),
        path('ordoc-reports/', include(('ordoc_reports.urls', 'ordoc_reports'), namespace='ordoc_reports_v3')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
