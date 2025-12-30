"""
Integration Tests - API Authentication

Testes de integração dos endpoints de autenticação.
"""

import pytest
from rest_framework import status
from django.contrib.auth import get_user_model

from test.backend.factories import UserFactory

User = get_user_model()


@pytest.mark.django_db
@pytest.mark.api
class TestAuthLoginAPI:
    """Testes do endpoint de login"""

    @pytest.fixture
    def api_client(self):
        """API client não autenticado"""
        from rest_framework.test import APIClient
        return APIClient()

    @pytest.fixture
    def user(self):
        """Usuário de teste"""
        return UserFactory(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_login_with_valid_credentials(self, api_client, user):
        """Testa login com credenciais válidas"""
        response = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123'
        })

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.json()
        assert 'refresh' in response.json()

    def test_login_with_invalid_password(self, api_client, user):
        """Testa login com senha incorreta"""
        response = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'wrongpassword'
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_with_nonexistent_user(self, api_client):
        """Testa login com usuário inexistente"""
        response = api_client.post('/api/auth/login/', {
            'username': 'nonexistent',
            'password': 'testpass123'
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_with_missing_fields(self, api_client):
        """Testa login sem campos obrigatórios"""
        response = api_client.post('/api/auth/login/', {
            'username': 'testuser'
            # password missing
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_returns_user_data(self, api_client, user):
        """Testa que login retorna dados do usuário"""
        response = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123'
        })

        data = response.json()
        assert 'user' in data or 'id' in data  # Depende da implementação


@pytest.mark.django_db
@pytest.mark.api
class TestAuthRefreshAPI:
    """Testes do endpoint de refresh token"""

    @pytest.fixture
    def api_client(self):
        """API client não autenticado"""
        from rest_framework.test import APIClient
        return APIClient()

    @pytest.fixture
    def user_with_tokens(self):
        """Usuário com tokens JWT"""
        from rest_framework_simplejwt.tokens import RefreshToken
        user = UserFactory()
        refresh = RefreshToken.for_user(user)

        return {
            'user': user,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    def test_refresh_token_with_valid_token(self, api_client, user_with_tokens):
        """Testa refresh com token válido"""
        response = api_client.post('/api/auth/refresh/', {
            'refresh': user_with_tokens['refresh']
        })

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.json()

    def test_refresh_token_with_invalid_token(self, api_client):
        """Testa refresh com token inválido"""
        response = api_client.post('/api/auth/refresh/', {
            'refresh': 'invalid.token.here'
        })

        assert response.status_code in [
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED
        ]


@pytest.mark.django_db
@pytest.mark.api
@pytest.mark.slow
class TestRateLimiting:
    """Testes de rate limiting"""

    @pytest.fixture
    def api_client(self):
        """API client não autenticado"""
        from rest_framework.test import APIClient
        return APIClient()

    def test_login_rate_limiting(self, api_client):
        """Testa que rate limiting bloqueia após muitas tentativas"""
        # Configurado para 5 tentativas/minuto no rate_limiting.py

        # Fazer 6 requisições
        for i in range(6):
            response = api_client.post('/api/auth/login/', {
                'username': 'testuser',
                'password': 'wrongpass'
            })

            if i < 5:
                # Primeiras 5 devem passar (mas falhar auth)
                assert response.status_code in [
                    status.HTTP_401_UNAUTHORIZED,
                    status.HTTP_400_BAD_REQUEST
                ]
            else:
                # 6ª deve ser bloqueada por rate limit
                assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS


@pytest.mark.django_db
@pytest.mark.api
class TestProtectedEndpoints:
    """Testes de endpoints protegidos (requerem autenticação)"""

    @pytest.fixture
    def api_client(self):
        """API client não autenticado"""
        from rest_framework.test import APIClient
        return APIClient()

    @pytest.fixture
    def authenticated_client(self, user):
        """API client autenticado"""
        from rest_framework.test import APIClient
        from rest_framework_simplejwt.tokens import RefreshToken

        client = APIClient()
        refresh = RefreshToken.for_user(user)
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        return client

    @pytest.fixture
    def user(self):
        """Usuário de teste"""
        return UserFactory()

    def test_protected_endpoint_without_auth_fails(self, api_client):
        """Testa que endpoint protegido sem auth retorna 401"""
        response = api_client.get('/api/v1/ordoc-air/documents/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_protected_endpoint_with_auth_succeeds(self, authenticated_client):
        """Testa que endpoint protegido com auth funciona"""
        response = authenticated_client.get('/api/v1/ordoc-air/documents/')

        # Deve retornar 200 (ou 403 se não tiver permissão, mas não 401)
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_403_FORBIDDEN
        ]

    def test_invalid_token_returns_401(self, api_client):
        """Testa que token inválido retorna 401"""
        api_client.credentials(HTTP_AUTHORIZATION='Bearer invalid.token.here')
        response = api_client.get('/api/v1/ordoc-air/documents/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
