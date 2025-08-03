import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from ordoc_air.models import Organization, Department, Directory, Document


@pytest.mark.django_db
def test_download_uses_document_name_in_content_disposition(django_user_model):
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
    uploaded = SimpleUploadedFile('doc.pdf', b'data', content_type='application/pdf')
    document = Document.objects.create(
        name='doc.pdf',
        file=uploaded,
        prn='doc-prn',
        directory=directory,
        department=dept,
        created_by=user,
        mime_type='application/pdf',
    )
    url = f"/api/v1/ordoc-air/documents/{document.id}/download/"
    response = client.get(url, HTTP_X_API_SUBDOMAIN=org.subdomain)
    assert response.status_code == 200
    assert response['Content-Disposition'] == 'attachment; filename="doc.pdf"'
    assert response['Content-Type'] == 'application/pdf'
