#!/usr/bin/env python
"""
População Sistemática de TODAS as 94 Tabelas do Banco de Dados
Popula em grupos de 5 tabelas por vez, verificando campos e relacionamentos
"""
import os
import sys
import django

sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.apps import apps
from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

def get_all_tables_with_counts():
    """Retorna todas as tabelas com suas contagens"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name NOT LIKE 'django_%'
            AND table_name NOT LIKE 'auth_%'
            AND table_name NOT LIKE 'guardian_%'
            ORDER BY table_name
        """)
        tables = [row[0] for row in cursor.fetchall()]
    
    table_counts = {}
    for table in tables:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            table_counts[table] = count
    
    return table_counts

def get_model_for_table(table_name):
    """Encontra o modelo Django para uma tabela"""
    for model in apps.get_models():
        if model._meta.db_table == table_name:
            return model
    return None

def get_model_fields_info(model):
    """Retorna informações sobre os campos do modelo"""
    if not model:
        return None
    
    fields_info = {
        'required': [],
        'optional': [],
        'foreign_keys': [],
        'many_to_many': []
    }
    
    for field in model._meta.get_fields():
        field_name = field.name
        
        if hasattr(field, 'many_to_many') and field.many_to_many:
            fields_info['many_to_many'].append(field_name)
        elif hasattr(field, 'remote_field') and field.remote_field:
            fields_info['foreign_keys'].append({
                'name': field_name,
                'related_model': field.remote_field.model.__name__
            })
        elif not field.auto_created:
            if hasattr(field, 'blank') and not field.blank and not field.null:
                if field_name not in ['id', 'created_at', 'updated_at']:
                    fields_info['required'].append(field_name)
            else:
                fields_info['optional'].append(field_name)
    
    return fields_info

def main():
    print("=" * 100)
    print("ANÁLISE COMPLETA DAS 94 TABELAS DO BANCO DE DADOS")
    print("=" * 100)
    
    # Buscar usuário Ana Silva
    try:
        user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
        ordoc_user = user.ordoc_profile
        print(f"\n✅ Usuário encontrado: {ordoc_user}")
        print(f"   Email: {user.email}")
        print(f"   ID: {user.id}")
        print(f"   OrdocUser ID: {ordoc_user.id}\n")
    except User.DoesNotExist:
        print("\n❌ Usuário ana.silva@silvaadvocacia.com.br não encontrado!")
        return
    
    # Obter contagens de todas as tabelas
    print("\nAnalisando tabelas...")
    table_counts = get_all_tables_with_counts()
    
    # Separar tabelas vazias e populadas
    empty_tables = {k: v for k, v in table_counts.items() if v == 0}
    populated_tables = {k: v for k, v in table_counts.items() if v > 0}
    
    print(f"\n📊 ESTATÍSTICAS GERAIS:")
    print(f"   Total de tabelas (excluindo Django/Auth/Guardian): {len(table_counts)}")
    print(f"   Tabelas populadas: {len(populated_tables)}")
    print(f"   Tabelas vazias: {len(empty_tables)}")
    print(f"   Taxa de cobertura: {len(populated_tables)/len(table_counts)*100:.1f}%")
    
    # Mostrar tabelas vazias agrupadas por módulo
    print(f"\n{'='*100}")
    print("TABELAS VAZIAS QUE PRECISAM SER POPULADAS")
    print(f"{'='*100}\n")
    
    modules = {}
    for table in sorted(empty_tables.keys()):
        module = table.split('_')[0] + '_' + table.split('_')[1] if '_' in table else 'other'
        if module not in modules:
            modules[module] = []
        modules[module].append(table)
    
    for module, tables in sorted(modules.items()):
        print(f"\n📦 {module.upper().replace('_', ' ')}")
        for table in tables:
            model = get_model_for_table(table)
            if model:
                print(f"   ├─ {table:<50} (Modelo: {model.__name__})")
            else:
                print(f"   ├─ {table:<50} (⚠️  Modelo não encontrado)")
    
    # Mostrar tabelas populadas
    print(f"\n{'='*100}")
    print("TABELAS JÁ POPULADAS")
    print(f"{'='*100}\n")
    
    modules_populated = {}
    for table, count in sorted(populated_tables.items()):
        module = table.split('_')[0] + '_' + table.split('_')[1] if '_' in table else 'other'
        if module not in modules_populated:
            modules_populated[module] = []
        modules_populated[module].append((table, count))
    
    for module, tables in sorted(modules_populated.items()):
        print(f"\n📦 {module.upper().replace('_', ' ')}")
        for table, count in tables:
            print(f"   ├─ {table:<50} {count:>6} registros")
    
    # Análise detalhada de tabelas vazias
    print(f"\n{'='*100}")
    print("ANÁLISE DETALHADA DE TABELAS VAZIAS (Campos Obrigatórios)")
    print(f"{'='*100}\n")
    
    for table in sorted(empty_tables.keys()):
        model = get_model_for_table(table)
        if model:
            fields_info = get_model_fields_info(model)
            print(f"\n📋 {table} ({model.__name__})")
            
            if fields_info['required']:
                print(f"   Campos obrigatórios: {', '.join(fields_info['required'])}")
            
            if fields_info['foreign_keys']:
                print(f"   Foreign Keys:")
                for fk in fields_info['foreign_keys']:
                    print(f"      - {fk['name']} → {fk['related_model']}")
            
            if fields_info['many_to_many']:
                print(f"   Many-to-Many: {', '.join(fields_info['many_to_many'])}")
    
    print(f"\n{'='*100}")
    print("✅ ANÁLISE COMPLETA!")
    print(f"{'='*100}\n")

if __name__ == '__main__':
    main()
