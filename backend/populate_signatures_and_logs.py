import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from django.contrib.auth import get_user_model
from ordoc_cloud.models import OrdocUser
from ordoc_air.models import Organization, Document, ActivityLog, Department
from ordoc_sign.models import SignatureRequest, SignatureRequestSigner, DigitalCertificate
from ordoc_flow.models import ExternalRequester

User = get_user_model()

def populate_missing_data():
    print("🚀 Populating Signatures and Activity Logs...")
    
    # 1. Get Context
    try:
        org = Organization.objects.get(subdomain="moura-law")
        socio_user = User.objects.get(email="socio@moura.law")
        pleno_user = User.objects.get(email__startswith="dr..carlos") # Need fuzzy match or exact if possible. 
        # Using fuzzy mainly because of the '..' issue, but let's try to find it.
        # Check generated users
        try:
             pleno_user = User.objects.filter(email__contains="carlos").filter(email__contains="pleno").first()
        except:
             pleno_user = socio_user # Fallback
        
    except Exception as e:
        print(f"❌ Error getting context: {e}")
        return

    # 2. Populate Signatures
    print("  - Creating Signature Requests...")
    
    # Get a document to sign
    doc_to_sign = Document.objects.filter(
        directory__department__organization=org, 
        name__startswith="NDA"
    ).first()
    
    from ordoc_sign.models import SignatureTemplate

    if doc_to_sign:
        # Create Default Template
        sig_template, _ = SignatureTemplate.objects.get_or_create(
            organization=org,
            name="Padrão",
            defaults={
                "description": "Template padrão de assinatura",
                "created_by": socio_user # Added created_by
            }
        )

        # Request 1: Pending Signature
        sig_req, created = SignatureRequest.objects.get_or_create(
            organization=org, # Correct field
            document=doc_to_sign,
            template=sig_template, # Added template
            title=f"Assinatura NDA - {doc_to_sign.name}",
            defaults={
                'description': "Favor assinar digitalmente este acordo de confidencialidade.",
                'status': 'pending',
                'priority': 'high',
                'created_by': socio_user,
                'expires_at': timezone.now() + timedelta(days=5)
            }
        )
        
        if created:
             # Add Signer (Pleno)
             SignatureRequestSigner.objects.create(
                 signature_request=sig_req,
                 signer_type='internal',
                 user=pleno_user,
                 full_name=pleno_user.get_full_name(),
                 email=pleno_user.email,
                 status='pending'
             )
             print(f"    ✅ Created Pending Signature Request for {doc_to_sign.name}")
        else:
             print(f"    ℹ️ Signature Request already exists for {doc_to_sign.name}")

    # 3. Populate Activity Logs (for Analytics)
    print("  - Generatig Activity Logs...")
    
    # Simulate some history
    actions = ['read', 'read', 'download', 'read', 'update']
    docs = Document.objects.filter(directory__department__organization=org)[:5]
    
    for i, doc in enumerate(docs):
        ActivityLog.log(
            action=actions[i % len(actions)],
            entity_type='document',
            entity_id=doc.id,
            entity_name=doc.name,
            user=socio_user,
            organization=org,
            description=f"Ação simulada via script para analytics."
        )
    print(f"    ✅ Generated {len(docs)} activity logs.")
    
    # 4. Populate "Intelligence" (Simulated via Activity/Stats)
    # The 'Health Monitor' usually reads from specific aggregated tables or live counts.
    # By fixing the filtering in DocumentViewSet, the frontend widgets that rely on correct counts should now work.
    
    print("\n✨ DONE! Check 'Assinaturas' and 'Analytics' tabs.")

if __name__ == "__main__":
    populate_missing_data()
