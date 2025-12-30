# Configuração do Codecov - OrdocAI

Guia completo para configurar code coverage tracking com Codecov.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [1. Criar Conta e Conectar Repositório](#1-criar-conta-e-conectar-repositório)
- [2. Configurar Backend Coverage](#2-configurar-backend-coverage)
- [3. Configurar Frontend Coverage](#3-configurar-frontend-coverage)
- [4. Configurar GitHub Integration](#4-configurar-github-integration)
- [5. Configurar Badges](#5-configurar-badges)
- [6. Configurar Comentários em PRs](#6-configurar-comentários-em-prs)
- [7. Monitoramento e Métricas](#7-monitoramento-e-métricas)

## Visão Geral

O OrdocAI utiliza Codecov para:
- **Coverage Tracking**: Monitora cobertura de testes automaticamente
- **PR Comments**: Comentários automáticos em pull requests com coverage diff
- **Coverage Trends**: Histórico de cobertura ao longo do tempo
- **Quality Gates**: Bloqueia PRs que diminuem cobertura

**Componentes monitorados:**
1. Backend (Python/Django) - Target: 75%+
2. Frontend (TypeScript/Next.js) - Target: 60%+

## Pré-requisitos

- [ ] Acesso administrativo ao repositório GitHub `Adsumtec/ordoc-ai`
- [ ] CI/CD configurado (GitHub Actions)
- [ ] Testes rodando e gerando coverage reports

## 1. Criar Conta e Conectar Repositório

### 1.1 Criar conta Codecov

1. Acesse [codecov.io](https://codecov.io)
2. Clique em **"Sign up with GitHub"**
3. Autorize o Codecov a acessar sua conta GitHub
4. Selecione organização: `Adsumtec`

**Planos disponíveis:**
- **Free**: Repositórios públicos ilimitados
- **Pro ($29/mês)**: 5 repositórios privados
- **Team ($12/usuário/mês)**: Repositórios privados ilimitados

**Nota:** Se o repositório for privado, será necessário plano pago.

### 1.2 Adicionar repositório

1. No dashboard do Codecov, clique em **"Add a repository"**
2. Encontre `Adsumtec/ordoc-ai`
3. Clique em **"Setup repo"**
4. Selecione CI provider: **GitHub Actions**

### 1.3 Obter upload token

Após adicionar o repositório, você verá:

```
Repository Upload Token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**⚠️ IMPORTANTE**: Salve este token em local seguro (será usado nos secrets do GitHub).

**Nota:** Para repositórios públicos, o token não é obrigatório, mas recomendado para evitar rate limits.

## 2. Configurar Backend Coverage

### 2.1 Verificar pytest coverage

O backend já está configurado para gerar coverage. Verifique em `backend/pyproject.toml`:

```toml
[tool.pytest.ini_options]
addopts = [
    "--cov=backend",
    "--cov-report=xml",
    "--cov-report=term-missing",
    "--cov-fail-under=75",
]
```

E em `test/backend/pytest.ini`:

```ini
[pytest]
addopts =
    --cov=backend
    --cov-report=html:test/backend/htmlcov
    --cov-report=xml:backend/coverage.xml
    --cov-fail-under=75
```

### 2.2 Testar geração de coverage

```bash
cd backend
poetry run pytest --cov=backend --cov-report=xml

# Verificar se coverage.xml foi gerado
ls -lh coverage.xml
```

Deve gerar arquivo `backend/coverage.xml` com formato XML do coverage.py.

### 2.3 Upload manual (teste)

Para testar o upload antes de integrar no CI:

```bash
# Instalar codecov CLI
pip install codecov

# Fazer upload
cd backend
codecov -t <CODECOV_TOKEN> -f coverage.xml -F backend

# Ou usando codecov-cli (nova versão)
curl -Os https://cli.codecov.io/latest/linux/codecov
chmod +x codecov
./codecov upload-process --file coverage.xml --flag backend --token <CODECOV_TOKEN>
```

Verifique no dashboard do Codecov se o coverage aparece.

## 3. Configurar Frontend Coverage

### 3.1 Verificar Jest coverage

O frontend já está configurado. Verifique em `frontend-new/jest.config.ts`:

```typescript
const config: Config = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}
```

### 3.2 Testar geração de coverage

```bash
cd frontend-new
pnpm test:coverage

# Verificar se coverage foi gerado
ls -lh coverage/
ls -lh coverage/coverage-final.json
```

Deve gerar diretório `frontend-new/coverage/` com:
- `coverage-final.json` - Coverage data
- `lcov.info` - LCOV format (usado pelo Codecov)
- `clover.xml` - Clover format

### 3.3 Upload manual (teste)

```bash
cd frontend-new
codecov -t <CODECOV_TOKEN> -f coverage/lcov.info -F frontend
```

## 4. Configurar GitHub Integration

### 4.1 Adicionar token aos secrets

1. Vá em `https://github.com/Adsumtec/ordoc-ai/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Crie o secret:
   - **Name**: `CODECOV_TOKEN`
   - **Value**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (token do passo 1.3)

### 4.2 Verificar workflows

Os workflows já estão configurados para fazer upload. Verifique:

**Backend CI** (`.github/workflows/backend-ci.yml`):

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./backend/coverage.xml
    flags: backend
    name: backend-coverage
    fail_ci_if_error: false
  env:
    CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

**Frontend CI** (`.github/workflows/frontend-ci.yml`):

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./frontend-new/coverage/lcov.info
    flags: frontend
    name: frontend-coverage
    fail_ci_if_error: false
  env:
    CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

### 4.3 Verificar integração

1. Crie um pull request de teste
2. Aguarde CI rodar
3. Verifique se Codecov comentou no PR
4. Verifique dashboard do Codecov

**Exemplo de comentário esperado:**

```
Codecov Report
Merging #123 (abc1234) into main (def5678) will increase coverage by 2.5%.
The diff coverage is 85.71%.

@@            Coverage Diff             @@
##             main     #123      +/-   ##
==========================================
+ Coverage   72.45%   74.95%   +2.50%
==========================================
  Files          45       46       +1
  Lines        1234     1289      +55
==========================================
+ Hits          894      966      +72
+ Misses        340      323      -17
```

## 5. Configurar codecov.yml

### 5.1 Criar arquivo de configuração

Crie `.codecov.yml` na raiz do repositório:

```yaml
# Codecov Configuration for OrdocAI

coverage:
  status:
    project:
      default:
        target: auto
        threshold: 1%  # Allow 1% decrease
        informational: false  # Fail CI if coverage decreases
    patch:
      default:
        target: 70%  # New code must have 70%+ coverage
        threshold: 5%
        informational: false

  precision: 2
  round: down
  range: "60...100"

# Flags for different components
flag_management:
  default_rules:
    carryforward: true
    statuses:
      - type: project
        target: auto
      - type: patch
        target: 70%

  individual_flags:
    - name: backend
      paths:
        - backend/
        - test/backend/
      carryforward: true
      statuses:
        - type: project
          target: 75%  # Backend target: 75%+
          threshold: 2%
        - type: patch
          target: 80%  # New backend code: 80%+

    - name: frontend
      paths:
        - frontend-new/
        - test/frontend/
      carryforward: true
      statuses:
        - type: project
          target: 60%  # Frontend target: 60%+
          threshold: 2%
        - type: patch
          target: 70%  # New frontend code: 70%+

# Comment configuration
comment:
  layout: "reach,diff,flags,tree"
  behavior: default
  require_changes: true  # Only comment if coverage changed
  require_base: false
  require_head: true

# Ignore paths
ignore:
  - "test/**/*"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/migrations/**"
  - "**/node_modules/**"
  - "**/__pycache__/**"

# GitHub checks
github_checks:
  annotations: true
```

### 5.2 Commit e push

```bash
git add .codecov.yml
git commit -m "chore: configurar codecov.yml"
git push
```

### 5.3 Validar configuração

Valide a configuração em:
https://codecov.io/gh/Adsumtec/ordoc-ai/settings

Ou use o Codecov Validator:
https://codecov.io/validate

## 6. Configurar Badges

### 6.1 Obter badges

1. No Codecov, vá em `Settings > Badge`
2. Copie o markdown do badge:

**Badge geral:**
```markdown
[![codecov](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg)](https://codecov.io/gh/Adsumtec/ordoc-ai)
```

**Badge backend:**
```markdown
[![Backend Coverage](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/Adsumtec/ordoc-ai?flags[]=backend)
```

**Badge frontend:**
```markdown
[![Frontend Coverage](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/Adsumtec/ordoc-ai?flags[]=frontend)
```

### 6.2 Adicionar ao README

Edite `README.md`:

```markdown
# OrdocAI

[![Backend Coverage](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/Adsumtec/ordoc-ai?flags[]=backend)
[![Frontend Coverage](https://codecov.io/gh/Adsumtec/ordoc-ai/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/Adsumtec/ordoc-ai?flags[]=frontend)
[![CI](https://github.com/Adsumtec/ordoc-ai/workflows/CI/badge.svg)](https://github.com/Adsumtec/ordoc-ai/actions)

...resto do README...
```

## 7. Configurar Comentários em PRs

### 7.1 Personalizar comentários

Edite `.codecov.yml`:

```yaml
comment:
  layout: |
    ## Codecov Report
    > Merging {{owner}}/{{repo}}#{{pull}} ({{head}}) into {{base}} ({{base_commit}}) will **{{impact}}** coverage by `{{diff}}%`.

    ### Coverage Summary

    | | Coverage Δ | Complexity Δ |
    |---|---|---|
    | Backend | {{flags.backend.totals.coverage}}% `{{flags.backend.diff}}%` | {{flags.backend.totals.complexity}} `{{flags.backend.diff_complexity}}` |
    | Frontend | {{flags.frontend.totals.coverage}}% `{{flags.frontend.diff}}%` | {{flags.frontend.totals.complexity}} `{{flags.frontend.diff_complexity}}` |

    {{diff}}

    {{files}}

  behavior: default
  require_changes: true
  require_base: true
  require_head: true
  hide_project_coverage: false
```

### 7.2 Configurar status checks

No GitHub:

1. Vá em `Settings > Branches > main`
2. Edit branch protection rule
3. Ative **"Require status checks to pass"**
4. Adicione status checks:
   - `codecov/project` - Coverage geral
   - `codecov/patch` - Coverage do diff
   - `codecov/project/backend` - Backend coverage
   - `codecov/project/frontend` - Frontend coverage

## 8. Monitoramento e Métricas

### 8.1 Dashboard recomendado

No Codecov, configure views personalizadas:

**View 1: Coverage Trend**
- Gráfico de linha mostrando coverage ao longo do tempo
- Separado por flags (backend, frontend)
- Período: Últimos 3 meses

**View 2: File Coverage**
- Tabela com coverage por arquivo
- Filtrar: Coverage < 75% (backend) ou < 60% (frontend)
- Ordenar: Coverage ascendente

**View 3: Uncovered Lines**
- Lista de linhas não cobertas
- Priorizar: Arquivos críticos (models, services, controllers)

### 8.2 Métricas recomendadas

Monitore semanalmente:

**Coverage Geral:**
- Target: 70%+ (média backend + frontend)
- Trend: +1% por sprint

**Backend:**
- Target: 75%+
- Critical files (models, FSM): 100%
- Services: 80%+
- Views: 70%+

**Frontend:**
- Target: 60%+
- Components: 70%+
- Hooks: 80%+
- Utils: 90%+

**Patch Coverage:**
- Target: 80%+ (novo código)
- Bloquear PRs com patch coverage < 70%

### 8.3 Configurar alerts

No Codecov:

1. Vá em `Settings > General`
2. Configure **"Notification emails"**:
   - `devops@adsumtec.com`
   - `tech-lead@adsumtec.com`

3. Ative notificações para:
   - Coverage decreased by more than 5%
   - Coverage dropped below 70%
   - New uncovered critical files

## 9. Integração com Ferramentas

### 9.1 Slack

1. No Codecov, vá em `Settings > Integrations > Slack`
2. Clique em **"Add to Slack"**
3. Autorize e selecione canal: `#ordocai-ci`
4. Configure notificações:
   - Coverage status changes
   - Failed coverage checks
   - Weekly coverage reports

### 9.2 VS Code Extension

Instale a extensão [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters):

1. Instale via VS Code Marketplace
2. Configure em `.vscode/settings.json`:
```json
{
  "coverage-gutters.coverageFileNames": [
    "backend/coverage.xml",
    "frontend-new/coverage/lcov.info"
  ],
  "coverage-gutters.showLineCoverage": true,
  "coverage-gutters.showRulerCoverage": true
}
```

3. Execute testes e veja coverage inline no editor

### 9.3 IDE Integration (PyCharm/WebStorm)

**PyCharm (Backend):**
1. Run > Edit Configurations
2. Select pytest configuration
3. Ative **"Run with coverage"**
4. Coverage tool: `coverage.py`

**WebStorm (Frontend):**
1. Run > Edit Configurations
2. Select Jest configuration
3. Ative **"with coverage"**
4. Coverage tool: `Istanbul`

## 📊 Resumo de Configuração

| Item | Backend | Frontend |
|------|---------|----------|
| **Tool** | pytest-cov | Jest |
| **Format** | XML (coverage.xml) | LCOV (lcov.info) |
| **Target Coverage** | 75%+ | 60%+ |
| **Patch Coverage** | 80%+ | 70%+ |
| **Flag** | `backend` | `frontend` |
| **Paths** | `backend/`, `test/backend/` | `frontend-new/`, `test/frontend/` |
| **Fail CI** | Coverage < 75% | Coverage < 60% |

## 🔗 Links Úteis

- [Codecov Dashboard](https://codecov.io/gh/Adsumtec/ordoc-ai)
- [Codecov Docs](https://docs.codecov.com/)
- [codecov.yml Reference](https://docs.codecov.com/docs/codecov-yaml)
- [GitHub Integration](https://docs.codecov.com/docs/github-integration)
- [Best Practices](https://docs.codecov.com/docs/best-practices)

## ❓ Troubleshooting

### Upload failing: "Token not found"

**Causa:** CODECOV_TOKEN não configurado.

**Solução:**
```bash
# Adicione o token aos GitHub Secrets
gh secret set CODECOV_TOKEN --body "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Coverage report not found

**Causa:** Coverage não está sendo gerado.

**Verificar:**
```bash
# Backend
cd backend
poetry run pytest --cov=backend --cov-report=xml
ls -lh coverage.xml

# Frontend
cd frontend-new
pnpm test:coverage
ls -lh coverage/lcov.info
```

### Codecov não comenta no PR

**Causa:** Permissões ou configuração incorreta.

**Verificar:**
1. Codecov app tem permissões no repositório?
2. `comment.require_changes: true` em `.codecov.yml`?
3. PR está em draft mode?

**Solução:**
```yaml
# .codecov.yml
comment:
  require_changes: false  # Sempre comentar
  require_base: false
```

### Status check failing

**Causa:** Coverage abaixo do target.

**Verificar:**
```bash
# Rodar testes localmente
cd backend
poetry run pytest --cov=backend --cov-report=term-missing

# Ver quais linhas não estão cobertas
# Adicionar testes para aumentar coverage
```

### Coverage dropped unexpectedly

**Causa:** Código novo sem testes ou código deletado.

**Investigar:**
1. Verifique diff do PR no Codecov
2. Identifique arquivos com coverage baixo
3. Adicione testes para cobrir novo código

---

**Configurado por:** DevOps Team
**Última atualização:** 2024-12-30
**Versão:** 1.0
