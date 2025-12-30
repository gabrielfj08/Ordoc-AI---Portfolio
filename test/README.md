# Testes OrdocAI

Infraestrutura completa de testes para a plataforma OrdocAI.

## 📁 Estrutura

```
test/
├── README.md                 # Este arquivo
├── backend/                  # Testes backend (pytest)
│   ├── README.md            # Documentação backend
│   ├── pytest.ini           # Configuração pytest
│   ├── conftest.py          # Fixtures globais (17 fixtures)
│   ├── factories/           # Factory Boy (dados fake)
│   │   ├── user_factory.py
│   │   └── organization_factory.py
│   ├── unit/                # Testes unitários
│   │   └── test_models.py  # Models: Document, Procedure, User
│   ├── integration/         # Testes de integração
│   │   ├── test_fsm.py     # FSM - 100% coverage ⚠️
│   │   └── test_api_auth.py # APIs de autenticação
│   └── e2e/                 # Testes end-to-end
│
├── frontend/                # Testes frontend (Jest)
│   ├── README.md           # Documentação frontend
│   ├── unit/               # Testes de componentes
│   │   ├── skeleton.test.tsx
│   │   ├── cards-skeleton.test.tsx
│   │   └── table-skeleton.test.tsx
│   ├── integration/        # Testes de features
│   └── __mocks__/          # Mocks globais
│
└── [arquivos legados]      # Testes antigos (raiz)
    ├── test_auth_ordocflow.py
    ├── test_ordoc_air_advanced.py
    └── ... (a migrar)
```

## 🚀 Executar Testes

### Backend (pytest)

```bash
# Instalar dependências
cd backend
poetry install --with dev

# Rodar todos os testes
poetry run pytest

# Com coverage report
poetry run pytest --cov

# Apenas testes rápidos
poetry run pytest -m fast

# Apenas testes FSM (crítico - 100% coverage)
poetry run pytest -m fsm

# Testes específicos
poetry run pytest test/backend/integration/test_fsm.py
poetry run pytest test/backend/unit/test_models.py::TestDocumentModel

# Ver coverage HTML
open test/backend/htmlcov/index.html
```

### Frontend (Jest)

```bash
# Instalar dependências
cd frontend-new
pnpm install

# Rodar todos os testes
pnpm test

# Watch mode (desenvolvimento)
pnpm test:watch

# Com coverage
pnpm test:coverage

# Ver coverage HTML
open frontend-new/coverage/lcov-report/index.html
```

### E2E (Playwright)

```bash
cd frontend-new

# Rodar testes E2E
pnpm test:e2e

# Modo UI interativo
pnpm test:e2e:ui

# Com browser visível
pnpm test:e2e:headed
```

## 📊 Metas de Cobertura

### Backend (pytest)

| Categoria | Meta | Status |
|-----------|------|--------|
| **Geral** | 75%+ | ⚠️ Obrigatório |
| **FSM** | 100% | ⚠️ CRÍTICO |
| **Models** | 80%+ | ✅ Recomendado |
| **ViewSets** | 70%+ | ✅ Recomendado |
| **Utils** | 60%+ | ℹ️ Desejável |

### Frontend (Jest)

| Categoria | Meta | Status |
|-----------|------|--------|
| **Geral** | 60%+ | ⚠️ Obrigatório |
| **Componentes UI** | 70%+ | ✅ Recomendado |
| **Hooks** | 80%+ | ✅ Recomendado |
| **Utils** | 75%+ | ✅ Recomendado |
| **Stores** | 65%+ | ℹ️ Desejável |

## 🛠️ Ferramentas

### Backend

- **pytest**: Framework de testes
- **pytest-django**: Integração Django
- **pytest-cov**: Coverage reports (v8)
- **pytest-mock**: Mocking capabilities
- **factory-boy**: Factories para modelos
- **faker**: Dados fake em pt_BR

### Frontend

- **Jest**: Framework de testes
- **@testing-library/react**: Testing utilities
- **@testing-library/jest-dom**: Matchers customizados
- **@testing-library/user-event**: Simulação de eventos
- **@playwright/test**: Testes E2E

## 📝 Convenções

### Backend

```python
# Nome de arquivos: test_*.py
# Nome de classes: Test*
# Nome de funções: test_*

@pytest.mark.django_db  # Para testes que usam DB
@pytest.mark.fast       # Testes rápidos
@pytest.mark.fsm        # Testes FSM (100% coverage)
class TestDocumentModel:
    def test_document_creation(self):
        doc = DocumentFactory()
        assert doc.id is not None
```

### Frontend

```tsx
// Nome de arquivos: *.test.tsx ou *.spec.tsx
// Describe blocks para agrupamento

describe('CardsSkeleton', () => {
  it('renders correct number of skeleton cards', () => {
    render(<CardsSkeleton count={3} />)
    const skeletons = screen.getAllByRole('generic')
    expect(skeletons).toHaveLength(3)
  })
})
```

## ⚠️ Testes Críticos

### FSM (Finite State Machines) - 100% Coverage Obrigatório

Os testes FSM em `test/backend/integration/test_fsm.py` **DEVEM** ter 100% de cobertura pois testam transições de estado críticas do sistema:

- **Procedure FSM**: archived ↔ draft ↔ running ↔ started → finished
- **Task FSM**: draft → running → started → finished / refused
- **GroupRequester FSM**: inactive ↔ active

Qualquer mudança nos modelos FSM **DEVE** ser acompanhada de testes.

## 🔍 Fixtures Disponíveis

### Backend (conftest.py)

```python
# Clients
api_client              # DRF API client
authenticated_api_client # DRF + JWT

# Users
user                    # Usuário comum
admin_user              # Usuário admin
user_password           # Senha padrão: testpass123

# Organizations
organization            # Organização de teste
user_with_organization  # User + Organization vinculados

# JWT
jwt_tokens              # {'access': '...', 'refresh': '...'}
auth_headers            # {'HTTP_AUTHORIZATION': 'Bearer ...'}

# Mocks
mock_celery_task        # Mock Celery
mock_redis_cache        # Mock Redis
mock_s3_storage         # Mock S3
mock_solr               # Mock Solr

# Helpers
assert_response_keys    # Validar keys em JSON
create_test_file        # Criar arquivos fake
```

### Factories

```python
from test.backend.factories import UserFactory, OrganizationFactory

# Criar usuário
user = UserFactory()
user = UserFactory(email='custom@example.com', password='custom123')

# Criar admin
admin = AdminUserFactory()

# Criar organização
org = OrganizationFactory()
org = OrganizationFactory(subdomain='my-org')
```

## 🐛 Debugging

### Backend

```bash
# Rodar teste específico com print statements
poetry run pytest test/backend/unit/test_models.py::TestDocumentModel::test_document_creation -s

# Ver SQL queries
poetry run pytest --ds=ordoc_ai.settings_test -v --tb=short

# Debug com breakpoint
# Adicionar breakpoint() no código
poetry run pytest --pdb
```

### Frontend

```bash
# Debug específico com watch
pnpm test -- --watch skeleton.test.tsx

# Ver queries DOM
# Use screen.debug() no teste
pnpm test

# CI mode (sem watch)
CI=true pnpm test
```

## 📈 CI/CD

### GitHub Actions (Sprint 4)

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run pytest
        run: |
          cd backend
          poetry install --with dev
          poetry run pytest --cov --cov-fail-under=75

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Jest
        run: |
          cd frontend-new
          pnpm install
          pnpm test:coverage
```

## 🔧 Troubleshooting

### Backend

**Erro: ModuleNotFoundError**
```bash
# Verificar PYTHONPATH
cd backend
poetry run python -c "import sys; print(sys.path)"

# Instalar modo editable
poetry install
```

**Erro: Database locked**
```bash
# Usar SQLite in-memory (settings_test.py já configurado)
# Ou deletar test database
rm db.sqlite3
```

### Frontend

**Erro: Cannot find module '@/...'**
```bash
# Verificar tsconfig.json e jest.config.ts
# Ambos devem ter alias '@' configurado
```

**Erro: Next.js router mock**
```bash
# jest.setup.ts já tem mocks do next/navigation
# Verificar se está sendo importado
```

## 📚 Recursos

- [Pytest Docs](https://docs.pytest.org/)
- [Django Testing](https://docs.djangoproject.com/en/5.2/topics/testing/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Playwright Docs](https://playwright.dev/)

---

**Última atualização:** Sprint 3 - Parte 2 (Dez/2025)
**Cobertura atual:**
- Backend: ~30% (meta: 75%+) ⚠️ Implementar mais testes
- Frontend: ~15% (meta: 60%+) ⚠️ Implementar mais testes
- FSM: 100% ✅ Crítico coberto
