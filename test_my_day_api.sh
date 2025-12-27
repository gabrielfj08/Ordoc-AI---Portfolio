#!/bin/bash

# Script para testar os endpoints do módulo "Meu Dia"
# Este script testa cada endpoint usado pelo frontend

BASE_URL="http://localhost:8000"
TOKEN=""

echo "=== Teste de Endpoints do Módulo 'Meu Dia' ==="
echo ""

# 1. Testar endpoint de autenticação
echo "1. Testando /api/auth/me/"
curl -s -o /dev/null -w "Status: %{http_code}\n" ${BASE_URL}/api/auth/me/
echo ""

# 2. Testar dashboard overview
echo "2. Testando /api/v1/ordoc-flow/api/dashboard/overview/"
curl -s -o /dev/null -w "Status: %{http_code}\n" ${BASE_URL}/api/v1/ordoc-flow/api/dashboard/overview/
echo ""

# 3. Testar documentos recentes
echo "3. Testando /api/v1/ordoc-air/api/documents/"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${BASE_URL}/api/v1/ordoc-air/api/documents/?ordering=-created_at&page_size=5"
echo ""

# 4. Testar workflows ativos
echo "4. Testando /api/v1/ordoc-flow/api/procedures/"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${BASE_URL}/api/v1/ordoc-flow/api/procedures/?status=running,started&ordering=-created_at&page_size=3"
echo ""

# 5. Testar requisições de assinatura
echo "5. Testando /api/v1/ordoc-sign/api/requests/"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${BASE_URL}/api/v1/ordoc-sign/api/requests/?status=pending,waiting&page_size=1"
echo ""

# 6. Testar tarefas
echo "6. Testando /api/v1/ordoc-flow/api/tasks/"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${BASE_URL}/api/v1/ordoc-flow/api/tasks/?status=running,started&page_size=1"
echo ""

# 7. Testar alertas de IA
echo "7. Testando /api/v1/intelligence/alerts/?is_read=false"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${BASE_URL}/api/v1/intelligence/alerts/?is_read=false"
echo ""

# 8. Testar mark_as_read (requer autenticação)
echo "8. Testando mark_as_read (requer ID e autenticação)"
echo "Status: Requer autenticação e ID de alerta"
echo ""

# 9. Testar mark_all_as_read (requer autenticação)
echo "9. Testando mark_all_as_read (requer autenticação)"
echo "Status: Requer autenticação"
echo ""

echo "=== Teste concluído ==="
echo ""
echo "Nota: Todos os endpoints que retornam 401 requerem autenticação"
echo "Para testar com autenticação, adicione o token no cabeçalho:"
echo "  curl -H 'Authorization: Bearer <token>' ..."
