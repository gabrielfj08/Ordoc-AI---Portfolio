
import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
os.environ['DB_HOST'] = 'localhost'
os.environ['DB_USER'] = 'ordoc_user'
os.environ['DB_PASSWORD'] = 'ordoc_password'

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import Organization
from django.contrib.auth.models import User

def fix_membership():
    print("--- Fixing Admin User Membership ---")
    
    try:
        user = User.objects.get(email='admin@example.com')
        ordoc_user = user.ordoc_profile
        print(f"User: {user.email}")
        
        # Get Organizations
        adsumtec = Organization.objects.get(corporate_name='ADSUMTEC TECNOLOGIA DA INFORMACAO LTDA')
        adsum_demo = Organization.objects.get(corporate_name='Adsum Tec')
        
        # Create Roles
        role1, created1 = UserOrganizationRole.objects.get_or_create(
            user=ordoc_user,
            organization=adsumtec,
            role='admin',
            defaults={'is_active': True, 'is_primary': True}
        )
        print(f"Role for ADSUMTEC: {'Created' if created1 else 'Existing'}")
        
        role2, created2 = UserOrganizationRole.objects.get_or_create(
            user=ordoc_user,
            organization=adsum_demo,
            role='admin',
            defaults={'is_active': True, 'is_primary': False}
        )
        print(f"Role for Adsum Tec (Demo): {'Created' if created2 else 'Existing'}")
        
        print("\nFix applied successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fix_membership()
