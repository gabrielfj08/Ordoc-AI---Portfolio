"""
URL Configuration para OrdocIntegrations

Endpoints REST para integrações externas
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    IntegrationServiceViewSet,
    IntegrationRequestViewSet,
    IntegrationCacheViewSet,
    IntegrationExecuteViewSet,
    GovBrAuthViewSet,
)

app_name = 'ordoc_integrations'

# Router DRF
router = DefaultRouter()
router.register(r'services', IntegrationServiceViewSet, basename='integration-service')
router.register(r'requests', IntegrationRequestViewSet, basename='integration-request')
router.register(r'cache', IntegrationCacheViewSet, basename='integration-cache')
router.register(r'execute', IntegrationExecuteViewSet, basename='integration-execute')
router.register(r'auth/govbr', GovBrAuthViewSet, basename='govbr-auth')

urlpatterns = [
    path('', include(router.urls)),
]

"""
Endpoints disponíveis:

GET    /api/integrations/services/                      - Lista serviços
POST   /api/integrations/services/                      - Cria serviço (admin)
GET    /api/integrations/services/{id}/                 - Detalha serviço
PUT    /api/integrations/services/{id}/                 - Atualiza serviço (admin)
DELETE /api/integrations/services/{id}/                 - Remove serviço (admin)
GET    /api/integrations/services/{id}/stats/           - Estatísticas do serviço
POST   /api/integrations/services/{id}/toggle_status/   - Ativa/desativa serviço

GET    /api/integrations/requests/                      - Lista requisições
GET    /api/integrations/requests/{id}/                 - Detalha requisição
GET    /api/integrations/requests/my_requests/          - Minhas requisições
GET    /api/integrations/requests/recent/               - Requisições recentes (24h)
GET    /api/integrations/requests/failed/               - Requisições que falharam

GET    /api/integrations/cache/                         - Lista cache
GET    /api/integrations/cache/{id}/                    - Detalha cache
POST   /api/integrations/cache/clear_expired/           - Remove cache expirado
POST   /api/integrations/cache/invalidate/              - Invalida cache

POST   /api/integrations/execute/execute/               - Executa integração genérica
POST   /api/integrations/execute/validate-cpf/          - Valida CPF
POST   /api/integrations/execute/validate-cnpj/         - Valida CNPJ
POST   /api/integrations/execute/check-credit/          - Consulta crédito

GET    /api/integrations/auth/govbr/login/              - Inicia login Gov.br
GET    /api/integrations/auth/govbr/callback/           - Callback login Gov.br
"""
