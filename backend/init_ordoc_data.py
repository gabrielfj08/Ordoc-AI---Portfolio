#!/usr/bin/env python
"""
Script para inicializar dados básicos do OrdocAir
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from ordoc_air.models import Organization, Department
from ordoc_cloud.models import OrdocUser, UserOrganizationRole

def init_ordoc_data():
    """Cria organização e departamento padrão se não existirem"""
    
    print("🔍 Verificando dados básicos do OrdocAir...")
    
    # Criar organização padrão
    org, created = Organization.objects.get_or_create(
        cnpj='00000000000000',
        defaults={
            'corporate_name': 'Adsumtec - Organização Padrão',
            'email': 'contato@adsumtec.com.br',
            'phone': '0000000000',
            'contact_name': 'Administrador',
            'contact_phone': '0000000000',
            'subdomain': 'adsumtec',
            'prn': 'ORG-DEFAULT-001',
            'is_active': True,
        }
    )
    
    if created:
        print(f"✅ Organização criada: {org.corporate_name} (ID: {org.id})")
    else:
        print(f"ℹ️  Organização já existe: {org.corporate_name} (ID: {org.id})")
    
    # Criar departamento padrão
    dept, created = Department.objects.get_or_create(
        organization=org,
        name='Geral',
        defaults={
            'description': 'Departamento geral para documentos',
            'prn': f'DEPT-{org.prn}-GERAL',
            'is_active': True,
        }
    )
    
    if created:
        print(f"✅ Departamento criado: {dept.name} (ID: {dept.id})")
    else:
        print(f"ℹ️  Departamento já existe: {dept.name} (ID: {dept.id})")
    
    # Vincular usuário admin à organização
    try:
        from django.contrib.auth.models import User
        admin_user = User.objects.filter(username='admin').first()
        
        if admin_user and hasattr(admin_user, 'ordoc_profile'):
            ordoc_user = admin_user.ordoc_profile
            
            # Verificar se já está vinculado
            role_exists = UserOrganizationRole.objects.filter(
                user=ordoc_user,
                organization=org
            ).exists()
            
            if not role_exists:
                UserOrganizationRole.objects.create(
                    user=ordoc_user,
                    organization=org,
                    role='admin',
                    is_active=True,
                    is_primary=True,
                )
                print(f"✅ Usuário 'admin' vinculado à organização")
            else:
                print(f"ℹ️  Usuário 'admin' já está vinculado à organização")
                
    except Exception as e:
        print(f"⚠️  Erro ao vincular usuário: {e}")
    
    print("\n" + "="*60)
    print("📊 RESUMO DOS DADOS")
    print("="*60)
    print(f"Organizations: {Organization.objects.count()}")
    print(f"Departments: {Department.objects.count()}")
    print(f"UserOrganizationRoles: {UserOrganizationRole.objects.count()}")
    print("="*60)
    print("✅ Dados básicos inicializados com sucesso!")
    print("\n💡 Agora você pode fazer upload de documentos!")

if __name__ == '__main__':
    init_ordoc_data()
