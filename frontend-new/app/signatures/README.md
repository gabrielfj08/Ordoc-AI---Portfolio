# Módulo de Assinaturas - Estrutura

## 📁 Estrutura de Arquivos

```
app/signatures/
├── page.tsx                    # Página principal do módulo
├── api/
│   └── index.ts               # Serviços de API (signatureRequestsApi, signersApi, etc.)
├── types/
│   └── index.ts               # Tipos TypeScript (SignatureRequest, Signer, Certificate, etc.)
├── hooks/                      # [A CRIAR] Hooks customizados
│   ├── use-signature-requests.ts
│   ├── use-certificates.ts
│   └── use-signers.ts
└── components/                 # [A CRIAR] Componentes UI
    ├── signature-request-card.tsx
    ├── signature-request-list.tsx
    ├── signature-detail-sidebar.tsx
    └── ...
```

## 🔧 Arquivos Compartilhados (Global)

```
services/
└── api-client.ts              # Cliente HTTP Axios (compartilhado entre todos os módulos)
```

## 📦 Imports

### Usar API de Assinaturas

```typescript
import { signatureRequestsApi, signersApi, certificatesApi } from './api'
```

### Usar Tipos

```typescript
import type { SignatureRequest, SignatureRequestSigner } from './types'
```

### Usar Cliente HTTP (de outros módulos)

```typescript
import apiClient from '@/services/api-client'
```

## 🎯 APIs Disponíveis

### `signatureRequestsApi`
- `list()` - Listar solicitações
- `create()` - Criar solicitação
- `retrieve(id)` - Obter detalhes
- `submit(id)` - Enviar para assinatura
- `cancel(id)` - Cancelar
- `myRequests()` - Minhas solicitações
- `pending()` - Pendentes

### `signersApi`
- `list()` - Listar assinantes
- `create()` - Adicionar assinante
- `sign(id, data)` - Assinar documento
- `decline(id, reason)` - Recusar
- `myAssignments()` - Minhas atribuições
- `pendingSignatures()` - Assinaturas pendentes

### `certificatesApi`
- `list()` - Listar certificados
- `upload(file, password)` - Upload de certificado
- `verify(id)` - Verificar validade
- `setDefault(id)` - Definir como padrão
- `myCertificates()` - Meus certificados

### `templatesApi`
- `list()` - Listar templates
- `create()` - Criar template
- `active()` - Templates ativos
- `duplicate(id, name)` - Duplicar

### `signaturesApi`
- `list()` - Listar assinaturas
- `verify(id)` - Verificar assinatura
- `byDocument(docId)` - Por documento

### `batchesApi`
- `list()` - Listar lotes
- `create()` - Criar lote
- `start(id)` - Iniciar processamento
- `progress(id)` - Obter progresso

## 🔐 Autenticação

O cliente HTTP (`api-client.ts`) automaticamente:
- Adiciona token Bearer do `localStorage.getItem('auth_token')`
- Trata erros 401 (não autenticado)
- Trata erros 403 (sem permissão)

## 🌐 Configuração

Base URL da API é configurada via variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## ✅ Status da Implementação

- [x] Cliente HTTP global
- [x] Tipos TypeScript completos
- [x] Serviços de API (6 APIs, 48+ métodos)
- [ ] Hooks customizados
- [ ] Componentes UI
- [ ] Página principal integrada
