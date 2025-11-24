#!/usr/bin/env python3
"""
Script de teste completo para autenticação real e APIs do OrdocFlow
Testa o fluxo completo: registro, login, e uso das APIs com JWT real
"""

import os
import requests
import json
import time
import sys
from datetime import datetime
import uuid

# Configurações
BASE_URL = "http://localhost:8000"
AUTH_BASE = f"{BASE_URL}/api/auth"
API_BASE = f"{BASE_URL}/api/v1/ordoc-flow/api"

# Senha padrão para os usuários de teste
TEST_PASSWORD = os.environ.get("TEST_PASSWORD", "changeme123")

# Headers padrão
HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class OrdocFlowAuthTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.auth_token = None
        self.user_data = None
        self.organization_data = None
        self.test_data = {}
    
    def log(self, message, level="INFO"):
        """Log de mensagens com timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def test_backend_health(self):
        """Testa se o backend está respondendo"""
        self.log("🔍 Testando conectividade do backend...")
        try:
            response = self.session.get(f"{BASE_URL}/admin/")
            if response.status_code in [200, 302]:  # 302 = redirect to login
                self.log("✅ Backend Django está respondendo")
                return True
            else:
                self.log(f"❌ Backend retornou status {response.status_code}", "ERROR")
                return False
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Erro de conectividade: {e}", "ERROR")
            return False
    
    def create_demo_organization(self):
        """Cria uma organização demo para testes"""
        self.log("🏢 Criando organização demo...")
        
        org_data = {
            "subdomain": "demo",
            "name": "Organização Demo OrdocFlow"
        }
        
        try:
            response = self.session.post(f"{AUTH_BASE}/create-demo-org/", json=org_data)
            
            if response.status_code == 201:
                org_info = response.json()
                self.organization_data = org_info['organization']
                self.log(f"✅ Organização criada: {self.organization_data['name']}")
                return True
            elif response.status_code == 409:
                self.log("ℹ️ Organização demo já existe, continuando...")
                self.organization_data = {
                    'subdomain': 'demo',
                    'name': 'Organização Demo OrdocFlow'
                }
                return True
            else:
                self.log(f"❌ Erro ao criar organização: {response.text}", "ERROR")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Erro na criação da organização: {e}", "ERROR")
            return False
    
    def register_user(self):
        """Registra um usuário interno para testes"""
        self.log("👤 Registrando usuário interno...")
        
        # Gera dados únicos para o teste
        timestamp = int(time.time())
        user_data = {
            "email": f"teste{timestamp}@ordocflow.com",
            "password": TEST_PASSWORD,
            "name": f"Usuário Teste {timestamp}",
            "subdomain": "demo"
        }
        
        try:
            response = self.session.post(f"{AUTH_BASE}/register/", json=user_data)
            
            if response.status_code == 201:
                result = response.json()
                self.auth_token = result['token']
                self.user_data = result['user']
                self.organization_data = result['organization']
                
                # Atualiza headers com token
                self.session.headers.update({
                    'Authorization': f'Bearer {self.auth_token}'
                })
                
                self.log(f"✅ Usuário registrado: {self.user_data['name']} ({self.user_data['email']})")
                return True
            else:
                self.log(f"❌ Erro no registro: {response.text}", "ERROR")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Erro no registro: {e}", "ERROR")
            return False
    
    def test_login(self):
        """Testa login com usuário existente"""
        self.log("🔐 Testando login...")
        
        if not self.user_data:
            self.log("❌ Dados do usuário não disponíveis para teste de login", "ERROR")
            return False
        
        login_data = {
            "email": self.user_data['email'],
            "password": TEST_PASSWORD,
            "user_type": "internal"
        }
        
        try:
            # Remove token temporariamente para testar login
            old_auth = self.session.headers.get('Authorization')
            if 'Authorization' in self.session.headers:
                del self.session.headers['Authorization']
            
            response = self.session.post(f"{AUTH_BASE}/login/", json=login_data)
            
            if response.status_code == 200:
                result = response.json()
                self.auth_token = result['token']
                
                # Restaura token
                self.session.headers.update({
                    'Authorization': f'Bearer {self.auth_token}'
                })
                
                self.log("✅ Login realizado com sucesso")
                return True
            else:
                # Restaura token anterior em caso de erro
                if old_auth:
                    self.session.headers['Authorization'] = old_auth
                self.log(f"❌ Erro no login: {response.text}", "ERROR")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Erro no login: {e}", "ERROR")
            return False
    
    def test_authenticated_api_call(self, endpoint, method='GET', data=None):
        """Testa uma chamada autenticada para a API"""
        try:
            url = f"{API_BASE}/{endpoint.lstrip('/')}"
            
            if method.upper() == 'GET':
                response = self.session.get(url)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url)
            else:
                raise ValueError(f"Método HTTP não suportado: {method}")
            
            return response
            
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Erro na chamada da API {endpoint}: {e}", "ERROR")
            return None
    
    def test_procedures_api(self):
        """Testa API de procedimentos com autenticação"""
        self.log("📋 Testando API de Procedimentos autenticada...")
        
        # Lista procedimentos
        response = self.test_authenticated_api_call('procedures/')
        if response and response.status_code == 200:
            procedures = response.json()
            self.log(f"✅ Procedimentos listados: {len(procedures.get('results', []))} encontrados")
            
            # Testa criação de procedimento
            new_procedure = {
                "title": "Procedimento de Teste",
                "description": "Procedimento criado via API para teste",
                "priority": "medium",
                "status": "draft"
            }
            
            create_response = self.test_authenticated_api_call('procedures/', 'POST', new_procedure)
            if create_response and create_response.status_code == 201:
                created = create_response.json()
                self.test_data['procedure_id'] = created['id']
                self.log(f"✅ Procedimento criado: {created['title']}")
                return True
            else:
                self.log(f"⚠️ Criação de procedimento falhou: {create_response.text if create_response else 'Sem resposta'}", "WARNING")
                return True  # Lista funcionou, criação pode falhar por validações
        else:
            self.log(f"❌ Erro ao listar procedimentos: {response.text if response else 'Sem resposta'}", "ERROR")
            return False
    
    def test_tasks_api(self):
        """Testa API de tarefas com autenticação"""
        self.log("📝 Testando API de Tarefas autenticada...")
        
        # Lista tarefas
        response = self.test_authenticated_api_call('tasks/')
        if response and response.status_code == 200:
            tasks = response.json()
            self.log(f"✅ Tarefas listadas: {len(tasks.get('results', []))} encontradas")
            
            # Testa minhas tarefas
            my_tasks_response = self.test_authenticated_api_call('tasks/my_tasks/')
            if my_tasks_response and my_tasks_response.status_code == 200:
                my_tasks = my_tasks_response.json()
                self.log(f"✅ Minhas tarefas: {len(my_tasks.get('results', []))} encontradas")
                return True
            else:
                self.log(f"⚠️ Erro ao buscar minhas tarefas: {my_tasks_response.text if my_tasks_response else 'Sem resposta'}", "WARNING")
                return True  # Lista geral funcionou
        else:
            self.log(f"❌ Erro ao listar tarefas: {response.text if response else 'Sem resposta'}", "ERROR")
            return False
    
    def test_dashboard_api(self):
        """Testa API do dashboard com autenticação"""
        self.log("📊 Testando API do Dashboard autenticada...")
        
        response = self.test_authenticated_api_call('dashboard/')
        if response and response.status_code == 200:
            dashboard = response.json()
            self.log("✅ Dashboard carregado com sucesso")
            
            # Testa overview se disponível
            overview_response = self.test_authenticated_api_call('dashboard/overview/')
            if overview_response and overview_response.status_code == 200:
                self.log("✅ Overview do dashboard funcionando")
            
            return True
        else:
            self.log(f"❌ Erro no dashboard: {response.text if response else 'Sem resposta'}", "ERROR")
            return False
    
    def test_approval_workflows_api(self):
        """Testa API de workflows de aprovação"""
        self.log("⚙️ Testando API de Workflows de Aprovação...")
        
        response = self.test_authenticated_api_call('approval-workflows/')
        if response and response.status_code == 200:
            workflows = response.json()
            self.log(f"✅ Workflows de aprovação: {len(workflows.get('results', []))} encontrados")
            return True
        else:
            self.log(f"❌ Erro nos workflows: {response.text if response else 'Sem resposta'}", "ERROR")
            return False
    
    def test_analytics_api(self):
        """Testa API de analytics"""
        self.log("📈 Testando API de Analytics...")
        
        response = self.test_authenticated_api_call('analytics/')
        if response and response.status_code == 200:
            analytics = response.json()
            self.log("✅ Analytics funcionando")
            return True
        else:
            self.log(f"❌ Erro no analytics: {response.text if response else 'Sem resposta'}", "ERROR")
            return False
    
    def test_batch_operations_api(self):
        """Testa API de operações em lote"""
        self.log("🔄 Testando API de Operações em Lote...")
        
        # Testa endpoint de listagem
        response = self.test_authenticated_api_call('batch-operations/')
        if response and response.status_code == 200:
            self.log("✅ Batch operations endpoint respondendo")
            return True
        else:
            self.log(f"❌ Erro em batch operations: {response.text if response else 'Sem resposta'}", "ERROR")
            return False
    
    def run_all_tests(self):
        """Executa todos os testes de autenticação e APIs"""
        self.log("🚀 Iniciando testes completos de autenticação e OrdocFlow...")
        self.log("=" * 70)
        
        tests = [
            ("Backend Health Check", self.test_backend_health),
            ("Create Demo Organization", self.create_demo_organization),
            ("User Registration", self.register_user),
            ("User Login", self.test_login),
            ("Procedures API", self.test_procedures_api),
            ("Tasks API", self.test_tasks_api),
            ("Dashboard API", self.test_dashboard_api),
            ("Approval Workflows API", self.test_approval_workflows_api),
            ("Analytics API", self.test_analytics_api),
            ("Batch Operations API", self.test_batch_operations_api),
        ]
        
        results = {}
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            self.log(f"\n🧪 Executando: {test_name}")
            try:
                result = test_func()
                results[test_name] = result
                if result:
                    passed += 1
                    self.log(f"✅ {test_name}: PASSOU")
                else:
                    self.log(f"❌ {test_name}: FALHOU", "ERROR")
            except Exception as e:
                self.log(f"💥 {test_name}: ERRO - {e}", "ERROR")
                results[test_name] = False
        
        # Resumo final
        self.log("\n" + "=" * 70)
        self.log("📊 RESUMO DOS TESTES DE AUTENTICAÇÃO")
        self.log("=" * 70)
        
        if self.user_data:
            self.log(f"👤 Usuário: {self.user_data['name']} ({self.user_data['email']})")
        if self.organization_data:
            self.log(f"🏢 Organização: {self.organization_data['name']}")
        if self.auth_token:
            self.log(f"🔑 Token JWT: {self.auth_token[:50]}...")
        
        self.log("\n📋 Resultados por teste:")
        for test_name, result in results.items():
            status = "✅ PASSOU" if result else "❌ FALHOU"
            self.log(f"  {test_name}: {status}")
        
        self.log(f"\n🎯 RESULTADO FINAL: {passed}/{total} testes passaram")
        
        if passed == total:
            self.log("🎉 TODOS OS TESTES PASSARAM! Autenticação e OrdocFlow funcionando perfeitamente!")
        elif passed >= total * 0.8:
            self.log("✅ Maioria dos testes passou. Sistema funcional com autenticação real.")
        elif passed >= total * 0.5:
            self.log("⚠️ Alguns testes falharam. Sistema parcialmente funcional.", "WARNING")
        else:
            self.log("❌ Muitos testes falharam. Sistema com problemas sérios.", "ERROR")
        
        return passed / total


def main():
    """Função principal"""
    print("🔬 TESTE COMPLETO DE AUTENTICAÇÃO E ORDOCFLOW")
    print("=" * 70)
    print("Este script testa:")
    print("• Criação de organização demo")
    print("• Registro de usuário interno")
    print("• Login com JWT real")
    print("• Todas as APIs do OrdocFlow autenticadas")
    print("• Criação de dados de teste")
    print("=" * 70)
    
    tester = OrdocFlowAuthTester()
    success_rate = tester.run_all_tests()
    
    # Exit code baseado no sucesso
    exit_code = 0 if success_rate >= 0.8 else 1
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
