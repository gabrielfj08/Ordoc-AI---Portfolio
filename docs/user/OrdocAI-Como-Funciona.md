# OrdocAI — Como Funciona o Sistema
## Fluxo Completo: Do Onboarding ao Uso Diário

---

## CENÁRIO BASE

```
EMPRESA: Lice Consultoria em Licitações Ltda
CNPJ: 12.345.678/0001-90
ADMIN: Paula Mendes (paula@lice.com)
SEGMENTO: Consultoria para licitações públicas
```

---

# PARTE 1: ONBOARDING (Primeira Vez)

## 1.1 Paula Acessa o Site

```
┌─────────────────────────────────────────────────────────────────┐
│  ordocai.com.br                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│            Elimine o tempo entre a pergunta                     │
│            e a resposta sobre qualquer documento.               │
│                                                                 │
│            [Começar Grátis]  [Fazer Login]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Paula clica em **[Começar Grátis]**

---

## 1.2 Cadastro da Organização

```
┌─────────────────────────────────────────────────────────────────┐
│  Criar sua conta                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Como você vai usar o OrdocAI?                                  │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Empresa/   │  │   Órgão     │  │  Uso        │             │
│  │  Escritório │  │   Público   │  │  Pessoal    │             │
│  │      ✓      │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  CNPJ: [12.345.678/0001-90]                                    │
│                                           [Buscar Dados]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE POR BAIXO:**

```
POST /api/v1/onboarding/organization/

1. Frontend envia CNPJ
2. Backend chama IntegrationService (ordoc_integrations)
3. IntegrationService verifica cache Redis
4. [CACHE MISS] → Chama API Receita Federal
5. Retorna dados:
   {
     "razao_social": "Lice Consultoria em Licitações Ltda",
     "nome_fantasia": "Lice",
     "cnae_principal": "70.20-4-00 - Consultoria em gestão empresarial",
     "endereco": "Rua das Licitações, 100 - Curitiba/PR",
     "situacao": "ATIVA",
     "socios": [
       {"nome": "Paula Mendes", "qualificacao": "Sócio-Administrador"}
     ]
   }
6. Armazena em IntegrationCache (evita nova consulta)
7. Retorna para frontend
```

**O QUE PAULA VÊ:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Dados encontrados                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Razão Social: Lice Consultoria em Licitações Ltda             │
│  Nome Fantasia: Lice                                            │
│  CNAE: Consultoria em gestão empresarial                        │
│  Endereço: Rua das Licitações, 100 - Curitiba/PR               │
│  Situação: ✓ ATIVA                                              │
│                                                                 │
│  ──────────────────────────────────────────────────────────────│
│                                                                 │
│  Seus dados de acesso:                                          │
│                                                                 │
│  Nome completo: [Paula Mendes]        (pré-preenchido)         │
│  Email: [paula@lice.com]                                        │
│  Senha: [••••••••••]                                            │
│  Confirmar: [••••••••••]                                        │
│                                                                 │
│  [ ] Aceito os Termos de Uso e Política de Privacidade         │
│                                                                 │
│                                    [Criar Conta]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Criação do Tenant

**O QUE ACONTECE POR BAIXO:**

```
POST /api/v1/onboarding/complete/

1. Cria Tenant (organização)
   Tenant.objects.create(
       type='ORGANIZATION',
       name='Lice Consultoria em Licitações Ltda',
       cnpj='12345678000190',
       segment='CONSULTING',  # detectado pelo CNAE
       plan='TRIAL',
       trial_ends_at=now() + 14 days
   )

2. Cria User (Paula)
   User.objects.create(
       email='paula@lice.com',
       name='Paula Mendes',
       tenant=tenant,
       role='ADMIN',
       is_owner=True
   )

3. Cria estrutura inicial de pastas
   Folder.objects.bulk_create([
       Folder(tenant=tenant, name='Contratos', type='CONTRACT'),
       Folder(tenant=tenant, name='Propostas', type='PROPOSAL'),
       Folder(tenant=tenant, name='Licitações', type='BIDDING'),
       Folder(tenant=tenant, name='Documentos Internos', type='INTERNAL'),
   ])

4. Cria workflows padrão para o segmento
   # Detectou CNAE de consultoria em licitações
   # Aplica templates específicos
   ProcedureTemplate.objects.create(
       tenant=tenant,
       name='Proposta de Licitação',
       steps=[
           {'name': 'Elaboração', 'responsible_role': 'ANALYST'},
           {'name': 'Revisão Jurídica', 'responsible_role': 'LEGAL'},
           {'name': 'Aprovação', 'responsible_role': 'ADMIN'},
           {'name': 'Envio', 'responsible_role': 'ANALYST'},
       ]
   )

5. Envia email de boas-vindas
   send_welcome_email(user=paula, tenant=tenant)

6. Gera JWT com tenant_id
   token = generate_jwt(user_id=paula.id, tenant_id=tenant.id)
```

---

## 1.4 Primeiro Acesso — Tela "Meu Dia"

Paula é redirecionada para o dashboard:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI    [🔍 Buscar documentos...]           🔔  Paula ▼  Lice      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────┐ ┌────────────┐ ┌───────────┐ ┌─────────────┐ ┌──────────┐ │
│  │ MEU DIA│ │ DOCUMENTOS │ │ PROCESSOS │ │ ASSINATURAS │ │ ANÁLISES │ │
│  │   ●    │ │            │ │           │ │             │ │          │ │
│  └────────┘ └────────────┘ └───────────┘ └─────────────┘ └──────────┘ │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   👋 Bem-vinda, Paula!                                          │   │
│  │                                                                  │   │
│  │   Sua conta está pronta. Vamos começar?                         │   │
│  │                                                                  │   │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │   │
│  │   │ 📤 Fazer Upload │  │ 🔗 Conectar     │  │ 📥 Importar    │  │   │
│  │   │    de Documento │  │    Google Drive │  │    Pasta       │  │   │
│  │   └─────────────────┘  └─────────────────┘  └────────────────┘  │   │
│  │                                                                  │   │
│  │   💡 Dica: Faça upload de um documento e veja a mágica          │   │
│  │      acontecer. A IA vai extrair informações automaticamente.   │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 2: O EPICENTRO — UPLOAD DO PRIMEIRO DOCUMENTO

## 2.1 Paula Faz Upload

Paula clica em **[📤 Fazer Upload de Documento]**

Ela arrasta um PDF: `Proposta_Licitacao_Prefeitura_Curitiba_2025.pdf`

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Upload de Documento                                              [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │     📄 Proposta_Licitacao_Prefeitura_Curitiba_2025.pdf          │   │
│  │        2.3 MB                                                    │   │
│  │                                                                  │   │
│  │     [████████████████████████████████████] 100%                 │   │
│  │                                                                  │   │
│  │     ✓ Upload concluído                                          │   │
│  │     ⏳ Processando com IA...                                    │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 O Que Acontece Por Baixo (Pipeline Completo)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE DE PROCESSAMENTO                        │
└─────────────────────────────────────────────────────────────────────────┘

FASE 1: UPLOAD (Síncrono - ~2 segundos)
═══════════════════════════════════════

    POST /api/v1/ordoc-air/documents/ (multipart/form-data)
    
    │
    ▼
    
    [Django View]
    │
    ├── 1. Valida arquivo (tipo, tamanho, vírus)
    │
    ├── 2. Salva no Storage (S3 ou local)
    │       path: /tenants/lice-123/documents/2025/01/abc123.pdf
    │
    ├── 3. Cria registro no PostgreSQL
    │       Document.objects.create(
    │           tenant=lice,
    │           uploaded_by=paula,
    │           original_name='Proposta_Licitacao_Prefeitura_Curitiba_2025.pdf',
    │           file_path='/tenants/lice-123/documents/2025/01/abc123.pdf',
    │           status='PROCESSING',
    │           file_size=2300000,
    │           mime_type='application/pdf'
    │       )
    │
    ├── 4. Enfileira tarefas no Redis
    │       enqueue_task('process_document', document_id=doc.id)
    │
    └── 5. Retorna 201 Created
            {
              "id": "doc_abc123",
              "status": "processing",
              "message": "Documento recebido. Processando..."
            }
    
    ↓ Paula recebe resposta imediata
    ↓ Pode continuar usando o sistema


FASE 2: OCR + INDEXAÇÃO (Assíncrono - ~10-30 segundos)
═══════════════════════════════════════════════════════

    [Celery Worker - Task: process_document]
    │
    ├── 6. Lê arquivo do Storage
    │
    ├── 7. Executa OCR (se necessário)
    │       # Usa Apache Tika ou similar
    │       extracted_text = ocr_service.extract(file)
    │       
    │       # Resultado:
    │       """
    │       PROPOSTA COMERCIAL
    │       PREGÃO ELETRÔNICO Nº 045/2025
    │       PREFEITURA MUNICIPAL DE CURITIBA
    │       
    │       OBJETO: Contratação de serviços de consultoria...
    │       VALOR GLOBAL: R$ 450.000,00
    │       PRAZO DE EXECUÇÃO: 12 meses
    │       VALIDADE DA PROPOSTA: 60 dias
    │       
    │       EMPRESA: Lice Consultoria em Licitações Ltda
    │       CNPJ: 12.345.678/0001-90
    │       ...
    │       """
    │
    ├── 8. Persiste texto extraído
    │       document.extracted_text = extracted_text
    │       document.save()
    │
    ├── 9. Indexa no Apache Solr
    │       solr.index({
    │           'id': 'doc_abc123',
    │           'tenant_id': 'lice-123',
    │           'content': extracted_text,
    │           'filename': 'Proposta_Licitacao...',
    │           'created_at': '2025-01-01T10:30:00Z'
    │       })
    │
    └── 10. Dispara signal para Intelligence
            post_save.send(Document, instance=document)


FASE 3: INTELLIGENCE (Assíncrono - ~15-45 segundos)
═══════════════════════════════════════════════════

    [Signal: post_save(Document)]
    │
    ├── 11. IntelligenceSignals captura evento
    │
    └── 12. Enfileira análise
            enqueue_task('analyze_document_async', document_id=doc.id)
    
    
    [Celery Worker - Task: analyze_document_async]
    │
    ├── 13. Carrega documento + contexto
    │       document = Document.objects.get(id=doc_id)
    │       tenant_context = get_tenant_context(document.tenant)
    │
    ├── 14. Constrói prompt para LLM
    │       prompt = f"""
    │       Analise este documento e extraia:
    │       1. Tipo de documento
    │       2. Partes envolvidas (com CPF/CNPJ se houver)
    │       3. Valores monetários
    │       4. Datas importantes
    │       5. Obrigações/cláusulas principais
    │       6. Riscos ou alertas
    │       
    │       Contexto da organização: {tenant_context}
    │       
    │       Documento:
    │       {document.extracted_text}
    │       """
    │
    ├── 15. Chama Ollama (LLM local)
    │       response = ollama.generate(
    │           model='llama3.2',
    │           prompt=prompt,
    │           format='json'
    │       )
    │
    ├── 16. Parse da resposta
    │       analysis = {
    │           "document_type": "PROPOSAL",
    │           "document_subtype": "BIDDING_PROPOSAL",
    │           "title": "Proposta Pregão 045/2025 - Prefeitura Curitiba",
    │           
    │           "entities": [
    │               {"type": "ORGANIZATION", "name": "Prefeitura Municipal de Curitiba", "role": "CONTRACTOR"},
    │               {"type": "ORGANIZATION", "name": "Lice Consultoria", "cnpj": "12.345.678/0001-90", "role": "BIDDER"},
    │               {"type": "PROCESS", "number": "045/2025", "type": "PREGAO_ELETRONICO"}
    │           ],
    │           
    │           "values": [
    │               {"type": "TOTAL", "amount": 450000.00, "currency": "BRL"}
    │           ],
    │           
    │           "dates": [
    │               {"type": "PROPOSAL_VALIDITY", "date": "2025-03-01", "description": "Validade da proposta (60 dias)"},
    │               {"type": "EXECUTION_DEADLINE", "date": "2026-01-01", "description": "Prazo de execução (12 meses)"}
    │           ],
    │           
    │           "suggested_folder": "Licitações",
    │           "suggested_tags": ["prefeitura-curitiba", "pregao", "consultoria", "2025"],
    │           
    │           "alerts": [
    │               {
    │                   "type": "DEADLINE",
    │                   "severity": "HIGH",
    │                   "message": "Proposta válida até 01/03/2025",
    │                   "action": "Acompanhar resultado do pregão"
    │               }
    │           ],
    │           
    │           "summary": "Proposta comercial para o Pregão Eletrônico 045/2025 da Prefeitura de Curitiba. Valor de R$ 450 mil para consultoria em gestão. Validade de 60 dias.",
    │           
    │           "confidence_score": 0.94
    │       }
    │
    ├── 17. Persiste DocumentAnalysis
    │       DocumentAnalysis.objects.create(
    │           document=document,
    │           document_type=analysis['document_type'],
    │           title=analysis['title'],
    │           summary=analysis['summary'],
    │           entities=analysis['entities'],
    │           values=analysis['values'],
    │           dates=analysis['dates'],
    │           confidence=analysis['confidence_score'],
    │           raw_analysis=analysis
    │       )
    │
    ├── 18. Cria ProactiveAlerts
    │       for alert in analysis['alerts']:
    │           ProactiveAlert.objects.create(
    │               tenant=document.tenant,
    │               document=document,
    │               alert_type=alert['type'],
    │               severity=alert['severity'],
    │               message=alert['message'],
    │               suggested_action=alert['action'],
    │               due_date=parse_date(alert)  # se aplicável
    │           )
    │
    ├── 19. Aplica sugestões automaticamente (se configurado)
    │       # Move para pasta sugerida
    │       if tenant.settings.auto_organize:
    │           document.folder = Folder.objects.get(name=analysis['suggested_folder'])
    │       
    │       # Aplica tags sugeridas
    │       for tag_name in analysis['suggested_tags']:
    │           tag, _ = Tag.objects.get_or_create(tenant=tenant, name=tag_name)
    │           document.tags.add(tag)
    │
    ├── 20. Atualiza status do documento
    │       document.status = 'READY'
    │       document.title = analysis['title']  # título extraído pela IA
    │       document.save()
    │
    └── 21. Notifica usuário via WebSocket
            channel_layer.group_send(
                f'user_{paula.id}',
                {
                    'type': 'document.ready',
                    'document_id': document.id,
                    'title': document.title,
                    'alerts_count': len(analysis['alerts'])
                }
            )
```

---

## 2.3 O Que Paula Vê (Resultado Final)

**~30 segundos após o upload**, Paula recebe uma notificação:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔔 Documento processado                                          [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✓ Proposta Pregão 045/2025 - Prefeitura Curitiba                      │
│                                                                         │
│  A IA identificou:                                                      │
│  • Tipo: Proposta de Licitação                                         │
│  • Valor: R$ 450.000,00                                                │
│  • ⚠️ 1 alerta de prazo                                                │
│                                                                         │
│                                              [Ver Documento]            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

Paula clica em **[Ver Documento]** e vai para a tela de detalhes:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI    [🔍 Buscar documentos...]           🔔  Paula ▼  Lice      │
├─────────────────────────────────────────────────────────────────────────┤
│  ← Voltar                                                               │
│                                                                         │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐   │
│  │                                 │  │                            │   │
│  │                                 │  │  📄 Proposta Pregão        │   │
│  │                                 │  │     045/2025               │   │
│  │      [PREVIEW DO PDF]           │  │     Prefeitura Curitiba    │   │
│  │                                 │  │                            │   │
│  │                                 │  │  Status: ✓ Pronto          │   │
│  │                                 │  │  Pasta: 📁 Licitações      │   │
│  │                                 │  │                            │   │
│  │                                 │  │  ─────────────────────────│   │
│  │                                 │  │                            │   │
│  │                                 │  │  🏢 PARTES                 │   │
│  │                                 │  │  • Prefeitura Curitiba     │   │
│  │                                 │  │    (Contratante)           │   │
│  │                                 │  │  • Lice Consultoria        │   │
│  │                                 │  │    CNPJ: 12.345.678/0001-90│   │
│  │                                 │  │                            │   │
│  │                                 │  │  💰 VALORES                │   │
│  │                                 │  │  R$ 450.000,00             │   │
│  │                                 │  │                            │   │
│  │                                 │  │  📅 DATAS                  │   │
│  │                                 │  │  • Validade: 01/03/2025    │   │
│  │                                 │  │  • Execução: 12 meses      │   │
│  │                                 │  │                            │   │
│  └─────────────────────────────────┘  │  ─────────────────────────│   │
│                                        │                            │   │
│                                        │  ⚠️ ALERTAS               │   │
│                                        │  ┌────────────────────────┐│   │
│                                        │  │ 🔴 Prazo: 01/03/2025   ││   │
│                                        │  │ Proposta válida por    ││   │
│                                        │  │ mais 59 dias           ││   │
│                                        │  │                        ││   │
│                                        │  │ [Criar Lembrete]       ││   │
│                                        │  │ [Iniciar Processo]     ││   │
│                                        │  └────────────────────────┘│   │
│                                        │                            │   │
│                                        │  🏷️ TAGS                  │   │
│                                        │  prefeitura-curitiba       │   │
│                                        │  pregao · consultoria      │   │
│                                        │  2025                      │   │
│                                        │                            │   │
│                                        │  ─────────────────────────│   │
│                                        │                            │   │
│                                        │  [✍️ Assinar]              │   │
│                                        │  [📤 Compartilhar]         │   │
│                                        │  [🔄 Iniciar Workflow]     │   │
│                                        │                            │   │
│                                        └────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 3: FLUXOS DE USO DIÁRIO

## 3.1 Paula na Tela "Meu Dia" (Depois de Alguns Documentos)

Após uma semana de uso, Paula acessa o sistema:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI    [🔍 Buscar documentos...]           🔔 3  Paula ▼  Lice    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────┐ ┌────────────┐ ┌───────────┐ ┌─────────────┐ ┌──────────┐ │
│  │ MEU DIA│ │ DOCUMENTOS │ │ PROCESSOS │ │ ASSINATURAS │ │ ANÁLISES │ │
│  │   ●    │ │     47     │ │     3     │ │      5      │ │          │ │
│  └────────┘ └────────────┘ └───────────┘ └─────────────┘ └──────────┘ │
│                                                                         │
│  Bom dia, Paula! Aqui está seu resumo:                                 │
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │ 🔴 3          │  │ ✍️ 5          │  │ ⏰ 2          │               │
│  │ Ações         │  │ Aguardando    │  │ Vencem        │               │
│  │ urgentes      │  │ sua assinatura│  │ esta semana   │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📋 SUA FILA DE TRABALHO (priorizada por IA)                           │
│                                                                         │
│  ┌─────────┬─────────┬───────────┐                                     │
│  │ Urgente │Assinat. │ Aprovações│                                     │
│  │   (3)   │  (5)    │    (2)    │                                     │
│  └─────────┴─────────┴───────────┘                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 CRÍTICO                                          Vence em 2h │   │
│  │                                                                  │   │
│  │ Contrato de Prestação de Serviços - Prefeitura Curitiba         │   │
│  │ Valor: R$ 450.000,00 · Precisa da sua assinatura                │   │
│  │                                                                  │   │
│  │ ⚠️ IA: "Cláusula 12.3 tem multa de 5% ao dia por atraso"        │   │
│  │                                                                  │   │
│  │                        [Revisar e Assinar]  [Delegar]           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 ALTO                                             Vence hoje  │   │
│  │                                                                  │   │
│  │ Parecer Jurídico - Edital 078/2025                              │   │
│  │ Aguardando aprovação · Solicitado por: Carlos (Jurídico)        │   │
│  │                                                                  │   │
│  │                              [Ver Parecer]  [Aprovar]  [Rejeitar]│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🟢 NORMAL                                        Vence em 3 dias │   │
│  │                                                                  │   │
│  │ Proposta Técnica - Pregão Estadual 023/2025                     │   │
│  │ Precisa revisão final antes do envio                            │   │
│  │                                                                  │   │
│  │                                          [Abrir]  [Arquivar]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  💡 SUGESTÕES DA IA                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 "Detectei 4 propostas similares do mês passado.              │   │
│  │     Quer criar um template automático?"                          │   │
│  │                                                                  │   │
│  │     [Sim, criar template]  [Ignorar]  [Lembrar depois]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 Paula Assina o Contrato (One-Click)

Paula clica em **[Revisar e Assinar]** no contrato crítico:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Assinatura Digital                                               [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📄 Contrato de Prestação de Serviços - Prefeitura Curitiba            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  [PREVIEW DO CONTRATO - Página com local de assinatura]         │   │
│  │                                                                  │   │
│  │                    IA detectou: Campo de assinatura na pág. 12  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│  Certificado Digital:                                                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ✓ PAULA MENDES                                                 │   │
│  │    Certificado A1 · Válido até 15/08/2026                       │   │
│  │    AC: Certisign                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [ ] Adicionar carimbo do tempo                                        │
│  [ ] Notificar outras partes após assinatura                           │
│                                                                         │
│                                                                         │
│            ┌─────────────────────────────────────────┐                 │
│            │                                         │                 │
│            │     [  🔐 ASSINAR COM CERTIFICADO  ]    │                 │
│            │                                         │                 │
│            │         1 clique · Validade jurídica    │                 │
│            │                                         │                 │
│            └─────────────────────────────────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE AO CLICAR:**

```
POST /api/v1/ordoc-sign/documents/{doc_id}/sign/

1. Carrega certificado da Paula (já autenticado na sessão)
2. Lê documento do Storage
3. Calcula hash SHA-256 do documento
4. Assina hash com chave privada do certificado
5. Embute assinatura no PDF (PAdES)
6. Se marcado: solicita carimbo do tempo (TSA)
7. Salva documento assinado
8. Cria SignatureEvidence:
   - IP: 189.45.xxx.xxx
   - Timestamp: 2025-01-01T10:45:32Z
   - Certificado: CN=Paula Mendes, OU=Lice...
   - Hash original
   - Geolocalização (se autorizado)
9. Atualiza status: document.status = 'SIGNED'
10. Dispara notificações se configurado
11. Retorna sucesso

Tempo total: ~3 segundos
```

**Paula vê:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    ✓ Documento assinado com sucesso!                   │
│                                                                         │
│     Contrato de Prestação de Serviços - Prefeitura Curitiba            │
│                                                                         │
│     Assinado em: 01/01/2025 às 10:45                                   │
│     Certificado: Paula Mendes (A1 - Certisign)                         │
│     Carimbo do tempo: ✓ Aplicado                                       │
│                                                                         │
│     [Baixar PDF Assinado]  [Ver Manifesto]  [Fechar]                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.3 Buscando Documentos (Busca Conversacional)

Paula quer encontrar um documento antigo. Ela digita na busca:

```
🔍 "aquele contrato com a prefeitura que tinha cláusula de não competição"
```

**O QUE ACONTECE:**

```
POST /api/v1/search/conversational/

1. Recebe query em linguagem natural
2. Passa para LLM interpretar intenção:
   - Tipo: contrato
   - Entidade: prefeitura (qualquer)
   - Cláusula específica: não competição
   
3. Converte para filtros Solr:
   query = {
       'q': 'não competição OR não-competição OR non-compete',
       'fq': [
           'tenant_id:lice-123',
           'document_type:CONTRACT',
           'entities.type:GOVERNMENT'
       ]
   }

4. Executa busca no Solr
5. Se Vector DB implementado: também faz similarity search
6. Ranqueia resultados por relevância
7. Retorna com snippets destacados
```

**Paula vê:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Resultados para: "aquele contrato com a prefeitura que tinha          │
│                    cláusula de não competição"                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  3 documentos encontrados                                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📄 Contrato de Consultoria - Prefeitura de Londrina            │   │
│  │    Março 2024 · R$ 280.000                                      │   │
│  │                                                                  │   │
│  │    "...CLÁUSULA 8ª - DA NÃO COMPETIÇÃO: A CONTRATADA           │   │
│  │    compromete-se a não prestar serviços similares..."           │   │
│  │                                                                  │   │
│  │    [Abrir]  [Ver Cláusula]                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📄 Contrato de Assessoria - Prefeitura de Maringá              │   │
│  │    Janeiro 2024 · R$ 150.000                                    │   │
│  │    ...                                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.4 Iniciando um Workflow (Processo)

Paula quer que uma nova proposta passe por revisão. Ela clica em **[🔄 Iniciar Workflow]**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Iniciar Workflow                                                 [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📄 Documento: Proposta Técnica - Pregão 089/2025                      │
│                                                                         │
│  Selecione o tipo de processo:                                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ● Proposta de Licitação (recomendado pela IA)                   │   │
│  │   4 etapas: Elaboração → Revisão Jurídica → Aprovação → Envio   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Contrato Padrão                                               │   │
│  │   3 etapas: Revisão → Aprovação → Assinatura                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Personalizado                                                 │   │
│  │   Criar novo fluxo do zero                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│  Responsáveis:                                                          │
│                                                                         │
│  Etapa 1 - Elaboração:     [Paula Mendes ▼]         (você)            │
│  Etapa 2 - Revisão:        [Carlos Silva ▼]         (Jurídico)        │
│  Etapa 3 - Aprovação:      [Paula Mendes ▼]         (Admin)           │
│  Etapa 4 - Envio:          [Maria Santos ▼]         (Operacional)     │
│                                                                         │
│  Prazo final: [15/01/2025]                                             │
│                                                                         │
│                                           [Cancelar]  [Iniciar]        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Após clicar em [Iniciar]:**

```
POST /api/v1/ordoc-flow/workflow-requests/start/

1. Cria WorkflowRequest
2. Cria ProcedureTasks para cada etapa
3. Enfileira notificações
4. Primeira etapa já é de Paula (auto-atribuída)
5. Retorna 201
```

Paula vê na tela **PROCESSOS**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROCESSOS                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📄 Proposta Técnica - Pregão 089/2025                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ✅ Elaboração        ⏳ Revisão         ○ Aprovação    ○ Envio │   │
│  │     Paula               Carlos            Paula           Maria  │   │
│  │     Concluído           Aguardando        Pendente       Pendente│   │
│  │     (agora)             (próximo)                                │   │
│  │                                                                  │   │
│  │  ────────●─────────────○─────────────○───────────○────────────  │   │
│  │                                                                  │   │
│  │  Previsão de conclusão: 12/01/2025                              │   │
│  │  SLA: ✓ Dentro do prazo                                         │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.5 Carlos Recebe a Notificação (Outro Usuário)

Carlos (do jurídico) recebe:

**Email:**
```
Assunto: 📋 Nova tarefa aguardando sua revisão

Olá Carlos,

Paula Mendes iniciou um processo que precisa da sua revisão:

📄 Proposta Técnica - Pregão 089/2025
📅 Prazo: 10/01/2025
📝 Etapa: Revisão Jurídica

[Revisar Agora →]

---
OrdocAI - Lice Consultoria
```

**No sistema (quando Carlos acessa):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MEU DIA                                                      Carlos    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 REVISÃO NECESSÁRIA                              Prazo: 3 dias│   │
│  │                                                                  │   │
│  │ Proposta Técnica - Pregão 089/2025                              │   │
│  │ Solicitado por: Paula Mendes                                    │   │
│  │                                                                  │   │
│  │ 💡 IA: "Documento similar ao Pregão 067/2024 que você aprovou"  │   │
│  │                                                                  │   │
│  │                        [Revisar]  [Aprovar Rápido]  [Rejeitar]  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 4: FLUXOS ESPECIAIS

## 4.1 Solicitante Externo (Link/Portal)

A Lice precisa que a **Prefeitura de Curitiba** assine um contrato.

Paula clica em **[📤 Compartilhar para Assinatura]**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Enviar para Assinatura Externa                                   [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📄 Contrato de Prestação de Serviços - Pregão 045/2025               │
│                                                                         │
│  Signatários externos:                                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Nome: [Dr. Roberto Almeida]                                     │   │
│  │ Email: [roberto.almeida@curitiba.pr.gov.br]                     │   │
│  │ Cargo: [Secretário de Administração]                            │   │
│  │ Tipo de assinatura: [● ICP-Brasil  ○ Eletrônica Avançada]      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [+ Adicionar outro signatário]                                        │
│                                                                         │
│  Mensagem personalizada:                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Prezado Dr. Roberto,                                            │   │
│  │                                                                  │   │
│  │ Segue o contrato referente ao Pregão 045/2025 para sua         │   │
│  │ assinatura digital.                                             │   │
│  │                                                                  │   │
│  │ Atenciosamente,                                                 │   │
│  │ Paula Mendes - Lice Consultoria                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Prazo para assinatura: [7 dias ▼]                                     │
│                                                                         │
│  [ ] Enviar lembretes automáticos                                      │
│  [ ] Notificar-me quando assinado                                      │
│                                                                         │
│                                           [Cancelar]  [Enviar]         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O Secretário Roberto recebe email:**

```
Assunto: 📝 Documento aguardando sua assinatura - Lice Consultoria

Prezado Dr. Roberto,

Você recebeu um documento para assinatura digital:

📄 Contrato de Prestação de Serviços - Pregão 045/2025
🏢 Enviado por: Lice Consultoria em Licitações
📅 Prazo: 08/01/2025

[Revisar e Assinar →]

---
Este link é seguro e único. Não compartilhe.
```

**Roberto clica no link e acessa o Portal Externo:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI                                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Olá, Dr. Roberto Almeida                                              │
│  Você tem 1 documento aguardando assinatura.                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  [PREVIEW DO CONTRATO]                                          │   │
│  │                                                                  │   │
│  │  Páginas: 1 de 15                    [◀] [▶]                    │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│  Para assinar, escolha uma opção:                                      │
│                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │ 🔐 Certificado Digital │  │ 🆔 Gov.br              │              │
│  │    ICP-Brasil (A1/A3)  │  │    Login com Gov.br    │              │
│  │                        │  │    (Nível Prata/Ouro)   │              │
│  │    [Inserir Token]     │  │    [Entrar com Gov.br]  │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4.2 Tela de Análises

Paula quer ver métricas do mês:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ANÁLISES                                            Janeiro 2025 ▼    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐           │
│  │      47         │ │      23         │ │     R$ 2.3M     │           │
│  │   Documentos    │ │   Assinaturas   │ │  Valor em       │           │
│  │   processados   │ │   realizadas    │ │  contratos      │           │
│  │   ↑ 12% vs dez  │ │   ↑ 8% vs dez   │ │  ↑ 45% vs dez   │           │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘           │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📊 TEMPO MÉDIO POR PROCESSO                                           │
│                                                                         │
│  Proposta de Licitação    ████████████░░░░░░░░  3.2 dias (meta: 5)    │
│  Contrato Padrão          ██████████████░░░░░░  4.1 dias (meta: 5)    │
│  Parecer Jurídico         ████████░░░░░░░░░░░░  2.0 dias (meta: 3)    │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  🔍 GARGALOS IDENTIFICADOS                                             │
│                                                                         │
│  ⚠️ Carlos Silva está com tempo médio 2x acima da equipe               │
│     Sugestão: Redistribuir ou aumentar capacidade do jurídico          │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  🔒 COMPLIANCE                                                          │
│                                                                         │
│  Certificados válidos: 3/3 ✓                                           │
│  Documentos em conformidade: 47/47 (100%)                              │
│  Trilha de auditoria: ✓ Completa                                       │
│                                                                         │
│                               [Exportar Relatório]  [Agendar Envio]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# RESUMO: COMO TUDO SE CONECTA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          JORNADA DO DOCUMENTO                          │
└─────────────────────────────────────────────────────────────────────────┘

     ENTRADA                    PROCESSAMENTO                    USO
        │                            │                            │
        ▼                            ▼                            ▼
   ┌─────────┐                 ┌──────────┐                 ┌──────────┐
   │ Upload  │                 │   IA     │                 │  MEU DIA │
   │ Drive   │────────────────▶│ processa │────────────────▶│ mostra   │
   │ Email   │                 │ extrai   │                 │ prioriza │
   │ Scanner │                 │ alerta   │                 │ sugere   │
   └─────────┘                 └──────────┘                 └──────────┘
                                    │                            │
                                    │                            │
                                    ▼                            ▼
                              ┌──────────┐                 ┌──────────┐
                              │DOCUMENTOS│                 │PROCESSOS │
                              │ organiza │                 │ workflow │
                              │ busca    │                 │ aprovação│
                              │ versiona │                 │ timeline │
                              └──────────┘                 └──────────┘
                                    │                            │
                                    │                            │
                                    ▼                            ▼
                              ┌──────────┐                 ┌──────────┐
                              │ASSINATURAS                 │ ANÁLISES │
                              │ ICP-Brasil│                 │ métricas │
                              │ coleta   │                 │ gargalos │
                              │ verifica │                 │ compliance│
                              └──────────┘                 └──────────┘
                                    │                            │
                                    │                            │
                                    └──────────────┬─────────────┘
                                                   │
                                                   ▼
                                            ┌──────────┐
                                            │INTELIGENCE
                                            │ aprende  │
                                            │ melhora  │
                                            │ evolui   │
                                            └──────────┘
```

---

# PRÓXIMOS PASSOS PARA DOCUMENTAÇÃO

1. **User Stories detalhadas** para cada fluxo
2. **Wireframes/Mockups** das telas principais
3. **Especificação de API** para cada endpoint
4. **Modelo de dados** completo (ERD)
5. **Casos de teste** para QA

Quer que eu detalhe algum fluxo específico?
