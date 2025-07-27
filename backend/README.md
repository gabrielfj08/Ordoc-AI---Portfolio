# Ordoc-AI Backend

Backend Django para a plataforma Ordoc-AI - Sistema de gestão documental e workflow empresarial.

## 🚀 Tecnologias

- **Django 5.2.4** - Framework web
- **Django REST Framework** - API REST
- **PostgreSQL** - Banco de dados principal
- **Celery** - Processamento assíncrono
- **Redis** - Cache e broker do Celery
- **Tesseract** - OCR para extração de texto
- **AWS S3** - Armazenamento de arquivos
- **Apache Solr** - Busca full-text
- **Poetry** - Gerenciamento de dependências

## 📁 Estrutura dos Módulos

- **OrdocAir** - Gestão de documentos e diretórios
- **OrdocFlow** - Workflow e processos empresariais  
- **OrdocCloud** - Configurações e organizações
- **OrdocSign** - Assinatura digital
- **OrdocReports** - Relatórios e analytics

## ⚙️ Configuração

### 1. Instalar dependências
```bash
poetry install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Configurar banco de dados PostgreSQL
```bash
# Criar banco de dados
createdb ordoc_ai

# Executar migrações
poetry run python manage.py migrate
```

### 4. Criar superusuário
```bash
poetry run python manage.py createsuperuser
```

### 5. Executar servidor de desenvolvimento
```bash
poetry run python manage.py runserver
```

### 6. Executar Celery (em terminal separado)
```bash
poetry run celery -A ordoc_ai worker --loglevel=info
```

## 🔧 Funcionalidades Implementadas

### OrdocAir (Gestão Documental)
- ✅ Modelos: Organization, Department, Directory, Document
- ✅ Sistema de versionamento de documentos
- ✅ Links compartilháveis com expiração
- ✅ Rastreamento de documentos recentes
- ✅ State machine para status de processamento
- ✅ Upload de arquivos com validação
- 🔄 OCR automático (em desenvolvimento)
- 🔄 Integração com Solr (em desenvolvimento)

### OrdocFlow (Workflow)
- 🔄 Em desenvolvimento

### OrdocCloud (Configurações)
- 🔄 Em desenvolvimento

### OrdocSign (Assinatura Digital)
- 🔄 Em desenvolvimento

### OrdocReports (Relatórios)
- 🔄 Em desenvolvimento

## 📊 API Endpoints

### Base URL: `/api/v1/`

- **Auth**: `/api/v1/auth/`
- **OrdocAir**: `/api/v1/air/`
- **OrdocFlow**: `/api/v1/flow/`
- **OrdocCloud**: `/api/v1/cloud/`
- **OrdocSign**: `/api/v1/sign/`
- **OrdocReports**: `/api/v1/reports/`

## 🔄 Status da Migração

Este projeto é uma migração do sistema original em Ruby on Rails para Django, mantendo todas as funcionalidades principais:

- ✅ Estrutura base do projeto criada
- ✅ Configurações principais implementadas
- ✅ Modelos principais do OrdocAir criados
- ✅ Sistema de rotas configurado
- ✅ Integração com Celery configurada
- 🔄 Migração dos demais módulos em andamento

## 🛠️ Desenvolvimento

### Executar testes
```bash
poetry run pytest
```

### Formatação de código
```bash
poetry run black .
poetry run isort .
```

### Linting
```bash
poetry run flake8
```

## 📝 Próximos Passos

1. Implementar ViewSets e Serializers para OrdocAir
2. Criar tasks do Celery para processamento OCR
3. Integrar com Apache Solr para busca
4. Migrar modelos dos demais módulos
5. Implementar autenticação JWT
6. Configurar permissões granulares
7. Testes unitários e de integração
