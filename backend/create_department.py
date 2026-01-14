#!/usr/bin/env python
"""
Script para criar um Department padrão para testes
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from ordoc_air.models import Department, Organization

# Buscar ou criar organização padrão
org, created = Organization.objects.get_or_create(
    subdomain='default',
    defaults={
        'corporate_name': 'Organização Padrão',
        'cnpj': '00000000000000',
        'email': 'contato@default.com',
        'phone': '0000000000',
        'contact_name': 'Admin',
        'contact_phone': '0000000000',
        'prn': 'org:default:000000000000',
        'is_active': True,
    }
)

if created:
    print(f"✅ Organização criada: {org.corporate_name}")
else:
    print(f"ℹ️  Organização já existe: {org.corporate_name}")

# Buscar ou criar department padrão
dept, created = Department.objects.get_or_create(
    organization=org,
    name='Departamento Geral',
    defaults={
        'description': 'Departamento padrão para testes',
        'prn': f'dept:{org.prn}:000000000001',
        'is_active': True,
    }
)

if created:
    print(f"✅ Department criado: {dept.name} (PRN: {dept.prn})")
else:
    print(f"ℹ️  Department já existe: {dept.name} (PRN: {dept.prn})")

print(f"\n📊 Total de departments: {Department.objects.count()}")
print(f"📊 Total de organizations: {Organization.objects.count()}")
