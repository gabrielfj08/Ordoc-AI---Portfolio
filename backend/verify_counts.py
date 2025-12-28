import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.apps import apps
from django.db import connection

print("📊 Database Population Report")
print("="*40)

def safe_count(model_path):
    try:
        app_label, model_name = model_path.split('.')
        model = apps.get_model(app_label, model_name)
        count = model.objects.count()
        print(f"✅ {model_name:<20}: {count}")
        return count
    except LookupError:
        print(f"❌ {model_path:<20}: Model not found")
    except Exception as e:
        print(f"⚠️  {model_name if 'model_name' in locals() else model_path:<20}: Error ({str(e)})")

# Core Models (Populated)
print("\n--- Core Modules (Populated) ---")
safe_count('ordoc_air.Organization')
safe_count('ordoc_air.Department')
safe_count('ordoc_air.Directory')
safe_count('ordoc_air.Document')
safe_count('ordoc_cloud.OrdocUser')
safe_count('ordoc_flow.Procedure')
safe_count('ordoc_flow.Task')
safe_count('ordoc_cloud.Notification')
safe_count('ordoc_cloud.Comment')
safe_count('ordoc_flow.ProcedureDocument')
safe_count('ordoc_flow.TaskAttachment')

# Framework Models (User Requested)
safe_count('auth.Group')
safe_count('auth.Permission')
safe_count('django_celery_beat.ClockedSchedule')
safe_count('admin.LogEntry')

# Secondary Models (Likely Empty)
print("\n--- Secondary Modules (Likely Empty) ---")
safe_count('ordoc_reports.Report')
safe_count('ordoc_integrations.IntegrationService')
safe_count('ordoc_sign.SignatureRequest')
safe_count('ordoc_air.ActivityLog')

# Check for table existence
print("\n--- Table Existence Check ---")
tables = connection.introspection.table_names()
print(f"Total tables in DB: {len(tables)}")
if 'ordoc_govbr_profiles' not in tables:
    print("⚠️  Warning: Table 'ordoc_govbr_profiles' is MISSING.")
else:
    print("✅ Table 'ordoc_govbr_profiles' exists.")
