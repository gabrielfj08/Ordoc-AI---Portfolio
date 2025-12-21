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

from .models import IntegrationService, IntegrationRequest, IntegrationCache, GovBrProfile
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
from .services.govbr import GovBrService
from django.contrib.auth import login
from django.shortcuts import redirect
from django.conf import settings
import secrets


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
        
        cnpj = serializer.validated_data['cnpj']
        
        try:
            from .services.receita_federal import ReceitaFederalService
            
            # Pass user context for logging and request tracking
            organization_id = getattr(request.current_organization, 'id', None) if hasattr(request, 'current_organization') else None
            # Fallback to user's organization if current_organization not present in request (e.g. usage outside middleware scope)
            if not organization_id and hasattr(request.user, 'organization_id'):
                 organization_id = request.user.organization_id

            service = ReceitaFederalService(
                organization_id=organization_id,
                user_id=request.user.id
            )
            data = service.get_company_data(cnpj)
            
            if not data:
                return Response(
                    {'error': 'CNPJ not found or service unavailable'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
            return Response(data)
            
        except IntegrationException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f"Internal error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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

class GovBrAuthViewSet(viewsets.ViewSet):
    """
    ViewSet para autenticação Gov.br (OAuth 2.0)
    """
    permission_classes = [] # Público para permitir login

    @action(detail=False, methods=['get'])
    def login(self, request):
        """
        Inicia fluxo de login Gov.br
        
        Gera URL de autorização e redireciona usuário (ou retorna URL)
        """
        # Gerar state e nonce aleatórios
        state = secrets.token_urlsafe(16)
        nonce = secrets.token_urlsafe(16)
        
        # Armazenar na sessão para validação posterior
        request.session['govbr_state'] = state
        request.session['govbr_nonce'] = nonce
        
        try:
            service = GovBrService()
            auth_url = service.get_authorization_url(state, nonce)
            
            return Response({'auth_url': auth_url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def callback(self, request):
        """
        Callback do Login Gov.br
        
        Recebe code, valida state, troca por token, obtém perfil e loga usuário.
        """
        code = request.query_params.get('code')
        state = request.query_params.get('state')
        error = request.query_params.get('error')
        
        if error:
            return Response({'error': f"Erro no login Gov.br: {error}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not code or not state:
            return Response({'error': 'Parâmetros obrigatórios (code, state) ausentes'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Validar State (CSRF Protection)
        stored_state = request.session.get('govbr_state')
        if not stored_state or state != stored_state:
             return Response({'error': 'Estado inválido (Possível ataque CSRF)'}, status=status.HTTP_400_BAD_REQUEST)
             
        try:
            service = GovBrService()
            
            # 1. Trocar Code por Tokens
            token_data = service.exchange_code_for_token(code)
            access_token = token_data.get('access_token')
            
            if not access_token:
                raise IntegrationException("Access Token não retornado pelo Gov.br")
            
            # 2. Obter dados do usuário
            user_info = service.get_user_info(access_token)
            
            # Extrair dados principais
            sub = user_info.get('sub') # Identificador único Gov.br
            cpf = user_info.get('cpf')
            name = user_info.get('name')
            email = user_info.get('email')
            email_verified = user_info.get('email_verified', False)
            photo_url = user_info.get('picture')
            
            if not sub:
                 raise IntegrationException("Dados do usuário incompletos (sub ausente)")

            # 3. Lógica de Vinculação/Criação de Usuário
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = None
            
            # A) Tentar encontrar perfil Gov.br existente
            try:
                profile = GovBrProfile.objects.get(sub=sub)
                user = profile.user
            except GovBrProfile.DoesNotExist:
                pass
                
            # B) Se não tem perfil, tentar encontrar usuário por CPF (se existir campo cpf no User)
            if not user and cpf and hasattr(User, 'cpf'):
                 # Limpar CPF para busca se necessário
                 try:
                     user = User.objects.get(cpf=cpf)
                 except User.DoesNotExist:
                     pass

            # C) Tentar encontrar por Email (apenas se verificado)
            if not user and email and email_verified:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    pass
            
            # D) Se ainda não achou, criar novo usuário
            if not user:
                # Username: usar CPF (ideal) ou email ou sub
                username = cpf if cpf else (email if email else sub)
                
                # Garantir username único
                counter = 0
                original_username = username
                while User.objects.filter(username=username).exists():
                    counter += 1
                    username = f"{original_username}_{counter}"
                
                user = User.objects.create_user(
                    username=username,
                    email=email or '',
                    first_name=name.split()[0] if name else '',
                    last_name=' '.join(name.split()[1:]) if name else ''
                )
                
                # Definir CPF no user se o campo existir
                if cpf and hasattr(user, 'cpf'):
                    user.cpf = cpf
                    user.save()

            # 4. Atualizar/Criar Perfil Gov.br
            GovBrProfile.objects.update_or_create(
                user=user,
                defaults={
                    'sub': sub,
                    'name': name or user.get_full_name(),
                    'email': email,
                    'email_verified': email_verified,
                    'cpf': cpf or '',
                    'picture': photo_url,
                    'access_token': access_token,
                    'id_token': token_data.get('id_token'),
                    'refresh_token': token_data.get('refresh_token'),
                    # 'token_expires_at': calcular...
                }
            )
            
            # 5. Logar usuário na sessão Django
            login(request, user)
            
            # 6. Redirecionar para Dashboard no Frontend
            # Ler URL do frontend das settings ou usar default
            frontend_url = getattr(settings, 'CORS_ALLOWED_ORIGINS', ['http://localhost:3000'])[0]
            if isinstance(frontend_url, list): frontend_url = frontend_url[0] # Em caso de lista na tuple
            
            return redirect(f"{frontend_url}/dashboard?login_success=true")
            
        except Exception as e:
             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
