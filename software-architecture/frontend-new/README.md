# Frontend New — Arquitetura (Next.js)

Este documento descreve a arquitetura do **frontend-new** (Next.js App Router), seus módulos e como ele se integra ao backend.

## Stack

- Next.js (App Router)
- React Query (`@tanstack/react-query`)
- Zustand (`zustand` + persist)
- Axios (`axios`) com interceptors (auth + auto-refresh)
- WebSocket (notificações) via Channels
- UI: shadcn/ui + Radix

## Entry points e providers globais

- `frontend-new/app/layout.tsx`
  - `ErrorBoundary`
  - `QueryProvider` (React Query)
  - `AuthInitializer` (carrega `/api/auth/me/`)
  - `NotificationsProvider` (abre WS quando autenticado)
  - `MainHeader` (navegação)

```mermaid
flowchart TB
  subgraph Next[Next.js App Router]
    L[app/layout.tsx] --> EB[ErrorBoundary]
    EB --> QP[QueryProvider]
    QP --> AI[AuthInitializer]
    AI --> NP[NotificationsProvider]
    NP --> H[MainHeader]
    NP --> Pages[Route Pages<br/>app/*/page.tsx]
  end

  subgraph State[Estado]
    Z[Zustand Store<br/>stores/app-store.ts] 
    RQ[React Query Cache]
  end

  subgraph Integrations[Integrações]
    AX[Axios api-client<br/>services/api-client.ts]
    WS[WebSocket client<br/>services/websocket-client.ts]
  end

  Pages --> AX
  NP --> WS

  AX -->|Bearer access_token| API[(Backend Django)]
  AX -->|auto-refresh<br/>refresh_token| API
  WS -->|ws/notifications/?token=...| API

  AI -->|useMe| AX
  AI --> Z
  NP --> Z
  Pages --> Z
  Pages --> RQ
```

## Navegação (IA / Documentos / Processos / Assinaturas)

O `MainHeader` define o menu principal (e o oculta em `/login`):

- `/my-day` (dashboard)
- `/documents` (gestão documental)
- `/processes` (kanban de tarefas/workflows)
- `/signatures` (certificados e solicitações de assinatura)
- `/analyses` (análises/relatórios)

Arquivos:
- `frontend-new/app/components/main-header.tsx`
- `frontend-new/app/page.tsx` redireciona para `/my-day`

## Camada de serviços (API)

A camada `services/*-api.ts` concentra os endpoints do backend.

- `services/auth-api.ts`
  - `POST /api/auth/login/`, `POST /api/auth/refresh/`, `GET /api/auth/me/`
- `services/documents-api.ts`
  - base: `/api/v1/ordoc-air`
- `services/my-day-api.ts`
  - agrega chamadas em `/api/v1/ordoc-flow`, `/api/v1/ordoc-air`, `/api/v1/ordoc-sign`
- `services/signatures-api.ts`
  - base: `/api/v1/ordoc-sign`
- `services/websocket-client.ts`
  - WS: `/ws/notifications/?token=...`

## Auth + token refresh

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuário
  participant FE as Frontend (Next.js)
  participant AX as Axios api-client
  participant API as Backend Django
  participant Z as Zustand (app-store)

  U->>FE: Acessa /login
  FE->>AX: POST /api/auth/login/ {email,password}
  AX->>API: login
  API-->>AX: {access_token, refresh_token, user}
  AX->>Z: setTokens + setUser
  FE-->>U: redirect /my-day

  FE->>AX: GET /api/v1/... (qualquer endpoint)
  AX->>API: Authorization: Bearer access_token
  API-->>AX: 401 (token expirou)
  AX->>AX: interceptor tenta refresh
  AX->>API: POST /api/auth/refresh/ {refresh_token}
  API-->>AX: {access_token, refresh_token}
  AX->>Z: setTokens
  AX->>API: retry request original
  API-->>AX: 200
```

## Notificações (WebSocket)

```mermaid
sequenceDiagram
  autonumber
  participant FE as NotificationsProvider
  participant Z as Zustand
  participant WS as websocket-client
  participant API as Channels (NotificationConsumer)

  FE->>Z: lê user + accessToken
  alt autenticado
    FE->>WS: connect(accessToken)
    WS->>API: ws://.../ws/notifications/?token=...
    API-->>WS: notification events
    WS-->>FE: emit('notification', payload)
    FE->>Z: addNotification(payload)
  else não autenticado
    FE-->>WS: não conecta
  end
```
