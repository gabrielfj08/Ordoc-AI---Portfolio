"""
Global pytest fixtures for backend tests
"""

import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


# ============================================================================
# CLIENTS
# ============================================================================

@pytest.fixture
def client():
    """Django test client"""
    return Client()


@pytest.fixture
def api_client():
    """DRF API client (não autenticado)"""
    return APIClient()


@pytest.fixture
def authenticated_api_client(user):
    """DRF API client autenticado com JWT"""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


# ============================================================================
# USERS
# ============================================================================

@pytest.fixture
def user(db):
    """
    Usuário comum para testes
    Email: user@test.com
    Password: testpass123
    """
    return User.objects.create_user(
        username='testuser',
        email='user@test.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )


@pytest.fixture
def admin_user(db):
    """
    Usuário administrador para testes
    Email: admin@test.com
    Password: adminpass123
    """
    return User.objects.create_superuser(
        username='admin',
        email='admin@test.com',
        password='adminpass123',
        first_name='Admin',
        last_name='User'
    )


@pytest.fixture
def user_password():
    """Senha padrão dos usuários de teste"""
    return 'testpass123'


# ============================================================================
# ORGANIZATIONS & MULTI-TENANCY
# ============================================================================

@pytest.fixture
def organization(db):
    """Organização de teste"""
    from ordoc_cloud.models import Organization
    return Organization.objects.create(
        name='Test Organization',
        subdomain='test-org',
        is_active=True
    )


@pytest.fixture
def user_with_organization(user, organization):
    """Usuário vinculado a uma organização"""
    from ordoc_cloud.models import UserOrganization
    UserOrganization.objects.create(
        user=user,
        organization=organization,
        role='member'
    )
    return user


# ============================================================================
# JWT TOKENS
# ============================================================================

@pytest.fixture
def jwt_tokens(user):
    """JWT tokens (access + refresh) para um usuário"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@pytest.fixture
def auth_headers(jwt_tokens):
    """Headers de autenticação com JWT"""
    return {
        'HTTP_AUTHORIZATION': f'Bearer {jwt_tokens["access"]}'
    }


# ============================================================================
# DATABASE
# ============================================================================

@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    """
    Setup inicial do banco de dados
    Executado uma vez por sessão de testes
    """
    with django_db_blocker.unblock():
        # Aqui você pode criar dados que serão compartilhados entre todos os testes
        # Exemplo: criar grupos de permissão padrão
        pass


# ============================================================================
# MOCKS
# ============================================================================

@pytest.fixture
def mock_celery_task(mocker):
    """Mock Celery tasks para não executar assincronamente"""
    return mocker.patch('celery.app.task.Task.apply_async')


@pytest.fixture
def mock_redis_cache(mocker):
    """Mock Redis cache"""
    return mocker.patch('django.core.cache.cache')


@pytest.fixture
def mock_s3_storage(mocker):
    """Mock AWS S3 storage"""
    return mocker.patch('storages.backends.s3boto3.S3Boto3Storage')


@pytest.fixture
def mock_solr(mocker):
    """Mock Apache Solr"""
    return mocker.patch('pysolr.Solr')


# ============================================================================
# UTILS
# ============================================================================

@pytest.fixture
def assert_response_keys():
    """Helper para validar keys em response JSON"""
    def _assert_keys(response, expected_keys):
        assert response.status_code == 200
        data = response.json()
        for key in expected_keys:
            assert key in data, f"Key '{key}' not found in response"
        return data
    return _assert_keys


@pytest.fixture
def create_test_file():
    """Helper para criar arquivos de teste"""
    from django.core.files.uploadedfile import SimpleUploadedFile
    def _create(name='test.pdf', content=b'fake pdf content', content_type='application/pdf'):
        return SimpleUploadedFile(name, content, content_type=content_type)
    return _create
