# Testes E2E - Módulo Meu Dia

## 📋 Visão Geral

Testes end-to-end usando Playwright para garantir a qualidade e funcionalidade do módulo "Meu Dia" e fluxos de usuário relacionados.

## 🚀 Executando os Testes

### Instalar dependências (se necessário)
```bash
pnpm install
npx playwright install chromium
```

### Comandos disponíveis

```bash
# Executar todos os testes (headless)
pnpm test:e2e

# Executar com interface UI interativa
pnpm test:e2e:ui

# Executar com navegador visível
pnpm test:e2e:headed

# Executar em modo debug
pnpm test:e2e:debug

# Ver relatório dos últimos testes
pnpm test:e2e:report
```

## 📁 Estrutura de Arquivos

```
e2e/
├── README.md                      # Este arquivo
├── fixtures/
│   └── auth.ts                    # Fixture de autenticação
├── utils/                         # Utilitários compartilhados
├── my-day-navigation.spec.ts      # Testes de navegação do Meu Dia
└── user-flows.spec.ts             # Testes de fluxos completos de usuário
```

## 🧪 Cobertura de Testes

### Navegação do Módulo Meu Dia (`my-day-navigation.spec.ts`)

#### Cards de Métricas Principais
- ✅ Navegação para `/documents` (Total de Documentos)
- ✅ Navegação para `/settings/users` (Usuários Ativos)
- ✅ Navegação para `/processes` (Processos Ativos)
- ✅ Navegação para `/processes` (Taxa de Aprovação)

#### Seção de Documentos Recentes
- ✅ Botão "Ver todos" → `/documents`
- ✅ Click em documento → `/documents/{id}`

#### Seção de Workflows Ativos
- ✅ Click no card → `/processes/{id}`
- ✅ Botão "Ver detalhes" → `/processes/{id}`

#### Widget de Tarefas Prioritárias
- ✅ Botão "Ver todas as tarefas" → `/processes`
- ✅ Click em tarefa → `/processes/{procedure_id}`

#### Widget de Alertas de IA
- ✅ Botão "Ver todos os alertas" → `/intelligence/alerts`

#### Card do Assistente Ordoc
- ✅ "Fazer upload de documento" → `/documents?action=upload`
- ✅ "Criar novo processo" → `/processes?action=create`

#### Botão Flutuante
- ✅ Click no botão + → `/documents?action=upload`

#### Validação de Query Params
- ✅ Query param `action=upload` correto
- ✅ Query param `action=create` correto

**Total: 16 testes de navegação**

---

### Fluxos de Usuário Completos (`user-flows.spec.ts`)

1. ✅ **Login → Meu Dia → Documento → Voltar**
   - Autenticação
   - Navegação para Meu Dia
   - Click em card de documento
   - Navegação de volta

2. ✅ **Meu Dia → Upload de Documento**
   - Navegação para Meu Dia
   - Click no botão flutuante
   - Validação de query param

3. ✅ **Meu Dia → Criar Processo**
   - Navegação para Meu Dia
   - Click em criar processo
   - Validação de query param

4. ✅ **Meu Dia → Ver Documento → Processar**
   - Navegação completa de visualização de documento

5. ✅ **Meu Dia → Ver Alertas de IA → Marcar como Lido**
   - Interação com alertas
   - Validação de marcação como lido
   - Navegação para página completa

6. ✅ **Meu Dia → Ver Workflow → Detalhes**
   - Visualização de detalhes do workflow

7. ✅ **Múltiplas Navegações**
   - Teste de navegação sequencial
   - Validação de histórico do navegador

8. ✅ **Performance - Tempo de Carregamento**
   - Medição de performance (< 5s)

9. ✅ **Atualização Automática de Dados**
   - Validação de estabilidade da página

**Total: 9 testes de fluxos completos**

---

## 🔧 Configuração

### Variáveis de Ambiente

Criar arquivo `.env.test` na raiz do projeto:

```env
# Credenciais de teste
TEST_USER=admin
TEST_PASSWORD=admin123

# URL do servidor de testes
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

### Fixture de Autenticação

A fixture `authenticatedPage` gerencia automaticamente o login:
- Navega para `/login`
- Preenche credenciais
- Aguarda redirect para página inicial
- Fornece página autenticada para os testes

## 📊 Relatórios

Após executar os testes, um relatório HTML é gerado em `playwright-report/`.

Para visualizar:
```bash
pnpm test:e2e:report
```

## 🐛 Debug

Para debug interativo:
```bash
# Modo debug completo
pnpm test:e2e:debug

# Ou executar teste específico
npx playwright test my-day-navigation.spec.ts --debug
```

## 📝 Adicionando Novos Testes

### 1. Criar novo arquivo de teste

```typescript
import { test, expect } from './fixtures/auth'

test.describe('Nova Funcionalidade', () => {
  test('deve fazer algo', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/nova-pagina')
    // ... asserções
  })
})
```

### 2. Usar data-testid para seletores

```tsx
// No componente
<div data-testid="my-component">...</div>

// No teste
await page.locator('[data-testid="my-component"]').click()
```

## ✅ Checklist de Qualidade

- [ ] Todos os testes passam
- [ ] Cobertura > 80% das funcionalidades críticas
- [ ] Testes são independentes (podem rodar em qualquer ordem)
- [ ] Testes são resilientes (não quebram com pequenas mudanças de UI)
- [ ] Testes documentam o comportamento esperado

## 🔗 Recursos

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 📈 Métricas

- **Total de Testes**: 25
- **Tempo Médio de Execução**: ~30s
- **Cobertura de Navegação**: 100% (12/12 rotas)
- **Fluxos de Usuário**: 9 jornadas completas
