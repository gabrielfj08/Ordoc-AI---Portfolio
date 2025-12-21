
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

from ordoc_cloud.serializers import PolicySerializer
from ordoc_air.models import Organization

def debug_policy():
    print("--- Debugging Policy Creation ---")
    
    # Payload from Frontend
    data = {
        "name": "Nova Politica Teste",
        "description": "Descricao teste",
        "effect": "Allow", # "Permitir" in UI -> "Allow" in state -> need to check serializer handling
        "resource": "Financeiro",
        "actions": ["read", "write"]
    }
    
    # Mock Request context
    factory = RequestFactory()
    request = factory.post('/fake')
    try:
        request.current_organization = Organization.objects.first()
        print(f"Context Org: {request.current_organization}")
    except:
        print("No organization found")

    serializer = PolicySerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        print("Serializer VALID ✅")
        try:
            policy = serializer.save()
            print(f"Created Policy: {policy.id} - {policy.name}")
            # policy.delete() # Cleanup
        except Exception as e:
            print(f"Save Failed: {e}")
    else:
        print("Serializer INVALID ❌")
        print(f"Errors: {serializer.errors}")

if __name__ == "__main__":
    debug_policy()
