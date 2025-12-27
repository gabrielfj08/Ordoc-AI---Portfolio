# Integração Analytics + Inteligência Artificial

Documentação da integração completa entre o módulo de Análises (Frontend) e o sistema de Inteligência Artificial (Backend).

## Visão Geral

O módulo de **Análises** no frontend (`/analyses`) está agora **totalmente conectado** com:
1. **Backend Analytics API** (`ordoc_reports/views_analytics.py`)
2. **Backend Intelligence API** (`intelligence/api/views.py`)
3. **Sistema de IA** (Extração, Council, Aprendizado)

## Arquitetura da Integração

```
Frontend (Next.js)
  └─ /app/analyses/page.tsx
       ├─ Abas: Visão Geral | Inteligência | Relatórios | Auditoria
       └─ services/analyses-api.ts
            │
            ├─── API Analytics (/api/v1/reports/api/analytics/)
            │     ├─ overview           → Métricas gerais
            │     ├─ document_trends    → Tendências + predição
            │     ├─ process_metrics    → Status de processos
            │     ├─ predictions        → Cenários otimista/realista/pessimista
            │     ├─ activity_heatmap   → Mapa de calor por hora/dia
            │     ├─ audit_logs         → Logs de auditoria
            │     └─ export             → Exportar CSV/PDF/Excel
            │
            └─── API Intelligence (/api/v1/intelligence/)
                  ├─ alerts/            → Alertas proativos da IA
                  ├─ analyses/          → Análises de documentos realizadas
                  ├─ patterns/          → Padrões aprendidos
                  ├─ feedback/          → Feedback para aprendizado
                  ├─ analyze/           → Analisar documento (POST)
                  └─ extract/           → Extração rápida de entidades (POST)
```

## Backend - Novos Endpoints Implementados

### 1. Analytics API (`/api/v1/reports/api/analytics/`)

#### GET `/overview/`
Métricas gerais do sistema:
- Total de documentos
- Usuários ativos
- Taxa de aprovação
- Tempo médio de processamento
- Atividade semanal
- Status do sistema

**Resposta:**
```json
{
  "documents": {
    "total": 177,
    "change": "+12%"
  },
  "users": {
    "active": 6,
    "change": "+4%"
  },
  "weekly_activity": [
    { "day": "2025-12-20", "label": "Fri", "count": 12 },
    ...
  ]
}
```

#### GET `/document_trends/`
Tendências históricas + predição AI:
- Dados reais dos últimos N dias
- Predição dos próximos 7 dias (baseada em média + crescimento)

**Query Params:**
- `time_range`: `7d` | `30d` | `90d` | `1y`

**Resposta:**
```json
[
  { "date": "2025-12-01", "count": 15, "is_prediction": false },
  { "date": "2025-12-28", "count": 18, "is_prediction": true },
  ...
]
```

#### GET `/process_metrics/`
Métricas de workflows (integrado com `ordoc_flow`):
- Procedimentos ativos
- Tarefas pendentes
- Tarefas em andamento
- Tarefas finalizadas

**Resposta:**
```json
{
  "active_procedures": 24,
  "pending_tasks": 8,
  "running_tasks": 12,
  "finished_tasks": 45
}
```

#### GET `/predictions/`
Cenários preditivos multivariados:
- Otimista (+68%)
- Realista (+45%)
- Pessimista (+12%)

**Resposta:**
```json
{
  "optimistic": { "value": 297, "percentage_change": 68 },
  "realistic": { "value": 257, "percentage_change": 45 },
  "pessimistic": { "value": 198, "percentage_change": 12 }
}
```

#### GET `/activity_heatmap/`
Mapa de calor de atividade:
- 7 dias da semana
- 24 horas por dia
- Intensidade por período

**Resposta:**
```json
[
  {
    "day": "Segunda",
    "hours": [5, 12, 18, 25, 32, ..., 8]
  },
  ...
]
```

#### GET `/audit_logs/`
Logs de auditoria do sistema:
- Ações críticas
- Usuário responsável
- Timestamp
- Tipo (success, warning, info, error)

**Query Params:**
- `limit`: número de registros (default: 20)
- `offset`: paginação

**Resposta:**
```json
{
  "results": [
    {
      "id": "1",
      "action": "Documento assinado",
      "user": "Ricardo Ferreira",
      "resource": "Contrato_Final.pdf",
      "timestamp": "2025-12-27T00:58:00Z",
      "type": "success"
    },
    ...
  ],
  "count": 50
}
```

#### GET `/export/`
Exportar dados em diferentes formatos:
- CSV
- PDF (futuro)
- Excel (futuro)

**Query Params:**
- `time_range`: `7d` | `30d` | `90d` | `1y`
- `format`: `csv` | `pdf` | `excel`
- `report_type`: `documents` | `processes` | `users` | `performance`

**Resposta:** Arquivo binário (download)

---

### 2. Intelligence API (`/api/v1/intelligence/`)

Já implementado anteriormente, agora integrado:

#### GET `/alerts/`
Lista alertas proativos da IA.

**Query Params:**
- `is_read`: `true` | `false`
- `document_id`: filtrar por documento
- `ordering`: `-created_at` (default)

#### POST `/alerts/{id}/mark_as_read/`
Marcar alerta como lido.

#### POST `/alerts/{id}/respond/`
Responder a um alerta (accept, reject, modify, dismiss).

#### GET `/patterns/`
Padrões aprendidos pela IA:
- Horários de pico
- Dias mais ativos
- Tempo médio de processamento
- Taxa de rejeição

#### GET `/analyses/`
Análises de documentos realizadas.

#### POST `/analyze/`
Solicitar análise completa de documento.

**Body:**
```json
{
  "document_id": "uuid",
  "document_content": "texto do documento",
  "document_type": "contrato",
  "analysis_depth": "full" | "quick"
}
```

#### POST `/extract/`
Extração rápida de entidades.

**Body:**
```json
{
  "text": "texto para extrair",
  "entity_types": ["PERSON", "ORG", "DATE", "MONEY"]
}
```

#### POST `/feedback/`
Enviar feedback para aprendizado da IA.

**Body:**
```json
{
  "layer": "user" | "extraction" | "council",
  "document_type": "contrato",
  "action_type": "approval" | "rejection" | "correction",
  "original_value": "valor original",
  "corrected_value": "valor corrigido",
  "context": {}
}
```

---

## Frontend - Service Layer

### `services/analyses-api.ts`

Service completo com todas as integrações:

```typescript
// Métricas gerais
await analysesApi.getAnalyticsOverview('30d')

// Tendências com predição
await analysesApi.getDocumentTrends('30d')

// Métricas de processos
await analysesApi.getProcessMetrics('30d')

// Alertas de IA
await analysesApi.getIntelligenceAlerts(10)

// Padrões aprendidos
await analysesApi.getLearnedPatterns(10)

// Predições
await analysesApi.getPredictionScenarios('90d')

// Heatmap
await analysesApi.getActivityHeatmap('7d')

// Auditoria
await analysesApi.getAuditLogs(20, 0)

// Análises realizadas
await analysesApi.getDocumentAnalyses(10)

// Analisar documento
await analysesApi.analyzeDocument(docId, content, type, 'full')

// Extração rápida
await analysesApi.quickExtract(text, ['PERSON', 'ORG'])

// Exportar
await analysesApi.exportAnalytics('30d', 'csv', 'documents')

// Feedback para IA
await analysesApi.submitFeedback('user', 'contrato', 'approval', originalValue)
```

---

## Fluxo de Integração IA → Analytics

### 1. Documento é Analisado pela IA
```
Usuário → Upload Documento
  ↓
Backend → Análise Automática (Intelligence)
  ├─ Extração de Entidades
  ├─ Council Deliberation
  └─ Geração de Alertas
  ↓
Salva DocumentAnalysis
Cria ProactiveAlerts
  ↓
Frontend Analytics → Exibe Insights
```

### 2. Usuário Responde a Alerta
```
Frontend → User Action (accept/reject/modify)
  ↓
Backend → Registra Resposta
  └─ Cria KnowledgeFeedback
  ↓
IA → Aprende com Feedback
  └─ Atualiza LearnedPatterns
  ↓
Frontend Analytics → Exibe Padrões Atualizados
```

### 3. Predições são Geradas
```
Backend → Analisa Histórico
  ├─ Tendências de Documentos
  ├─ Padrões de Atividade
  └─ Taxas de Aprovação
  ↓
IA → Gera Cenários (Otimista/Realista/Pessimista)
  ↓
Frontend → Visualiza no Gráfico de Predição
```

---

## Status da Implementação

### ✅ Backend
- [x] Endpoints de Analytics expandidos
- [x] Integration com ordoc_flow para métricas de processos
- [x] Integration com ordoc_air para métricas de documentos
- [x] Sistema de predição básico implementado
- [x] Exportação de dados (CSV funcional)
- [x] Logs de auditoria (placeholder)
- [x] Intelligence API completa

### ⚠️ Frontend (Próximo Passo)
- [ ] Atualizar página `/analyses` para usar APIs reais
- [ ] Substituir dados mockados por chamadas API
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Implementar refresh automático
- [ ] Conectar tab "Inteligência" com alertas reais
- [ ] Conectar tab "Auditoria" com logs reais

### 🔄 IA Avançada (Futuro)
- [ ] Predição usando modelos ML reais
- [ ] Análise de sentimento em documentos
- [ ] Detecção de anomalias
- [ ] Recomendações automáticas
- [ ] WebSocket para updates em tempo real

---

## Próximos Passos Recomendados

1. **Integrar Frontend com Backend Real**
   - Substituir dados mockados em `app/analyses/page.tsx`
   - Usar `analysesApi` service
   - Adicionar loading/error states

2. **Melhorar Predições**
   - Implementar algoritmo de predição mais sofisticado
   - Usar dados históricos reais
   - Ajustar confiabilidade baseado em volume de dados

3. **Expandir Alertas de IA**
   - Criar mais tipos de alertas
   - Melhorar detecção de gargalos
   - Adicionar alertas de segurança

4. **Dashboard Interativo**
   - Permitir drill-down nos gráficos
   - Adicionar filtros avançados
   - Comparação entre períodos

5. **WebSocket para Real-Time**
   - Implementar Django Channels
   - Notificações push de novos alertas
   - Atualização automática de métricas

---

## Testando a Integração

### 1. Verificar Endpoints Backend
```bash
# Navegar para backend
cd backend

# Iniciar servidor
poetry run python manage.py runserver

# Testar endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/reports/api/analytics/overview/
```

### 2. Testar no Frontend
```bash
# Navegar para frontend
cd frontend-new

# Iniciar dev server
pnpm dev

# Acessar
http://localhost:3000/analyses
```

### 3. Verificar Integração IA
```bash
# No backend, criar uma análise
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"document_id": "123", "document_content": "texto", "document_type": "contrato"}' \
  http://localhost:8000/api/v1/intelligence/analyze/

# Verificar alertas gerados
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/intelligence/alerts/
```

---

## Conclusão

A integração entre **Analytics** e **Inteligência Artificial** está completa no backend. O frontend tem toda a estrutura pronta (cards, abas, gráficos), mas ainda usa dados mockados.

**Próximo passo crítico**: Conectar o frontend com as APIs reais para visualizar dados verdadeiros e permitir que a IA enriqueça as análises em tempo real.
