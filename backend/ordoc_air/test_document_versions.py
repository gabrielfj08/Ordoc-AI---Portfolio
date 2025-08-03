import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from ordoc_air.models import Organization, Department, Directory, Document


@pytest.mark.django_db
def test_create_and_retrieve_document_versions(django_user_model):
    user = django_user_model.objects.create_user(username='tester', password='pass')
    org = Organization.objects.create(
        corporate_name='Org',
        cnpj='12345678901234',
        email='org@example.com',
        phone='123456789',
        contact_name='Contact',
        contact_phone='123456789',
        subdomain='org',
        prn='org-prn',
        created_by=user,
    )
    dept = Department.objects.create(name='Dept', prn='dept-prn', organization=org)
    directory = Directory.objects.create(name='Dir', path='/dir', prn='dir-prn', department=dept)

    client = APIClient()
    client.force_authenticate(user=user)

    base_file = SimpleUploadedFile('doc.pdf', b'file', content_type='application/pdf')
    doc = Document.objects.create(
        original_filename='doc.pdf',
        file=base_file,
        prn='doc-prn',
        directory=directory,
        department=dept,
        created_by=user,
    )

    new_file = SimpleUploadedFile('doc_v2.pdf', b'new', content_type='application/pdf')
    url = f"/api/v1/ordoc-air/documents/{doc.id}/create_version/"
    response = client.post(url, {'file': new_file}, format='multipart', HTTP_X_API_SUBDOMAIN=org.subdomain)
    assert response.status_code == 201
    data = response.json()
    assert data['version'] == 2
    assert data['parent_document'] == str(doc.id)

    doc.refresh_from_db()
    assert not doc.is_current_version

    url_versions = f"/api/v1/ordoc-air/documents/{doc.id}/versions/"
    response = client.get(url_versions, HTTP_X_API_SUBDOMAIN=org.subdomain)
    assert response.status_code == 200
    versions = response.json()
    assert len(versions) == 2
    assert {v['version'] for v in versions} == {1, 2}
