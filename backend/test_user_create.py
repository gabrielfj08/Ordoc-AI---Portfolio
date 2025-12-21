
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

def test_serializer():
    print("--- Testing OrdocUserCreateSerializer ---")
    
    # Payload matching Frontend
    data = {
        "name": "Nova Pessoa Tester",
        "email": "tester@example.com",
        "role": "editor"
    }
    
    # Mock Request context
    factory = RequestFactory()
    request = factory.post('/fake')
    try:
        request.current_organization = Organization.objects.first()
        print(f"Context Org: {request.current_organization.corporate_name}")
    except:
        print("No organization found, running without org context")

    serializer = OrdocUserCreateSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        print("Serializer Valid! ✅")
        print(f"Validated Data keys: {serializer.validated_data.keys()}")
        print(f"Derived First Name: {serializer.validated_data.get('first_name')}")
        print(f"Derived Last Name: {serializer.validated_data.get('last_name')}")
        print(f"Derived Username: {serializer.validated_data.get('username')}")
        
        # Test Save (Dry run essentially, avoiding commit if possible, but create saves DB)
        try:
            user = serializer.save()
            print(f"User Created: {user.user.username} (ID: {user.id})")
            print(f"Full Name in DB: {user.user.get_full_name()}")
            
            # Clean up
            user.user.delete()
            print("Test user deleted.")
        except Exception as e:
            print(f"Error saving: {e}")
            
    else:
        print("Serializer Invalid! ❌")
        print(serializer.errors)

if __name__ == "__main__":
    test_serializer()
