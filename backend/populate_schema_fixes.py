#!/usr/bin/env python
"""
População Corrigida - 10 Tabelas com Incompatibilidades de Schema
Script com campos corretos baseados nos modelos reais
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

from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import Organization, Document
from ordoc_flow.models import Procedure, Task, ExternalRequester, WorkflowRequest
from ordoc_flow.approval_models import TaskComment, NotificationTemplate
from ordoc_reports.models import ReportTemplate, Report, ReportSchedule, ReportShare, ReportMetric
from ordoc_sign.models import SignatureRequest, SignatureRequestSigner, DocumentSignature, SignatureBatch, DigitalCertificate

User = get_user_model()

class SchemaFixPopulator:
    """Popula as 10 tabelas com campos corrigidos"""
    
    def __init__(self):
        self.user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
        self.ordoc_user = self.user.ordoc_profile
        self.role = UserOrganizationRole.objects.filter(user=self.ordoc_user).first()
        self.org = self.role.organization
        
        # Dados existentes
        self.docs = list(Document.objects.filter(department__organization=self.org)[:20])
        self.procedures = list(Procedure.objects.filter(organization=self.org)[:15])
        self.tasks = list(Task.objects.filter(procedure__organization=self.org)[:20])
        
        self.results = {}
    
    def populate_table(self, table_name, func):
        """Wrapper para popular uma tabela"""
        try:
            count = func()
            self.results[table_name] = {'status': 'success', 'count': count}
            print(f"✅ {table_name:<50} {count:>4} registros")
            return count
        except Exception as e:
            error_msg = str(e)[:150]
            self.results[table_name] = {'status': 'error', 'error': error_msg}
            print(f"❌ {table_name:<50} ERRO: {error_msg}")
            return 0
    
    # =========================================================================
    # ORDOC FLOW - CAMPOS CORRIGIDOS
    # =========================================================================
    
    def populate_task_comments(self):
        """ordoc_flow_task_comments - CORRIGIDO"""
        count = 0
        
        comments = [
            "Tarefa em andamento, previsão de conclusão amanhã.",
            "Aguardando aprovação do cliente.",
            "Documentação atualizada conforme solicitado.",
            "Prazo estendido em 2 dias úteis.",
            "Concluído com sucesso!",
            "Necessário revisar documentação anexa.",
            "Cliente solicitou alterações no escopo."
        ]
        
        for task in self.tasks[:10]:
            for i in range(random.randint(1, 3)):
                comment, created = TaskComment.objects.get_or_create(
                    task=task,
                    created_by=self.ordoc_user,
                    comment=random.choice(comments),
                    defaults={}
                )
                if created:
                    count += 1
        
        return count
    
    def populate_notification_templates(self):
        """ordoc_flow_notification_templates - CORRIGIDO"""
        count = 0
        
        templates_data = [
            {
                'name': 'Nova Tarefa Atribuída',
                'notification_type': 'email',
                'trigger_event': 'task_assigned',
                'subject_template': 'Nova tarefa: {{task.name}}',
                'body_template': 'Você foi atribuído à tarefa {{task.name}}. Prazo: {{task.deadline}}',
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
            {
                'name': 'Tarefa Concluída',
                'notification_type': 'system',
                'trigger_event': 'task_completed',
                'subject_template': 'Tarefa concluída',
                'body_template': 'A tarefa {{task.name}} foi concluída por {{user.name}}.',
            },
            {
                'name': 'Procedimento Iniciado',
                'notification_type': 'email',
                'trigger_event': 'procedure_started',
                'subject_template': 'Novo procedimento iniciado',
                'body_template': 'O procedimento {{procedure.name}} foi iniciado.',
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
        """ordoc_flow_workflowrequest - CORRIGIDO"""
        count = 0
        
        requesters = list(ExternalRequester.objects.filter(organization=self.org)[:5])
        
        if not requesters:
            print("   ⚠️  Nenhum ExternalRequester encontrado - criando um")
            requester, _ = ExternalRequester.objects.get_or_create(
                organization=self.org,
                email='cliente@example.com',
                defaults={
                    'name': 'Cliente Exemplo',
                    'status': 'active'
                }
            )
            requesters = [requester]
        
        for i in range(10):
            request, created = WorkflowRequest.objects.get_or_create(
                organization=self.org,
                requester=random.choice(requesters),
                title=f'Solicitação de Workflow #{i+1}',
                defaults={
                    'description': f'Descrição da solicitação #{i+1}',
                    'status': random.choice(['draft', 'submitted', 'in_progress', 'approved', 'rejected']),
                    'priority': random.choice(['low', 'medium', 'high', 'urgent']),
                    'request_data': {'tipo': 'exemplo', 'dados': 'mock'},
                    'assigned_to': self.ordoc_user if random.choice([True, False]) else None,
                    'due_date': (timezone.now() + timedelta(days=random.randint(1, 30))).date()
                }
            )
            if created:
                count += 1
        
        return count
    
    # =========================================================================
    # ORDOC REPORTS - CAMPOS CORRIGIDOS
    # =========================================================================
    
    def populate_report_templates(self):
        """ordoc_reports_templates - CORRIGIDO (status ao invés de is_active)"""
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
                'category': 'system',
                'type': 'dashboard',
                'description': 'Dashboard de uso de armazenamento'
            },
            {
                'name': 'Tempo Médio de Aprovação',
                'category': 'workflow',
                'type': 'chart',
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
                    'status': 'active',  # CORRIGIDO: usar status ao invés de is_active
                    'query_config': {'filters': {}, 'aggregations': []},
                    'display_config': {'theme': 'modern', 'colors': ['#3B82F6']},
                    'filter_config': {},
                    'export_config': {'formats': ['pdf', 'excel']},
                    'is_public': False,
                    'allowed_roles': ['admin', 'manager'],
                    'created_by': self.ordoc_user
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_reports(self):
        """ordoc_reports_reports"""
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
                        'data': {'rows': random.randint(10, 100), 'generated_at': str(timezone.now())},
                        'error_message': None
                    }
                )
                if created:
                    count += 1
        
        return count
    
    def populate_report_schedules(self):
        """ordoc_reports_schedules"""
        count = 0
        
        templates = list(ReportTemplate.objects.filter(organization=self.org))
        
        for template in templates[:3]:
            schedule, created = ReportSchedule.objects.get_or_create(
                template=template,
                defaults={
                    'frequency': random.choice(['daily', 'weekly', 'monthly']),
                    'day_of_week': random.randint(0, 6) if random.choice([True, False]) else None,
                    'day_of_month': random.randint(1, 28) if random.choice([True, False]) else None,
                    'time_of_day': '09:00:00',
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
        count = 0
        
        reports = list(Report.objects.filter(template__organization=self.org, status='completed'))
        
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
    # ORDOC SIGN - CAMPOS CORRIGIDOS
    # =========================================================================
    
    def populate_document_signatures(self):
        """ordoc_sign_document_signatures - CORRIGIDO"""
        count = 0
        
        requests = list(SignatureRequest.objects.filter(organization=self.org))
        signers = list(SignatureRequestSigner.objects.filter(signature_request__organization=self.org))
        certs = list(DigitalCertificate.objects.filter(user=self.user))
        
        if not certs or not signers:
            print(f"   ⚠️  Certificados: {len(certs)}, Signers: {len(signers)} - insuficiente")
            return 0
        
        for signer in signers[:3]:
            signature, created = DocumentSignature.objects.get_or_create(
                signer=signer,
                document=signer.signature_request.document,
                signature_request=signer.signature_request,
                certificate=certs[0],
                defaults={
                    'organization': self.org,
                    'signature_type': 'digital',
                    'signature_data': 'MOCK_SIGNATURE_DATA_' + uuid.uuid4().hex,
                    'hash_algorithm': 'SHA256',
                    'document_hash': uuid.uuid4().hex,
                    'signing_reason': 'Aprovação de documento',
                    'signing_location': 'São Paulo, Brasil',
                    'status': 'valid',
                    'ip_address': '192.168.1.100',
                    'geolocation': {'lat': -23.5505, 'lng': -46.6333}
                }
            )
            if created:
                count += 1
        
        return count
    
    def populate_signature_batches(self):
        """ordoc_sign_signature_batches - CORRIGIDO (successful_signatures ao invés de signed_documents)"""
        count = 0
        
        from ordoc_sign.models import SignatureTemplate
        templates = list(SignatureTemplate.objects.filter(organization=self.org))
        
        if not templates:
            print("   ⚠️  Nenhum SignatureTemplate encontrado - pulando")
            return 0
        
        for i in range(3):
            batch, created = SignatureBatch.objects.get_or_create(
                organization=self.org,
                name=f'Lote de Assinaturas {i+1}',
                template=templates[0],
                defaults={
                    'description': f'Lote de documentos para assinatura em massa',
                    'status': random.choice(['draft', 'pending', 'completed']),
                    'total_documents': random.randint(5, 20),
                    'processed_documents': random.randint(0, 15),
                    'successful_signatures': random.randint(0, 15),  # CORRIGIDO
                    'failed_signatures': random.randint(0, 2),
                    'auto_send_notifications': True,
                    'created_by': self.user
                }
            )
            
            if created:
                # Adicionar documentos ao batch
                batch.documents.add(*self.docs[:5])
                count += 1
        
        return count
    
    # =========================================================================
    # MAIN
    # =========================================================================
    
    def populate_all(self):
        """Popula todas as 10 tabelas com campos corrigidos"""
        print("\n" + "="*100)
        print("POPULAÇÃO CORRIGIDA - 10 TABELAS COM INCOMPATIBILIDADES DE SCHEMA")
        print("="*100 + "\n")
        
        print(f"👤 Usuário: {self.ordoc_user}")
        print(f"🏢 Organização: {self.org.corporate_name}\n")
        
        print("Populando tabelas...\n")
        
        # Ordoc Flow
        print("⚙️  ORDOC FLOW")
        self.populate_table('ordoc_flow_task_comments', self.populate_task_comments)
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
        self.populate_table('ordoc_sign_signature_batches', self.populate_signature_batches)
        
        # Relatório Final
        print("\n" + "="*100)
        print("RELATÓRIO FINAL")
        print("="*100 + "\n")
        
        success_count = sum(1 for r in self.results.values() if r['status'] == 'success')
        error_count = sum(1 for r in self.results.values() if r['status'] == 'error')
        total_records = sum(r.get('count', 0) for r in self.results.values())
        
        print(f"✅ Tabelas populadas com sucesso: {success_count}/10")
        print(f"❌ Tabelas com erro: {error_count}/10")
        print(f"📊 Total de registros criados: {total_records}")
        
        if error_count > 0:
            print("\n⚠️  Tabelas com erro:")
            for table, result in self.results.items():
                if result['status'] == 'error':
                    print(f"   - {table}: {result['error']}")
        
        print("\n" + "="*100)
        print("✅ POPULAÇÃO CORRIGIDA CONCLUÍDA!")
        print("="*100 + "\n")

if __name__ == '__main__':
    try:
        populator = SchemaFixPopulator()
        populator.populate_all()
    except Exception as e:
        print(f"\n❌ ERRO CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
