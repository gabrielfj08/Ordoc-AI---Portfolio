
import os
import django
import sys
import uuid
from django.db.models import Q

# Setup environment
sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.contrib.auth import get_user_model
from ordoc_air.models import Organization, Document, Department, Directory
from intelligence.models import ProactiveAlert, AlertSeverity, AlertType, LearnedPattern
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

def seed_smart_alert():
    try:
        # 1. Dynamic User Discovery
        # Try to find a real user (not superuser if possible, but fallback to any)
        user = User.objects.filter(is_active=True, is_superuser=False).first()
        if not user:
            user = User.objects.filter(is_active=True).first()
            
        if not user:
            print("No active users found in the database.")
            return

        print(f"Targeting User: {user.email}")

        # 2. Dynamic Organization Discovery
        # Try to find organization linked to user, or first available
        organization = None
        if hasattr(user, 'organizations'): # Assuming ManyToMany or reverse relation
             organization = user.organizations.first()
        
        if not organization: 
             # Fallback to direct check or any org
             organization = Organization.objects.first()

        if not organization:
            print("No Organization found in DB.")
            return
            
        print(f"Targeting Organization: {organization.corporate_name}")

        # 3. Dynamic Document Discovery
        # Find any active document in this organization
        ref_doc = Document.objects.filter(
            directory__department__organization=organization,
            deleted_at__isnull=True
        ).first()

        # Only create if ABSOLUTELY necessary (and use generic names)
        if not ref_doc:
            print("No existing document found. Creating a generic placeholder.")
            
            # Ensure hierarchy exists
            dept = Department.objects.filter(organization=organization).first()
            if not dept:
                dept = Department.objects.create(
                    organization=organization,
                    name="Geral",
                    prn=str(uuid.uuid4())
                )
            
            directory = Directory.objects.filter(department=dept).first()
            if not directory:
                directory = Directory.objects.create(
                    department=dept,
                    name="Documentos",
                    prn=str(uuid.uuid4())
                )
                
            ref_doc = Document.objects.create(
                directory=directory,
                name="Documento_Exemplo.pdf",
                file_size=1024,
                mime_type='application/pdf',
                created_by=user,
                status='active',
                prn=str(uuid.uuid4())
            )
        
        print(f"Attaching alert to Document: {ref_doc.name} (ID: {ref_doc.id})")

        # 4. Create Pattern and Alert
        # Check if pattern exists (dynamic name based on document type if possible, or generic)
        pattern_name = "Classificação Automática"
        pattern, _ = LearnedPattern.objects.get_or_create(
            name=pattern_name,
            organization=organization,
            defaults={
                'pattern_type': 'auto_classification',
                'description': 'Padrão detectado automaticamente pelo sistema.',
                'confidence': 0.85
            }
        )

        # Create Alert
        alert_title = "Sugestão de Organização"
        alert_msg = f'Documentos similares a "{ref_doc.name}" geralmente são classificados nesta categoria. Deseja aplicar?'
        
        # Avoid duplicates
        existing = ProactiveAlert.objects.filter(
            title=alert_title, 
            organization=organization, 
            document_id=ref_doc.id,
            user_response='pending'
        ).first()
        
        if existing:
            print(f"Alert already exists: {existing.id}")
            return

        alert = ProactiveAlert.objects.create(
            alert_type=AlertType.PATTERN,
            severity=AlertSeverity.INFO,
            title=alert_title,
            message=alert_msg,
            organization=organization,
            document_content_type=ContentType.objects.get_for_model(Document),
            document_id=ref_doc.id,
            document_object=ref_doc,
            source_pattern=pattern,
            suggested_actions=[
                {
                    "action_type": "apply_always",
                    "label": "Aplicar sempre",
                    "auto_applicable": True,
                    "payload": { "target_directory": str(ref_doc.directory.id) }
                },
                {
                    "action_type": "apply_once",
                    "label": "Só desta vez",
                    "auto_applicable": True,
                    "payload": { "document_id": str(ref_doc.id) }
                },
                {
                    "action_type": "ignore",
                    "label": "Ignorar",
                    "auto_applicable": False,
                    "payload": {}
                }
            ]
        )
        
        print(f"Successfully created dynamic alert: {alert.id}")

    except Exception as e:
        print(f"Error seeding alert: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    seed_smart_alert()
