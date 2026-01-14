# Testes Frontend - Ordoc-AI

Este diretório contém todos os testes do frontend da aplicação Ordoc-AI.

## 📁 Estrutura de Diretórios

```
test/
├── unit/                      # Testes unitários
│   ├── components/           # Testes de componentes
│   │   ├── ui/              # Componentes UI base
│   │   ├── analytics/       # Componentes de analytics
│   │   ├── documents/       # Componentes de documentos
│   │   └── processes/       # Componentes de processos
│   ├── store/               # Testes de stores Zustand
│   ├── hooks/               # Testes de hooks customizados
│   └── services/            # Testes de serviços/API
├── integration/              # Testes de integração
├── accessibility/            # Testes de acessibilidade
└── utils/                    # Utilitários de teste
    ├── test-utils.tsx       # Funções helper para testes
    └── mocks.ts             # Dados mock reutilizáveis

cypress/
├── e2e/                      # Testes E2E
│   ├── auth.cy.ts           # Testes de autenticação
│   └── documents.cy.ts      # Testes de documentos
└── support/                  # Arquivos de suporte do Cypress
    ├── commands.ts          # Comandos customizados
    ├── e2e.ts              # Setup E2E
    └── component.ts         # Setup de componentes
```

## 🚀 Executando os Testes

### Testes Unitários (Jest)

```bash
# Executar todos os testes
pnpm test

# Executar em modo watch
pnpm test:watch

# Gerar relatório de cobertura
pnpm test:coverage

# Executar testes específicos
pnpm test button.test.tsx
pnpm test -- --testPathPattern=analytics
```

### Testes E2E (Cypress)

```bash
# Abrir interface do Cypress
pnpm test:e2e

# Executar em modo headless
pnpm test:e2e:headless

# Executar todos os testes
pnpm test:all
```

## 📝 Convenções de Nomenclatura

### Arquivos de Teste

- **Testes unitários**: `*.test.tsx` ou `*.test.ts`
- **Testes E2E**: `*.cy.ts`
- Localização: Espelhar a estrutura de `src/` dentro de `test/unit/`

### Estrutura de Testes

```typescript
describe('ComponentName', () => {
  describe('Feature/Behavior', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

## 🛠️ Utilitários de Teste

### Custom Render

Use `render` de `test-utils.tsx` em vez do React Testing Library padrão:

```typescript
import { render, screen } from '../../utils/test-utils'

test('renders component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Mocks

Dados mock reutilizáveis estão disponíveis em `test/utils/mocks.ts`:

```typescript
import { mockDocument, mockUser, mockChartData } from '../../utils/mocks'

test('displays document', () => {
  render(<DocumentCard document={mockDocument} />)
})
```

### User Events

Para simular interações do usuário:

```typescript
import userEvent from '@testing-library/user-event'

test('handles click', async () => {
  const user = userEvent.setup()
  render(<Button onClick={handleClick}>Click</Button>)
  
  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

## 🎯 Boas Práticas

### 1. Testes Unitários

- **Teste comportamento, não implementação**
- Use `screen.getByRole()` em vez de `getByTestId()` quando possível
- Teste casos de sucesso e erro
- Mantenha testes independentes e isolados

```typescript
// ✅ Bom
test('shows error message when form is invalid', async () => {
  render(<LoginForm />)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})

// ❌ Evite
test('calls handleSubmit', () => {
  const handleSubmit = jest.fn()
  render(<LoginForm onSubmit={handleSubmit} />)
  // Testa implementação interna
})
```

### 2. Testes de Acessibilidade

- Use `jest-axe` para validar acessibilidade
- Teste navegação por teclado
- Verifique ARIA labels e roles

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 3. Testes E2E

- Use comandos customizados do Cypress
- Teste fluxos completos de usuário
- Use `data-testid` para seletores estáveis

```typescript
// Usar comando customizado
cy.login('test@example.com', 'password123')

// Testar fluxo completo
cy.visit('/documents')
cy.uploadFile('test.pdf', 'application/pdf')
cy.contains(/upload.*sucesso/i).should('be.visible')
```

### 4. Cobertura de Testes

Metas de cobertura configuradas em `jest.config.js`:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🔍 Debugging

### Jest

```bash
# Executar com debug
node --inspect-brk node_modules/.bin/jest --runInBand

# Ver output detalhado
pnpm test -- --verbose

# Executar apenas testes que falharam
pnpm test -- --onlyFailures
```

### Cypress

```bash
# Abrir DevTools
cy.debug()

# Pausar execução
cy.pause()

# Log de informações
cy.log('Debug info')
```

## 📊 Relatórios de Cobertura

Após executar `pnpm test:coverage`, o relatório estará disponível em:

- **HTML**: `coverage/lcov-report/index.html`
- **Terminal**: Resumo exibido após execução

## 🔗 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Documentation](https://docs.cypress.io/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🆘 Problemas Comuns

### Erro: "Cannot find module"

```bash
# Limpar cache do Jest
pnpm test -- --clearCache
```

### Testes lentos

```bash
# Executar em paralelo
pnpm test -- --maxWorkers=4
```

### Cypress não abre

```bash
# Verificar instalação
npx cypress verify

# Reinstalar
pnpm add -D cypress
```

## 📞 Suporte

Para dúvidas ou problemas com os testes, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
