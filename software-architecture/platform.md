# Visão Geral da Plataforma (Ordoc AI)

```mermaid
flowchart TB
  %% Clientes
  U[Usuários Internos<br/>Web / Mobile] -->|HTTPS| NGINX[NGINX / Reverse Proxy]
  EXT[Solicitantes Externos<br/>Links/Portais] -->|HTTPS| NGINX

  %% Aplicação
  NGINX -->|HTTP/ASGI| DJ[Django + DRF<br/>ordoc_ai]

  %% Tempo real
  DJ <-->|WebSocket Channels| WS[ASGI / Channels]
  WS -->|pub/sub| REDIS[(Redis)]

  %% Assíncrono
  DJ -->|enqueue tasks| REDIS
  CW[Celery Worker] -->|consume tasks| REDIS
  CB[Celery Beat] -->|schedule| REDIS

  %% Dados
  DJ -->|ORM| PG[(PostgreSQL)]
  CW -->|ORM| PG

  %% Busca
  CW -->|index/query| SOLR[(Apache Solr)]
  DJ -->|search/query| SOLR

  %% IA / Intelligence
  CW -->|LLM calls local| OLLAMA[(Ollama)]

  %% Assinatura digital (ICP-Brasil)
  DJ -->|API de assinatura| SIGN[ordoc_sign<br/>Certificados + Assinatura PDF]
  SIGN -->|persist| PG

  %% Storage
  DJ -->|upload/download| ST[(Storage<br/>Local/S3)]
  CW -->|OCR/extract| ST

  %% Portal externo (Cidadão / solicitante externo)
  EXT -->|JWT externo + tenant header| DJ

  %% RAG / Vector DB (estado atual)
  DJ -.->|não implementado no backend| VDB[(Vector DB / Embeddings)]

  %% Observabilidade (implícita no código)
  DJ -.-> LOG[Logging JSON / Middleware]
  CW -.-> LOG
```

## Componentes principais

- **NGINX**
  - Termina TLS (quando configurado) e roteia tráfego HTTP para o backend.
- **Django + DRF (ordoc_ai)**
  - Exposição de APIs REST.
  - Autenticação JWT + refresh token.
  - Multi-tenant por `Organization` (subdomain/header).
- **Channels (WebSocket)**
  - Notificações em tempo real (ex.: `NotificationConsumer`).
- **Redis**
  - Broker Celery.
  - Canal de pub/sub (Channels).
  - (Opcional) cache para integrações e rate limiting.
- **Celery Worker / Beat**
  - OCR, indexação Solr, integrações externas, jobs periódicos.
- **PostgreSQL**
  - Persistência dos domínios (Documentos, Workflow, Users/Roles, Tokens, etc.).
- **Solr**
  - Busca full-text e “search experience”.
- **Ollama**
  - Execução local de LLM para o módulo `intelligence`.
- **Assinatura digital (ordoc_sign)**
  - Certificados digitais (A1/A3) e assinatura de PDF (camada de serviço com `pyhanko`).
- **Portal externo (OrdocCidadao / ExternalRequester)**
  - Endpoints externos do `ordoc_flow` para procedimentos/tarefas de solicitantes externos.
- **Vector DB / RAG**
  - **Não identificado no backend atual** (sem `faiss/chroma/qdrant/pgvector` etc). Se a estratégia for RAG, precisa ser adicionada explicitamente.
- **Storage (Local/S3)**
  - Arquivos (PDFs/imagens) e anexos.
