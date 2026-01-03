# Ordoc Flow — Arquitetura do Sistema de Workflow

O **Ordoc Flow** é o subsistema de workflow: procedimentos, tarefas, aprovações, notificações e automações.

## Domínios principais

```mermaid
flowchart TB
  P[Procedure<br/>Processo] --> T[Task<br/>Tarefas]
  P --> AW[ApprovalWorkflow<br/>Fluxo aprovação]
  AW --> AS[ApprovalStep<br/>Etapas]

  P --> WR[WorkflowRequest<br/>Solicitação]
  WR --> NR[NotificationRequest<br/>Solicitações de notificação]
  NR --> NL[NotificationLog<br/>Log de envio]

  P --> PT[ProcedureTemplate]
  PT --> ST[StepTemplate]

  ER[ExternalRequester] --> WR
  GR[GroupRequester] --> WR
```

## Portal externo (Cidadão / solicitante externo)

No código existe uma camada específica para o portal externo (referido como **OrdocCidadao**), com endpoints dedicados.

- **Rotas**
  - `backend/ordoc_flow/urls.py`: prefixo `api/external/`.
- **Views**
  - `backend/ordoc_flow/external_views.py`:
    - `ExternalProcedureViewSet`
    - `ExternalProcedureTemplateViewSet`
    - `ExternalTaskViewSet`
- **Autenticação**
  - Usa JWT **do `ExternalRequester`** (token criado por `ExternalRequester.get_token()`), decodificado por `ordoc_ai.authentication.JWTAuthentication`.
- **Multi-tenancy**
  - Mesmo no portal externo, o tenant é aplicado via `BaseViewSet.get_current_organization()` (resolvido por header `X-API-Subdomain`/`X-Subdomain`).

## Fluxo: criar solicitação → gerar tarefas → aprovações → notificar

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuário Interno
  participant API as Ordoc Flow API (DRF)
  participant DB as Postgres
  participant R as Redis
  participant CW as Celery Worker
  participant WS as WebSocket (Channels)

  U->>API: POST /workflow-requests/ (start)
  API->>DB: create WorkflowRequest
  API->>DB: create Procedure/Tasks (se aplicável)
  API->>R: enqueue notifications
  API-->>U: 201

  CW->>DB: create NotificationLog
  CW-->>WS: push realtime (group notifications_{user})
  CW-->>U: (email/sms se habilitado)

  U->>API: POST /approval-workflows/{id}/approve
  API->>DB: update steps / task status
  API->>R: enqueue follow-up notifications
  API-->>U: 200
```

## Busca no Workflow (Solr)

```mermaid
flowchart LR
  API[Ordoc Flow API] -->|search| SOLR[(Solr core: ordoc_workflow)]
  CW[Celery Worker] -->|index| SOLR
  DB[(Postgres)] --> CW
  DB --> API

  SOLR --> API
```

## Pontos de integração com outros subsistemas

- **Autenticação/tenant**: herdado do núcleo (`ordoc_ai.authentication` + OrganizationMiddleware).
- **Notificações**: pode usar tanto **DB** (Notification/NotificationLog) quanto **WebSocket** via Channels.
- **Integrações**: consumo do `ordoc_integrations` para validações e serviços externos.
- **IA (intelligence)**: signals podem reagir a mudanças de status em `Task`.
