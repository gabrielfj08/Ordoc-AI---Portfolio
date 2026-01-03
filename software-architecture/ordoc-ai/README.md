# Ordoc AI — Arquitetura do Sistema (Backend Django)

Esta seção detalha o backend **Django/DRF** e seus módulos internos.

## Módulos (apps) e responsabilidades

```mermaid
flowchart LR
  subgraph Core[Core Apps]
    AIR[ordoc_air
Documentos / OCR / Solr] -->|usa| CLOUD[ordoc_cloud
Usuários / Roles / Policies / Tokens]
    FLOW[ordoc_flow
Workflows / Tasks / Notificações] -->|usa| CLOUD
    SIGN[ordoc_sign
Assinatura / Certificados] -->|usa| CLOUD
    REPORTS[ordoc_reports
Relatórios] -->|usa| CLOUD
  end

  subgraph CrossCutting[Transversal]
    AUTH[ordoc_ai.authentication
JWTAuth + OrgMiddleware]
    MW[ordoc_ai.middleware
logging + rate limiting]
  end

  AIR --> INTEL[intelligence
IA proativa]
  FLOW --> INTEL
  SIGN --> INTEL

  AIR --> INTEG[ordoc_integrations
Serviços externos + cache]
  FLOW --> INTEG

  AUTH --> AIR
  AUTH --> FLOW
  AUTH --> SIGN
  AUTH --> REPORTS
  MW --> AIR
  MW --> FLOW
  MW --> SIGN
  MW --> REPORTS
```

## Gaps críticos (status atual no código)

- **Assinatura ICP-Brasil**
  - Existe no backend via `ordoc_sign`.
  - Evidências:
    - `backend/ordoc_sign/models.py`: `DigitalCertificate` com `certificate_type` `A1`/`A3`.
    - `backend/ordoc_sign/services.py`: uso de `pyhanko` (quando disponível) para assinatura de PDF e processamento de certificados.
    - `backend/ordoc_sign/urls.py`: rotas `certificates`, `templates`, `requests`, `signers`, `signatures`, `batches`, `audit-logs`.

- **Multi-tenancy (Org) + separação Interno vs Externo/Cidadão**
  - Tenant é resolvido por header (`X-API-Subdomain`/`X-Subdomain`) e armazenado no request.
  - Evidências:
    - `backend/ordoc_ai/authentication.py`: `OrganizationMiddleware` + `JWTAuthentication.get_organization_from_request()`.
    - `backend/ordoc_ai/base_viewset.py`: `get_current_user()` pode retornar `User` (interno) ou `ExternalRequester` (externo), e `get_current_organization()` é central.

- **Portal externo (Solicitantes externos / OrdocCidadao)**
  - Existe como endpoints dedicados no `ordoc_flow`.
  - Evidências:
    - `backend/ordoc_flow/urls.py`: rotas `api/external/...`.
    - `backend/ordoc_flow/external_views.py`: `ExternalProcedureViewSet`, `ExternalProcedureTemplateViewSet`, `ExternalTaskViewSet`.

- **Vector DB / RAG (embeddings)**
  - **Não identificado no backend atual** (não há Vector DB/VectorStore em uso no módulo `intelligence`).
  - O `intelligence` hoje executa extração/classificação + deliberação via LLM e persiste `DocumentAnalysis/ProactiveAlert` em Postgres.

## Fluxo: autenticação interna + refresh token

```mermaid
sequenceDiagram
  autonumber
  participant C as Client (Web)
  participant API as Django/DRF
  participant DB as Postgres

  C->>API: POST /api/auth/login/ {email, password}
  API->>DB: validate user + profile (OrdocUser)
  API->>DB: create RefreshToken (7d)
  API-->>C: 200 {access_token (15min), refresh_token}

  C->>API: POST /api/auth/refresh-token/ {refresh_token}
  API->>DB: load RefreshToken + validate
  API->>DB: create new RefreshToken (rotation)
  API-->>C: 200 {access_token, refresh_token}

  C->>API: POST /api/auth/logout/
  API->>DB: revoke all refresh tokens (user)
  API-->>C: 200 ok
```

## Fluxo: upload de documento → OCR → indexação Solr → IA

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API as Django/DRF (ordoc_air)
  participant ST as Storage
  participant R as Redis
  participant CW as Celery Worker
  participant SOLR as Solr
  participant LLM as Ollama
  participant DB as Postgres

  C->>API: POST /api/v1/ordoc-air/documents/ (multipart)
  API->>ST: save file
  API->>DB: create Document + metadata
  API->>R: enqueue OCR/index/intelligence (tasks/signals)
  API-->>C: 201 Document

  CW->>ST: read file
  CW->>DB: persist OCRResult / extracted_text
  CW->>SOLR: index document
  CW->>LLM: analyze_document (intelligence)
  CW->>DB: persist DocumentAnalysis + ProactiveAlerts
```

## Diagrama C4 (nível container)

```mermaid
C4Container
  title Ordoc AI - Containers (alto nível)

  Person(user, "Usuário", "Usuário interno/externo")

  System_Boundary(s1, "Ordoc AI Platform") {
    Container(nginx, "NGINX", "Reverse proxy", "HTTPS → HTTP")
    Container(api, "Backend", "Django/DRF + Channels", "REST + WebSocket")
    Container(celeryw, "Celery Worker", "Celery", "OCR, Solr indexing, IA, integrações")
    Container(celeryb, "Celery Beat", "Celery", "Agendador")

    ContainerDb(pg, "PostgreSQL", "DB", "Dados transacionais")
    ContainerDb(redis, "Redis", "Cache/Broker", "Broker Celery + channel layer")
    ContainerDb(solr, "Solr", "Search", "Full-text search")
    Container(ollama, "Ollama", "LLM", "Modelos locais")
    ContainerDb(storage, "Storage", "Local/S3", "Arquivos")
  }

  Rel(user, nginx, "Usa", "HTTPS")
  Rel(nginx, api, "Encaminha", "HTTP/ASGI")

  Rel(api, pg, "Lê/Escreve")
  Rel(api, redis, "Enfileira tasks / pubsub")
  Rel(api, solr, "Busca")
  Rel(api, storage, "Upload/Download")

  Rel(celeryw, redis, "Consome")
  Rel(celeryw, pg, "Lê/Escreve")
  Rel(celeryw, solr, "Indexa")
  Rel(celeryw, storage, "Lê arquivos")
  Rel(celeryw, ollama, "Analisa")

  Rel(celeryb, redis, "Agenda")
```
