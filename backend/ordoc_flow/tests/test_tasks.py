from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from ordoc_cloud.models import OrdocUser
from ordoc_air.models import Organization
from ordoc_flow.models import Procedure, ProcedureTemplate, Task, ExternalRequester

User = get_user_model()

class TaskTests(APITestCase):
    def setUp(self):
        # Setup Organization and User
        self.organization = Organization.objects.create(
            corporate_name="Test Org",
            cnpj="12345678901234",
            email="test@org.com",
            subdomain="testorg",
            prn="org/test"
        )
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='test@org.com'
        )
        self.ordoc_user = OrdocUser.objects.create(
            user=self.user,
            organization=self.organization,
            name="Test User",
            email="test@org.com"
        )

        # Setup Procedure
        self.template = ProcedureTemplate.objects.create(
            name="Test Template",
            organization=self.organization,
            prn="template/test"
        )

        # Mock external requester for procedure requirement
        self.requester = ExternalRequester.objects.create(
            name="System",
            email="system@local",
            organization=self.organization
        )

        self.procedure = Procedure.objects.create(
            procedure_template=self.template,
            organization=self.organization,
            created_by=self.ordoc_user,
            process_number="123/2023",
            prn="proc/123",
            requester=self.requester,
            responsible_group=None  # or create a group if needed
        )

        # Authenticate
        self.client.force_authenticate(user=self.user)
        self.client.credentials(HTTP_X_API_SUBDOMAIN='testorg') # Mock middleware if needed

    def test_create_task(self):
        url = reverse('ordoc_flow:task-list')
        data = {
            'name': 'New Task',
            'description': 'Task Description',
            'priority': 'medium',
            'procedure': self.procedure.id,
            'deadline': '2023-12-31'
        }

        # Mock timezone now for validation bypass if needed or set deadline in future
        import datetime
        from django.utils import timezone
        future_date = (timezone.now() + datetime.timedelta(days=10)).date()
        data['deadline'] = future_date

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'New Task')
        self.assertEqual(task.created_by, self.ordoc_user)

    def test_list_tasks(self):
        Task.objects.create(
            name="Existing Task",
            description="Desc",
            procedure=self.procedure,
            created_by=self.ordoc_user,
            prn="task/1"
        )

        url = reverse('ordoc_flow:task-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Depending on pagination, results might be in 'results'
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
