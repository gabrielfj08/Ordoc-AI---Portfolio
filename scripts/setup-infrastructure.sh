#!/bin/bash

# =============================================================================
# OrdocAI Infrastructure Setup Script
# =============================================================================
#
# Este script automatiza a configuração de infraestrutura externa:
# - GitHub Secrets
# - GitHub Teams (via API)
# - Sentry projects (via sentry-cli)
# - Codecov project
#
# Pré-requisitos:
# - gh CLI instalado e autenticado
# - sentry-cli instalado (opcional, para Sentry)
# - Permissões de admin no repositório
#
# Uso:
#   ./scripts/setup-infrastructure.sh [opções]
#
# Opções:
#   --secrets-only    Configura apenas GitHub Secrets
#   --teams-only      Configura apenas GitHub Teams
#   --sentry-only     Configura apenas Sentry
#   --codecov-only    Configura apenas Codecov
#   --dry-run         Simula execução sem fazer mudanças
#   --help            Exibe esta mensagem de ajuda
#
# =============================================================================

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO="Adsumtec/ordoc-ai"
ORG="Adsumtec"
DRY_RUN=false
SETUP_SECRETS=true
SETUP_TEAMS=true
SETUP_SENTRY=true
SETUP_CODECOV=true

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    print_header "Verificando pré-requisitos"

    # Check gh CLI
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) não encontrado"
        echo "Instale com: brew install gh (macOS) ou veja https://cli.github.com/"
        exit 1
    fi
    print_success "GitHub CLI encontrado"

    # Check gh authentication
    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI não autenticado"
        echo "Execute: gh auth login"
        exit 1
    fi
    print_success "GitHub CLI autenticado"

    # Check sentry-cli (optional)
    if [ "$SETUP_SENTRY" = true ]; then
        if ! command -v sentry-cli &> /dev/null; then
            print_warning "sentry-cli não encontrado (opcional para Sentry setup)"
            print_info "Instale com: npm install -g @sentry/cli ou veja https://docs.sentry.io/cli/"
            SETUP_SENTRY=false
        else
            print_success "sentry-cli encontrado"
        fi
    fi

    # Check repository access
    if ! gh repo view "$REPO" &> /dev/null; then
        print_error "Sem acesso ao repositório $REPO"
        exit 1
    fi
    print_success "Acesso ao repositório confirmado"

    echo ""
}

# =============================================================================
# GitHub Secrets Setup
# =============================================================================

setup_github_secrets() {
    print_header "Configurando GitHub Secrets"

    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN - Nenhum secret será criado"
    fi

    # Repository Secrets
    echo "📦 Repository Secrets..."

    # Sentry Backend DSN
    read -p "Sentry Backend DSN (pressione Enter para pular): " SENTRY_DSN_BACKEND
    if [ -n "$SENTRY_DSN_BACKEND" ]; then
        if [ "$DRY_RUN" = false ]; then
            echo "$SENTRY_DSN_BACKEND" | gh secret set SENTRY_DSN_BACKEND --repo "$REPO"
            print_success "SENTRY_DSN_BACKEND configurado"
        else
            print_info "Seria configurado: SENTRY_DSN_BACKEND"
        fi
    else
        print_warning "SENTRY_DSN_BACKEND pulado"
    fi

    # Sentry Frontend DSN
    read -p "Sentry Frontend DSN (pressione Enter para pular): " SENTRY_DSN_FRONTEND
    if [ -n "$SENTRY_DSN_FRONTEND" ]; then
        if [ "$DRY_RUN" = false ]; then
            echo "$SENTRY_DSN_FRONTEND" | gh secret set SENTRY_DSN_FRONTEND --repo "$REPO"
            print_success "SENTRY_DSN_FRONTEND configurado"
        else
            print_info "Seria configurado: SENTRY_DSN_FRONTEND"
        fi
    else
        print_warning "SENTRY_DSN_FRONTEND pulado"
    fi

    # Sentry Auth Token
    read -p "Sentry Auth Token (pressione Enter para pular): " SENTRY_AUTH_TOKEN
    if [ -n "$SENTRY_AUTH_TOKEN" ]; then
        if [ "$DRY_RUN" = false ]; then
            echo "$SENTRY_AUTH_TOKEN" | gh secret set SENTRY_AUTH_TOKEN --repo "$REPO"
            print_success "SENTRY_AUTH_TOKEN configurado"
        else
            print_info "Seria configurado: SENTRY_AUTH_TOKEN"
        fi
    else
        print_warning "SENTRY_AUTH_TOKEN pulado"
    fi

    # Codecov Token
    read -p "Codecov Token (pressione Enter para pular): " CODECOV_TOKEN
    if [ -n "$CODECOV_TOKEN" ]; then
        if [ "$DRY_RUN" = false ]; then
            echo "$CODECOV_TOKEN" | gh secret set CODECOV_TOKEN --repo "$REPO"
            print_success "CODECOV_TOKEN configurado"
        else
            print_info "Seria configurado: CODECOV_TOKEN"
        fi
    else
        print_warning "CODECOV_TOKEN pulado"
    fi

    # Environment Secrets (Production)
    echo -e "\n🚀 Production Environment Secrets..."

    # Check if production environment exists
    if gh api "repos/$REPO/environments/production" &> /dev/null; then
        print_success "Environment 'production' já existe"
    else
        if [ "$DRY_RUN" = false ]; then
            # Create production environment
            gh api "repos/$REPO/environments/production" -X PUT
            print_success "Environment 'production' criado"
        else
            print_info "Seria criado: Environment 'production'"
        fi
    fi

    read -p "Production DATABASE_URL (pressione Enter para pular): " PROD_DATABASE_URL
    if [ -n "$PROD_DATABASE_URL" ]; then
        if [ "$DRY_RUN" = false ]; then
            echo "$PROD_DATABASE_URL" | gh secret set DATABASE_URL --env production --repo "$REPO"
            print_success "DATABASE_URL (production) configurado"
        else
            print_info "Seria configurado: DATABASE_URL (production)"
        fi
    else
        print_warning "DATABASE_URL (production) pulado"
    fi

    read -p "Production REDIS_URL (pressione Enter para pular): " PROD_REDIS_URL
    if [ -n "$PROD_REDIS_URL" ]; then
        if [ "$DRY_RUN" = false ]; then
            echo "$PROD_REDIS_URL" | gh secret set REDIS_URL --env production --repo "$REPO"
            print_success "REDIS_URL (production) configurado"
        else
            print_info "Seria configurado: REDIS_URL (production)"
        fi
    else
        print_warning "REDIS_URL (production) pulado"
    fi

    read -p "Production SECRET_KEY (pressione Enter para gerar automaticamente): " PROD_SECRET_KEY
    if [ -z "$PROD_SECRET_KEY" ]; then
        # Generate Django secret key
        PROD_SECRET_KEY=$(python3 -c "from secrets import token_urlsafe; print(token_urlsafe(50))")
        print_info "SECRET_KEY gerado automaticamente"
    fi
    if [ "$DRY_RUN" = false ]; then
        echo "$PROD_SECRET_KEY" | gh secret set SECRET_KEY --env production --repo "$REPO"
        print_success "SECRET_KEY (production) configurado"
    else
        print_info "Seria configurado: SECRET_KEY (production)"
    fi

    # Set SENTRY_ENVIRONMENT
    if [ "$DRY_RUN" = false ]; then
        echo "production" | gh secret set SENTRY_ENVIRONMENT --env production --repo "$REPO"
        print_success "SENTRY_ENVIRONMENT (production) configurado"
    fi

    print_success "GitHub Secrets configurados!"
}

# =============================================================================
# GitHub Teams Setup
# =============================================================================

setup_github_teams() {
    print_header "Configurando GitHub Teams"

    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN - Nenhuma equipe será criada"
    fi

    # Array of teams to create
    declare -A TEAMS=(
        ["core-team"]="Core engineering team - Full repository access"
        ["backend-team"]="Backend developers - Python, Django, Celery"
        ["frontend-team"]="Frontend developers - Next.js, React, TypeScript"
        ["devops-team"]="DevOps and SRE - CI/CD, Infrastructure, Monitoring"
        ["qa-team"]="Quality Assurance - Testing, Bug tracking"
        ["design-team"]="UI/UX Design - Interface design, User research"
    )

    # Array of team permissions
    declare -A TEAM_PERMISSIONS=(
        ["core-team"]="admin"
        ["backend-team"]="push"
        ["frontend-team"]="push"
        ["devops-team"]="maintain"
        ["qa-team"]="triage"
        ["design-team"]="pull"
    )

    for team in "${!TEAMS[@]}"; do
        echo "Creating team: @$ORG/$team"

        # Check if team exists
        if gh api "orgs/$ORG/teams/$team" &> /dev/null; then
            print_warning "Equipe @$ORG/$team já existe"
        else
            if [ "$DRY_RUN" = false ]; then
                # Create team
                gh api "orgs/$ORG/teams" -X POST \
                    -f name="$team" \
                    -f description="${TEAMS[$team]}" \
                    -f privacy="closed" \
                    &> /dev/null

                print_success "Equipe @$ORG/$team criada"
            else
                print_info "Seria criada: @$ORG/$team"
            fi
        fi

        # Add repository to team with appropriate permissions
        if [ "$DRY_RUN" = false ]; then
            gh api "orgs/$ORG/teams/$team/repos/$REPO" -X PUT \
                -f permission="${TEAM_PERMISSIONS[$team]}" \
                &> /dev/null

            print_success "Permissão '${TEAM_PERMISSIONS[$team]}' atribuída para @$ORG/$team"
        else
            print_info "Seria atribuída permissão '${TEAM_PERMISSIONS[$team]}' para @$ORG/$team"
        fi
    done

    print_success "GitHub Teams configuradas!"
}

# =============================================================================
# Sentry Setup
# =============================================================================

setup_sentry() {
    print_header "Configurando Sentry Projects"

    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN - Nenhum projeto Sentry será criado"
        return
    fi

    print_info "Configuração manual necessária para Sentry"
    print_info "Siga o guia: .github/SENTRY_SETUP.md"
    print_info ""
    print_info "Passos resumidos:"
    echo "  1. Acesse https://sentry.io"
    echo "  2. Crie organização: Adsumtec"
    echo "  3. Crie projeto: ordocai-backend (Django)"
    echo "  4. Crie projeto: ordocai-frontend (Next.js)"
    echo "  5. Obtenha DSN keys de cada projeto"
    echo "  6. Re-execute este script com os DSN keys"

    read -p "Pressione Enter para continuar..."
}

# =============================================================================
# Codecov Setup
# =============================================================================

setup_codecov() {
    print_header "Configurando Codecov"

    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN - Nenhuma configuração Codecov será feita"
        return
    fi

    print_info "Configuração manual necessária para Codecov"
    print_info "Siga o guia: .github/CODECOV_SETUP.md"
    print_info ""
    print_info "Passos resumidos:"
    echo "  1. Acesse https://codecov.io"
    echo "  2. Conecte com GitHub"
    echo "  3. Adicione repositório: Adsumtec/ordoc-ai"
    echo "  4. Obtenha upload token"
    echo "  5. Adicione token aos GitHub Secrets (CODECOV_TOKEN)"

    # Check if .codecov.yml exists
    if [ -f ".codecov.yml" ]; then
        print_success ".codecov.yml já existe"
    else
        print_error ".codecov.yml não encontrado"
        print_info "Este arquivo deveria existir no repositório"
    fi

    read -p "Pressione Enter para continuar..."
}

# =============================================================================
# Verification
# =============================================================================

verify_setup() {
    print_header "Verificando Configuração"

    echo "📋 GitHub Secrets..."
    if gh secret list --repo "$REPO" | grep -q "CODECOV_TOKEN"; then
        print_success "CODECOV_TOKEN configurado"
    else
        print_warning "CODECOV_TOKEN não configurado"
    fi

    if gh secret list --repo "$REPO" | grep -q "SENTRY_DSN_BACKEND"; then
        print_success "SENTRY_DSN_BACKEND configurado"
    else
        print_warning "SENTRY_DSN_BACKEND não configurado"
    fi

    if gh secret list --repo "$REPO" | grep -q "SENTRY_DSN_FRONTEND"; then
        print_success "SENTRY_DSN_FRONTEND configurado"
    else
        print_warning "SENTRY_DSN_FRONTEND não configurado"
    fi

    echo -e "\n👥 GitHub Teams..."
    TEAMS_COUNT=$(gh api "orgs/$ORG/teams" --jq 'length' 2>/dev/null || echo "0")
    print_info "$TEAMS_COUNT equipes encontradas na organização"

    echo -e "\n📄 Arquivos de Configuração..."
    if [ -f ".codecov.yml" ]; then
        print_success ".codecov.yml existe"
    else
        print_warning ".codecov.yml não encontrado"
    fi

    if [ -f ".github/CODEOWNERS" ]; then
        print_success ".github/CODEOWNERS existe"
    else
        print_warning ".github/CODEOWNERS não encontrado"
    fi

    if [ -f ".github/dependabot.yml" ]; then
        print_success ".github/dependabot.yml existe"
    else
        print_warning ".github/dependabot.yml não encontrado"
    fi

    echo ""
}

# =============================================================================
# Main
# =============================================================================

show_help() {
    grep "^#" "$0" | grep -v "^#!/" | sed 's/^# //; s/^#//'
    exit 0
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --secrets-only)
                SETUP_TEAMS=false
                SETUP_SENTRY=false
                SETUP_CODECOV=false
                shift
                ;;
            --teams-only)
                SETUP_SECRETS=false
                SETUP_SENTRY=false
                SETUP_CODECOV=false
                shift
                ;;
            --sentry-only)
                SETUP_SECRETS=false
                SETUP_TEAMS=false
                SETUP_CODECOV=false
                shift
                ;;
            --codecov-only)
                SETUP_SECRETS=false
                SETUP_TEAMS=false
                SETUP_SENTRY=false
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --help)
                show_help
                ;;
            *)
                print_error "Opção desconhecida: $1"
                show_help
                ;;
        esac
    done
}

main() {
    parse_args "$@"

    print_header "🚀 OrdocAI Infrastructure Setup"

    if [ "$DRY_RUN" = true ]; then
        print_warning "MODO DRY RUN - Nenhuma mudança será feita"
    fi

    print_info "Repositório: $REPO"
    print_info "Organização: $ORG"
    echo ""

    check_prerequisites

    if [ "$SETUP_SECRETS" = true ]; then
        setup_github_secrets
    fi

    if [ "$SETUP_TEAMS" = true ]; then
        setup_github_teams
    fi

    if [ "$SETUP_SENTRY" = true ]; then
        setup_sentry
    fi

    if [ "$SETUP_CODECOV" = true ]; then
        setup_codecov
    fi

    verify_setup

    print_header "✅ Setup Concluído!"

    print_info "Próximos passos:"
    echo "  1. Revise os secrets em: https://github.com/$REPO/settings/secrets/actions"
    echo "  2. Revise as equipes em: https://github.com/orgs/$ORG/teams"
    echo "  3. Configure Sentry: .github/SENTRY_SETUP.md"
    echo "  4. Configure Codecov: .github/CODECOV_SETUP.md"
    echo "  5. Teste o CI criando um PR"
    echo ""
    print_success "Infraestrutura configurada com sucesso! 🎉"
}

main "$@"
