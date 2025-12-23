#!/usr/bin/env python
"""
Script de Teste E2E - Feature 1.2: Pastas com Insights

Testa os seguintes cenários:
1. Pasta Saudável (10 docs organizados)
2. Pasta com Atenção (50 docs, 15 sem tags)
3. Pasta Crítica (120 docs, 30 sem tags)
4. Navegação e endpoint stats

Uso:
    python manage.py shell < scripts/test_folders_insights.py
    # ou
    docker exec ordoc_backend python manage.py shell < scripts/test_folders_insights.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from django.contrib.auth.models import User
from ordoc_air.models import Organization, Department, Directory, Document, Tag
from django.utils import timezone
from django.db import transaction
import uuid

print("=" * 80)
print("🧪 TESTES E2E - FEATURE 1.2: PASTAS COM INSIGHTS")
print("=" * 80)

def cleanup_test_data():
    """Remove dados de teste anteriores"""
    print("\n🧹 Limpando dados de testes anteriores...")
    
    # Deletar organizações de teste
    test_orgs = Organization.objects.filter(corporate_name__startswith='[TEST]')
    if test_orgs.exists():
        print(f"   Removendo {test_orgs.count()} organizações de teste...")
        test_orgs.delete()
    
    print("   ✅ Limpeza concluída")


def create_test_organization():
    """Cria organização de teste"""
    print("\n📦 Criando organização de teste...")
    
    # Buscar ou criar usuário admin
    user, _ = User.objects.get_or_create(
        username='admin_test',
        defaults={'email': 'admin@test.com', 'is_staff': True}
    )
    
    org = Organization.objects.create(
        corporate_name='[TEST] Empresa de Testes Ltda',
        cnpj=f'{uuid.uuid4().hex[:14]}',  # CNPJ único
        email='test@example.com',
        phone='11999999999',
        contact_name='Admin Test',
        contact_phone='11999999999',
        subdomain=f'test-{uuid.uuid4().hex[:8]}',
        prn=f'org:test:{uuid.uuid4().hex[:8]}',
        is_active=True,
        created_by=user
    )
    
    print(f"   ✅ Organização criada: {org.corporate_name} (ID: {org.id})")
    return org, user


def create_test_department(org, user):
    """Cria departamento de teste"""
    print("\n📁 Criando departamento de teste...")
    
    dept = Department.objects.create(
        name='Departamento de Testes',
        description='Departamento para testes E2E',
        organization=org,
        prn=f'dept:test:{uuid.uuid4().hex[:8]}',
        is_active=True
    )
    
    print(f"   ✅ Departamento criado: {dept.name} (ID: {dept.id})")
    return dept


def create_directory(dept, name, user):
    """Cria uma pasta"""
    directory = Directory.objects.create(
        name=name,
        description=f'Pasta de teste: {name}',
        path=f'/test/{name.lower().replace(" ", "-")}',
        department=dept,
        prn=f'dir:test:{uuid.uuid4().hex[:8]}',
        is_active=True,
        created_by=user
    )
    return directory


def create_document(directory, name, tags=None, created_days_ago=0):
    """Cria um documento"""
    from django.core.files.uploadedfile import SimpleUploadedFile
    
    # Criar arquivo fake simples
    fake_file = SimpleUploadedFile(
        name,
        b'fake pdf content',
        content_type='application/pdf'
    )
    
    doc = Document.objects.create(
        name=name,
        description=f'Documento de teste: {name}',
        file_size=1024 * 100,  # 100KB
        mime_type='application/pdf',
        directory=directory,
        department=directory.department,
        prn=f'doc:test:{uuid.uuid4().hex[:8]}',
        status='processed',
        file=fake_file,
        created_by=directory.created_by
    )
    
    # Ajustar data de criação se necessário
    if created_days_ago > 0:
        doc.created_at = timezone.now() - timezone.timedelta(days=created_days_ago)
        doc.save(update_fields=['created_at'])
    
    # Adicionar tags se fornecidas
    if tags:
        doc.tags.set(tags)
    
    return doc


def test_scenario_1_healthy_folder(dept, user, tags):
    """
    Cenário 1: Pasta Saudável
    - 10 documentos organizados (todos com tags)
    - Esperado: badge "Organizada" verde, insight "Pasta organizada"
    """
    print("\n" + "=" * 80)
    print("📊 CENÁRIO 1: PASTA SAUDÁVEL")
    print("=" * 80)
    
    # Criar pasta
    folder = create_directory(dept, "Pasta Saudável", user)
    print(f"✅ Pasta criada: {folder.name} (ID: {folder.id})")
    
    # Criar 10 documentos todos com tags
    print("📄 Criando 10 documentos organizados...")
    for i in range(10):
        doc = create_document(
            folder,
            f'Documento_{i+1:02d}.pdf',
            tags=[tags[i % len(tags)]]  # Rotaciona entre as tags
        )
    
    print(f"   ✅ 10 documentos criados com tags")
    
    # Testar endpoint stats
    from rest_framework.test import APIRequestFactory
    from ordoc_air.views import DirectoryViewSet
    
    factory = APIRequestFactory()
    request = factory.get(f'/api/v1/ordoc-air/directories/{folder.id}/stats/')
    request.user = user
    
    view = DirectoryViewSet.as_view({'get': 'stats'})
    response = view(request, pk=folder.id)
    
    # Validar resposta
    data = response.data
    print(f"\n📈 Estatísticas:")
    print(f"   Total documentos: {data['total_documents']}")
    print(f"   Sem tags: {data['uncategorized']}")
    print(f"   Status de saúde: {data['health_status']}")
    print(f"   Ações pendentes: {data['pending_actions']}")
    print(f"   Insights: {len(data['insights'])}")
    for insight in data['insights']:
        print(f"      - [{insight['type']}] {insight['message']}")
    
    # Validações
    assert data['total_documents'] == 10, "❌ Deveria ter 10 documentos"
    assert data['uncategorized'] == 0, "❌ Não deveria ter documentos sem tags"
    assert data['health_status'] == 'healthy', "❌ Status deveria ser 'healthy'"
    assert data['pending_actions'] == 0, "❌ Não deveria ter ações pendentes"
    
    # Verificar se tem insight de pasta organizada
    has_organized_insight = any('organizada' in i['message'].lower() for i in data['insights'])
    assert has_organized_insight, "❌ Deveria ter insight 'Pasta organizada'"
    
    print("\n✅ CENÁRIO 1 PASSOU EM TODOS OS TESTES!")
    return folder


def test_scenario_2_needs_attention(dept, user, tags):
    """
    Cenário 2: Pasta com Atenção
    - 50 documentos, 15 sem tags
    - Esperado: badge "Atenção" amarelo, insight "15 documentos sem tags", ações pendentes = 15
    """
    print("\n" + "=" * 80)
    print("⚠️  CENÁRIO 2: PASTA COM ATENÇÃO")
    print("=" * 80)
    
    # Criar pasta
    folder = create_directory(dept, "Pasta Atenção", user)
    print(f"✅ Pasta criada: {folder.name} (ID: {folder.id})")
    
    # Criar 35 documentos COM tags
    print("📄 Criando 35 documentos com tags...")
    for i in range(35):
        doc = create_document(
            folder,
            f'Documento_Tagged_{i+1:02d}.pdf',
            tags=[tags[i % len(tags)]]
        )
    
    # Criar 15 documentos SEM tags
    print("📄 Criando 15 documentos sem tags...")
    for i in range(15):
        doc = create_document(
            folder,
            f'Documento_Untagged_{i+1:02d}.pdf',
            tags=None
        )
    
    print(f"   ✅ 50 documentos criados (35 com tags, 15 sem tags)")
    
    # Testar endpoint stats
    from rest_framework.test import APIRequestFactory
    from ordoc_air.views import DirectoryViewSet
    
    factory = APIRequestFactory()
    request = factory.get(f'/api/v1/ordoc-air/directories/{folder.id}/stats/')
    request.user = user
    
    view = DirectoryViewSet.as_view({'get': 'stats'})
    response = view(request, pk=folder.id)
    
    # Validar resposta
    data = response.data
    print(f"\n📈 Estatísticas:")
    print(f"   Total documentos: {data['total_documents']}")
    print(f"   Sem tags: {data['uncategorized']}")
    print(f"   Status de saúde: {data['health_status']}")
    print(f"   Ações pendentes: {data['pending_actions']}")
    print(f"   Insights: {len(data['insights'])}")
    for insight in data['insights']:
        print(f"      - [{insight['type']}] {insight['message']}")
    
    # Validações
    assert data['total_documents'] == 50, "❌ Deveria ter 50 documentos"
    assert data['uncategorized'] == 15, "❌ Deveria ter 15 documentos sem tags"
    assert data['health_status'] == 'needs_attention', "❌ Status deveria ser 'needs_attention'"
    assert data['pending_actions'] == 15, "❌ Deveria ter 15 ações pendentes"
    
    # Verificar insight sobre documentos sem tags
    has_uncategorized_insight = any(
        '15' in i['message'] and 'sem tags' in i['message'].lower()
        for i in data['insights']
    )
    assert has_uncategorized_insight, "❌ Deveria ter insight sobre 15 documentos sem tags"
    
    print("\n✅ CENÁRIO 2 PASSOU EM TODOS OS TESTES!")
    return folder


def test_scenario_3_critical(dept, user, tags):
    """
    Cenário 3: Pasta Crítica
    - 120 documentos, 30 sem tags
    - Esperado: badge "Crítico" vermelho, múltiplos insights, ações pendentes > 20
    """
    print("\n" + "=" * 80)
    print("🚨 CENÁRIO 3: PASTA CRÍTICA")
    print("=" * 80)
    
    # Criar pasta
    folder = create_directory(dept, "Pasta Crítica", user)
    print(f"✅ Pasta criada: {folder.name} (ID: {folder.id})")
    
    # Criar 90 documentos COM tags
    print("📄 Criando 90 documentos com tags...")
    for i in range(90):
        doc = create_document(
            folder,
            f'Documento_Tagged_{i+1:03d}.pdf',
            tags=[tags[i % len(tags)]]
        )
    
    # Criar 30 documentos SEM tags
    print("📄 Criando 30 documentos sem tags...")
    for i in range(30):
        doc = create_document(
            folder,
            f'Documento_Untagged_{i+1:02d}.pdf',
            tags=None
        )
    
    # Criar alguns documentos antigos (>1 ano)
    print("📄 Criando 10 documentos antigos...")
    for i in range(10):
        doc = create_document(
            folder,
            f'Documento_Antigo_{i+1:02d}.pdf',
            tags=[tags[0]],
            created_days_ago=400
        )
    
    print(f"   ✅ 130 documentos criados (90 com tags, 30 sem tags, 10 antigos)")
    
    # Testar endpoint stats
    from rest_framework.test import APIRequestFactory
    from ordoc_air.views import DirectoryViewSet
    
    factory = APIRequestFactory()
    request = factory.get(f'/api/v1/ordoc-air/directories/{folder.id}/stats/')
    request.user = user
    
    view = DirectoryViewSet.as_view({'get': 'stats'})
    response = view(request, pk=folder.id)
    
    # Validar resposta
    data = response.data
    print(f"\n📈 Estatísticas:")
    print(f"   Total documentos: {data['total_documents']}")
    print(f"   Sem tags: {data['uncategorized']}")
    print(f"   Documentos antigos: {data['old_documents']}")
    print(f"   Status de saúde: {data['health_status']}")
    print(f"   Ações pendentes: {data['pending_actions']}")
    print(f"   Insights: {len(data['insights'])}")
    for insight in data['insights']:
        print(f"      - [{insight['type']}] {insight['message']}")
    
    # Validações
    assert data['total_documents'] == 130, "❌ Deveria ter 130 documentos"
    assert data['uncategorized'] == 30, "❌ Deveria ter 30 documentos sem tags"
    assert data['health_status'] == 'critical', "❌ Status deveria ser 'critical'"
    assert data['pending_actions'] > 20, "❌ Deveria ter mais de 20 ações pendentes"
    assert len(data['insights']) >= 2, "❌ Deveria ter múltiplos insights"
    
    # Verificar insight sobre organização
    has_organize_insight = any(
        'muitos documentos' in i['message'].lower() or 'subpastas' in i['message'].lower()
        for i in data['insights']
    )
    assert has_organize_insight, "❌ Deveria ter insight sobre organizar em subpastas"
    
    print("\n✅ CENÁRIO 3 PASSOU EM TODOS OS TESTES!")
    return folder


def test_scenario_4_navigation(folders):
    """
    Cenário 4: Navegação
    - Testar acesso aos stats de cada pasta
    """
    print("\n" + "=" * 80)
    print("🧭 CENÁRIO 4: NAVEGAÇÃO E ENDPOINTS")
    print("=" * 80)
    
    for folder in folders:
        print(f"\n📍 Testando pasta: {folder.name}")
        print(f"   URL: /api/v1/ordoc-air/directories/{folder.id}/stats/")
        
        from rest_framework.test import APIRequestFactory
        from ordoc_air.views import DirectoryViewSet
        
        factory = APIRequestFactory()
        request = factory.get(f'/api/v1/ordoc-air/directories/{folder.id}/stats/')
        request.user = folder.created_by
        
        view = DirectoryViewSet.as_view({'get': 'stats'})
        response = view(request, pk=folder.id)
        
        assert response.status_code == 200, f"❌ Endpoint retornou status {response.status_code}"
        assert 'health_status' in response.data, "❌ Resposta não contém health_status"
        assert 'insights' in response.data, "❌ Resposta não contém insights"
        
        print(f"   ✅ Endpoint acessível (200 OK)")
        print(f"   ✅ Status: {response.data['health_status']}")
        print(f"   ✅ {len(response.data['insights'])} insights retornados")
    
    print("\n✅ CENÁRIO 4 PASSOU EM TODOS OS TESTES!")


def main():
    """Executa todos os testes"""
    try:
        # Limpeza
        cleanup_test_data()
        
        # Setup
        org, user = create_test_organization()
        dept = create_test_department(org, user)
        
        # Criar tags de teste
        print("\n🏷️  Criando tags de teste...")
        tags = []
        for tag_name in ['Contrato', 'Relatório', 'Nota Fiscal', 'Proposta']:
            tag, _ = Tag.objects.get_or_create(
                organization=org,
                slug=tag_name.lower(),
                defaults={
                    'name': tag_name,
                    'color': '#3B82F6',
                    'description': f'Tag de teste: {tag_name}'
                }
            )
            tags.append(tag)
        print(f"   ✅ {len(tags)} tags criadas")
        
        # Executar cenários
        folders = []
        folders.append(test_scenario_1_healthy_folder(dept, user, tags))
        folders.append(test_scenario_2_needs_attention(dept, user, tags))
        folders.append(test_scenario_3_critical(dept, user, tags))
        
        # Teste de navegação
        test_scenario_4_navigation(folders)
        
        # Resumo final
        print("\n" + "=" * 80)
        print("🎉 TODOS OS TESTES PASSARAM COM SUCESSO!")
        print("=" * 80)
        print(f"\n📊 Resumo:")
        print(f"   ✅ Organização criada: {org.corporate_name}")
        print(f"   ✅ Departamento criado: {dept.name}")
        print(f"   ✅ {len(folders)} pastas testadas")
        print(f"   ✅ 4 cenários validados")
        print(f"\n💡 Dica: Use o Django Admin ou a API para visualizar os dados de teste")
        print(f"   Organization ID: {org.id}")
        print(f"   Department ID: {dept.id}")
        for folder in folders:
            print(f"   Folder '{folder.name}' ID: {folder.id}")
        
        print("\n🧹 Para limpar os dados de teste, execute novamente este script")
        print("   ou use: Organization.objects.filter(corporate_name__startswith='[TEST]').delete()")
        
    except Exception as e:
        print(f"\n❌ ERRO DURANTE OS TESTES: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
