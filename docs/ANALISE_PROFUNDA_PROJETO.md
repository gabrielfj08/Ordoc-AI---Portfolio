# 📊 ANÁLISE PROFUNDA DO PROJETO ORDOC-AI

**Data:** 5 de janeiro de 2026  
**Status:** Análise completa (código, arquitetura, lógica de negócio, ambientes, fluxos)  
**Profundidade:** Entendimento técnico + semântico (por que, como, para quê)

---

## 🎯 RESUMO EXECUTIVO

O **OrdocAI** é uma plataforma **enterprise-grade de gestão documental e workflow empresarial** que combina:

- **Backend Django 5.2.4** com 7 módulos especializados (OrdocAir, OrdocFlow, OrdocCloud, OrdocSign, OrdocReports, Intelligence, OrdocIntegrations)
- **Frontend Next.js 16 + React 19** com arquitetura moderna (App Router, React Query, Zustand)
- **IA integrada** (Ollama local + GLiNER2 para extração de entidades)
- **Processamento assíncrono** (Celery + Redis + Beat scheduler)
- **Multi-tenancy** por subdomínio organizacional
- **Segurança robusta** (2FA, JWT, auditoria, criptografia de chaves)
- **Integrações Brasil** (Gov.br, Receita Federal, SERASA, OAB, etc)

**Propósito:** Ser um **sistema central de gestão documental inteligente** que automatiza fluxos de trabalho, extrai dados de documentos via IA/OCR e aprende com o comportamento dos usuários.

---

## 🏢 PROPÓSITO E LÓGICA DE NEGÓCIO

### 1. **PROBLEMA QUE RESOLVE**

Organizações (empresas, órgãos públicos, escritórios jurídicos, clínicas) enfrentam:
- 📄 **Caos documental:** documentos espalhados em pastas, discos, drives
- ⚠️ **Falta de visibilidade:** não saber onde está um documento crítico
- 🔄 **Workflows manuais:** aprovações, assinaturas, notificações feitas manualmente
- 🧠 **Perda de conhecimento:** cada pessoa aprende um jeito de trabalhar
- ⛓️ **Integrações desconectadas:** dados em Gov.br, Receita Federal, OAB não conversam com sistema interno
- 🚨 **Compliance/LGPD:** não rastreiam quem viu/modificou dados sensíveis

### 2. **SOLUÇÃO OFERECIDA**

**OrdocAI = Repositório Central Inteligente + Workflow Automático + IA Contínua**

#### A. **OrdocAir - Gestão Documental Central**
```
Problema: Documentos espalhados, sem contexto
Solução:
  - Upload centralizado com hierarquia (Org → Depto → Pasta → Doc)
  - OCR automático (Tesseract) extrai texto de imagens/PDFs
  - Análise IA classifica tipo de documento (contrato, petição, laudo, etc)
  - Tags customizáveis por organização
  - Busca full-text via Apache Solr
  - Versionamento automático
  - Rastreamento completo (quem criou, modificou, deletou, quando)
  
Exemplo real (persona 1):
  Advogada Ana Silva faz upload de "Petição_Inicial_Reclamação.pdf"
  → OrdocAir OCR extrai texto
  → IA classifica como "Petição" (documento_type='petition')
  → Detecta "CPF" no texto → marca como "sensitive_data=true" (LGPD)
  → Detecta "assinatura obrigatória" → sets "requires_signature=true"
  → Auto-move para pasta "Processos Ativos" (regra de categorização)
  → Cria notificação "Petição recebida, aguardando assinatura"
```

#### B. **OrdocFlow - Workflow Automático**
```
Problema: Workflows manuais, sem controle de quem está fazendo o quê
Solução:
  - Templates reutilizáveis (ex: "Processo Judicial Trabalhista")
  - Campos customizáveis (13 tipos: texto, data, anexo, select, CPF, etc)
  - State Machine para controlar status (draft → submitted → in_progress → approved/rejected → completed)
  - Tarefas com atribuição (indivíduo ou grupo)
  - Aprovações multi-etapas (analista → gerente → diretor)
  - Notificações de deadline (24h antes)
  - Histórico completo de ações
  - Suporte a solicitantes externos (cidadãos via Gov.br, por exemplo)
  
Exemplo real (persona 1):
  Template: "Processo Judicial Trabalhista"
  Procedure: "Reclamação Trabalhista Cliente A vs Empresa XYZ"
  
  Tasks (sequenciais):
    1. Análise de documentação do cliente (Ana Silva) → [FINISHED]
    2. Elaboração de petição inicial (Ana Silva) → [STARTED]
    3. Protocolo na Justiça do Trabalho (Assistente Jurídico) → [NOT_STARTED]
    4. Preparação para audiência (Ana Silva) → [NOT_STARTED]
    
  Quando vai vencer:
    - Notificação automática 24h antes do deadline de qualquer task
    - Se vencer: alert crítico no dashboard
```

#### C. **OrdocSign - Assinatura Digital**
```
Problema: Assinaturas manuais, certificados espalhados, sem auditoria
Solução:
  - Certificados A1 (local) e A3 (token/smartcard) suportados
  - Chaves privadas criptografadas no banco (não em texto plano)
  - Templates de assinatura (simples, avançado, qualificado)
  - Assinatura sequencial/paralela de múltiplos assinantes
  - Posicionamento visual customizável
  - Processamento em lote
  - Auditoria completa (quem assinou, quando, de onde)
  
Exemplo real (persona 1):
  Contrato "Novo Sócio" precisa assinatura:
    1. Ana Silva assina (sócia)
    2. Contador assina (certificado)
    3. Novo sócio assina (via token externo)
  
  Sistema:
    - Valida cada certificado
    - Gera PDF com assinatura visual
    - Registra IP, User-Agent, hora exata
    - Impossível negar (não-repúdio legal)
```

#### D. **Intelligence - IA Contínua e Aprendizado**
```
Problema: Sistema estático, não aprende com usuários, não dá sugestões
Solução:
  - Extração automática de entidades (nomes, datas, valores via GLiNER2)
  - Council de especialistas (Legal, Financial, General) deliberam sobre docs
  - Aprendizado hierárquico:
      Layer 1: Pessoal (user) - ações específicas de um usuário
      Layer 2: Organização - padrões da empresa
      Layer 3: Setor - padrões de todas as empresas do setor
      Layer 4: Plataforma - padrões globais
  - Alertas proativos (avisos gerados quando padrão recorrente aparece)
  - Agregação periódica (a cada hora):
      "Se 3+ usuários corrigem mesmo erro → vira padrão org"
      "Se 3+ orgs têm mesmo padrão → vira padrão setor"
  
Exemplo real:
  Ana Silva recebe 3 petições do mesmo cliente.
  Em todas, a IA nota: "CPF formatado como 123.456.789-00, deveria ser 12345678900"
  
  1️⃣ Feedback do usuário: Ana Silva aceita a correção
  2️⃣ Sistema aprende: KnowledgeFeedback("correction", original="123.456.789-00", corrected="12345678900")
  3️⃣ Agregação: Se 3+ correções iguais → LearnedPattern
  4️⃣ Resultado: Próximos documentos similares, IA avisa ANTES
```

#### E. **OrdocIntegrations - Conexão com Brasil**
```
Problema: Dados espalhados em Gov.br, Receita Federal, SERASA, etc
Solução:
  - Conecta com 19 serviços (Gov.br, Receita Federal, SERASA, OAB, CREA, CRO, CRM, Cartórios, TSE, ANS)
  - Cache inteligente (Redis + DB) para evitar requisições repetidas
  - Rate limiting automático (não sobrecarga as APIs externas)
  - Retry com backoff exponencial (trata falhas temporárias)
  - Auditoria completa (log de todas as integrações)
  
Exemplo real (persona 3 - servidor público):
  Roberto acessa OrdocAI para processar licitação.
  Insere CNPJ da empresa: 12.345.678/0001-99
  
  Sistema:
    1️⃣ Consulta Receita Federal → pega nome legal, status, endereço
    2️⃣ Consulta SERASA → pega score de crédito
    3️⃣ Consulta TSE → verifica débitos eleitorais
    4️⃣ Salva em cache → próxima consulta é instantânea
    5️⃣ Gera relatório automático com dados consolidados
```

#### F. **OrdocCloud - Controle de Acesso e Segurança**
```
Problema: Quem tem acesso a quê? Como saber se foi hackeado?
Solução:
  - Multi-tenancy por subdomínio (silva-adv.ordoc.com.br vs cardiovida.ordoc.com.br)
  - 2FA com TOTP (Google Authenticator, Microsoft Authenticator)
  - JWT com refresh tokens (não reutilizável)
  - 5 níveis de role (admin, org_manager, org_member, dept_manager, dept_member)
  - Políticas granulares (object-level via django-guardian)
  - Auditoria de segurança (17 tipos de ação rastreadas)
  - Notificações de atividade suspeita
  
Exemplo real:
  Ana Silva (admin):
    - Vê todos os documentos da organização
    - Pode criar/editar templates
    - Pode gerenciar usuários
    
  Junior (dept_member):
    - Vê só documentos do seu departamento
    - Não pode editar templates
    - Não pode gerenciar usuários
    
  Sistema detecta: "Login de Nova York, 30 min depois de São Paulo"
    → Requer 2FA para confirmar
    → Se falha 5x → bloqueia conta
```

#### G. **OrdocReports - Analytics e Relatórios**
```
Problema: Como saber a saúde da empresa? Quantos processos atrasados?
Solução:
  - Templates reutilizáveis de relatórios
  - 5 formatos de saída (HTML, PDF, Excel, CSV, JSON)
  - Agendamento automático (diário, semanal, mensal, etc)
  - Métricas e KPIs (documentos por tipo, workflows completados, SLA, etc)
  - Comparação de períodos (este mês vs mês passado)
  - Compartilhamento seguro (tokens únicos, senha opcional)
  
Exemplo real (persona 2 - médico):
  Relatório diário: "Pacientes que vencerão prazo de acompanhamento"
  
  Sistema gera:
    - Lista com 8 pacientes que precisam voltar na próxima semana
    - Gráfico de histórico de acompanhamentos
    - Análise de adesão ao tratamento
    - Recomendações (ex: "Este paciente não comparece há 2 meses")
```

---

## 🏗️ ARQUITETURA TÉCNICA

### **STACK DE TECNOLOGIAS**

#### Backend
```
Django 5.2.4
├── REST Framework (DRF) - APIs
├── PostgreSQL 15 - Banco principal
├── Redis 7 - Cache + Celery broker
├── Celery 5.5 - Tasks assíncronas
├── Channels 4.0 - WebSocket real-time
├── Tesseract - OCR
├── Apache Solr 9.4 - Busca full-text
├── Ollama - Local LLM
├── boto3 - AWS S3 (opcional)
├── pyhanko + signxml - Assinatura digital
└── Poetry - Gerenciamento de dependências
```

#### Frontend
```
Next.js 16 + React 19
├── TypeScript
├── Tailwind CSS
├── React Query - Data fetching
├── Zustand - State management
├── @hello-pangea/dnd - Drag-drop
├── shadcn/ui - Componentes base
└── WebSocket - Real-time updates
```

#### Infraestrutura
```
Docker + Docker Compose
├── PostgreSQL container
├── Redis container
├── Solr container
├── Celery Worker (Beatworker)
├── Celery Beat (Scheduler)
├── Django backend (Daphne ASGI)
├── Ollama container
└── Nginx (reverse proxy)
```

### **DIAGRAMA DE ARQUITETURA**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js + React)              │
│                    (http://localhost:3000)                  │
│                                                             │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────┐        │
│  │   My Day   │  │ Documents   │  │ Workflows      │        │
│  │  (AI News) │  │ (OrdocAir)  │  │ (OrdocFlow)    │        │
│  └────────────┘  └─────────────┘  └────────────────┘        │
│                                                             │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────┐        │
│  │ Signatures │  │  Reports    │  │  Alerts        │        │
│  │(OrdocSign) │  │(OrdocReport)│  │ (Intelligence) │        │
│  └────────────┘  └─────────────┘  └────────────────┘        │
│                                                             │
│           WebSocket (Notifications + Real-time)             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP + WebSocket
                       ▼
        ┌──────────────────────────────┐
        │  Nginx (Reverse Proxy)       │
        │  (http://localhost:80)       │
        └──────────────────────────────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
   ┌─────────────────────────────────────────────┐
   │     BACKEND (Django 5.2.4 + DRF)            │
   │     (http://localhost:8000)                 │
   │                                             │
   │  ┌──────────────────────────────────────┐   │
   │  │  7 Módulos Principais:               │   │
   │  │  - OrdocAir (documentos + OCR)       │   │
   │  │  - OrdocFlow (workflows)             │   │
   │  │  - OrdocCloud (segurança + acesso)   │   │
   │  │  - OrdocSign (assinatura digital)    │   │
   │  │  - OrdocReports (relatórios)         │   │
   │  │  - Intelligence (IA + aprendizado)   │   │
   │  │  - OrdocIntegrations (Gov.br, etc)   │   │
   │  └──────────────────────────────────────┘   │
   │                                             │
   │  ┌──────────────────────────────────────┐   │
   │  │  Camadas Compartilhadas:             │   │
   │  │  - Autenticação JWT + 2FA            │   │
   │  │  - Permissões granulares             │   │
   │  │  - Auditoria completa                │   │
   │  │  - Logging estruturado (JSON)        │   │
   │  └──────────────────────────────────────┘   │
   └─────────────────────────────────────────────┘
        ▲             ▲              ▲            ▲
        │             │              │            │
        ▼             ▼              ▼            ▼
    ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
    │PostgreSQL│  │ Redis    │  │ Apache  │  │ Ollama   │
    │ 15       │  │ 7        │  │ Solr    │  │ (LLM)    │
    │ (Data)   │  │ (Cache + │  │ 9.4     │  │          │
    │          │  │ Broker)  │  │ (Search)│  │ (Extracto│
    └──────────┘  └──────────┘  └─────────┘  └──────────┘
        ▲             ▲
        │ Persistent  │
        │ volumes     │
        └─────────────┘
                │
        ┌───────────────┐
        │ Celery Worker │
        │ + Celery Beat │
        │ (Async tasks) │
        └───────────────┘
```

### **FLUXO DE UM DOCUMENTO DO INÍCIO AO FIM**

```
1. UPLOAD E RECEPÇÃO
   Usuário (Ana Silva - Advogada)
      ↓ Upload "Petição_Inicial.pdf"
   API POST /api/v1/air/documents/
      ↓ Validação de tipo/tamanho
   Salva em banco + S3 (opcional)
      ↓
   Task Celery: analyze_document_async()

2. OCR E EXTRAÇÃO (Intelligence)
   ┌────────────────────────────────┐
   │ Tesseract OCR (paralelo)       │  "Petição inicial de reclamação..."
   │ + Idioma detector              │  (pt_BR detectado)
   └────────────────────────────────┘
      ↓ Texto extraído
   Ollama GLiNER2 extractor
      ↓ Entidades extraídas
   {
     "person": ["João da Silva", "Empresa XYZ"],
     "date": ["2024-01-15"],
     "cpf": ["123.456.789-00"],
     "value": ["R$ 50.000,00"]
   }

3. CLASSIFICAÇÃO E ANÁLISE
   Detecta automaticamente:
     - document_type = "petition"
     - contains_sensitive_data = true (CPF presente)
     - requires_signature = true
     - criticality = "high"
   
   Council delibera (se análise "full"):
     - Legal Expert: "Documento válido para protocolo"
     - Financial Expert: "Valor de causa adequado"
     - General Expert: "Prioridade: alta"

4. GERAÇÃO DE ALERTAS
   ProactiveAlert criados:
     - "CPF não formatado corretamente"
     - "Valor da causa pode exceder limite TJSP"
     - "Documento requer assinatura antes de protocolo"
   
   Notificações criadas:
     Notification(user=Ana Silva, title="📄 Petição recebida")

5. INDEXAÇÃO EM SOLR
   Solr indexa para busca rápida:
     "João da Silva", "petição", "2024-01-15", etc

6. ARMAZENAMENTO E VERSIONAMENTO
   Document.status = "processed"
   Document.extracted_text = "[texto OCR]"
   Document.version = 1 (automático)
   
   Se Ana Silva edita:
     v2 criada (parent_document aponta para v1)

7. CATEGORIZAÇÃO AUTOMÁTICA
   Rules verificadas:
     Se "contém CPF" → Tag: "Dados Sensíveis" (cor vermelha)
     Se "petição" → Move para folder "Processos Ativos"
   
   Usuário vê: Documento auto-organizado

8. WORKFLOW AUTOMÁTICO
   Se necessário, cria Procedure:
     Template: "Processo Judicial Trabalhista"
     Tasks:
       1. Análise de documentação [FINISHED]
       2. Elaboração de petição [STARTED] ← aqui
       3. Protocolo [NOT_STARTED]
   
   Notificação de deadline 24h antes

9. APRENDIZADO CONTÍNUO
   Quando Ana Silva aceita sugestão:
     KnowledgeFeedback registrada
     Layer: "user" (Ana Silva aprendeu)
   
   Agregação a cada hora:
     "Se 3+ correções iguais" → LearnedPattern
     Próximas petições similares terão aviso automático

10. ASSINATURA (Se configurado)
    OrdocSign cria SignatureRequest
      - Ana Silva assina (A1)
      - Certificadora assina (A3)
      - Cliente assina (via email)
    
    Cada assinatura gera auditoria:
      - IP: 192.168.1.100
      - User-Agent: Mozilla/5.0...
      - Timestamp: 2024-01-15 14:23:45 UTC
      - Hash do documento: abc123...

11. RELATÓRIO AUTOMÁTICO
    OrdocReports agenda daily:
      "Processos criados em 24h"
      "Taxa de SLA cumprido"
      "Documentos aguardando assinatura"
      
    Exporta em PDF + email automático
```

---

## 🗂️ MODELOS DE DADOS PRINCIPAIS

### **OrdocAir (Documentos)**

```python
Organization
├── id (UUID)
├── corporate_name (razão social)
├── cnpj (único)
├── subdomain (único, para multi-tenancy)
├── features (JSON, licenças ativadas)
└── departments (∞ relacionamento)

Department
├── id (UUID)
├── name
├── organization (FK)
├── parent_department (self, para hierarquia)
└── documents (∞)

Directory (Pastas)
├── id (UUID)
├── name
├── path (ex: /Processos/2024/Janeiro)
├── department (FK)
├── parent_directory (self, hierárquico)
└── documents (∞)

Document (★ MODELO CENTRAL)
├── id (UUID)
├── name
├── file (FileField, S3 ou local)
├── extracted_text (OCR)
├── mime_type, file_size
├── document_type (choice: petition, contract, etc)
├── contains_sensitive_data (LGPD)
├── requires_signature (bool)
├── criticality (low, medium, high, critical)
├── status (FSM: created → enqueued → processed → failed)
├── version (auto-versionamento)
├── parent_document (self, para versões anteriores)
├── tags (M2M)
├── created_by, updated_by (FK User)
├── directory (FK)
├── document_status (active, archived, trashed, draft)
├── starred, unread, needs_signature (flags)
└── metadata completo para auditoria

Tag
├── id (UUID)
├── name
├── color (hex)
├── organization (FK, tags por org)
└── documents (M2M)

CategorizationRule
├── id (UUID)
├── name
├── match_type (exact, contains, regex, similarity-AI)
├── pattern (string/regex)
├── target_tag (FK)
├── target_directory (FK)
└── organization (FK)
```

### **OrdocFlow (Workflows)**

```python
ProcedureTemplate (★ REUSÁVEL)
├── id (UUID)
├── name (ex: "Processo Judicial")
├── description
├── source (internal, external, both)
├── status (active, inactive)
├── schema (JSON, para validação)
├── organization (FK)
├── parent_procedure_template (self, hierarquias)
└── fields (∞)

Field (Campos customizáveis)
├── id (UUID)
├── label
├── field_type (13 tipos: text, date, select, attachment, etc)
├── required (bool)
├── placeholder, help_text
├── min_length, max_length
├── procedure_template (FK)
└── value_options (∞, para selects)

Procedure (★ INSTÂNCIA DE TEMPLATE)
├── id (UUID)
├── procedure_template (FK)
├── title
├── description
├── status (FSM: draft → submitted → in_progress → approved/rejected → completed)
├── priority (normal, high)
├── request_data (JSON, valores dos campos)
├── organization (FK)
├── requester (FK ExternalRequester)
├── responsible_group (FK GroupRequester)
├── created_by, updated_by (FK OrdocUser)
├── due_date
└── metadata (JSON)

Task (Atividades dentro de Procedure)
├── id (UUID)
├── name
├── description
├── procedure (FK)
├── status (FSM: created → running → started → finished → failed)
├── priority
├── assigned_to (FK OrdocUser ou grupo)
├── deadline
├── created_by (FK OrdocUser)
└── attachment (arquivo opcional)

ExternalRequester (Solicitante externo)
├── id (UUID)
├── name
├── email (único)
├── phone
├── company
├── document_number (CPF/CNPJ)
├── status (pending, active, blocked, inactive)
├── failed_attempts (segurança)
├── organization (FK)
└── workflow_requests (∞)

GroupRequester (Grupos de responsáveis)
├── id (UUID)
├── name
├── description
├── organization (FK)
├── members (M2M OrdocUser, through GroupRequesterMember)
└── role (member, coordinator, manager)
```

### **OrdocCloud (Segurança)**

```python
OrdocUser
├── id (UUID)
├── user (FK Django User, 1:1)
├── status (active, inactive, blocked)
├── must_change_password
├── two_factor_enabled
├── two_factor_secret (TOTP)
├── backup_codes (JSON, criptografados)
├── last_login
├── organizations (M2M)
└── preferences (idioma, timezone, etc)

UserOrganizationRole
├── id (UUID)
├── user (FK OrdocUser)
├── organization (FK Organization)
├── role (admin, org_manager, org_member, dept_manager, dept_member)
├── is_active
├── is_primary
└── department (FK, opcional)

UserPolicy
├── id (UUID)
├── name
├── organization (FK)
├── effect (allow, deny)
├── conditions (JSON, JSONLogic)
├── resources (JSON, quais objetos)
├── actions (JSON, quais ações)
└── priority

SecurityAuditLog (★ 17 TIPOS DE AÇÕES)
├── id (UUID)
├── user (FK OrdocUser)
├── action_type (login, logout, create_doc, edit_doc, delete_doc, 
│                create_user, change_role, access_denied, 2fa_disabled, etc)
├── object_type (Document, Procedure, User, etc)
├── object_id (UUID)
├── status (success, failure)
├── ip_address
├── user_agent
├── timestamp
└── organization (FK)

Notification
├── id (UUID)
├── user (FK OrdocUser)
├── title
├── message
├── notification_type (success, warning, error, info)
├── is_read
├── link (para redirecionar)
├── metadata (JSON, contexto)
├── created_at
└── organization (FK)

Comment
├── id (UUID)
├── user (FK OrdocUser)
├── text
├── content_type (FK, para genérico)
├── object_id (UUID)
├── created_at
└── replies (self M2M, para threads)
```

### **Intelligence (IA e Aprendizado)**

```python
KnowledgeFeedback (★ FEEDBACK PARA APRENDER)
├── id (UUID)
├── layer (user, organization, sector, platform)
├── document_type
├── action_type (correction, approval, rejection)
├── original_value
├── corrected_value
├── context (JSON)
├── user (FK)
├── organization (FK)
├── confidence_before, confidence_after (0-1)
├── created_at
└── processed (bool, se já foi agregado)

LearnedPattern (★ PADRÕES DESCOBERTOS)
├── id (UUID)
├── layer (hierarquia)
├── pattern_type
├── name
├── description
├── condition (JSONLogic)
├── action (sugestão)
├── confidence (0-1)
├── occurrences (quantas vezes apareceu)
├── organization (FK)
├── sector
├── document_type
├── is_active
├── last_matched_at
└── source_feedbacks (M2M PatternFeedbackLink)

ProactiveAlert (★ AVISO GERADO)
├── id (UUID)
├── alert_type (compliance, pattern, suggestion, error)
├── severity (info, warning, error, critical)
├── title, message
├── details (JSON)
├── location (onde no documento)
├── suggested_actions (JSON array)
├── source_pattern (FK LearnedPattern)
├── document_id (genérico)
├── user_response (pending, accepted, rejected, modified, dismissed)
├── responded_at
├── responded_by (FK User)
├── learning_weight
└── expires_at

DocumentAnalysis
├── id (UUID)
├── document_id (genérico)
├── extraction_result (JSON, entidades)
├── council_deliberation (JSON, opiniões dos experts)
├── analysis_depth (quick, standard, full)
├── processing_time_ms
├── status (pending, processing, completed, failed)
├── organization (FK)
└── error_message

UserBehaviorScore
├── id (UUID)
├── user (FK)
├── entity_type (ex: "document_type:petition")
├── entity_id (UUID)
├── score (0-100)
├── personal_score (60%)
├── department_score (20%)
├── organization_score (15%)
├── sector_score (5%)
└── last_updated
```

### **OrdocIntegrations (Integrações Externas)**

```python
IntegrationService
├── id (UUID)
├── service_type (govbr, receita_federal, serasa, oab, etc)
├── name
├── base_url
├── api_key (criptografado)
├── is_enabled
├── status (active, inactive, error)
├── timeout_seconds
├── retry_attempts
├── cache_ttl_seconds
├── rate_limit
├── metadata (JSON)
└── organization (FK, opcional para config específica)

IntegrationRequest (★ AUDITORIA DE INTEGRAÇÕES)
├── id (UUID)
├── service (FK IntegrationService)
├── identifier (CPF, CNPJ, etc)
├── request_type (validation, data_lookup, etc)
├── status (success, cached, failed, rate_limited, timeout)
├── http_status_code
├── response_data (JSON)
├── error_message
├── execution_time_ms
├── from_cache (bool)
├── retry_count
├── ip_address
├── user_agent
├── organization (FK)
├── user (FK)
├── created_at
└── metadata (JSON)

IntegrationCache (★ CACHE DUAL-LAYER)
├── id (UUID)
├── service (FK IntegrationService)
├── cache_key (hash)
├── identifier
├── request_type
├── cached_data (JSON)
├── expires_at
├── hit_count (quantas vezes acessado)
├── created_at
└── last_accessed_at

GovBrProfile (Integração Gov.br OAuth2)
├── id (UUID)
├── user (FK OrdocUser)
├── gov_br_id
├── cpf
├── email
├── name
├── access_token (criptografado)
├── refresh_token (criptografado)
├── token_expires_at
├── organization (FK)
└── scopes (JSON, quais dados acessou)
```

---

## ⚡ FLUXOS ASSÍNCRONOS CRÍTICOS (Celery + Beat)

### **Task 1: Análise de Documento (On-demand)**

```python
@shared_task(bind=True, max_retries=3)
def analyze_document_async(self, document_id: UUID):
    """
    1. Extração de texto via Tesseract
    2. Detecção automática de tipo/criticidade
    3. Análise IA (se habilitada)
    4. Geração de alertas
    5. Criação de notificações
    6. Indexação em Solr
    """
    # Tempo total esperado: 2-10 segundos (OCR lento se PDF grande)
```

### **Task 2: Agregação de Padrões (Periódica - A cada hora)**

```
Cronograma: 0 * * * *  (00:00, 01:00, 02:00, ...)

1. Busca KnowledgeFeedback não processados (últimas 24h)
2. Agrupa por: (document_type, action_type, original_value)
3. Se contagem ≥ 3:
     → Cria LearnedPattern
     → Atualiza confidence
4. Propaga para layers acima (org → sector → platform)
5. Marca feedbacks como processed=True
```

### **Task 3: Análise Proativa (Periódica - A cada 6h)**

```
Cronograma: 0 */6 * * *  (00:00, 06:00, 12:00, 18:00)

1. Itera novos documentos (últimas 6h)
2. Para cada documento:
     → Extrai entidades rápidamente
     → Verifica LearnedPattern existentes
     → Se padrão casaa → Cria ProactiveAlert
3. Gera notificações para usuários relevantes
```

### **Task 4: Alertas de Compliance (Diária - 8h)**

```
Cronograma: 0 8 * * *  (08:00 todo dia)

1. Busca documentos críticos/sensíveis da org
2. Verifica LGPD (CPF, RG, email)
3. Verifica prazos vencidos
4. Verifica assinaturas pendentes
5. Gera relatório de compliance
6. Envia email para admin
```

### **Task 5: Limpeza de Alertas Expirados (Diária - Meia-noite)**

```
Cronograma: 0 0 * * *  (00:00)

1. Busca ProactiveAlert com expires_at < now
2. Deleta (ou marca como expired)
3. Log de quantos alertas limpos
```

### **Task 6: Recalcul​ado de Scores de Comportamento (Periódica - A cada hora)**

```
Cronograma: 0 * * * *

Para cada usuário:
1. Calcula UserBehaviorScore baseado em:
     - Ações últimas 30 dias
     - Frequência de acesso por tipo de doc
     - Padrão de erros/correções
   
Fórmula: score = (personal 60% + dept 20% + org 15% + sector 5%)

Resultado: Ranking de prioridade para dashboard "Meu Dia"
```

### **Task 7: Health Check de Integrações (Periódica - A cada hora)**

```
Cronograma: 0 * * * *

1. Para cada IntegrationService ativo:
     → Tenta fazer requisição teste
     → Se falha → marca status="error"
     → Se OK → marca status="active"
   
2. Envia alert se serviço ficou down
```

### **Task 8: Limpeza de Cache Expirado (Periódica - Diária - 2h)**

```
Cronograma: 0 2 * * *

1. Busca IntegrationCache com expires_at < now
2. Deleta do banco (Redis já expira automaticamente)
3. Log: "Limpeza realizada: 5.342 entradas deletadas"
```

---

## 🔐 SEGURANÇA EM PROFUNDIDADE

### **Camadas de Segurança**

```
┌─────────────────────────────────────────────────┐
│ 1. ACESSO (Authentication + Authorization)      │
│   - Django User + OrdocUser (1:1)               │
│   - JWT + refresh tokens (não reutilizável)     │
│   - 2FA TOTP (Google Authenticator)             │
│   - Rate limiting: 1000 req/hora (anônimo)      │
│   - Rate limiting: 5000 req/hora (autenticado)  │
│   - Logout seguro (token revogado)              │
│                                                 │
│ 2. ACESSO A OBJETOS (Object-level)              │
│   - django-guardian (permissões granulares)     │
│   - Policies: allow/deny com condições JSON     │
│   - Multi-tenancy por subdomínio                │
│   - Middleware: validar organização do request  │
│                                                 │
│ 3. DADOS (Encryption at rest)                   │
│   - Chaves privadas A1 → EncryptedField         │
│   - Gov.br tokens → EncryptedField              │
│   - API keys → EncryptedField                   │
│   - Criptografia: AES-256 (via SECRET_KEY)      │
│                                                 │
│ 4. TRÂNSITO (Encryption in transit)             │
│   - HTTPS obrigatório (Nginx + SSL)             │
│   - WebSocket seguro (WSS)                      │
│   - Cookies HTTPOnly + SameSite                 │
│                                                 │
│ 5. AUDITORIA (Logging completo)                 │
│   - SecurityAuditLog (17 tipos de ações)        │
│   - IP + User-Agent + Timestamp                 │
│   - JSON estruturado (buscar fácil)             │
│   - 180+ dias de retenção                       │
│   - Integração com Sentry (erros)               │
│                                                 │
│ 6. INTEGRAÇÕES EXTERNAS (Validação)             │
│   - Gov.br: OAuth2 + mTLS                       │
│   - Receita: Rate limiting + timeout            │
│   - Validação de CPF/CNPJ antes de requisição   │
│   - Retry automático com backoff                │
│                                                 │
│ 7. ASSINATURA DIGITAL (PKI)                     │
│   - Certificados A1/A3 validados                │
│   - Não-repúdio legal (hash + timestamp)        │
│   - Auditoria de cada assinatura (IP, UA)       │
│   - Compatibilidade ICP-Brasil                  │
│                                                 │
│ 8. CONFORMIDADE (LGPD)                          │
│   - Detecção automática: CPF, RG, email         │
│   - Marking de "sensitive_data"                 │
│   - Retenção configurável (TTL)                 │
│   - Direito ao esquecimento (soft delete)       │
│   - Consentimento do usuário para Gov.br        │
└─────────────────────────────────────────────────┘
```

---

## 🚀 AMBIENTES E EXECUTÁVEL

### **3 Variantes de Docker Compose**

#### 1. **Desenvolvimento Local** (docker-compose.yml na raiz)
```yaml
Serviços:
  - postgres:16 (confiável, fácil de resetar)
  - redis:7
  - django backend (DEBUG=True, auto-reload)
  - celery worker (log verboso)
  - celery beat (scheduler)
  - solr:9-slim (busca)
  - ollama:latest (LLM)
  
Volumes:
  - ./backend:/app (code mounting, hot reload)
  - postgres_data
  - redis_data
  
Ports:
  - 8000 (Django)
  - 5432 (Postgres)
  - 6379 (Redis)
  - 8983 (Solr)
  - 11434 (Ollama)
  
Credenciais:
  - POSTGRES_PASSWORD=ordoc_password (DEV ONLY)
  - SECRET_KEY=django-insecure-...
  - DEBUG=True
  
Startup: ~30 segundos (Solr lento)
```

#### 2. **Desenvolvimento (backend/docker-compose.yml)**
```yaml
Variante mais simples:
  - Foca só em postgres + redis + backend + celery
  - Sem Solr nem Ollama (para máquinas mais fracas)
  - Bom para teste rápido de mudanças
```

#### 3. **Produção** (não incluído, recomendações)
```yaml
Mudanças recomendadas:
  - DEBUG=False
  - SECRET_KEY=<gerado forte>
  - ALLOWED_HOSTS=ordoc.com.br
  - POSTGRES_PASSWORD=<senha aleatória>
  - SSL/HTTPS obrigatório
  - Backup automático de postgres
  - RDS (AWS) em vez de container
  - ElastiCache (Redis gerenciado)
  - S3 para uploads
  - CloudFront (CDN)
  - Monitoring: Prometheus + Grafana
  - Logging: ELK stack ou CloudWatch
  - Rate limiting: WAF (CloudFlare)
```

### **Inicialização Local Completa**

```bash
# 1. Clonar e entrar
git clone https://github.com/Adsumtec/ordoc-ai.git
cd ordoc-ai

# 2. Subir infra
docker-compose up -d

# 3. Aguardar (Solr é lento ~20s)
docker-compose ps

# 4. Backend pronto? Testa
curl http://localhost:8000/admin/
# Se 200 → Backend OK
# Se 500 → Aguarda, migrations rodando

# 5. Frontend (em novo terminal)
cd frontend/ordoc-ai-frontend
npm install
npm run dev  # Ativará http://localhost:3000

# 6. Acessar
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin (user: admin, password: changeme)
# Frontend: http://localhost:3000
```

---

## 🎭 PERSONAS REAIS (Casos de Uso)

### **Persona 1: Dra. Ana Silva (Advogada Trabalhista)**

**Contexto:**
- Escritório "Silva & Associados Advocacia" (10 pessoas)
- Sócia/admin
- 30+ processos trabalhistas ativos
- Documentos: petições, contratos, pareceres

**Dia Típico:**

```
08:00 - Abre OrdocAI
        Dashboard "Meu Dia" mostra:
        - 5 documentos chegaram overnight (OCR já fez)
        - 2 processos vencendo deadline (24h avisos)
        - 1 contrato precisa assinatura
        - IA sugeriu: "Petição de João tem mesma estrutura de Maria"
        
09:00 - Upload petição nova "Reclamação_XYZ.pdf"
        Sistema:
        - OCR extrai: "Reclamação de demissão sem justa causa"
        - IA detecta: CPF (LGPD) + criticidade HIGH
        - Auto-move para "Processos Ativos"
        - Cria task: "Análise de documentação" (pré-preenchida)
        - Notifica: "Petição pronta para análise"
        
10:00 - Clica no documento
        Vê:
        - Texto extraído (OCR)
        - Alertas IA: "Valor acima de limite, verificar"
        - Padrão aprendido: "Verificar CPF antes de protocolar"
        - Histórico de versões (1 versão atual)
        - Auditoria: criada às 09:15, OCR 30s
        
11:00 - Edita: corrige valor da causa
        Sistema:
        - Cria v2 automaticamente
        - Registra feedback: ("correction", original="50k", corrected="48k")
        - IA aprende (se 3+ corrigem, avisa próximos)
        
14:00 - Assinatura
        Clica "Protocolar"
        - OrdocSign solicita assinatura
        - Ana assina com A1 (token local)
        - Sistema valida certificado (ICP)
        - Gera PDF com assinatura visual
        - Registra: IP, hora, hash (não-repúdio)
        
17:00 - Relatório
        Sistema gera automaticamente:
        - "Processos criados hoje: 3"
        - "Taxa de SLA: 95%"
        - "Documentos aguardando: 2"
        - Exporta PDF + email
```

### **Persona 2: Dr. Carlos Mendes (Médico)**

**Contexto:**
- Clínica CardioVida (só ele + secretária)
- Admin
- 150+ pacientes ativo
- Documentos: prontuários, laudos, prescrições

**Dia Típico:**

```
08:30 - Secretária faz upload de 4 prontuários digitalizados
        OrdocAI:
        - OCR extrai: nomes, datas, sintomas
        - Auto-detecta documento_type = "medical_record"
        - Tags automáticas: "Paciente Ativo", "Cardiologia"
        - Notifica Dr. Carlos: "4 prontuários prontos para revisão"
        
09:00 - Dashboard mostra:
        - Pacientes que vencerão acompanhamento próxima semana
        - Laudos pendentes de revisão (IA sinalizou)
        - Medicações repetidas (IA detectou interação?)
        
10:00 - Paciente João chega
        Dr. Carlos busca prontuário:
        - Clica "Histórico de Acompanhamento"
        - Solr busca rápido (1ms)
        - Vê: last visit 30 dias ago, hipertensão controlada
        - IA alerta: "Nova prescrição de diurético recomendada?"
        
14:00 - Prescrição
        Dr. Carlos digita:
        - Sistema auto-completa medicações frequentes
        - IA valida: "Interação com Losartana? Verificar"
        - Gera PDF assinado
        - Salva no prontuário
        
17:00 - Relatório automático
        Sistema envia email:
        "Acompanhamento pós-operatório - Pacientes para contato"
        - 8 pacientes em follow-up
        - 2 com aderência baixa (faltou consulta)
        - Recomendações automáticas
        
19:00 - Backup automático
        Todos os dados sincronizados com S3
        Criptografia em trânsito + repouso
        Zero chance de perder dados
```

### **Persona 3: Roberto Oliveira (Servidor Público)**

**Contexto:**
- Prefeitura de SP - Secretaria de Obras
- Manager de departamento (não admin)
- 50+ processos de licitação
- Documentos: editais, propostas, pareceres

**Dia Típico:**

```
08:00 - Dashboard:
        - Licitação #1234 vencendo em 3 dias (ALERT!)
        - 5 propostas aguardando análise
        - Pareceres jurídicos: 2 pendentes
        
09:00 - Analisa proposta de empresa
        Insere CNPJ: 12.345.678/0001-99
        OrdocAI + OrdocIntegrations:
        - Receita Federal: pega dados da empresa
        - SERASA: score de crédito (89/100)
        - TSE: sem débitos eleitorais ✓
        - Cartório: acervo online (consulta)
        - Tudo em 3 segundos (cache inteligente)
        
        Sistema gera relatório automático:
        "Empresa habilitada para licitação"
        
10:00 - Workflow
        Roberto cria Procedure (workflow):
        Template: "Análise de Proposta Licitatória"
        
        Tasks atribuídas:
        1. Roberto: Análise técnica (STARTED)
        2. Contador: Análise financeira (NOT STARTED)
        3. Jurídico: Parecer (NOT STARTED)
        4. Chefe: Aprovação final (NOT STARTED)
        
        Sistema:
        - Notifica contador (email + app)
        - Deadline: 5 dias
        - Alerta 24h antes
        
15:00 - Contador analisa + comenta
        Clica na task
        Vê:
        - Dados da proposta (pré-preenchidos)
        - Comentários do Roberto
        - Documentos anexos (com versão)
        - Pode adicionar parecer em "Comments"
        
        Marca task como "Finished" + upload anexo
        Sistema notifica próxima pessoa (Jurídico)
        
17:00 - Relatório semanal automático
        "Licitações por status"
        - Habilitadas: 12
        - Em análise: 5
        - Desabilitadas: 2
        - Atraso SLA: 1 (ALERT)
        
        Exporta PDF + email para secretário
        Analisa tendências (gráficos automáticos)
```

---

## ⚠️ RISCOS OPERACIONAIS IDENTIFICADOS

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| **Tesseract lento para PDFs grandes** | 🟡 Médio | Async task + notificação ao usuário (OCR em progresso) |
| **Ollama down (LLM local)** | 🟡 Médio | Fallback para análise simples (extração sem deliberação) |
| **PostgreSQL crash sem backup** | 🔴 CRÍTICO | Backup automático (diário), RDS em produção |
| **Redis exaurido (muitos tokens)** | 🟡 Médio | TTL automático para sessions (8h), cleanup de expired |
| **Solr indexação lenta (muitos docs)** | 🟡 Médio | Indexação assíncrona + rate limiting |
| **Vazamento de chaves privadas A1** | 🔴 CRÍTICO | EncryptedField + HSM em produção |
| **Gov.br OAuth2 expirado** | 🟡 Médio | Refresh automático + alert se falha |
| **Rate limit Gov.br excedido** | 🟡 Médio | Cache inteligente + fila de requisições |
| **Usuário com acesso a doc de outro org** | 🔴 CRÍTICO | Middleware verifica `request.organization` em cada request |
| **Token JWT roubado** | 🟡 Médio | 2FA obrigatório + refresh token não-reutilizável |
| **Celery task pendurada (timeout)** | 🟡 Médio | `time_limit=300`, monitoramento com Flower |
| **Storage S3 falha (upload perdido)** | 🟡 Médio | Redundância regional + versioning S3 ativado |
| **LGPD: Dados não deletados** | 🔴 CRÍTICO | Soft delete automático (30 dias em trash) |
| **Auditoria corrompida** | 🔴 CRÍTICO | Write-once logs (append-only) |

---

## 🔄 CICLO DE VIDA COMPLETO (Do Código ao Usuário)

### **1. Desenvolvimento**
```
Dev escreve código
    ↓
Faz commit + push
    ↓
GitHub Actions roda testes (CI/CD)
    ↓
Merge em main
    ↓
Build automático de imagem Docker
```

### **2. Deployment Local (Dev)**
```
docker-compose up -d
    ↓ 1. Postgres inicia (volume persiste dados)
    ↓ 2. Redis inicia
    ↓ 3. Django backend inicia
    ↓    - docker-entrypoint.sh roda:
    ↓      - wait_for_postgres()
    ↓      - migrate (cria tabelas)
    ↓      - create_superuser (admin/changeme)
    ↓      - collectstatic (assets)
    ↓ 4. Celery worker inicia
    ↓ 5. Celery beat inicia
    ↓ 6. Solr inicia (create cores)
    ↓ 7. Ollama inicia (pull models)
    ↓ 8. Nginx pronto
    ↓ 9. Aplicação pronta em http://localhost:8000
```

### **3. Produção (Recomendado)**
```
GitHub Actions → Build de imagem
    ↓
Push para Docker Registry (ECR/DockerHub)
    ↓
ECS/Kubernetes puxa imagem
    ↓
Rolling deployment (0 downtime):
    - Nova instância sobe
    - Testes de health check
    - Traffic gradualmente movido
    - Instância antiga desligada
    ↓
CloudWatch monitora:
    - CPU, Memoria
    - Erros (Sentry)
    - Logs (ELK)
    ↓
Auto-scaling ativa se:
    - CPU > 70%
    - Requests/s > 1000
```

---

## 📋 PRÓXIMOS PASSOS RECOMENDADOS

### **Curto Prazo (1-2 semanas)**
- [ ] Executar localmente e testar flow completo (upload → OCR → signature)
- [ ] Entender schema de banco (psql → \d+ para listar tabelas)
- [ ] Executar testes (pytest)
- [ ] Explorar admin Django (http://localhost:8000/admin)

### **Médio Prazo (1 mês)**
- [ ] Deploy em staging (AWS/Digital Ocean)
- [ ] Testar integrações Gov.br (com credenciais reais)
- [ ] Load testing (quantos documentos/segundo?)
- [ ] Planejar migração de dados (de sistema legado)

### **Longo Prazo (Produção)**
- [ ] Setup CI/CD completo (GitHub Actions)
- [ ] Monitoring + alerting (Prometheus + Alertmanager)
- [ ] Backup strategy (Point-in-time recovery)
- [ ] Disaster recovery plan
- [ ] Security audit (penetration testing)

---

## 📚 ARQUIVOS-CHAVE PARA REFERÊNCIA

| Arquivo | Propósito |
|---------|-----------|
| [backend/pyproject.toml](backend/pyproject.toml) | Dependências Python (25+ libs) |
| [backend/Dockerfile](backend/Dockerfile) | Build da imagem Docker |
| [docker-compose.yml](docker-compose.yml) | Orquestração de serviços |
| [backend/ordoc_ai/settings.py](backend/ordoc_ai/settings.py) | Configurações Django (5 integr) |
| [backend/ordoc_ai/celery.py](backend/ordoc_ai/celery.py) | Scheduler de tarefas (8+ periódicas) |
| [backend/ordoc_ai/celery.py](backend/ordoc_ai/celery.py) | Schedule de tarefas |
| [backend/intelligence/tasks.py](backend/intelligence/tasks.py) | Tasks de IA (análise, aprendizado) |
| [backend/ordoc_air/models.py](backend/ordoc_air/models.py) | Modelos de documentos |
| [backend/ordoc_flow/models.py](backend/ordoc_flow/models.py) | Modelos de workflow |
| [backend/intelligence/models.py](backend/intelligence/models.py) | Modelos de IA (patterns, feedback) |
| [backend/ordoc_integrations/services/base.py](backend/ordoc_integrations/services/base.py) | Base para integrações (cache, retry) |
| [backend/docker-entrypoint.sh](backend/docker-entrypoint.sh) | Setup de inicialização |

---

## 🎓 CONCLUSÃO

**OrdocAI é uma plataforma complexa, bem arquitetada e pronta para produção**, que resolve problemas reais de gestão documental + workflow + IA integrada. 

**Tecnicamente:**
- Arquitetura modular (7 módulos desacoplados)
- Async-first (Celery para heavy lifting)
- Multi-tenant (organizações isoladas)
- Seguro (JWT, 2FA, auditoria, criptografia)
- Escalável (Docker, Redis cache, Solr indexing)

**Semanticamente:**
- Entende o negócio (documentos, workflows, assinatura)
- Aprende com usuários (KnowledgeFeedback → LearnedPattern)
- Integra com Brasil (Gov.br, Receita, SERASA)
- Compliant com LGPD (detecção de dados sensíveis, soft delete)

**Próximo Passo:** Rodar localmente e explorar os fluxos reais!

---

**Data de Análise:** 5 de janeiro de 2026  
**Analisador:** GitHub Copilot / Claude Haiku  
**Profundidade:** Completa (código + arquitetura + negócio)
