# NextAuth API Route - Temporariamente Desabilitada

## Status
🔴 **DESABILITADA** - Aguardando backend estar pronto

## Arquivos
- `route.ts.disabled` - Rota da API do NextAuth (renomeada para desabilitar)

## Por que foi desabilitada?
A rota da API do NextAuth estava causando erros 500 porque tenta se conectar ao backend de autenticação que ainda não existe.

## Como reativar?

Quando o backend estiver pronto com o endpoint `/api/auth/login`:

1. Renomear o arquivo:
```bash
mv route.ts.disabled route.ts
```

2. Descomentar o SessionProvider em `/src/app/layout.tsx`:
```tsx
import { SessionProvider } from '@/providers/SessionProvider';

// No JSX:
<SessionProvider>
  <QueryProvider>
    ...
  </QueryProvider>
</SessionProvider>
```

3. Descomentar o middleware em `/src/middleware.ts`

4. Reiniciar o servidor de desenvolvimento

## Erros que foram resolvidos
- ❌ `Failed to execute 'json' on 'Response': Unexpected end of JSON input`
- ❌ `GET /api/auth/session 500`
- ❌ `Function.prototype.apply was called on #<Object>`

## Data de desabilitação
12/01/2026
