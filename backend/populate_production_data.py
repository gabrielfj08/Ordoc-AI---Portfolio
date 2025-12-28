import os
import django
import random
import uuid
from datetime import timedelta, date, datetime

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.contrib.contenttypes.models import ContentType

from ordoc_air.models import Organization, Department, Directory, Document, Tag, CategorizationRule
from ordoc_cloud.models import OrdocUser, UserOrganizationRole, Notification, Comment
from ordoc_flow.models import (
    ProcedureTemplate, Procedure, TaskTemplate, Task, 
    GroupRequester, GroupRequesterMember, Field, WorkflowRequest, ExternalRequester,
    GroupRequester, GroupRequesterMember, Field, WorkflowRequest, ExternalRequester,
    ProcedureDocument, TaskAttachment
)
from ordoc_sign.models import SignatureRequest
from django.contrib.auth.models import Group, Permission
from django.contrib.admin.models import LogEntry, ADDITION
from django.contrib.contenttypes.models import ContentType
from django_celery_beat.models import PeriodicTask, IntervalSchedule, ClockedSchedule
from guardian.shortcuts import assign_perm
from django.utils import timezone

User = get_user_model()

# =================================================================================
# DATA GENERATORS (Mini-Faker replacement)
# =================================================================================

FIRST_NAMES = ["Carlos", "Ana", "Roberto", "Juliana", "Marcos", "Fernanda", "Ricardo", "Camila", "Paulo", "Luciana", "João", "Maria", "Pedro", "Mariana", "Lucas", "Beatriz"]
LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Ferreira", "Costa", "Rodrigues", "Almeida", "Nascimento", "Alves"]
DOMAINS = ["email.com", "gov.br", "empresa.com.br", "adsumtec.com"]

LOREM_TITLES = [
    "Solicitação de Compra", "Revisão Contratual", "Aprovação de Orçamento", "Relatório Mensal", 
    "Decreto Municipal", "Portaria de Nomeação", "Edital de Licitação", "Memorial Descritivo",
    "Parecer Jurídico", "Nota Fiscal Eletrônica", "Laudo Técnico", "Ata de Reunião"
]

LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

def fake_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def fake_email(name):
    slug = name.lower().replace(" ", ".")
    return f"{slug}@{random.choice(DOMAINS)}"

def fake_cnpj():
    # Simple fake generator
    return "".join([str(random.randint(0, 9)) for _ in range(14)])

def fake_phone():
    return f"119{random.randint(10000000, 99999999)}"

def create_ordoc_user(username, role_name, org, password="password123"):
    email = fake_email(username) if "@" not in username else username
    
    user, created = User.objects.get_or_create(
        username=username.split('@')[0],
        defaults={
            'email': email,
            'first_name': username.split(' ')[0] if ' ' in username else username,
            'last_name': username.split(' ')[-1] if ' ' in username else 'User'
        }
    )
    if created:
        user.set_password(password)
        user.save()
    
    # Ensure profile exists
    if not hasattr(user, 'ordoc_profile'):
        ordoc_user = OrdocUser.objects.create(
            user=user,
            status='active',
            profile_complete=True,
            language='pt-BR',
            timezone='America/Sao_Paulo'
        )
    else:
        ordoc_user = user.ordoc_profile

    # Assign Role
    if org:
        UserOrganizationRole.objects.get_or_create(
            user=ordoc_user,
            organization=org,
            defaults={'role': role_name}
        )
    
    return ordoc_user

# =================================================================================
# SCENARIOS
# =================================================================================

def seed_public_sector():
    print("\n🏛️  Seeding Public Sector (Prefeitura)...")
    
    # 1. Organization
    org, _ = Organization.objects.get_or_create(
        subdomain="prefeitura-ordoc",
        defaults={
            "corporate_name": "Prefeitura Municipal de OrdocCity",
            "cnpj": fake_cnpj(),
            "email": "contato@ordoccity.gov.br",
            "prn": "org:public:prefeitura"
        }
    )
    
    # 2. Departments
    depts = {}
    dept_names = ["Gabinete do Prefeito", "Secretaria de Saúde", "Secretaria de Educação", "Secretaria de Finanças", "Licitações"]
    for name in dept_names:
        d, _ = Department.objects.get_or_create(organization=org, name=name, defaults={"prn": f"dept:{org.subdomain}:{name.lower().replace(' ', '-')}"})
        depts[name] = d
        # Directories
        Directory.objects.get_or_create(department=d, name="Documentos Gerais", path="/", defaults={"prn": f"dir:{d.prn}:geral"})
        Directory.objects.get_or_create(department=d, name="Processos 2024", path="/", defaults={"prn": f"dir:{d.prn}:proc2024"})

    # 3. Users & Groups
    mayor = create_ordoc_user("Prefeito João", "admin", org)
    health_sec = create_ordoc_user("Sec. Saúde Maria", "organization_manager", org)
    finance_tech = create_ordoc_user("Técnico Finanças", "organization_member", org)

    # Groups
    g_licitacao, _ = GroupRequester.objects.get_or_create(organization=org, name="Comissão de Licitação")
    GroupRequesterMember.objects.get_or_create(group=g_licitacao, user=finance_tech, role='member') # Reusing finance tech for simplicity

    # 4. Procedure Templates
    pt_compra, _ = ProcedureTemplate.objects.get_or_create(
        organization=org, name="Processo de Compra Direta",
        defaults={
            "group_requester": g_licitacao,
            "status": "active",
            "source": "internal",
            "schema": {"valor_estimado": "text", "justificativa": "textarea"}
        }
    )

    # 5. Live Data
    # Documents
    for i in range(5):
        doc = Document.objects.create(
            directory=depts["Gabinete do Prefeito"].directories.first(),
            name=f"Decreto_{100+i}_2024.pdf",
            mime_type="application/pdf",
            prn=f"doc:{org.subdomain}:{uuid.uuid4().hex[:10]}",
            file_size=1024 * random.randint(10, 500),
            created_by=mayor.user,
            status="active"
        )
        # Create dummy content
        doc.file.save(f"decreto_{i}.txt", ContentFile(f"Conteúdo do decreto {i} - {LOREM_TEXT}"))
        
        # Comments
        Comment.objects.create(
            user=health_sec,
            content=f"Prefeito, favor revisar o artigo {i}.",
            content_type=ContentType.objects.get_for_model(doc),
            object_id=doc.id
        )

    # Dummy External Requester (required by model)
    dummy_req, _ = ExternalRequester.objects.get_or_create(
        organization=org,
        email="interno@ordoccity.gov.br",
        defaults={"name": "Solicitante Interno", "status": "active"}
    )

    # Procedures (Running)
    for i in range(3):
        proc = Procedure.objects.create(
            procedure_template=pt_compra,
            organization=org,
            created_by=finance_tech,
            requester=dummy_req,
            status='running',
            responsible_group=g_licitacao,
            payload={"valor_estimado": f"R$ {random.randint(1000, 50000)},00", "justificativa": "Necessidade urgente"}
        )
        
        # Procedure Documents (Attachments)
        doc = ProcedureDocument.objects.create(
            procedure=proc,
            name=f"Orçamento_{i}.pdf",
            document_type='attachment',
            file_name=f"orcamento_{i}.pdf",
            file_size=1024 * 50,
            file_type='application/pdf',
            uploaded_by=finance_tech,
            status='approved'
        )
        doc.file.save(f"orcamento_{i}.pdf", ContentFile(f"Conteúdo do orçamento {i}"))

        # Tasks for procedure
        task = Task.objects.create(
            procedure=proc,
            name="Análise de Orçamento",
            status='running',
            created_by=finance_tech
        )

        # Task Attachments
        att = TaskAttachment.objects.create(
            task=task,
            name=f"Evidência_{i}.png",
            attachment_type='image',
            file_name=f"evidencia_{i}.png",
            file_size=1024 * 200,
            file_type='image/png',
            uploaded_by=finance_tech
        )
        att.file.save(f"evidencia_{i}.png", ContentFile(b"fake_image_content"))

        # Notification
        Notification.objects.create(
            user=mayor,
            title="Nova Compra Iniciada",
            message=f"Processo de compra {proc.process_number} aguardando aprovação.",
            notification_type='warning',
            content_type=ContentType.objects.get_for_model(proc),
            object_id=proc.id
        )

def seed_private_legal():
    print("\n⚖️  Seeding Private Sector (Advocacia)...")
    org, _ = Organization.objects.get_or_create(
        subdomain="silva-advocacia",
        defaults={
            "corporate_name": "Silva & Associados Advocacia", 
            "cnpj": fake_cnpj(),
            "prn": "org:private:legal"
        }
    )
    
    lawyer_sr = create_ordoc_user("Dr. Roberto Silva", "admin", org)
    lawyer_jr = create_ordoc_user("Dra. Camila", "organization_member", org)
    
    dept_civel, _ = Department.objects.get_or_create(organization=org, name="Cível", defaults={"prn": "dept:adv:civel"})
    dir_contratos, _ = Directory.objects.get_or_create(department=dept_civel, name="Contratos", path="/", defaults={"prn": "dir:adv:contratos"})
    
    # 20 Documents (Contracts)
    for i in range(20):
        d = Document.objects.create(
            directory=dir_contratos,
            name=f"Contrato_Honorarios_{fake_name().replace(' ', '_')}.pdf",
            prn=f"doc:{org.subdomain}:{uuid.uuid4().hex[:10]}",
            created_by=lawyer_jr.user,
            status="active"
        )
        d.file.save(f"contrato_{i}.txt", ContentFile("Cláusula 1... Cláusula 2..."))
        
        if i % 3 == 0:
            d.starred = True
            d.save()

def seed_private_industry():
    print("\n🏭 Seeding Private Sector (Indústria)...")
    org, _ = Organization.objects.get_or_create(
        subdomain="techmetal",
        defaults={
            "corporate_name": "Indústrias TechMetal Ltda",
            "cnpj": fake_cnpj(),
            "prn": "org:private:ind"
        }
    )
    
    manager = create_ordoc_user("Eng. Marcos", "organization_manager", org)
    
    dept_qualidade, _ = Department.objects.get_or_create(organization=org, name="Qualidade", defaults={"prn": "dept:ind:qualidade"})
    dir_relatorios, _ = Directory.objects.get_or_create(department=dept_qualidade, name="Relatórios Técnicos", path="/", defaults={"prn": "dir:ind:relatorios"})
    
    # Procedures: "Inspeção de Qualidade"
    pt_inspecao, _ = ProcedureTemplate.objects.get_or_create(organization=org, name="Inspeção de Qualidade ISO", defaults={"status": "active"})
    
    dummy_req, _ = ExternalRequester.objects.get_or_create(
        organization=org,
        email="interno@techmetal.com.br",
        defaults={"name": "Controle de Qualidade Interno", "status": "active"}
    )

    for i in range(10):
        p = Procedure.objects.create(
            procedure_template=pt_inspecao,
            organization=org,
            created_by=manager,
            requester=dummy_req,
            status=random.choice(['running', 'finished', 'draft']),
            # Need a responsible group or requester. Using a dummy group for now.
            responsible_group=GroupRequester.objects.get_or_create(organization=org, name="Qualidade Team")[0]
        )
        # Random Tasks
        t = Task.objects.create(
            name="Medição de Peças",
            procedure=p,
            status=random.choice(['finished', 'running']),
            created_by=manager,
            deadline=date.today() + timedelta(days=5)
        )
        
        # Task Attachment (Report)
        rep = TaskAttachment.objects.create(
            task=t,
            name=f"Relatorio_Medicao_{i}.xlsx",
            attachment_type='spreadsheet',
            file_name=f"medicao_{i}.xlsx",
            file_size=1024 * 15,
            file_type='application/vnd.ms-excel',
            uploaded_by=manager
        )
        rep.file.save(f"medicao_{i}.xlsx", ContentFile(b"fake_excel_content"))

        rep.file.save(f"medicao_{i}.xlsx", ContentFile(b"fake_excel_content"))

def seed_framework_tables():
    print("\n⚙️  Seeding Framework Tables (Auth, Celery, Guardian)...")
    
    # 1. Auth Groups
    admins_group, _ = Group.objects.get_or_create(name="Administradores do Sistema")
    editors_group, _ = Group.objects.get_or_create(name="Editores de Conteúdo")
    print(f"  - Created Auth Groups: {admins_group.name}, {editors_group.name}")
    
    # 2. Celery Beat Periodic Tasks
    # Interval
    interval, _ = IntervalSchedule.objects.get_or_create(
        every=10, period=IntervalSchedule.MINUTES
    )
    # Task
    pt, _ = PeriodicTask.objects.get_or_create(
        interval=interval,
        name="Update Search Index (Every 10 min)",
        task="ordoc_ai.tasks.update_search_index",
        defaults={"enabled": True}
    )
    print(f"  - Created Periodic Task: {pt.name}")
    
    # 3. Guardian Permissions (Example)
    # Assign global permission to a user
    try:
        user = User.objects.first()
        if user:
            # Grants 'change_group' on the Admins group to the first user
            assign_perm('auth.change_group', user, admins_group)
            print(f"  - Assigned guardian permission 'change_group' to {user.username}")
    except Exception as e:
        print(f"  - Error assigning permissions: {e}")

    # 4. Celery Beat Clocked Schedule (One-off tasks)
    clocked, _ = ClockedSchedule.objects.get_or_create(
        clocked_time=timezone.now() + timezone.timedelta(days=30)
    )
    pt_clocked, _ = PeriodicTask.objects.get_or_create(
        clocked=clocked,
        name="Scheduled Maintenance (One-off)",
        task="ordoc_ai.tasks.maintenance_task",
        defaults={"one_off": True}
    )
    print(f"  - Created Clocked Schedule Task: {pt_clocked.name}")

    # 5. Admin Log Entry (Audit Trail)
    try:
        user = User.objects.first()
        content_type = ContentType.objects.get_for_model(user)
        LogEntry.objects.log_action(
            user_id=user.id,
            content_type_id=content_type.id,
            object_id=user.id,
            object_repr=user.username,
            action_flag=ADDITION,
            change_message="Usuário criado via script de população simulado."
        )
        print(f"  - Created Admin Log Entry for user {user.username}")
    except Exception as e:
        print(f"  - Error creating LogEntry: {e}")

# =================================================================================
# MAIN EXECUTION
# =================================================================================

def run():
    print("🚀 Starting Production Data Population...")
    try:
        seed_framework_tables()
        seed_public_sector()
        seed_private_legal()
        seed_private_industry()
        print("\n✅ All scenarios seeded successfully!")
        
        # Count check
        print(f"\n📊 Summary:")
        print(f"  - Organizations: {Organization.objects.count()}")
        print(f"  - Users: {OrdocUser.objects.count()}")
        print(f"  - Documents: {Document.objects.count()}")
        print(f"  - Procedures: {Procedure.objects.count()}")
        print(f"  - Notifications: {Notification.objects.count()}")
        print(f"  - Comments: {Comment.objects.count()}")
        print(f"  - Procedure Docs: {ProcedureDocument.objects.count()}")
        print(f"  - Task Attachments: {TaskAttachment.objects.count()}")
        
    except Exception as e:
        print(f"\n❌ Error seeding data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run()
