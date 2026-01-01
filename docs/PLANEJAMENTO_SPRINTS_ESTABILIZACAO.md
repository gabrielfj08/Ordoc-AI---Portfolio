# 🚀 PLANEJAMENTO DE SPRINTS - ESTABILIZAÇÃO E OTIMIZAÇÃO
## Plataforma OrdocAI

**Data de Início:** 30 de Dezembro de 2025
**Objetivo:** Corrigir gaps críticos e preparar plataforma para produção enterprise

---

## 📋 VISÃO GERAL

### Gaps Críticos Identificados

| # | Gap | Severidade | Estimativa | Prioridade |
|---|-----|------------|------------|-----------|
| 1 | Error Boundaries | 🔴 Crítico | 2 dias | P0 |
| 2 | Logging Estruturado | 🔴 Crítico | 2-3 dias | P0 |
| 3 | Rate Limiting | 🔴 Crítico | 3 dias | P0 |
| 4 | LoadingScreen Legado | 🔴 Crítico | 1 semana | P0 |
| 5 | Testes Unitários | 🔴 Crítico | 2-3 semanas | P0 |

**Total Estimado:** 4-5 semanas para todos os gaps críticos

---

## 🎯 SPRINT 1: FUNDAÇÕES (Semana 1 - 5 dias úteis)

**Objetivo:** Implementar bases de estabilidade e observabilidade

### 📅 Dia 1-2: Error Boundaries + Logging Frontend

#### **Task 1.1: Error Boundaries (Frontend)**
**Responsável:** Dev Frontend
**Estimativa:** 8-12 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Criar `ErrorBoundary` component global
  - Arquivo: `frontend-new/components/error-boundary.tsx`
  - Features: Fallback UI, log de erro, botão de reload
  - Integração com logging

- [ ] Criar `PageErrorBoundary` para páginas específicas
  - Arquivo: `frontend-new/components/page-error-boundary.tsx`
  - Fallback customizado por módulo

- [ ] Integrar no `RootLayout`
  - Arquivo: `frontend-new/app/layout.tsx`
  - Wrapping de toda aplicação

- [ ] Adicionar Error Boundaries em rotas críticas
  - `/app/my-day/page.tsx`
  - `/app/documents/page.tsx`
  - `/app/processes/page.tsx`
  - `/app/signatures/page.tsx`

**Critérios de Aceite:**
- ✅ Crashes não derrubam aplicação inteira
- ✅ Usuário vê mensagem amigável
- ✅ Erros são logados para análise
- ✅ Botão de recovery funciona

---

#### **Task 1.2: Logging Estruturado Frontend**
**Responsável:** Dev Frontend
**Estimativa:** 6-8 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Instalar dependência
  ```bash
  cd frontend-new
  pnpm add pino pino-pretty
  ```

- [ ] Criar serviço de logging
  - Arquivo: `frontend-new/utils/logger.ts`
  - Níveis: error, warn, info, debug
  - Contexto: userId, sessionId, timestamp
  - Integração com Error Boundaries

- [ ] Configurar transports
  - Desenvolvimento: console.log com pino-pretty
  - Produção: envio para backend ou serviço externo

- [ ] Integrar em `api-client.ts`
  - Log de todas as requests/responses
  - Log de erros 4xx/5xx

**Critérios de Aceite:**
- ✅ Logs estruturados em JSON
- ✅ Contexto completo (user, sessão, timestamp)
- ✅ Fácil filtrar/buscar logs
- ✅ Erros de API logados automaticamente

---

### 📅 Dia 3: Logging Backend

#### **Task 1.3: Logging Estruturado Backend**
**Responsável:** Dev Backend
**Estimativa:** 6-8 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Configurar Django logging estruturado
  - Arquivo: `backend/ordoc_ai/settings.py`
  - Usar `python-json-logger`
  - Níveis por módulo

- [ ] Criar middleware de logging
  - Arquivo: `backend/ordoc_ai/middleware/logging_middleware.py`
  - Log de todas requests/responses
  - Request ID único
  - Tempo de execução

- [ ] Integrar em ViewSets críticos
  - Adicionar logging em exceções
  - Log de operações críticas (delete, update)

- [ ] Configurar rotação de logs
  - TimedRotatingFileHandler
  - Retenção: 30 dias
  - Compressão automática

**Critérios de Aceite:**
- ✅ Logs em JSON estruturado
- ✅ Request ID traceable
- ✅ Exceções logadas com stack trace
- ✅ Rotação automática configurada

---

### 📅 Dia 4-5: Rate Limiting

#### **Task 1.4: Ativar Rate Limiting**
**Responsável:** Dev Backend
**Estimativa:** 12-16 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Descomentar middleware de rate limiting
  - Arquivo: `backend/ordoc_ai/settings.py`
  - Middleware: `RateLimitMiddleware`

- [ ] Configurar limites por endpoint
  ```python
  RATE_LIMIT_CONFIG = {
      '/api/v1/ordoc-air/documents/': '100/hour',
      '/api/v1/ordoc-flow/procedures/': '200/hour',
      '/api/auth/login/': '5/minute',  # Proteção brute force
      '/api/auth/refresh/': '10/minute',
  }
  ```

- [ ] Implementar rate limiting no Redis
  - Token bucket algorithm
  - Janela deslizante de 60s
  - Key: `rate_limit:{org_id}:{user_id}:{endpoint}`

- [ ] Adicionar headers de rate limit
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 87
  X-RateLimit-Reset: 1704029400
  ```

- [ ] Criar endpoint de status
  - `/api/rate-limit/status/` - Consultar limites atuais

- [ ] Documentar no Swagger
  - Adicionar schema de erro 429
  - Documentar headers

**Critérios de Aceite:**
- ✅ Endpoints críticos protegidos
- ✅ Status 429 retornado quando excede
- ✅ Headers informativos presentes
- ✅ Limites configuráveis por tenant
- ✅ Documentação atualizada

---

## 🎯 SPRINT 2: UX E PERFORMANCE (Semana 2 - 5 dias úteis)

**Objetivo:** Melhorar experiência do usuário e eliminar código legado

### 📅 Dia 1-5: Refatoração LoadingScreen → Skeleton UI

#### **Task 2.1: Criar Componentes Skeleton**
**Responsável:** Dev Frontend
**Estimativa:** 8 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Criar componentes base
  - `TableSkeleton.tsx` - Para tabelas
  - `CardSkeleton.tsx` - Para cards
  - `FormSkeleton.tsx` - Para formulários
  - `TreeSkeleton.tsx` - Para árvore de diretórios
  - `KanbanSkeleton.tsx` - Para Kanban board

- [ ] Usar shadcn/ui Skeleton
  ```tsx
  import { Skeleton } from '@/components/ui/skeleton'
  ```

- [ ] Componentizar por quantidade
  - Props: `rows`, `columns`, `height`
  - Animação pulse automática

**Critérios de Aceite:**
- ✅ Componentes reutilizáveis
- ✅ Props configuráveis
- ✅ Animação suave
- ✅ Acessibilidade (aria-busy)

---

#### **Task 2.2: Refatorar Páginas OrdocAir**
**Responsável:** Dev Frontend
**Estimativa:** 12 horas
**Prioridade:** P0

**Páginas a Refatorar:**
1. `/app/dashboard/ordoc-air/my-air/page.tsx`
2. `/app/dashboard/ordoc-air/recents/page.tsx`
3. `/app/dashboard/ordoc-air/search/page.tsx`
4. `/app/dashboard/ordoc-air/shared/page.tsx`
5. `/app/dashboard/ordoc-air/recycle-bin/page.tsx` (verificar se usa)

**Padrão:**
```tsx
// ANTES
'use client'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export default function Page() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />
  return <Content />
}

// DEPOIS
import { Suspense } from 'react'
import { TreeSkeleton } from '@/components/ui/skeletons/TreeSkeleton'

export default function Page() {
  return (
    <Suspense fallback={<TreeSkeleton />}>
      <Content />
    </Suspense>
  )
}
```

**Critérios de Aceite:**
- ✅ LoadingScreen removido
- ✅ Suspense implementado
- ✅ Skeleton apropriado usado
- ✅ Sem delays artificiais
- ✅ Carregamento instantâneo do skeleton

---

#### **Task 2.3: Refatorar Páginas OrdocCloud**
**Responsável:** Dev Frontend
**Estimativa:** 8 horas
**Prioridade:** P0

**Páginas:**
1. `/app/dashboard/ordoc-cloud/users/page.tsx`
2. `/app/dashboard/ordoc-cloud/organizations/page.tsx`
3. `/app/dashboard/ordoc-cloud/organizations/[id]/page.tsx`
4. `/app/dashboard/ordoc-cloud/policies/page.tsx`

**Critérios de Aceite:**
- ✅ Mesmo padrão das páginas OrdocAir
- ✅ TableSkeleton usado

---

#### **Task 2.4: Refatorar Portal Cidadão**
**Responsável:** Dev Frontend
**Estimativa:** 4 horas
**Prioridade:** P0

**Páginas:**
1. `/app/cidadao/dashboard/procedures/[id]/fields/page.tsx`
2. `/app/cidadao/dashboard/procedures/[id]/review/page.tsx`

**Critérios de Aceite:**
- ✅ FormSkeleton usado
- ✅ CardSkeleton usado

---

#### **Task 2.5: Limpeza**
**Responsável:** Dev Frontend
**Estimativa:** 2 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Deletar `LoadingScreen.tsx`
- [ ] Deletar `users/page-old.tsx`
- [ ] Atualizar imports
- [ ] Testes de navegação (E2E)
- [ ] Documentar padrão para futuras páginas

---

## 🎯 SPRINT 3: TESTES E QUALIDADE (Semana 3-4 - 10 dias úteis)

**Objetivo:** Implementar cobertura de testes e CI/CD

### 📅 Backend: Testes Unitários (1 semana)

#### **Task 3.1: Setup Infraestrutura de Testes**
**Responsável:** Dev Backend
**Estimativa:** 8 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Configurar pytest
  ```bash
  cd backend
  poetry add --group dev pytest pytest-django pytest-cov pytest-mock factory-boy
  ```

- [ ] Criar `pytest.ini`
  ```ini
  [pytest]
  DJANGO_SETTINGS_MODULE = ordoc_ai.settings_test
  python_files = tests.py test_*.py *_tests.py
  addopts = --cov=. --cov-report=html --cov-report=term-missing
  ```

- [ ] Criar `settings_test.py`
  - Database: SQLite in-memory
  - Celery: EAGER mode
  - Cache: LocMemCache

- [ ] Configurar fixtures
  - `conftest.py` global
  - Factories para modelos principais

**Critérios de Aceite:**
- ✅ `pytest` roda sem erros
- ✅ Coverage report gerado
- ✅ Factories funcionando

---

#### **Task 3.2: Testes de Models**
**Responsável:** Dev Backend
**Estimativa:** 16 horas
**Prioridade:** P0

**Módulos a testar:**
- `ordoc_air/tests/test_models.py`
- `ordoc_flow/tests/test_models.py`
- `ordoc_cloud/tests/test_models.py`
- `ordoc_sign/tests/test_models.py`

**Cobertura mínima:**
- ✅ Criação de instâncias
- ✅ Validações (clean, save)
- ✅ Métodos customizados
- ✅ Properties calculadas
- ✅ Relacionamentos (ForeignKey, ManyToMany)

**Meta:** 80%+ cobertura em models

---

#### **Task 3.3: Testes de Views/APIs**
**Responsável:** Dev Backend
**Estimativa:** 20 horas
**Prioridade:** P0

**Módulos:**
- `ordoc_air/tests/test_views.py`
- `ordoc_flow/tests/test_views.py`
- `ordoc_cloud/tests/test_views.py`

**Cobertura:**
- ✅ CRUD completo
- ✅ Autenticação/Autorização
- ✅ Filtros e ordenação
- ✅ Paginação
- ✅ Erros (400, 401, 403, 404, 500)

**Meta:** 70%+ cobertura em views

---

#### **Task 3.4: Testes de Serviços Críticos**
**Responsável:** Dev Backend
**Estimativa:** 16 horas
**Prioridade:** P0

**Serviços:**
- `ordoc_integrations/tests/test_services.py`
- `intelligence/tests/test_services.py`

**Focar em:**
- ✅ Cache dual-layer
- ✅ Rate limiting
- ✅ Retry logic
- ✅ Error handling
- ✅ Council de especialistas (mock LLM)

**Meta:** 80%+ cobertura

---

#### **Task 3.5: Testes de FSM (State Machines)**
**Responsável:** Dev Backend
**Estimativa:** 12 horas
**Prioridade:** P0

**Models com FSM:**
- `Document` (ordoc_air)
- `Procedure` (ordoc_flow)
- `Task` (ordoc_flow)
- `SignatureRequest` (ordoc_sign)

**Testar:**
- ✅ Transições válidas
- ✅ Transições inválidas (raise exception)
- ✅ Callbacks (on_success, on_error)
- ✅ Condições de transição

**Meta:** 100% cobertura FSM

---

### 📅 Frontend: Testes Unitários (1 semana)

#### **Task 3.6: Setup Jest + Testing Library**
**Responsável:** Dev Frontend
**Estimativa:** 8 horas
**Prioridade:** P0

**Entregáveis:**
- [ ] Instalar dependências
  ```bash
  cd frontend-new
  pnpm add --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
  ```

- [ ] Criar `jest.config.js`
  ```js
  module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
  }
  ```

- [ ] Criar `jest.setup.js`
  ```js
  import '@testing-library/jest-dom'
  ```

- [ ] Adicionar scripts
  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
  ```

**Critérios de Aceite:**
- ✅ `pnpm test` roda
- ✅ Coverage report gerado

---

#### **Task 3.7: Testes de Hooks**
**Responsável:** Dev Frontend
**Estimativa:** 16 horas
**Prioridade:** P0

**Hooks a testar:**
- `hooks/use-documents.ts`
- `hooks/use-notifications.ts`
- `hooks/use-alerts.ts`
- `hooks/use-intelligent-priority.ts`
- `hooks/queries/use-documents-query.ts`
- `hooks/queries/use-auth-query.ts`

**Padrão:**
```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { useDocuments } from '@/hooks/use-documents'

describe('useDocuments', () => {
  it('should fetch documents', async () => {
    const { result } = renderHook(() => useDocuments())

    await waitFor(() => {
      expect(result.current.documents).toHaveLength(5)
    })
  })
})
```

**Meta:** 70%+ cobertura hooks

---

#### **Task 3.8: Testes de Componentes**
**Responsável:** Dev Frontend
**Estimativa:** 20 horas
**Prioridade:** P0

**Componentes críticos:**
- `components/intelligence/ai-alerts-widget.tsx`
- `components/ordoc-flow/kanban-board.tsx`
- `components/tasks/intelligent-priority-badge.tsx`
- `components/error-boundary.tsx`

**Padrão:**
```tsx
import { render, screen } from '@testing-library/react'
import { AIAlertsWidget } from '@/components/intelligence/ai-alerts-widget'

describe('AIAlertsWidget', () => {
  it('should render alerts', () => {
    render(<AIAlertsWidget />)
    expect(screen.getByText(/alertas/i)).toBeInTheDocument()
  })
})
```

**Meta:** 60%+ cobertura componentes

---

#### **Task 3.9: Testes de Stores (Zustand)**
**Responsável:** Dev Frontend
**Estimativa:** 8 horas
**Prioridade:** P0

**Stores:**
- `stores/app-store.ts`
- `stores/my-day-store.ts`

**Testar:**
- ✅ Estado inicial
- ✅ Ações (setUser, setAlerts, etc)
- ✅ Persistência (mock localStorage)
- ✅ Computed values

**Meta:** 80%+ cobertura stores

---

## 🎯 SPRINT 4: CI/CD E MONITORING (Semana 5 - 5 dias úteis)

**Objetivo:** Automatizar testes e preparar para deploy

### 📅 Dia 1-3: CI/CD

#### **Task 4.1: GitHub Actions - Backend**
**Responsável:** DevOps / Dev Backend
**Estimativa:** 8 horas
**Prioridade:** P1

**Entregáveis:**
- [ ] Criar `.github/workflows/backend-ci.yml`
  ```yaml
  name: Backend CI

  on:
    pull_request:
      paths:
        - 'backend/**'
    push:
      branches: [main, develop]

  jobs:
    test:
      runs-on: ubuntu-latest
      services:
        postgres:
          image: postgres:15
        redis:
          image: redis:7
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with:
            python-version: '3.12'
        - name: Install dependencies
          run: |
            cd backend
            pip install poetry
            poetry install
        - name: Run tests
          run: |
            cd backend
            poetry run pytest --cov --cov-report=xml
        - name: Upload coverage
          uses: codecov/codecov-action@v4
  ```

**Critérios de Aceite:**
- ✅ Testes rodam em PRs
- ✅ Cobertura reportada no Codecov
- ✅ PR bloqueado se testes falharem

---

#### **Task 4.2: GitHub Actions - Frontend**
**Responsável:** DevOps / Dev Frontend
**Estimativa:** 8 horas
**Prioridade:** P1

**Entregáveis:**
- [ ] Criar `.github/workflows/frontend-ci.yml`
  ```yaml
  name: Frontend CI

  on:
    pull_request:
      paths:
        - 'frontend-new/**'
    push:
      branches: [main, develop]

  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v3
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
            cache: 'pnpm'
        - name: Install dependencies
          run: |
            cd frontend-new
            pnpm install
        - name: Run tests
          run: |
            cd frontend-new
            pnpm test:coverage
        - name: Build
          run: |
            cd frontend-new
            pnpm build
  ```

**Critérios de Aceite:**
- ✅ Testes rodam em PRs
- ✅ Build verifica sem erros
- ✅ TypeScript strict sem erros

---

### 📅 Dia 4-5: Monitoring e APM

#### **Task 4.3: Sentry (Error Tracking)**
**Responsável:** DevOps
**Estimativa:** 6 horas
**Prioridade:** P1

**Backend:**
```python
# backend/ordoc_ai/settings.py
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    environment=os.getenv('ENVIRONMENT', 'production'),
    traces_sample_rate=0.1,
)
```

**Frontend:**
```tsx
// frontend-new/app/layout.tsx
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
})
```

**Critérios de Aceite:**
- ✅ Erros reportados automaticamente
- ✅ Stack traces completos
- ✅ Contexto de usuário

---

#### **Task 4.4: APM (Application Performance Monitoring)**
**Responsável:** DevOps
**Estimativa:** 8 horas
**Prioridade:** P1

**Opções:**
- Datadog APM
- New Relic
- Elastic APM (open source)

**Backend:**
- Rastreamento de queries SQL
- Tempo de execução de ViewSets
- Celery tasks

**Frontend:**
- Web Vitals (LCP, FID, CLS)
- API calls latency
- Render time

**Critérios de Aceite:**
- ✅ Dashboards configurados
- ✅ Alertas em slow queries
- ✅ Rastreamento end-to-end

---

## 📊 MÉTRICAS DE SUCESSO

### Sprint 1 (Fundações)
- ✅ 0 crashes não tratados no frontend
- ✅ 100% logs estruturados
- ✅ Rate limiting ativo em 100% endpoints críticos

### Sprint 2 (UX)
- ✅ 0 páginas usando LoadingScreen
- ✅ Tempo de carregamento percebido < 100ms (skeleton)
- ✅ 100% páginas com Suspense

### Sprint 3 (Testes)
- ✅ Backend: 75%+ cobertura global
- ✅ Frontend: 60%+ cobertura global
- ✅ 100% FSM testado
- ✅ 80%+ hooks testados

### Sprint 4 (CI/CD)
- ✅ 100% PRs com testes automáticos
- ✅ 0 deploys sem testes passando
- ✅ Monitoring ativo em produção

---

## 🚀 ROADMAP DE EXECUÇÃO

### Semana 1 (Sprint 1)
```
Seg: Error Boundaries + Logger Frontend
Ter: Logger Backend
Qua: Rate Limiting (parte 1)
Qui: Rate Limiting (parte 2)
Sex: Testes e documentação
```

### Semana 2 (Sprint 2)
```
Seg: Skeleton components
Ter: Refatorar OrdocAir (3 páginas)
Qua: Refatorar OrdocAir + OrdocCloud (4 páginas)
Qui: Refatorar Portal Cidadão + Limpeza
Sex: Testes E2E, documentação
```

### Semana 3 (Sprint 3 - Backend)
```
Seg: Setup pytest + factories
Ter: Testes models
Qua: Testes models + views
Qui: Testes views + serviços
Sex: Testes FSM
```

### Semana 4 (Sprint 3 - Frontend)
```
Seg: Setup Jest
Ter: Testes hooks
Qua: Testes hooks + components
Qui: Testes components
Sex: Testes stores + review
```

### Semana 5 (Sprint 4)
```
Seg: GitHub Actions backend
Ter: GitHub Actions frontend
Qua: Sentry setup
Qui: APM setup
Sex: Documentação final, retrospectiva
```

---

## 📋 CHECKLIST FINAL

### Antes de Marcar como Concluído

#### Sprint 1
- [ ] Error Boundaries implementados e testados
- [ ] Logging estruturado (backend + frontend)
- [ ] Rate limiting ativo e documentado
- [ ] Documentação atualizada

#### Sprint 2
- [ ] Todos Skeleton components criados
- [ ] 12 páginas refatoradas
- [ ] LoadingScreen.tsx deletado
- [ ] Testes E2E passando

#### Sprint 3
- [ ] Cobertura backend > 75%
- [ ] Cobertura frontend > 60%
- [ ] Todos FSM testados
- [ ] CI local rodando

#### Sprint 4
- [ ] GitHub Actions configurado
- [ ] Sentry reportando erros
- [ ] APM monitorando
- [ ] Dashboards criados

---

## 🎯 CRITÉRIOS DE PRONTO PARA PRODUÇÃO

Após completar as 4 sprints, a plataforma estará pronta para produção se:

✅ **Estabilidade**
- 0 crashes não tratados
- Error Boundaries em todas as rotas
- Logs estruturados em todos os módulos

✅ **Segurança**
- Rate limiting ativo
- Testes de segurança passando
- Auditoria funcionando

✅ **Qualidade**
- Cobertura de testes > 70% (backend + frontend)
- CI/CD automatizado
- Code review obrigatório

✅ **Observabilidade**
- Monitoring APM ativo
- Error tracking (Sentry)
- Alertas configurados

✅ **Performance**
- Tempo de carregamento < 2s
- Skeleton UI instantâneo
- Queries otimizadas

---

**Aprovado por:** [Nome]
**Data de Início:** [Data]
**Data de Conclusão Estimada:** [Data + 5 semanas]
**Status:** 📋 Aguardando Aprovação
