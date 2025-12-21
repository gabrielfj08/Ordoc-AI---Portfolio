
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

def debug_error():
    print("--- Debugging User Creation Error ---")
    
    # Payload mimicking Frontend exact inputs
    # User selects "Admin" in dropdown -> value="Admin"
    data = {
        "name": "User Debugger",
        "email": "debugger@example.com",
        "role": "Admin",
        "phone": "(11) 99999-9999"
    }
    
    # Mock Request context
    factory = RequestFactory()
    request = factory.post('/fake')
    try:
        request.current_organization = Organization.objects.first()
        print(f"Organization Context: {request.current_organization}")
    except:
        print("No organization found")

    serializer = OrdocUserCreateSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        print("Serializer VALID ✅")
        # Try to save to see if create() fails
        try:
            user = serializer.save()
            print(f"Created User ID: {user.id}")
            user.user.delete() # Cleanup
        except Exception as e:
            print(f"Save Failed: {e}")
    else:
        print("Serializer INVALID ❌")
        print(f"Errors: {serializer.errors}")

if __name__ == "__main__":
    debug_error()
