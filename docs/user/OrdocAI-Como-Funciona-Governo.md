# OrdocAI — Como Funciona: ÓRGÃO PÚBLICO
## Fluxo Completo: Secretaria Municipal

---

## CENÁRIO BASE

```
ÓRGÃO: Secretaria Municipal de Administração de Curitiba
CNPJ: 76.417.005/0001-86 (Prefeitura)
UNIDADE: Secretaria de Administração (SMAD)
ADMIN: Dr. Roberto Almeida (Secretário)
GESTOR DO SISTEMA: Carla Souza (Coordenadora de TI)
USUÁRIOS: ~150 servidores
```

---

# PARTE 1: ONBOARDING (Órgão Público)

## 1.1 Processo de Contratação (Antes do Sistema)

**Diferença crucial:** Órgão público não "se cadastra" — há um processo de contratação:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    JORNADA DE CONTRATAÇÃO                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. PROSPECÇÃO                                                          │
│     └── Secretaria conhece OrdocAI (evento, indicação, licitação)      │
│                                                                         │
│  2. DEMONSTRAÇÃO                                                        │
│     └── POC com dados reais (ambiente sandbox)                         │
│                                                                         │
│  3. PROCESSO LICITATÓRIO (ou dispensa até R$50k)                       │
│     └── Pregão eletrônico / Dispensa / Adesão a ARP                    │
│                                                                         │
│  4. CONTRATAÇÃO                                                         │
│     └── Empenho, contrato, ordem de serviço                            │
│                                                                         │
│  5. IMPLANTAÇÃO ← É aqui que começa o onboarding técnico               │
│     └── Configuração, migração, treinamento                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.2 Setup Inicial (Feito pelo Time OrdocAI + TI da Secretaria)

Carla (TI) acessa o painel administrativo:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI — Painel de Implantação                          Administrador │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Configuração do Órgão                                                  │
│                                                                         │
│  Tipo de organização:                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │  Empresa/   │  │   Órgão     │  │  Uso        │                     │
│  │  Escritório │  │   Público   │  │  Pessoal    │                     │
│  │             │  │      ✓      │  │             │                     │
│  └─────────────┘  └─────────────┘  └─────────────┘                     │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Esfera:  [● Municipal  ○ Estadual  ○ Federal]                         │
│                                                                         │
│  Tipo:    [Secretaria ▼]                                               │
│           ├── Prefeitura (Gabinete)                                    │
│           ├── Secretaria ←                                              │
│           ├── Autarquia                                                 │
│           ├── Câmara Municipal                                          │
│           ├── Tribunal                                                  │
│           └── Outro                                                     │
│                                                                         │
│  CNPJ do órgão: [76.417.005/0001-86]        [Buscar]                   │
│                                                                         │
│  Unidade: [Secretaria Municipal de Administração - SMAD]               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE POR BAIXO:**

```
POST /api/v1/admin/onboarding/public-agency/

1. Busca dados do CNPJ (Receita Federal)
2. Identifica que é órgão público municipal
3. Aplica configurações específicas:

   Tenant.objects.create(
       type='PUBLIC_AGENCY',
       subtype='MUNICIPAL_SECRETARIAT',
       name='Secretaria Municipal de Administração',
       cnpj='76417005000186',
       parent_entity='Prefeitura Municipal de Curitiba',
       
       # Configurações específicas de órgão público
       settings={
           'compliance': {
               'lai_enabled': True,           # Lei de Acesso à Informação
               'earq_enabled': True,          # e-ARQ Brasil
               'lgpd_enabled': True,
               'lei_14063_enabled': True,     # Assinatura eletrônica gov
           },
           'transparency': {
               'citizen_portal': True,        # Portal do cidadão
               'auto_publish_doi': True,      # Diário Oficial
           },
           'auth': {
               'govbr_required': True,        # Login Gov.br obrigatório
               'certificate_required_roles': ['SECRETARY', 'DIRECTOR'],
           },
           'hierarchy': {
               'approval_levels': 3,          # Mais níveis de aprovação
               'require_justification': True,
           }
       },
       
       plan='GOVERNMENT',  # Plano específico
   )
```

---

## 1.3 Estrutura Organizacional

Carla configura a hierarquia:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Estrutura Organizacional                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📁 Secretaria Municipal de Administração (SMAD)                       │
│  │                                                                      │
│  ├── 👤 Gabinete do Secretário                                         │
│  │   ├── Dr. Roberto Almeida (Secretário) [ADMIN]                      │
│  │   └── Ana Costa (Assessora) [MANAGER]                               │
│  │                                                                      │
│  ├── 📁 Departamento de Licitações (DELIC)                             │
│  │   ├── João Silva (Diretor) [MANAGER]                                │
│  │   ├── Maria Santos (Pregoeira) [ANALYST]                            │
│  │   ├── Pedro Oliveira (Apoio) [ANALYST]                              │
│  │   └── + 12 servidores                                               │
│  │                                                                      │
│  ├── 📁 Departamento de Contratos (DECON)                              │
│  │   ├── Fernanda Lima (Diretora) [MANAGER]                            │
│  │   └── + 8 servidores                                                │
│  │                                                                      │
│  ├── 📁 Departamento Jurídico (DEJUR)                                  │
│  │   ├── Dr. Carlos Mendes (Procurador-Chefe) [MANAGER]                │
│  │   └── + 5 procuradores                                              │
│  │                                                                      │
│  ├── 📁 Departamento de RH (DERH)                                      │
│  │   └── + 15 servidores                                               │
│  │                                                                      │
│  └── 📁 Coordenadoria de TI                                            │
│      ├── Carla Souza (Coordenadora) [ADMIN]                            │
│      └── + 3 analistas                                                 │
│                                                                         │
│  Total: 150 usuários                                                    │
│                                                                         │
│  [Importar de planilha]  [Integrar com RH]  [+ Adicionar departamento] │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.4 Configuração de Compliance (Específico Gov)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Configurações de Compliance                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📋 LEI DE ACESSO À INFORMAÇÃO (LAI)                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] Habilitar Portal do Cidadão                                 │   │
│  │ [✓] Classificação automática (público/restrito/sigiloso)        │   │
│  │ [✓] Prazos de resposta LAI (20 dias + 10 prorrogação)          │   │
│  │ [✓] Relatório automático de pedidos                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📁 e-ARQ BRASIL (Gestão Arquivística)                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] Tabela de temporalidade padrão CONARQ                       │   │
│  │ [✓] Classificação por código de assunto                         │   │
│  │ [✓] Controle de destinação (guarda/eliminação)                  │   │
│  │ [✓] Metadados obrigatórios e-ARQ                                │   │
│  │                                                                  │   │
│  │ Importar tabela: [Modelo CONARQ ▼]  [Upload customizada]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ✍️ ASSINATURA DIGITAL (Lei 14.063/2020)                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Níveis de assinatura por tipo de documento:                     │   │
│  │                                                                  │   │
│  │ Decretos, Leis:           [● Qualificada ICP-Brasil]            │   │
│  │ Contratos > R$50k:        [● Qualificada ICP-Brasil]            │   │
│  │ Contratos < R$50k:        [● Avançada Gov.br]                   │   │
│  │ Documentos internos:      [● Avançada Gov.br]                   │   │
│  │ Comunicações:             [○ Simples]                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🔗 INTEGRAÇÕES GOV.BR                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] Login Gov.br (autenticação)                                 │   │
│  │ [✓] Assinatura Gov.br                                           │   │
│  │ [✓] Consulta CPF/CNPJ (Receita)                                 │   │
│  │ [✓] SIAFI (empenhos) — configurar credenciais                   │   │
│  │ [ ] SEI (interoperabilidade) — em breve                         │   │
│  │ [✓] Diário Oficial — configurar API                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.5 Workflows Pré-Configurados (Setor Público)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Templates de Processo — Setor Público Municipal                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  A IA detectou que você é uma Secretaria Municipal.                    │
│  Sugerimos os seguintes workflows:                                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] LICITAÇÃO - PREGÃO ELETRÔNICO                               │   │
│  │     8 etapas: Termo de Referência → Parecer Jurídico →          │   │
│  │     Autorização → Edital → Publicação DOE → Sessão →            │   │
│  │     Homologação → Contrato                                       │   │
│  │     SLA: 45 dias                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] CONTRATO ADMINISTRATIVO                                     │   │
│  │     6 etapas: Minuta → Parecer Jurídico → Aprovação →           │   │
│  │     Assinaturas → Publicação → Arquivo                          │   │
│  │     SLA: 15 dias                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] DECRETO MUNICIPAL                                           │   │
│  │     5 etapas: Redação → Revisão Jurídica → Gabinete →           │   │
│  │     Assinatura Prefeito → Publicação DOE                        │   │
│  │     SLA: 10 dias                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] PROCESSO ADMINISTRATIVO                                     │   │
│  │     Fluxo flexível com tramitação entre departamentos           │   │
│  │     SLA: Configurável                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [✓] PEDIDO LAI (Lei de Acesso à Informação)                     │   │
│  │     4 etapas: Recebimento → Análise → Resposta → Recurso        │   │
│  │     SLA: 20 dias (Lei 12.527)                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [ ] ADMISSÃO DE SERVIDOR                                        │   │
│  │ [ ] FÉRIAS / LICENÇAS                                           │   │
│  │ [ ] PAGAMENTO A FORNECEDOR                                      │   │
│  │ [+ Criar workflow personalizado]                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.6 Primeiro Acesso do Servidor (Maria - Pregoeira)

Maria Santos, pregoeira do DELIC, recebe email:

```
Assunto: 🔑 Seu acesso ao OrdocAI - Secretaria de Administração

Olá Maria,

Você foi cadastrada no OrdocAI como Analista no Departamento de Licitações.

Para acessar, use seu login Gov.br:

[Acessar OrdocAI →]

---
Secretaria Municipal de Administração
Prefeitura de Curitiba
```

Maria clica e é redirecionada para Gov.br:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              gov.br                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         Acesse sua conta                                │
│                                                                         │
│                                                                         │
│            CPF: [___.___.___-__]                                       │
│                                                                         │
│                          [Continuar]                                    │
│                                                                         │
│            ─────────── ou ───────────                                  │
│                                                                         │
│            [📱 QR Code pelo app Gov.br]                                │
│                                                                         │
│            [🏦 Certificado digital]                                    │
│                                                                         │
│            [🏛️ Banco credenciado]                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

Após autenticação, Maria acessa o sistema:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI    [🔍 Buscar...]       🔔  Maria Santos ▼  SMAD/DELIC        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────┐ ┌────────────┐ ┌───────────┐ ┌─────────────┐ ┌──────────┐ │
│  │ MEU DIA│ │ DOCUMENTOS │ │ PROCESSOS │ │ ASSINATURAS │ │ ANÁLISES │ │
│  └────────┘ └────────────┘ └───────────┘ └─────────────┘ └──────────┘ │
│                                                                         │
│  👋 Bem-vinda, Maria!                                                  │
│                                                                         │
│  Você está no Departamento de Licitações (DELIC).                      │
│  Seu perfil: Pregoeira                                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   📚 Treinamento Rápido (10 min)                                │   │
│  │                                                                  │   │
│  │   1. [▶️] Como fazer upload de documentos                       │   │
│  │   2. [ ] Como conduzir um pregão no sistema                     │   │
│  │   3. [ ] Como assinar documentos                                │   │
│  │   4. [ ] Como buscar processos antigos                          │   │
│  │                                                                  │   │
│  │   [Pular treinamento]                                           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 2: USO DIÁRIO — PROCESSO DE LICITAÇÃO

## 2.1 Maria Inicia um Novo Pregão

Maria precisa iniciar o Pregão 001/2025 para aquisição de computadores.

Ela clica em **[+ Novo Processo]**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Novo Processo                                                    [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Tipo de processo:                                                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ● LICITAÇÃO - PREGÃO ELETRÔNICO (mais usado por você)          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Licitação - Concorrência                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Dispensa de Licitação                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Contrato Administrativo                                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Identificação:                                                         │
│                                                                         │
│  Número: [001/2025]  (auto-gerado)                                     │
│  Objeto: [Aquisição de 200 computadores para modernização do parque    │
│           tecnológico da Secretaria de Administração]                  │
│                                                                         │
│  Valor estimado: [R$ 1.200.000,00]                                     │
│                                                                         │
│  Departamento requisitante: [Coordenadoria de TI ▼]                    │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Classificação (e-ARQ):                                                 │
│                                                                         │
│  Código: [052.2] - Aquisição de material permanente                    │
│  Temporalidade: 10 anos (guarda permanente se > R$500k)                │
│                                                                         │
│  Acesso: [● Público  ○ Restrito  ○ Sigiloso]                          │
│                                                                         │
│                                           [Cancelar]  [Criar Processo] │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE:**

```
POST /api/v1/ordoc-flow/procedures/

1. Cria Procedure (processo)
   Procedure.objects.create(
       tenant=smad,
       number='001/2025',
       type='PREGAO_ELETRONICO',
       object='Aquisição de 200 computadores...',
       estimated_value=1200000.00,
       department=ti,
       
       # Classificação e-ARQ
       earq_code='052.2',
       earq_temporality='10_YEARS',
       earq_destination='PERMANENT',  # > R$500k
       
       # Acesso
       access_level='PUBLIC',
       
       # Status
       status='DRAFT',
       current_step='TERMO_REFERENCIA',
   )

2. Cria Tasks para cada etapa do workflow
   ProcedureTask.objects.bulk_create([
       Task(procedure=proc, step='TERMO_REFERENCIA', responsible=maria, status='PENDING'),
       Task(procedure=proc, step='PARECER_JURIDICO', responsible=None, status='WAITING'),
       Task(procedure=proc, step='AUTORIZACAO', responsible=secretario, status='WAITING'),
       Task(procedure=proc, step='EDITAL', responsible=maria, status='WAITING'),
       Task(procedure=proc, step='PUBLICACAO_DOE', responsible=None, status='WAITING'),
       Task(procedure=proc, step='SESSAO_PREGAO', responsible=maria, status='WAITING'),
       Task(procedure=proc, step='HOMOLOGACAO', responsible=secretario, status='WAITING'),
       Task(procedure=proc, step='CONTRATO', responsible=decon, status='WAITING'),
   ])

3. Cria pasta no Storage
   /tenants/smad/processos/licitacoes/2025/pregao-001/

4. Registra no log de auditoria
   AuditLog.create(
       action='PROCEDURE_CREATED',
       user=maria,
       procedure=proc,
       details={...}
   )
```

---

## 2.2 Maria Faz Upload do Termo de Referência

Maria arrasta o arquivo `Termo_Referencia_Computadores.pdf`:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Pregão 001/2025 — Termo de Referência                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Etapa atual: 1. TERMO DE REFERÊNCIA                                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │     📄 Termo_Referencia_Computadores.pdf                        │   │
│  │        1.8 MB                                                    │   │
│  │                                                                  │   │
│  │     [████████████████████████████████████] 100%                 │   │
│  │                                                                  │   │
│  │     ✓ Upload concluído                                          │   │
│  │     ⏳ Analisando documento...                                  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**PIPELINE DE IA (adaptado para setor público):**

```
[Celery Worker - analyze_document]

1. OCR extrai texto

2. LLM analisa com contexto de LICITAÇÃO PÚBLICA:
   
   prompt = """
   Analise este Termo de Referência de licitação pública e extraia:
   
   1. Objeto da contratação
   2. Especificações técnicas
   3. Quantitativos
   4. Valor estimado (se houver)
   5. Critério de julgamento
   6. Prazo de entrega
   7. Dotação orçamentária
   8. Verificar conformidade com:
      - Lei 14.133/2021 (Nova Lei de Licitações)
      - Decreto Municipal de compras
   9. Alertas de risco ou inconsistências
   
   Documento:
   {texto}
   """

3. Resultado da análise:
   {
       "document_type": "TERMO_REFERENCIA",
       "object": "Aquisição de 200 computadores desktop",
       
       "specifications": [
           {"item": "Processador", "spec": "Intel Core i5 12ª geração ou equivalente"},
           {"item": "Memória RAM", "spec": "16GB DDR4"},
           {"item": "Armazenamento", "spec": "SSD 512GB NVMe"},
           {"item": "Monitor", "spec": "23.8 polegadas Full HD"},
       ],
       
       "quantity": 200,
       "unit_price_estimate": 6000.00,
       "total_estimate": 1200000.00,
       
       "judgment_criteria": "MENOR_PRECO",
       "delivery_deadline": "60 dias",
       
       "budget": {
           "dotacao": "02.001.04.126.0003.2.001",
           "fonte": "Recursos Próprios",
           "elemento": "4.4.90.52"
       },
       
       "compliance": {
           "lei_14133": {
               "status": "CONFORME",
               "details": "Atende requisitos do art. 6º, XXIII"
           },
           "decreto_municipal": {
               "status": "VERIFICAR",
               "alert": "Verificar exigência de amostra (art. 17 do Decreto 1.234)"
           }
       },
       
       "alerts": [
           {
               "type": "COMPLIANCE",
               "severity": "MEDIUM",
               "message": "Valor > R$1M requer aprovação do Secretário",
               "legal_basis": "Decreto Municipal 1.234/2023, art. 5º"
           },
           {
               "type": "SPECIFICATION",
               "severity": "LOW",
               "message": "Especificação de processador muito restritiva. Considerar 'ou equivalente' para ampliar competição.",
               "legal_basis": "Lei 14.133/2021, art. 9º, §2º"
           }
       ],
       
       "suggested_next_steps": [
           "Enviar para Parecer Jurídico",
           "Solicitar 3 orçamentos para pesquisa de preços"
       ]
   }
```

**Maria vê o resultado:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📄 Termo de Referência — Pregão 001/2025                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────┐  ┌────────────────────────────────┐  │
│  │                              │  │                                │  │
│  │   [PREVIEW DO DOCUMENTO]     │  │  📋 ANÁLISE DA IA             │  │
│  │                              │  │                                │  │
│  │                              │  │  Objeto: Aquisição de 200     │  │
│  │                              │  │  computadores desktop          │  │
│  │                              │  │                                │  │
│  │                              │  │  Valor estimado: R$ 1.200.000 │  │
│  │                              │  │  Critério: Menor Preço        │  │
│  │                              │  │  Prazo: 60 dias               │  │
│  │                              │  │                                │  │
│  │                              │  │  ─────────────────────────────│  │
│  │                              │  │                                │  │
│  │                              │  │  ⚖️ CONFORMIDADE              │  │
│  │                              │  │                                │  │
│  │                              │  │  Lei 14.133/2021: ✓ Conforme  │  │
│  │                              │  │  Decreto Municipal: ⚠️ Verificar│  │
│  │                              │  │                                │  │
│  └──────────────────────────────┘  │  ─────────────────────────────│  │
│                                     │                                │  │
│                                     │  ⚠️ ALERTAS                   │  │
│                                     │                                │  │
│                                     │  🟡 Valor > R$1M requer       │  │
│                                     │     aprovação do Secretário   │  │
│                                     │     (Dec. 1.234/2023)         │  │
│                                     │                                │  │
│                                     │  🟢 Especificação pode ser    │  │
│                                     │     mais ampla para aumentar  │  │
│                                     │     competição                │  │
│                                     │                                │  │
│                                     │  ─────────────────────────────│  │
│                                     │                                │  │
│                                     │  [✓ Concluir Etapa]           │  │
│                                     │  [Enviar para Parecer Jurídico]│  │
│                                     │                                │  │
│                                     └────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.3 Maria Envia para Parecer Jurídico

Maria clica em **[Enviar para Parecer Jurídico]**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Enviar para próxima etapa                                        [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Pregão 001/2025                                                       │
│  Etapa atual: Termo de Referência → Parecer Jurídico                   │
│                                                                         │
│  Responsável pelo parecer:                                              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Departamento Jurídico (DEJUR)                                   │   │
│  │                                                                  │   │
│  │ ● Dr. Carlos Mendes (Procurador-Chefe) — disponível            │   │
│  │ ○ Dra. Lucia Ferreira (Procuradora) — 3 processos pendentes    │   │
│  │ ○ Dr. André Costa (Procurador) — em férias                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Prazo para parecer: [5 dias úteis ▼]                                  │
│                                                                         │
│  Observações para o jurídico:                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Atenção para:                                                   │   │
│  │ - Exigência de amostra (art. 17 Decreto 1.234)                 │   │
│  │ - Valor acima de R$1M (requer aprovação Secretário)            │   │
│  │                                                                  │   │
│  │ IA já identificou possíveis pontos de atenção.                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [✓] Notificar por email                                               │
│  [✓] Notificar por WhatsApp                                            │
│  [✓] Incluir alertas da IA                                             │
│                                                                         │
│                                           [Cancelar]  [Enviar]         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE:**

```
POST /api/v1/ordoc-flow/procedures/{id}/advance/

1. Atualiza status da Task atual
   task_tr.status = 'COMPLETED'
   task_tr.completed_at = now()
   task_tr.completed_by = maria

2. Ativa próxima Task
   task_parecer.status = 'PENDING'
   task_parecer.responsible = carlos_mendes
   task_parecer.deadline = now() + 5 business_days

3. Cria WorkflowRequest (solicitação)
   WorkflowRequest.objects.create(
       procedure=proc,
       from_user=maria,
       to_user=carlos_mendes,
       step='PARECER_JURIDICO',
       message='Atenção para exigência de amostra...',
       ai_alerts=analysis['alerts']
   )

4. Enfileira notificações multi-canal
   NotificationRequest.objects.create(
       recipient=carlos_mendes,
       channels=['EMAIL', 'WHATSAPP', 'PUSH'],
       template='new_legal_review',
       context={...}
   )

5. Atualiza timeline do processo
   procedure.current_step = 'PARECER_JURIDICO'
   procedure.save()

6. Log de auditoria
   AuditLog.create(action='STEP_ADVANCED', ...)
```

---

## 2.4 Dr. Carlos Recebe e Elabora o Parecer

Dr. Carlos (Procurador-Chefe) recebe notificação:

**WhatsApp:**
```
📋 *OrdocAI - SMAD*

Novo processo aguardando parecer:

*Pregão 001/2025*
Objeto: Aquisição de 200 computadores
Valor: R$ 1.200.000,00
Prazo: 5 dias úteis

⚠️ IA identificou 2 alertas

[Acessar processo →]
```

**Dr. Carlos acessa o sistema:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MEU DIA                                               Dr. Carlos Mendes│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │ 📋 8          │  │ ⏰ 2          │  │ ✅ 45         │               │
│  │ Pareceres     │  │ Vencem        │  │ Concluídos    │               │
│  │ pendentes     │  │ esta semana   │  │ este mês      │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│                                                                         │
│  📋 FILA DE PARECERES                                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 NOVO                                          Prazo: 5 dias  │   │
│  │                                                                  │   │
│  │ Pregão 001/2025 — Aquisição de computadores                     │   │
│  │ R$ 1.200.000,00 · Solicitado por: Maria Santos (DELIC)          │   │
│  │                                                                  │   │
│  │ 💡 IA: "2 alertas identificados no Termo de Referência"         │   │
│  │    • Verificar exigência de amostra                             │   │
│  │    • Especificação pode restringir competição                   │   │
│  │                                                                  │   │
│  │ 📊 Histórico: 3 pregões similares aprovados em 2024             │   │
│  │                                                                  │   │
│  │                    [Analisar]  [Ver Histórico]  [Delegar]       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Dr. Carlos clica em [Analisar] e elabora o parecer:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Elaborar Parecer Jurídico                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Pregão 001/2025 — Aquisição de computadores                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📄 Documentos do processo:                                     │   │
│  │                                                                  │   │
│  │  ✓ Termo de Referência (analisado pela IA)                     │   │
│  │  ✓ Pesquisa de Preços (3 orçamentos)                           │   │
│  │  ✓ Requisição de Compras                                        │   │
│  │  ✓ Dotação Orçamentária                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📝 PARECER                                                            │
│                                                                         │
│  Conclusão: [● Favorável  ○ Favorável com ressalvas  ○ Desfavorável]  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  💡 IA: "Baseado em pareceres anteriores similares, sugiro:"    │   │
│  │                                                                  │   │
│  │  [Usar modelo de parecer similar] (Pregão 089/2024)             │   │
│  │                                                                  │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │                                                                  │   │
│  │  PARECER JURÍDICO Nº ___/2025                                   │   │
│  │                                                                  │   │
│  │  PROCESSO: Pregão Eletrônico 001/2025                           │   │
│  │  OBJETO: Aquisição de 200 computadores desktop                  │   │
│  │  INTERESSADO: Secretaria Municipal de Administração             │   │
│  │                                                                  │   │
│  │  I - RELATÓRIO                                                  │   │
│  │  Trata-se de procedimento licitatório na modalidade Pregão      │   │
│  │  Eletrônico, tipo menor preço, para aquisição de equipamentos   │   │
│  │  de informática...                                              │   │
│  │                                                                  │   │
│  │  II - FUNDAMENTAÇÃO                                             │   │
│  │  ...                                                            │   │
│  │                                                                  │   │
│  │  III - CONCLUSÃO                                                │   │
│  │  Ante o exposto, OPINO FAVORAVELMENTE ao prosseguimento...     │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Salvar Rascunho]                    [Assinar e Concluir Parecer]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Dr. Carlos assina com certificado ICP-Brasil (obrigatório para parecer jurídico):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Assinatura Digital — Parecer Jurídico                            [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⚖️ Este documento requer assinatura qualificada (ICP-Brasil)          │
│     conforme Lei 14.063/2020                                           │
│                                                                         │
│  Certificado detectado:                                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ✓ CARLOS MENDES DA SILVA                                       │   │
│  │    CPF: ***.456.789-**                                          │   │
│  │    Certificado A3 (Token) · Válido até 20/12/2026              │   │
│  │    AC: SERASA                                                   │   │
│  │    Cargo: Procurador Municipal                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [✓] Incluir carimbo do tempo (obrigatório para licitações)           │
│  [✓] Enviar automaticamente para próxima etapa                         │
│                                                                         │
│                                                                         │
│            ┌─────────────────────────────────────────┐                 │
│            │     [  🔐 ASSINAR COM TOKEN A3  ]       │                 │
│            │         Insira o PIN do token           │                 │
│            └─────────────────────────────────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.5 Processo Avança Automaticamente

Após a assinatura do Dr. Carlos, o sistema:

```
1. Salva parecer assinado digitalmente
2. Atualiza task: PARECER_JURIDICO → COMPLETED
3. Avança para: AUTORIZACAO (Secretário)
4. Notifica Dr. Roberto (Secretário) 
5. Atualiza timeline
```

**Dr. Roberto (Secretário) recebe:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MEU DIA                                         Dr. Roberto Almeida   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 AUTORIZAÇÃO NECESSÁRIA                        Prazo: 2 dias  │   │
│  │                                                                  │   │
│  │ Pregão 001/2025 — Aquisição de computadores                     │   │
│  │ R$ 1.200.000,00                                                 │   │
│  │                                                                  │   │
│  │ ✓ Termo de Referência (Maria Santos)                           │   │
│  │ ✓ Parecer Jurídico FAVORÁVEL (Dr. Carlos Mendes)               │   │
│  │ → Aguardando SUA autorização                                    │   │
│  │                                                                  │   │
│  │ 💡 IA: "Processo conforme. Similar ao Pregão 089/2024           │   │
│  │        que você autorizou em 3h."                               │   │
│  │                                                                  │   │
│  │              [Ver Processo Completo]  [Autorizar]  [Devolver]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.6 Timeline Visual do Processo

Maria pode acompanhar o processo em tempo real:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROCESSOS > Pregão 001/2025                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📄 Aquisição de 200 computadores desktop                              │
│  Valor: R$ 1.200.000,00 · DELIC                                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ✅ Termo de         ✅ Parecer        ⏳ Autorização            │   │
│  │     Referência          Jurídico          Secretário            │   │
│  │     Maria               Dr. Carlos        Dr. Roberto           │   │
│  │     02/01 10:30         03/01 15:45       Aguardando            │   │
│  │                                                                  │   │
│  │  ────●──────────────────●────────────────◐────────────────────  │   │
│  │                                                                  │   │
│  │  ○ Edital        ○ Publicação     ○ Sessão      ○ Homologação  │   │
│  │    Maria           DOE              Maria         Dr. Roberto   │   │
│  │    Pendente        Pendente         Pendente      Pendente      │   │
│  │                                                                  │   │
│  │  ──○────────────────○────────────────○────────────────○───────  │   │
│  │                                                                  │   │
│  │  Previsão de conclusão: 15/02/2025                              │   │
│  │  SLA: ✓ Dentro do prazo (45 dias)                               │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📊 MÉTRICAS                                                           │
│                                                                         │
│  Tempo na etapa atual: 4h                                              │
│  Tempo médio para autorização: 1.2 dias                                │
│  Comparativo: 20% mais rápido que a média                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 3: FLUXOS ESPECIAIS — SETOR PÚBLICO

## 3.1 Pedido LAI (Cidadão Solicita Informação)

Um cidadão acessa o **Portal de Transparência**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Portal da Transparência — Prefeitura de Curitiba                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Solicitar Informação (Lei 12.527/2011)                                │
│                                                                         │
│  Para fazer sua solicitação, entre com Gov.br:                         │
│                                                                         │
│            [🔐 Entrar com Gov.br]                                      │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Descrição da informação desejada:                                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Solicito informações sobre os contratos de tecnologia           │   │
│  │ firmados pela Secretaria de Administração em 2024, incluindo:   │   │
│  │ - Valores                                                        │   │
│  │ - Empresas contratadas                                          │   │
│  │ - Objetos dos contratos                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                                                   [Enviar Solicitação] │
│                                                                         │
│  ⏰ Prazo de resposta: 20 dias (prorrogável por +10)                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O pedido chega no OrdocAI:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROCESSOS > LAI                                        Maria (DELIC)  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔵 NOVO PEDIDO LAI                                 Prazo: 20 dias│   │
│  │                                                                  │   │
│  │ Protocolo: LAI-2025-00042                                       │   │
│  │ Solicitante: João da Silva (CPF: ***.123.456-**)               │   │
│  │                                                                  │   │
│  │ Assunto: Contratos de tecnologia 2024                           │   │
│  │                                                                  │   │
│  │ 💡 IA: "Encontrei 8 contratos que atendem à solicitação.        │   │
│  │        Todos são PÚBLICOS (sem restrição de acesso)."           │   │
│  │                                                                  │   │
│  │        [Ver contratos identificados]                            │   │
│  │                                                                  │   │
│  │ [Responder]  [Solicitar Esclarecimento]  [Encaminhar]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**IA já localizou os documentos relevantes:**

```
A IA busca automaticamente:
- Tipo: CONTRATO
- Período: 2024
- Departamento: Todos
- Assunto: tecnologia, TI, informática, sistemas

Encontrou 8 contratos:
1. Contrato 045/2024 - Microsoft (R$ 180k)
2. Contrato 067/2024 - Dell (R$ 450k)
3. Contrato 089/2024 - Totvs (R$ 320k)
...

Verificou classificação: Todos PÚBLICOS
Sugestão: Pode responder diretamente com lista
```

---

## 3.2 Publicação em Diário Oficial

Após homologação do Pregão, o sistema publica automaticamente:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Publicação no Diário Oficial                                     [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Pregão 001/2025 — HOMOLOGADO                                          │
│                                                                         │
│  O sistema irá publicar automaticamente no Diário Oficial:             │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  EXTRATO DE HOMOLOGAÇÃO                                         │   │
│  │                                                                  │   │
│  │  PREGÃO ELETRÔNICO Nº 001/2025                                  │   │
│  │  PROCESSO ADMINISTRATIVO Nº 2025/0001234                        │   │
│  │                                                                  │   │
│  │  OBJETO: Aquisição de 200 computadores desktop para            │   │
│  │  modernização do parque tecnológico da SMAD.                    │   │
│  │                                                                  │   │
│  │  EMPRESA VENCEDORA: TechBrasil Informática Ltda                 │   │
│  │  CNPJ: 98.765.432/0001-10                                       │   │
│  │  VALOR TOTAL: R$ 1.140.000,00                                   │   │
│  │                                                                  │   │
│  │  Curitiba, 15 de fevereiro de 2025.                            │   │
│  │                                                                  │   │
│  │  Dr. Roberto Almeida                                            │   │
│  │  Secretário Municipal de Administração                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Publicar em:                                                           │
│  [✓] Diário Oficial do Município (DOM)                                 │
│  [✓] Portal de Transparência                                           │
│  [✓] ComprasNet/PNCP                                                   │
│                                                                         │
│  Data de publicação: [16/02/2025]                                      │
│                                                                         │
│                                [Cancelar]  [Publicar Automaticamente]  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.3 Tela de Análises — Visão do Secretário

Dr. Roberto (Secretário) vê métricas estratégicas:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ANÁLISES — Secretaria de Administração                    Jan/2025    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐           │
│  │  R$ 4.2M        │ │      12         │ │     98%         │           │
│  │  Valor em       │ │  Licitações     │ │  Conformidade   │           │
│  │  licitações     │ │  em andamento   │ │  legal          │           │
│  │  ↑ 23% vs 2024  │ │                 │ │                 │           │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘           │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📊 TEMPO MÉDIO POR ETAPA (Pregões)                                    │
│                                                                         │
│  Termo de Referência  ████████░░░░░░░░░░░░  3.1 dias                   │
│  Parecer Jurídico     ██████████████░░░░░░  5.2 dias ⚠️ acima meta     │
│  Autorização          ████░░░░░░░░░░░░░░░░  1.2 dias                   │
│  Edital               ██████████░░░░░░░░░░  4.0 dias                   │
│  Publicação           ██░░░░░░░░░░░░░░░░░░  0.5 dias                   │
│  Sessão               ████████████████░░░░  6.8 dias                   │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  🔍 GARGALOS IDENTIFICADOS                                             │
│                                                                         │
│  ⚠️ Parecer Jurídico: DEJUR com tempo 40% acima da meta                │
│     Sugestão: Considerar contratação temporária ou redistribuição      │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📋 PEDIDOS LAI                                                        │
│                                                                         │
│  Recebidos: 42 · Respondidos no prazo: 40 (95%) · Pendentes: 2         │
│  Tempo médio de resposta: 8.3 dias (meta: 20)                          │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  🔒 AUDITORIA (TCE/CGU)                                                │
│                                                                         │
│  Processos auditáveis: 847                                              │
│  Trilha de auditoria: ✓ 100% completa                                  │
│  Último backup: Há 2 horas                                             │
│                                                                         │
│                    [Exportar para TCE]  [Gerar Relatório de Gestão]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# DIFERENÇAS CHAVE: EMPRESA vs ÓRGÃO PÚBLICO

| Aspecto | Empresa (Lice) | Órgão Público (SMAD) |
|---------|----------------|----------------------|
| **Onboarding** | Auto-cadastro | Contratação + implantação |
| **Autenticação** | Email/senha ou Gov.br | Gov.br obrigatório |
| **Hierarquia** | Simples (admin + users) | Complexa (departamentos, cargos) |
| **Workflows** | Customizáveis | Pré-definidos por lei |
| **Assinatura** | A1/A3 opcional | ICP-Brasil obrigatório (por tipo) |
| **Compliance** | LGPD | LGPD + LAI + e-ARQ + Lei 14.133 |
| **Transparência** | Interna | Portal do Cidadão obrigatório |
| **Publicação** | Não | Diário Oficial automático |
| **Auditoria** | Interna | TCE, CGU, MP |
| **Prazos** | Flexíveis | Legais (LAI: 20 dias, etc.) |
| **IA foca em** | Produtividade | Conformidade legal |

---

# RESUMO DO FLUXO — ÓRGÃO PÚBLICO

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     JORNADA DO DOCUMENTO (GOV)                         │
└─────────────────────────────────────────────────────────────────────────┘

     ENTRADA                    PROCESSAMENTO                    USO
        │                            │                            │
        ▼                            ▼                            ▼
   ┌─────────┐                 ┌──────────┐                 ┌──────────┐
   │ Upload  │                 │   IA     │                 │  MEU DIA │
   │ SEI     │────────────────▶│ processa │────────────────▶│ mostra   │
   │ Scanner │                 │ classifica                │ prioriza │
   │ e-mail  │                 │ verifica                  │ COMPLIANCE│
   └─────────┘                 │ CONFORMIDADE│              └──────────┘
                               └──────────┘                      │
                                    │                            │
                                    ▼                            ▼
                              ┌──────────┐                 ┌──────────┐
                              │DOCUMENTOS│                 │PROCESSOS │
                              │ e-ARQ    │                 │ workflow │
                              │ temporali│                 │ LEGAL    │
                              │ classific│                 │ múltiplos│
                              └──────────┘                 │ níveis   │
                                    │                      └──────────┘
                                    │                            │
                                    ▼                            ▼
                              ┌──────────┐                 ┌──────────┐
                              │ASSINATURAS                 │ ANÁLISES │
                              │ ICP-Brasil│                 │ TCE/CGU  │
                              │ Gov.br   │                 │ LAI      │
                              │ TSA      │                 │ gestão   │
                              └──────────┘                 └──────────┘
                                    │                            │
                                    │                            │
                                    ▼                            ▼
                              ┌──────────┐                 ┌──────────┐
                              │PUBLICAÇÃO│                 │ PORTAL   │
                              │ DOE      │                 │ CIDADÃO  │
                              │ PNCP     │                 │ LAI      │
                              │ Portal   │                 │ Transpar.│
                              └──────────┘                 └──────────┘
```

---

Quer que eu detalhe algum fluxo específico do setor público?
