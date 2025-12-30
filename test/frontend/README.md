# Testes Frontend

Testes para o frontend Next.js 16 + React 19 da plataforma OrdocAI.

## 📁 Estrutura

```
test/frontend/
├── jest.config.js          # Configuração Jest
├── jest.setup.js           # Setup global (mocks, matchers)
├── __mocks__/             # Mocks globais
│   ├── next-navigation.ts
│   ├── zustand.ts
│   └── react-query.ts
├── unit/                  # Testes unitários (componentes)
│   ├── components/
│   │   ├── ui/
│   │   │   └── skeleton.test.tsx
│   │   └── error-boundary.test.tsx
│   ├── hooks/
│   │   └── use-tasks.test.ts
│   └── utils/
│       └── logger.test.ts
├── integration/           # Testes de integração (features)
│   ├── my-day.test.tsx
│   ├── documents.test.tsx
│   └── processes.test.tsx
└── e2e/                   # Testes E2E (Playwright)
    ├── auth.spec.ts
    └── workflows.spec.ts
```

## 🚀 Como Executar

```bash
# Instalar dependências de teste
cd frontend-new
pnpm install

# Rodar testes unitários (Jest)
pnpm test

# Rodar com coverage
pnpm test:coverage

# Rodar em watch mode
pnpm test:watch

# Rodar E2E (Playwright)
pnpm test:e2e

# Rodar E2E em modo UI
pnpm test:e2e:ui
```

## 📊 Metas de Cobertura

- **Geral**: 60%+
- **Componentes UI**: 70%+
- **Hooks**: 80%+
- **Utils**: 75%+
- **Stores (Zustand)**: 65%+

## 🛠️ Ferramentas

- **Jest**: Framework de testes
- **@testing-library/react**: Testing utilities React
- **@testing-library/jest-dom**: Matchers customizados
- **@testing-library/user-event**: Simulação de eventos
- **@playwright/test**: Testes E2E (já configurado)

## 📝 Convenções

1. **Nomes de arquivos**: `*.test.tsx` ou `*.spec.tsx`
2. **Co-location**: Testes ao lado dos arquivos quando faz sentido
3. **Describe blocks**: Agrupar testes relacionados
4. **User-centric**: Testar comportamento, não implementação

```tsx
// Exemplo de teste bem estruturado
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardsSkeleton } from '@/components/ui/skeletons'

describe('CardsSkeleton', () => {
  it('renders correct number of skeleton cards', () => {
    render(<CardsSkeleton count={3} />)

    const skeletons = screen.getAllByRole('generic')
    expect(skeletons).toHaveLength(3)
  })

  it('applies custom grid columns', () => {
    const { container } = render(
      <CardsSkeleton count={2} gridCols="grid-cols-2" />
    )

    const grid = container.firstChild
    expect(grid).toHaveClass('grid-cols-2')
  })
})
```

## 🎭 Testes E2E (Playwright)

Já configurados em `/frontend-new/e2e/`:
- Comandos disponíveis no `package.json`
- Navegadores: Chromium, Firefox, WebKit
- Modo headed/headless
- Screenshots e vídeos em falhas

## 🔍 Boas Práticas

1. **AAA Pattern**: Arrange, Act, Assert
2. **Query Priority**: getByRole > getByText > getByTestId
3. **Async**: Sempre usar `waitFor` para operações assíncronas
4. **User Events**: Preferir `userEvent` a `fireEvent`
5. **Accessibility**: Usar queries acessíveis (byRole, byLabelText)

```tsx
// ✅ BOM
test('user can submit form', async () => {
  const user = userEvent.setup()
  render(<MyForm />)

  await user.type(screen.getByLabelText('Nome'), 'João Silva')
  await user.click(screen.getByRole('button', { name: 'Enviar' }))

  await waitFor(() => {
    expect(screen.getByText('Sucesso!')).toBeInTheDocument()
  })
})

// ❌ RUIM
test('form submits', () => {
  render(<MyForm />)
  fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'João' } })
  fireEvent.click(screen.getByTestId('submit-btn'))
  expect(screen.getByTestId('success-msg')).toBeTruthy()
})
```
