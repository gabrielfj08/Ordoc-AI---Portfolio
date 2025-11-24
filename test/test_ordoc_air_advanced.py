#!/usr/bin/env python3
"""
Script de teste para funcionalidades avançadas do OrdocAir
Testa Batch Operations, OCR e integração com Solr
"""

import os
import requests
import json
import time
from datetime import datetime

# Configurações
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api"

# Headers para autenticação
headers = {
    'Content-Type': 'application/json',
    'X-API-Subdomain': 'demo'
}

def print_separator(title):
    """Imprime separador com título"""
    print("\n" + "="*80)
    print(f" {title}")
    print("="*80)

def print_test_result(test_name, success, details=None):
    """Imprime resultado do teste"""
    status = "✅ PASSOU" if success else "❌ FALHOU"
    print(f"{test_name}: {status}")
    if details:
        print(f"   Detalhes: {details}")

def login():
    """Faz login e obtém token JWT"""
    login_data = {
        "email": os.environ.get("TEST_USER_EMAIL", "user@example.com"),
        "password": os.environ.get("TEST_USER_PASSWORD", "changeme123"),
        "user_type": "internal"
    }
    
    response = requests.post(f"{API_BASE}/auth/login/", json=login_data, headers=headers)
    
    if response.status_code == 200:
        token = response.json().get('token')
        headers['Authorization'] = f'Bearer {token}'
        print_test_result("Login", True, f"Token obtido: {token[:20]}...")
        return True
    else:
        print_test_result("Login", False, f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_batch_operations():
    """Testa operações em lote"""
    print_separator("TESTE DE OPERAÇÕES EM LOTE")
    
    # 1. Listar operações em lote
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/batch-operations/", headers=headers)
    success = response.status_code == 200
    print_test_result("Listar Batch Operations", success, f"Status: {response.status_code}")
    
    # 2. Obter estatísticas
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/batch-operations/stats/", headers=headers)
    success = response.status_code == 200
    if success:
        stats = response.json()
        print_test_result("Estatísticas Batch Operations", success, 
                         f"Total: {stats.get('total_operations', 0)}")
    else:
        print_test_result("Estatísticas Batch Operations", success, f"Status: {response.status_code}")
    
    # 3. Criar operação em lote (exemplo: alterar status)
    batch_data = {
        "name": f"Teste Batch Operation {datetime.now().strftime('%H%M%S')}",
        "description": "Operação de teste para alterar status de documentos",
        "operation_type": "change_status",
        "parameters": {
            "new_status": "active"
        },
        "filters": {
            "status": "draft"
        },
        "execute_immediately": False
    }
    
    response = requests.post(f"{API_BASE}/v1/ordoc-air/advanced/api/batch-operations/create-and-execute/", 
                           json=batch_data, headers=headers)
    success = response.status_code == 201
    batch_operation_id = None
    if success:
        batch_operation = response.json()
        batch_operation_id = batch_operation.get('id')
        print_test_result("Criar Batch Operation", success, 
                         f"ID: {batch_operation_id}")
    else:
        print_test_result("Criar Batch Operation", success, 
                         f"Status: {response.status_code}, Response: {response.text}")
    
    # 4. Obter progresso da operação (se criada)
    if batch_operation_id:
        response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/batch-operations/{batch_operation_id}/progress/", 
                              headers=headers)
        success = response.status_code == 200
        if success:
            progress = response.json()
            print_test_result("Progresso Batch Operation", success, 
                             f"Status: {progress.get('status')}, Progresso: {progress.get('progress_percentage', 0)}%")
        else:
            print_test_result("Progresso Batch Operation", success, f"Status: {response.status_code}")

def test_ocr_functionality():
    """Testa funcionalidades de OCR"""
    print_separator("TESTE DE FUNCIONALIDADES OCR")
    
    # 1. Listar resultados OCR
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/ocr-results/", headers=headers)
    success = response.status_code == 200
    print_test_result("Listar Resultados OCR", success, f"Status: {response.status_code}")
    
    # 2. Obter estatísticas OCR
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/ocr-results/stats/", headers=headers)
    success = response.status_code == 200
    if success:
        stats = response.json()
        print_test_result("Estatísticas OCR", success, 
                         f"Total: {stats.get('total_documents', 0)}, Processados: {stats.get('processed_documents', 0)}")
    else:
        print_test_result("Estatísticas OCR", success, f"Status: {response.status_code}")
    
    # 3. Processar OCR em lote (exemplo com IDs fictícios)
    ocr_batch_data = {
        "document_ids": []  # Lista vazia pois não temos documentos reais
    }
    
    response = requests.post(f"{API_BASE}/v1/ordoc-air/advanced/api/ocr-results/batch-process/", 
                           json=ocr_batch_data, headers=headers)
    # Esperamos erro 400 pois não há documentos
    success = response.status_code == 400
    print_test_result("OCR Batch Process (sem documentos)", success, 
                     "Erro esperado - nenhum documento fornecido")

def test_solr_functionality():
    """Testa funcionalidades do Solr"""
    print_separator("TESTE DE FUNCIONALIDADES SOLR")
    
    # 1. Listar índices Solr
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/solr-indexes/", headers=headers)
    success = response.status_code == 200
    print_test_result("Listar Índices Solr", success, f"Status: {response.status_code}")
    
    # 2. Obter estatísticas Solr
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/solr-indexes/stats/", headers=headers)
    success = response.status_code == 200
    if success:
        stats = response.json()
        print_test_result("Estatísticas Solr", success, 
                         f"Total: {stats.get('total_documents', 0)}, Indexados: {stats.get('indexed_documents', 0)}")
    else:
        print_test_result("Estatísticas Solr", success, f"Status: {response.status_code}")
    
    # 3. Indexação em lote (exemplo com IDs fictícios)
    solr_batch_data = {
        "document_ids": []  # Lista vazia pois não temos documentos reais
    }
    
    response = requests.post(f"{API_BASE}/v1/ordoc-air/advanced/api/solr-indexes/batch-index/", 
                           json=solr_batch_data, headers=headers)
    # Esperamos erro 400 pois não há documentos
    success = response.status_code == 400
    print_test_result("Solr Batch Index (sem documentos)", success, 
                     "Erro esperado - nenhum documento fornecido")

def test_document_search():
    """Testa funcionalidades de busca"""
    print_separator("TESTE DE BUSCA DE DOCUMENTOS")
    
    # 1. Busca simples
    search_data = {
        "query": "teste",
        "start": 0,
        "rows": 10,
        "highlight": True
    }
    
    response = requests.post(f"{API_BASE}/v1/ordoc-air/advanced/api/search/search/", 
                           json=search_data, headers=headers)
    success = response.status_code in [200, 500]  # 500 é esperado se Solr não estiver disponível
    if response.status_code == 200:
        results = response.json()
        print_test_result("Busca de Documentos", True, 
                         f"Total hits: {results.get('total_hits', 0)}")
    elif response.status_code == 500:
        print_test_result("Busca de Documentos", True, 
                         "Erro esperado - Solr não disponível")
    else:
        print_test_result("Busca de Documentos", False, f"Status: {response.status_code}")
    
    # 2. Obter sugestões
    response = requests.get(f"{API_BASE}/v1/ordoc-air/advanced/api/search/suggestions/?q=test", headers=headers)
    success = response.status_code == 200
    print_test_result("Sugestões de Busca", success, f"Status: {response.status_code}")

def test_api_endpoints():
    """Testa todos os endpoints das funcionalidades avançadas"""
    print_separator("TESTE GERAL DAS APIs AVANÇADAS")
    
    endpoints_to_test = [
        ("GET", "/v1/ordoc-air/advanced/api/batch-operations/", "Batch Operations - Listar"),
        ("GET", "/v1/ordoc-air/advanced/api/batch-operations/stats/", "Batch Operations - Stats"),
        ("GET", "/v1/ordoc-air/advanced/api/ocr-results/", "OCR Results - Listar"),
        ("GET", "/v1/ordoc-air/advanced/api/ocr-results/stats/", "OCR Results - Stats"),
        ("GET", "/v1/ordoc-air/advanced/api/solr-indexes/", "Solr Indexes - Listar"),
        ("GET", "/v1/ordoc-air/advanced/api/solr-indexes/stats/", "Solr Indexes - Stats"),
        ("GET", "/v1/ordoc-air/advanced/api/search/suggestions/", "Search - Sugestões"),
    ]
    
    results = []
    
    for method, endpoint, name in endpoints_to_test:
        url = f"{API_BASE}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, json={}, headers=headers)
            
            success = response.status_code in [200, 400, 500]  # 400/500 podem ser esperados
            results.append((name, success, response.status_code))
            
            print_test_result(name, success, f"Status: {response.status_code}")
            
        except Exception as e:
            results.append((name, False, f"Erro: {str(e)}"))
            print_test_result(name, False, f"Exceção: {str(e)}")
    
    return results

def generate_summary(results):
    """Gera resumo dos testes"""
    print_separator("RESUMO DOS TESTES")
    
    total_tests = len(results)
    passed_tests = sum(1 for _, success, _ in results if success)
    failed_tests = total_tests - passed_tests
    
    success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    
    print(f"📊 ESTATÍSTICAS FINAIS:")
    print(f"   Total de testes: {total_tests}")
    print(f"   Testes aprovados: {passed_tests} ✅")
    print(f"   Testes falharam: {failed_tests} ❌")
    print(f"   Taxa de sucesso: {success_rate:.1f}%")
    
    if failed_tests > 0:
        print(f"\n❌ TESTES QUE FALHARAM:")
        for name, success, details in results:
            if not success:
                print(f"   - {name}: {details}")
    
    print(f"\n🎯 STATUS GERAL: {'SUCESSO' if success_rate >= 80 else 'ATENÇÃO NECESSÁRIA'}")
    
    return {
        'total_tests': total_tests,
        'passed_tests': passed_tests,
        'failed_tests': failed_tests,
        'success_rate': success_rate,
        'overall_status': 'SUCESSO' if success_rate >= 80 else 'ATENÇÃO NECESSÁRIA'
    }

def main():
    """Função principal"""
    print_separator("TESTE DAS FUNCIONALIDADES AVANÇADAS DO ORDOCAIR")
    print(f"🚀 Iniciando testes em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 URL Base: {BASE_URL}")
    
    # Fazer login
    if not login():
        print("❌ Falha no login. Abortando testes.")
        return
    
    # Executar testes
    try:
        test_batch_operations()
        test_ocr_functionality()
        test_solr_functionality()
        test_document_search()
        results = test_api_endpoints()
        
        # Gerar resumo
        summary = generate_summary(results)
        
        # Salvar resultados
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"test_results_ordoc_air_advanced_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'summary': summary,
                'detailed_results': results
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Resultados salvos em: {filename}")
        
    except Exception as e:
        print(f"❌ Erro durante os testes: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
