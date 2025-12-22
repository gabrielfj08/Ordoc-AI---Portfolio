import os
import django
import uuid
from django.utils import timezone
from datetime import timedelta

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_core.settings")
django.setup()

from intelligence.models import ProactiveAlert, AlertSeverity, AlertType, UserResponse
from ordoc_air.models import Organization

def create_seed_data():
    print("Iniciando criação de dados de teste para Intelligence...")
    
    # 1. Obter ou criar organização padrão
    org = Organization.objects.first()
    if not org:
        print("Nenhuma organização encontrada. Criando organização de teste...")
        org = Organization.objects.create(
            name="Prefeitura de Curitiba", 
            cnpj="76417005000186",
            active=True
        )
    
    # Limpar alertas antigos pendentes
    ProactiveAlert.objects.filter(user_response=UserResponse.PENDING).delete()
    print("Alertas antigos limpos.")
    
    # 2. Criar alertas
    alerts = [
        {
            "title": "Documento sem assinatura há 7 dias",
            "message": "O contrato 'Prestação de Serviços TI' está pendente de assinatura. O prazo expira em 48h.",
            "severity": AlertSeverity.CRITICAL,
            "type": AlertType.COMPLIANCE,
            "actions": [{"label": "Assinar Agora", "action_type": "sign_document"}, {"label": "Notificar Envolvidos", "action_type": "notify_users"}]
        },
        {
            "title": "Padrão de Uso Detectado",
            "message": "Notamos que você aprova documentos do tipo 'Licitação' sempre nas terças-feiras. Deseja agendar lembretes?",
            "severity": AlertSeverity.INFO,
            "type": AlertType.SUGGESTION,
            "actions": [{"label": "Agendar Lembrete", "action_type": "schedule_reminder"}]
        },
        {
            "title": "Possível Duplicidade",
            "message": "O documento 'Decreto_123.pdf' parece ser similar ao 'Decreto_Final.pdf' enviado ontem.",
            "severity": AlertSeverity.WARNING,
            "type": AlertType.PATTERN,
            "actions": [{"label": "Ver Comparação", "action_type": "compare_docs"}, {"label": "Ignorar", "action_type": "ignore"}]
        }
    ]
    
    for alert_data in alerts:
        alert = ProactiveAlert.objects.create(
            alert_type=alert_data.get("type", AlertType.SUGGESTION),
            severity=alert_data["severity"],
            title=alert_data["title"],
            message=alert_data["message"],
            details={"source": "seed_script"},
            suggested_actions=alert_data["actions"],
            document_id=uuid.uuid4(), # Dummy UUID
            document_type="contract",
            organization=org,
            user_response=UserResponse.PENDING,
            learning_weight=0.8
        )
        print(f"Alerta criado: [{alert.severity}] {alert.title}")
        
    print("✅ Dados de teste criados com sucesso!")

if __name__ == "__main__":
    create_seed_data()
