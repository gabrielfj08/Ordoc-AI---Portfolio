# API Documentation - Ordoc-AI

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.ordoc.ai/api/v1
```

## Autenticação

Todas as requisições (exceto `/auth/login` e `/auth/register`) requerem autenticação via Bearer Token.

```http
Authorization: Bearer {access_token}
```

### Obter Token

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Status Codes:**
- `200 OK`: Login bem-sucedido
- `401 Unauthorized`: Credenciais inválidas
- `422 Unprocessable Entity`: Dados inválidos

---

## Documents API

### 1. Listar Documentos

**Endpoint:** `GET /documents`

**Query Parameters:**
- `folderId` (optional): ID da pasta
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 20)
- `search` (optional): Termo de busca
- `sortBy` (optional): Campo para ordenação (name, createdAt, size)
- `sortOrder` (optional): Ordem (asc, desc)

**Request:**
```http
GET /documents?folderId=folder-123&page=1&limit=20&search=contrato&sortBy=createdAt&sortOrder=desc
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "doc-uuid-1",
      "name": "Contrato de Prestação de Serviços.pdf",
      "type": "application/pdf",
      "size": 1048576,
      "createdAt": "2026-01-12T10:30:00Z",
      "updatedAt": "2026-01-12T15:45:00Z",
      "folderId": "folder-123",
      "ownerId": "user-uuid",
      "ownerName": "João Silva",
      "tags": ["contrato", "jurídico"],
      "starred": false,
      "shared": true,
      "url": "https://storage.ordoc.ai/documents/doc-uuid-1.pdf"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Status Codes:**
- `200 OK`: Sucesso
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: Sem permissão

---

### 2. Obter Documento por ID

**Endpoint:** `GET /documents/{id}`

**Request:**
```http
GET /documents/doc-uuid-1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "doc-uuid-1",
  "name": "Contrato de Prestação de Serviços.pdf",
  "type": "application/pdf",
  "size": 1048576,
  "createdAt": "2026-01-12T10:30:00Z",
  "updatedAt": "2026-01-12T15:45:00Z",
  "folderId": "folder-123",
  "ownerId": "user-uuid",
  "ownerName": "João Silva",
  "tags": ["contrato", "jurídico"],
  "starred": false,
  "shared": true,
  "url": "https://storage.ordoc.ai/documents/doc-uuid-1.pdf",
  "metadata": {
    "pages": 15,
    "author": "João Silva",
    "createdWith": "Microsoft Word"
  },
  "permissions": {
    "canEdit": true,
    "canDelete": true,
    "canShare": true,
    "canDownload": true
  }
}
```

**Status Codes:**
- `200 OK`: Sucesso
- `404 Not Found`: Documento não encontrado
- `403 Forbidden`: Sem permissão

---

### 3. Upload de Documento

**Endpoint:** `POST /documents/upload`

**Request:**
```http
POST /documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary]
folderId: folder-123 (optional)
tags: contrato,jurídico (optional)
```

**Response:**
```json
{
  "id": "doc-uuid-new",
  "name": "Novo Contrato.pdf",
  "type": "application/pdf",
  "size": 2097152,
  "createdAt": "2026-01-12T16:00:00Z",
  "updatedAt": "2026-01-12T16:00:00Z",
  "folderId": "folder-123",
  "ownerId": "user-uuid",
  "ownerName": "João Silva",
  "url": "https://storage.ordoc.ai/documents/doc-uuid-new.pdf"
}
```

**Status Codes:**
- `201 Created`: Upload bem-sucedido
- `400 Bad Request`: Arquivo inválido
- `413 Payload Too Large`: Arquivo muito grande (max: 100MB)
- `507 Insufficient Storage`: Espaço insuficiente

---

### 4. Atualizar Documento

**Endpoint:** `PUT /documents/{id}`

**Request:**
```json
{
  "name": "Contrato Atualizado.pdf",
  "tags": ["contrato", "jurídico", "2026"],
  "folderId": "folder-456"
}
```

**Response:**
```json
{
  "id": "doc-uuid-1",
  "name": "Contrato Atualizado.pdf",
  "type": "application/pdf",
  "size": 1048576,
  "createdAt": "2026-01-12T10:30:00Z",
  "updatedAt": "2026-01-12T16:30:00Z",
  "folderId": "folder-456",
  "tags": ["contrato", "jurídico", "2026"]
}
```

**Status Codes:**
- `200 OK`: Atualização bem-sucedida
- `404 Not Found`: Documento não encontrado
- `403 Forbidden`: Sem permissão

---

### 5. Deletar Documento

**Endpoint:** `DELETE /documents/{id}`

**Request:**
```http
DELETE /documents/doc-uuid-1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Documento deletado com sucesso",
  "id": "doc-uuid-1"
}
```

**Status Codes:**
- `200 OK`: Deletado com sucesso
- `404 Not Found`: Documento não encontrado
- `403 Forbidden`: Sem permissão

---

### 6. Obter Versões do Documento

**Endpoint:** `GET /documents/{id}/versions`

**Response:**
```json
{
  "versions": [
    {
      "version": 3,
      "date": "2026-01-12T15:45:00Z",
      "author": "João Silva",
      "authorId": "user-uuid",
      "size": "1.5 MB",
      "comment": "Correções finais",
      "hash": "a7f3c9e2d1b4f8a6c3e5d7b9f2a4c6e8",
      "url": "https://storage.ordoc.ai/documents/doc-uuid-1/v3.pdf"
    },
    {
      "version": 2,
      "date": "2026-01-12T14:30:00Z",
      "author": "Maria Santos",
      "authorId": "user-uuid-2",
      "size": "1.4 MB",
      "comment": "Revisão jurídica",
      "hash": "b8e4d0f3e2c5a9b7d1f4e6c8a2b5d7f9",
      "url": "https://storage.ordoc.ai/documents/doc-uuid-1/v2.pdf"
    }
  ]
}
```

---

### 7. Compartilhar Documento

**Endpoint:** `POST /documents/{id}/share`

**Request:**
```json
{
  "userIds": ["user-uuid-2", "user-uuid-3"],
  "permissions": {
    "canEdit": false,
    "canDownload": true,
    "canShare": false
  },
  "expiresAt": "2026-02-12T00:00:00Z" // optional
}
```

**Response:**
```json
{
  "message": "Documento compartilhado com sucesso",
  "sharedWith": [
    {
      "userId": "user-uuid-2",
      "userName": "Maria Santos",
      "permissions": {
        "canEdit": false,
        "canDownload": true,
        "canShare": false
      }
    }
  ]
}
```

---

## Folders API

### 1. Listar Pastas

**Endpoint:** `GET /folders`

**Query Parameters:**
- `parentId` (optional): ID da pasta pai

**Response:**
```json
{
  "data": [
    {
      "id": "folder-123",
      "name": "Contratos 2026",
      "parentId": null,
      "createdAt": "2026-01-01T00:00:00Z",
      "documentsCount": 45,
      "foldersCount": 3
    }
  ]
}
```

---

### 2. Criar Pasta

**Endpoint:** `POST /folders`

**Request:**
```json
{
  "name": "Nova Pasta",
  "parentId": "folder-123" // optional
}
```

**Response:**
```json
{
  "id": "folder-new",
  "name": "Nova Pasta",
  "parentId": "folder-123",
  "createdAt": "2026-01-12T16:45:00Z"
}
```

---

## Analytics API

### 1. Obter KPIs

**Endpoint:** `GET /analytics/kpis`

**Query Parameters:**
- `period`: `7d`, `30d`, `90d` (default: `30d`)

**Response:**
```json
{
  "kpis": [
    {
      "label": "Total de Processos",
      "value": 1247,
      "change": 12.5,
      "trend": [45, 52, 48, 55, 60, 58, 62]
    },
    {
      "label": "Taxa de Conclusão",
      "value": "94.2%",
      "change": 3.2,
      "trend": [88, 90, 91, 92, 93, 94, 94.2]
    }
  ]
}
```

---

### 2. Obter Dados de Gráficos

**Endpoint:** `GET /analytics/charts`

**Query Parameters:**
- `period`: `7d`, `30d`, `90d` (default: `30d`)

**Response:**
```json
{
  "processesOverTime": [
    { "name": "15/12", "value": 45 },
    { "name": "20/12", "value": 52 },
    { "name": "25/12", "value": 48 }
  ],
  "processesByCategory": [
    { "name": "Contratos", "value": 350 },
    { "name": "Licitações", "value": 280 },
    { "name": "NDAs", "value": 220 }
  ],
  "processesByStatus": [
    { "name": "Concluídos", "value": 1175 },
    { "name": "Em Andamento", "value": 45 },
    { "name": "Pendentes", "value": 27 }
  ]
}
```

---

### 3. Exportar Relatório

**Endpoint:** `GET /analytics/export`

**Query Parameters:**
- `format`: `pdf`, `excel`, `csv`
- `period`: `7d`, `30d`, `90d`

**Response:**
- Binary file (PDF/Excel/CSV)

**Headers:**
```
Content-Type: application/pdf | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | text/csv
Content-Disposition: attachment; filename="relatorio-analytics-2026-01-12.pdf"
```

---

## Processes API

### 1. Listar Processos

**Endpoint:** `GET /processes`

**Query Parameters:**
- `status`: `pending`, `in_progress`, `completed`
- `page`, `limit`, `search`, `sortBy`, `sortOrder`

**Response:**
```json
{
  "data": [
    {
      "id": "proc-uuid-1",
      "title": "Processo Licitatório #2024-001",
      "description": "Licitação para aquisição de equipamentos",
      "status": "in_progress",
      "priority": "high",
      "createdAt": "2026-01-05T00:00:00Z",
      "dueDate": "2026-02-15T00:00:00Z",
      "assignedTo": {
        "id": "user-uuid",
        "name": "João Silva"
      },
      "tags": ["licitação", "equipamentos"],
      "progress": 65
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 87,
    "totalPages": 5
  }
}
```

---

### 2. Criar Processo

**Endpoint:** `POST /processes`

**Request:**
```json
{
  "title": "Novo Processo",
  "description": "Descrição do processo",
  "priority": "medium",
  "dueDate": "2026-03-01T00:00:00Z",
  "assignedToId": "user-uuid",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "id": "proc-uuid-new",
  "title": "Novo Processo",
  "status": "pending",
  "createdAt": "2026-01-12T17:00:00Z"
}
```

---

## Signature API

### 1. Assinar Documento

**Endpoint:** `POST /documents/{id}/sign`

**Request:**
```json
{
  "signatureType": "digital" | "electronic",
  "certificate": "base64-encoded-certificate", // para assinatura digital
  "pin": "1234" // para assinatura digital
}
```

**Response:**
```json
{
  "message": "Documento assinado com sucesso",
  "signatureId": "sig-uuid",
  "signedAt": "2026-01-12T17:15:00Z",
  "signedBy": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "certificate": {
    "issuer": "ICP-Brasil",
    "validUntil": "2027-01-12T00:00:00Z"
  }
}
```

---

## Error Responses

Todos os endpoints podem retornar os seguintes erros:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Dados inválidos",
  "details": {
    "field": "email",
    "issue": "Formato de email inválido"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Token inválido ou expirado"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Você não tem permissão para acessar este recurso"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Recurso não encontrado"
}
```

### 422 Unprocessable Entity
```json
{
  "error": "Unprocessable Entity",
  "message": "Erro de validação",
  "details": [
    {
      "field": "name",
      "message": "Nome é obrigatório"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Erro interno do servidor",
  "requestId": "req-uuid"
}
```

---

## Rate Limiting

- **Limite**: 100 requisições por minuto por IP
- **Headers de resposta**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1641998400
  ```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Limite de requisições excedido",
  "retryAfter": 60
}
```

---

## Webhooks

### Configurar Webhook

**Endpoint:** `POST /webhooks`

**Request:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["document.created", "document.signed", "process.completed"],
  "secret": "your-webhook-secret"
}
```

### Eventos Disponíveis

- `document.created`
- `document.updated`
- `document.deleted`
- `document.signed`
- `document.shared`
- `process.created`
- `process.updated`
- `process.completed`
- `folder.created`

### Payload do Webhook

```json
{
  "event": "document.signed",
  "timestamp": "2026-01-12T17:15:00Z",
  "data": {
    "documentId": "doc-uuid-1",
    "signatureId": "sig-uuid",
    "signedBy": {
      "id": "user-uuid",
      "name": "João Silva"
    }
  }
}
```

---

## Paginação

Todos os endpoints de listagem suportam paginação:

**Query Parameters:**
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtros e Ordenação

**Query Parameters:**
- `search`: Busca textual
- `sortBy`: Campo para ordenação
- `sortOrder`: `asc` ou `desc`
- Filtros específicos por recurso

**Exemplo:**
```http
GET /documents?search=contrato&sortBy=createdAt&sortOrder=desc&tags=jurídico,2026
```

---

## Próximos Passos

- [COMPONENTS.md](./COMPONENTS.md) - Guia de componentes
- [TESTING.md](./TESTING.md) - Estratégia de testes
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solução de problemas
