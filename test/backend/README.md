# Testes Backend

Testes para o backend Django da plataforma OrdocAI.

## 📁 Estrutura

```
test/backend/
├── conftest.py              # Fixtures globais pytest
├── pytest.ini              # Configuração pytest
├── factories/              # Factories para modelos (factory-boy)
│   ├── __init__.py
│   ├── user_factory.py
│   ├── document_factory.py
│   └── procedure_factory.py
├── unit/                   # Testes unitários
│   ├── test_models.py
│   ├── test_serializers.py
│   └── test_utils.py
├── integration/            # Testes de integração
│   ├── test_api_auth.py
│   ├── test_api_documents.py
│   ├── test_api_procedures.py
│   └── test_fsm.py        # FSM - 100% coverage obrigatório
└── e2e/                    # Testes end-to-end
    └── test_workflows.py
```

## 🚀 Como Executar

```bash
# Instalar dependências de teste
cd backend
poetry install --with dev

# Rodar todos os testes
poetry run pytest

# Rodar com coverage
poetry run pytest --cov=. --cov-report=html

# Rodar testes específicos
poetry run pytest test/backend/integration/test_fsm.py

# Rodar apenas testes rápidos (marca 'fast')
poetry run pytest -m fast

# Ver coverage no browser
open htmlcov/index.html
```

## 📊 Metas de Cobertura

- **Geral**: 75%+
- **FSM (ordoc_flow)**: 100% (crítico)
- **Models**: 80%+
- **ViewSets**: 70%+
- **Utilities**: 60%+

## 🛠️ Ferramentas

- **pytest**: Framework de testes
- **pytest-django**: Integração Django
- **pytest-cov**: Coverage reports
- **pytest-mock**: Mocking
- **factory-boy**: Factories para modelos
- **faker**: Dados fake

## 📝 Convenções

1. **Nomes de arquivos**: `test_*.py`
2. **Nomes de funções**: `test_<feature>_<scenario>`
3. **Fixtures**: Usar `conftest.py` para fixtures reutilizáveis
4. **Factories**: Preferir factories a fixtures complexas
5. **Marcadores**: Usar `@pytest.mark` para categorizar

```python
# Exemplo de teste bem estruturado
import pytest
from test.backend.factories import DocumentFactory

@pytest.mark.django_db
class TestDocumentModel:
    def test_create_document_with_valid_data(self):
        doc = DocumentFactory()
        assert doc.id is not None
        assert doc.status == 'draft'

    def test_document_transition_draft_to_published(self):
        doc = DocumentFactory(status='draft')
        doc.publish()
        assert doc.status == 'published'
```

## 🔍 Testes Existentes

Os arquivos na raiz de `test/` são testes legados de integração:
- `test_auth_ordocflow.py` - Autenticação no OrdocFlow
- `test_final_auth.py` - Testes finais de auth
- `test_ordoc_air_advanced.py` - OrdocAir avançado
- `test_ordoc_reports.py` - Módulo de relatórios
- `test_ordocflow.py` - OrdocFlow completo
- `test_simple_auth.py` - Auth simples

Estes serão migrados gradualmente para a nova estrutura.
