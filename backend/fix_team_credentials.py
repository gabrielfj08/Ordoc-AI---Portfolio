import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.contrib.auth import get_user_model
from ordoc_cloud.models import UserOrganizationRole
from ordoc_air.models import Organization

User = get_user_model()

def fix_team_credentials():
    print("reparando e padronizando credenciais da equipe moura...")
    
    try:
        org = Organization.objects.get(subdomain="moura-law")
    except Organization.DoesNotExist:
        print("❌ Organization not found.")
        return

    # Map roles to desired emails
    # We identify them by their generated names from populate script
    team_map = [
        {"keyword": "Sênior", "new_email": "senior@moura.law", "new_user": "senior.moura", "name": "Dra. Patrícia (Sênior)"},
        {"keyword": "Pleno", "new_email": "pleno@moura.law", "new_user": "pleno.moura", "name": "Dr. Carlos (Pleno)"},
        {"keyword": "Paralegal", "new_email": "paralegal@moura.law", "new_user": "julia.paralegal", "name": "Julia (Paralegal)"}
    ]

    for member in team_map:
        # Find by fuzzy username matching the generated pattern
        users = User.objects.filter(username__contains=member["keyword"])
        
        target_user = None
        # Filter to ensure they belong to Moura Law (via OrdocProfile -> Roles)
        for u in users:
            if hasattr(u, 'ordoc_profile') and \
               UserOrganizationRole.objects.filter(user=u.ordoc_profile, organization=org).exists():
                target_user = u
                break
        
        if target_user:
            print(f"  - Found {target_user.username} ({target_user.email})")
            target_user.username = member["new_user"]
            target_user.email = member["new_email"]
            target_user.first_name = member["name"].split(" ")[0]
            target_user.set_password("password123")
            target_user.save()
            print(f"    ✅ Updated to: {target_user.email} / password123")
        else:
            print(f"  ⚠️ Could not find user for {member['keyword']}")

    print("\n✅ TEAM CREDENTIALS FIXED!")

if __name__ == "__main__":
    fix_team_credentials()
