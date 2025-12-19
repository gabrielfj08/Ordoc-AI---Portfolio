"""
DRF ViewSets para OrdocIntegrations

API REST para gerenciamento de integrações
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q, Count, Avg, Sum
from datetime import timedelta

from .models import IntegrationService, IntegrationRequest, IntegrationCache
from .serializers import (
    IntegrationServiceSerializer,
    IntegrationServiceListSerializer,
    IntegrationRequestSerializer,
    IntegrationRequestListSerializer,
    IntegrationCacheSerializer,
    IntegrationCacheListSerializer,
    IntegrationExecuteSerializer,
    IntegrationExecuteResponseSerializer,
    CPFValidationSerializer,
    CNPJValidationSerializer,
    CreditCheckSerializer,
)
from .services.base import IntegrationException


class IntegrationServiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de serviços de integração

    list: Lista todos os serviços de integração
    retrieve: Detalha um serviço específico
    create: Cria novo serviço (admin only)
    update: Atualiza serviço (admin only)
    destroy: Remove serviço (admin only)
    stats: Estatísticas do serviço
    test_connection: Testa conexão com o serviço
    """

    queryset = IntegrationService.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['service_type', 'status', 'is_enabled']
    search_fields = ['name', 'description', 'service_type']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['name']

    def get_serializer_class(self):
        """Retorna serializer apropriado para a action"""
        if self.action == 'list':
            return IntegrationServiceListSerializer
        return IntegrationServiceSerializer

    def get_queryset(self):
        """Filtra serviços por organização se não for admin"""
        queryset = super().get_queryset()

        # Se não for staff, mostrar apenas serviços ativos
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                status=IntegrationService.ServiceStatus.ACTIVE,
                is_enabled=True
            )

        return queryset

    def perform_create(self, serializer):
        """Define usuário criador ao criar serviço"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        Retorna estatísticas do serviço

        Métricas:
        - Total de requisições
        - Taxa de sucesso
        - Tempo médio de execução
        - Requisições por período
        """
        service = self.get_object()

        # Período (últimos 30 dias por padrão)
        days = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)

        requests_qs = IntegrationRequest.objects.filter(
            service=service,
            created_at__gte=since
        )

        # Métricas
        total_requests = requests_qs.count()
        successful_requests = requests_qs.filter(
            status__in=['success', 'cached']
        ).count()
        failed_requests = requests_qs.filter(status='failed').count()
        cached_requests = requests_qs.filter(from_cache=True).count()

        avg_execution_time = requests_qs.filter(
            execution_time_ms__isnull=False
        ).aggregate(avg=Avg('execution_time_ms'))['avg'] or 0

        # Taxa de sucesso
        success_rate = (successful_requests / total_requests * 100) if total_requests > 0 else 0
        cache_hit_rate = (cached_requests / total_requests * 100) if total_requests > 0 else 0

        # Requisições por tipo
        requests_by_type = requests_qs.values('request_type').annotate(
            count=Count('id')
        ).order_by('-count')[:10]

        # Requisições por status
        requests_by_status = requests_qs.values('status').annotate(
            count=Count('id')
        )

        return Response({
            'service': {
                'id': service.id,
                'name': service.name,
                'service_type': service.service_type,
                'status': service.status,
            },
            'period': {
                'days': days,
                'since': since,
            },
            'metrics': {
                'total_requests': total_requests,
                'successful_requests': successful_requests,
                'failed_requests': failed_requests,
                'cached_requests': cached_requests,
                'success_rate': round(success_rate, 2),
                'cache_hit_rate': round(cache_hit_rate, 2),
                'avg_execution_time_ms': round(avg_execution_time, 2),
            },
            'requests_by_type': list(requests_by_type),
            'requests_by_status': list(requests_by_status),
        })

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Ativa/desativa um serviço"""
        service = self.get_object()
        service.is_enabled = not service.is_enabled
        service.save(update_fields=['is_enabled'])

        return Response({
            'message': f"Serviço {'ativado' if service.is_enabled else 'desativado'} com sucesso",
            'is_enabled': service.is_enabled,
        })


class IntegrationRequestViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para visualização de requisições de integração

    list: Lista todas as requisições
    retrieve: Detalha uma requisição específica
    my_requests: Lista requisições do usuário logado
    recent: Requisições recentes
    failed: Requisições que falharam
    """

    queryset = IntegrationRequest.objects.select_related(
        'service', 'user', 'organization'
    ).all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['service', 'status', 'request_type', 'from_cache', 'organization']
    search_fields = ['request_identifier', 'request_type']
    ordering_fields = ['created_at', 'completed_at', 'execution_time_ms']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Retorna serializer apropriado para a action"""
        if self.action == 'list':
            return IntegrationRequestListSerializer
        return IntegrationRequestSerializer

    def get_queryset(self):
        """Filtra requisições por organização do usuário"""
        queryset = super().get_queryset()

        # Se não for staff, filtrar por organização do usuário
        if not self.request.user.is_staff:
            # Assumindo que o usuário tem um campo organization
            if hasattr(self.request.user, 'organization'):
                queryset = queryset.filter(
                    organization=self.request.user.organization
                )

        return queryset

    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Lista requisições do usuário logado"""
        queryset = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Requisições recentes (últimas 24h)"""
        since = timezone.now() - timedelta(hours=24)
        queryset = self.get_queryset().filter(created_at__gte=since)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def failed(self, request):
        """Requisições que falharam"""
        queryset = self.get_queryset().filter(
            status__in=['failed', 'timeout', 'rate_limited']
        )
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class IntegrationCacheViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para visualização de cache de integrações

    list: Lista entradas de cache
    retrieve: Detalha uma entrada específica
    clear: Limpa cache expirado
    invalidate: Invalida cache de um identificador
    """

    queryset = IntegrationCache.objects.select_related('service').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['service', 'request_type']
    search_fields = ['identifier', 'cache_key']
    ordering_fields = ['created_at', 'expires_at', 'hits']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Retorna serializer apropriado para a action"""
        if self.action == 'list':
            return IntegrationCacheListSerializer
        return IntegrationCacheSerializer

    @action(detail=False, methods=['post'])
    def clear_expired(self, request):
        """Remove entradas de cache expiradas"""
        deleted_count, _ = IntegrationCache.objects.filter(
            expires_at__lt=timezone.now()
        ).delete()

        return Response({
            'message': f'{deleted_count} entradas de cache removidas',
            'deleted_count': deleted_count,
        })

    @action(detail=False, methods=['post'])
    def invalidate(self, request):
        """
        Invalida cache de um identificador específico

        Body: {"service_type": "receita_federal", "identifier": "12345678900"}
        """
        service_type = request.data.get('service_type')
        identifier = request.data.get('identifier')

        if not service_type or not identifier:
            return Response(
                {'error': 'service_type e identifier são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            service = IntegrationService.objects.get(service_type=service_type)
            deleted_count, _ = IntegrationCache.objects.filter(
                service=service,
                identifier=identifier
            ).delete()

            return Response({
                'message': f'Cache invalidado para {identifier}',
                'deleted_count': deleted_count,
            })

        except IntegrationService.DoesNotExist:
            return Response(
                {'error': f'Serviço {service_type} não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )


class IntegrationExecuteViewSet(viewsets.ViewSet):
    """
    ViewSet para executar integrações

    execute: Executa uma integração genérica
    validate_cpf: Valida CPF via Receita Federal
    validate_cnpj: Valida CNPJ via Receita Federal
    check_credit: Consulta crédito via SERASA
    """

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def execute(self, request):
        """
        Executa uma integração genérica

        Body: {
            "service_type": "receita_federal",
            "identifier": "12345678900",
            "request_type": "validate_cpf",
            "params": {},
            "force_refresh": false
        }
        """
        serializer = IntegrationExecuteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        try:
            # Importar o serviço apropriado
            # TODO: Implementar factory pattern para instanciar serviço correto
            # Por enquanto, retornar mensagem de não implementado

            return Response({
                'error': 'Integração ainda não implementada. Use endpoints específicos.',
                'available_endpoints': [
                    '/api/integrations/execute/validate_cpf/',
                    '/api/integrations/execute/validate_cnpj/',
                    '/api/integrations/execute/check_credit/',
                ]
            }, status=status.HTTP_501_NOT_IMPLEMENTED)

        except IntegrationException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'], url_path='validate-cpf')
    def validate_cpf(self, request):
        """
        Valida CPF via Receita Federal

        Body: {"cpf": "123.456.789-00"}
        """
        serializer = CPFValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: Implementar validação real
        return Response({
            'message': 'Validação de CPF ainda não implementada',
            'cpf': serializer.validated_data['cpf'],
        }, status=status.HTTP_501_NOT_IMPLEMENTED)

    @action(detail=False, methods=['post'], url_path='validate-cnpj')
    def validate_cnpj(self, request):
        """
        Valida CNPJ via Receita Federal

        Body: {"cnpj": "00.000.000/0000-00"}
        """
        serializer = CNPJValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: Implementar validação real
        return Response({
            'message': 'Validação de CNPJ ainda não implementada',
            'cnpj': serializer.validated_data['cnpj'],
        }, status=status.HTTP_501_NOT_IMPLEMENTED)

    @action(detail=False, methods=['post'], url_path='check-credit')
    def check_credit(self, request):
        """
        Consulta crédito via SERASA

        Body: {
            "cpf": "123.456.789-00",
            "include_score": true,
            "include_protests": true,
            "include_debts": true
        }
        """
        serializer = CreditCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: Implementar consulta real
        return Response({
            'message': 'Consulta de crédito ainda não implementada',
            'cpf': serializer.validated_data['cpf'],
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
