# 📋 Plano de Integração - Seção Documentos

## 🎯 Objetivo
Integrar completamente a seção "Documentos" com Backend (OrdocAir, OrdocSign), Intelligence e Council, eliminando todos os dados mock e implementando inteligência estratégica.

---

## 📊 Análise da Estrutura Atual

### **Componentes Frontend Existentes**
```
documents/
├── documents-view.tsx          # Container principal com navegação
├── document-card.tsx           # Card individual de documento
├── categories-view.tsx         # Grid de categorias (MOCK)
├── templates-view.tsx          # Grid de templates (MOCK)
└── signatures/
    ├── sign-pending-view.tsx   # Pendentes de assinatura (MOCK)
    ├── sign-signed-view.tsx    # Documentos assinados (MOCK)
    └── sign-history-view.tsx   # Histórico de assinaturas (MOCK)
```

### **Services Backend Disponíveis**
- ✅ `services/ordoc-air/documents.ts` - CRUD de documentos
- ✅ `services/ordoc-air/directories.ts` - Gerenciamento de pastas
- ✅ `services/signature.ts` - Assinaturas digitais completo
- ✅ `services/intelligence.ts` - Alertas e análises
- ✅ `services/dashboard.ts` - Funções inteligentes (já usado em Minha Mesa)

---

## 🚀 Features a Implementar

### **FASE 1: Biblioteca de Documentos (Meu Drive)**

#### Feature 1.1: Documentos Recentes com Intelligence
**Objetivo**: Mostrar documentos recentes + IA analisa quais são mais relevantes

**Backend Integration**:
- `DocumentService.list({ ordering: '-created_at', limit: 10 })`
- Buscar documentos reais do OrdocAir

**Intelligence Integration**:
- IA analisa frequência de acesso
- Sugere documentos relacionados ao contexto atual
- Identifica documentos que precisam de atenção

**Council Integration**:
- Prioriza documentos por importância estratégica
- Identifica gaps (documentos faltantes em processos)

**Implementação**:
```typescript
// Novo serviço em dashboard.ts
async getRecentDocumentsIntelligent(): Promise<IntelligentDocument[]> {
  // 1. Buscar docs recentes do backend
  const recentDocs = await ordocAirService.list({
    ordering: '-created_at',
    limit: 20
  });

  // 2. IA analisa relevância
  const analysis = await intelligenceService.analyzeDocumentRelevance({
    documents: recentDocs,
    user_context: await getCurrentUserContext()
  });

  // 3. Council prioriza
  const prioritized = await councilService.prioritizeDocuments(analysis);

  return prioritized;
}
```

**UI Changes**:
- Badge "Sugerido" em documentos que IA recomenda
- Tooltip com motivo da sugestão
- Ordenação inteligente (não apenas por data)

---

#### Feature 1.2: Navegação de Pastas com Insights
**Objetivo**: Pastas mostram estatísticas inteligentes

**Backend Integration**:
- `DirectoryService.list()` - Listar pastas
- `DirectoryService.getStats(id)` - Estatísticas por pasta

**Intelligence Integration**:
- IA detecta pastas desorganizadas
- Sugere reorganização automática
- Alerta sobre pastas com muitos documentos pendentes

**Implementação**:
```typescript
interface IntelligentFolder {
  id: string;
  name: string;
  document_count: number;
  last_accessed: string;
  health_status: 'healthy' | 'needs_attention' | 'critical';
  ai_suggestions: string[];
  pending_actions: number;
}
```

**UI Changes**:
- Badge de status ao lado do nome da pasta
- Tooltip com insights: "12 documentos sem categoria", "3 documentos expirados"

---

#### Feature 1.3: Upload Inteligente
**Objetivo**: IA sugere categoria, tags e pasta ao fazer upload

**Intelligence Integration**:
- OCR automático no upload
- IA extrai metadados do conteúdo
- Sugere categoria baseada em padrões aprendidos
- Auto-tagging baseado no conteúdo

**Implementação**:
```typescript
async uploadDocumentWithAI(file: File) {
  // 1. Upload inicial
  const doc = await DocumentService.uploadDocument(file);

  // 2. IA analisa conteúdo
  const analysis = await intelligenceService.analyzeDocument(doc.id);

  // 3. Sugestões automáticas
  return {
    document: doc,
    suggestions: {
      category: analysis.suggested_category,
      tags: analysis.suggested_tags,
      directory: analysis.suggested_folder,
      confidence: analysis.confidence
    }
  };
}
```

**UI Changes**:
- Modal de upload com sugestões da IA
- Opção "Aplicar sugestões automaticamente"
- Feedback visual de confiança (score 0-100%)

---

### **FASE 2: Categorias Inteligentes**

#### Feature 2.1: Categorias Dinâmicas com IA
**Objetivo**: IA sugere e cria categorias baseado em padrões

**Backend Integration**:
- Criar endpoint `/ordoc-air/api/categories/`
- CRUD de categorias

**Intelligence Integration**:
- IA detecta padrões de organização
- Sugere novas categorias quando identifica clusters
- Aprende com organizações de outros usuários (hierárquico)

**Implementação**:
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  document_count: number;
  auto_generated: boolean; // IA criou automaticamente
  confidence_score: number;
  related_workflows: string[];
  usage_trend: 'increasing' | 'stable' | 'decreasing';
}

async getSuggestedCategories(): Promise<Category[]> {
  const analysis = await intelligenceService.analyzeCategoryPatterns();
  return analysis.suggested_categories;
}
```

**UI Changes**:
- Badge "Sugerida pela IA" em categorias auto-criadas
- Botão "Aceitar sugestão de categoria"
- Gráfico de tendência de uso

---

#### Feature 2.2: Auto-Categorização de Documentos
**Objetivo**: Documentos novos são categorizados automaticamente

**Intelligence Integration**:
- IA classifica documentos por conteúdo
- Machine learning baseado em histórico
- Melhora com feedback do usuário

**Implementação**:
```typescript
async autoCatego rizeDocument(docId: string) {
  const analysis = await intelligenceService.classifyDocument(docId);

  if (analysis.confidence > 0.85) {
    // Auto-aplicar com alta confiança
    await DocumentService.update(docId, {
      category: analysis.predicted_category
    });
  } else {
    // Sugerir para usuário aprovar
    await intelligenceService.createAlert({
      type: 'suggestion',
      message: `Categorizar "${doc.name}" como "${analysis.predicted_category}"?`,
      confidence: analysis.confidence
    });
  }
}
```

---

### **FASE 3: Templates Inteligentes**

#### Feature 3.1: Templates com Versionamento
**Objetivo**: Sistema de templates com controle de versão

**Backend Integration**:
- Endpoint `/ordoc-air/api/templates/`
- Versionamento automático

**Intelligence Integration**:
- IA detecta templates mais usados
- Sugere melhorias baseado em uso
- Identifica templates obsoletos

**Implementação**:
```typescript
interface Template {
  id: string;
  name: string;
  category: string;
  version: string;
  usage_count: number;
  last_used: string;
  ai_score: number; // IA avalia qualidade do template
  suggested_improvements: string[];
}
```

**UI Changes**:
- Badge de popularidade: "Usado 45x este mês"
- Sugestões de melhoria da IA
- Comparação entre versões

---

#### Feature 3.2: Geração Automática de Documentos
**Objetivo**: IA preenche templates com dados contextuais

**Council Integration**:
- Council sugere qual template usar para cada situação
- Preenche campos automaticamente com dados do sistema
- Valida completude antes de gerar

**Implementação**:
```typescript
async generateDocumentFromTemplate(templateId: string, context: any) {
  // 1. Council escolhe dados relevantes
  const data = await councilService.extractDataForTemplate(templateId, context);

  // 2. IA preenche template
  const filled = await intelligenceService.fillTemplate(templateId, data);

  // 3. Validação automática
  const validation = await councilService.validateDocument(filled);

  return {
    document: filled,
    validation,
    confidence: validation.score
  };
}
```

---

### **FASE 4: Assinaturas Inteligentes**

#### Feature 4.1: Pendentes com Priorização por IA
**Objetivo**: IA prioriza assinaturas urgentes

**Backend Integration**:
- `SignatureService.getRequests({ status: 'pending' })`

**Intelligence Integration**:
- IA analisa deadline
- Identifica documentos bloqueando processos
- Calcula impacto de não assinar

**Implementação**:
```typescript
interface PrioritySignature {
  id: string;
  title: string;
  received_at: string;
  deadline?: string;
  priority_score: number; // 1-10 calculado por IA
  impact: 'low' | 'medium' | 'high' | 'critical';
  blocks_processes: string[]; // IDs de processos bloqueados
  estimated_time: number; // minutos para assinar
}

async getPrioritizedSignatures(): Promise<PrioritySignature[]> {
  const pending = await SignatureService.getRequests({ status: 'pending' });

  // IA calcula prioridade
  const prioritized = await intelligenceService.prioritizeSignatures(pending);

  return prioritized.sort((a, b) => b.priority_score - a.priority_score);
}
```

**UI Changes**:
- Badge de urgência: "Crítico", "Alta", "Média", "Baixa"
- Tooltip: "Bloqueando 2 processos"
- Ordenação automática por prioridade
- Timer: "Assinar em ~5 minutos"

---

#### Feature 4.2: Histórico com Analytics
**Objetivo**: Intelligence analisa padrões de assinatura

**Intelligence Integration**:
- IA calcula tempo médio de assinatura por tipo
- Identifica gargalos no fluxo
- Sugere otimizações

**Implementação**:
```typescript
interface SignatureAnalytics {
  total_signed: number;
  avg_time_to_sign: number; // minutos
  peak_hours: number[]; // horas do dia
  most_signed_type: string;
  bottlenecks: {
    signer: string;
    avg_delay: number;
  }[];
  suggestions: string[];
}
```

**UI Changes**:
- Dashboard de analytics de assinaturas
- Gráfico de tempo médio
- Insights: "Você assina 30% mais rápido que a média"

---

### **FASE 5: Busca Inteligente**

#### Feature 5.1: Busca Semântica
**Objetivo**: Buscar por conceito, não apenas palavras exatas

**Intelligence Integration**:
- IA entende intenção da busca
- Busca por conteúdo, não só nome
- Sugere termos relacionados

**Implementação**:
```typescript
async searchDocumentsIntelligent(query: string) {
  // 1. IA expande query
  const expandedQuery = await intelligenceService.expandSearchQuery(query);

  // 2. Busca multi-campo
  const results = await DocumentService.search({
    q: query,
    search_fields: ['name', 'description', 'ocr_content', 'extracted_text'],
    semantic: true
  });

  // 3. Council re-rankeia resultados
  const ranked = await councilService.rankSearchResults(results, query);

  return ranked;
}
```

**UI Changes**:
- Autocomplete inteligente
- Sugestões: "Você quis dizer: contrato de prestação?"
- Filtros sugeridos pela IA

---

#### Feature 5.2: Filtros Inteligentes
**Objetivo**: IA sugere filtros relevantes ao contexto

**Intelligence Integration**:
- Detecta filtros mais usados
- Sugere combinações de filtros

**UI Changes**:
- "Filtros sugeridos": mostra os 3 mais relevantes
- Salvar filtros favoritos

---

## 📦 Estrutura de Serviços

### Novo: `services/documents-intelligence.ts`
```typescript
class DocumentsIntelligenceService {
  // Feature 1
  async analyzeDocumentRelevance(docs: Document[]): Promise<RelevanceAnalysis>;
  async suggestRelatedDocuments(docId: string): Promise<Document[]>;

  // Feature 2
  async analyzeCategoryPatterns(): Promise<CategorySuggestions>;
  async classifyDocument(docId: string): Promise<Classification>;

  // Feature 3
  async evaluateTemplate(templateId: string): Promise<TemplateScore>;
  async fillTemplate(templateId: string, data: any): Promise<FilledTemplate>;

  // Feature 4
  async prioritizeSignatures(signatures: SignatureRequest[]): Promise<PrioritySignature[]>;
  async analyzeSignaturePatterns(): Promise<SignatureAnalytics>;

  // Feature 5
  async expandSearchQuery(query: string): Promise<ExpandedQuery>;
  async suggestSearchFilters(query: string): Promise<FilterSuggestion[]>;
}
```

---

## 🎨 Filosofia de UX

**Princípios**:
1. **IA nos bastidores**: Não mostrar "IA fez X", mas mostrar resultado direto
2. **Confiança gradual**: Começar com sugestões, evoluir para automação
3. **Feedback loop**: Usuário aprova/rejeita → IA aprende
4. **Transparência**: Tooltip explica por que IA tomou decisão

**Exemplos**:
- ❌ "IA sugeriu categoria: Jurídico"
- ✅ "Categoria sugerida: Jurídico" (tooltip: "Baseado em 15 contratos similares")

- ❌ "Council priorizou este documento"
- ✅ Badge "Urgente" (tooltip: "Bloqueia 2 processos • Vence em 3 horas")

---

## 📊 Métricas de Sucesso

**KPIs**:
1. **Tempo médio de localização de documento**: -50%
2. **Documentos mal categorizados**: -80%
3. **Assinaturas em atraso**: -70%
4. **Uso de busca**: +40%
5. **Satisfação com organização**: 4.5/5

**Tracking**:
- Intelligence registra todas as interações
- Dashboard de analytics por usuário/organização
- A/B testing de features inteligentes

---

## 🔄 Ordem de Implementação Sugerida

### **Sprint 1: Fundação** (Features 1.1, 1.2, 4.1)
- Integrar documentos recentes com backend
- Pastas com dados reais
- Assinaturas pendentes priorizadas

### **Sprint 2: Organização** (Features 2.1, 2.2)
- Categorias dinâmicas
- Auto-categorização

### **Sprint 3: Automação** (Features 1.3, 3.1, 3.2)
- Upload inteligente
- Templates versionados
- Geração automática

### **Sprint 4: Assinaturas** (Feature 4.2)
- Histórico com analytics
- Insights de gargalos

### **Sprint 5: Busca** (Features 5.1, 5.2)
- Busca semântica
- Filtros inteligentes

---

## 🧪 Testing Strategy

**Unit Tests**:
- Cada função de serviço
- Lógica de priorização da IA

**Integration Tests**:
- Fluxo completo de upload → categorização → busca
- Assinatura end-to-end

**E2E Tests**:
- Usuário navega em documentos
- Busca e encontra documento
- Assina documento urgente

---

## 🚦 Checklist de Implementação

### Fase 1: Biblioteca (Features 1.1, 1.2, 1.3)
- [ ] Conectar Documentos Recentes com OrdocAir API
- [ ] Implementar `analyzeDocumentRelevance()` no Intelligence
- [ ] UI: Badge "Sugerido" em documentos
- [ ] Conectar Pastas com DirectoryService
- [ ] Implementar `getFolderInsights()` no Intelligence
- [ ] UI: Status health de pastas
- [ ] Implementar upload com análise automática
- [ ] UI: Modal de sugestões de IA no upload

### Fase 2: Categorias (Features 2.1, 2.2)
- [ ] Criar endpoint `/ordoc-air/api/categories/`
- [ ] Implementar `analyzeCategoryPatterns()`
- [ ] Implementar `classifyDocument()`
- [ ] UI: Grid de categorias com dados reais
- [ ] UI: Badge "Sugerida pela IA"
- [ ] Sistema de feedback (aceitar/rejeitar sugestão)

### Fase 3: Templates (Features 3.1, 3.2)
- [ ] Criar endpoint `/ordoc-air/api/templates/`
- [ ] Implementar versionamento
- [ ] Implementar `evaluateTemplate()`
- [ ] Implementar `fillTemplate()` com Council
- [ ] UI: Grid de templates com stats
- [ ] UI: Modal de geração de documento

### Fase 4: Assinaturas (Features 4.1, 4.2)
- [ ] Conectar Pendentes com SignatureService
- [ ] Implementar `prioritizeSignatures()`
- [ ] UI: Lista priorizada com badges
- [ ] Conectar Histórico com API
- [ ] Implementar `analyzeSignaturePatterns()`
- [ ] UI: Dashboard de analytics

### Fase 5: Busca (Features 5.1, 5.2)
- [ ] Implementar busca semântica no backend
- [ ] Implementar `expandSearchQuery()`
- [ ] Implementar `suggestSearchFilters()`
- [ ] UI: Autocomplete inteligente
- [ ] UI: Filtros sugeridos
- [ ] Sistema de busca por voz (futuro)

---

## 📝 Notas Importantes

1. **Dados Mock**: Eliminar 100% dos dados mock gradualmente
2. **Loading States**: Todos os componentes devem ter skeleton loaders
3. **Error Handling**: Fallback gracioso se IA falhar
4. **Performance**: Cache agressivo de análises da IA (5-15 min)
5. **Acessibilidade**: ARIA labels em todos os insights
6. **Mobile**: Touch-friendly, swipe para ações rápidas

---

## 🎯 Meta Final

**Visão**: Seção Documentos 100% inteligente onde:
- ✅ Documentos se organizam sozinhos
- ✅ Usuário encontra qualquer arquivo em segundos
- ✅ Assinaturas urgentes nunca atrasam
- ✅ Templates são preenchidos automaticamente
- ✅ IA aprende padrões e melhora continuamente

**O usuário não vê "IA"**, apenas vê um sistema que **funciona perfeitamente**.
