# Configuração de Equipes GitHub - OrdocAI

Guia completo para estruturar equipes e permissões no GitHub.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Equipes](#estrutura-de-equipes)
- [1. Criar Equipes na Organização](#1-criar-equipes-na-organização)
- [2. Configurar Permissões por Equipe](#2-configurar-permissões-por-equipe)
- [3. Adicionar Membros às Equipes](#3-adicionar-membros-às-equipes)
- [4. Configurar CODEOWNERS](#4-configurar-codeowners)
- [5. Configurar Branch Protection](#5-configurar-branch-protection)
- [6. Configurar Notificações](#6-configurar-notificações)
- [7. Configurar Dependabot](#7-configurar-dependabot)

## Visão Geral

A estrutura de equipes do OrdocAI segue o modelo de **ownership por componente**, garantindo que cada parte do sistema tenha responsáveis claros.

**Benefícios:**
- ✅ Auto-assign de reviews baseado em arquivos modificados
- ✅ Notificações direcionadas (reduz ruído)
- ✅ Proteção de código crítico
- ✅ Onboarding mais claro (novos membros sabem quem perguntar)
- ✅ Métricas de contribuição por equipe

## Estrutura de Equipes

```
@Adsumtec/ordocai
├── @Adsumtec/core-team (Admin)
│   ├── Tech Lead
│   └── Engineering Manager
├── @Adsumtec/backend-team (Write)
│   ├── Backend Developers
│   └── Backend Lead
├── @Adsumtec/frontend-team (Write)
│   ├── Frontend Developers
│   └── Frontend Lead
├── @Adsumtec/devops-team (Maintain)
│   ├── DevOps Engineers
│   └── SRE
├── @Adsumtec/qa-team (Triage)
│   ├── QA Engineers
│   └── QA Lead
└── @Adsumtec/design-team (Read)
    ├── UI/UX Designers
    └── Product Designers
```

## 1. Criar Equipes na Organização

### 1.1 Pré-requisitos

- [ ] Acesso **Owner** na organização GitHub `Adsumtec`
- [ ] GitHub organization (não funciona em contas pessoais)

### 1.2 Criar equipe Core Team

1. Vá em `https://github.com/orgs/Adsumtec/teams`
2. Clique em **"New team"**
3. Configure:
   - **Team name**: `core-team`
   - **Description**: `Core engineering team - Full repository access`
   - **Team visibility**: `Visible` (recomendado)
   - **Parent team**: None
4. Clique em **"Create team"**

### 1.3 Criar equipes especializadas

Repita o processo para cada equipe:

**Backend Team:**
- **Team name**: `backend-team`
- **Description**: `Backend developers - Python, Django, Celery`
- **Parent team**: None

**Frontend Team:**
- **Team name**: `frontend-team`
- **Description**: `Frontend developers - Next.js, React, TypeScript`
- **Parent team**: None

**DevOps Team:**
- **Team name**: `devops-team`
- **Description**: `DevOps and SRE - CI/CD, Infrastructure, Monitoring`
- **Parent team**: None

**QA Team:**
- **Team name**: `qa-team`
- **Description**: `Quality Assurance - Testing, Bug tracking`
- **Parent team**: None

**Design Team:**
- **Team name**: `design-team`
- **Description**: `UI/UX Design - Interface design, User research`
- **Parent team**: None

### 1.4 Verificar estrutura

Liste todas as equipes:

```bash
# Usando GitHub CLI
gh api orgs/Adsumtec/teams --jq '.[].name'
```

Deve exibir:
```
core-team
backend-team
frontend-team
devops-team
qa-team
design-team
```

## 2. Configurar Permissões por Equipe

### 2.1 Adicionar repositório às equipes

Para cada equipe, configure o nível de acesso ao repositório `ordoc-ai`:

1. Vá em `https://github.com/orgs/Adsumtec/teams/<team-name>/repositories`
2. Clique em **"Add repository"**
3. Selecione `ordoc-ai`
4. Defina permission level

### 2.2 Permission levels recomendados

| Equipe | Permission | Justificativa |
|--------|------------|---------------|
| **core-team** | `Admin` | Acesso total, manage settings, deploy keys |
| **backend-team** | `Write` | Push to branches, merge PRs, manage issues |
| **frontend-team** | `Write` | Push to branches, merge PRs, manage issues |
| **devops-team** | `Maintain` | Manage issues/PRs, não pode alterar settings |
| **qa-team** | `Triage` | Manage issues/PRs, não pode merge |
| **design-team** | `Read` | Read-only, comentar em PRs |

### 2.3 Configurar via GitHub CLI

```bash
# Core Team - Admin
gh api repos/Adsumtec/ordoc-ai/teams/core-team \
  -X PUT \
  -f permission='admin'

# Backend Team - Write
gh api repos/Adsumtec/ordoc-ai/teams/backend-team \
  -X PUT \
  -f permission='push'

# Frontend Team - Write
gh api repos/Adsumtec/ordoc-ai/teams/frontend-team \
  -X PUT \
  -f permission='push'

# DevOps Team - Maintain
gh api repos/Adsumtec/ordoc-ai/teams/devops-team \
  -X PUT \
  -f permission='maintain'

# QA Team - Triage
gh api repos/Adsumtec/ordoc-ai/teams/qa-team \
  -X PUT \
  -f permission='triage'

# Design Team - Read
gh api repos/Adsumtec/ordoc-ai/teams/design-team \
  -X PUT \
  -f permission='pull'
```

### 2.4 Verificar permissões

```bash
# Listar permissões
gh api repos/Adsumtec/ordoc-ai/teams --jq '.[] | "\(.name): \(.permission)"'
```

Deve exibir:
```
core-team: admin
backend-team: push
frontend-team: push
devops-team: maintain
qa-team: triage
design-team: pull
```

## 3. Adicionar Membros às Equipes

### 3.1 Adicionar membros via UI

1. Vá em `https://github.com/orgs/Adsumtec/teams/<team-name>/members`
2. Clique em **"Add a member"**
3. Busque pelo username ou email
4. Defina role:
   - **Maintainer**: Pode adicionar/remover membros, configurar equipe
   - **Member**: Participante regular

### 3.2 Adicionar membros via CLI

```bash
# Adicionar membro à equipe
gh api orgs/Adsumtec/teams/backend-team/memberships/<username> \
  -X PUT \
  -f role='member'

# Adicionar maintainer
gh api orgs/Adsumtec/teams/backend-team/memberships/<username> \
  -X PUT \
  -f role='maintainer'
```

### 3.3 Distribuição recomendada

**Core Team** (2-4 pessoas):
- Tech Lead (Maintainer)
- Engineering Manager (Maintainer)
- Senior Engineers com mais tempo de casa (Member)

**Backend Team** (3-6 pessoas):
- Backend Lead (Maintainer)
- Senior Backend Developers (Member)
- Backend Developers (Member)

**Frontend Team** (3-6 pessoas):
- Frontend Lead (Maintainer)
- Senior Frontend Developers (Member)
- Frontend Developers (Member)

**DevOps Team** (1-3 pessoas):
- DevOps Lead (Maintainer)
- DevOps Engineers (Member)
- SRE (Member)

**QA Team** (2-4 pessoas):
- QA Lead (Maintainer)
- QA Engineers (Member)

**Design Team** (1-3 pessoas):
- Design Lead (Maintainer)
- Designers (Member)

### 3.4 Convidar membros externos (contractors)

Para contractors/freelancers:

1. Convide como **Outside collaborator** (não membro da org)
2. Adicione permissões específicas ao repositório
3. NÃO adicione a equipes (a menos que seja necessário)

```bash
# Adicionar outside collaborator
gh api repos/Adsumtec/ordoc-ai/collaborators/<username> \
  -X PUT \
  -f permission='push'
```

## 4. Configurar CODEOWNERS

O arquivo `.github/CODEOWNERS` já está configurado. Vamos revisá-lo:

### 4.1 Estrutura atual

```
# Default owners for everything
* @Adsumtec/core-team

# Backend ownership
/backend/ @Adsumtec/backend-team
/test/backend/ @Adsumtec/backend-team

# Frontend ownership
/frontend-new/ @Adsumtec/frontend-team
/test/frontend/ @Adsumtec/frontend-team

# Infrastructure ownership
/.github/ @Adsumtec/devops-team
/docker/ @Adsumtec/devops-team
/docker-compose*.yml @Adsumtec/devops-team
/Dockerfile* @Adsumtec/devops-team

# Documentation
/docs/ @Adsumtec/core-team
/*.md @Adsumtec/core-team

# Critical files (require core team approval)
/backend/ordoc_ai/settings*.py @Adsumtec/core-team @Adsumtec/devops-team
/.env.example @Adsumtec/devops-team
/pyproject.toml @Adsumtec/backend-team @Adsumtec/devops-team
/package.json @Adsumtec/frontend-team @Adsumtec/devops-team
```

### 4.2 Como funciona

Quando um PR modifica arquivos:

1. GitHub identifica os owners via CODEOWNERS
2. Auto-assign reviewers das equipes correspondentes
3. PR só pode ser merged após aprovação dos owners

**Exemplo:**
- PR modifica `backend/models.py` → Assign `@Adsumtec/backend-team`
- PR modifica `.github/workflows/ci.yml` → Assign `@Adsumtec/devops-team`
- PR modifica `backend/settings.py` → Assign `@Adsumtec/core-team` **E** `@Adsumtec/devops-team` (ambos devem aprovar)

### 4.3 Testar CODEOWNERS

1. Crie um PR de teste modificando `backend/models.py`
2. Verifique se `@Adsumtec/backend-team` foi auto-assigned
3. Feche o PR de teste

```bash
# Validar sintaxe do CODEOWNERS
gh api repos/Adsumtec/ordoc-ai/codeowners/errors
```

## 5. Configurar Branch Protection

### 5.1 Proteger branch main

1. Vá em `https://github.com/Adsumtec/ordoc-ai/settings/branches`
2. Clique em **"Add rule"** para `main`
3. Configure regras:

**Require pull request reviews before merging:**
- ☑️ Require approvals: `2` (mínimo 2 aprovações)
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require review from Code Owners
- ☑️ Require approval of the most recent reviewable push

**Require status checks to pass before merging:**
- ☑️ Require branches to be up to date before merging
- Status checks required:
  - `backend-tests`
  - `frontend-tests`
  - `backend-lint`
  - `frontend-lint`
  - `codecov/project`
  - `codecov/patch`

**Require conversation resolution before merging:**
- ☑️ All conversations must be resolved

**Require signed commits:**
- ☑️ Require signed commits (recomendado)

**Require linear history:**
- ☑️ Require linear history (evita merge commits)

**Do not allow bypassing the above settings:**
- ☑️ Do not allow bypassing (nem admins podem bypass)
- Ou: ☐ Allow administrators to bypass (para emergências)

**Restrict who can push to matching branches:**
- ☑️ Restrict pushes
- Allowed to push: `@Adsumtec/core-team`, `@Adsumtec/devops-team`

**Rules applied to everyone including administrators:**
- ☑️ Include administrators

### 5.2 Proteger branch develop (se existir)

Mesmas regras, mas mais flexível:

- Require approvals: `1` (mínimo 1 aprovação)
- Status checks: Apenas testes (não coverage)
- Allow force push: `@Adsumtec/core-team`

### 5.3 Configurar via API

```bash
# Proteger main
gh api repos/Adsumtec/ordoc-ai/branches/main/protection \
  -X PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "backend-tests",
      "frontend-tests",
      "backend-lint",
      "frontend-lint",
      "codecov/project"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2,
    "require_last_push_approval": true
  },
  "restrictions": {
    "users": [],
    "teams": ["core-team", "devops-team"]
  },
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF
```

## 6. Configurar Notificações

### 6.1 Notificações por equipe

Cada equipe pode configurar suas notificações:

1. Vá em `https://github.com/orgs/Adsumtec/teams/<team-name>/discussions`
2. Clique em **"Settings"**
3. Configure:
   - **Discussions**: Enabled (para comunicação interna da equipe)
   - **Email notifications**: Custom

### 6.2 Notification routing recomendado

**Core Team:**
- Todos os PRs (watching)
- Todos os issues critical/high
- Deploy notifications
- Security alerts

**Backend/Frontend Teams:**
- PRs que modificam sua área (CODEOWNERS)
- Issues com label correspondente
- CI failures em sua área

**DevOps Team:**
- PRs que modificam infrastructure
- Todos os CI failures
- Dependency updates (Dependabot)
- Security alerts

**QA Team:**
- PRs marcados para QA review
- Issues com label `bug`
- Release candidates

### 6.3 Configurar Slack notifications

Integre GitHub com Slack:

1. No Slack, adicione app **GitHub**
2. Configure:
   - `/github subscribe Adsumtec/ordoc-ai`
   - `/github subscribe Adsumtec/ordoc-ai reviews comments`

3. Configure canais por equipe:

```
# Canal geral
#ordocai → Todas as notificações importantes

# Canais por equipe
#ordocai-backend → Backend PRs, issues, CI
#ordocai-frontend → Frontend PRs, issues, CI
#ordocai-devops → Infrastructure, deployments
#ordocai-qa → Bug reports, test results
```

Configurar filtros:

```bash
# Backend team channel
/github subscribe Adsumtec/ordoc-ai issues pulls commits:main
/github subscribe Adsumtec/ordoc-ai workflows
/github subscribe Adsumtec/ordoc-ai deployments

# Configure filtros
/github subscribe Adsumtec/ordoc-ai issues pulls --labels "backend"
/github unsubscribe Adsumtec/ordoc-ai commits
```

## 7. Configurar Dependabot

O arquivo `.github/dependabot.yml` já está configurado para assignar PRs às equipes.

### 7.1 Estrutura atual

```yaml
updates:
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
    reviewers:
      - "Adsumtec/backend-team"
      - "Adsumtec/devops-team"
    assignees:
      - "Adsumtec/devops-team"
    labels:
      - "dependencies"
      - "backend"

  - package-ecosystem: "npm"
    directory: "/frontend-new"
    schedule:
      interval: "weekly"
    reviewers:
      - "Adsumtec/frontend-team"
      - "Adsumtec/devops-team"
    assignees:
      - "Adsumtec/devops-team"
    labels:
      - "dependencies"
      - "frontend"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    reviewers:
      - "Adsumtec/devops-team"
    assignees:
      - "Adsumtec/devops-team"
    labels:
      - "dependencies"
      - "ci/cd"
```

### 7.2 Como funciona

1. Dependabot cria PR toda segunda 09:00
2. Auto-assign reviewers e assignees às equipes configuradas
3. Equipes recebem notificação
4. Após aprovação (2 reviews), CI roda
5. Se passar, pode ser merged

## 8. Métricas e Monitoramento

### 8.1 Insights por equipe

Monitore contribuições por equipe:

1. Vá em `https://github.com/Adsumtec/ordoc-ai/pulse`
2. Configure filtros:
   - **Contributors**: Ver commits por pessoa/equipe
   - **Pull requests**: Ver PRs por equipe
   - **Code frequency**: Ver adições/remoções

### 8.2 Métricas recomendadas

**Core Team:**
- Review time médio: < 4 horas
- PRs merged por semana: 10-20
- Critical issues resolvidos: 100%

**Backend/Frontend Teams:**
- PRs opened por semana: 5-10 por pessoa
- Code review participation: 80%+
- Teste coverage: Manter/melhorar

**DevOps Team:**
- CI success rate: > 95%
- Deploy frequency: Daily (staging), Weekly (prod)
- Dependabot PR review time: < 24h

**QA Team:**
- Bugs found per sprint: 5-15
- Bug fix time (crítico): < 24h
- Regression rate: < 5%

### 8.3 Dashboard GitHub Insights

Configure dashboard custom em:
`https://github.com/orgs/Adsumtec/insights`

Widgets recomendados:
- Pull requests by team
- Issues by label/team
- Code review metrics
- Deployment frequency
- MTTR (Mean Time To Recovery)

## 📊 Resumo de Estrutura

| Equipe | Permission | Responsabilidade | Membros (aprox) |
|--------|-----------|------------------|-----------------|
| **core-team** | Admin | Arquitetura, decisões técnicas, deploys | 2-4 |
| **backend-team** | Write | Backend code, APIs, database | 3-6 |
| **frontend-team** | Write | Frontend code, UI components | 3-6 |
| **devops-team** | Maintain | CI/CD, infrastructure, monitoring | 1-3 |
| **qa-team** | Triage | Testing, QA, bug tracking | 2-4 |
| **design-team** | Read | UI/UX design, mockups | 1-3 |

## 🔗 Links Úteis

- [GitHub Teams Docs](https://docs.github.com/en/organizations/organizing-members-into-teams)
- [CODEOWNERS Syntax](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Repository Roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization)

## ❓ FAQ

### Posso ter um membro em múltiplas equipes?

**Sim!** Membros podem estar em várias equipes. Exemplo:
- Tech Lead → `core-team` + `backend-team`
- Full-stack → `backend-team` + `frontend-team`

### O que acontece se ninguém da equipe aprovar?

Se CODEOWNERS exige aprovação da equipe, PR fica bloqueado até:
1. Alguém da equipe aprovar, OU
2. Admin fazer bypass (se permitido nas branch protection rules)

### Como remover membro de equipe?

```bash
# Via UI
https://github.com/orgs/Adsumtec/teams/<team-name>/members

# Via CLI
gh api orgs/Adsumtec/teams/<team-name>/memberships/<username> -X DELETE
```

### Equipe não aparece no CODEOWNERS?

**Verificar:**
1. Equipe tem acesso ao repositório?
2. Syntax do CODEOWNERS está correto?
3. Equipe está visível (não secret)?

```bash
# Validar CODEOWNERS
gh api repos/Adsumtec/ordoc-ai/codeowners/errors
```

---

**Configurado por:** DevOps Team
**Última atualização:** 2024-12-30
**Versão:** 1.0
