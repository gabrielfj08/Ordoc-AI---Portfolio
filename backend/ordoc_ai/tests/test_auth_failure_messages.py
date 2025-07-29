import os
import django
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

class AuthFailureMessageTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='tester',
            email='tester@example.com',
            password='correctpass'
        )
        OrdocUser.objects.create(user=self.user, status='active')

    def test_login_invalid_credentials_message(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'tester@example.com',
            'password': 'wrongpass',
            'user_type': 'internal'
        }, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json().get('error'), 'Invalid credentials or inactive account')

    def test_invalid_token_message(self):
        response = self.client.get('/api/auth/me/', HTTP_AUTHORIZATION='Bearer invalidtoken')
        self.assertEqual(response.status_code, 401)
        self.assertIn('Invalid token', response.json().get('detail', ''))
