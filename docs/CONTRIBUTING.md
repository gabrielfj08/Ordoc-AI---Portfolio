# Contributing Guide - Ordoc-AI

## Bem-vindo!

Obrigado por considerar contribuir para o Ordoc-AI! Este guia irá ajudá-lo a começar.

---

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

---

## Como Contribuir

### 1. Reportar Bugs

Use o [template de issue](../TROUBLESHOOTING.md#reportar-bugs) para reportar bugs.

**Antes de reportar:**
- Verifique se o bug já foi reportado
- Teste na versão mais recente
- Colete informações de debug

---

### 2. Sugerir Features

**Template de Feature Request:**
```markdown
**Problema que resolve**
Descrição clara do problema.

**Solução proposta**
Como você imagina a solução.

**Alternativas consideradas**
Outras abordagens que você pensou.

**Contexto adicional**
Screenshots, mockups, etc.
```

---

### 3. Pull Requests

#### Workflow

```bash
# 1. Fork o repositório
# 2. Clone seu fork
git clone https://github.com/seu-usuario/frontend-ordoc.git
cd frontend-ordoc

# 3. Adicione upstream
git remote add upstream https://github.com/adsumtec/frontend-ordoc.git

# 4. Crie uma branch
git checkout -b feature/minha-feature

# 5. Faça suas mudanças
# ...

# 6. Commit com mensagem descritiva
git commit -m "feat: adiciona componente X"

# 7. Push para seu fork
git push origin feature/minha-feature

# 8. Abra Pull Request no GitHub
```

#### Checklist do PR

- [ ] Código segue o style guide
- [ ] Testes passando (`pnpm test`)
- [ ] Linter passando (`pnpm lint`)
- [ ] TypeScript sem erros (`pnpm tsc --noEmit`)
- [ ] Documentação atualizada
- [ ] Screenshots (se UI)
- [ ] Descrição clara do PR

---

## Style Guide

### TypeScript

```typescript
// ✅ Usar tipos explícitos
function createDocument(name: string, type: string): Document {
  return { id: uuid(), name, type };
}

// ❌ Evitar any
function createDocument(data: any): any {
  return data;
}

// ✅ Usar interfaces para objetos
interface Document {
  id: string;
  name: string;
  type: string;
}

// ✅ Usar type para unions/intersections
type Status = 'pending' | 'completed' | 'failed';
```

---

### Naming Conventions

```typescript
// Componentes: PascalCase
const DocumentCard = () => {};

// Funções/variáveis: camelCase
const handleClick = () => {};
const isLoading = true;

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.ordoc.ai';

// Arquivos de componentes: PascalCase.tsx
// DocumentCard.tsx

// Arquivos de utilitários: camelCase.ts
// formatDate.ts
```

---

### Commit Messages

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: adiciona upload de documentos"

# Bug fixes
git commit -m "fix: corrige erro de autenticação"

# Documentação
git commit -m "docs: atualiza README"

# Refatoração
git commit -m "refactor: simplifica DocumentCard"

# Testes
git commit -m "test: adiciona testes para DocumentUpload"

# Chores
git commit -m "chore: atualiza dependências"

# Breaking changes
git commit -m "feat!: remove suporte a Node 18"
```

---

### Code Formatting

```bash
# Rodar Prettier
pnpm format

# Rodar ESLint
pnpm lint

# Fix automático
pnpm lint --fix
```

**Configuração do Prettier:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Estrutura de Arquivos

### Componentes

```
src/components/
├── ui/                    # Componentes base (Shadcn)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/                # Componentes de layout
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── ...
├── documents/             # Componentes de documentos
│   ├── DocumentCard.tsx
│   ├── DocumentList.tsx
│   └── ...
└── analytics/             # Componentes de analytics
    ├── ExecutiveHealthStatus.tsx
    ├── ROIDashboard.tsx
    └── ...
```

### Hooks

```
src/hooks/
├── useDocuments.ts
├── useDocumentUpload.ts
└── useAuth.ts
```

### Services

```
src/services/
├── api.ts              # Cliente Axios
├── documents.ts        # Serviço de documentos
├── analytics.ts        # Serviço de analytics
└── auth.ts             # Serviço de autenticação
```

---

## Testes

### Escrever Testes

```typescript
// test/components/DocumentCard.test.tsx
import { render, screen } from '@testing-library/react';
import { DocumentCard } from '@/components/documents/DocumentCard';

describe('DocumentCard', () => {
  it('deve renderizar o nome do documento', () => {
    const doc = { id: '1', name: 'Test.pdf' };
    render(<DocumentCard document={doc} />);
    expect(screen.getByText('Test.pdf')).toBeInTheDocument();
  });
});
```

### Rodar Testes

```bash
# Todos os testes
pnpm test

# Modo watch
pnpm test:watch

# Cobertura
pnpm test:coverage

# E2E
pnpm test:e2e
```

---

## Documentação

### Comentários de Código

```typescript
/**
 * Upload de documento com progresso
 * 
 * @param file - Arquivo a ser enviado
 * @param folderId - ID da pasta de destino (opcional)
 * @param onProgress - Callback de progresso
 * @returns Promise com documento criado
 * 
 * @example
 * ```typescript
 * const doc = await uploadDocument(file, 'folder-123', (progress) => {
 *   console.log(`${progress.percentage}%`);
 * });
 * ```
 */
async function uploadDocument(
  file: File,
  folderId?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<Document> {
  // ...
}
```

### README de Componentes

```markdown
# DocumentCard

Componente para exibir informações de um documento.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| document | Document | Yes | Documento a ser exibido |
| onSelect | (doc: Document) => void | No | Callback ao selecionar |
| selected | boolean | No | Se está selecionado |

## Exemplo

\`\`\`tsx
<DocumentCard
  document={doc}
  onSelect={handleSelect}
  selected={selectedId === doc.id}
/>
\`\`\`
```

---

## Review Process

### Como Revisar PRs

1. **Funcionalidade**: O código faz o que deveria?
2. **Testes**: Há testes adequados?
3. **Performance**: Há problemas de performance?
4. **Segurança**: Há vulnerabilidades?
5. **Acessibilidade**: É acessível?
6. **Documentação**: Está documentado?

### Feedback Construtivo

```markdown
# ✅ Bom feedback
"Ótimo trabalho! Sugiro usar `useMemo` aqui para evitar re-renders desnecessários."

# ❌ Feedback ruim
"Isso está errado."
```

---

## Releases

### Versionamento Semântico

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): Novas features
- **PATCH** (0.0.1): Bug fixes

### Changelog

```markdown
# Changelog

## [1.2.0] - 2026-01-12

### Added
- Novo componente ROIDashboard
- Upload com chunking para arquivos grandes

### Fixed
- Corrigido erro de autenticação
- Corrigido layout responsivo

### Changed
- Atualizado Next.js para 16.1.1
- Melhorado performance de listagem

### Deprecated
- Componente HealthMonitor (usar ExecutiveHealthStatus)

### Removed
- Suporte a Node 18

### Security
- Atualizado dependências com vulnerabilidades
```

---

## Recursos

### Ferramentas Recomendadas

- **VS Code** com extensões:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
  - GitLens

### Links Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Comunidade

- **Discord**: [Link](#)
- **GitHub Discussions**: [Link](#)
- **Twitter**: [@ordocai](#)

---

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

## Agradecimentos

Obrigado a todos os contribuidores que ajudam a tornar o Ordoc-AI melhor! 🎉
