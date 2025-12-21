
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

from ordoc_cloud.models import UserGroup
from ordoc_air.models import Organization

def verify_data():
    print("--- Organizations ---")
    orgs = Organization.objects.all()
    for org in orgs:
        print(f"ID: {org.id} | Name: {org.corporate_name} | Subdomain: {org.subdomain}")

    print("\n--- User Groups ---")
    groups = UserGroup.objects.all()
    if not groups.exists():
        print("No groups found in database.")
    
    for group in groups:
        org_name = group.organization.corporate_name if group.organization else "None"
        org_sub = group.organization.subdomain if group.organization else "None"
        print(f"Group: {group.name} | Org ID: {group.organization_id} | Org Name: {org_name} ({org_sub}) | Active: {group.is_active} | Deleted: {group.deleted_at}")

if __name__ == "__main__":
    verify_data()
