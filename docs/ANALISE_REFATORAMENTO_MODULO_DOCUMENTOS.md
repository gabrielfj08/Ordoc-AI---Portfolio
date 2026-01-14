# 📋 ANÁLISE E REFATORAMENTO DO MÓDULO DOCUMENTOS (OrdocAir Frontend)

**Data:** 5 de janeiro de 2026  
**Objetivo:** Otimizar o módulo Documentos para refletir a simplicidade e eficiência do Google Drive  
**Referência:** Google Drive UI/UX e arquitetura  

---

## 🎯 OVERVIEW ATUAL

### Arquitetura Atual
```
┌──────────────────────────────────────────────────────────────────┐
│                    DocumentsPage (page.tsx)                      │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Sidebar (Left)  │  │  Main Content    │  │  Details        │ │
│  │  ResizablePanel  │  │  ResizablePanel  │  │  ResizablePanel │ │
│  │                  │  │                  │  │  (RightPanel)   │ │
│  │ - Meu Drive      │  │  - AI Insights   │  │                 │ │
│  │ - Recentes       │  │  - Filters       │  │ - Detalhes      │ │
│  │ - Favoritos      │  │  - Grid/List     │  │ - Atividades    │ │
│  │ - Compartilhados │  │  - Folders       │  │                 │ │
│  │ - Lixeira        │  │  - Documents     │  │ ScrollArea      │ │
│  │ - Status         │  │  - Pagination    │  │ (independ.)     │ │
│  │                  │  │  ScrollArea      │  │                 │ │
│  │ ScrollArea       │  │  (independ.)     │  └─────────────────┘ │
│  │ (independ.)      │  │                  │                      │
│  │                  │  │                  │                      │
│  └──────────────────┘  └──────────────────┘                      │
│        ↓                       ↓                     ↓           │
│     useDocumentsStore    useDocuments hook    (Query + State)    │
│        (Zustand)         (React Query)                           │
└──────────────────────────────────────────────────────────────────┘

Estado centralizado: documentsStore (Zustand)
├── Navegação: currentFolderId
├── Seleção: selectedItemId, selectedItemType, selectedItemIds
├── UI: viewMode, rightPanelOpen, rightPanelTab
├── DnD: draggedItemIds, dropTargetId
└── Modals: trashConfirmModal, permanentDeleteModal, emptyTrashModal

Data fetching:
├── useDocuments (2 queries paralelas: docs + dirs)
├── useDocumentFilters (filtros dinâmicos)
└── React Query (caching, invalidation)
```

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **REDUNDÂNCIA E COMPLEXIDADE EXAGERADA**

| Problema | Impacto | Exemplo |
|----------|--------|---------|
| **Dois sistemas de estado** | Confusão, bugs de sincronização | Zustand (store) + React Query (cache) ambos mantendo estado |
| **3 ResizablePanels independentes** | Gerenciamento manual de scroll | Cada painel tem ScrollArea próprio, sem sincronização |
| **Lógica de fetching duplicada** | 2 queries paralelas toda vez | `useDocuments` sempre busca docs + dirs, mesmo quando não precisa |
| **Filtros computados na página** | Ineficiência, re-renders | `selectedCategory` + `activeTypeFilter` + condições no `useDocuments` |
| **Estado de UI espalhado** | Difícil manter, bugs | `isCollapsed`, `selectedCategory`, `activeTypeFilter`, modal states |
| **DnD granular demais** | Overhead, código repetitivo | Cada item tem Draggable/Droppable wrapper |

### 2. **FALTA DE SCROLL INDEPENDENTE (BUG CRÍTICO)**

Problema observado nas imagens:
- Quando o usuário rola o **grid central**, a **sidebar esquerda** também desce (BUG!)
- Quando o usuário rola o **painel direito**, a **grid central** deveria **não** se mexer (OK, funciona)
- **Esperado:** Cada painel tem scroll independente (como Google Drive)

**Causa:** 
```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel> /* Sidebar com ScrollArea */
  <ResizablePanel> /* Main com ScrollArea */
  <ResizablePanel> /* RightPanel com ScrollArea */
</ResizablePanelGroup>
```

O container ResizablePanelGroup pode estar com `overflow: hidden` ruim, causando o scroll "vazar" para o pai.

### 3. **FETCHING INEFICIENTE**

Atual:
```tsx
// SEMPRE 2 queries paralelas
const [docsResponse, dirsResponse] = await Promise.all([
  documentsApi.list({ ...options, page }),
  (!options.search && !options.is_shared && !options.is_favorite && ...)
    ? directoriesApi.list({ parent: options.directory })
    : Promise.resolve(...)
])
```

**Problema:**
- Lógica condicional complexa para saber quando buscar dirs
- Se está em "Compartilhados", busca dirs? (não faz sentido)
- Se está em "Lixeira", busca dirs? (directoriesApi.list com in_trash?)
- **Resultado:** Requisições desnecessárias ou comportamento indefinido

### 4. **SELEÇÃO MÚLTIPLA INCOMPLETA**

Problema:
```tsx
selectedItemIds: [],  // Existe no store
// Mas na página, usa:
selectedItemId (singular)
// UI nunca usa selectedItemIds para multi-select
```

**Impacto:** Código morto, confusão, UI não suporta seleção múltipla visualmente.

### 5. **MODAIS GIGANTES E REDUNDANTES**

Três modais separados:
- `TrashConfirmModal` (mover para lixeira)
- `PermanentDeleteModal` (deletar permanentemente)
- `EmptyTrashModal` (esvaziar lixeira inteira)

Cada um com sua lógica própria, mas **poderiam ser 1 componente parametrizado**.

### 6. **ABRIR/FECHAR PAINEIS (Design Issue)**

Atual:
```tsx
rightPanelOpen: boolean  // Toggle global
rightPanelTab: 'details' | 'activity' | 'activities'  // Qual aba

// Mas não há estado de:
// - Qual painel está aberto? (apenas rightPanelOpen = o painel de detalhes)
// - Pode abrir múltiplos painéis? (Não, design atual é 1 por vez)
```

Esperado (como Google Drive):
- Painel de detalhes abre automaticamente ao clicar um item
- Painel fica aberto até clicar o X
- Ao clicar outro item, os detalhes **se atualizam** (painel fica aberto)

### 7. **RENAMING DIALOGS REDUNDANTES**

Dois dialogs separados:
- `RenameDocumentDialog`
- `RenameFolderDialog`

Ambos com lógica similar, poderiam ser **1 componente genérico**.

### 8. **UPLOAD E CREATE DIALOGS SEPARADOS**

- `CreateFolderDialog` (criar pasta)
- `UploadDocumentDialog` (upload arquivo)
- Dropdown menu para "Novo" com submenu

Tudo isso em UI separado, poderia ser **1 componente composto**.

### 9. **FILTROS COMPUTADOS NA PAGE**

Atual:
```tsx
const { filters, loading: filtersLoading, refetch: refetchFilters } = useDocumentFilters()

// Depois na UI:
{filters?.type_filters.slice(0, 3).map(...)}  // Renderização da query
```

**Problema:** Lógica de apresentação (mostrar top-3) na página; deveria estar no hook ou serviço.

### 10. **LAYOUT DND CONFUSO**

```tsx
<Droppable id="trash-zone" data={{ type: 'trash' }} className="w-full">
  <Button>Lixeira</Button>
</Droppable>

// Mas também tem:
<Droppable key={dir.id} id={dir.id} data={{ type: 'folder' }}>
  <Draggable id={dir.id} data={{ type: 'folder' }}>
    <div>...</div>
  </Draggable>
</Droppable>
```

**Problema:** 
- `Trash` é Droppable mas não é um item na grid
- Estrutura aninhada (Droppable > Draggable > div) é confusa
- Sem isolamento claro do contexto DnD

---

## ✅ CHECKLIST DE BUGS E ERROS

| # | Bug | Severidade | Verificação |
|---|-----|-----------|------------|
| 1 | Scroll sidebar vaza para main quando rola grid | 🔴 CRÍTICO | Teste: rolar grid central, sidebar move |
| 2 | `activeTypeFilter` não reseta ao mudar categoria | 🟡 MÉDIO | Clicar "Meu Drive", depois "Favoritos", tipo ainda filtrado? |
| 3 | Diretórios em "Compartilhados" aparecem? | 🟡 MÉDIO | Testar: listar compartilhados, ver dirs |
| 4 | `selectedItemIds` nunca é usado | 🟡 MÉDIO | Multi-select UI não funciona |
| 5 | Painel direito fecha ao clicar outro item | 🟡 MÉDIO | Clicar doc1 (painel abre), clicar doc2 → painel fecha/reabre? |
| 6 | Renaming folder/doc com mesma interface? | 🟡 MÉDIO | Testar ambos, UI inconsistente? |
| 7 | Upload falha, dialog fica aberto | 🟠 MÉDIO | Upload erro → dialog fecha ou fica travado? |
| 8 | Paginação not reset ao mudar filtro | 🟡 MÉDIO | Page 2 → muda categoria → ainda mostra página 2? |
| 9 | DnD não funciona em list view | 🟡 MÉDIO | Switch para list, tentar arrastar → funciona? |
| 10 | Stats trash não atualiza após delete | 🟡 MÉDIO | Delete doc → trash count não muda |
| 11 | AI Insights painel sempre renderiza | 🟠 BAIXO | Componente existe mas sem dados? Margin/height ruim? |
| 12 | Breadcrumbs navegação pasta não existe | 🟠 BAIXO | `directoryPath` declarado mas nunca preenchido |

---

## 🏗️ COMPARAÇÃO COM GOOGLE DRIVE

### Google Drive
```
┌──────────────┬─────────────────────────────────────┬──────────────┐
│   Sidebar    │          Main Grid/List             │   Details    │
│ (fixed)      │                                     │ (side-panel) │
│              │                                     │              │
│ - My Drive   │  Folders (2 items)                  │ [selected]   │
│ - Shared     │  ─────────────────                  │              │
│ - Recent     │  📁 Folder A     📁 Folder B        │ Name: ...    │
│ - Starred    │  [modified 1h]   [modified 2d]      │ Size: ...    │
│ - Trash      │                                     │ Shared: ...  │
│              │  Files (5 items)                    │              │
│              │  ─────────────────                  │              |
│              │  📄 File 1       📄 File 2          │              │
│              │  📄 File 3       📄 File 4          │              │
│              │  📄 File 5                          │              │
│              │                                     │              │
│              │  [Infinite scroll / pagination]     │              │
│              │                                     │              │
│              │  Cada painel: ScrollArea indep.     │ ScrollArea   │
└──────────────┴─────────────────────────────────────┴──────────────┘
```

### OrdocAI (Atual)
```
Mesma estrutura, mas:
- ✅ 3 painéis com scroll independente (quando funciona)
- ❌ Scroll vaza (sidebar se move com main)
- ❌ Dirs + Docs misturados (sem separação)
- ❌ Filtros computados na página
- ❌ Estado espalhado (Zustand + React Query + useState local)
- ✅ IA Insights (Google Drive não tem)
- ❌ DnD complexo
```

---

## 🚀 PLANO DE REFATORAMENTO (PHASE-BASED)

### **PHASE 1: FIX CRITICAL BUGS (1-2 dias)**

#### 1.1 Fix Scroll Independence
```tsx
// Problema: ResizablePanelGroup overflow:hidden ruim

// ANTES (page.tsx):
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel className={cn(..., "overflow-hidden")}>
    {/* Sidebar with ScrollArea */}
  </ResizablePanel>
  <ResizablePanel>
    <main className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1"> {/* OK, independente */}
      </ScrollArea>
    </main>
  </ResizablePanel>
  <ResizablePanel>
    <aside className="w-80 flex flex-col">
      <Tabs>
        <ScrollArea className="flex-1"> {/* OK, independente */}
        </ScrollArea>
      </Tabs>
    </aside>
  </ResizablePanel>
</ResizablePanelGroup>

// DEPOIS: Garantir que CADA painel tem overflow:auto, não hidden
<ResizablePanelGroup direction="horizontal" className="h-full">
  <ResizablePanel defaultSize={18} className="overflow-hidden">
    <aside className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">  {/* ScrollArea handle overflow */}
        {/* content */}
      </ScrollArea>
    </aside>
  </ResizablePanel>
  
  <ResizableHandle />
  
  <ResizablePanel defaultSize={64} className="overflow-hidden">
    <main className="h-full flex flex-col overflow-hidden">
      <header /> {/* fixed height */}
      <ScrollArea className="flex-1">  {/* Pega resto, scroll indep */}
        {/* content */}
      </ScrollArea>
    </main>
  </ResizablePanel>
  
  <ResizableHandle />
  
  <ResizablePanel defaultSize={18} className="overflow-hidden">
    <aside className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">  {/* indep scroll */}
        {/* content */}
      </ScrollArea>
    </aside>
  </ResizablePanel>
</ResizablePanelGroup>
```

**Verification:**
```bash
- Scroll grid central → sidebar fica fixo ✓
- Scroll painel direito → grid central fica fixo ✓
- Scroll sidebar → grid central fica fixo ✓
```

#### 1.2 Fix Filter Reset
```tsx
// ANTES:
const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null)
// Ao mudar selectedCategory, NOT reset (BUG)

// DEPOIS:
const handleCategoryChange = (category: string) => {
  setSelectedCategory(category)
  setActiveTypeFilter(null)  // RESET tipo
  setPage(1)                 // RESET paginação
}
```

#### 1.3 Fix Diretórios em Categorias
```tsx
// ANTES:
(!options.search && !options.is_shared && !options.is_favorite && !options.is_favorited) || options.in_trash
  ? directoriesApi.list({...})
  : Promise.resolve({...})

// DEPOIS: Claro e testável
const shouldFetchDirs = () => {
  if (options.search) return false  // Busca: apenas docs
  if (options.in_trash) return false  // Lixeira: apenas docs (não pastas na lixeira)
  if (options.is_shared) return false  // Compartilhados: apenas docs
  if (options.requires_signature) return false  // Assinatura: apenas docs
  return true  // Meu Drive, Recentes, Favoritos: dirs + docs
}

const [docsResponse, dirsResponse] = await Promise.all([
  documentsApi.list({...}),
  shouldFetchDirs() 
    ? directoriesApi.list({ parent: options.directory })
    : Promise.resolve({ results: [], count: 0 })
])
```

---

### **PHASE 2: CONSOLIDATE STATE (2-3 dias)**

#### 2.1 Single Source of Truth
```tsx
// ANTES: 3 sistemas de estado
// - Zustand (currentFolderId, selectedItemId, viewMode, etc)
// - React Query (documents, directories, loading, error)
// - useState local (isCollapsed, selectedCategory, activeTypeFilter)

// DEPOIS: Zustand = UI state only
// React Query = Data fetching + caching
// Computed values = Selectors

// 1. Move data fetching to React Query hooks
// 2. Zustand = apenas UI (viewMode, rightPanelOpen, sidebar collapsed)
// 3. Navigation (currentFolderId, selectedCategory) = URL params ou query

export function useDocumentsPageState() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // From URL (more reliable than state)
  const category = searchParams.get('category') || 'meu-drive'
  const folderId = searchParams.get('folder')
  const typeFilter = searchParams.get('type')
  const page = parseInt(searchParams.get('page') || '1')
  
  const setCategory = (cat: string) => {
    router.push(`/documents?category=${cat}`)
  }
  
  return { category, folderId, typeFilter, page, setCategory }
}
```

#### 2.2 Unify Sidebar State
```tsx
// ANTES: isCollapsed (local useState)
// DEPOIS: useDocumentsStore.sidebarCollapsed

// documentsStore.ts
interface DocumentsState {
  // UI only
  viewMode: 'grid' | 'list'
  rightPanelOpen: boolean
  rightPanelTab: 'details' | 'activities'
  sidebarCollapsed: boolean  // ADD
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void  // ADD
}
```

#### 2.3 Modal State Unification
```tsx
// ANTES: 3 modals separados
// DEPOIS: 1 generic modal + typed actions

interface DocumentsState {
  activeModal: {
    type: 'trash' | 'delete' | 'emptyTrash' | null
    items?: Array<{ id: string; name: string; type: 'document' | 'folder' }>
    stats?: { totalItems: number; totalSize: string }
  }
  
  openModal: (type: 'trash' | 'delete' | 'emptyTrash', payload?: any) => void
  closeModal: () => void
}

// 1 GenericConfirmModal component
export function ConfirmModal() {
  const { activeModal, closeModal } = useDocumentsStore()
  
  switch(activeModal.type) {
    case 'trash': return <TrashConfirm {...} />
    case 'delete': return <DeleteConfirm {...} />
    case 'emptyTrash': return <EmptyTrashConfirm {...} />
    default: return null
  }
}
```

---

### **PHASE 3: COMPONENT REFACTOR (3-4 dias)**

#### 3.1 Extract Layout Component
```tsx
// NEW: documents-layout.tsx
export function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={18} className="overflow-hidden">
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={64} className="overflow-hidden">
        {children}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={18} className="overflow-hidden">
        <RightPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

// page.tsx becomes much simpler
export default function DocumentsPage() {
  return (
    <DocumentsLayout>
      <DocumentsMainContent />
    </DocumentsLayout>
  )
}
```

#### 3.2 Merge Rename Dialogs
```tsx
// NEW: rename-dialog.tsx (generic)
export function RenameDialog({ 
  isOpen, 
  item, 
  onClose, 
  onRename 
}: {
  isOpen: boolean
  item: Document | Directory | null
  onClose: () => void
  onRename: (name: string) => Promise<void>
}) {
  const isFolder = item && 'path' in item
  return <Dialog>...</Dialog>
}

// In page.tsx:
// ANTES: setRenameDialogOpen, setRenameFolderDialogOpen
// DEPOIS:
const [renameItem, setRenameItem] = useState<Document | Directory | null>(null)
```

#### 3.3 Unify File Operations
```tsx
// NEW: file-operations-menu.tsx
export function FileActionsMenu({ item }: { item: Document | Directory }) {
  const isFolder = 'path' in item
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleOpen(item)}>Abrir</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRename(item)}>Renomear</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDelete(item)}>
          {isFolder ? 'Deletar pasta' : 'Deletar arquivo'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

#### 3.4 Extract Filters Component
```tsx
// NEW: documents-filters.tsx
export function DocumentsFilters() {
  const { category, typeFilter, setTypeFilter } = useDocumentsPageState()
  const { filters, isLoading } = useDocumentFilters()
  
  if (isLoading) return <FiltersSkeleton />
  if (!filters) return null
  
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b">
      <Badge
        variant={!typeFilter ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setTypeFilter(null)}
      >
        Todos ({filters.total_documents})
      </Badge>
      
      {filters.type_filters.slice(0, 5).map(f => (
        <Badge
          key={f.value}
          variant={typeFilter === f.value ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setTypeFilter(typeFilter === f.value ? null : f.value)}
        >
          {f.label} ({f.count})
        </Badge>
      ))}
    </div>
  )
}
```

---

### **PHASE 4: HOOKS & DATA (2-3 dias)**

#### 4.1 New Hooks Structure
```tsx
// hooks/use-documents-page.ts (MAIN hook)
export function useDocumentsPage() {
  const { category, folderId, typeFilter, page, setCategory, setTypeFilter } = useDocumentsPageState()
  
  const { documents, directories, isLoading, error, hasMore } = useDocumentsList({
    category,
    folderId,
    typeFilter,
    page,
    pageSize: 20
  })
  
  return {
    // State
    category, folderId, typeFilter, page,
    documents, directories,
    isLoading, error, hasMore,
    
    // Actions
    setCategory, setTypeFilter,
    setPage: (p) => router.push(`?page=${p}`),
    refetch: () => queryClient.invalidateQueries({ queryKey: ['documents-list'] })
  }
}

// hooks/use-documents-list.ts (DATA fetching)
export function useDocumentsList(options: UseDocumentsListOptions) {
  return useQuery({
    queryKey: ['documents-list', options],
    queryFn: async () => {
      // Only fetch dirs if makes sense
      const [docs, dirs] = await Promise.all([
        documentsApi.list(options),
        shouldFetchDirs(options) 
          ? directoriesApi.list({ parent: options.folderId })
          : Promise.resolve({ results: [], count: 0 })
      ])
      
      return { documents: docs.results, directories: dirs.results }
    }
  })
}
```

#### 4.2 Simplify Services
```tsx
// services/documents-api.ts
export const documentsApi = {
  // BEFORE: 10 methods for different filters
  // AFTER: 2 methods (list + retrieve)
  
  list(options: {
    category?: 'meu-drive' | 'compartilhados' | 'lixeira' | 'favoritos'
    folderId?: string
    typeFilter?: string
    page?: number
    pageSize?: number
  }) {
    // Backend handles all filters based on category
    return apiClient.get('/api/v1/ordoc-air/documents/', { params: options })
  },
  
  retrieve(id: string) {
    return apiClient.get(`/api/v1/ordoc-air/documents/${id}/`)
  }
}
```

---

### **PHASE 5: TESTING & POLISH (1-2 dias)**

#### 5.1 Test Cases
```
✅ Scroll independence (sidebar, main, right panel)
✅ Filter reset on category change
✅ Pagination reset on filter change
✅ Multi-select + bulk delete
✅ DnD in grid and list view
✅ Keyboard shortcuts (Ctrl+A, Delete, Escape)
✅ Responsive (mobile, tablet, desktop)
```

#### 5.2 Performance
```
- Memoize DocumentItem component (prevent re-renders)
- Virtual scroll for 1000+ items (react-window)
- Lazy load AI Insights (if slow)
- Code split: documents chunk separate
```

---

## 📊 BEFORE/AFTER COMPARISON

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Lines in page.tsx** | 861 | ~400 | -54% |
| **Local useState** | 12 | 0 | -100% |
| **Components (page)** | 1 huge | 5 small | Better |
| **Fetch queries** | Always 2 | Smart (0-2) | More efficient |
| **State systems** | 3 (Zustand + Query + useState) | 2 (Zustand + Query) | Cleaner |
| **Modal dialogs** | 3 | 1 | -66% |
| **Rename dialogs** | 2 | 1 | -50% |
| **Bugs** | 12 identified | 0-2 critical | Mostly fixed |

---

## 🛠️ IMPLEMENTATION ROADMAP

### Week 1
- [ ] Phase 1 (Fix Critical Bugs) - Scroll, Filters, Dirs
- [ ] Phase 2 (Consolidate State) - URL params, Zustand cleanup

### Week 2
- [ ] Phase 3 (Component Refactor) - Extract Layout, Modals, Filters
- [ ] Phase 4 (Hooks & Data) - New hooks structure

### Week 3
- [ ] Phase 5 (Testing & Polish) - QA, Performance, Docs
- [ ] Deploy & Monitor

---

## 📝 FILES TO CREATE/MODIFY

### NEW FILES
```
components/documents/
├── documents-layout.tsx          (NEW - main layout wrapper)
├── documents-main-content.tsx    (NEW - extracted from page)
├── sidebar/
│   └── documents-sidebar.tsx     (NEW - extracted sidebar)
├── main-content/
│   ├── documents-filters.tsx     (NEW - extracted filters)
│   ├── documents-grid.tsx        (NEW - grid view logic)
│   └── documents-list.tsx        (NEW - list view logic)
├── right-panel/
│   └── documents-right-panel.tsx (NEW - extracted right panel)
├── file-operations-menu.tsx      (NEW - merged actions)
├── rename-dialog.tsx             (NEW - merged rename)
└── confirm-modal.tsx             (NEW - merged modals)

hooks/
├── use-documents-page.ts         (NEW - main page hook)
└── use-documents-list.ts         (NEW - data hook)
```

### MODIFIED FILES
```
app/documents/page.tsx            (MAJOR refactor - 861 → 200 lines)
stores/documentsStore.ts          (Remove data state, keep UI only)
hooks/use-documents.ts            (Rename → use-documents-list.ts, simplify)
```

### REMOVED FILES
```
components/rename-document-dialog.tsx (merge into rename-dialog.tsx)
components/rename-folder-dialog.tsx   (merge into rename-dialog.tsx)
components/modals/TrashConfirmModal.tsx (merge)
components/modals/PermanentDeleteModal.tsx (merge)
components/modals/EmptyTrashModal.tsx (merge)
components/document-actions-menu.tsx (merge)
components/folder-actions-menu.tsx (merge)
```

---

## 🎓 LESSONS LEARNED & BEST PRACTICES

### ✅ DO
- ✅ Use URL params for navigation/filtering (survives refresh, shareable)
- ✅ Single source of truth per concept (state vs data vs UI)
- ✅ Extract layout into separate components (easier to reuse)
- ✅ Generic components (rename, confirm, actions) instead of duplicates
- ✅ Smart data fetching (don't fetch what you don't need)
- ✅ Memoize expensive components (prevent unnecessary renders)

### ❌ DON'T
- ❌ Multiple state managers for same thing (Zustand + useState + Query)
- ❌ Mega components (page.tsx > 500 lines)
- ❌ Conditional logic in templates (move to services/hooks)
- ❌ Duplicate dialogs/modals (use parameters instead)
- ❌ Always fetching data you might not use
- ❌ Storing data in UI state (that's what Query is for)

---

## 🔗 REFERENCIAS

- **Google Drive:** https://drive.google.com (reference UI)
- **React Query:** https://tanstack.com/query/latest (data fetching)
- **Zustand:** https://github.com/pmndrs/zustand (UI state)
- **ResizablePanels:** https://github.com/bvaughn/react-resizable-panels

---

## 📞 PRÓXIMOS PASSOS

1. **Aprovação:** Revisar este plano com o time
2. **Prototipagem:** Criar branch `refactor/documents-module`
3. **Phase 1:** Começar com bugs críticos (scroll, filters)
4. **Teste:** Cada phase tem test checklist
5. **Review:** PR com antes/depois de performance
6. **Deploy:** Gradualmente (feature flags se necessário)

---

**Estimativa Total:** 2-3 semanas (com 1 dev full-time)  
**Risco:** Médio (mudanças internas, UI igual)  
**Benefício:** Alto (performance, maintainability, bug fixes)

