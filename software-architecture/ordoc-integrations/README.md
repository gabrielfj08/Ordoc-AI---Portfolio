# Ordoc Integrations — Arquitetura de Integrações Externas

O módulo de integrações fornece uma camada padronizada para chamadas a serviços externos, com:

- auditoria (registro de requisições)
- cache (Redis + DB)
- rate limiting
- retries e tratamento de falhas

## Visão do subsistema

```mermaid
flowchart TB
  API[DRF API<br/>ordoc_integrations] --> SVC[Integration Services<br/>base + providers]

  SVC -->|audit| REQ[(IntegrationRequest<br/>Postgres)]
  SVC -->|cache| REDIS[(Redis)]
  SVC -->|cache index| CACHE[(IntegrationCache<br/>Postgres)]

  SVC --> EXT[Serviços Externos<br/>Gov.br, Receita, Serasa, etc]
```

## Fluxo: execução com cache + auditoria

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API as Integrations API
  participant S as IntegrationService (provider)
  participant R as Redis
  participant DB as Postgres
  participant EXT as External Service

  C->>API: POST /integrations/execute
  API->>S: execute(request)

  S->>R: check cache key
  alt cache hit
    R-->>S: cached payload
    S->>DB: write IntegrationRequest (from_cache=true)
    S-->>API: response (cached)
  else cache miss
    S->>EXT: call
    EXT-->>S: response
    S->>R: set cache
    S->>DB: write IntegrationRequest
    S->>DB: upsert IntegrationCache
    S-->>API: response
  end

  API-->>C: 200 result
```

## Observações de multi-tenant

A auditoria e cache tendem a incluir `organization` nos modelos (`IntegrationRequest`, etc.).
Para isolamento correto, o tenant deve ser resolvido **de forma única** (preferencialmente via `request.current_organization`).
