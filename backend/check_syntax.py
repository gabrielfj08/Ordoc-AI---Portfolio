
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')

try:
    django.setup()
    print("Django setup successful! ✅")
    from ordoc_cloud import views
    from ordoc_cloud import serializers
    print("Imports successful! ✅")
except Exception as e:
    print(f"Startup Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
