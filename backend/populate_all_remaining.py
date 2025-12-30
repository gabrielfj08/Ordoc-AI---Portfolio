#!/usr/bin/env python
"""
População Final - TODAS as Tabelas Vazias Restantes
Script consolidado que popula as 22 tabelas vazias em uma execução
"""
import os
import sys
import django
import uuid
import random
from datetime import timedelta
from decimal import Decimal

sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Group
from django.core.files.base import ContentFile

from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import Organization, Department, Directory, Document, Tag
from ordoc_flow.models import Procedure, Task, ProcedureTemplate, ExternalRequester, GroupRequester

User = get_user_model()

class FinalPopulator:
    """Popula todas as tabelas vazias restantes"""
    
    def __init__(self):
        self.user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
        self.ordoc_user = self.user.ordoc_profile
        self.role = UserOrganizationRole.objects.filter(user=self.ordoc_user).first()
        self.org = self.role.organization
        
        # Dados existentes
        self.docs = list(Document.objects.filter(department__organization=self.org)[:20])
        self.procedures = list(Procedure.objects.filter(organization=self.org)[:15])
        self.tasks = list(Task.objects.filter(procedure__organization=self.org)[:20])
        self.dirs = list(Directory.objects.filter(department__organization=self.org)[:5])
        
        self.results = {}
    
    def populate_table(self, table_name, func):
        """Wrapper para popular uma tabela com tratamento de erro"""
        try:
            count = func()
            self.results[table_name] = {'status': 'success', 'count': count}
            print(f"✅ {table_name:<50} {count:>4} registros")
            return count
        except Exception as e:
            error_msg = str(e)[:100]
            self.results[table_name] = {'status': 'error', 'error': error_msg}
            print(f"❌ {table_name:<50} ERRO: {error_msg}")
            return 0
    
    # =========================================================================
    # ORDOC FLOW
    # =========================================================================
    
    def populate_task_comments(self):
        """ordoc_flow_task_comments"""
        from ordoc_flow.models import TaskComment
        count = 0
        
        comments = [
            "Tarefa em andamento, previsão de conclusão amanhã.",
            "Aguardando aprovação do cliente.",
            "Documentação atualizada conforme solicitado.",
            "Prazo estendido em 2 dias úteis.",
            "Concluído com sucesso!"
        ]
        
        for task in self.tasks[:10]:
            for i in range(random.randint(1, 3)):
                comment, created = TaskComment.objects.get_or_create(
                    task=task,
                    created_by=self.ordoc_user,
                    comment=random.choice(comments)
                )
                if created:
                    count += 1
        
        return count
    
    def populate_workflow_history(self):
        """ordoc_flow_workflow_history"""
        from ordoc_flow.models import WorkflowHistory
        count = 0
        
        actions = ['created', 'updated', 'status_changed', 'assigned', 'completed']
        
        # Histórico de Procedures
        for proc in self.procedures[:10]:
            for action in random.sample(actions, k=random.randint(2, 4)):
                history, created = WorkflowHistory.objects.get_or_create(
                    content_type=ContentType.objects.get_for_model(Procedure),
                    object_id=proc.id,
                    action=action,
                    defaults={
                        'description': f'Procedure {action}',
                        'performed_by': self.ordoc_user
                    }
                )
                if created:
                    count += 1
        
        # Histórico de Tasks
        for task in self.tasks[:10]:
            for action in random.sample(actions, k=random.randint(1, 3)):
                history, created = WorkflowHistory.objects.get_or_create(
                    content_type=ContentType.objects.get_for_model(Task),
                    object_id=task.id,
                    action=action,
                    defaults={
                        'description': f'Task {action}',
                        'performed_by': self.ordoc_user
                    }
                )
                if created:
                    count += 1
        
        return count
    
    def populate_fields(self):
        """ordoc_flow_fields"""
        from ordoc_flow.models import Field
        count = 0
        
        templates = list(ProcedureTemplate.objects.filter(organization=self.org)[:5])
        
        field_types = ['text', 'number', 'date', 'select', 'checkbox']
        field_labels = ['Nome do Cliente', 'Valor do Contrato', 'Data de Vencimento', 'Tipo de Serviço', 'Urgente']
        
        for template in templates:
            for i, (field_type, label) in enumerate(zip(field_types, field_labels)):
                field, created = Field.objects.get_or_create(
                    procedure_template=template,
                    label=label,
                    defaults={
                        'field_type': field_type,
                        'required': random.choice([True, False]),
                        'order': i
                    }
                )
                if created:
                    count += 1
        
        return count
    
    def populate_field_value_options(self):
        """ordoc_flow_field_value_options"""
        from ordoc_flow.models import Field, FieldValueOption
        count = 0
        
        select_fields = Field.objects.filter(field_type='select')
        
        options = [
            ['Consultoria', 'Auditoria', 'Assessoria'],
            ['Baixa', 'Média', 'Alta'],
            ['Sim', 'Não'],
        ]
        
        for field in select_fields[:3]:
            for i, option in enumerate(random.choice(options)):
                opt, created = FieldValueOption.objects.get_or_create(
                    field=field,
                    label=option,
                    defaults={
                        'value': option.lower(),
                        'order': i,
                        'is_active': True
                    }
                )
                if created:
                    count += 1
        
        return count
    
    def populate_notification_templates(self):
        """ordoc_flow_notification_templates"""
        from ordoc_flow.models import NotificationTemplate
        count = 0
        
        templates_data = [
            {
                'name': 'Nova Tarefa Atribuída',
                'notification_type': 'email',
                'trigger_event': 'task_assigned',
                'subject_template': 'Nova tarefa: {{task.name}}',
                'body_template': 'Você foi atribuído à tarefa {{task.name}}.',
            },
            {
                'name': 'Prazo Próximo',
                'notification_type': 'system',
                'trigger_event': 'deadline_approaching',
                'subject_template': 'Prazo se aproximando',
                'body_template': 'A tarefa {{task.name}} vence em {{days}} dias.',
            },
            {
                'name': 'Aprovação Pendente',
                'notification_type': 'email',
                'trigger_event': 'approval_requested',
                'subject_template': 'Aprovação necessária',
                'body_template': 'Sua aprovação é necessária para {{procedure.name}}.',
            },
        ]
        
        for template_data in templates_data:
            template, created = NotificationTemplate.objects.get_or_create(
                organization=self.org,
                name=template_data['name'],
                defaults={
                    'notification_type': template_data['notification_type'],
                    'trigger_event': template_data['trigger_event'],
                    'subject_template': template_data['subject_template'],
                    'body_template': template_data['body_template'],
                    'is_active': True,
                    'send_to_requester': True,
                    'send_to_assignee': True,
                    'send_to_group': False
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_workflow_request(self):
        """ordoc_flow_workflowrequest"""
        from ordoc_flow.models import WorkflowRequest
        count = 0
        
        requesters = list(ExternalRequester.objects.filter(organization=self.org)[:5])
        groups = list(GroupRequester.objects.filter(organization=self.org)[:3])
        
        for i in range(10):
            request, created = WorkflowRequest.objects.get_or_create(
                organization=self.org,
                requester=random.choice(requesters) if requesters else None,
                defaults={
                    'request_type': random.choice(['new_procedure', 'update', 'cancellation']),
                    'status': random.choice(['pending', 'approved', 'rejected']),
                    'description': f'Solicitação de workflow #{i+1}',
                    'requested_by': self.ordoc_user,
                    'assigned_to_group': random.choice(groups) if groups else None
                }
            )
            if created:
                count += 1
        
        return count
    
    # =========================================================================
    # ORDOC REPORTS
    # =========================================================================
    
    def populate_report_templates(self):
        """ordoc_reports_templates"""
        from ordoc_reports.models import ReportTemplate
        count = 0
        
        templates_data = [
            {
                'name': 'Documentos por Departamento',
                'category': 'documents',
                'type': 'table',
                'description': 'Relatório de documentos agrupados por departamento'
            },
            {
                'name': 'Procedures em Andamento',
                'category': 'workflow',
                'type': 'chart',
                'description': 'Gráfico de procedures por status'
            },
            {
                'name': 'Uso de Armazenamento',
                'category': 'storage',
                'type': 'dashboard',
                'description': 'Dashboard de uso de armazenamento'
            },
            {
                'name': 'Tempo Médio de Aprovação',
                'category': 'workflow',
                'type': 'metric',
                'description': 'Métrica de tempo médio de aprovação'
            },
            {
                'name': 'Atividade de Usuários',
                'category': 'users',
                'type': 'table',
                'description': 'Relatório de atividade dos usuários'
            },
        ]
        
        for template_data in templates_data:
            template, created = ReportTemplate.objects.get_or_create(
                organization=self.org,
                name=template_data['name'],
                defaults={
                    'category': template_data['category'],
                    'type': template_data['type'],
                    'description': template_data['description'],
                    'query_config': {'filters': {}, 'aggregations': []},
                    'display_config': {'theme': 'modern', 'colors': ['#3B82F6']},
                    'is_active': True,
                    'created_by': self.ordoc_user
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_reports(self):
        """ordoc_reports_reports"""
        from ordoc_reports.models import ReportTemplate, Report
        count = 0
        
        templates = list(ReportTemplate.objects.filter(organization=self.org))
        
        for template in templates[:3]:
            for i in range(random.randint(1, 3)):
                report, created = Report.objects.get_or_create(
                    template=template,
                    generated_by=self.ordoc_user,
                    defaults={
                        'status': random.choice(['generating', 'completed', 'failed']),
                        'format': random.choice(['pdf', 'excel', 'csv']),
                        'file_path': f'/reports/{uuid.uuid4()}.pdf',
                        'file_size': random.randint(100000, 5000000),
                        'data': {'rows': random.randint(10, 100), 'generated_at': str(timezone.now())}
                    }
                )
                if created:
                    count += 1
        
        return count
    
    def populate_report_schedules(self):
        """ordoc_reports_schedules"""
        from ordoc_reports.models import ReportTemplate, ReportSchedule
        count = 0
        
        templates = list(ReportTemplate.objects.filter(organization=self.org))
        
        for template in templates[:3]:
            schedule, created = ReportSchedule.objects.get_or_create(
                template=template,
                defaults={
                    'frequency': random.choice(['daily', 'weekly', 'monthly']),
                    'next_run': timezone.now() + timedelta(days=1),
                    'notification_emails': [self.user.email],
                    'is_active': True,
                    'created_by': self.ordoc_user
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_report_shares(self):
        """ordoc_reports_shares"""
        from ordoc_reports.models import Report, ReportShare
        count = 0
        
        reports = list(Report.objects.filter(template__organization=self.org))
        
        for report in reports[:5]:
            share, created = ReportShare.objects.get_or_create(
                report=report,
                token=uuid.uuid4().hex[:16],
                defaults={
                    'password': None,
                    'expires_at': timezone.now() + timedelta(days=7),
                    'max_views': random.choice([None, 10, 50]),
                    'view_count': 0,
                    'is_active': True,
                    'created_by': self.ordoc_user
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_report_metrics(self):
        """ordoc_reports_metrics"""
        from ordoc_reports.models import ReportTemplate, ReportMetric
        count = 0
        
        templates = list(ReportTemplate.objects.filter(organization=self.org))
        
        metric_types = ['generation_time', 'access_count', 'export_count', 'error_rate']
        
        for template in templates:
            for metric_type in metric_types:
                metric, created = ReportMetric.objects.get_or_create(
                    report_template=template,
                    metric_type=metric_type,
                    defaults={
                        'value': Decimal(str(random.uniform(0.1, 100.0))),
                        'recorded_at': timezone.now()
                    }
                )
                if created:
                    count += 1
        
        return count
    
    # =========================================================================
    # ORDOC SIGN
    # =========================================================================
    
    def populate_document_signatures(self):
        """ordoc_sign_document_signatures"""
        from ordoc_sign.models import SignatureRequest, SignatureRequestSigner, DocumentSignature, DigitalCertificate
        count = 0
        
        requests = list(SignatureRequest.objects.filter(organization=self.org))
        signers = list(SignatureRequestSigner.objects.all())
        certs = list(DigitalCertificate.objects.filter(user=self.user))
        
        if not certs:
            return 0
        
        for signer in signers[:3]:
            signature, created = DocumentSignature.objects.get_or_create(
                signer=signer,
                document=signer.request.document if hasattr(signer.request, 'document') else self.docs[0],
                certificate=certs[0],
                defaults={
                    'signature_data': 'MOCK_SIGNATURE_DATA_' + uuid.uuid4().hex,
                    'hash': uuid.uuid4().hex,
                    'timestamp': timezone.now(),
                    'ip_address': '192.168.1.100',
                    'geolocation': {'lat': -23.5505, 'lng': -46.6333}
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_signature_audit_logs(self):
        """ordoc_sign_signature_audit_logs"""
        from ordoc_sign.models import SignatureRequest, SignatureAuditLog
        count = 0
        
        requests = list(SignatureRequest.objects.filter(organization=self.org))
        
        actions = ['created', 'sent', 'viewed', 'signed', 'rejected', 'completed']
        
        for request in requests:
            for action in random.sample(actions, k=random.randint(2, 4)):
                log, created = SignatureAuditLog.objects.get_or_create(
                    signature_request=request,
                    action=action,
                    defaults={
                        'description': f'Signature request {action}',
                        'performed_by': self.user,
                        'ip_address': f'192.168.1.{random.randint(1, 255)}',
                        'user_agent': 'Mozilla/5.0'
                    }
                )
                if created:
                    count += 1
        
        return count
    
    def populate_signature_batches(self):
        """ordoc_sign_signature_batches"""
        from ordoc_sign.models import SignatureBatch
        count = 0
        
        for i in range(3):
            batch, created = SignatureBatch.objects.get_or_create(
                organization=self.org,
                name=f'Lote de Assinaturas {i+1}',
                defaults={
                    'description': f'Lote de documentos para assinatura em massa',
                    'status': random.choice(['draft', 'sent', 'completed']),
                    'created_by': self.ordoc_user,
                    'total_documents': random.randint(5, 20),
                    'signed_documents': random.randint(0, 15)
                }
            )
            if created:
                count += 1
        
        return count
    
    # =========================================================================
    # MAIN
    # =========================================================================
    
    def populate_all(self):
        """Popula todas as tabelas vazias"""
        print("\n" + "="*100)
        print("POPULAÇÃO FINAL - TODAS AS TABELAS VAZIAS RESTANTES")
        print("="*100 + "\n")
        
        print(f"👤 Usuário: {self.ordoc_user}")
        print(f"🏢 Organização: {self.org.corporate_name}\n")
        
        print("Populando tabelas...\n")
        
        # Ordoc Flow
        print("⚙️  ORDOC FLOW")
        self.populate_table('ordoc_flow_task_comments', self.populate_task_comments)
        self.populate_table('ordoc_flow_workflow_history', self.populate_workflow_history)
        self.populate_table('ordoc_flow_fields', self.populate_fields)
        self.populate_table('ordoc_flow_field_value_options', self.populate_field_value_options)
        self.populate_table('ordoc_flow_notification_templates', self.populate_notification_templates)
        self.populate_table('ordoc_flow_workflowrequest', self.populate_workflow_request)
        
        # Ordoc Reports
        print("\n📊 ORDOC REPORTS")
        self.populate_table('ordoc_reports_templates', self.populate_report_templates)
        self.populate_table('ordoc_reports_reports', self.populate_reports)
        self.populate_table('ordoc_reports_schedules', self.populate_report_schedules)
        self.populate_table('ordoc_reports_shares', self.populate_report_shares)
        self.populate_table('ordoc_reports_metrics', self.populate_report_metrics)
        
        # Ordoc Sign
        print("\n✍️  ORDOC SIGN")
        self.populate_table('ordoc_sign_document_signatures', self.populate_document_signatures)
        self.populate_table('ordoc_sign_signature_audit_logs', self.populate_signature_audit_logs)
        self.populate_table('ordoc_sign_signature_batches', self.populate_signature_batches)
        
        # Relatório Final
        print("\n" + "="*100)
        print("RELATÓRIO FINAL")
        print("="*100 + "\n")
        
        success_count = sum(1 for r in self.results.values() if r['status'] == 'success')
        error_count = sum(1 for r in self.results.values() if r['status'] == 'error')
        total_records = sum(r.get('count', 0) for r in self.results.values())
        
        print(f"✅ Tabelas populadas com sucesso: {success_count}")
        print(f"❌ Tabelas com erro: {error_count}")
        print(f"📊 Total de registros criados: {total_records}")
        
        if error_count > 0:
            print("\n⚠️  Tabelas com erro:")
            for table, result in self.results.items():
                if result['status'] == 'error':
                    print(f"   - {table}: {result['error']}")
        
        print("\n" + "="*100)
        print("✅ POPULAÇÃO FINAL CONCLUÍDA!")
        print("="*100 + "\n")

if __name__ == '__main__':
    try:
        populator = FinalPopulator()
        populator.populate_all()
    except Exception as e:
        print(f"\n❌ ERRO CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
