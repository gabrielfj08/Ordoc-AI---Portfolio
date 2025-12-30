#!/usr/bin/env python
"""
Correção Final - 3 Tabelas Restantes de Reports
"""
import os
import sys
import django
import uuid
import random
from datetime import timedelta

sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_reports.models import ReportTemplate, Report, ReportSchedule, ReportMetric

User = get_user_model()

def populate_final_reports():
    user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
    ordoc_user = user.ordoc_profile
    role = UserOrganizationRole.objects.filter(user=ordoc_user).first()
    org = role.organization
    
    print("\n" + "="*80)
    print("CORREÇÃO FINAL - 3 TABELAS DE REPORTS")
    print("="*80 + "\n")
    
    templates = list(ReportTemplate.objects.filter(organization=org))
    
    # 1. Reports
    print("1️⃣  ordoc_reports_reports")
    count = 0
    for template in templates[:3]:
        for i in range(random.randint(1, 2)):
            report, created = Report.objects.get_or_create(
                template=template,
                organization=org,  # CORRIGIDO: campo obrigatório
                title=f'{template.name} - {timezone.now().strftime("%d/%m/%Y")}',
                defaults={
                    'description': f'Relatório gerado automaticamente',
                    'status': random.choice(['generating', 'completed', 'failed']),
                    'format': random.choice(['pdf', 'excel', 'csv']),
                    'file_path': f'/reports/{uuid.uuid4()}.pdf',
                    'file_size': random.randint(100000, 5000000),
                    'data': {'rows': random.randint(10, 100)},
                    'generated_by': ordoc_user
                }
            )
            if created:
                count += 1
    print(f"   ✅ {count} reports criados\n")
    
    # 2. ReportSchedule
    print("2️⃣  ordoc_reports_schedules")
    count = 0
    for template in templates[:3]:
        schedule, created = ReportSchedule.objects.get_or_create(
            template=template,
            organization=org,  # CORRIGIDO: campo obrigatório
            name=f'Agendamento {template.name}',
            defaults={
                'description': f'Agendamento automático de {template.name}',
                'status': 'active',  # CORRIGIDO: usar status
                'frequency': random.choice(['daily', 'weekly', 'monthly']),
                'next_run': timezone.now() + timedelta(days=1),
                'default_format': 'pdf',
                'notification_emails': [user.email],
                'notify_on_completion': True,
                'notify_on_error': True,
                'created_by': ordoc_user
            }
        )
        if created:
            count += 1
    print(f"   ✅ {count} schedules criados\n")
    
    # 3. ReportMetric
    print("3️⃣  ordoc_reports_metrics")
    count = 0
    
    metric_types = ['generation_time', 'access_count', 'download_count', 'error_rate']
    
    for template in templates:
        for metric_type in metric_types:
            now = timezone.now()
            metric, created = ReportMetric.objects.get_or_create(
                report_template=template,
                organization=org,  # CORRIGIDO: campo obrigatório
                metric_type=metric_type,
                metric_name=f'{metric_type.replace("_", " ").title()} - {template.name}',
                defaults={
                    'metric_value': random.uniform(0.1, 100.0),
                    'metric_unit': 'ms' if metric_type == 'generation_time' else 'count',
                    'period_start': now - timedelta(days=30),  # CORRIGIDO
                    'period_end': now,  # CORRIGIDO
                    'metadata': {}
                }
            )
            if created:
                count += 1
    print(f"   ✅ {count} metrics criados\n")
    
    print("="*80)
    print("✅ CORREÇÃO FINAL CONCLUÍDA!")
    print("="*80 + "\n")

if __name__ == '__main__':
    try:
        populate_final_reports()
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
