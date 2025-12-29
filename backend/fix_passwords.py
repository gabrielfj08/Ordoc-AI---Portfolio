import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.contrib.auth import get_user_model
from ordoc_cloud.models import UserOrganizationRole

User = get_user_model()

def reset_passwords():
    print("🔄 Resetting passwords for Moura & Associados users...")
    
    # Filter by the organization we just created
    roles = UserOrganizationRole.objects.filter(organization__subdomain="moura-law")
    
    for role in roles:
        u = role.user.user
        print(f"  - Resetting password for: {u.username} ({u.email})")
        u.set_password("password123")
        u.save()
        
    print("✅ Passwords reset to 'password123'")

if __name__ == "__main__":
    reset_passwords()
