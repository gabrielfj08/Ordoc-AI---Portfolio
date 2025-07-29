# 🚀 Ordoc-AI - Plataforma de Gestão Documental e Workflow Empresarial
[![CI](https://github.com/Adsumtec/ordoc-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Adsumtec/ordoc-ai/actions/workflows/ci.yml)

## 📋 Visão Geral

O **Ordoc-AI** é uma plataforma completa de gestão documental e workflow empresarial que combina tecnologias modernas para oferecer uma solução robusta e escalável para organizações de todos os tamanhos.

## 🏗️ Arquitetura do Projeto

### **Backend (Django)**
- **Framework**: Django 5.2.4 + Django REST Framework
- **Banco de Dados**: PostgreSQL
- **Cache/Broker**: Redis
- **Processamento Assíncrono**: Celery
- **Containerização**: Docker + Docker Compose

### **Frontend (Next.js)**
- **Framework**: Next.js + React + TypeScript
- **Styling**: Tailwind CSS
- **Estado**: React Query + Context API
- **Componentes**: Sistema de design customizado

## 📁 Estrutura do Projeto

```
ordoc-ai/
├── backend/                 # Django REST API
│   ├── ordoc_ai/           # Configurações principais
│   ├── ordoc_air/          # Gestão documental
│   ├── ordoc_flow/         # Workflow empresarial
│   ├── ordoc_cloud/        # Configurações e usuários
│   ├── ordoc_sign/         # Assinatura digital
│   └── ordoc_reports/      # Relatórios e analytics
├── frontend/               # Next.js Frontend
│   └── ordoc-ai-frontend/  # Aplicação React
├── PrinterCloud/          # Backend legado (Rails)
├── docker-compose.yml     # Orquestração de containers
└── nginx/                 # Configuração de proxy
```

> **Nota:** o antigo frontend localizado em `printer-cloud-new/` foi migrado para `frontend/ordoc-ai-frontend`.

## 🔧 Módulos Principais

### **🗂️ OrdocAir - Gestão Documental**
- Upload e organização hierárquica de documentos
- OCR automático para extração de texto
- Sistema de busca avançada com Apache Solr
- Operações em lote (batch operations)
- Links compartilháveis com controle de acesso
- Versionamento de documentos

### **🔄 OrdocFlow - Workflow Empresarial**
- Criação de procedimentos customizáveis
- Sistema de tarefas com FSM (Finite State Machine)
- Templates reutilizáveis de workflow
- Sistema de aprovação multi-etapas
- Campos dinâmicos configuráveis
- Usuários externos com acesso controlado

### **👥 OrdocCloud - Configurações**
- Gestão de organizações multi-tenant
- Controle de usuários e permissões
- Sistema de políticas granulares
- Autenticação JWT robusta
- Middleware de segurança

### **✍️ OrdocSign - Assinatura Digital**
- Certificados digitais A1/A3
- Workflow de assinatura multi-assinantes
- Templates de assinatura configuráveis
- Processamento em lote de documentos
- Auditoria completa de assinaturas

### **📊 OrdocReports - Relatórios e Analytics**
- Templates reutilizáveis de relatórios
- Agendamento automático
- Múltiplos formatos de exportação
- Dashboard de métricas e KPIs
- Compartilhamento seguro

## 🚀 Início Rápido

### **Pré-requisitos**
- Docker e Docker Compose
- Git
 - Node.js 18+ (para desenvolvimento frontend)
- Python 3.12+ (para desenvolvimento backend)

### **1. Clone o Repositório**
```bash
git clone https://github.com/Adsumtec/ordoc-ai.git
cd ordoc-ai
```

### **2. Configuração com Docker**
```bash
# Subir todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```
> **Nota:** o `docker-compose.yml` atual nao inicia o frontend automaticamente.
> Para acessar a interface web, execute em outro terminal:
> ```bash
> cd frontend/ordoc-ai-frontend
> npm install
> npm run dev
> ```
> Isso iniciara http://localhost:3000.

### **3. Acessar a Aplicação**
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000 (execute `npm run dev`)
- **Admin Django**: http://localhost:8000/admin

### **4. Credenciais Padrão**
- **Admin**: admin@ordoc.ai / admin123
- **Usuário Demo**: teste@ordocflow.com / 123456
> **Importante:** essas credenciais existem apenas para **desenvolvimento local**.
> Em ambientes de produção, defina valores seguros por meio de variáveis de
> ambiente. Utilize o arquivo `.env.example` como referência para configurar
> suas próprias credenciais.

## 🛠️ Desenvolvimento

### **Backend (Django)**
```bash
cd backend
poetry install
poetry run python manage.py migrate
poetry run python manage.py runserver
```

### **Frontend (Next.js)**
```bash
cd frontend/ordoc-ai-frontend
npm install
npm run dev
```

## 📚 Documentação

### **APIs REST**
- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

### **Versionamento de API**
- `/api/v1/` - Versão principal
- `/api/v2/` - Compatibilidade
- `/api/v3/` - Versão mais recente

## 🧪 Testes

### **Backend**
```bash
cd backend
poetry run python manage.py test
```

### **Frontend**
```bash
cd frontend/ordoc-ai-frontend
npm run lint
```

### **Scripts de Integração**
```bash
for f in test_*.py; do
    python "$f"
done
```

## 🐳 Docker

### **Serviços Disponíveis**
- **postgres**: Banco de dados PostgreSQL
- **redis**: Cache e broker Celery
- **backend**: API Django
- **celery_worker**: Processamento assíncrono
- **celery_beat**: Tarefas agendadas
- **frontend**: Aplicacao Next.js (execute `npm run dev` em http://localhost:3000)

### **Comandos Úteis**
```bash
# Logs dos serviços
docker-compose logs -f backend

# Executar comandos no container
docker-compose exec backend python manage.py shell

# Rebuild dos containers
docker-compose build --no-cache
```

## 🔐 Segurança

- **Autenticação JWT** com refresh tokens
- **Rate limiting** para APIs
- **Middleware multi-tenant** por subdomínio
- **Validação rigorosa** de senhas
- **Permissões granulares** com django-guardian

### Atualização de Dependências
Para minimizar vulnerabilidades, execute auditorias frequentes nas dependências do projeto:
```bash
pip install pip-audit && pip-audit
npm audit --audit-level=high
```
Mantenha as bibliotecas sempre atualizadas.

## 📈 Performance

- **Cache Redis** para otimização
- **Processamento assíncrono** com Celery
- **Banco PostgreSQL** otimizado
- **CDN** para arquivos estáticos (S3)
- **Indexação Solr** para busca rápida

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🏢 Empresa

**Adsumtec** - Soluções tecnológicas inovadoras para gestão empresarial.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:
- **Email**: suporte@adsumtec.com
- **GitHub Issues**: https://github.com/Adsumtec/ordoc-ai/issues

---

**Desenvolvido com ❤️ pela equipe Adsumtec**
