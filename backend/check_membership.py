
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

def verify_membership():
    print("--- Checking Admin User Membership ---")
    
    # Try to find the admin user
    try:
        user = User.objects.get(email='admin@example.com')
        ordoc_user = user.ordoc_profile
        print(f"User Found: {user.email} (ID: {user.id})")
        print(f"OrdocUser ID: {ordoc_user.id}")
        
        roles = UserOrganizationRole.objects.filter(user=ordoc_user)
        print(f"\nTotal Roles: {roles.count()}")
        
        user_orgs = ordoc_user.organizations.all()
        print(f"Orgs via ManyToMany: {[o.corporate_name for o in user_orgs]}")
        
        print("\n--- Detailed Roles ---")
        for role in roles:
            print(f"Org: {role.organization.corporate_name} | Role: {role.role} | Active: {role.is_active}")
            
        print("\n--- All Organizations ---")
        all_orgs = Organization.objects.all()
        for org in all_orgs:
             print(f"Org: {org.corporate_name} (ID: {org.id})")

    except User.DoesNotExist:
        print("User admin@example.com not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    verify_membership()
