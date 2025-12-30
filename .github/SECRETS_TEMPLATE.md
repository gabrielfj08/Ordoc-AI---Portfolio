# GitHub Secrets Template - OrdocAI

Template de referência para configurar secrets do GitHub Actions.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Repository Secrets](#repository-secrets)
- [Environment Secrets](#environment-secrets)
- [Organization Secrets](#organization-secrets)
- [Como Configurar](#como-configurar)
- [Rotação de Secrets](#rotação-de-secrets)
- [Troubleshooting](#troubleshooting)

## Visão Geral

GitHub Secrets são usados para armazenar informações sensíveis (tokens, passwords, API keys) que o CI/CD precisa acessar de forma segura.

**Tipos de secrets:**
1. **Repository secrets**: Disponíveis para todos os workflows do repositório
2. **Environment secrets**: Disponíveis apenas para workflows específicos do environment
3. **Organization secrets**: Compartilhados entre múltiplos repositórios

## Repository Secrets

### Sentry

Usado para error tracking e APM.

```
Name: SENTRY_DSN_BACKEND
Description: Sentry DSN for backend (Django)
Example: https://examplekey@o123456.ingest.sentry.io/7891011
Where to get: https://sentry.io/settings/adsumtec/projects/ordocai-backend/keys/
Used in: backend-ci.yml (env.SENTRY_DSN)
Required: No (CI works without, but recommended)
```

```
Name: SENTRY_DSN_FRONTEND
Description: Sentry DSN for frontend (Next.js)
Example: https://examplekey@o123456.ingest.sentry.io/7891012
Where to get: https://sentry.io/settings/adsumtec/projects/ordocai-frontend/keys/
Used in: frontend-ci.yml (env.NEXT_PUBLIC_SENTRY_DSN)
Required: No (CI works without, but recommended)
```

```
Name: SENTRY_AUTH_TOKEN
Description: Sentry auth token for creating releases
Example: sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Where to get: https://sentry.io/settings/account/api/auth-tokens/
Scopes needed: project:read, project:releases, org:read
Used in: backend-ci.yml, frontend-ci.yml (release creation)
Required: No (releases won't be tracked without)
```

### Codecov

Usado para code coverage tracking.

```
Name: CODECOV_TOKEN
Description: Codecov upload token
Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Where to get: https://codecov.io/gh/Adsumtec/ordoc-ai/settings
Used in: backend-ci.yml, frontend-ci.yml (codecov upload)
Required: Recommended (works without for public repos, but rate limited)
```

### Database (CI Testing)

**Não é necessário configurar** - PostgreSQL/Redis são provisionados via GitHub Actions services.

As credenciais são definidas inline nos workflows:
```yaml
services:
  postgres:
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ordoc_test
```

### Outros Secrets (Futuros)

```
Name: NPM_TOKEN
Description: NPM authentication token (se publicar packages)
Example: npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Where to get: https://www.npmjs.com/settings/~/tokens
Used in: frontend-ci.yml (npm publish)
Required: Only if publishing to NPM
```

```
Name: DOCKER_USERNAME
Description: Docker Hub username (se publicar images)
Example: adsumtec
Where to get: Docker Hub account
Used in: docker-build.yml (docker login)
Required: Only if publishing to Docker Hub
```

```
Name: DOCKER_PASSWORD
Description: Docker Hub password or token
Example: dckr_pat_xxxxxxxxxxxxxxxxxxxxxxxx
Where to get: https://hub.docker.com/settings/security
Used in: docker-build.yml (docker login)
Required: Only if publishing to Docker Hub
```

## Environment Secrets

Secrets específicos por environment (production, staging, development).

### Environment: production

```
Name: SENTRY_ENVIRONMENT
Description: Sentry environment name
Value: production
Used in: Deployment workflows
Required: No (defaults to 'development')
```

```
Name: DATABASE_URL
Description: PostgreSQL connection string (production)
Example: postgresql://user:pass@db.example.com:5432/ordoc_prod
Where to get: Your cloud database provider (AWS RDS, DigitalOcean, etc)
Used in: deploy-production.yml
Required: Yes (for production deployments)
```

```
Name: REDIS_URL
Description: Redis connection string (production)
Example: redis://user:pass@redis.example.com:6379/0
Where to get: Your Redis provider (AWS ElastiCache, Redis Cloud, etc)
Used in: deploy-production.yml
Required: Yes (for production deployments)
```

```
Name: SECRET_KEY
Description: Django secret key (production)
Example: django-insecure-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Where to get: Generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
Used in: deploy-production.yml (env.SECRET_KEY)
Required: Yes (for production deployments)
```

```
Name: AWS_ACCESS_KEY_ID
Description: AWS access key (if using S3 for media/static files)
Example: AKIAIOSFODNN7EXAMPLE
Where to get: AWS IAM Console
Used in: deploy-production.yml (S3 upload)
Required: Only if using AWS S3
```

```
Name: AWS_SECRET_ACCESS_KEY
Description: AWS secret access key
Example: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Where to get: AWS IAM Console
Used in: deploy-production.yml (S3 upload)
Required: Only if using AWS S3
```

```
Name: SSH_PRIVATE_KEY
Description: SSH key for deploying to servers
Example: -----BEGIN OPENSSH PRIVATE KEY-----\nxxxxxxxx\n-----END OPENSSH PRIVATE KEY-----
Where to get: Generate with: ssh-keygen -t ed25519 -C "github-actions@ordocai"
Used in: deploy-production.yml (SSH deployment)
Required: Only if deploying via SSH
```

### Environment: staging

```
Name: SENTRY_ENVIRONMENT
Value: staging
```

```
Name: DATABASE_URL
Description: PostgreSQL connection string (staging)
Example: postgresql://user:pass@staging-db.example.com:5432/ordoc_staging
```

```
Name: REDIS_URL
Description: Redis connection string (staging)
Example: redis://user:pass@staging-redis.example.com:6379/0
```

```
Name: SECRET_KEY
Description: Django secret key (staging) - diferente de production!
```

### Environment: development

Geralmente não precisa de secrets - usa valores padrão do .env local.

## Organization Secrets

Secrets compartilhados entre múltiplos repositórios (se houver).

**Quando usar:**
- Múltiplos repos precisam do mesmo token (ex: NPM_TOKEN)
- Credentials compartilhadas (ex: AWS credentials para todos os projetos)

**Não use para:**
- Secrets específicos de um repo (use repository secrets)
- Secrets específicos de ambiente (use environment secrets)

## Como Configurar

### Via GitHub UI

#### Repository Secrets

1. Vá em `https://github.com/Adsumtec/ordoc-ai/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Preencha:
   - **Name**: Nome do secret (UPPERCASE_WITH_UNDERSCORES)
   - **Value**: Valor do secret
4. Clique em **"Add secret"**

#### Environment Secrets

1. Vá em `https://github.com/Adsumtec/ordoc-ai/settings/environments`
2. Clique em `production` (ou outro environment)
3. Clique em **"Add secret"**
4. Preencha Name e Value
5. Clique em **"Add secret"**

### Via GitHub CLI

#### Repository Secrets

```bash
# Configurar secret interativamente (mais seguro)
gh secret set SENTRY_DSN_BACKEND --repo Adsumtec/ordoc-ai

# Ou passar valor via stdin
echo "https://key@o123.ingest.sentry.io/789" | gh secret set SENTRY_DSN_BACKEND --repo Adsumtec/ordoc-ai

# Ou ler de arquivo
gh secret set SENTRY_DSN_BACKEND --body-file sentry-dsn.txt --repo Adsumtec/ordoc-ai

# Listar secrets (não mostra valores)
gh secret list --repo Adsumtec/ordoc-ai
```

#### Environment Secrets

```bash
# Configurar secret para environment
gh secret set DATABASE_URL --env production --repo Adsumtec/ordoc-ai

# Ou via stdin
echo "postgresql://user:pass@db.prod.com/ordoc" | gh secret set DATABASE_URL --env production --repo Adsumtec/ordoc-ai
```

### Script de Setup Completo

```bash
#!/bin/bash
# setup-github-secrets.sh
# Configura todos os secrets necessários

REPO="Adsumtec/ordoc-ai"

echo "🔐 Configurando GitHub Secrets para OrdocAI..."

# Repository Secrets
echo "📦 Repository Secrets..."
gh secret set SENTRY_DSN_BACKEND --repo $REPO
gh secret set SENTRY_DSN_FRONTEND --repo $REPO
gh secret set SENTRY_AUTH_TOKEN --repo $REPO
gh secret set CODECOV_TOKEN --repo $REPO

# Production Environment
echo "🚀 Production Environment Secrets..."
gh secret set DATABASE_URL --env production --repo $REPO
gh secret set REDIS_URL --env production --repo $REPO
gh secret set SECRET_KEY --env production --repo $REPO
gh secret set SENTRY_ENVIRONMENT --env production --repo $REPO --body "production"

# Staging Environment
echo "🧪 Staging Environment Secrets..."
gh secret set DATABASE_URL --env staging --repo $REPO
gh secret set REDIS_URL --env staging --repo $REPO
gh secret set SECRET_KEY --env staging --repo $REPO
gh secret set SENTRY_ENVIRONMENT --env staging --repo $REPO --body "staging"

echo "✅ Secrets configurados com sucesso!"
echo "📋 Verifique em: https://github.com/$REPO/settings/secrets/actions"
```

Uso:
```bash
chmod +x setup-github-secrets.sh
./setup-github-secrets.sh
```

## Rotação de Secrets

**Best practice:** Rotacionar secrets periodicamente (a cada 3-6 meses).

### Processo de Rotação

1. **Gerar novo secret** (ex: novo Sentry Auth Token)
2. **Atualizar no GitHub** (substituir valor antigo)
3. **Testar CI** (rodar workflow manualmente)
4. **Revogar secret antigo** (na plataforma original)

### Rotação Automatizada

Para alguns secrets, você pode automatizar rotação:

```yaml
# .github/workflows/rotate-secrets.yml
name: Rotate Secrets

on:
  schedule:
    - cron: '0 0 1 */3 *'  # A cada 3 meses
  workflow_dispatch:  # Ou manual

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate new Django SECRET_KEY
        run: |
          NEW_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
          echo "::add-mask::$NEW_KEY"
          echo "NEW_SECRET_KEY=$NEW_KEY" >> $GITHUB_ENV

      - name: Update secret
        run: |
          gh secret set SECRET_KEY --env production --body "$NEW_SECRET_KEY"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Notify team
        run: |
          echo "✅ SECRET_KEY rotacionado com sucesso em $(date)"
          # Enviar notificação (Slack, email, etc)
```

### Checklist de Rotação

- [ ] Sentry Auth Token (a cada 6 meses)
- [ ] Codecov Token (a cada 6 meses)
- [ ] Django SECRET_KEY (a cada 3 meses)
- [ ] Database passwords (a cada 6 meses)
- [ ] AWS Access Keys (a cada 3 meses)
- [ ] SSH Keys (a cada 12 meses)

## Validação de Secrets

### Verificar se secrets estão configurados

```bash
# Listar repository secrets
gh secret list --repo Adsumtec/ordoc-ai

# Listar environment secrets
gh api repos/Adsumtec/ordoc-ai/environments/production/secrets --jq '.secrets[].name'
```

### Testar secrets no CI

Crie workflow de teste:

```yaml
# .github/workflows/test-secrets.yml
name: Test Secrets

on: workflow_dispatch

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test Sentry DSN (Backend)
        run: |
          if [ -z "${{ secrets.SENTRY_DSN_BACKEND }}" ]; then
            echo "❌ SENTRY_DSN_BACKEND não configurado"
            exit 1
          fi
          echo "✅ SENTRY_DSN_BACKEND configurado"

      - name: Test Codecov Token
        run: |
          if [ -z "${{ secrets.CODECOV_TOKEN }}" ]; then
            echo "⚠️ CODECOV_TOKEN não configurado (opcional)"
          else
            echo "✅ CODECOV_TOKEN configurado"
          fi

      # Adicione mais testes conforme necessário
```

Execute manualmente:
```bash
gh workflow run test-secrets.yml --repo Adsumtec/ordoc-ai
```

## Troubleshooting

### Secret não está disponível no workflow

**Causa:** Secret não configurado ou typo no nome.

**Solução:**
```bash
# Verificar se existe
gh secret list --repo Adsumtec/ordoc-ai | grep SENTRY_DSN

# Se não existe, criar
gh secret set SENTRY_DSN_BACKEND --repo Adsumtec/ordoc-ai
```

### Secret funcionava antes, agora não funciona mais

**Causas possíveis:**
1. Secret expirou (alguns tokens têm TTL)
2. Secret foi revogado na plataforma original
3. Permissões mudaram

**Solução:**
1. Gerar novo token na plataforma original
2. Atualizar secret no GitHub
3. Re-rodar workflow

### Erro: "Resource not accessible by integration"

**Causa:** GITHUB_TOKEN não tem permissões suficientes.

**Solução:**
```yaml
# No workflow, adicione permissões
permissions:
  contents: read
  secrets: write  # Se precisar atualizar secrets
```

### Como debugar secrets no CI (sem expor valores)

**NUNCA faça:**
```yaml
- run: echo ${{ secrets.SENTRY_DSN }}  # ❌ EXPÕE O SECRET NOS LOGS
```

**Faça:**
```yaml
- name: Debug secret (safe)
  run: |
    if [ -z "${{ secrets.SENTRY_DSN }}" ]; then
      echo "❌ Secret está vazio"
    else
      echo "✅ Secret está configurado (length: ${#SENTRY_DSN})"
      echo "✅ Primeiros 4 chars: ${SENTRY_DSN:0:4}..."
    fi
  env:
    SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

## 📋 Checklist de Configuração Inicial

Use esta checklist ao configurar secrets pela primeira vez:

### Obrigatórios (para CI básico funcionar)

- [ ] `CODECOV_TOKEN` - Code coverage tracking
- [ ] `SENTRY_DSN_BACKEND` - Backend error tracking
- [ ] `SENTRY_DSN_FRONTEND` - Frontend error tracking

### Recomendados (para CI completo)

- [ ] `SENTRY_AUTH_TOKEN` - Sentry releases
- [ ] Environment: `production` criado
- [ ] Environment: `staging` criado

### Para Deployments (quando necessário)

- [ ] `DATABASE_URL` (production)
- [ ] `REDIS_URL` (production)
- [ ] `SECRET_KEY` (production)
- [ ] `AWS_ACCESS_KEY_ID` (se usar S3)
- [ ] `AWS_SECRET_ACCESS_KEY` (se usar S3)
- [ ] `SSH_PRIVATE_KEY` (se deploy via SSH)

## 🔗 Links Úteis

- [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Secrets](https://cli.github.com/manual/gh_secret)
- [Environment Secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

## 🔒 Security Best Practices

1. **Nunca commite secrets no código**
   - Use `.env` local (git-ignored)
   - Use GitHub Secrets para CI/CD
   - Use secret managers (AWS Secrets Manager, Vault) para production

2. **Use princípio do menor privilégio**
   - Crie tokens com scopes mínimos necessários
   - Use environment secrets para separar prod/staging

3. **Rotacione secrets regularmente**
   - Sentry/Codecov tokens: a cada 6 meses
   - Database passwords: a cada 3-6 meses
   - SSH keys: a cada 12 meses

4. **Monitore uso de secrets**
   - Revise logs de audit do GitHub
   - Configure alertas para acessos suspeitos

5. **Tenha plano de revogação**
   - Se secret vazar, saiba como revogar rapidamente
   - Tenha backups de configurações

---

**Configurado por:** DevOps Team
**Última atualização:** 2024-12-30
**Versão:** 1.0
