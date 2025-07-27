#!/usr/bin/env python3
"""
TESTE FINAL - AUTENTICAÇÃO REAL ORDOCFLOW FUNCIONANDO
====================================================

Este script demonstra que a autenticação JWT real está funcionando
perfeitamente com todas as principais APIs do OrdocFlow.
"""

import requests
import json

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiZW1haWwiOiJ0ZXN0ZUBvcmRvY2Zsb3cuY29tIiwibmFtZSI6IlVzdVx1MDBlMXJpbyBUZXN0ZSIsImV4cCI6MTc1MzE5NDczMSwiaWF0IjoxNzUzMTUxNTMxfQ.TQB0PMBw8zFRKc1Nifq4w5bav6MdTAW4_ZoWGs75XdU"

def test_api(endpoint, description):
    """Testa uma API específica com autenticação"""
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"✅ {description}")
                print(f"   Status: {response.status_code}")
                print(f"   Response: {json.dumps(data, indent=2)[:200]}...")
                return True
            except json.JSONDecodeError:
                print(f"❌ {description}")
                print(f"   Status: {response.status_code}")
                print(f"   Error: Invalid JSON response")
                return False
        else:
            print(f"❌ {description}")
            print(f"   Status: {response.status_code}")
            print(f"   Error: {response.text[:200]}...")
            return False
    except Exception as e:
        print(f"❌ {description}")
        print(f"   Error: {str(e)}")
        return False

def main():
    print("🎯 TESTE FINAL - AUTENTICAÇÃO REAL ORDOCFLOW")
    print("=" * 50)
    print()
    
    # Lista de APIs para testar
    apis = [
        ("/api/v1/ordoc-flow/api/procedures/", "Procedures API"),
        ("/api/v1/ordoc-flow/api/tasks/", "Tasks API"),
        ("/api/v1/ordoc-flow/api/procedure-templates/", "Procedure Templates API"),
        ("/api/v1/ordoc-flow/api/group-requesters/", "Group Requesters API"),
        ("/api/v1/ordoc-flow/api/external-requesters/", "External Requesters API"),
        ("/api/v1/ordoc-flow/api/approval-workflows/", "Approval Workflows API"),
        ("/api/v1/ordoc-flow/api/notification-templates/", "Notification Templates API"),
        ("/api/v1/ordoc-flow/api/workflow-requests/", "Workflow Requests API"),
    ]
    
    # Testa todas as APIs
    successful_tests = 0
    total_tests = len(apis)
    
    for endpoint, description in apis:
        if test_api(endpoint, description):
            successful_tests += 1
        print()
    
    # Resultado final
    print("🏆 RESULTADO FINAL")
    print("=" * 30)
    print(f"✅ APIs funcionando: {successful_tests}/{total_tests}")
    print(f"📊 Taxa de sucesso: {(successful_tests/total_tests)*100:.1f}%")
    
    if successful_tests == total_tests:
        print("\n🎉 PARABÉNS! AUTENTICAÇÃO REAL 100% FUNCIONAL!")
        print("🚀 Todas as principais APIs do OrdocFlow estão respondendo corretamente")
        print("🔐 JWT Token funcionando perfeitamente")
        print("🏗️ Sistema pronto para desenvolvimento de frontend")
    else:
        print(f"\n⚠️  {total_tests - successful_tests} APIs com problemas")
        print("🔧 Algumas correções ainda são necessárias")
    
    print("\n" + "=" * 50)
    print("TESTE CONCLUÍDO")

if __name__ == "__main__":
    main()
