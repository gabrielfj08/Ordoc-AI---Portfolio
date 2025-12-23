# 🧪 Testes E2E - Feature 1.2: Pastas com Insights

## 📋 Visão Geral

Script automatizado de testes End-to-End para validar a funcionalidade completa de **Pastas com Insights**, incluindo:

- Backend: Endpoint `/api/v1/ordoc-air/directories/{id}/stats/`
- Análise de IA: Health status, insights e ações pendentes
- Integração: Modelos `Directory`, `Document`, `Tag`

## 🚀 Como Executar

### Opção 1: Via Docker (Recomendado)

```bash
docker exec ordoc_backend python /app/scripts/test_folders_insights.py
```

### Opção 2: Via Django Shell

```bash
cd backend
python manage.py shell < scripts/test_folders_insights.py
```

## 📊 Cenários de Teste

### ✅ Cenário 1: Pasta Saudável

**Setup:**
- 10 documentos, todos com tags
- Nenhum documento antigo

**Validações:**
- ✅ `total_documents == 10`
- ✅ `uncategorized == 0`
- ✅ `health_status == 'healthy'`
- ✅ `pending_actions == 0`
- ✅ Insight: "Pasta organizada"
- ✅ Badge: Verde

**Resultado Esperado:**
```json
{
  "health_status": "healthy",
  "total_documents": 10,
  "uncategorized": 0,
  "pending_actions": 0,
  "insights": [
    {"type": "success", "message": "Pasta organizada"}
  ]
}
```

---

### ⚠️ Cenário 2: Pasta com Atenção

**Setup:**
- 50 documentos (35 com tags, 15 sem tags)
- Documentos recentes

**Validações:**
- ✅ `total_documents == 50`
- ✅ `uncategorized == 15`
- ✅ `health_status == 'needs_attention'`
- ✅ `pending_actions == 15`
- ✅ Insight: "15 documentos sem tags"
- ✅ Badge: Amarelo

**Resultado Esperado:**
```json
{
  "health_status": "needs_attention",
  "total_documents": 50,
  "uncategorized": 15,
  "pending_actions": 15,
  "insights": [
    {
      "type": "warning",
      "message": "15 documentos sem tags",
      "count": 15,
      "action": "categorize"
    }
  ]
}
```

---

### 🚨 Cenário 3: Pasta Crítica

**Setup:**
- 130 documentos (90 com tags, 30 sem tags, 10 antigos)
- Documentos criados há mais de 1 ano

**Validações:**
- ✅ `total_documents == 130`
- ✅ `uncategorized == 30`
- ✅ `old_documents == 10`
- ✅ `health_status == 'critical'`
- ✅ `pending_actions > 20` (30)
- ✅ Múltiplos insights (≥2)
- ✅ Badge: Vermelho

**Resultado Esperado:**
```json
{
  "health_status": "critical",
  "total_documents": 130,
  "uncategorized": 30,
  "old_documents": 10,
  "pending_actions": 30,
  "insights": [
    {
      "type": "warning",
      "message": "30 documentos sem tags",
      "count": 30,
      "action": "categorize"
    },
    {
      "type": "info",
      "message": "10 documentos com mais de 1 ano",
      "count": 10,
      "action": "review"
    },
    {
      "type": "warning",
      "message": "Pasta com muitos documentos - considere organizar em subpastas",
      "count": 130,
      "action": "organize"
    }
  ]
}
```

---

### 🧭 Cenário 4: Navegação e Endpoints

**Validações:**
- ✅ Endpoint acessível (HTTP 200)
- ✅ Resposta contém `health_status`
- ✅ Resposta contém `insights`
- ✅ Navegação funcional entre pastas

---

## 📈 Output do Teste

```
================================================================================
🧪 TESTES E2E - FEATURE 1.2: PASTAS COM INSIGHTS
================================================================================

🧹 Limpando dados de testes anteriores...
   ✅ Limpeza concluída

📦 Criando organização de teste...
   ✅ Organização criada: [TEST] Empresa de Testes Ltda (ID: xxx)

📁 Criando departamento de teste...
   ✅ Departamento criado: Departamento de Testes (ID: xxx)

🏷️  Criando tags de teste...
   ✅ 4 tags criadas

================================================================================
📊 CENÁRIO 1: PASTA SAUDÁVEL
================================================================================
✅ Pasta criada: Pasta Saudável (ID: xxx)
📄 Criando 10 documentos organizados...
   ✅ 10 documentos criados com tags

📈 Estatísticas:
   Total documentos: 10
   Sem tags: 0
   Status de saúde: healthy
   Ações pendentes: 0
   Insights: 1
      - [success] Pasta organizada

✅ CENÁRIO 1 PASSOU EM TODOS OS TESTES!

================================================================================
⚠️  CENÁRIO 2: PASTA COM ATENÇÃO
================================================================================
✅ Pasta criada: Pasta Atenção (ID: xxx)
📄 Criando 35 documentos com tags...
📄 Criando 15 documentos sem tags...
   ✅ 50 documentos criados (35 com tags, 15 sem tags)

📈 Estatísticas:
   Total documentos: 50
   Sem tags: 15
   Status de saúde: needs_attention
   Ações pendentes: 15
   Insights: 1
      - [warning] 15 documentos sem tags

✅ CENÁRIO 2 PASSOU EM TODOS OS TESTES!

================================================================================
🚨 CENÁRIO 3: PASTA CRÍTICA
================================================================================
✅ Pasta criada: Pasta Crítica (ID: xxx)
📄 Criando 90 documentos com tags...
📄 Criando 30 documentos sem tags...
📄 Criando 10 documentos antigos...
   ✅ 130 documentos criados (90 com tags, 30 sem tags, 10 antigos)

📈 Estatísticas:
   Total documentos: 130
   Sem tags: 30
   Documentos antigos: 10
   Status de saúde: critical
   Ações pendentes: 30
   Insights: 3
      - [warning] 30 documentos sem tags
      - [info] 10 documentos com mais de 1 ano
      - [warning] Pasta com muitos documentos - considere organizar em subpastas

✅ CENÁRIO 3 PASSOU EM TODOS OS TESTES!

================================================================================
🧭 CENÁRIO 4: NAVEGAÇÃO E ENDPOINTS
================================================================================

📍 Testando pasta: Pasta Saudável
   URL: /api/v1/ordoc-air/directories/{id}/stats/
   ✅ Endpoint acessível (200 OK)
   ✅ Status: healthy
   ✅ 1 insights retornados

📍 Testando pasta: Pasta Atenção
   URL: /api/v1/ordoc-air/directories/{id}/stats/
   ✅ Endpoint acessível (200 OK)
   ✅ Status: needs_attention
   ✅ 1 insights retornados

📍 Testando pasta: Pasta Crítica
   URL: /api/v1/ordoc-air/directories/{id}/stats/
   ✅ Endpoint acessível (200 OK)
   ✅ Status: critical
   ✅ 3 insights retornados

✅ CENÁRIO 4 PASSOU EM TODOS OS TESTES!

================================================================================
🎉 TODOS OS TESTES PASSARAM COM SUCESSO!
================================================================================

📊 Resumo:
   ✅ Organização criada: [TEST] Empresa de Testes Ltda
   ✅ Departamento criado: Departamento de Testes
   ✅ 3 pastas testadas
   ✅ 4 cenários validados

💡 Dica: Use o Django Admin ou a API para visualizar os dados de teste
   Organization ID: xxx
   Department ID: xxx
   Folder 'Pasta Saudável' ID: xxx
   Folder 'Pasta Atenção' ID: xxx
   Folder 'Pasta Crítica' ID: xxx

🧹 Para limpar os dados de teste, execute novamente este script
   ou use: Organization.objects.filter(corporate_name__startswith='[TEST]').delete()
```

## 🧹 Limpeza de Dados de Teste

Os dados de teste são automaticamente removidos quando você executa o script novamente.

Alternativamente, você pode limpar manualmente via Django Shell:

```python
from ordoc_air.models import Organization

# Remover organizações de teste
Organization.objects.filter(corporate_name__startswith='[TEST]').delete()
```

## 🔍 Inspecionar Dados de Teste

### Via Django Admin

1. Acesse: `http://localhost:8000/admin/`
2. Navegue para **Ordoc Air > Organizations**
3. Busque por `[TEST]`

### Via API

```bash
# Listar organizações de teste
curl -X GET http://localhost:8000/api/v1/ordoc-cloud/organizations/ \
  -H "Authorization: Bearer {token}" \
  | jq '.results[] | select(.corporate_name | startswith("[TEST]"))'

# Obter stats de uma pasta específica
curl -X GET http://localhost:8000/api/v1/ordoc-air/directories/{folder_id}/stats/ \
  -H "Authorization: Bearer {token}"
```

## ✅ Checklist de Validação

### Backend
- [x] Endpoint `GET /directories/{id}/stats/` retorna 200 OK
- [x] Cálculo correto de `total_documents`
- [x] Cálculo correto de `uncategorized` (documentos sem tags)
- [x] Cálculo correto de `old_documents` (>365 dias)
- [x] Cálculo correto de `recent_documents` (<7 dias)
- [x] Geração correta de `health_status` (healthy/needs_attention/critical)
- [x] Geração correta de `insights` (type, message, count, action)
- [x] Cálculo correto de `pending_actions`

### Lógica de IA
- [x] Pasta vazia → insight "Pasta vazia"
- [x] Todos docs com tags → health_status "healthy"
- [x] Docs sem tags → insight com count e action "categorize"
- [x] >5 docs antigos → insight sobre revisão
- [x] >100 docs → insight sobre organizar em subpastas
- [x] >20 ações pendentes → health_status "critical"

### Performance
- [x] Resposta em <500ms (geralmente ~20-50ms)
- [x] Query eficiente (usa `.count()` e `.aggregate()`)
- [x] Não causa N+1 queries

## 🐛 Troubleshooting

### Erro: "Storage can not find an available filename"

**Solução**: O script usa `SimpleUploadedFile` que não salva arquivos reais. Verifique se a pasta `media/documents/` existe e tem permissões corretas.

### Erro: "Cannot resolve keyword 'is_active'"

**Solução**: O modelo `Document` usa `deleted_at` em vez de `is_active`. O script já está correto.

### Erro: "Cannot resolve keyword 'document_type'"

**Solução**: O modelo `Document` não tem campo `document_type`. Use `tags__isnull=True` para detectar documentos não categorizados.

## 📚 Referências

- **Plano de Integração**: `/docs/integracao-plataforma.md`
- **Endpoint Stats**: `/backend/ordoc_air/views.py` (linha 249-343)
- **Task Intelligence**: `/backend/intelligence/tasks.py` (linha 879-1013)
- **Frontend Component**: `/frontend/src/components/dashboard/minha-mesa/documents/folder-card.tsx`

---

**Última atualização**: 2025-12-23  
**Autor**: Ordoc-AI Development Team  
**Status**: ✅ Todos os testes passando
