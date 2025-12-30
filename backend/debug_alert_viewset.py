import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User

from intelligence.api.views import AlertViewSet

def test_alert_viewset():
    print("Testing AlertViewSet...")
    factory = RequestFactory()
    
    class MockRequest:
        def __init__(self, user):
            self.user = user
            self.query_params = {}
            self.current_organization = None
            self.GET = {}
    
    # Test with user having no profile
    try:
        user_no_profile = User.objects.create(username='test_no_profile', email='test@example.com')
        print(f"User created: {user_no_profile.username}")
    except Exception as e:
        user_no_profile = User.objects.get(username='test_no_profile')
        print(f"User retrieved: {user_no_profile.username}")

    request = MockRequest(user_no_profile)
    
    view = AlertViewSet()
    view.request = request
    view.format_kwarg = None

    try:
        queryset = view.get_queryset()
        print(f"Queryset (no profile): {queryset}")
        
        # Test serialization
        from intelligence.api.serializers import ProactiveAlertSerializer
        if queryset.exists():
            print("Testing serialization...")
            serializer = ProactiveAlertSerializer(queryset.first())
            print(f"Serialized data: {serializer.data}")
            print("Serialization SUCCESS")
        else:
            print("Queryset empty, skipping serialization test")
            
    except Exception as e:
        print(f"ERROR (no profile): {e}")
        import traceback
        traceback.print_exc()

    # Test with user having profile but no role
    # ...

if __name__ == '__main__':
    test_alert_viewset()
