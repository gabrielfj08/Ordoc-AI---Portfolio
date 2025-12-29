import os
import django
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.contrib.auth import get_user_model
from ordoc_cloud.models import OrdocUser
from ordoc_air.models import Organization, Document, RecentDocument
from ordoc_flow.models import GroupRequester, GroupRequesterMember

User = get_user_model()

def fix_data():
    print("🔧 Fixing Frontend Data Visibility...")
    
    # 1. Get Context
    try:
        org = Organization.objects.get(subdomain="moura-law")
        socio_user = User.objects.get(email="socio@moura.law")
        socio_ordoc = socio_user.ordoc_profile
    except Exception as e:
        print(f"❌ Error getting context: {e}")
        return

    # 2. Add Socio to "Squad Jurídico" (to see Tasks)
    print("  - Checking Group Membership...")
    try:
        squad = GroupRequester.objects.get(organization=org, name="Squad Jurídico")
        member, created = GroupRequesterMember.objects.get_or_create(
            group=squad,
            user=socio_ordoc,
            defaults={'role': 'manager', 'is_active': True}
        )
        if created:
            print(f"    ✅ Added {socio_user.username} to 'Squad Jurídico'")
        else:
            print(f"    ℹ️ {socio_user.username} already in 'Squad Jurídico'")
            
    except Exception as e:
        print(f"    ❌ Error with group: {e}")

    # 3. Populate "Recent Documents" (to see Docs in Widget)
    print("  - Populating Recent Documents widget...")
    docs = Document.objects.filter(directory__department__organization=org)[:5]
    
    for doc in docs:
        RecentDocument.objects.get_or_create(
            user=socio_user,
            document=doc,
            defaults={
                'access_type': 'view',
                'accessed_at': timezone.now()
            }
        )
        print(f"    ✅ Added '{doc.name}' to recents")

    print("\n✨ DONE! Please refresh the dashboard.")

if __name__ == "__main__":
    fix_data()
