# Guia CI/CD - OrdocAI

Documentação completa do pipeline de CI/CD da plataforma OrdocAI.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Infraestrutura Externa](#infraestrutura-externa)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Pre-commit Hooks](#pre-commit-hooks)
5. [Dependabot](#dependabot)
6. [Sentry Error Tracking](#sentry-error-tracking)
7. [Codecov Coverage](#codecov-coverage)
8. [Code Owners](#code-owners)
9. [Troubleshooting](#troubleshooting)

---

## Visão Geral

O CI/CD do OrdocAI é composto por:

- **GitHub Actions**: Pipelines automatizados para testes
- **Pre-commit Hooks**: Validação local antes de commits
- **Dependabot**: Atualizações automáticas de dependências
- **Sentry**: Error tracking e performance monitoring
- **Code Owners**: Revisões automáticas por equipe

```
┌─────────────┐
│   Commit    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Pre-commit  │ ◄── black, flake8, isort, prettier
│   Hooks     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Git Push   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      GitHub Actions             │
│  ┌──────────┐   ┌───────────┐  │
│  │ Backend  │   │ Frontend  │  │
│  │   CI     │   │    CI     │  │
│  └──────────┘   └───────────┘  │
│       │               │         │
│       ▼               ▼         │
│  [ Tests ]       [ Tests ]      │
│  [ Lint  ]       [ Lint  ]      │
│  [Coverage]      [Coverage]     │
└─────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Deploy    │ (se main/production)
└─────────────┘
```

---

## Infraestrutura Externa

O CI/CD do OrdocAI depende de serviços externos que precisam ser configurados:

### 🚀 Setup Rápido

Execute o script automatizado:

```bash
./scripts/setup-infrastructure.sh
```

Este script configura interativamente:
- ✅ GitHub Secrets
- ✅ GitHub Teams
- ✅ Sentry projects
- ✅ Codecov integration

### 📚 Guias Detalhados

Para configuração manual ou troubleshooting, consulte os guias específicos:

#### 1. Sentry (Error Tracking & APM)

**Guia:** [`.github/SENTRY_SETUP.md`](.github/SENTRY_SETUP.md)

**O que configura:**
- Projetos backend (Django) e frontend (Next.js)
- DSN keys para cada ambiente
- Alertas e notificações
- Session Replay (frontend)
- Performance monitoring (APM)

**Secrets necessários:**
```bash
SENTRY_DSN_BACKEND       # Backend error tracking
SENTRY_DSN_FRONTEND      # Frontend error tracking
SENTRY_AUTH_TOKEN        # Para releases tracking
```

#### 2. Codecov (Code Coverage)

**Guia:** [`.github/CODECOV_SETUP.md`](.github/CODECOV_SETUP.md)

**O que configura:**
- Projeto Codecov conectado ao GitHub
- Upload token
- Coverage targets (backend 75%, frontend 60%)
- Badges para README
- Comentários automáticos em PRs

**Secrets necessários:**
```bash
CODECOV_TOKEN            # Upload token (opcional para repos públicos)
```

**Arquivo de configuração:** `.codecov.yml`

#### 3. GitHub Teams

**Guia:** [`.github/GITHUB_TEAMS_SETUP.md`](.github/GITHUB_TEAMS_SETUP.md)

**O que configura:**
- Equipes na organização (@Adsumtec/backend-team, etc)
- Permissões por equipe (admin, write, maintain, triage, read)
- Auto-assign de reviews via CODEOWNERS
- Branch protection rules

**Equipes criadas:**
- `@Adsumtec/core-team` (Admin)
- `@Adsumtec/backend-team` (Write)
- `@Adsumtec/frontend-team` (Write)
- `@Adsumtec/devops-team` (Maintain)
- `@Adsumtec/qa-team` (Triage)
- `@Adsumtec/design-team` (Read)

#### 4. GitHub Secrets

**Guia:** [`.github/SECRETS_TEMPLATE.md`](.github/SECRETS_TEMPLATE.md)

**Repository Secrets:**
```bash
CODECOV_TOKEN           # Code coverage uploads
SENTRY_DSN_BACKEND      # Backend error tracking
SENTRY_DSN_FRONTEND     # Frontend error tracking
SENTRY_AUTH_TOKEN       # Sentry releases
```

**Environment Secrets (Production):**
```bash
DATABASE_URL            # PostgreSQL connection
REDIS_URL               # Redis connection
SECRET_KEY              # Django secret key
AWS_ACCESS_KEY_ID       # AWS credentials (se usar S3)
AWS_SECRET_ACCESS_KEY   # AWS credentials
```

### ⚙️ Ordem de Configuração Recomendada

1. **GitHub Teams** (5-10 min)
   - Cria estrutura organizacional
   - Necessário para CODEOWNERS funcionar

2. **GitHub Secrets** (5 min)
   - Configura secrets básicos (depois adiciona os tokens externos)

3. **Sentry** (15-20 min)
   - Cria projetos backend e frontend
   - Obter DSN keys
   - Adicionar DSN keys aos secrets

4. **Codecov** (10-15 min)
   - Conectar repositório
   - Obter upload token
   - Adicionar token aos secrets

5. **Testar CI** (5 min)
   - Criar PR de teste
   - Verificar se tudo funciona

**Tempo total estimado:** 40-60 minutos

### 🔍 Verificação de Setup

Execute para verificar configuração:

```bash
# Verificar secrets
gh secret list --repo Adsumtec/ordoc-ai

# Verificar teams
gh api orgs/Adsumtec/teams --jq '.[].name'

# Validar CODEOWNERS
gh api repos/Adsumtec/ordoc-ai/codeowners/errors

# Validar codecov.yml
curl -X POST --data-binary @.codecov.yml https://codecov.io/validate
```

### 🆘 Troubleshooting Rápido

**Sentry não está recebendo eventos:**
- Verificar se DSN está configurado corretamente
- Verificar logs do console: deve imprimir "✅ Sentry initialized"
- Ver guia: `.github/SENTRY_SETUP.md#troubleshooting`

**Codecov upload failing:**
- Verificar se CODECOV_TOKEN está configurado
- Verificar se coverage report foi gerado (coverage.xml, lcov.info)
- Ver guia: `.github/CODECOV_SETUP.md#troubleshooting`

**CODEOWNERS não funciona:**
- Verificar se equipes existem na organização
- Verificar sintaxe do arquivo `.github/CODEOWNERS`
- Ver guia: `.github/GITHUB_TEAMS_SETUP.md#faq`

---

## GitHub Actions Workflows

### 1. Backend CI (`.github/workflows/backend-ci.yml`)

**Triggers:**
- Pull requests que modificam `backend/**` ou `test/backend/**`
- Push para `main` ou `develop`

**Serviços:**
- PostgreSQL 15
- Redis 7

**Steps:**
1. Checkout código
2. Setup Python 3.12
3. Cache Poetry dependencies
4. Install dependencies
5. **Linting:**
   - flake8 (erros críticos + complexidade)
   - black --check
   - isort --check
6. **Testes:**
   - pytest com coverage
   - Fail se coverage < 75%
7. Upload coverage para Codecov
8. Archive test results (30 dias)

**Executar localmente:**
```bash
cd backend
poetry install --with dev
poetry run flake8 .
poetry run black --check .
poetry run isort --check-only .
poetry run pytest --cov --cov-fail-under=75
```

---

### 2. Frontend CI (`.github/workflows/frontend-ci.yml`)

**Triggers:**
- Pull requests que modificam `frontend-new/**` ou `test/frontend/**`
- Push para `main` ou `develop`

**Jobs:**

#### A. Unit Tests
1. Checkout código
2. Setup pnpm + Node.js 20
3. Install dependencies (frozen lockfile)
4. **Linting:**
   - ESLint
   - TypeScript (tsc --noEmit)
5. **Testes:**
   - Jest com coverage
6. Upload coverage para Codecov
7. Build application (verificar que compila)

#### B. E2E Tests (Playwright)
1. Install Playwright browsers (chromium)
2. Run E2E tests
3. Upload Playwright report

**Executar localmente:**
```bash
cd frontend-new
pnpm install
pnpm lint
pnpm test:coverage
pnpm build
pnpm test:e2e
```

---

### 3. Main CI Pipeline (`.github/workflows/ci.yml`)

**Estratégia:** Path-based triggering

1. **Detect Changes:**
   - Usa `dorny/paths-filter` para detectar mudanças
   - Outputs: `backend` e `frontend` (true/false)

2. **Conditional Jobs:**
   - Backend CI: roda apenas se backend mudou
   - Frontend CI: roda apenas se frontend mudou

3. **Status Check:**
   - Valida resultados de ambos os jobs
   - Falha se qualquer um falhou

**Benefícios:**
- ⚡️ Mais rápido (não roda testes desnecessários)
- 💰 Economiza minutos do GitHub Actions
- ✅ Status check único para PR

---

## Pre-commit Hooks

Arquivo: `.pre-commit-config.yaml`

### Instalação

```bash
# Instalar pre-commit
pip install pre-commit

# Setup hooks (uma vez)
pre-commit install

# Rodar manualmente
pre-commit run --all-files
```

### Hooks Configurados

#### Python (Backend)

1. **black** (v25.1.0)
   - Formatter automático
   - Files: `backend/**/*.py`
   - Python 3.12

2. **flake8** (v7.1.1)
   - Linter
   - Max line length: 127
   - Ignora: E203, W503

3. **isort** (v6.0.1)
   - Organizador de imports
   - Profile: black
   - Line length: 127

#### TypeScript/JavaScript (Frontend)

4. **prettier** (v4.0.0)
   - Formatter
   - Files: `frontend-new/**/*.(js|jsx|ts|tsx|json)`
   - Auto-fix

#### Geral

5. **trailing-whitespace**: Remove espaços no fim
6. **end-of-file-fixer**: Garante newline no final
7. **check-yaml**: Valida sintaxe YAML
8. **check-added-large-files**: Bloqueia arquivos >5MB
9. **check-merge-conflict**: Detecta markers de merge
10. **detect-secrets**: Detecta credenciais (usa baseline)

### Bypass (Emergências)

```bash
# Pular hooks (use com cuidado!)
git commit --no-verify -m "hotfix: critical bug"
```

---

## Dependabot

Arquivo: `.github/dependabot.yml`

### Configuração

- **Frequência:** Semanal (Segunda-feira, 09:00)
- **PRs abertas:** Máximo 10 por ecosystem

### Ecosystems Monitorados

#### 1. Backend (pip)
```yaml
Directory: /backend
Labels: dependencies, backend, python
Reviewers: @Adsumtec/backend-team
Commit: deps(backend): ...
```

#### 2. Frontend (npm)
```yaml
Directory: /frontend-new
Labels: dependencies, frontend, javascript
Reviewers: @Adsumtec/frontend-team
Commit: deps(frontend): ...
Ignora major updates: next, react, react-dom
```

#### 3. GitHub Actions
```yaml
Directory: /
Labels: dependencies, github-actions
Commit: deps(ci): ...
```

### Fluxo de Atualização

```
Segunda 09:00
│
├─ Dependabot scan
│
├─ Cria PRs para updates
│
├─ CI runs automaticamente
│
├─ Review por code owners
│
└─ Merge (manual ou auto se CI passou)
```

---

## Sentry Error Tracking

### Backend

Arquivo: `backend/sentry_config.py`

**Setup:**
```python
# backend/ordoc_ai/settings.py
from sentry_config import init_sentry

# No final do arquivo
init_sentry()
```

**Variáveis de Ambiente:**
```bash
# .env
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% APM
SENTRY_RELEASE=v1.0.0
```

**Integrações:**
- Django (requests, middleware, cache)
- Celery (tasks, beat)
- Redis

**Filtragem:**
- Remove headers: Authorization, Cookie, X-API-Key
- Remove campos: password, token, secret, api_key

---

### Frontend

Arquivo: `frontend-new/lib/sentry.ts`

**Setup:**
```typescript
// frontend-new/app/layout.tsx
import { initSentry } from '@/lib/sentry'

// Client Component
'use client'
useEffect(() => {
  initSentry()
}, [])
```

**Variáveis de Ambiente:**
```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE=1.0
NEXT_PUBLIC_SENTRY_RELEASE=v1.0.0
```

**Features:**
- Session Replay (gravação de sessões com erros)
- Performance Monitoring (APM)
- Breadcrumbs automáticos
- Source maps (uploads via @sentry/cli)

**Erros Ignorados:**
- Browser extensions
- Network errors (tratados por error boundaries)
- Cancelled requests (AbortError)

---

## Codecov Coverage

### Visão Geral

Codecov rastreia automaticamente a cobertura de testes e comenta em PRs.

**Arquivo de configuração:** `.codecov.yml`

### Targets de Coverage

| Componente | Target | Patch Coverage | Status Check |
|------------|--------|----------------|--------------|
| **Backend** | 75%+ | 80%+ | ✅ Bloqueia PR se < target |
| **Frontend** | 60%+ | 70%+ | ✅ Bloqueia PR se < target |
| **Overall** | Auto | 70%+ | ⚠️ Permite 1% de queda |

### Flags

Coverage é separado por flags:

```yaml
# .codecov.yml
flag_management:
  individual_flags:
    - name: backend
      paths: [backend/, test/backend/]
      target: 75%

    - name: frontend
      paths: [frontend-new/, test/frontend/]
      target: 60%
```

**Uso nos workflows:**
```yaml
# Backend CI
- uses: codecov/codecov-action@v4
  with:
    files: ./backend/coverage.xml
    flags: backend  # ← Flag

# Frontend CI
- uses: codecov/codecov-action@v4
  with:
    files: ./frontend-new/coverage/lcov.info
    flags: frontend  # ← Flag
```

### Comentários em PRs

Codecov comenta automaticamente em PRs mostrando:

```
📊 Coverage: 72.45% → 74.95% (+2.50%)
✅ Patch coverage: 85.71% (target: 70%)

Backend: 75.2% (+1.5%)
Frontend: 62.3% (+0.8%)

Files changed: 5
Lines added: 55
Hits: 894 → 966 (+72)
Misses: 340 → 323 (-17)
```

### Verificação Local

```bash
# Backend
cd backend
poetry run pytest --cov=backend --cov-report=html
open htmlcov/index.html

# Frontend
cd frontend-new
pnpm test:coverage
open coverage/lcov-report/index.html
```

### Badges

Adicione badges ao README:

```markdown
[![Backend Coverage](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/Adsumtec/ordoc-ai)
[![Frontend Coverage](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/Adsumtec/ordoc-ai)
```

### Configuração Completa

Ver guia detalhado: [`.github/CODECOV_SETUP.md`](.github/CODECOV_SETUP.md)

---

## Code Owners

Arquivo: `.github/CODEOWNERS`

### Equipes

```
# Global
* @Adsumtec/core-team

# Backend
/backend/ @Adsumtec/backend-team
/test/backend/ @Adsumtec/backend-team

# Frontend
/frontend-new/ @Adsumtec/frontend-team
/test/frontend/ @Adsumtec/frontend-team

# DevOps
/.github/ @Adsumtec/devops-team

# QA
/test/ @Adsumtec/qa-team
```

### Funcionamento

1. PR criada
2. CODEOWNERS identifica arquivos modificados
3. Solicita review das equipes responsáveis
4. PR só pode ser merged após aprovação

---

## Troubleshooting

### CI Falhou - Backend

**1. Flake8 Error**
```bash
# Local
cd backend
poetry run flake8 .

# Fix
poetry run black .
poetry run isort .
```

**2. Tests Failed**
```bash
# Rodar localmente
poetry run pytest -v

# Com mais detalhes
poetry run pytest -vv --tb=short

# Specific test
poetry run pytest test/backend/integration/test_fsm.py
```

**3. Coverage < 75%**
```bash
# Ver coverage
poetry run pytest --cov --cov-report=html
open htmlcov/index.html

# Adicionar mais testes
```

---

### CI Falhou - Frontend

**1. ESLint Error**
```bash
# Local
cd frontend-new
pnpm lint

# Auto-fix
pnpm lint --fix
```

**2. TypeScript Error**
```bash
# Check types
npx tsc --noEmit

# Common issues:
# - Missing imports
# - Wrong types
# - Unused variables
```

**3. Jest Tests Failed**
```bash
# Rodar localmente
pnpm test

# Watch mode
pnpm test:watch

# Específico
pnpm test skeleton.test.tsx
```

---

### Pre-commit Hooks Bloqueiam Commit

**1. Black formatting**
```bash
# Auto-fix
cd backend
poetry run black .
git add .
```

**2. Prettier formatting**
```bash
# Auto-fix
cd frontend-new
npx prettier --write .
git add .
```

**3. Large file**
```bash
# Verificar
git ls-files --cached | xargs ls -lh | sort -k5 -hr | head

# Remover do staging
git reset HEAD <file>

# Adicionar ao .gitignore ou LFS
```

---

### Dependabot PRs

**1. Merge conflict**
```bash
# Na PR do Dependabot, clicar em "Resolve conflicts"
# Ou localmente:
git fetch origin pull/<PR_NUMBER>/head:dependabot-update
git checkout dependabot-update
git rebase main
# Resolver conflitos
git push --force
```

**2. CI failing**
```bash
# Checar se update quebrou algo
git checkout <dependabot-branch>
poetry install  # ou pnpm install
poetry run pytest  # ou pnpm test

# Se quebrou, pode rejeitar o update ou fixar
```

---

## 📊 Métricas

### Coverage Targets

| Área | Target | Atual | Status |
|------|--------|-------|--------|
| Backend Global | 75% | ~30% | ⚠️ |
| Backend FSM | 100% | 100% | ✅ |
| Frontend Global | 60% | ~15% | ⚠️ |

### CI Performance

- ⏱️ Backend CI: ~5-8 minutos
- ⏱️ Frontend CI: ~3-5 minutos
- ⏱️ E2E Tests: ~2-4 minutos

---

## 🔐 Secrets Necessários

Configure no GitHub: Settings → Secrets and variables → Actions

```bash
CODECOV_TOKEN           # Token do Codecov (opcional)
SENTRY_DSN_BACKEND      # Sentry DSN backend
SENTRY_DSN_FRONTEND     # Sentry DSN frontend
SENTRY_AUTH_TOKEN       # Para upload de source maps
```

---

**Última atualização:** Sprint 4 (Dez/2025)
**Mantido por:** @Adsumtec/devops-team
