"""
Unit Tests - Models

Testes unitários dos modelos principais da aplicação.
"""

import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from test.backend.factories import UserFactory, OrganizationFactory


@pytest.mark.django_db
@pytest.mark.models
class TestDocumentModel:
    """Testes do modelo Document (OrdocAir)"""

    @pytest.fixture
    def organization(self):
        """Organização de teste"""
        return OrganizationFactory()

    @pytest.fixture
    def user(self):
        """Usuário de teste"""
        return UserFactory()

    @pytest.fixture
    def document(self, organization, user):
        """Documento de teste"""
        from ordoc_air.models import Document
        return Document.objects.create(
            title="Test Document",
            file_name="test.pdf",
            file_size=1024000,
            mime_type="application/pdf",
            status='draft',
            organization=organization,
            uploaded_by=user
        )

    def test_document_creation(self, document):
        """Testa criação de documento"""
        assert document.id is not None
        assert document.title == "Test Document"
        assert document.status == 'draft'

    def test_document_str_representation(self, document):
        """Testa representação em string do documento"""
        assert str(document) == "Test Document"

    def test_document_file_extension_property(self, document):
        """Testa propriedade de extensão do arquivo"""
        assert document.file_extension == 'pdf'

    def test_document_is_pdf_property(self, document):
        """Testa verificação de tipo PDF"""
        assert document.is_pdf is True

    def test_document_file_size_mb_property(self, document):
        """Testa conversão de tamanho para MB"""
        # 1024000 bytes = ~0.98 MB
        assert 0.97 < document.file_size_mb < 0.99

    def test_document_timestamps(self, document):
        """Testa timestamps automáticos"""
        assert document.created_at is not None
        assert document.updated_at is not None
        assert document.created_at <= document.updated_at

    def test_document_organization_relationship(self, document, organization):
        """Testa relacionamento com organização"""
        assert document.organization == organization
        assert document in organization.documents.all()

    def test_document_uploader_relationship(self, document, user):
        """Testa relacionamento com usuário que fez upload"""
        assert document.uploaded_by == user


@pytest.mark.django_db
@pytest.mark.models
class TestProcedureModel:
    """Testes do modelo Procedure (OrdocFlow)"""

    @pytest.fixture
    def organization(self):
        """Organização de teste"""
        return OrganizationFactory()

    @pytest.fixture
    def user(self):
        """Usuário de teste"""
        return UserFactory()

    @pytest.fixture
    def procedure(self, organization, user):
        """Procedimento de teste"""
        from ordoc_flow.models import Procedure
        return Procedure.objects.create(
            name="Test Procedure",
            description="Test procedure description",
            status='draft',
            organization=organization,
            created_by=user
        )

    def test_procedure_creation(self, procedure):
        """Testa criação de procedimento"""
        assert procedure.id is not None
        assert procedure.name == "Test Procedure"
        assert procedure.status == 'draft'

    def test_procedure_str_representation(self, procedure):
        """Testa representação em string do procedimento"""
        assert "Test Procedure" in str(procedure)

    def test_procedure_is_draft_property(self, procedure):
        """Testa propriedade is_draft"""
        assert procedure.is_draft is True

    def test_procedure_is_running_property(self, procedure):
        """Testa propriedade is_running"""
        assert procedure.is_running is False
        procedure.status = 'running'
        assert procedure.is_running is True

    def test_procedure_is_finished_property(self, procedure):
        """Testa propriedade is_finished"""
        assert procedure.is_finished is False
        procedure.status = 'finished'
        assert procedure.is_finished is True


@pytest.mark.django_db
@pytest.mark.models
class TestOrganizationModel:
    """Testes do modelo Organization"""

    def test_organization_creation_with_factory(self):
        """Testa criação de organização com factory"""
        org = OrganizationFactory()

        assert org.id is not None
        assert org.name is not None
        assert org.subdomain is not None
        assert org.is_active is True

    def test_organization_unique_subdomain(self):
        """Testa que subdomínio é único"""
        org1 = OrganizationFactory(subdomain='test-org')

        # Segundo com mesmo subdomain deve falhar
        with pytest.raises(Exception):  # IntegrityError
            OrganizationFactory(subdomain='test-org')

    def test_organization_str_representation(self):
        """Testa representação em string"""
        org = OrganizationFactory(name="Test Company")
        assert "Test Company" in str(org)


@pytest.mark.django_db
@pytest.mark.models
class TestUserModel:
    """Testes do modelo User"""

    def test_user_creation_with_factory(self):
        """Testa criação de usuário com factory"""
        user = UserFactory()

        assert user.id is not None
        assert user.username is not None
        assert user.email is not None
        assert user.is_active is True

    def test_user_password_is_hashed(self):
        """Testa que senha é hashada"""
        user = UserFactory(password='testpass123')

        # Senha não deve estar em plaintext
        assert user.password != 'testpass123'
        # Mas deve validar corretamente
        assert user.check_password('testpass123')

    def test_admin_user_factory(self):
        """Testa factory de usuário admin"""
        from test.backend.factories import AdminUserFactory
        admin = AdminUserFactory()

        assert admin.is_staff is True
        assert admin.is_superuser is True

    def test_user_unique_username(self):
        """Testa que username é único"""
        UserFactory(username='testuser')

        with pytest.raises(Exception):  # IntegrityError
            UserFactory(username='testuser')
