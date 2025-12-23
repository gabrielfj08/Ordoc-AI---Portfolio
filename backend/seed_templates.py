import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from ordoc_air.models import Organization
from ordoc_flow.models import ProcedureTemplate, GroupRequester

def seed():
    print("Starting seed...")
    
    # 1. Get 'demo' Organization (Standard for Dev)
    try:
        org = Organization.objects.get(subdomain='demo')
    except Organization.DoesNotExist:
        print("Organization 'demo' not found. Creating...")
        org = Organization.objects.create(
            corporate_name="Adsum Tec Clean",
            cnpj="00000000000200",
            is_active=True,
            subdomain="demo",
            prn="org:demo"
        )
    
    print(f"Using Organization: {org.corporate_name} ({org.subdomain})")

    # 2. Get or Create Group Requester (Example: "Jurídico")
    group, created = GroupRequester.objects.get_or_create(
        name="Departamento Jurídico",
        organization=org,
        defaults={
            'description': 'Responsável por contratos e pareceres',
            'status': 'active'
        }
    )
    if created:
        print(f"Created Group: {group.name}")
    else:
        print(f"Using Group: {group.name}")

    # 3. Create Procedure Templates
    templates_data = [
        {
            "name": "Revisão de Contrato",
            "description": "Fluxo padrão para análise e revisão de minutas contratuais.",
            "source": "internal",
            "group_requester": group
        },
        {
            "name": "Aprovação de Pagamento",
            "description": "Solicitação interna para aprovação de pagamentos acima de R$ 5.000,00.",
            "source": "internal",
            "group_requester": group
        },
         {
            "name": "Parecer Técnico",
            "description": "Solicitação de análise técnica para novos projetos.",
            "source": "internal",
            "group_requester": group
        }
    ]

    for t_data in templates_data:
        tpl, created = ProcedureTemplate.objects.get_or_create(
            name=t_data['name'],
            organization=org,
            defaults={
                'description': t_data['description'],
                'source': t_data['source'],
                'group_requester': t_data['group_requester'],
                'status': 'active'
            }
        )
        if created:
            print(f"Created Template: {tpl.name}")
        else:
            print(f"Template exists: {tpl.name}")
            if tpl.status != 'active':
                tpl.status = 'active'
                tpl.save()
                print(f"  -> Reactivated template: {tpl.name}")

    print("Seed completed successfully!")

if __name__ == "__main__":
    seed()
