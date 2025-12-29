import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.contrib.auth import get_user_model
from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import Organization

User = get_user_model()

def create_clean_user():
    print("✨ Creating clean demo user for Moura & Associados...")
    
    # 1. Get Organization
    try:
        org = Organization.objects.get(subdomain="moura-law")
    except Organization.DoesNotExist:
        print("❌ Organization 'moura-law' not found! Run population script first.")
        return

    # 2. Create User
    username = "socio.moura"
    email = "socio@moura.law"
    password = "password123"
    
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "first_name": "Ricardo",
            "last_name": "Moura (Demo)"
        }
    )
    
    user.set_password(password)
    user.save()
    print(f"  - User: {username} ({email}) - Password set.")

    # 3. Create Ordoc Profile
    ordoc_user, _ = OrdocUser.objects.get_or_create(
        user=user,
        defaults={
            "status": "active",
            "profile_complete": True,
            "language": "pt-BR",
            "timezone": "America/Sao_Paulo"
        }
    )
    
    # 4. Assign Role
    UserOrganizationRole.objects.update_or_create(
        user=ordoc_user,
        organization=org,
        defaults={"role": "admin"}
    )
    print(f"  - Role: Admin assigned to {org.corporate_name}")
    print("\n✅ CREATED SUCCESSFULLY!")
    print(f"Login: {email}")
    print(f"Pass:  {password}")

if __name__ == "__main__":
    create_clean_user()
