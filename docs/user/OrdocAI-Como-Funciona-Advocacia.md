# OrdocAI — Como Funciona: ESCRITÓRIO DE ADVOCACIA
## Fluxo Completo: Gestão Jurídica

---

## CENÁRIO BASE

```
ESCRITÓRIO: Mendes & Associados Advogados
CNPJ: 33.456.789/0001-00
OAB/SP: 12.345
SÓCIO FUNDADOR: Dr. Fernando Mendes (OAB/SP 98.765)
SÓCIA: Dra. Camila Rocha (OAB/SP 112.456)
EQUIPE: 2 sócios + 5 associados + 3 estagiários + 2 administrativo
ÁREAS: Cível, Trabalhista, Empresarial
CLIENTES: ~80 ativos
PROCESSOS: ~350 em andamento
```

---

# PARTE 1: ONBOARDING (Escritório de Advocacia)

## 1.1 Dr. Fernando Acessa o Site

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ordocai.com.br                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│            Nunca mais perca um prazo.                                  │
│            Nunca mais procure um documento.                            │
│                                                                         │
│            [Começar Grátis - 14 dias]  [Fazer Login]                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

Dr. Fernando clica em **[Começar Grátis]**

---

## 1.2 Cadastro do Escritório

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Criar sua conta                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Como você vai usar o OrdocAI?                                         │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │    Empresa/     │  │   Escritório    │  │    Órgão        │         │
│  │    Geral        │  │   de Advocacia  │  │    Público      │         │
│  │                 │  │       ✓         │  │                 │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Dados do Escritório:                                                   │
│                                                                         │
│  CNPJ: [33.456.789/0001-00]                          [Buscar]          │
│                                                                         │
│  OAB Sociedade: [SP ▼] [12.345]                      [Validar]         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE POR BAIXO:**

```
POST /api/v1/onboarding/law-firm/

1. Busca CNPJ na Receita Federal
   → Razão Social: Mendes & Associados Advogados S/S
   → CNAE: 69.11-7-01 - Serviços advocatícios
   
2. Valida OAB Sociedade na Seccional
   → OAB/SP 12.345 - ATIVA
   → Tipo: Sociedade de Advogados
   
3. Detecta segmento: ESCRITÓRIO DE ADVOCACIA
   
4. Aplica configurações específicas:
   Tenant.objects.create(
       type='ORGANIZATION',
       subtype='LAW_FIRM',
       name='Mendes & Associados Advogados',
       cnpj='33456789000100',
       oab_number='SP-12345',
       
       settings={
           'legal': {
               'court_integration': True,      # Integração tribunais
               'deadline_management': True,    # Gestão de prazos
               'client_portal': True,          # Portal do cliente
               'attorney_privilege': True,     # Sigilo advocatício
           },
           'deadlines': {
               'business_days_default': True,  # Dias úteis padrão
               'court_holidays': True,         # Feriados forenses
               'alert_days': [5, 3, 1, 0],    # Alertas em D-5, D-3, D-1, D-0
           },
           'billing': {
               'timesheet_enabled': True,      # Controle de horas
               'hourly_rate_default': 450.00,  # R$/hora padrão
           }
       }
   )
```

**Dados pré-preenchidos:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✓ Dados validados                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Razão Social: Mendes & Associados Advogados S/S                       │
│  Nome Fantasia: Mendes & Associados                                    │
│  OAB/SP: 12.345 - ✓ ATIVA                                              │
│  Endereço: Av. Paulista, 1000, Sala 1501 - São Paulo/SP               │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Seus dados de acesso (Sócio Responsável):                             │
│                                                                         │
│  Nome: [Dr. Fernando Mendes]                                           │
│  OAB: [SP ▼] [98.765]                                [Validar]         │
│  Email: [fernando@mendesadvogados.com.br]                              │
│  Senha: [••••••••••]                                                    │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Áreas de atuação (selecione):                                         │
│                                                                         │
│  [✓] Cível              [✓] Trabalhista       [ ] Tributário           │
│  [✓] Empresarial        [ ] Criminal          [ ] Família              │
│  [ ] Imobiliário        [ ] Previdenciário    [ ] Consumidor           │
│                                                                         │
│                                               [Criar Conta]            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Estrutura do Escritório

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Configuração da Equipe                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📁 Mendes & Associados Advogados                                      │
│  │                                                                      │
│  ├── 👔 SÓCIOS                                                         │
│  │   ├── Dr. Fernando Mendes (OAB/SP 98.765) [ADMIN]                  │
│  │   │   Áreas: Cível, Empresarial                                     │
│  │   │   Certificado: A3 OAB ✓                                         │
│  │   │                                                                  │
│  │   └── Dra. Camila Rocha (OAB/SP 112.456) [ADMIN]                   │
│  │       Áreas: Trabalhista                                            │
│  │       Certificado: A3 OAB ✓                                         │
│  │                                                                      │
│  ├── 👤 ASSOCIADOS                                                     │
│  │   ├── Dr. Ricardo Lima (OAB/SP 145.678) [LAWYER]                   │
│  │   ├── Dra. Ana Paula Santos (OAB/SP 156.789) [LAWYER]              │
│  │   ├── Dr. Bruno Costa (OAB/SP 167.890) [LAWYER]                    │
│  │   ├── Dra. Juliana Alves (OAB/SP 178.901) [LAWYER]                 │
│  │   └── Dr. Marcos Oliveira (OAB/SP 189.012) [LAWYER]                │
│  │                                                                      │
│  ├── 📚 ESTAGIÁRIOS                                                    │
│  │   ├── Lucas Silva (Estagiário OAB/SP) [INTERN]                     │
│  │   ├── Maria Eduarda Souza (Estagiário OAB/SP) [INTERN]             │
│  │   └── João Pedro Costa (Estagiário OAB/SP) [INTERN]                │
│  │                                                                      │
│  └── 💼 ADMINISTRATIVO                                                 │
│      ├── Carla Ferreira (Secretária) [STAFF]                          │
│      └── Pedro Santos (Financeiro) [STAFF]                            │
│                                                                         │
│  [+ Convidar membro]  [Importar de planilha]                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.4 Configuração de Integrações com Tribunais

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Integrações com Tribunais                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🏛️ TRIBUNAIS — Consulta automática de processos e prazos             │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ JUSTIÇA ESTADUAL                                                │   │
│  │                                                                  │   │
│  │ [✓] TJSP - e-SAJ                              [Configurar ▶]   │   │
│  │     Certificado: A3 OAB do Dr. Fernando                         │   │
│  │     Status: ✓ Conectado                                         │   │
│  │                                                                  │   │
│  │ [ ] TJRJ - e-PROC                             [Conectar]        │   │
│  │ [ ] TJMG - PJe                                [Conectar]        │   │
│  │ [ ] TJPR - PROJUDI                            [Conectar]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ JUSTIÇA DO TRABALHO                                             │   │
│  │                                                                  │   │
│  │ [✓] TRT-2 (SP) - PJe-JT                       [Configurar ▶]   │   │
│  │     Certificado: A3 OAB da Dra. Camila                          │   │
│  │     Status: ✓ Conectado                                         │   │
│  │                                                                  │   │
│  │ [ ] TRT-15 (Campinas)                         [Conectar]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ JUSTIÇA FEDERAL                                                 │   │
│  │                                                                  │   │
│  │ [✓] TRF-3 - PJe                               [Configurar ▶]   │   │
│  │     Status: ✓ Conectado                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ TRIBUNAIS SUPERIORES                                            │   │
│  │                                                                  │   │
│  │ [✓] STJ - e-STJ                               [Conectar]        │   │
│  │ [ ] STF - e-STF                               [Conectar]        │   │
│  │ [✓] TST - PJe-JT                              [Conectar]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ⚙️ Configurações de sincronização:                                    │
│  [✓] Verificar movimentações a cada [1 hora ▼]                        │
│  [✓] Alertar imediatamente sobre intimações                            │
│  [✓] Calcular prazos automaticamente                                   │
│  [✓] Considerar feriados forenses do estado [SP ▼]                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.5 Configuração de Prazos (Crítico!)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Configuração de Prazos Processuais                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⚠️ ATENÇÃO: Perda de prazo pode gerar responsabilidade civil          │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📅 CÁLCULO DE PRAZOS                                                  │
│                                                                         │
│  Contagem padrão: [● Dias úteis  ○ Dias corridos]                     │
│                                                                         │
│  Considerar feriados:                                                   │
│  [✓] Feriados nacionais                                                │
│  [✓] Feriados estaduais (SP)                                           │
│  [✓] Feriados municipais (São Paulo capital)                           │
│  [✓] Feriados forenses (recesso, suspensão)                            │
│  [✓] Dias sem expediente forense                                       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  🔔 ALERTAS DE PRAZO                                                   │
│                                                                         │
│  Notificar responsável:                                                 │
│  [✓] 5 dias úteis antes     Via: [✓] Email [✓] Push [✓] WhatsApp     │
│  [✓] 3 dias úteis antes     Via: [✓] Email [✓] Push [✓] WhatsApp     │
│  [✓] 1 dia útil antes       Via: [✓] Email [✓] Push [✓] WhatsApp     │
│  [✓] No dia do vencimento   Via: [✓] Email [✓] Push [✓] WhatsApp     │
│                                                                         │
│  Notificar sócio responsável:                                          │
│  [✓] 2 dias úteis antes (se não houver ação)                          │
│  [✓] No dia do vencimento                                              │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ⏰ PRAZOS PADRÃO POR TIPO                                             │
│                                                                         │
│  │ Tipo de prazo              │ Dias │ Contagem    │                   │
│  │────────────────────────────│──────│─────────────│                   │
│  │ Contestação (Cível)        │  15  │ Dias úteis  │                   │
│  │ Contestação (Trabalhista)  │   5  │ Dias úteis  │                   │
│  │ Recurso Ordinário          │   8  │ Dias úteis  │                   │
│  │ Apelação                   │  15  │ Dias úteis  │                   │
│  │ Agravo de Instrumento      │  15  │ Dias úteis  │                   │
│  │ Embargos de Declaração     │   5  │ Dias úteis  │                   │
│  │ Recurso Especial           │  15  │ Dias úteis  │                   │
│  │ Recurso Extraordinário     │  15  │ Dias úteis  │                   │
│  │ Cumprimento de Sentença    │  15  │ Dias úteis  │                   │
│                                                                         │
│  [+ Adicionar tipo de prazo personalizado]                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.6 Cadastro de Clientes e Processos

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Importação Inicial                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Importe seus clientes e processos:                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📋 CLIENTES                                                     │   │
│  │                                                                  │   │
│  │ [Importar de planilha Excel]                                    │   │
│  │ [Importar do software anterior (Projuris, Themis, etc.)]       │   │
│  │ [Cadastrar manualmente]                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚖️ PROCESSOS                                                    │   │
│  │                                                                  │   │
│  │ [Importar números de processo em lote]                          │   │
│  │                                                                  │   │
│  │ Cole os números dos processos (um por linha):                   │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ 1234567-89.2024.8.26.0100                                   │ │   │
│  │ │ 0001234-56.2024.5.02.0001                                   │ │   │
│  │ │ 5001234-67.2024.4.03.6100                                   │ │   │
│  │ │ ...                                                          │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │ [✓] Buscar dados automaticamente nos tribunais                  │   │
│  │ [✓] Criar alertas para prazos em aberto                        │   │
│  │ [✓] Vincular ao cliente (se informado)                         │   │
│  │                                                                  │   │
│  │                                        [Importar 350 processos] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE NA IMPORTAÇÃO:**

```
POST /api/v1/legal/cases/bulk-import/

Para cada número de processo:

1. Identifica o tribunal pelo padrão CNJ
   1234567-89.2024.8.26.0100
   └─ 8.26 = TJSP

2. Consulta API do tribunal (e-SAJ)
   → Partes: Autor vs Réu
   → Classe: Procedimento Comum Cível
   → Assunto: Indenização por Dano Moral
   → Valor da causa: R$ 50.000,00
   → Vara: 10ª Vara Cível - Foro Central
   → Status: Em andamento
   → Última movimentação: 15/12/2024
   → Prazos em aberto: Contestação (vence 20/01/2025)

3. Cria registro no sistema
   Case.objects.create(
       tenant=escritorio,
       number='1234567-89.2024.8.26.0100',
       court='TJSP',
       type='PROCEDIMENTO_COMUM',
       subject='INDENIZACAO_DANO_MORAL',
       value=50000.00,
       status='ACTIVE',
       client=cliente_vinculado,
       responsible=advogado_designado,
   )

4. Cria alertas de prazo
   Deadline.objects.create(
       case=case,
       type='CONTESTACAO',
       due_date='2025-01-20',
       business_days=True,
       responsible=advogado,
       alerts=[D-5, D-3, D-1, D-0]
   )

5. Agenda monitoramento automático
   schedule_monitoring(case, interval='1_hour')
```

---

# PARTE 2: USO DIÁRIO — ESCRITÓRIO DE ADVOCACIA

## 2.1 Dra. Ana Paula (Associada) - Tela "Meu Dia"

Dra. Ana Paula chega ao escritório e acessa o sistema:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OrdocAI    [🔍 Buscar processos...]      🔔 5  Dra. Ana Paula  M&A    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────┐ ┌────────────┐ ┌───────────┐ ┌─────────────┐ ┌──────────┐ │
│  │ MEU DIA│ │ DOCUMENTOS │ │ PROCESSOS │ │ ASSINATURAS │ │ ANÁLISES │ │
│  │   ●    │ │            │ │    47     │ │      3      │ │          │ │
│  └────────┘ └────────────┘ └───────────┘ └─────────────┘ └──────────┘ │
│                                                                         │
│  Bom dia, Dra. Ana Paula!                                              │
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │ 🔴 3          │  │ ⚠️ 8          │  │ 📬 12         │               │
│  │ Prazos        │  │ Vencem        │  │ Intimações    │               │
│  │ HOJE          │  │ esta semana   │  │ novas         │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  ⚖️ PRAZOS DO DIA (prioridade absoluta)                                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 VENCE HOJE — 18:00                                           │   │
│  │                                                                  │   │
│  │ Processo: 1234567-89.2024.8.26.0100                             │   │
│  │ Cliente: Empresa ABC Ltda                                        │   │
│  │ Tipo: CONTESTAÇÃO                                                │   │
│  │ Tribunal: TJSP - 10ª Vara Cível                                 │   │
│  │                                                                  │   │
│  │ 💡 IA: "Minuta já elaborada por você em 10/01. Revisar e        │   │
│  │        protocolar. Tempo estimado: 2h"                          │   │
│  │                                                                  │   │
│  │ 📄 Arquivos vinculados:                                         │   │
│  │    • Minuta_Contestacao_ABC_v3.docx (última versão)             │   │
│  │    • Procuração_ABC.pdf                                         │   │
│  │    • Documentos_Defesa.zip                                      │   │
│  │                                                                  │   │
│  │              [Abrir Minuta]  [Protocolar no e-SAJ]  [Delegar]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 VENCE HOJE — 23:59                                           │   │
│  │                                                                  │   │
│  │ Processo: 0001234-56.2024.5.02.0001                             │   │
│  │ Cliente: João da Silva (Reclamante)                             │   │
│  │ Tipo: RECURSO ORDINÁRIO                                          │   │
│  │ Tribunal: TRT-2                                                  │   │
│  │                                                                  │   │
│  │ ⚠️ IA: "Recurso ainda não iniciado. ATENÇÃO!"                   │   │
│  │                                                                  │   │
│  │                    [Iniciar Recurso]  [Escalar p/ Sócio]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 VENCE AMANHÃ                                                 │   │
│  │                                                                  │   │
│  │ Processo: 5001234-67.2024.4.03.6100                             │   │
│  │ Cliente: Indústria XYZ S.A.                                     │   │
│  │ Tipo: MANIFESTAÇÃO sobre laudo pericial                         │   │
│  │                                                                  │   │
│  │ 💡 IA: "Laudo favorável ao cliente. Sugestão: concordar         │   │
│  │        com conclusões principais."                              │   │
│  │                                                                  │   │
│  │                         [Ver Laudo]  [Elaborar Manifestação]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📬 INTIMAÇÕES RECENTES (últimas 24h)                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📩 NOVA INTIMAÇÃO — Recebida há 2h                              │   │
│  │                                                                  │   │
│  │ Processo: 9876543-21.2024.8.26.0100                             │   │
│  │ Cliente: Maria Souza                                            │   │
│  │ Teor: "Intimação para audiência de instrução"                   │   │
│  │ Data: 15/02/2025 às 14:00                                       │   │
│  │                                                                  │   │
│  │ 💡 IA: "Prazo criado automaticamente. Audiência agendada."      │   │
│  │                                                                  │   │
│  │                           [Ver Intimação]  [Marcar como Lida]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Ver todas as 12 intimações →]                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 Monitoramento Automático de Processos

O sistema monitora os tribunais automaticamente:

```
[Celery Beat - A cada 1 hora]

1. Para cada processo ativo:
   → Consulta API do tribunal
   → Compara última movimentação
   
2. Se houver nova movimentação:
   
   CaseMovement.objects.create(
       case=case,
       date='2025-01-15 10:30:00',
       type='INTIMACAO',
       description='Intimação para contestação',
       raw_data={...}
   )
   
3. IA analisa a movimentação:
   
   prompt = """
   Analise esta movimentação processual:
   
   Processo: 1234567-89.2024.8.26.0100
   Tipo: Intimação
   Teor: "Intime-se a parte ré para apresentar contestação 
          no prazo legal, sob pena de revelia."
   
   Extraia:
   1. Tipo de prazo
   2. Prazo em dias
   3. Contagem (úteis/corridos)
   4. Data final
   5. Ações necessárias
   6. Urgência
   """
   
   Resultado:
   {
       "deadline_type": "CONTESTACAO",
       "days": 15,
       "business_days": true,
       "due_date": "2025-02-05",
       "actions": ["Elaborar contestação", "Reunir documentos de defesa"],
       "urgency": "HIGH",
       "consequences": "Revelia - presunção de veracidade dos fatos"
   }

4. Cria prazo automaticamente:
   
   Deadline.objects.create(
       case=case,
       type='CONTESTACAO',
       due_date='2025-02-05',
       origin='INTIMACAO',
       origin_date='2025-01-15',
       responsible=case.responsible,
       urgency='HIGH',
       notes='Intimação para contestação. Prazo de 15 dias úteis.'
   )

5. Notifica advogado responsável:
   
   Notification.send(
       to=advogado,
       channels=['EMAIL', 'WHATSAPP', 'PUSH'],
       template='new_deadline',
       context={
           'process': '1234567-89.2024.8.26.0100',
           'client': 'Empresa ABC',
           'deadline_type': 'Contestação',
           'due_date': '05/02/2025',
           'days_remaining': 15
       }
   )
```

---

## 2.3 Dra. Ana Paula Elabora a Contestação

Dra. Ana Paula clica em **[Abrir Minuta]** e trabalha no documento:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Elaboração de Peça — Contestação                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Processo: 1234567-89.2024.8.26.0100 · Empresa ABC vs. João Silva      │
│  Prazo: 05/02/2025 (15 dias úteis) ⏰ Restam 12 dias                   │
│                                                                         │
│  ┌────────────────────────────────┐  ┌─────────────────────────────┐   │
│  │                                │  │                             │   │
│  │  [EDITOR DE DOCUMENTO]         │  │  🤖 ASSISTENTE JURÍDICO    │   │
│  │                                │  │                             │   │
│  │  EXCELENTÍSSIMO SENHOR DOUTOR │  │  📋 Sugestões da IA:        │   │
│  │  JUIZ DE DIREITO DA 10ª VARA  │  │                             │   │
│  │  CÍVEL DO FORO CENTRAL DA     │  │  • Preliminar de           │   │
│  │  COMARCA DE SÃO PAULO - SP    │  │    inépcia da inicial      │   │
│  │                                │  │    (pedido genérico)       │   │
│  │  Processo nº 1234567-89...    │  │                             │   │
│  │                                │  │  • Impugnação ao valor     │   │
│  │  EMPRESA ABC LTDA, já quali-  │  │    da causa (R$50k →       │   │
│  │  ficada nos autos, vem...     │  │    deveria ser R$20k)      │   │
│  │                                │  │                             │   │
│  │  I - PRELIMINARMENTE          │  │  • Mérito: inexistência    │   │
│  │                                │  │    de dano moral           │   │
│  │  [Cursor piscando...]         │  │                             │   │
│  │                                │  │  ─────────────────────────│   │
│  │                                │  │                             │   │
│  │                                │  │  📁 Documentos do processo:│   │
│  │                                │  │                             │   │
│  │                                │  │  • Petição Inicial         │   │
│  │                                │  │  • Contrato Social ABC     │   │
│  │                                │  │  • E-mails trocados        │   │
│  │                                │  │  • Notas fiscais           │   │
│  │                                │  │                             │   │
│  │                                │  │  ─────────────────────────│   │
│  │                                │  │                             │   │
│  │                                │  │  📊 Jurisprudência:        │   │
│  │                                │  │                             │   │
│  │                                │  │  "Encontrei 12 casos       │   │
│  │                                │  │   similares no TJSP.       │   │
│  │                                │  │   8 favoráveis ao réu."    │   │
│  │                                │  │                             │   │
│  │                                │  │  [Ver jurisprudência]      │   │
│  │                                │  │                             │   │
│  └────────────────────────────────┘  └─────────────────────────────┘   │
│                                                                         │
│  [💾 Salvar]  [📤 Gerar PDF]  [⚖️ Protocolar]  [⏱️ Registrar Tempo]   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.4 IA Auxilia na Elaboração

Dra. Ana Paula digita: "IA, sugira uma preliminar de inépcia"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🤖 Assistente Jurídico                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Você: "IA, sugira uma preliminar de inépcia"                          │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  🤖 Baseado na petição inicial analisada, sugiro:                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  I - DA PRELIMINAR DE INÉPCIA DA INICIAL                        │   │
│  │                                                                  │   │
│  │  A petição inicial é inepta, nos termos do art. 330, §1º,      │   │
│  │  III, do CPC, uma vez que o pedido formulado pelo Autor é      │   │
│  │  genérico, limitando-se a requerer "indenização por danos      │   │
│  │  morais em valor a ser arbitrado pelo juízo".                   │   │
│  │                                                                  │   │
│  │  Ocorre que o art. 292 do CPC exige que o autor atribua        │   │
│  │  valor certo ao pedido, ainda que provisório, sob pena de      │   │
│  │  inépcia.                                                       │   │
│  │                                                                  │   │
│  │  Nesse sentido, a jurisprudência do E. TJSP:                   │   │
│  │                                                                  │   │
│  │  "INÉPCIA DA INICIAL - Pedido genérico de danos morais -       │   │
│  │  Necessidade de indicação de valor certo - Art. 292 do CPC -   │   │
│  │  Extinção sem resolução do mérito."                             │   │
│  │  (TJSP, AC 1234567-89, Rel. Des. Fulano, j. 15/10/2024)        │   │
│  │                                                                  │   │
│  │  Ante o exposto, requer seja EXTINTO O FEITO sem resolução     │   │
│  │  do mérito, nos termos do art. 485, I c/c art. 330, §1º, III,  │   │
│  │  ambos do CPC.                                                  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                    [Inserir no documento]  [Editar antes]  [Descartar] │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📚 Fontes utilizadas:                                                 │
│  • CPC, arts. 292, 330, 485                                            │
│  • TJSP AC 1234567-89 (2024)                                           │
│  • TJSP AC 9876543-21 (2023)                                           │
│                                                                         │
│  ⚠️ AVISO: Revise o texto antes de usar. A IA auxilia, mas a          │
│     responsabilidade técnica é do advogado.                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.5 Protocolo Eletrônico (Integração com Tribunal)

Dra. Ana Paula finaliza a contestação e clica em **[⚖️ Protocolar]**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Protocolar Petição — e-SAJ (TJSP)                                [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Processo: 1234567-89.2024.8.26.0100                                   │
│  Tribunal: TJSP - 10ª Vara Cível                                       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📄 PEÇA PRINCIPAL                                                     │
│                                                                         │
│  Tipo: [Contestação ▼]                                                 │
│  Arquivo: Contestacao_ABC_v3.pdf (245 KB) ✓                           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📎 DOCUMENTOS ANEXOS                                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ✓ Procuracao_ABC.pdf (120 KB)           Tipo: [Procuração ▼]   │   │
│  │ ✓ Contrato_Social_ABC.pdf (340 KB)      Tipo: [Documento ▼]    │   │
│  │ ✓ Emails_Comprob.pdf (1.2 MB)           Tipo: [Documento ▼]    │   │
│  │ ✓ Notas_Fiscais.pdf (890 KB)            Tipo: [Documento ▼]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [+ Adicionar documento]                                               │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ✍️ ASSINATURA DIGITAL                                                 │
│                                                                         │
│  Advogado: Dra. Ana Paula Santos (OAB/SP 156.789)                      │
│  Certificado: A3 OAB ✓ Conectado                                       │
│                                                                         │
│  [✓] Assinar todos os documentos                                       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ⏱️ TIMESHEET                                                          │
│                                                                         │
│  Tempo gasto nesta atividade: [3:30 ▼] horas                          │
│  Cliente: Empresa ABC Ltda                                              │
│  Atividade: Elaboração de contestação                                  │
│  [✓] Registrar automaticamente                                         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│            ┌─────────────────────────────────────────┐                 │
│            │                                         │                 │
│            │    [  🔐 ASSINAR E PROTOCOLAR  ]        │                 │
│            │                                         │                 │
│            │       Integração direta com e-SAJ       │                 │
│            │                                         │                 │
│            └─────────────────────────────────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**O QUE ACONTECE:**

```
POST /api/v1/legal/filing/submit/

1. Assina documentos com certificado A3 OAB
   → Peça principal: assinada
   → Anexos: assinados

2. Conecta com API e-SAJ
   → Autentica com certificado
   → Seleciona processo
   → Envia petição + anexos

3. Recebe protocolo
   → Número: 2025.0001234567
   → Data/Hora: 15/01/2025 16:45:32
   → Status: Protocolado com sucesso

4. Registra no sistema
   Filing.objects.create(
       case=case,
       type='CONTESTACAO',
       protocol_number='2025.0001234567',
       filed_at='2025-01-15 16:45:32',
       filed_by=ana_paula,
       documents=[contestacao, procuracao, ...]
   )

5. Atualiza prazo
   deadline.status = 'COMPLETED'
   deadline.completed_at = now()
   deadline.completed_by = ana_paula

6. Registra timesheet
   Timesheet.objects.create(
       user=ana_paula,
       client=empresa_abc,
       case=case,
       activity='Elaboração de contestação',
       hours=3.5,
       date='2025-01-15',
       billable=True
   )

7. Notifica cliente (se configurado)
   → "Contestação protocolada com sucesso"
```

**Resultado:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                 ✓ Petição protocolada com sucesso!                     │
│                                                                         │
│     Processo: 1234567-89.2024.8.26.0100                                │
│     Tipo: Contestação                                                   │
│     Protocolo: 2025.0001234567                                         │
│     Data/Hora: 15/01/2025 às 16:45                                     │
│                                                                         │
│     Tribunal: TJSP - 10ª Vara Cível - Foro Central                     │
│                                                                         │
│     ⏱️ Tempo registrado: 3h30min                                       │
│     💰 Valor: R$ 1.575,00 (3.5h × R$450/h)                             │
│                                                                         │
│     [📄 Ver Comprovante]  [📤 Enviar p/ Cliente]  [Fechar]             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.6 Tela de Processos — Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROCESSOS                                              Dra. Ana Paula  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [🔍 Buscar por número, cliente ou assunto...]                         │
│                                                                         │
│  Filtros: [Todos ▼] [Meus processos ▼] [Status: Ativo ▼] [Área ▼]     │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📊 RESUMO                                                              │
│                                                                         │
│  Total: 47 processos · Ativos: 42 · Arquivados: 5                      │
│  Prazos esta semana: 8 · Audiências: 3                                 │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  │ Processo                │ Cliente        │ Tipo      │ Próx. Prazo │ │
│  │─────────────────────────│────────────────│───────────│─────────────│ │
│  │ 1234567-89.2024.8.26... │ Empresa ABC    │ Cível     │ ✓ Concluído│ │
│  │ 0001234-56.2024.5.02... │ João Silva     │ Trabalhist│ 🔴 HOJE    │ │
│  │ 5001234-67.2024.4.03... │ Indústria XYZ  │ Cível     │ 🟡 Amanhã  │ │
│  │ 9876543-21.2024.8.26... │ Maria Souza    │ Cível     │ Audiência  │ │
│  │ 1111111-22.2024.8.26... │ Comércio DEF   │ Empresar. │ 20/01      │ │
│  │ 2222222-33.2024.5.02... │ Pedro Santos   │ Trabalhist│ 22/01      │ │
│  │ ...                     │ ...            │ ...       │ ...        │ │
│                                                                         │
│  [1] [2] [3] [4] [5] ... [10]                          Mostrando 1-10  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.7 Detalhe do Processo — Timeline Completa

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROCESSO: 1234567-89.2024.8.26.0100                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐   │
│  │                                 │  │                            │   │
│  │  👤 PARTES                      │  │  📊 STATUS                 │   │
│  │                                 │  │                            │   │
│  │  Autor: João da Silva           │  │  Fase: Conhecimento        │   │
│  │  CPF: ***.123.456-**           │  │  Status: Aguardando réplica│   │
│  │                                 │  │  Último mov.: Há 2 dias    │   │
│  │  Réu: Empresa ABC Ltda (cliente)│  │                            │   │
│  │  CNPJ: 12.345.678/0001-90      │  │  Valor: R$ 50.000,00       │   │
│  │                                 │  │  Risco: Médio              │   │
│  │  Advogado: Dra. Ana Paula      │  │                            │   │
│  │  Sócio resp.: Dr. Fernando     │  │                            │   │
│  │                                 │  │                            │   │
│  └─────────────────────────────────┘  └────────────────────────────┘   │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📅 TIMELINE DO PROCESSO                                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  15/01/2025 ───●─── Contestação protocolada                     │   │
│  │               │     Por: Dra. Ana Paula                         │   │
│  │               │     Protocolo: 2025.0001234567                  │   │
│  │               │                                                  │   │
│  │  10/01/2025 ───●─── Intimação para contestação                  │   │
│  │               │     Prazo: 15 dias úteis                        │   │
│  │               │     Vencimento: 31/01/2025                      │   │
│  │               │                                                  │   │
│  │  05/01/2025 ───●─── Distribuição do processo                    │   │
│  │               │     10ª Vara Cível - Foro Central               │   │
│  │               │                                                  │   │
│  │  03/01/2025 ───●─── Petição inicial protocolada                 │   │
│  │                     Autor: João da Silva                        │   │
│  │                     Valor da causa: R$ 50.000,00                │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📁 DOCUMENTOS DO PROCESSO                                             │
│                                                                         │
│  │ Documento                      │ Data       │ Origem    │ Ações    │ │
│  │────────────────────────────────│────────────│───────────│──────────│ │
│  │ 📄 Contestação                 │ 15/01/2025 │ Escritório│ [Ver]    │ │
│  │ 📄 Procuração                  │ 08/01/2025 │ Escritório│ [Ver]    │ │
│  │ 📄 Petição Inicial             │ 03/01/2025 │ Tribunal  │ [Ver]    │ │
│  │ 📄 Documentos do Autor         │ 03/01/2025 │ Tribunal  │ [Ver]    │ │
│  │ 📄 Contrato (prova)            │ —          │ Cliente   │ [Ver]    │ │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  ⏱️ TIMESHEET ACUMULADO                                                │
│                                                                         │
│  Total de horas: 8h30min                                               │
│  Valor: R$ 3.825,00 (8.5h × R$450/h)                                   │
│  Faturado: R$ 1.575,00 · Pendente: R$ 2.250,00                         │
│                                                                         │
│  [Ver detalhes]  [Gerar fatura]                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.8 Portal do Cliente (Acesso Externo)

O cliente Empresa ABC pode acompanhar seus processos:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Mendes & Associados — Portal do Cliente                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Olá, Empresa ABC Ltda                                                 │
│  Responsável: Carlos Diretor (carlos@empresaabc.com.br)                │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📊 RESUMO DOS SEUS PROCESSOS                                          │
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │      3        │  │      1        │  │      2        │               │
│  │   Processos   │  │   Encerrado   │  │   Próximas    │               │
│  │    ativos     │  │  com êxito    │  │   audiências  │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  ⚖️ SEUS PROCESSOS                                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📄 1234567-89.2024.8.26.0100                                    │   │
│  │    João da Silva vs. Empresa ABC                                │   │
│  │    TJSP - 10ª Vara Cível                                        │   │
│  │                                                                  │   │
│  │    Status: ✓ Contestação apresentada (15/01)                    │   │
│  │    Próximo passo: Aguardando réplica do autor                   │   │
│  │    Advogada: Dra. Ana Paula Santos                              │   │
│  │                                                                  │   │
│  │    [Ver detalhes]  [Enviar mensagem]                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  💰 HONORÁRIOS                                                          │
│                                                                         │
│  Em aberto: R$ 2.250,00                                                │
│  Última fatura: R$ 1.575,00 (paga em 10/01)                            │
│                                                                         │
│  [Ver faturas]  [Área de pagamento]                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 3: ANÁLISES E GESTÃO — VISÃO DO SÓCIO

## 3.1 Dashboard do Sócio (Dr. Fernando)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ANÁLISES — Mendes & Associados                            Jan/2025    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐           │
│  │  R$ 127.350     │ │      347        │ │     99.2%       │           │
│  │  Faturamento    │ │   Processos     │ │   Prazos        │           │
│  │  Janeiro        │ │   ativos        │ │   cumpridos     │           │
│  │  ↑ 15% vs dez   │ │   +12 novos     │ │   (meta: 100%)  │           │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘           │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  👥 PRODUTIVIDADE DA EQUIPE                                            │
│                                                                         │
│  │ Advogado            │ Horas  │ Faturável │ Petições │ Taxa Êxito │  │
│  │─────────────────────│────────│───────────│──────────│────────────│  │
│  │ Dra. Ana Paula      │  142h  │ R$ 63.900 │    18    │    78%     │  │
│  │ Dr. Ricardo Lima    │  128h  │ R$ 57.600 │    15    │    82%     │  │
│  │ Dra. Juliana Alves  │  115h  │ R$ 51.750 │    12    │    75%     │  │
│  │ Dr. Bruno Costa     │   98h  │ R$ 44.100 │    10    │    80%     │  │
│  │ Dr. Marcos Oliveira │   87h  │ R$ 39.150 │     8    │    85%     │  │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📊 PROCESSOS POR ÁREA                                                 │
│                                                                         │
│  Cível          ████████████████████████░░░░  156 (45%)               │
│  Trabalhista    ██████████████░░░░░░░░░░░░░░   98 (28%)               │
│  Empresarial    ████████░░░░░░░░░░░░░░░░░░░░   58 (17%)               │
│  Outros         ████░░░░░░░░░░░░░░░░░░░░░░░░   35 (10%)               │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  ⚠️ ALERTAS IMPORTANTES                                                │
│                                                                         │
│  🔴 1 prazo perdido este mês (Dr. Marcos - RO trabalhista)            │
│     Ação: Revisar carga de trabalho                                    │
│                                                                         │
│  🟡 3 clientes com fatura > 60 dias                                    │
│     Valor total: R$ 12.450,00                                          │
│     [Ver inadimplentes]                                                │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  💡 INSIGHTS DA IA                                                     │
│                                                                         │
│  "Dr. Marcos está com carga 40% acima da média. 2 prazos              │
│   quase perdidos no último mês. Sugestão: redistribuir                │
│   3 processos trabalhistas para Dra. Juliana."                        │
│                                                                         │
│  [Aceitar sugestão]  [Ignorar]                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 Controle Financeiro / Timesheet

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FINANCEIRO — Janeiro/2025                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  R$ 127.350     │  │  R$ 98.200      │  │  R$ 29.150      │         │
│  │  Faturado       │  │  Recebido       │  │  A receber      │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  📊 HORAS POR CLIENTE                                                  │
│                                                                         │
│  │ Cliente              │ Horas  │ Valor      │ Status      │          │
│  │──────────────────────│────────│────────────│─────────────│          │
│  │ Empresa ABC Ltda     │  45.5h │ R$ 20.475  │ ✓ Pago      │          │
│  │ Indústria XYZ S.A.   │  38.0h │ R$ 17.100  │ Pendente    │          │
│  │ Comércio DEF         │  32.5h │ R$ 14.625  │ ✓ Pago      │          │
│  │ Maria Souza (PF)     │  28.0h │ R$ 12.600  │ Pendente    │          │
│  │ João Silva (PF)      │  22.0h │ R$  9.900  │ ✓ Pago      │          │
│  │ [outros 75 clientes] │ 404.0h │ R$181.800  │ Variado     │          │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  ⏱️ TIMESHEET PENDENTE DE APROVAÇÃO                                    │
│                                                                         │
│  Lucas Silva (estagiário) - 12h aguardando aprovação                   │
│  Maria Eduarda (estagiário) - 8h aguardando aprovação                  │
│                                                                         │
│  [Aprovar todos]  [Revisar individualmente]                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# DIFERENÇAS CHAVE: ADVOCACIA vs OUTROS

| Aspecto | Empresa (Lice) | Órgão Público | Advocacia (M&A) |
|---------|----------------|---------------|-----------------|
| **Identificador** | CNPJ | CNPJ | CNPJ + **OAB** |
| **Prazos** | Flexíveis | Legais | **PROCESSUAIS (fatal)** |
| **Contagem** | Dias corridos | Dias úteis | **Dias úteis + feriados forenses** |
| **Integração** | ERPs | SEI, Gov.br | **Tribunais (PJe, e-SAJ)** |
| **Assinatura** | A1/A3 | ICP-Brasil | **A3 OAB obrigatório** |
| **Clientes** | Próprios | Cidadãos | **Múltiplos (carteira)** |
| **Processos** | Internos | Administrativos | **Judiciais (CNJ)** |
| **IA foca em** | Produtividade | Conformidade | **Prazos + jurisprudência** |
| **Financeiro** | Faturamento | Orçamento | **Timesheet + honorários** |
| **Sigilo** | LGPD | LAI | **Advocatício (art. 7º EOAB)** |

---

# RESUMO DO FLUXO — ADVOCACIA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     JORNADA DO PROCESSO JUDICIAL                       │
└─────────────────────────────────────────────────────────────────────────┘

    MONITORAMENTO                ALERTAS                    TRABALHO
         │                          │                          │
         ▼                          ▼                          ▼
   ┌──────────┐               ┌──────────┐               ┌──────────┐
   │ Tribunais│               │   IA     │               │  MEU DIA │
   │ PJe,e-SAJ│──────────────▶│ detecta  │──────────────▶│  prazos  │
   │ PROJUDI  │  movimentação │intimação │   D-5,D-3    │  FATAIS  │
   │ e-STJ    │               │ prazo    │   D-1,D-0    │          │
   └──────────┘               └──────────┘               └──────────┘
                                   │                          │
                                   │                          │
                                   ▼                          ▼
                             ┌──────────┐               ┌──────────┐
                             │DOCUMENTOS│               │PROCESSOS │
                             │ petições │               │ timeline │
                             │ provas   │               │ partes   │
                             │ contratos│               │ valores  │
                             └──────────┘               └──────────┘
                                   │                          │
                                   │                          │
                                   ▼                          ▼
                             ┌──────────┐               ┌──────────┐
                             │ASSINATURAS               │ ANÁLISES │
                             │ A3 OAB   │               │ produtiv.│
                             │ protocolo│               │ timesheet│
                             │ tribunal │               │ clientes │
                             └──────────┘               └──────────┘
                                   │                          │
                                   │                          │
                                   ▼                          ▼
                             ┌──────────┐               ┌──────────┐
                             │ PORTAL   │               │FINANCEIRO│
                             │ CLIENTE  │               │honorários│
                             │ acompanha│               │faturament│
                             │ paga     │               │cobrança  │
                             └──────────┘               └──────────┘
```

---

Quer que eu detalhe algum fluxo específico do escritório de advocacia?
