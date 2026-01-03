"""
Script para popular o banco de dados com documentos de teste para MÚLTIPLOS perfis de usuários.
Gera organizações, usuários e documentos inteligentes específicos para cada área (Direito, Saúde, Design, Gov).

Uso:
    python manage.py populate_demo_data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.utils import timezone
from ordoc_air.models import Document, Department, Directory, Organization
from ordoc_cloud.models import OrdocUser, UserOrganizationRole
import random
import uuid

class Command(BaseCommand):
    help = 'Popula dados de demonstração para diversos perfis de usuários.'

    def handle(self, *args, **options):
        # Definição dos perfis e seus dados
        personas = [
            {
                'email': 'socio@moura.law', 'password': 'password123', 'name': 'Roberto Moura', 
                'org': 'Moura Advogados', 'role': 'lawyer', 'sector': 'Advocacia'
            },
            {
                'email': 'dr.carlos@cardiovida.med.br','password': 'medico123', 'name': 'Dr. Carlos Santos', 
                'org': 'CardioVida Clínica', 'role': 'doctor', 'sector': 'Saúde'
            },
            {
                'email': 'roberto.oliveira@prefeitura.sp.gov.br', 'password': 'servidor123', 'name': 'Roberto Oliveira', 
                'org': 'Prefeitura SP', 'role': 'gov', 'sector': 'Governo'
            },
            {
                'email': 'juliana.costa@julianadesign.com.br', 'password': 'designer123', 'name': 'Juliana Costa', 
                'org': 'Juliana Design', 'role': 'designer', 'sector': 'Design'
            }
        ]

        for p in personas:
            self.stdout.write(self.style.HTTP_INFO(f"\n--- Processando {p['name']} ({p['role']}) ---"))
            
            # 1. Configurar Usuário e Organização
            user, org, dept, directory = self.setup_user_structure(p)
            
            # 2. Gerar Documentos Específicos
            self.generate_documents(user, org, dept, directory, p['role'])

    def setup_user_structure(self, p):
        # Usuário
        user, created = User.objects.get_or_create(
            email=p['email'],
            username=p['email'].split('@')[0],
            defaults={'first_name': p['name'].split()[0], 'last_name': ' '.join(p['name'].split()[1:])}
        )
        if created:
            user.set_password(p['password'])
            user.save()
            self.stdout.write(f"  + Usuário criado: {user.email}")

        # OrdocUser
        ordoc_user, _ = OrdocUser.objects.get_or_create(user=user, defaults={'status': 'active'})
        
        # Organização (baseado no dominio)
        subdomain = p['email'].split('@')[1].split('.')[0] # ex: moura
        org_id = uuid.uuid4()
        
        org, created = Organization.objects.get_or_create(
            subdomain=subdomain,
            defaults={
                'id': org_id,
                'corporate_name': p['org'],
                'prn': f"prn:ordoc:org:{org_id}",
                'cnpj': f"{random.randint(10000000, 99999999)}0001{random.randint(10, 99)}",
                'is_active': True
            }
        )
        
        # Vínculo
        UserOrganizationRole.objects.get_or_create(
            user=ordoc_user, organization=org,
            defaults={'role': 'admin' if 'socio' in p['email'] else 'organization_member', 'is_primary': True}
        )
        
        # Departamento
        dept_name = 'Geral'
        if p['role'] == 'lawyer': dept_name = 'Jurídico'
        elif p['role'] == 'doctor': dept_name = 'Clínico'
        elif p['role'] == 'designer': dept_name = 'Criação'
        elif p['role'] == 'gov': dept_name = 'Administrativo'
        
        dept, _ = Department.objects.get_or_create(
            organization=org, name=dept_name,
            defaults={'prn': f"prn:ordoc:dept:{org.id}:{dept_name.lower()}"}
        )
        
        # Diretório
        directory, _ = Directory.objects.get_or_create(
            department=dept, name='Documentos',
            defaults={'path': '/Documentos', 'prn': f"prn:ordoc:dir:{dept.id}:docs"}
        )
        
        # Criar equipe extra para Moura Advogados
        if 'socio' in p['email']:
            for member in ['senior', 'pleno', 'paralegal']:
                m_email = f"{member}@moura.law"
                m_user, _ = User.objects.get_or_create(
                    username=member, email=m_email,
                    defaults={'first_name': member.capitalize(), 'last_name': 'Moura Team'}
                )
                m_user.set_password('password123')
                m_user.save()
                
                m_ordoc, _ = OrdocUser.objects.get_or_create(user=m_user, defaults={'status': 'active'})
                UserOrganizationRole.objects.get_or_create(
                    user=m_ordoc, organization=org,
                    defaults={'role': 'lawyer' if member != 'paralegal' else 'paralegal', 'is_primary': True}
                )
                self.stdout.write(f"  + Membro equipe criado: {m_email}")

        return user, org, dept, directory

    def generate_documents(self, user, org, dept, directory, role):
        # Templates de documentos por role
        templates = []
        
        if role == 'lawyer':
            templates = [
                {'name': 'Contrato de Prestação de Serviços.pdf', 'type': 'contract', 'days_deadline': 365, 'flags': ['signature']},
                {'name': 'Petição Inicial - Caso Silva.pdf', 'type': 'petition', 'days_deadline': 15, 'flags': ['deadline']},
                {'name': 'Recurso de Apelação.pdf', 'type': 'petition', 'days_deadline': 8, 'flags': ['deadline', 'critical']},
                {'name': 'Procuração Ad Judicia.pdf', 'type': 'power_of_attorney', 'flags': ['signature', 'lgpd']},
                {'name': 'Fatura Honorários 001.pdf', 'type': 'invoice', 'days_deadline': 5, 'flags': ['finance']},
                {'name': 'Certidão Negativa.pdf', 'type': 'certificate', 'flags': ['public']},
            ]
        elif role == 'doctor':
             templates = [
                {'name': 'Prontuário - Paciente João.pdf', 'type': 'medical_record', 'flags': ['lgpd', 'critical']},
                {'name': 'Exames de Sangue - Maria.pdf', 'type': 'exam_result', 'flags': ['lgpd']},
                {'name': 'Receita Médica.pdf', 'type': 'prescription', 'flags': ['signature']},
                {'name': 'Atestado Médico.pdf', 'type': 'certificate', 'flags': ['signature']},
                {'name': 'Fatura Plano de Saúde.pdf', 'type': 'invoice', 'days_deadline': 30, 'flags': ['finance']},
            ]
        elif role == 'designer':
             templates = [
                {'name': 'Briefing - Logo Startup.pdf', 'type': 'briefing', 'flags': []},
                {'name': 'Contrato Design - Cliente X.pdf', 'type': 'contract', 'days_deadline': 180, 'flags': ['signature']},
                {'name': 'Proposta Comercial - Website.pdf', 'type': 'proposal', 'days_deadline': 7, 'flags': ['deadline']},
                {'name': 'Assets V1.zip', 'type': 'other', 'flags': []},
                {'name': 'Layout Final.png', 'type': 'image', 'flags': ['external']},
            ]
        elif role == 'gov':
             templates = [
                {'name': 'Decreto Municipal 123.pdf', 'type': 'decree', 'flags': ['public', 'signature']},
                {'name': 'Edital de Licitação 05-2026.pdf', 'type': 'edict', 'flags': ['public', 'deadline']},
                {'name': 'Ofício Interno 44.pdf', 'type': 'memo', 'flags': []},
                {'name': 'Diário Oficial 03-01.pdf', 'type': 'diary', 'flags': ['public', 'external']},
                {'name': 'Ata de Reunião.pdf', 'type': 'minutes', 'flags': []},
            ]

        count = 0
        for t in templates:
            # Check exist
            if Document.objects.filter(name=t['name'], department=dept).exists():
                continue
                
            # Create content
            content = b"Dummy content for demonstration purposes."
            django_file = ContentFile(content, name=t['name'])
            
            doc = Document(
                name=t['name'],
                description=f"Documento demonstrativo: {t['name']}",
                file_size=len(content),
                mime_type='application/pdf' if t['name'].endswith('.pdf') else 'application/octet-stream',
                prn=f"prn:ordoc:doc:{uuid.uuid4()}",
                version=1,
                is_current_version=True,
                status='active',
                directory=directory,
                department=dept,
                created_by=user,
                updated_by=user,
                # Intelligent Fields
                document_type=t.get('type', 'other'),
                has_deadline='days_deadline' in t,
                deadline_date=timezone.now() + timezone.timedelta(days=t.get('days_deadline', 0)) if 'days_deadline' in t else None,
                is_public='public' in t['flags'],
                is_from_external_source='external' in t['flags'],
                requires_signature='signature' in t['flags'], 
                contains_sensitive_data='lgpd' in t['flags']
            )
            
            # Map specific keywords to fields
            if 'signature' in t['flags']: doc.requires_signature = True
            if 'lgpd' in t['flags']: doc.contains_sensitive_data = True
            if 'critical' in t['flags']: doc.criticality = 'high'
            
            doc.file.save(t['name'], django_file, save=False)
            doc.save()
            count += 1
            
        self.stdout.write(self.style.SUCCESS(f"  + Gerados {count} documentos novos"))
