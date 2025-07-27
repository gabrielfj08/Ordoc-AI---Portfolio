"""
URLs for OrdocSign - Digital Signature Module
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Criar router para ViewSets
router = DefaultRouter()

# Registrar ViewSets
router.register(r'certificates', views.DigitalCertificateViewSet, basename='digitalcertificate')
router.register(r'templates', views.SignatureTemplateViewSet, basename='signaturetemplate')
router.register(r'requests', views.SignatureRequestViewSet, basename='signaturerequest')
router.register(r'signers', views.SignatureRequestSignerViewSet, basename='signaturerequestsigner')
router.register(r'signatures', views.DocumentSignatureViewSet, basename='documentsignature')
router.register(r'batches', views.SignatureBatchViewSet, basename='signaturebatch')
router.register(r'audit-logs', views.SignatureAuditLogViewSet, basename='signatureauditlog')

app_name = 'ordoc_sign'

urlpatterns = [
    # Incluir rotas do router
    path('api/', include(router.urls)),
    # Additional custom endpoints can be added here
]
