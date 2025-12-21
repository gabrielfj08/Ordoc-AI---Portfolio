# WARP.md

Este arquivo fornece orientação ao WARP (warp.dev) quando trabalhando com código neste repositório.

## Visão Geral do Projeto

**Ordoc-AI** é uma plataforma completa de gestão documental e workflow empresarial que combina tecnologias modernas para oferecer uma solução robusta e escalável para organizações de todos os tamanhos. A plataforma é construída usando uma arquitetura de microsserviços com backend Django REST API e frontend Next.js.

## Visão Geral da Arquitetura

### **Backend (Django 5.2.4)**
- **Framework**: Django + Django REST Framework  
- **Banco de Dados**: PostgreSQL
- **Cache/Broker**: Redis
- **Motor de Busca**: Apache Solr
- **Processamento Assíncrono**: Celery
- **Containerização**: Docker + Docker Compose

### **Frontend (Next.js 12.1.6)**
- **Framework**: Next.js + React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Query + Context API
- **Componentes UI**: Sistema de design customizado (printer-ui)

### **Módulos Principais**
1. **🗂️ OrdocAir** - Gestão Documental (organização hierárquica, OCR, busca avançada)
2. **🔄 OrdocFlow** - Workflow Empresarial (procedimentos customizáveis, aprovação multi-etapas, FSM)
3. **👥 OrdocCloud** - Configurações e Usuários (organizações multi-tenant, auth JWT, permissões granulares)
4. **✍️ OrdocSign** - Assinaturas Digitais (certificados A1/A3, workflows multi-assinante)
5. **📊 OrdocReports** - Relatórios e Analytics (templates reutilizáveis, agendamento automatizado, KPIs)

## Comandos Comuns de Desenvolvimento

### **Configuração e Instalação**

```bash
# Clonar e configurar o projeto
git clone https://github.com/Adsumtec/ordoc-ai.git
cd ordoc-ai

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Iniciar todos os serviços com Docker
docker-compose up -d

# Verificar status dos serviços
docker-compose ps
```

### **Desenvolvimento Backend (Django)**

```bash
cd backend

# Instalar dependências com Poetry
poetry install

# Executar migrações
poetry run python manage.py migrate

# Criar superusuário
poetry run python manage.py createsuperuser

# Executar servidor de desenvolvimento
poetry run python manage.py runserver

# Executar worker Celery (terminal separado)
poetry run celery -A ordoc_ai worker --loglevel=info

# Executar agendador Celery beat (terminal separado)
poetry run celery -A ordoc_ai beat --loglevel=info
```

### **Desenvolvimento Frontend (Next.js)**

```bash
cd printer-cloud-new

# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev
# Acesso: http://localhost:8080

# Executar testes
npm run test

# Build para produção
npm run build
```

### **Testes**

```bash
# Testes do backend
cd backend
poetry run pytest
poetry run python manage.py test

# Testes de integração (do diretório raiz)
python test/test_ordocflow.py              # Testes básicos da API
python test/test_auth_ordocflow.py         # Testes do fluxo de autenticação
python test/test_ordoc_air_advanced.py     # Testes de gestão documental
python test/test_final_auth.py             # Validação final de autenticação
python test/test_ordoc_reports.py          # Testes do módulo de relatórios

# Executar todos os testes de integração
for f in test/test_*.py; do python "$f"; done
```

### **Qualidade do Código**

```bash
# Backend (Django)
cd backend
poetry run black .               # Formatação de código
poetry run isort .               # Ordenação de imports
poetry run flake8               # Linting

# Frontend (Next.js)
cd printer-cloud-new
npm run lint                    # ESLint
```

### **Operações Docker**

```bash
# Visualizar logs de serviço específico
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# Executar comandos nos containers
docker-compose exec backend python manage.py shell
docker-compose exec postgres psql -U ordoc_user -d ordoc_ai

# Rebuildar containers
docker-compose build --no-cache

# Resetar tudo
docker-compose down -v
docker-compose up -d
```

## Pontos de Acesso aos Serviços

- **API Backend**: http://localhost:8000
- **Aplicação Frontend**: http://localhost:3000 (execute `npm run dev` manualmente)
- **Painel Admin**: http://localhost:8000/admin
- **Documentação da API**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379  
- **Apache Solr**: http://localhost:8983

## Estrutura do Projeto

```
ordoc-ai/
├── backend/                    # Django REST API
│   ├── ordoc_ai/              # Configurações principais e núcleo
│   ├── ordoc_air/             # Módulo de gestão documental
│   ├── ordoc_flow/            # Módulo de gestão de workflow
│   ├── ordoc_cloud/           # Módulo de organizações e usuários
│   ├── ordoc_sign/            # Módulo de assinaturas digitais
│   └── ordoc_reports/         # Módulo de relatórios e analytics
├── printer-cloud-new/         # Aplicação frontend Next.js
├── PrinterCloud/              # Backend legado Rails (descontinuado)
├── test/                      # Scripts de testes de integração
├── docker-compose.yml         # Orquestração de serviços
└── nginx/                     # Configuração de proxy reverso
```

## Versionamento da API

- `/api/v1/` - Versão principal para desenvolvimento atual
- `/api/v2/` - Versão de compatibilidade
- `/api/v3/` - Versão mais recente para novos recursos

### **Principais Endpoints da API**

- **Autenticação**: `/api/auth/`
- **OrdocAir**: `/api/v1/air/` 
- **OrdocFlow**: `/api/v1/flow/`
- **OrdocCloud**: `/api/v1/cloud/`
- **OrdocSign**: `/api/v1/sign/`
- **OrdocReports**: `/api/v1/reports/`

## Diretrizes de Desenvolvimento

### **Ao Adicionar Novos Recursos**

1. **Backend**: Siga a estrutura de apps Django dentro dos respectivos módulos (ordoc_air, ordoc_flow, etc.)
2. **Frontend**: Use a estrutura de componentes existente e React Query para busca de dados
3. **APIs**: Sempre versione novos endpoints apropriadamente
4. **Testes**: Escreva tanto testes unitários quanto testes de integração para nova funcionalidade

### **Migrações do Banco de Dados**

```bash
cd backend
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

### **Adicionando Novas Dependências**

```bash
# Backend
cd backend
poetry add nome_do_pacote

# Frontend  
cd printer-cloud-new
npm install nome_do_pacote
```

### **Configuração de Ambiente**

O sistema requer várias variáveis de ambiente. As principais incluem:

- **Banco de Dados**: `DATABASE_URL` para conexão PostgreSQL
- **Redis**: `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`
- **Solr**: `SOLR_URL`, `SOLR_COLLECTION`, credenciais de autenticação
- **Segurança**: `SECRET_KEY`, `TURNSTILE_SECRET_KEY` (Cloudflare)
- **Autenticação**: configurações JWT, parâmetros de validação de senha
- **AWS**: credenciais S3 para armazenamento de arquivos (se usando storage em nuvem)

### **Fluxo de Autenticação**

O sistema usa autenticação JWT com:
- Suporte multi-tenant via subdomínios
- Tipos de usuário internos e externos
- Rate limiting e middleware de segurança
- Mecanismo de refresh token

### **Processamento de Arquivos**

- **OCR**: Extração automática de texto usando Tesseract
- **Busca**: Busca full-text alimentada por Apache Solr
- **Armazenamento**: Suporta armazenamento local e AWS S3
- **Operações em Lote**: Processamento assíncrono via Celery

## Estratégia de Testes

### **Testes de Integração**

O diretório `/test/` contém testes de integração abrangentes:

- `test_auth_ordocflow.py` - Testes completos do fluxo de autenticação
- `test_ordocflow.py` - Testes de funcionalidade da API OrdocFlow  
- `test_ordoc_air_advanced.py` - Recursos de gestão documental
- `test_final_auth.py` - Validação de autenticação
- `test_ordoc_reports.py` - Funcionalidade de relatórios

### **Credenciais de Teste**

Defina essas variáveis de ambiente para testes:
```bash
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=adminpass
export DEMO_USER_EMAIL=demo@example.com
export DEMO_USER_PASSWORD=demopass
export TEST_AUTH_TOKEN=seu_jwt_token
export TEST_PASSWORD=changeme123
```

### **Executando Testes**

- Use Poetry para testes do backend: `poetry run pytest`
- Use npm para testes do frontend: `npm run test`
- Testes de integração validam o fluxo completo da API com autenticação real

## Considerações de Segurança

- **Autenticação JWT** com refresh tokens
- **Rate limiting** para endpoints da API
- **Middleware multi-tenant** com isolamento por subdomínio
- **Permissões granulares** usando django-guardian
- **Validação de senha** com validadores customizados
- **Proteção CSRF** e configuração CORS

## Recursos de Performance

- **Cache Redis** para otimização
- **Processamento assíncrono Celery** para tarefas longas
- **Otimização PostgreSQL** com indexação adequada
- **Suporte CDN** para arquivos estáticos (S3)
- **Indexação Solr** para busca rápida de documentos
- **Containerização Docker** para deploy escalável

## Status da Migração

Este projeto representa uma migração do Ruby on Rails para Django mantendo toda a funcionalidade principal:

- ✅ Estrutura base do projeto criada
- ✅ Configuração principal do Django implementada  
- ✅ Modelos OrdocAir e funcionalidade básica
- ✅ Sistema de autenticação com JWT
- ✅ Setup de processamento assíncrono Celery
- ✅ Containerização Docker completa
- 🔄 Migração completa dos módulos em andamento
