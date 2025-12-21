
import os
import django
import sys
import uuid

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

from ordoc_cloud.models import UserGroup, OrdocUser
from ordoc_air.models import Organization
from django.db import connection

def debug_create_group():
    print("--- Starting UserGroup Debug ---")
    
    # 1. Get an organization
    try:
        org = Organization.objects.first()
        if not org:
            print("No organization found. Creating one.")
            org = Organization.objects.create(
                corporate_name="Debug Org",
                cnpj="12345678000199",
                subdomain="debug-org",
                prn=str(uuid.uuid4())
            )
        else:
            print(f"Using organization: {org.corporate_name} ({org.id})")
    except Exception as e:
        print(f"Error getting/creating organization: {e}")
        return

    # 2. Extract logic from UserGroupCreateSerializer and View
    # Simulate POST data:
    data = {
        "name": "Test Group 2",
        "description": "Debug Test Group",
        "is_active": True
    }
    
    # Simulate View logic providing current_organization via Serializer context?
    # Actually, let's try to call the serializer directly.
    from ordoc_cloud.serializers import UserGroupCreateSerializer
    from django.http import HttpRequest
    
    # Mocking request context
    request = HttpRequest()
    request.current_organization = org
    
    context = {'request': request}
    
    serializer = UserGroupCreateSerializer(data=data, context=context)
    
    if serializer.is_valid():
        try:
            print("Serializer valid. Attempting create...")
            group = serializer.save()
            print(f"SUCCESS: Created group {group.name} ({group.id})")
        except Exception as e:
            print("\n!!! EXCEPTION CAUGHT DURING SAVE !!!")
            import traceback
            traceback.print_exc()
    else:
        print(f"Serializer Invalid: {serializer.errors}")

if __name__ == "__main__":
    debug_create_group()
