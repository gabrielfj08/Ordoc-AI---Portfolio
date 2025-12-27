import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from ordoc_flow.models import Task
try:
    t = Task.objects.get(id='34d53bf7-72dc-4260-a33c-cc7742c94180')
    print(f"Task: {t.name}, Status: {t.status}")
    print(f"Procedure Status: {t.procedure.status}")
    print(f"Procedure Metadata: {t.procedure.schema}, {t.procedure.payload}")
    
    print("Testing task.run()...")
    t.run()
    print(f"New Status: {t.status}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'messages'):
        print(f"Messages: {e.messages}")
