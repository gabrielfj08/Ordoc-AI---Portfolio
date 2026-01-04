# Testando Analytics + IA Integration

## ✅ O que foi implementado

### Frontend Conectado com Backend
- ✅ Aba **Visão Geral** - Usando dados reais de `analytics/overview` e `document_trends`
- ✅ Aba **Inteligência** - Usando alertas e padrões reais da IA
- ✅ Aba **Auditoria** - Usando logs reais de auditoria
- ✅ Aba **Relatórios** - Exportação funcionando com API real
- ✅ Loading states em todas as abas
- ✅ Error handling com console.error
- ✅ ProcessMetrics integrado com ordoc_flow

## 🚀 Como Testar

### 1. Iniciar Backend

```bash
cd backend

# Ativar ambiente Poetry
poetry shell

# Iniciar servidor Django
poetry run python manage.py runserver
```

O backend deve estar rodando em `http://localhost:8000`

### 2. Iniciar Frontend

```bash
cd frontend-new

# Instalar dependências (se necessário)
pnpm install

# Iniciar servidor dev
pnpm dev
```

O frontend estará em `http://localhost:3000`

### 3. Acessar Módulo de Análises

Navegue para: `http://localhost:3000/analyses`

### 4. Verificar Cada Aba

#### Aba "Visão Geral"
✅ **Métricas principais** devem mostrar dados reais:
- Total de Documentos (vindo do banco)
- Usuários Ativos (vindo do banco)
- Taxa de Aprovação
- Tempo Médio

✅ **Gestão de Processos** integrado com `ordoc_flow`

✅ **Gráfico de tendências** ainda usa dados mockados (SVG estático)

#### Aba "Inteligência"
✅ **Badges no topo** mostram contadores reais:
- `{X} alertas ativos`
- `{X} padrões aprendidos`

✅ **Alertas de Inteligência**:
- Se houver alertas: mostra lista real da IA
- Se não houver: mostra mensagem "Nenhum alerta ativo"

✅ **Padrões Aprendidos**:
- Se houver padrões: mostra com confidence real
- Se não houver: mostra mensagem "Nenhum padrão aprendido"

#### Aba "Auditoria"
✅ **Logs de auditoria**:
- Mostra logs reais do backend
- Timestamp formatado em pt-BR
- Tipos: success, warning, info, error

#### Aba "Relatórios"
✅ **Botão Exportar** funcional:
- Chama API real `/api/v1/reports/api/analytics/export/`
- Baixa arquivo CSV com dados reais

---

## 🧪 Testando com Dados Reais

### Criar Alertas de IA

Para popular alertas, você pode criar via Django shell:

```bash
cd backend
poetry run python manage.py shell
```

```python
from intelligence.models import ProactiveAlert
from django.contrib.auth import get_user_model
User = get_user_model()

# Criar alguns alertas de teste
ProactiveAlert.objects.create(
    document_id="test-doc-123",
    document_type="contrato",
    alert_type="suggestion",
    severity="high",
    title="Pico de demanda detectado",
    message="Esperado aumento de 35% em documentos nos próximos 7 dias",
    details={"forecast": 35, "confidence": 0.92}
)

ProactiveAlert.objects.create(
    document_id="test-doc-456",
    document_type="proposta",
    alert_type="warning",
    severity="medium",
    title="Gargalo identificado",
    message="Processo de aprovação 40% mais lento que a média",
    details={"slowdown": 40}
)
```

### Criar Padrões Aprendidos

```python
from intelligence.models import LearnedPattern

LearnedPattern.objects.create(
    pattern_type="Horário de pico",
    pattern_value="14h - 16h",
    confidence=0.95,
    occurrences=128,
    description="Período com maior volume de documentos processados"
)

LearnedPattern.objects.create(
    pattern_type="Dia mais ativo",
    pattern_value="Terça-feira",
    confidence=0.89,
    occurrences=45,
    description="Dia da semana com mais atividade"
)
```

### Verificar Dados no Backend

```bash
# Testar endpoint de overview
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/reports/api/analytics/overview/

# Testar endpoint de alertas
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/intelligence/alerts/

# Testar endpoint de padrões
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/intelligence/patterns/
```

---

## 🔍 Debugging

### Frontend - Abrir DevTools Console

1. Abra DevTools (F12)
2. Vá para aba Console
3. Procure por:
   - ❌ **Erros de API** - Mostram falhas de requisição
   - ✅ **Logs de sucesso** - Dados carregados

### Backend - Verificar Logs

```bash
# No terminal onde o Django está rodando
# Veja as requisições sendo feitas
```

### Verificar Autenticação

Se as APIs retornarem **401 Unauthorized**:

1. Faça login em `http://localhost:3000/login`
2. O token JWT é salvo automaticamente
3. Tente acessar `/analyses` novamente

---

## 📊 Endpoints Utilizados

### Analytics API
- `GET /api/v1/reports/api/analytics/overview/` - Métricas gerais
- `GET /api/v1/reports/api/analytics/document_trends/` - Tendências
- `GET /api/v1/reports/api/analytics/process_metrics/` - Métricas de processos
- `GET /api/v1/reports/api/analytics/predictions/` - Predições
- `GET /api/v1/reports/api/analytics/activity_heatmap/` - Heatmap
- `GET /api/v1/reports/api/analytics/audit_logs/` - Logs
- `GET /api/v1/reports/api/analytics/export/` - Exportação

### Intelligence API
- `GET /api/v1/intelligence/alerts/` - Alertas da IA
- `GET /api/v1/intelligence/patterns/` - Padrões aprendidos
- `GET /api/v1/intelligence/analyses/` - Análises realizadas
- `POST /api/v1/intelligence/analyze/` - Analisar documento
- `POST /api/v1/intelligence/extract/` - Extração rápida

---

## 🐛 Problemas Comuns

### 1. "Failed to fetch" ou CORS error
**Solução**: Verificar se o backend está rodando em `http://localhost:8000`

### 2. Loading infinito
**Solução**: 
- Verificar console do navegador para erros
- Verificar se o endpoint retorna dados válidos
- Verificar autenticação (token JWT)

### 3. Dados não aparecem
**Solução**:
- Verificar se há dados no banco (criar via Django shell)
- Verificar resposta da API no Network tab do DevTools

### 4. Exportação não funciona
**Solução**:
- Verificar se o endpoint `/export/` está retornando `Content-Type: text/csv`
- Verificar logs do backend para erros

---

## ✨ Próximas Melhorias

### Curto Prazo
- [ ] Adicionar toast notifications para sucesso/erro
- [ ] Implementar refresh automático (polling ou WebSocket)
- [ ] Adicionar filtros de data nas abas
- [ ] Adicionar paginação nos logs de auditoria

### Médio Prazo
- [ ] Gráficos interativos com dados reais (substituir SVG)
- [ ] Drill-down nos dados (click para detalhes)
- [ ] Comparação entre períodos
- [ ] Exportação em PDF e Excel

### Longo Prazo
- [ ] WebSocket para updates em tempo real
- [ ] Dashboard customizável
- [ ] Alertas push no navegador
- [ ] Machine Learning para predições avançadas

---

## 📝 Checklist de Teste

- [ ] Backend rodando sem erros
- [ ] Frontend carregando sem erros de console
- [ ] Login funcionando
- [ ] Aba "Visão Geral" carregando métricas reais
- [ ] Aba "Inteligência" carregando alertas (ou mostrando mensagem vazia)
- [ ] Aba "Inteligência" carregando padrões (ou mostrando mensagem vazia)
- [ ] Aba "Auditoria" carregando logs
- [ ] Botão "Exportar" baixando CSV
- [ ] Loading states aparecendo durante fetch
- [ ] Mudança de período (7d, 30d, 90d, 1y) recarregando dados

---

## 🎉 Sucesso!

Se todos os itens acima estiverem funcionando, a integração **Analytics + IA** está completa e operacional!

O módulo de Análises agora:
- ✅ Usa dados reais do backend
- ✅ Integra com sistema de IA
- ✅ Exibe alertas proativos
- ✅ Mostra padrões aprendidos
- ✅ Registra auditoria
- ✅ Permite exportação

**Próximo passo**: WebSocket para real-time updates (B1)
