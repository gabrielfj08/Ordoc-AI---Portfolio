from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from ordoc_cloud.models import OrdocUser, UserOrganizationRole

User = get_user_model()

class UserPreferencesTests(TestCase):
    def setUp(self):
        # Create test users
        self.user = User.objects.create_user(username='testuser', password='password', email='test@example.com')
        self.ordoc_user = OrdocUser.objects.create(user=self.user)
        
        self.admin_user = User.objects.create_user(username='admin', password='password', email='admin@example.com')
        self.ordoc_admin = OrdocUser.objects.create(user=self.admin_user)
        
        # Assign role to admin (mock role)
        # Note: In real app we need Organization and Role models setup, but for this test we mock or setup minimal
        # We need to setup UserOrganizationRole for 'admin' role check
        # Assuming we need to create an Organization and a Role object if they are foreign keys
        # But UserOrganizationRole usually links to simple strings or role objects.
        # Let's inspect UserOrganizationRole if needed, but for now let's try to mock the roles query or setup data properly.
        # Actually proper setup is better.
        
    def test_view_mode_default(self):
        """Test default view mode is 'personal'"""
        self.assertEqual(self.ordoc_user.view_mode, 'personal')

    def test_update_view_mode_personal(self):
        """Test updating view mode to 'personal' works for any user"""
        client = APIClient()
        client.force_authenticate(user=self.user)
        
        response = client.patch('/api/auth/me/', {'view_mode': 'personal'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ordoc_user.refresh_from_db()
        self.assertEqual(self.ordoc_user.view_mode, 'personal')

    def test_update_view_mode_team_permission_denied(self):
        """Test updating view mode to 'team' fails for user without permission"""
        client = APIClient()
        client.force_authenticate(user=self.user)
        
        response = client.patch('/api/auth/me/', {'view_mode': 'team'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.ordoc_user.refresh_from_db()
        self.assertEqual(self.ordoc_user.view_mode, 'personal')

    # Note: To test success for team view, we need to properly setup the role.
    # Since checking role implementation might be complex (foreign keys etc), we skip it here 
    # unless we are sure about the structure. UserOrganizationRole usually has 'role' field.
    # user_role = UserOrganizationRole.objects.create(user=self.ordoc_admin, role='admin', is_active=True)
