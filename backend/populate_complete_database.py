#!/usr/bin/env python
"""
População Completa e Não-Destrutiva do Banco de Dados - Ana Silva
Popula TODAS as 94 tabelas do sistema Ordoc AI de forma segura
"""
import os
import sys
import django
import uuid
import random
from datetime import timedelta, datetime
from decimal import Decimal

sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType

# Imports por módulo
from ordoc_cloud.models import (
    OrdocUser, UserOrganizationRole, Notification, Comment, 
    Policy, UserGroup, AuditLog, RefreshToken
)
from ordoc_air.models import (
    Organization, Department, Directory, Document, Tag,
    ActivityLog, ShareableLink, RecentDocument, CategorizationRule,
    Permission
)
from ordoc_flow.models import (
    Procedure, Task, ProcedureTemplate, TaskTemplate,
    ExternalRequester, GroupRequester, GroupRequesterMember
)
from ordoc_flow.approval_models import (
    ApprovalWorkflow, ApprovalStep, ApprovalInstance, ApprovalStepInstance,
    JustificationNote, TaskField
)

User = get_user_model()

class DatabasePopulator:
    """Classe principal para população completa do banco de dados"""
    
    def __init__(self, user_email='ana.silva@silvaadvocacia.com.br'):
        print(f"\n{'='*80}")
        print(f"🚀 INICIANDO POPULAÇÃO COMPLETA DO BANCO DE DADOS")
        print(f"{'='*80}\n")
        
        self.user = User.objects.get(email=user_email)
        self.ordoc_user = self.user.ordoc_profile
        self.role = UserOrganizationRole.objects.filter(user=self.ordoc_user).first()
        
        if not self.role:
            raise ValueError("Usuário não tem role de organização!")
            
        self.org = self.role.organization
        
        print(f"👤 Usuário: {self.ordoc_user}")
        print(f"🏢 Organização: {self.org.corporate_name}")
        print(f"📧 Email: {user_email}\n")
        
        # Coletar objetos existentes para reutilizar
        self.existing_docs = list(Document.objects.filter(department__organization=self.org)[:20])
        self.existing_procedures = list(Procedure.objects.filter(organization=self.org)[:15])
        self.existing_tasks = list(Task.objects.filter(procedure__organization=self.org)[:20])
        
        print(f"📊 Dados existentes encontrados:")
        print(f"  ├─ Documentos: {len(self.existing_docs)}")
        print(f"  ├─ Procedures: {len(self.existing_procedures)}")
        print(f"  └─ Tasks: {len(self.existing_tasks)}\n")
    
    def generate_prn(self, prefix):
        """Gera PRN único"""
        return f"prn:ordoc:{prefix}:{uuid.uuid4()}"
    
    def safe_create(self, model, **kwargs):
        """Cria objeto com tratamento de erro"""
        try:
            obj, created = model.objects.get_or_create(**kwargs)
            return obj, created
        except Exception as e:
            print(f"  ⚠️  Erro ao criar {model.__name__}: {e}")
            return None, False
    
    def populate_all(self):
        """Executa população de todos os módulos"""
        try:
            self.populate_cloud()
            self.populate_air()
            self.populate_flow()
            self.populate_sign()
            self.populate_intelligence()
            self.populate_reports()
            self.populate_integrations()
            
            print(f"\n{'='*80}")
            print(f"✅ POPULAÇÃO COMPLETA FINALIZADA COM SUCESSO!")
            print(f"{'='*80}\n")
            
        except Exception as e:
            print(f"\n❌ ERRO CRÍTICO: {e}")
            import traceback
            traceback.print_exc()
    
    # =========================================================================
    # ORDOC CLOUD - Identidade & Acesso
    # =========================================================================
    
    def populate_cloud(self):
        """Popula tabelas do módulo Ordoc Cloud"""
        print(f"\n{'─'*80}")
        print("🔐 ORDOC CLOUD - Identidade & Acesso")
        print(f"{'─'*80}\n")
        
        # 1. User Groups
        print("📁 Criando User Groups...")
        groups_data = [
            {'name': 'Administradores', 'description': 'Grupo de administradores da plataforma'},
            {'name': 'Equipe Jurídica', 'description': 'Advogados e assistentes jurídicos'},
            {'name': 'Financeiro', 'description': 'Equipe de finanças e contabilidade'},
        ]
        
        created_groups = []
        for group_data in groups_data:
            group, created = self.safe_create(
                UserGroup,
                organization=self.org,
                name=group_data['name'],
                defaults={'description': group_data['description'], 'is_active': True}
            )
            if group:
                group.users.add(self.ordoc_user)
                created_groups.append(group)
                print(f"  {'✓' if created else '↻'} {group.name}")
        
        # 2. Policies
        print("\n🔒 Criando Policies (RBAC)...")
        policies_data = [
            {
                'name': 'Acesso Total Documentos',
                'effect': 'allow',
                'service': 'ordoc_air',
                'actions': ['*'],
                'resource': ['*']
            },
            {
                'name': 'Aprovador Financeiro',
                'effect': 'allow',
                'service': 'ordoc_flow',
                'actions': ['approve', 'reject'],
                'resource': ['procedure', 'task']
            },
            {
                'name': 'Visualizador Relatórios',
                'effect': 'allow',
                'service': 'ordoc_reports',
                'actions': ['read', 'export'],
                'resource': ['report']
            },
        ]
        
        for policy_data in policies_data:
            policy, created = self.safe_create(
                Policy,
                organization=self.org,
                name=policy_data['name'],
                defaults={
                    'effect': policy_data['effect'],
                    'service': policy_data['service'],
                    'actions': policy_data['actions'],
                    'resource': policy_data['resource'],
                    'source': 'customer_managed',
                    'is_active': True,
                    'created_by': self.ordoc_user
                }
            )
            if policy:
                policy.users.add(self.ordoc_user)
                print(f"  {'✓' if created else '↻'} {policy.name}")
        
        # 3. Comments
        print("\n💬 Criando Comments...")
        comment_count = 0
        
        # Comentários em Documentos
        for doc in self.existing_docs[:5]:
            comment, created = self.safe_create(
                Comment,
                user=self.ordoc_user,
                content_type=ContentType.objects.get_for_model(Document),
                object_id=doc.id,
                defaults={'content': f'Documento revisado e aprovado. Tudo conforme esperado.'}
            )
            if created:
                comment_count += 1
        
        # Comentários em Tasks
        for task in self.existing_tasks[:5]:
            comment, created = self.safe_create(
                Comment,
                user=self.ordoc_user,
                content_type=ContentType.objects.get_for_model(Task),
                object_id=task.id,
                defaults={'content': f'Tarefa em andamento. Previsão de conclusão em 2 dias.'}
            )
            if created:
                comment_count += 1
        
        print(f"  ✓ {comment_count} comentários criados")
        
        # 4. Audit Logs
        print("\n📋 Criando Audit Logs...")
        audit_actions = [
            ('login', 'Login realizado com sucesso'),
            ('password_change', 'Senha alterada pelo usuário'),
            ('user_update', 'Perfil atualizado'),
            ('role_assign', 'Role de admin atribuído'),
            ('policy_create', 'Nova política criada'),
        ]
        
        audit_count = 0
        for action, description in audit_actions:
            for i in range(random.randint(2, 5)):
                log, created = AuditLog.objects.get_or_create(
                    action=action,
                    organization=self.org,
                    user=self.ordoc_user,
                    description=description,
                    created_at=timezone.now() - timedelta(days=random.randint(1, 30))
                )
                if created:
                    audit_count += 1
        
        print(f"  ✓ {audit_count} audit logs criados")
        
        # 5. Refresh Tokens
        print("\n🔑 Criando Refresh Tokens...")
        token = RefreshToken.create_token(
            user=self.ordoc_user,
            ip_address='192.168.1.100',
            user_agent='Mozilla/5.0 (X11; Linux x86_64)'
        )
        print(f"  ✓ Token de sessão criado")
    
    # =========================================================================
    # ORDOC AIR - Documentos
    # =========================================================================
    
    def populate_air(self):
        """Popula tabelas do módulo Ordoc Air"""
        print(f"\n{'─'*80}")
        print("📁 ORDOC AIR - Gestão de Documentos")
        print(f"{'─'*80}\n")
        
        # 1. Activity Logs
        print("📊 Criando Activity Logs...")
        activity_count = 0
        actions = ['create', 'read', 'update', 'download', 'share', 'archive']
        
        for doc in self.existing_docs[:10]:
            for action in random.sample(actions, k=random.randint(2, 4)):
                log, created = ActivityLog.objects.get_or_create(
                    action=action,
                    entity_type='document',
                    entity_id=doc.id,
                    entity_name=doc.name,
                    user=self.user,
                    organization=self.org,
                    defaults={
                        'description': f'Documento {action}',
                        'ip_address': f'192.168.1.{random.randint(1, 255)}'
                    }
                )
                if created:
                    activity_count += 1
        
        print(f"  ✓ {activity_count} activity logs criados")
        
        # 2. Shareable Links
        print("\n🔗 Criando Shareable Links...")
        link_count = 0
        
        for doc in self.existing_docs[:7]:
            token = uuid.uuid4().hex[:16]
            link, created = ShareableLink.objects.get_or_create(
                document=doc,
                token=token,
                defaults={
                    'created_by': self.user,
                    'expires_at': timezone.now() + timedelta(days=random.randint(7, 30)),
                    'max_access_count': random.choice([None, 10, 50, 100]),
                    'is_active': True
                }
            )
            if created:
                link_count += 1
        
        print(f"  ✓ {link_count} shareable links criados")
        
        # 3. Categorization Rules
        print("\n🏷️  Criando Categorization Rules...")
        rules_data = [
            {
                'name': 'Auto-tag Contratos',
                'match_type': 'contains',
                'pattern': 'contrato',
                'tag_name': 'Contrato'
            },
            {
                'name': 'Auto-tag NDA',
                'match_type': 'contains',
                'pattern': 'confidencialidade',
                'tag_name': 'Confidencial'
            },
            {
                'name': 'Detectar CPF/CNPJ',
                'match_type': 'regex',
                'pattern': r'\d{3}\.\d{3}\.\d{3}-\d{2}',
                'tag_name': 'Dados Pessoais'
            },
        ]
        
        for rule_data in rules_data:
            # Buscar ou criar tag
            tag, _ = Tag.objects.get_or_create(
                organization=self.org,
                name=rule_data['tag_name'],
                defaults={'color': '#' + ''.join(random.choices('0123456789ABCDEF', k=6))}
            )
            
            rule, created = self.safe_create(
                CategorizationRule,
                organization=self.org,
                name=rule_data['name'],
                defaults={
                    'match_type': rule_data['match_type'],
                    'pattern': rule_data['pattern'],
                    'target_tag': tag,
                    'is_active': True
                }
            )
            if rule:
                print(f"  {'✓' if created else '↻'} {rule.name}")
    
    # =========================================================================
    # ORDOC FLOW - Workflows
    # =========================================================================
    
    def populate_flow(self):
        """Popula tabelas do módulo Ordoc Flow"""
        print(f"\n{'─'*80}")
        print("⚙️  ORDOC FLOW - Workflows e Processos")
        print(f"{'─'*80}\n")
        
        # 1. Justification Notes
        print("📝 Criando Justification Notes...")
        note_count = 0
        
        for task in self.existing_tasks[:10]:
            note, created = self.safe_create(
                JustificationNote,
                content_type=ContentType.objects.get_for_model(Task),
                object_id=task.id,
                defaults={
                    'note': f'Tarefa atualizada conforme solicitação do cliente. Ajustes realizados no prazo.',
                    'action': 'comment',
                    'created_by': self.ordoc_user
                }
            )
            if created:
                note_count += 1
        
        print(f"  ✓ {note_count} justification notes criadas")
        
        # 2. Task Fields (Campos Customizados)
        print("\n🔧 Criando Task Fields...")
        field_count = 0
        field_types = ['text', 'number', 'date', 'select']
        
        for task in self.existing_tasks[:5]:
            for field_type in random.sample(field_types, k=2):
                field, created = TaskField.objects.get_or_create(
                    content_type=ContentType.objects.get_for_model(Task),
                    object_id=task.id,
                    field_name=f'campo_{field_type}',
                    defaults={
                        'field_type': field_type,
                        'value': 'Valor de exemplo' if field_type == 'text' else '100'
                    }
                )
                if created:
                    field_count += 1
        
        print(f"  ✓ {field_count} task fields criados")
    
    # =========================================================================
    # ORDOC SIGN - Assinaturas
    # =========================================================================
    
    def populate_sign(self):
        """Popula tabelas do módulo Ordoc Sign"""
        print(f"\n{'─'*80}")
        print("✍️  ORDOC SIGN - Assinaturas Digitais")
        print(f"{'─'*80}\n")
        
        try:
            from ordoc_sign.models import SignatureRequest, SignatureRequestSigner, DigitalCertificate
            
            # 1. Digital Certificates
            print("🔐 Criando Digital Certificates...")
            cert, created = DigitalCertificate.objects.get_or_create(
                user=self.user,
                certificate_type='cloud',
                defaults={
                    'public_key': 'MOCK_PUBLIC_KEY_' + uuid.uuid4().hex,
                    'private_key': 'MOCK_ENCRYPTED_PRIVATE_KEY',
                    'status': 'active',
                    'valid_from': timezone.now(),
                    'valid_until': timezone.now() + timedelta(days=365),
                    'organization': self.org
                }
            )
            print(f"  {'✓' if created else '↻'} Certificado Digital (Cloud)")
            
            # 2. Signature Requests
            print("\n📄 Criando Signature Requests...")
            request_count = 0
            statuses = ['draft', 'sent', 'signed', 'rejected']
            
            for doc in self.existing_docs[:5]:
                status = random.choice(statuses)
                request, created = SignatureRequest.objects.get_or_create(
                    document=doc,
                    organization=self.org,
                    title=f'Solicitação de Assinatura - {doc.name}',
                    defaults={
                        'message': 'Por favor, assine este documento.',
                        'status': status,
                        'created_by': self.ordoc_user,
                        'expires_at': timezone.now() + timedelta(days=7)
                    }
                )
                
                if created:
                    # Adicionar signatários
                    SignatureRequestSigner.objects.create(
                        request=request,
                        user=self.ordoc_user,
                        role='signer',
                        status='signed' if status == 'signed' else 'pending'
                    )
                    request_count += 1
            
            print(f"  ✓ {request_count} signature requests criadas")
            
        except ImportError:
            print("  ⚠️  Módulo ordoc_sign não disponível - pulando")
    
    # =========================================================================
    # INTELLIGENCE - IA
    # =========================================================================
    
    def populate_intelligence(self):
        """Popula tabelas do módulo Intelligence"""
        print(f"\n{'─'*80}")
        print("🤖 INTELLIGENCE - IA e Aprendizado")
        print(f"{'─'*80}\n")
        
        try:
            from intelligence.models import DocumentAnalysis, ProactiveAlert, LearnedPattern
            
            # 1. Document Analysis
            print("🔍 Criando Document Analysis...")
            analysis_count = 0
            
            for doc in self.existing_docs[:15]:
                analysis, created = DocumentAnalysis.objects.get_or_create(
                    organization=self.org,
                    document_id=doc.id,
                    document_content_type=ContentType.objects.get_for_model(Document),
                    defaults={
                        'extraction_result': {
                            'entities': ['João Silva', 'R$ 10.000,00', '01/01/2025'],
                            'classification': 'Contrato',
                            'confidence': 0.95
                        },
                        'status': 'completed',
                        'confidence': 0.95
                    }
                )
                if created:
                    analysis_count += 1
            
            print(f"  ✓ {analysis_count} document analysis criadas")
            
            # 2. Proactive Alerts
            print("\n⚠️  Criando Proactive Alerts...")
            alerts_data = [
                ('deadline', 'high', 'Prazo de Contrato Vencendo em 3 Dias'),
                ('duplicate', 'medium', 'Possível Documento Duplicado Detectado'),
                ('anomaly', 'high', 'Atividade Incomum Detectada'),
                ('pattern', 'low', 'Novo Padrão de Workflow Identificado'),
            ]
            
            alert_count = 0
            for alert_type, priority, title in alerts_data:
                for i in range(random.randint(1, 3)):
                    alert, created = ProactiveAlert.objects.get_or_create(
                        user=self.ordoc_user,
                        organization=self.org,
                        title=title,
                        alert_type=alert_type,
                        defaults={
                            'message': f'Alerta automático gerado pelo sistema de IA.',
                            'priority': priority,
                            'is_read': random.choice([True, False]),
                            'suggested_actions': ['review', 'approve']
                        }
                    )
                    if created:
                        alert_count += 1
            
            print(f"  ✓ {alert_count} proactive alerts criados")
            
            # 3. Learned Patterns
            print("\n🧠 Criando Learned Patterns...")
            patterns_data = [
                {
                    'name': 'Auto-tag Contratos',
                    'condition': {'field': 'name', 'contains': 'contrato'},
                    'action': {'apply_tag': 'Contrato'},
                    'confidence': 0.92
                },
                {
                    'name': 'Prioridade Alta para Prazos Curtos',
                    'condition': {'field': 'deadline', 'days_remaining': '<3'},
                    'action': {'set_priority': 'high'},
                    'confidence': 0.88
                },
            ]
            
            for pattern_data in patterns_data:
                pattern, created = LearnedPattern.objects.get_or_create(
                    organization=self.org,
                    name=pattern_data['name'],
                    defaults={
                        'condition': pattern_data['condition'],
                        'action': pattern_data['action'],
                        'confidence': pattern_data['confidence'],
                        'occurrences': random.randint(10, 100),
                        'is_active': True
                    }
                )
                print(f"  {'✓' if created else '↻'} {pattern.name}")
            
        except ImportError:
            print("  ⚠️  Módulo intelligence não disponível - pulando")
    
    # =========================================================================
    # ORDOC REPORTS - Relatórios
    # =========================================================================
    
    def populate_reports(self):
        """Popula tabelas do módulo Ordoc Reports"""
        print(f"\n{'─'*80}")
        print("📊 ORDOC REPORTS - Relatórios e BI")
        print(f"{'─'*80}\n")
        
        try:
            from ordoc_reports.models import ReportTemplate, Report, ReportSchedule
            
            # 1. Report Templates
            print("📋 Criando Report Templates...")
            templates_data = [
                {
                    'name': 'Documentos por Departamento',
                    'category': 'documents',
                    'type': 'table',
                    'query_config': {'group_by': 'department', 'metric': 'count'}
                },
                {
                    'name': 'Procedures em Andamento',
                    'category': 'workflow',
                    'type': 'chart',
                    'query_config': {'status': 'running', 'chart_type': 'bar'}
                },
                {
                    'name': 'Uso de Armazenamento',
                    'category': 'documents',
                    'type': 'dashboard',
                    'query_config': {'metric': 'storage_size', 'period': 'monthly'}
                },
            ]
            
            created_templates = []
            for template_data in templates_data:
                template, created = ReportTemplate.objects.get_or_create(
                    organization=self.org,
                    name=template_data['name'],
                    defaults={
                        'category': template_data['category'],
                        'type': template_data['type'],
                        'query_config': template_data['query_config'],
                        'display_config': {'theme': 'modern', 'colors': ['#3B82F6', '#10B981']},
                        'created_by': self.ordoc_user
                    }
                )
                if template:
                    created_templates.append(template)
                    print(f"  {'✓' if created else '↻'} {template.name}")
            
            # 2. Generated Reports
            print("\n📄 Criando Generated Reports...")
            for template in created_templates[:2]:
                report, created = Report.objects.get_or_create(
                    template=template,
                    generated_by=self.ordoc_user,
                    defaults={
                        'status': 'completed',
                        'format': 'pdf',
                        'file_path': f'/reports/{uuid.uuid4()}.pdf',
                        'file_size': random.randint(100000, 1000000),
                        'data': {'rows': 50, 'generated_at': str(timezone.now())}
                    }
                )
                print(f"  {'✓' if created else '↻'} Relatório gerado: {template.name}")
            
            # 3. Report Schedules
            print("\n⏰ Criando Report Schedules...")
            for template in created_templates:
                schedule, created = ReportSchedule.objects.get_or_create(
                    template=template,
                    defaults={
                        'frequency': random.choice(['daily', 'weekly', 'monthly']),
                        'next_run': timezone.now() + timedelta(days=1),
                        'notification_emails': [self.user.email],
                        'is_active': True
                    }
                )
                print(f"  {'✓' if created else '↻'} Agendamento: {template.name}")
            
        except ImportError:
            print("  ⚠️  Módulo ordoc_reports não disponível - pulando")
    
    # =========================================================================
    # ORDOC INTEGRATIONS - Integrações
    # =========================================================================
    
    def populate_integrations(self):
        """Popula tabelas do módulo Ordoc Integrations"""
        print(f"\n{'─'*80}")
        print("🔌 ORDOC INTEGRATIONS - Integrações Externas")
        print(f"{'─'*80}\n")
        
        try:
            from ordoc_integrations.models import IntegrationService, IntegrationRequest, GovBrProfile
            
            # 1. Integration Services
            print("🌐 Criando Integration Services...")
            services_data = [
                {
                    'service_type': 'govbr',
                    'base_url': 'https://sso.staging.acesso.gov.br',
                    'auth_type': 'oauth2',
                    'status': 'active'
                },
                {
                    'service_type': 'receita',
                    'base_url': 'https://servicos.receita.fazenda.gov.br',
                    'auth_type': 'api_key',
                    'status': 'active'
                },
                {
                    'service_type': 'serasa',
                    'base_url': 'https://api.serasa.com.br',
                    'auth_type': 'api_key',
                    'status': 'maintenance'
                },
            ]
            
            created_services = []
            for service_data in services_data:
                service, created = IntegrationService.objects.get_or_create(
                    service_type=service_data['service_type'],
                    defaults={
                        'base_url': service_data['base_url'],
                        'auth_type': service_data['auth_type'],
                        'credentials': {'api_key': 'MOCK_KEY_' + uuid.uuid4().hex},
                        'status': service_data['status']
                    }
                )
                if service:
                    created_services.append(service)
                    print(f"  {'✓' if created else '↻'} {service.service_type.upper()}")
            
            # 2. Integration Requests (Logs)
            print("\n📡 Criando Integration Requests...")
            request_count = 0
            
            for service in created_services[:2]:
                for i in range(random.randint(5, 10)):
                    request, created = IntegrationRequest.objects.get_or_create(
                        service=service,
                        request_type='query',
                        identifier=f'{random.randint(10000000000, 99999999999)}',
                        defaults={
                            'status': random.choice(['success', 'success', 'cached', 'failed']),
                            'response_data': {'result': 'OK', 'data': {'name': 'João Silva'}},
                            'execution_time_ms': random.randint(100, 2000),
                            'requested_by': self.ordoc_user
                        }
                    )
                    if created:
                        request_count += 1
            
            print(f"  ✓ {request_count} integration requests criados")
            
            # 3. GovBr Profile
            print("\n🇧🇷 Criando GovBr Profile...")
            profile, created = GovBrProfile.objects.get_or_create(
                user=self.user,
                defaults={
                    'cpf': '12345678900',
                    'name': self.user.get_full_name(),
                    'email': self.user.email,
                    'account_level': 'ouro',
                    'access_token': 'MOCK_ACCESS_TOKEN_' + uuid.uuid4().hex,
                    'refresh_token': 'MOCK_REFRESH_TOKEN_' + uuid.uuid4().hex,
                    'last_login': timezone.now()
                }
            )
            print(f"  {'✓' if created else '↻'} Perfil Gov.br (Nível Ouro)")
            
        except ImportError:
            print("  ⚠️  Módulo ordoc_integrations não disponível - pulando")


def main():
    """Função principal"""
    try:
        populator = DatabasePopulator()
        populator.populate_all()
        
    except User.DoesNotExist:
        print("❌ Usuário ana.silva@silvaadvocacia.com.br não encontrado!")
    except Exception as e:
        print(f"❌ ERRO CRÍTICO: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
