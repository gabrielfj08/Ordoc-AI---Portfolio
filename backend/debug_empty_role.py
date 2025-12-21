
import os
import django
import sys
from django.test import RequestFactory

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

from ordoc_cloud.serializers import OrdocUserCreateSerializer
from ordoc_air.models import Organization

def debug_empty_role():
    print("--- Debugging User Creation with Empty Role ---")
    
    # Payload with empty role string
    data = {
        "name": "User Empty Role",
        "email": "emptyrole@example.com",
        "role": "", # Front sends this string when nothing selected?
        "phone": "123"
    }
    
    # Mock Request context
    factory = RequestFactory()
    request = factory.post('/fake')
    try:
        request.current_organization = Organization.objects.first()
        print(f"Context Org: {request.current_organization}")
    except:
        print("No organization found")

    serializer = OrdocUserCreateSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        print("Serializer VALID ✅")
        try:
            user = serializer.save()
            print(f"Created User: {user.id}")
            user.user.delete()
        except Exception as e:
            print(f"Save Failed: {e}")
    else:
        print("Serializer INVALID ❌")
        print(f"Errors: {serializer.errors}")

if __name__ == "__main__":
    debug_empty_role()
