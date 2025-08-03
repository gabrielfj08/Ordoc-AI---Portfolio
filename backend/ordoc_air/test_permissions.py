import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from ordoc_air.models import (
    Organization,
    Department,
    Directory,
    Document,
)


@pytest.fixture
@pytest.mark.django_db
def user():
    return User.objects.create_user(username="tester", password="pass123")


@pytest.fixture
@pytest.mark.django_db
def api_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
@pytest.mark.django_db
def directory(user):
    org = Organization.objects.create(
        corporate_name="Org",
        cnpj="12345678901234",
        email="org@example.com",
        phone="123",
        contact_name="c",
        contact_phone="123",
        subdomain="org",
        prn="org-prn",
        created_by=user,
    )
    dept = Department.objects.create(name="Dept", description="", prn="dept-prn", organization=org)
    return Directory.objects.create(
        name="Dir",
        description="",
        path="/dir",
        prn="dir-prn",
        department=dept,
        created_by=user,
        updated_by=user,
    )


@pytest.fixture
@pytest.mark.django_db
def document(directory, user):
    uploaded = SimpleUploadedFile("test.txt", b"content")
    return Document.objects.create(
        original_filename="test.txt",
        prn="doc-prn",
        file=uploaded,
        directory=directory,
        department=directory.department,
        created_by=user,
        updated_by=user,
    )


@pytest.mark.django_db
def test_user_directory_permission(api_client, user, directory):
    assert not user.has_perm("view_directory", directory)
    response = api_client.post(
        "/api/v1/ordoc-air/permissions/",
        {"user": user.id, "directory": directory.id, "permission": "view_directory"},
        format="json",
    )
    assert response.status_code == 201
    assert user.has_perm("view_directory", directory)
    perm_id = response.data["id"]
    del_resp = api_client.delete(f"/api/v1/ordoc-air/permissions/{perm_id}/")
    assert del_resp.status_code == 204
    assert not user.has_perm("view_directory", directory)


@pytest.mark.django_db
def test_user_document_permission(api_client, user, document):
    assert not user.has_perm("view_document", document)
    response = api_client.post(
        "/api/v1/ordoc-air/permissions/",
        {"user": user.id, "document": document.id, "permission": "view_document"},
        format="json",
    )
    assert response.status_code == 201
    assert user.has_perm("view_document", document)
    perm_id = response.data["id"]
    del_resp = api_client.delete(f"/api/v1/ordoc-air/permissions/{perm_id}/")
    assert del_resp.status_code == 204
    assert not user.has_perm("view_document", document)
