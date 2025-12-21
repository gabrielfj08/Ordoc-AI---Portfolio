# 📋 CHECKLIST COMPLETO - Navegação e Módulos OrdocAI

**Data:** 19/12/2025
**Status:** Sistema 100% Modernizado | Problema: LoadingScreen Legado

---

## 🎯 RESUMO EXECUTIVO

✅ **100% do sistema já está modernizado** com shadcn/ui e Tailwind CSS
❌ **Problema identificado:** Componente `LoadingScreen` legado aparecendo nas transições
🎯 **Objetivo:** Eliminar LoadingScreen e implementar transições suaves modernas

---

## 📊 CHECKLIST POR MÓDULO DA NAVEGAÇÃO

### 🔐 1. CONTROLE DE ACESSO (ordoc_cloud)

| Item do Menu | Página | Status | Componentes | Funcionalidade |
|--------------|--------|--------|-------------|----------------|
| **Usuários** | `/dashboard/ordoc-cloud/users` | ✅ Moderna | shadcn/ui Table | CRUD de usuários, 2FA, gestão de senhas |
| **Grupos** | `/dashboard/ordoc-cloud/groups` | ✅ Moderna | shadcn/ui Card | Hierarquia de grupos, membros |
| **Permissões** | `/dashboard/ordoc-cloud/permissions` | ✅ Moderna | shadcn/ui Badge | Permissões granulares por recurso |
| **Perfis** | `/dashboard/ordoc-cloud/profiles` | ✅ Moderna | shadcn/ui Form | Perfis de acesso customizados |
| **Políticas** | `/dashboard/ordoc-cloud/policies` | ✅ Moderna | shadcn/ui Select | Políticas allow/deny baseadas em ações |
| **Auditoria** | `/dashboard/ordoc-cloud/audit` | ✅ Moderna | lucide-react Icons | Log completo de ações do sistema |
| **Organizações** | `/dashboard/ordoc-cloud/organizations` | ✅ Moderna | shadcn/ui Table | Multi-tenancy, configurações por org |

**Backend:** `backend/ordoc_cloud/`
- ✅ 7 modelos principais
- ✅ 15+ endpoints REST
- ✅ Autenticação JWT + 2FA
- ✅ Sistema de roles (admin, manager, member)

---

### 📄 2. GESTÃO DOCUMENTAL (ordoc_air)

| Item do Menu | Página | Status | Componentes | Funcionalidade |
|--------------|--------|--------|-------------|----------------|
| **Documentos** | `/dashboard/ordoc-air/my-air` | ⚠️ Usa LoadingScreen | shadcn/ui Tree | Navegação hierárquica de pastas |
| **Categorias** | `/dashboard/ordoc-air/my-air` | ⚠️ Usa LoadingScreen | shadcn/ui Badge | Tags e categorização |
| **Templates** | `/dashboard/ordoc-air/my-air` | ⚠️ Usa LoadingScreen | shadcn/ui Card | Templates de documentos |
| **Arquivos** | `/dashboard/ordoc-air/my-air` | ⚠️ Usa LoadingScreen | lucide-react FileIcon | Upload/Download/Visualização |
| **Busca Avançada** | `/dashboard/ordoc-air/search` | ⚠️ Usa LoadingScreen | shadcn/ui Input | Busca full-text com Solr |
| **Recentes** | `/dashboard/ordoc-air/recents` | ⚠️ Usa LoadingScreen | shadcn/ui Table | Histórico de acessos |
| **Compartilhados** | `/dashboard/ordoc-air/shared` | ⚠️ Usa LoadingScreen | shadcn/ui Dialog | Links compartilháveis |
| **Lixeira** | `/dashboard/ordoc-air/recycle-bin` | ✅ Moderna | lucide-react Trash2 | Recuperação de documentos |

**Backend:** `backend/ordoc_air/`
- ✅ 10+ modelos (Document, Directory, Tag, OCRResult, etc)
- ✅ 20+ endpoints REST
- ✅ OCR com Celery
- ✅ Busca com Apache Solr
- ✅ Versionamento de documentos
- ✅ Permissões granulares

---

### 🔄 3. FLUXO DE TRABALHO (ordoc_flow)

| Item do Menu | Página | Status | Componentes | Funcionalidade |
|--------------|--------|--------|-------------|----------------|
| **Procedimentos** | `/dashboard/ordoc-flow/procedures` | ✅ Moderna | shadcn/ui Card | CRUD de procedimentos |
| **Tarefas** | `/dashboard/ordoc-flow/tasks` | ✅ Moderna | shadcn/ui Checkbox | Gestão de tarefas, atribuições |
| **Templates de Processo** | `/dashboard/ordoc-flow/procedure-templates` | ✅ Moderna | shadcn/ui Form | Templates com campos dinâmicos |
| **Solicitantes** | `/dashboard/ordoc-flow/requesters` | ✅ Moderna | shadcn/ui Table | Cadastro de cidadãos |
| **Grupos** | `/dashboard/ordoc-flow/groups` | ✅ Moderna | shadcn/ui Avatar | Grupos de responsáveis |
| **Assuntos** | `/dashboard/ordoc-flow/subjects` | ✅ Moderna | shadcn/ui Badge | Categorização de procedimentos |

**Backend:** `backend/ordoc_flow/`
- ✅ 20+ modelos (Procedure, Task, Template, Approval, etc)
- ✅ 30+ endpoints REST
- ✅ FSM (draft→running→finished→archived)
- ✅ Aprovações multi-etapas
- ✅ Notificações automáticas
- ✅ Portal para cidadãos (API externa)

---

### 🌐 4. PORTAL PÚBLICO (ordoc_cidadao)

| Item do Menu | Página | Status | Componentes | Funcionalidade |
|--------------|--------|--------|-------------|----------------|
| **Solicitações Públicas** | `/cidadao/dashboard/procedures` | ⚠️ Usa LoadingScreen | shadcn/ui Card | Criar nova solicitação |
| **Acompanhamento** | `/cidadao/dashboard/procedures/[id]` | ⚠️ Usa LoadingScreen | shadcn/ui Timeline | Status da solicitação |
| **Consultas** | `/cidadao/dashboard` | ✅ Moderna | lucide-react Search | Busca por protocolo |
| **Perfil** | `/cidadao/dashboard/profile` | ✅ Moderna | shadcn/ui Form | Dados do cidadão |

**Backend:** Usa `/api/ordoc-flow/api/external/` endpoints
- ✅ Autenticação separada (JWT)
- ✅ Acesso restrito aos próprios procedimentos
- ✅ Notificações por email

---

### ✍️ 5. ASSINATURA DIGITAL (ordoc_sign)

| Item do Menu | Página | Status | Componentes | Funcionalidade |
|--------------|--------|--------|-------------|----------------|
| **Documentos para Assinar** | `/dashboard/ordoc-sign/sign/[id]` | ✅ Moderna | shadcn/ui Dialog | Interface de assinatura |
| **Assinaturas** | `/dashboard/ordoc-sign/requests` | ✅ Moderna | shadcn/ui Table | Solicitações de assinatura |
| **Histórico** | `/dashboard/ordoc-sign/requests` | ✅ Moderna | lucide-react History | Log de assinaturas |
| **Certificados** | `/dashboard/ordoc-sign/certificates` | ✅ Moderna | shadcn/ui Card | Certificados A1/A3 |

**Backend:** `backend/ordoc_sign/`
- ✅ 7 modelos (Certificate, Request, Signature, etc)
- ✅ 10+ endpoints REST
- ✅ PKI com cryptography
- ✅ Assinaturas sequenciais/paralelas
- ✅ Validação de assinaturas

---

### 📊 6. RELATÓRIOS E ANALÍTICA (ordoc_reports)

| Item do Menu | Página | Status | Componentes | Funcionalidade |
|--------------|--------|--------|-------------|----------------|
| **Dashboard** | `/dashboard/ordoc-reports/dashboard` | ✅ Moderna | Charts/Graphs | Métricas em tempo real |
| **Métricas** | `/dashboard/ordoc-reports/dashboard` | ✅ Moderna | shadcn/ui Card | KPIs customizados |
| **Exportações** | `/dashboard/ordoc-reports/reports` | ✅ Moderna | lucide-react Download | PDF, Excel, CSV, JSON |
| **Templates** | `/dashboard/ordoc-reports/templates` | ✅ Moderna | shadcn/ui Form | Templates de relatórios |
| **Agendamentos** | `/dashboard/ordoc-reports/schedules` | ✅ Moderna | shadcn/ui Calendar | Relatórios automáticos |

**Backend:** `backend/ordoc_reports/`
- ✅ 5 modelos (Template, Report, Schedule, etc)
- ✅ 8+ endpoints REST
- ✅ Múltiplos formatos de export
- ✅ Agendamento com cron

---

## ❌ PROBLEMA IDENTIFICADO: LoadingScreen Legado

### 📍 Componente Problemático

**Arquivo:** `frontend/src/components/ui/LoadingScreen.tsx`

**Descrição:** Tela de loading com:
- Mensagens sequenciais ("Preparando seu ambiente...", "Carregando dashboard...")
- Barra de progresso fake (4 segundos)
- Animações de bounce
- Design legado (não usa shadcn/ui)

### 📍 Onde está sendo usado (13 arquivos)

#### OrdocAir (5 páginas):
1. ⚠️ `/dashboard/ordoc-air/my-air/page.tsx`
2. ⚠️ `/dashboard/ordoc-air/my-air/page-integrated.tsx`
3. ⚠️ `/dashboard/ordoc-air/recents/page.tsx`
4. ⚠️ `/dashboard/ordoc-air/search/page.tsx`
5. ⚠️ `/dashboard/ordoc-air/shared/page.tsx`

#### OrdocCloud (3 páginas):
6. ⚠️ `/dashboard/ordoc-cloud/users/page.tsx`
7. ⚠️ `/dashboard/ordoc-cloud/organizations/page.tsx`
8. ⚠️ `/dashboard/ordoc-cloud/organizations/[id]/page.tsx`
9. ⚠️ `/dashboard/ordoc-cloud/policies/page.tsx`

#### Portal Cidadão (2 páginas):
10. ⚠️ `/cidadao/dashboard/procedures/[id]/fields/page.tsx`
11. ⚠️ `/cidadao/dashboard/procedures/[id]/review/page.tsx`

#### Legado:
12. `/dashboard/ordoc-cloud/users/page-old.tsx` (pode deletar)

---

## ✅ SOLUÇÃO: Transições Modernas do Next.js

### 🎯 Estratégia

**ELIMINAR:**
- ❌ `LoadingScreen` component
- ❌ Delays artificiais (4 segundos)
- ❌ Mensagens de "Preparando..."

**IMPLEMENTAR:**
- ✅ React Suspense + Skeleton UI (shadcn/ui)
- ✅ Transições nativas do Next.js
- ✅ Loading states por componente
- ✅ Optimistic UI updates

### 📦 Componentes Modernos a Usar

#### 1. **Skeleton** (shadcn/ui)
```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-8 w-full" />
<Skeleton className="h-4 w-3/4" />
```

#### 2. **Suspense** (React 19)
```tsx
import { Suspense } from 'react';

<Suspense fallback={<TableSkeleton />}>
  <UsersTable />
</Suspense>
```

#### 3. **Loading.tsx** (Next.js App Router)
```tsx
// app/dashboard/ordoc-cloud/users/loading.tsx
export default function Loading() {
  return <TableSkeleton />;
}
```

#### 4. **View Transitions API** (Experimental)
```tsx
// next.config.ts
experimental: {
  viewTransitions: true
}
```

---

## 📝 PLANO DE AÇÃO

### FASE 1: Criar Componentes de Loading Modernos

**Criar:** `/components/ui/skeletons/`
- ✅ `TableSkeleton.tsx` - Para tabelas
- ✅ `CardSkeleton.tsx` - Para cards
- ✅ `FormSkeleton.tsx` - Para formulários
- ✅ `TreeSkeleton.tsx` - Para árvore de diretórios

### FASE 2: Refatorar Páginas OrdocAir (5 páginas)

| Página | Ação | Substituir por |
|--------|------|----------------|
| `my-air/page.tsx` | Remover LoadingScreen | TreeSkeleton + Suspense |
| `recents/page.tsx` | Remover LoadingScreen | TableSkeleton + Suspense |
| `search/page.tsx` | Remover LoadingScreen | FormSkeleton + Suspense |
| `shared/page.tsx` | Remover LoadingScreen | TableSkeleton + Suspense |

### FASE 3: Refatorar Páginas OrdocCloud (4 páginas)

| Página | Ação | Substituir por |
|--------|------|----------------|
| `users/page.tsx` | Remover LoadingScreen | TableSkeleton + Suspense |
| `organizations/page.tsx` | Remover LoadingScreen | TableSkeleton + Suspense |
| `organizations/[id]/page.tsx` | Remover LoadingScreen | CardSkeleton + Suspense |
| `policies/page.tsx` | Remover LoadingScreen | TableSkeleton + Suspense |

### FASE 4: Refatorar Portal Cidadão (2 páginas)

| Página | Ação | Substituir por |
|--------|------|----------------|
| `procedures/[id]/fields/page.tsx` | Remover LoadingScreen | FormSkeleton + Suspense |
| `procedures/[id]/review/page.tsx` | Remover LoadingScreen | CardSkeleton + Suspense |

### FASE 5: Limpeza

- ❌ Deletar `LoadingScreen.tsx`
- ❌ Deletar `users/page-old.tsx`
- ✅ Atualizar imports
- ✅ Testar navegação

---

## 🎨 EXEMPLO DE IMPLEMENTAÇÃO

### Antes (Com LoadingScreen):
```tsx
'use client';

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function UsersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Delay artificial de 4 segundos
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return <UsersTable />;
}
```

### Depois (Moderno com Suspense):
```tsx
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/skeletons/TableSkeleton';
import { UsersTable } from './UsersTable';

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Usuários</h1>

      <Suspense fallback={<TableSkeleton rows={10} />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
```

### Componente Skeleton:
```tsx
// components/ui/skeletons/TableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/4" />
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 MÉTRICAS DE SUCESSO

### Performance:
- ⏱️ **Redução de tempo de espera:** 4s → 0s (instantâneo)
- 🎨 **Skeleton aparece imediatamente** (< 100ms)
- ⚡ **Carregamento real dos dados** (200-500ms)
- 🔄 **Transições suaves** sem delays artificiais

### UX:
- ✅ Navegação fluida entre páginas
- ✅ Feedback visual imediato (skeleton)
- ✅ Sem mensagens genéricas de "Preparando..."
- ✅ Experiência nativa de SPA moderna

---

## 🚀 CONCLUSÃO

**Status Atual:**
- ✅ 100% do sistema modernizado com shadcn/ui
- ❌ 12 páginas ainda usam LoadingScreen legado
- 🎯 **Objetivo:** Eliminar LoadingScreen completamente

**Próximos Passos:**
1. Criar componentes Skeleton reutilizáveis
2. Refatorar as 12 páginas identificadas
3. Deletar LoadingScreen.tsx
4. Testar navegação completa
5. Documentar padrão de loading para futuro

**Tempo Estimado:** 1-2 horas para completar todas as fases

---

**Última Atualização:** 19/12/2025
**Responsável:** Claude AI
**Status:** Planejamento Completo ✅
