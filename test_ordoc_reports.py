#!/usr/bin/env python3
"""
Script de teste para validar as APIs do módulo OrdocReports
Testa autenticação JWT e funcionalidades principais do sistema de relatórios
"""

import requests
import json
import sys
from datetime import datetime

# Configurações
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1/ordoc-reports/api"

# Credenciais de teste
TEST_USER = {
    "email": "teste@ordocflow.com",
    "password": "senha123",
    "user_type": "internal"
}

class OrdocReportsAPITester:
    def __init__(self):
        self.token = None
        self.headers = {}
        self.test_results = []
    
    def authenticate(self):
        """Autentica e obtém token JWT"""
        print("🔐 Autenticando usuário...")
        
        auth_url = f"{BASE_URL}/api/auth/login/"
        
        response = requests.post(
            auth_url,
            json=TEST_USER,
            headers={"X-Api-Subdomain": "demo"}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.token = data.get('token')
            self.headers = {
                "Authorization": f"Bearer {self.token}",
                "X-Api-Subdomain": "demo",
                "Content-Type": "application/json"
            }
            print(f"✅ Autenticação realizada com sucesso")
            print(f"   Token: {self.token[:50]}...")
            return True
        else:
            print(f"❌ Erro na autenticação: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    
    def test_endpoint(self, name, method, endpoint, data=None, expected_status=200):
        """Testa um endpoint específico"""
        url = f"{API_BASE}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method.upper() == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=self.headers)
            else:
                raise ValueError(f"Método HTTP não suportado: {method}")
            
            success = response.status_code == expected_status
            
            result = {
                'name': name,
                'method': method.upper(),
                'endpoint': endpoint,
                'status_code': response.status_code,
                'expected_status': expected_status,
                'success': success,
                'response_preview': self._get_response_preview(response)
            }
            
            self.test_results.append(result)
            
            status_icon = "✅" if success else "❌"
            print(f"{status_icon} {name}: {method.upper()} {endpoint}")
            print(f"   Status: {response.status_code} (esperado: {expected_status})")
            
            if not success:
                print(f"   Erro: {response.text[:200]}...")
            else:
                preview = result['response_preview']
                if preview:
                    print(f"   Preview: {preview}")
            
            return success, response
            
        except Exception as e:
            print(f"❌ Erro ao testar {name}: {str(e)}")
            self.test_results.append({
                'name': name,
                'method': method.upper(),
                'endpoint': endpoint,
                'status_code': 'ERROR',
                'expected_status': expected_status,
                'success': False,
                'error': str(e)
            })
            return False, None
    
    def _get_response_preview(self, response):
        """Obtém uma prévia da resposta"""
        try:
            if response.headers.get('content-type', '').startswith('application/json'):
                data = response.json()
                if isinstance(data, dict):
                    if 'count' in data:
                        return f"count: {data['count']}"
                    elif 'results' in data:
                        return f"results: {len(data['results'])} items"
                    elif 'message' in data:
                        return f"message: {data['message']}"
                    else:
                        keys = list(data.keys())[:3]
                        return f"keys: {keys}"
                elif isinstance(data, list):
                    return f"list: {len(data)} items"
                else:
                    return f"type: {type(data).__name__}"
            else:
                return f"content-type: {response.headers.get('content-type', 'unknown')}"
        except:
            return "não-json"
    
    def run_tests(self):
        """Executa todos os testes das APIs do OrdocReports"""
        print("🚀 Iniciando testes das APIs do OrdocReports")
        print("=" * 60)
        
        # 1. Autenticação
        if not self.authenticate():
            print("❌ Falha na autenticação. Abortando testes.")
            return False
        
        print("\n📊 Testando APIs do Sistema de Relatórios...")
        print("-" * 60)
        
        # 2. Templates de Relatórios
        print("\n🎨 Testando Templates de Relatórios:")
        self.test_endpoint("Listar Templates", "GET", "/templates/")
        self.test_endpoint("Categorias Disponíveis", "GET", "/templates/categories/")
        self.test_endpoint("Tipos Disponíveis", "GET", "/templates/types/")
        
        # Criar template de teste com nome único
        import time
        timestamp = int(time.time())
        template_data = {
            "name": f"Relatório de Teste {timestamp}",
            "description": "Template criado automaticamente para testes",
            "category": "documents",
            "type": "table",
            "status": "active",
            "query_config": {
                "model": "ordoc_flow.Procedure",
                "fields": ["id", "name", "status", "created_at"],
                "filters": {},
                "ordering": ["-created_at"]
            },
            "display_config": {
                "column_labels": {
                    "id": "ID",
                    "name": "Nome",
                    "status": "Status",
                    "created_at": "Criado em"
                }
            },
            "filter_config": {},
            "export_config": {},
            "is_public": True,
            "allowed_roles": []
        }
        
        success, response = self.test_endpoint("Criar Template", "POST", "/templates/", template_data, 201)
        template_id = None
        if success and response:
            try:
                template_id = response.json().get('id')
                print(f"   Template criado com ID: {template_id}")
            except:
                pass
        
        # 3. Relatórios
        print("\n📈 Testando Relatórios:")
        self.test_endpoint("Listar Relatórios", "GET", "/reports/")
        self.test_endpoint("Estatísticas de Relatórios", "GET", "/reports/stats/")
        
        # Gerar relatório se temos um template
        if template_id:
            report_data = {
                "template_id": template_id,
                "title": "Relatório de Teste Automático",
                "description": "Relatório gerado automaticamente pelos testes",
                "format": "html",
                "filters": {},
                "parameters": {},
                "expires_in_days": 30
            }
            
            success, response = self.test_endpoint("Gerar Relatório", "POST", "/reports/generate/", report_data, 201)
            report_id = None
            if success and response:
                try:
                    report_id = response.json().get('id')
                    print(f"   Relatório criado com ID: {report_id}")
                except:
                    pass
        
        # 4. Agendamentos
        print("\n⏰ Testando Agendamentos:")
        self.test_endpoint("Listar Agendamentos", "GET", "/schedules/")
        
        # 5. Compartilhamentos
        print("\n🔗 Testando Compartilhamentos:")
        self.test_endpoint("Listar Compartilhamentos", "GET", "/shares/")
        
        # 6. Métricas
        print("\n📊 Testando Métricas:")
        self.test_endpoint("Listar Métricas", "GET", "/metrics/")
        self.test_endpoint("Dashboard de Métricas", "GET", "/metrics/dashboard/")
        
        # 7. Resumo dos resultados
        print("\n" + "=" * 60)
        print("📋 RESUMO DOS TESTES")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        successful_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - successful_tests
        
        print(f"Total de testes: {total_tests}")
        print(f"✅ Sucessos: {successful_tests}")
        print(f"❌ Falhas: {failed_tests}")
        print(f"📊 Taxa de sucesso: {(successful_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ Testes que falharam:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   - {result['name']}: {result['method']} {result['endpoint']}")
                    print(f"     Status: {result['status_code']} (esperado: {result['expected_status']})")
        
        print(f"\n🎯 Status final: {'✅ TODOS OS TESTES PASSARAM!' if failed_tests == 0 else '❌ ALGUNS TESTES FALHARAM'}")
        
        return failed_tests == 0

def main():
    """Função principal"""
    print("🧪 TESTE AUTOMATIZADO - ORDOC REPORTS")
    print("=" * 60)
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Base URL: {BASE_URL}")
    print(f"Usuário de teste: {TEST_USER['email']}")
    
    tester = OrdocReportsAPITester()
    
    try:
        success = tester.run_tests()
        
        # Salva resultados em arquivo
        results_file = f"test_results_ordoc_reports_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'base_url': BASE_URL,
                'test_user': TEST_USER['email'],
                'summary': {
                    'total_tests': len(tester.test_results),
                    'successful_tests': sum(1 for r in tester.test_results if r['success']),
                    'failed_tests': sum(1 for r in tester.test_results if not r['success']),
                    'success_rate': sum(1 for r in tester.test_results if r['success']) / len(tester.test_results) * 100 if tester.test_results else 0
                },
                'results': tester.test_results
            }, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"\n💾 Resultados salvos em: {results_file}")
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Testes interrompidos pelo usuário")
        return 1
    except Exception as e:
        print(f"\n\n❌ Erro inesperado: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
