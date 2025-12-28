from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User

class LanguageModelStatusToViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = reverse('intelligence:status')

    def test_get_status_authenticated(self):
        """
        Ensure authenticated user can retrieve AI status with privacy details.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(data['status'], 'online')
        self.assertEqual(data['provider'], 'ollama')
        
        # Verify Privacy fields
        self.assertIn('privacy', data)
        self.assertEqual(data['privacy']['mode'], 'local')
        self.assertTrue(data['privacy']['compliant'])
        self.assertTrue(data['privacy']['lgpd_ready'])
        self.assertEqual(data['privacy']['data_residency'], 'on-premise')

    def test_get_status_unauthenticated(self):
        """
        Ensure unauthenticated user cannot access the endpoint.
        """
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
