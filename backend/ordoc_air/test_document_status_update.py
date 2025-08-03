import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from ordoc_air.models import Organization, Department, Directory, Document


@pytest.mark.django_db
def test_update_status_valid_transitions(django_user_model):
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
    doc = Document.objects.create(
        original_filename='doc.pdf',
        file=SimpleUploadedFile('doc.pdf', b'file', content_type='application/pdf'),
        prn='doc-prn',
        directory=directory,
        department=dept,
        created_by=user,
    )
    url = f"/api/v1/ordoc-air/documents/{doc.id}/update_status/"
    response = client.post(url, {'status': 'enqueued'}, format='json', HTTP_X_API_SUBDOMAIN=org.subdomain)
    assert response.status_code == 200
    doc.refresh_from_db()
    assert doc.status == 'enqueued'
    response = client.post(url, {'status': 'processed'}, format='json', HTTP_X_API_SUBDOMAIN=org.subdomain)
    assert response.status_code == 200
    doc.refresh_from_db()
    assert doc.status == 'processed'


@pytest.mark.django_db
def test_update_status_invalid_transition(django_user_model):
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
    doc = Document.objects.create(
        original_filename='doc.pdf',
        file=SimpleUploadedFile('doc.pdf', b'file', content_type='application/pdf'),
        prn='doc-prn',
        directory=directory,
        department=dept,
        created_by=user,
    )
    url = f"/api/v1/ordoc-air/documents/{doc.id}/update_status/"
    response = client.post(url, {'status': 'processed'}, format='json', HTTP_X_API_SUBDOMAIN=org.subdomain)
    assert response.status_code == 400
    doc.refresh_from_db()
    assert doc.status == 'created'
