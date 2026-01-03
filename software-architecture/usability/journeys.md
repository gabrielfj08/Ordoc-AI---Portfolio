# Usabilidade — Jornadas (User Journeys)

## Jornada A — Empresa/Consultoria (valor rápido via upload)

```mermaid
flowchart TB
  S([Start]) --> Site[Landing: Começar Grátis]
  Site --> Onb[Cadastrar organização<br/>CNPJ]
  Onb --> Tenant[Criar tenant + usuário admin]
  Tenant --> MyDay[/Meu Dia/]
  MyDay --> Upload[Upload de documento]
  Upload --> Proc[Processamento assíncrono: OCR/Index/IA]
  Proc --> Notif[Notificação: documento pronto + alertas]
  Notif --> Detail[Detalhe do documento: partes/valores/datas/alertas]
  Detail --> Decision{Ação}
  Decision -->|Criar lembrete| Rem[Gerar tarefa/lembrete]
  Decision -->|Iniciar workflow| WF[Iniciar processo/kanban]
  Decision -->|Assinar/Compartilhar| Sign[Assinaturas/Compartilhamento]
  WF --> Daily[Uso diário: Meu Dia prioriza fila]
  Sign --> Daily
  Rem --> Daily
```

**Critérios de usabilidade:**
- Resultado perceptível em poucos segundos (status + notificação).
- Edição/controle sobre sugestões IA.

## Jornada B — Advocacia (prazos e intimações como centro)

```mermaid
flowchart TB
  S([Start]) --> Setup[Onboarding: CNPJ + OAB + equipe]
  Setup --> Courts[Configurar integrações tribunais]
  Courts --> Deadlines[Configurar regras de prazos e alertas]
  Deadlines --> MyDay[Meu Dia<br/>Prazos/Intimações]
  MyDay --> Today[Prazos de hoje]
  MyDay --> Week[Prazos da semana]
  MyDay --> New[Novas intimações]

  Today --> Action{Ação rápida}
  Action -->|Abrir minuta| Draft[Documento/minuta vinculada]
  Action -->|Delegar| Delegate[Atribuir responsável]
  Action -->|Protocolar| File[Integração tribunal: protocolo]
  Action -->|Escalar| Esc[Escalar para sócio]

  Draft --> Audit[Registro/auditoria]
  Delegate --> Audit
  File --> Audit
  Esc --> Audit
  Audit --> MyDay
```

**Critérios de usabilidade:**
- Priorização sem ambiguidade (risco de prazo).
- Status claro das integrações (conectado/erro/expirado).

## Jornada C — Órgão público (processo formal + compliance + assinatura)

```mermaid
flowchart TB
  S([Start]) --> Impl[Implantação: TI + OrdocAI]
  Impl --> Org[Estrutura organizacional + perfis]
  Org --> Comp[Compliance: LAI/e-ARQ/LGPD + regras assinatura]
  Comp --> Templates[Workflows pré-configurados<br/>pregão/contrato/LAI]
  Templates --> MyDay[Meu Dia]

  MyDay --> NewProc[Novo Processo<br/>ex.: Pregão]
  NewProc --> Classif[Classificação e-ARQ + nível de acesso]
  Classif --> Tasks[Criar etapas/tarefas - kanban]
  Tasks --> Upload[Anexar evidências/documentos]
  Upload --> Route[Tramitar entre áreas<br/>jurídico/chefia/autoridade]
  Route --> Sign[Assinar<br/>ICP-Brasil ou Gov.br, conforme regra]
  Sign --> Publish[Publicar/encaminhar - DOE/portal]
  Publish --> Audit[Auditoria/relatórios]
  Audit --> MyDay
```

**Critérios de usabilidade:**
- Reduzir fricção em campos de classificação/sigilo.
- Justificativas e trilha de auditoria sempre acessíveis.
