from uuid import uuid4
from unittest.mock import patch

from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from ordoc_air.models import Organization
from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from .models import ReportTemplate, Report
from .services import ReportScheduleService
from .tasks import (
    generate_report_task,
    process_scheduled_reports_task,
    cleanup_expired_reports_task,
    send_report_notification_task,
)
from ordoc_ai.jwt_service import JWTService


class BaseAPITestCase(APITestCase):
    """Base class providing authenticated client and common fixtures."""

    def setUp(self):
        super().setUp()
        # Create organization
        self.organization = Organization.objects.create(
            corporate_name="Org Test",
            cnpj="12345678000100",
            email="org@example.com",
            phone="123456789",
            contact_name="Contact",
            contact_phone="987654321",
            subdomain="test",
            prn="ORG001",
            created_by=None,
        )
        # Create user and profile
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="pass123",
            is_active=True,
        )
        self.ordoc_user = OrdocUser.objects.create(
            user=self.user,
            status="active",
            must_change_password=False,
        )
        UserOrganizationRole.objects.create(
            user=self.ordoc_user,
            organization=self.organization,
            role="admin",
        )
        # Authenticate
        token = JWTService.create_user_token(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token}",
            HTTP_X_API_SUBDOMAIN=self.organization.subdomain,
        )


class ReportTemplateAPITests(BaseAPITestCase):
    """CRUD tests for ReportTemplate endpoints."""

    def _template_payload(self):
        return {
            "name": "Template A",
            "category": "documents",
            "type": "table",
            "query_config": {
                "model": "ordoc_air.Organization",
                "fields": ["corporate_name"],
            },
            "display_config": {},
            "filter_config": {},
            "export_config": {},
            "is_public": True,
            "allowed_roles": [],
        }

    def test_create_template(self):
        url = "/api/v1/ordoc-reports/api/templates/"
        response = self.client.post(url, self._template_payload(), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.data)

    def test_create_template_invalid_query_config(self):
        url = "/api/v1/ordoc-reports/api/templates/"
        payload = self._template_payload()
        payload["query_config"] = "invalid"
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_retrieve_update_delete_template(self):
        # Create template
        url = "/api/v1/ordoc-reports/api/templates/"
        response = self.client.post(url, self._template_payload(), format="json")
        template_id = response.data["id"]
        detail_url = f"/api/v1/ordoc-reports/api/templates/{template_id}/"

        # Retrieve
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)

        # Update
        response = self.client.patch(
            detail_url, {"name": "Updated"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Updated")

        # Delete
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)

        # Ensure it's gone
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 404)


class ReportGenerationAPITests(BaseAPITestCase):
    """Tests for report generation endpoint."""

    def _create_template(self):
        return ReportTemplate.objects.create(
            name="Temp",
            category="documents",
            type="table",
            status="active",
            query_config={"model": "ordoc_air.Organization", "fields": ["corporate_name"]},
            display_config={},
            filter_config={},
            export_config={},
            is_public=True,
            allowed_roles=[],
            organization=self.organization,
            created_by=self.ordoc_user,
        )

    def test_generate_report_success(self):
        template = self._create_template()
        url = "/api/v1/ordoc-reports/api/reports/generate/"
        payload = {
            "template_id": str(template.id),
            "title": "Report 1",
            "format": "json",
            "filters": {},
            "parameters": {},
            "expires_in_days": 1,
        }
        with patch("ordoc_reports.views.generate_report_task.delay") as mock_task:
            response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        mock_task.assert_called_once()

    def test_generate_report_missing_template(self):
        url = "/api/v1/ordoc-reports/api/reports/generate/"
        payload = {
            "template_id": str(uuid4()),
            "title": "Report 1",
            "format": "json",
            "filters": {},
            "parameters": {},
            "expires_in_days": 1,
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, 404)


class ReportTasksTests(BaseAPITestCase):
    """Tests for Celery tasks related to reports."""

    def _create_report(self):
        template = ReportTemplate.objects.create(
            name="Temp",
            category="documents",
            type="table",
            status="active",
            query_config={"model": "ordoc_air.Organization", "fields": ["corporate_name"]},
            display_config={},
            filter_config={},
            export_config={},
            is_public=True,
            allowed_roles=[],
            organization=self.organization,
            created_by=self.ordoc_user,
        )
        return Report.objects.create(
            title="Report",
            template=template,
            organization=self.organization,
            generated_by=self.ordoc_user,
            filters_applied={},
            parameters={},
        )

    def test_generate_report_task_success(self):
        report = self._create_report()

        def fake_generate(rep):
            rep.status = "completed"
            rep.save()

        with patch(
            "ordoc_reports.tasks.ReportGenerationService.generate_report",
            side_effect=fake_generate,
        ):
            result = generate_report_task(report.id)

        self.assertEqual(
            result, f"Relatório {report.id} gerado com sucesso"
        )
        report.refresh_from_db()
        self.assertEqual(report.status, "completed")

    def test_generate_report_task_missing_report(self):
        result = generate_report_task(uuid4())
        self.assertIsNone(result)

    def test_process_scheduled_reports_task_error(self):
        with patch(
            "ordoc_reports.tasks.ReportScheduleService.process_scheduled_reports",
            side_effect=Exception("fail"),
        ):
            result = process_scheduled_reports_task()
        self.assertIn("Erro", result)

    def test_cleanup_expired_reports_task_success(self):
        with patch(
            "ordoc_reports.tasks.ReportCleanupService.cleanup_expired_reports",
            return_value=2,
        ):
            result = cleanup_expired_reports_task()
        self.assertIn("2", result)

    @patch("ordoc_reports.tasks.NotificationService.notify")
    def test_generate_report_task_sends_user_email(self, mock_notify):
        report = self._create_report()

        def fake_generate(rep):
            rep.status = "completed"
            rep.save()

        with patch(
            "ordoc_reports.tasks.ReportGenerationService.generate_report",
            side_effect=fake_generate,
        ):
            generate_report_task(report.id)

        mock_notify.assert_called_once()
        self.assertIn(self.user.email, mock_notify.call_args.kwargs["emails"])

    @patch("ordoc_reports.tasks.NotificationService.notify")
    def test_send_report_notification_task_uses_user_email(self, mock_notify):
        report = self._create_report()
        send_report_notification_task(report.id, notification_type="completion")

        mock_notify.assert_called_once()
        self.assertIn(self.user.email, mock_notify.call_args.kwargs["emails"])


class ReportScheduleServiceLogTests(BaseAPITestCase):
    """Tests for logging in ReportScheduleService."""

    def _create_template(self):
        return ReportTemplate.objects.create(
            name="Temp",
            category="documents",
            type="table",
            status="active",
            query_config={"model": "ordoc_air.Organization", "fields": ["corporate_name"]},
            display_config={},
            filter_config={},
            export_config={},
            is_public=True,
            allowed_roles=[],
            organization=self.organization,
            created_by=self.ordoc_user,
        )

    def _create_schedule(self):
        from django.utils import timezone
        from datetime import timedelta
        from .models import ReportSchedule

        template = self._create_template()
        return ReportSchedule.objects.create(
            name="Sched",
            frequency="daily",
            next_run=timezone.now() - timedelta(minutes=1),
            template=template,
            organization=self.organization,
            created_by=self.ordoc_user,
            default_format="json",
            default_filters={},
        )

    def test_process_scheduled_reports_logs_success(self):
        schedule = self._create_schedule()
        with patch("ordoc_reports.tasks.generate_report_task.delay"):
            with self.assertLogs("ordoc_reports.services", level="INFO") as cm:
                ReportScheduleService.process_scheduled_reports()

        self.assertTrue(
            any("Relatório agendado criado" in message for message in cm.output)
        )

    def test_process_scheduled_reports_logs_error(self):
        schedule = self._create_schedule()
        with patch("ordoc_reports.tasks.generate_report_task.delay"):
            with patch(
                "ordoc_reports.models.Report.objects.create",
                side_effect=Exception("boom"),
            ):
                with self.assertLogs("ordoc_reports.services", level="ERROR") as cm:
                    ReportScheduleService.process_scheduled_reports()

        self.assertTrue(
            any(schedule.name in message and "boom" in message for message in cm.output)
        )
