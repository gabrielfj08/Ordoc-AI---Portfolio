
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from ordoc_air.models import Organization
from ordoc_cloud.models import OrdocUser, UserGroup

print("--- Organizations ---")
for org in Organization.objects.all():
    print(f"ID: {org.id}, Name: {org.corporate_name}, Subdomain: {org.subdomain}")

print("\n--- Users ---")
for user in OrdocUser.objects.all():
    print(f"ID: {user.id}, User: {user.user.username}, Email: {user.user.email}")

print("\n--- User Groups ---")
for group in UserGroup.objects.all():
    print(f"ID: {group.id}, Name: {group.name}, Org: {group.organization.subdomain}")
