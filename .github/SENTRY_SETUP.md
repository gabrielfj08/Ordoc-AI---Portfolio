# Configuração do Sentry - OrdocAI

Guia completo para configurar error tracking e APM com Sentry.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [1. Criar Conta e Organização](#1-criar-conta-e-organização)
- [2. Configurar Projeto Backend](#2-configurar-projeto-backend)
- [3. Configurar Projeto Frontend](#3-configurar-projeto-frontend)
- [4. Configurar Secrets no GitHub](#4-configurar-secrets-no-github)
- [5. Configurar Variáveis de Ambiente Locais](#5-configurar-variáveis-de-ambiente-locais)
- [6. Testar Integração](#6-testar-integração)
- [7. Monitoramento e Alertas](#7-monitoramento-e-alertas)

## Visão Geral

O OrdocAI utiliza Sentry para:
- **Error Tracking**: Captura e rastreia erros em produção
- **Performance Monitoring (APM)**: Monitora performance de transações
- **Session Replay**: Reproduz sessões de usuários com erros (frontend)
- **Release Tracking**: Rastreia erros por versão do código

**Projetos necessários:**
1. `ordocai-backend` - Django + Celery + Redis
2. `ordocai-frontend` - Next.js 16 + React 19

## Pré-requisitos

- [ ] Acesso administrativo ao repositório GitHub
- [ ] Email corporativo para criar conta Sentry
- [ ] Permissões para criar secrets no GitHub Actions

## 1. Criar Conta e Organização

### 1.1 Criar conta Sentry

1. Acesse [sentry.io](https://sentry.io)
2. Clique em **"Start Free"** ou **"Get Started"**
3. Selecione plano:
   - **Developer (Gratuito)**: 5k erros/mês, 1 usuário, 10k replays/mês
   - **Team ($26/mês)**: 50k erros/mês, equipe ilimitada, 50k replays/mês
   - **Business**: Custom pricing para grandes volumes

**Recomendação**: Iniciar com plano Developer e migrar para Team quando necessário.

### 1.2 Criar organização

1. Após login, clique em **"Create Organization"**
2. Nome da organização: `Adsumtec` ou `OrdocAI`
3. Slug: `adsumtec` (será usado nas URLs)
4. Clique em **"Create Organization"**

### 1.3 Convidar equipe (opcional)

1. No menu lateral, clique em **Settings > Members**
2. Clique em **"Invite Member"**
3. Adicione emails dos desenvolvedores
4. Defina role:
   - **Admin**: Acesso total (DevOps, Tech Lead)
   - **Member**: Acesso aos projetos
   - **Billing**: Apenas billing (Financeiro)

## 2. Configurar Projeto Backend

### 2.1 Criar projeto

1. No dashboard do Sentry, clique em **"Create Project"**
2. Selecione plataforma: **Django**
3. Configure:
   - **Project name**: `ordocai-backend`
   - **Default alert**: Recomendado deixar ativo
   - **Team**: Selecione ou crie `Backend Team`
4. Clique em **"Create Project"**

### 2.2 Obter DSN

Após criar o projeto, você verá o DSN:

```
https://[key]@o[org-id].ingest.sentry.io/[project-id]
```

**Exemplo:**
```
https://examplePublicKey@o123456.ingest.sentry.io/7891011
```

**⚠️ IMPORTANTE**: Salve este DSN em local seguro (será usado nos secrets).

### 2.3 Configurar integrações

1. No projeto backend, vá em **Settings > Integrations**
2. Ative integrações recomendadas:
   - **GitHub**: Rastreamento de commits e releases
   - **Slack**: Notificações de erros críticos (opcional)
   - **PagerDuty**: Alertas on-call (opcional)

### 2.4 Configurar alerts

1. Vá em **Alerts > Create Alert**
2. Crie alertas recomendados:

**Alert 1: Erros Críticos**
- **Nome**: `Critical Errors - Backend`
- **Condição**: When `event.level equals fatal or error`
- **Filtro**: `event.environment equals production`
- **Ação**: Send email to `devops@adsumtec.com`
- **Frequência**: Immediately

**Alert 2: Alto Volume de Erros**
- **Nome**: `High Error Rate - Backend`
- **Condição**: When `number of events in an issue is more than 100 in 1 hour`
- **Filtro**: `event.environment equals production`
- **Ação**: Send Slack notification (se configurado)
- **Frequência**: At most once every 30 minutes per issue

**Alert 3: Performance Degradation**
- **Nome**: `Slow Transactions - Backend`
- **Condição**: When `avg(transaction.duration) is more than 3000ms for 5 minutes`
- **Filtro**: `event.environment equals production`
- **Ação**: Send email to `backend-team@adsumtec.com`
- **Frequência**: At most once every 1 hour

### 2.5 Configurar releases

1. Vá em **Settings > Integrations > GitHub**
2. Ative **"Automatically create releases"**
3. Configure:
   - **Repository**: `Adsumtec/ordoc-ai`
   - **Branch**: `main`
   - **Create release on**: Deploy (push to production)

## 3. Configurar Projeto Frontend

### 3.1 Criar projeto

1. Clique em **"Create Project"** novamente
2. Selecione plataforma: **Next.js**
3. Configure:
   - **Project name**: `ordocai-frontend`
   - **Default alert**: Recomendado deixar ativo
   - **Team**: Selecione ou crie `Frontend Team`
4. Clique em **"Create Project"**

### 3.2 Obter DSN

Salve o DSN do frontend (diferente do backend):

```
https://[frontend-key]@o[org-id].ingest.sentry.io/[frontend-project-id]
```

### 3.3 Configurar Session Replay

1. No projeto frontend, vá em **Settings > Session Replay**
2. Configure:
   - **Privacy**: `Mask all text` (já configurado no código)
   - **Block all media**: Enabled (já configurado no código)
   - **Sample rate**: 10% (configurado em `.env`)
   - **Error sample rate**: 100% (configurado em `.env`)

### 3.4 Configurar Performance Monitoring

1. Vá em **Performance**
2. Configure:
   - **Transaction sample rate**: 10% (configurado em `.env`)
   - **Spans**: Ative todos (API calls, Database, etc)

### 3.5 Configurar alerts

**Alert 1: JavaScript Errors**
- **Nome**: `JavaScript Errors - Frontend`
- **Condição**: When `event.level equals error`
- **Filtro**: `event.platform equals javascript AND event.environment equals production`
- **Ação**: Send email to `frontend-team@adsumtec.com`

**Alert 2: Slow Page Loads**
- **Nome**: `Slow Page Loads - Frontend`
- **Condição**: When `p75(measurements.lcp) is more than 2500ms for 10 minutes`
- **Filtro**: `event.environment equals production`
- **Ação**: Send email to `devops@adsumtec.com`

## 4. Configurar Secrets no GitHub

### 4.1 Criar secrets de produção

1. Vá em `https://github.com/Adsumtec/ordoc-ai/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Crie os seguintes secrets:

**Backend:**
```
Name: SENTRY_DSN_BACKEND
Value: https://[backend-key]@o[org-id].ingest.sentry.io/[backend-project-id]
```

**Frontend:**
```
Name: SENTRY_DSN_FRONTEND
Value: https://[frontend-key]@o[org-id].ingest.sentry.io/[frontend-project-id]
```

**Auth Token (para releases):**
```
Name: SENTRY_AUTH_TOKEN
Value: [Obtido em: Sentry > Settings > Developer Settings > Auth Tokens]
```

Para criar o Auth Token:
1. No Sentry, vá em **Settings > Account > API > Auth Tokens**
2. Clique em **"Create New Token"**
3. Scopes necessários:
   - `project:read`
   - `project:releases`
   - `org:read`
4. Salve o token gerado

### 4.2 Criar environments no GitHub

1. Vá em `https://github.com/Adsumtec/ordoc-ai/settings/environments`
2. Crie environments:

**Production:**
- Nome: `production`
- Protection rules:
  - ☑️ Required reviewers (2 reviewers)
  - ☑️ Wait timer: 0 minutes
- Secrets:
  - `SENTRY_DSN_BACKEND`
  - `SENTRY_DSN_FRONTEND`
  - `SENTRY_ENVIRONMENT=production`

**Staging:**
- Nome: `staging`
- Secrets:
  - `SENTRY_DSN_BACKEND` (mesmo DSN, diferencia pelo environment)
  - `SENTRY_DSN_FRONTEND`
  - `SENTRY_ENVIRONMENT=staging`

## 5. Configurar Variáveis de Ambiente Locais

### 5.1 Backend (.env)

Crie/edite `backend/.env`:

```bash
# Sentry Configuration
SENTRY_DSN=https://[backend-key]@o[org-id].ingest.sentry.io/[backend-project-id]
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0  # 100% em dev, 10% em prod
SENTRY_RELEASE=  # Deixe vazio, será preenchido automaticamente no CI
```

### 5.2 Frontend (.env.local)

Crie/edite `frontend-new/.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://[frontend-key]@o[org-id].ingest.sentry.io/[frontend-project-id]
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=1.0  # 100% em dev
NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE=0.1  # 10%
NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE=1.0  # 100%
NEXT_PUBLIC_SENTRY_RELEASE=  # Deixe vazio
```

### 5.3 Inicializar Sentry no código

O código já está configurado. Para ativar:

**Backend:** Em `backend/ordoc_ai/settings.py`, adicione:

```python
# Sentry Initialization
from backend.sentry_config import init_sentry

init_sentry()
```

**Frontend:** Em `frontend-new/app/layout.tsx`, adicione:

```typescript
import { initSentry } from '@/lib/sentry'

// Initialize Sentry (client-side only)
if (typeof window !== 'undefined') {
  initSentry()
}
```

## 6. Testar Integração

### 6.1 Testar backend

```bash
cd backend
poetry shell

# Teste 1: Verificar inicialização
python manage.py shell
>>> from backend.sentry_config import init_sentry
>>> init_sentry()
# Deve imprimir: ✅ Sentry initialized for environment: development

# Teste 2: Enviar erro de teste
>>> from sentry_sdk import capture_exception
>>> try:
...     1 / 0
... except Exception as e:
...     capture_exception(e)

# Teste 3: Enviar mensagem de teste
>>> from sentry_sdk import capture_message
>>> capture_message("Teste de integração Sentry - Backend", level="info")
```

Verifique no dashboard do Sentry se os eventos aparecem em ~1 minuto.

### 6.2 Testar frontend

1. Execute o dev server:
```bash
cd frontend-new
pnpm dev
```

2. Abra `http://localhost:3000`
3. Abra o console do navegador e execute:
```javascript
// Deve imprimir: ✅ Sentry initialized for environment: development

// Teste 1: Erro de teste
throw new Error("Teste de integração Sentry - Frontend")

// Teste 2: Mensagem de teste (em componente React)
import * as Sentry from '@sentry/nextjs'
Sentry.captureMessage("Teste de integração - Frontend", "info")
```

Verifique no dashboard do Sentry.

### 6.3 Testar performance (APM)

**Backend:**
```bash
# Faça requests à API
curl http://localhost:8000/api/documents/
curl http://localhost:8000/api/procedures/
```

Vá em **Performance** no Sentry e verifique as transações.

**Frontend:**
```bash
# Navegue por várias páginas
http://localhost:3000/
http://localhost:3000/dashboard
http://localhost:3000/documents
```

Vá em **Performance > Frontend** e verifique Web Vitals (LCP, FID, CLS).

## 7. Monitoramento e Alertas

### 7.1 Dashboard recomendado

Crie um dashboard custom:

1. No Sentry, vá em **Dashboards > Create Dashboard**
2. Nome: `OrdocAI - Production Overview`
3. Adicione widgets:

**Widget 1: Error Rate**
- Type: `Line Chart`
- Query: `event.type:error`
- Group by: `project`

**Widget 2: Top Errors**
- Type: `Table`
- Query: `event.type:error`
- Columns: `Issue`, `Events`, `Users`, `Last Seen`
- Order by: `Events (desc)`

**Widget 3: Transaction Duration (p95)**
- Type: `Line Chart`
- Query: `event.type:transaction`
- Y-axis: `p95(transaction.duration)`
- Group by: `transaction`

**Widget 4: Session Replay Count**
- Type: `Number`
- Query: `event.type:replay`

### 7.2 Configurar notificações

**Slack (recomendado):**
1. Vá em **Settings > Integrations > Slack**
2. Clique em **"Add to Slack"**
3. Autorize a integração
4. Configure canal padrão: `#ordocai-errors`
5. Configure alertas:
   - Erros críticos → `#ordocai-errors`
   - Performance issues → `#ordocai-performance`
   - Deployment notifications → `#ordocai-deployments`

**Email:**
1. Vá em **Settings > Notifications**
2. Configure:
   - **Workflow notifications**: Sempre
   - **Deploy notifications**: Sempre
   - **Issue alerts**: Immediately
   - **Weekly reports**: Enabled

### 7.3 Métricas recomendadas

Monitore semanalmente:

**Error Rate:**
- Target: < 0.1% das requests
- Alert: > 1% por 1 hora

**Performance (Backend):**
- p50 transaction duration: < 200ms
- p95 transaction duration: < 1000ms
- p99 transaction duration: < 3000ms

**Performance (Frontend):**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Session Replay:**
- Revisar 100% dos replays com erros
- Revisar 10% dos replays sem erros (sample aleatório)

## 📊 Resumo de Configuração

| Item | Backend | Frontend |
|------|---------|----------|
| **DSN** | `SENTRY_DSN` | `NEXT_PUBLIC_SENTRY_DSN` |
| **Environment** | `SENTRY_ENVIRONMENT` | `NEXT_PUBLIC_SENTRY_ENVIRONMENT` |
| **Traces Sample Rate** | `SENTRY_TRACES_SAMPLE_RATE` (10%) | `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` (10%) |
| **Error Sample Rate** | 100% (fixo no código) | 100% (fixo no código) |
| **Integrações** | Django, Celery, Redis | Browser Tracing, Session Replay |
| **PII Filtering** | ✅ Headers + POST data | ✅ Headers + Mask all text |

## 🔗 Links Úteis

- [Sentry Dashboard](https://sentry.io/organizations/adsumtec/)
- [Sentry Docs - Django](https://docs.sentry.io/platforms/python/guides/django/)
- [Sentry Docs - Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

## ❓ Troubleshooting

### Erro: "Sentry DSN not configured"

**Causa:** Variável de ambiente não definida.

**Solução:**
```bash
# Backend
echo "SENTRY_DSN=https://..." >> backend/.env

# Frontend
echo "NEXT_PUBLIC_SENTRY_DSN=https://..." >> frontend-new/.env.local
```

### Erro: "Rate limited"

**Causa:** Excedeu quota do plano gratuito (5k erros/mês).

**Solução:**
1. Upgrade para plano Team ($26/mês)
2. Ou ajustar sample rates para reduzir volume:
   ```bash
   SENTRY_TRACES_SAMPLE_RATE=0.05  # 5%
   ```

### Eventos não aparecem no Sentry

**Verificar:**
1. DSN está correto?
2. Ambiente está correto? (development/staging/production)
3. Firewall/proxy bloqueando sentry.io?
4. Verificar logs do console: deve imprimir "✅ Sentry initialized"

### Session Replay não funciona

**Causa:** Session Replay é apenas para frontend.

**Verificar:**
1. DSN frontend está configurado?
2. `NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE` > 0?
3. Navegador suporta Session Replay? (Chrome, Firefox, Edge)

---

**Configurado por:** DevOps Team
**Última atualização:** 2024-12-30
**Versão:** 1.0
