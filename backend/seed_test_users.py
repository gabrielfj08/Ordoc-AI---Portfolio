#!/usr/bin/env python
"""
Script para criar usuários de teste e popular banco de dados
com dados específicos para cada role (Sócio, Sênior, Pleno, Paralegal)
"""
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import Organization, Department, Document
from ordoc_flow.models import Procedure, Task, ProcedureTemplate
from django.utils import timezone
import random

def create_organization():
    """Cria organização Moura & Advogados"""
    org, created = Organization.objects.get_or_create(
        cnpj='12345678000190',
        defaults={
            'corporate_name': 'Moura & Advogados Associados',
            'email': 'contato@moura.law',
            'phone': '1133334444',
            'contact_name': 'Dr. Moura',
            'contact_phone': '11999998888',
            'subdomain': 'moura',
            'prn': 'ORG-MOURA-001',
            'is_active': True,
        }
    )
    if created:
        print(f"✅ Organização criada: {org.corporate_name}")
    else:
        print(f"ℹ️  Organização já existe: {org.corporate_name}")
    return org

def create_departments(org):
    """Cria departamentos para diferentes áreas"""
    departments = [
        {
            'name': 'Societário',
            'description': 'Departamento de direito societário e M&A',
            'prn': f'DEPT-{org.prn}-SOC',
        },
        {
            'name': 'Trabalhista',
            'description': 'Departamento de direito do trabalho',
            'prn': f'DEPT-{org.prn}-TRAB',
        },
        {
            'name': 'Tributário',
            'description': 'Departamento de direito tributário',
            'prn': f'DEPT-{org.prn}-TRIB',
        },
        {
            'name': 'Administrativo',
            'description': 'Suporte administrativo',
            'prn': f'DEPT-{org.prn}-ADM',
        },
    ]

    created_depts = []
    for dept_data in departments:
        dept, created = Department.objects.get_or_create(
            organization=org,
            name=dept_data['name'],
            defaults={
                'description': dept_data['description'],
                'prn': dept_data['prn'],
                'is_active': True,
            }
        )
        created_depts.append(dept)
        if created:
            print(f"✅ Departamento criado: {dept.name}")
        else:
            print(f"ℹ️  Departamento já existe: {dept.name}")

    return created_depts

def create_test_users(org, departments):
    """Cria os 4 usuários de teste com diferentes roles"""

    users_data = [
        {
            'email': 'socio@moura.law',
            'password': 'password123',
            'first_name': 'Alberto',
            'last_name': 'Moura',
            'role': 'admin',
            'department': None,  # Sócio vê tudo
        },
        {
            'email': 'senior@moura.law',
            'password': 'password123',
            'first_name': 'Carla',
            'last_name': 'Ferreira',
            'role': 'organization_manager',
            'department': departments[0],  # Societário
        },
        {
            'email': 'pleno@moura.law',
            'password': 'password123',
            'first_name': 'Ricardo',
            'last_name': 'Santos',
            'role': 'department_manager',
            'department': departments[1],  # Trabalhista
        },
        {
            'email': 'paralegal@moura.law',
            'password': 'password123',
            'first_name': 'Julia',
            'last_name': 'Costa',
            'role': 'organization_member',
            'department': departments[3],  # Administrativo
        },
    ]

    created_users = {}

    for user_data in users_data:
        # Criar ou obter User do Django
        django_user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['email'].split('@')[0],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'is_active': True,
            }
        )

        if created:
            django_user.set_password(user_data['password'])
            django_user.save()
            print(f"✅ User Django criado: {django_user.email}")
        else:
            print(f"ℹ️  User Django já existe: {django_user.email}")

        # Criar ou obter OrdocUser
        ordoc_user, created = OrdocUser.objects.get_or_create(
            user=django_user,
            defaults={
                'status': 'active',
                'must_change_password': False,
            }
        )

        if created:
            print(f"✅ OrdocUser criado: {ordoc_user}")

        # Criar role
        role, created = UserOrganizationRole.objects.get_or_create(
            user=ordoc_user,
            organization=org,
            role=user_data['role'],
            defaults={
                'is_active': True,
                'is_primary': True,
            }
        )

        if created:
            print(f"✅ Role criado: {user_data['role']} para {django_user.email}")

        created_users[user_data['email']] = {
            'django_user': django_user,
            'ordoc_user': ordoc_user,
            'department': user_data['department'],
            'role': user_data['role'],
        }

    return created_users

def create_documents_for_users(org, users, departments):
    """Cria documentos específicos para cada usuário/departamento"""

    doc_types = ['Contrato', 'Procuração', 'Petição', 'Parecer', 'Ata']

    # Documentos do Sócio (público para todos)
    socio = users['socio@moura.law']
    for i in range(5):
        Document.objects.create(
            organization=org,
            uploaded_by=socio['django_user'],
            file_name=f'Contrato_Sociedade_{i+1}.pdf',
            title=f'Contrato de Sociedade #{i+1}',
            description='Documento institucional - visível para todos',
            file_size=random.randint(100000, 5000000),
            file_type='application/pdf',
            status='active',
        )
    print(f"✅ Criados 5 documentos do Sócio (públicos)")

    # Documentos do Sênior (Societário)
    senior = users['senior@moura.law']
    dept_societario = departments[0]
    for i in range(8):
        Document.objects.create(
            organization=org,
            uploaded_by=senior['django_user'],
            department=dept_societario,
            file_name=f'M&A_Deal_{i+1}.pdf',
            title=f'Operação M&A Cliente {chr(65+i)}',
            description='Documento de M&A - restrito ao departamento Societário',
            file_size=random.randint(100000, 5000000),
            file_type='application/pdf',
            status='active',
        )
    print(f"✅ Criados 8 documentos do Sênior (Societário)")

    # Documentos do Pleno (Trabalhista)
    pleno = users['pleno@moura.law']
    dept_trabalhista = departments[1]
    for i in range(6):
        Document.objects.create(
            organization=org,
            uploaded_by=pleno['django_user'],
            department=dept_trabalhista,
            file_name=f'Processo_Trabalhista_{i+1}.pdf',
            title=f'Processo Trabalhista #{1000+i}',
            description='Processo trabalhista - restrito ao departamento Trabalhista',
            file_size=random.randint(100000, 5000000),
            file_type='application/pdf',
            status='active',
        )
    print(f"✅ Criados 6 documentos do Pleno (Trabalhista)")

    # Documentos do Paralegal (seus próprios)
    paralegal = users['paralegal@moura.law']
    dept_adm = departments[3]
    for i in range(4):
        Document.objects.create(
            organization=org,
            uploaded_by=paralegal['django_user'],
            department=dept_adm,
            file_name=f'Documento_Administrativo_{i+1}.pdf',
            title=f'Doc Administrativo #{i+1}',
            description='Documento administrativo - restrito ao paralegal',
            file_size=random.randint(100000, 5000000),
            file_type='application/pdf',
            status='active',
        )
    print(f"✅ Criados 4 documentos do Paralegal (Administrativo)")

def create_procedures_and_tasks(org, users, departments):
    """Cria procedures e tasks específicas para cada usuário"""

    # Template de procedure
    template, _ = ProcedureTemplate.objects.get_or_create(
        name='Processo Judicial Padrão',
        defaults={
            'description': 'Template padrão para processos judiciais',
            'status': 'active',
        }
    )

    # Procedures e Tasks do Sócio (estratégicas)
    socio_ordoc = users['socio@moura.law']['ordoc_user']
    for i in range(3):
        proc = Procedure.objects.create(
            organization=org,
            name=f'Estratégia Corporativa {i+1}',
            description='Projeto estratégico - visível para todos',
            status='running',
            priority='high',
            procedure_template=template,
            requester=socio_ordoc,
        )

        # Tasks estratégicas
        for j in range(2):
            Task.objects.create(
                procedure=proc,
                name=f'Análise Estratégica {j+1}',
                description='Task de alto nível - Sócio pode delegar',
                status='running',
                priority='high',
                assignee=socio_ordoc,
            )
    print(f"✅ Criados 3 procedures e 6 tasks do Sócio")

    # Procedures do Sênior (Societário)
    senior_ordoc = users['senior@moura.law']['ordoc_user']
    dept_societario = departments[0]
    for i in range(5):
        proc = Procedure.objects.create(
            organization=org,
            name=f'Operação M&A {chr(65+i)}',
            description='Due diligence e estruturação societária',
            status='started',
            priority='high' if i < 2 else 'normal',
            procedure_template=template,
            requester=senior_ordoc,
        )

        # Tasks do Sênior
        for j in range(4):
            Task.objects.create(
                procedure=proc,
                name=f'Due Diligence - Item {j+1}',
                description=f'Análise societária - restrito ao Sênior',
                status=random.choice(['running', 'started']),
                priority=random.choice(['high', 'normal']),
                assignee=senior_ordoc,
                deadline=timezone.now() + timedelta(days=random.randint(5, 30)),
            )
    print(f"✅ Criados 5 procedures e 20 tasks do Sênior")

    # Procedures do Pleno (Trabalhista)
    pleno_ordoc = users['pleno@moura.law']['ordoc_user']
    dept_trabalhista = departments[1]
    for i in range(4):
        proc = Procedure.objects.create(
            organization=org,
            name=f'Processo Trabalhista #{1000+i}',
            description='Reclamação trabalhista',
            status='started',
            priority='normal',
            procedure_template=template,
            requester=pleno_ordoc,
        )

        # Tasks do Pleno
        for j in range(3):
            Task.objects.create(
                procedure=proc,
                name=f'Petição/Contestação {j+1}',
                description='Task trabalhista - restrito ao Pleno',
                status=random.choice(['running', 'started', 'finished']),
                priority='normal',
                assignee=pleno_ordoc,
                deadline=timezone.now() + timedelta(days=random.randint(3, 15)),
            )
    print(f"✅ Criados 4 procedures e 12 tasks do Pleno")

    # Tasks do Paralegal (suporte)
    paralegal_ordoc = users['paralegal@moura.law']['ordoc_user']
    # Paralegal apoia procedures existentes
    all_procedures = Procedure.objects.filter(organization=org)[:8]
    task_count = 0
    for proc in all_procedures:
        for j in range(2):
            Task.objects.create(
                procedure=proc,
                name=f'Suporte Administrativo {j+1}',
                description='Task de suporte - atribuída ao Paralegal',
                status=random.choice(['running', 'started']),
                priority='low',
                assignee=paralegal_ordoc,
                deadline=timezone.now() + timedelta(days=random.randint(1, 10)),
            )
            task_count += 1
    print(f"✅ Criadas {task_count} tasks do Paralegal (suporte)")

def main():
    print("\n" + "="*60)
    print("🌱 SEED: Populando Banco de Dados")
    print("="*60 + "\n")

    # 1. Criar organização
    org = create_organization()

    # 2. Criar departamentos
    departments = create_departments(org)

    # 3. Criar usuários com roles
    users = create_test_users(org, departments)

    # 4. Criar documentos específicos
    print("\n📄 Criando documentos...")
    create_documents_for_users(org, users, departments)

    # 5. Criar procedures e tasks
    print("\n📋 Criando procedures e tasks...")
    create_procedures_and_tasks(org, users, departments)

    print("\n" + "="*60)
    print("✅ SEED CONCLUÍDO COM SUCESSO!")
    print("="*60)

    # Resumo
    print("\n📊 RESUMO:")
    print(f"Organizations: {Organization.objects.count()}")
    print(f"Departments: {Department.objects.count()}")
    print(f"Users: {OrdocUser.objects.count()}")
    print(f"Documents: {Document.objects.count()}")
    print(f"Procedures: {Procedure.objects.count()}")
    print(f"Tasks: {Task.objects.count()}")

    print("\n👥 USUÁRIOS DE TESTE:")
    print("─" * 60)
    for email, data in users.items():
        role_display = UserOrganizationRole.objects.get(user=data['ordoc_user']).get_role_display()
        dept = data['department'].name if data['department'] else "Todos os departamentos"
        print(f"📧 {email}")
        print(f"   Nome: {data['django_user'].first_name} {data['django_user'].last_name}")
        print(f"   Role: {role_display}")
        print(f"   Departamento: {dept}")
        print(f"   Senha: password123")
        print()

    print("="*60)
    print("🎉 Pronto para testar!")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
