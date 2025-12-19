# 🔗 OrdocIntegrations - Sistema de Integrações Externas

Sistema completo de integrações com serviços externos brasileiros para a plataforma OrdocAI.

## 📋 Visão Geral

O **OrdocIntegrations** é um módulo Django que fornece uma camada de abstração robusta para integração com APIs externas, especialmente focado em serviços brasileiros como:

- Gov.br (Login Único)
- Receita Federal (CPF/CNPJ)
- SERASA (Consulta de Crédito)
- Cartórios (CRI/CNJ)
- Detran, TSE, INSS, OAB, CRM, etc.

## 🏗️ Arquitetura

### Camadas

```
┌─────────────────────────────────────┐
│         API REST (ViewSets)         │
├─────────────────────────────────────┤
│      Serializers (DRF)              │
├─────────────────────────────────────┤
│    Service Layer (Integrations)     │
├─────────────────────────────────────┤
│  Cache Layer (Redis + Database)     │
├─────────────────────────────────────┤
│         Data Layer (Models)         │
└─────────────────────────────────────┘
```

### Componentes Principais

#### 1. **Models** (`models.py`)
- **IntegrationService**: Registro de serviços disponíveis
- **IntegrationRequest**: Auditoria de todas as requisições
- **IntegrationCache**: Sistema de cache dual (Redis + DB)

#### 2. **Base Service** (`services/base.py`)
Classe abstrata `BaseIntegrationService` que fornece:
- ✅ Cache automático (Redis + Database)
- ✅ Rate limiting
- ✅ Retry logic com exponential backoff
- ✅ Logging estruturado
- ✅ Métricas e auditoria
- ✅ Error handling padronizado

#### 3. **Specific Services** (`services/`)
- `receita_federal.py` - Validação de CPF/CNPJ ✅
- `govbr.py` - Login único Gov.br ⏳
- `serasa.py` - Consulta de crédito ⏳
- ... (15+ serviços planejados)

#### 4. **API REST** (`views.py`, `serializers.py`)
- ViewSets completos para CRUD
- Endpoints específicos para cada integração
- Filtros, paginação e ordenação
- Documentação automática (Swagger)

#### 5. **Celery Tasks** (`tasks.py`)
- Limpeza automática de cache
- Validações em batch
- Health checks
- Estatísticas

## 🚀 Instalação e Setup

### 1. Migrations

```bash
cd backend
python manage.py makemigrations ordoc_integrations
python manage.py migrate ordoc_integrations
```

### 2. Configurar Serviços

Acesse o Django Admin ou use o seguinte comando:

```python
from ordoc_integrations.models import IntegrationService

# Criar serviço Receita Federal
IntegrationService.objects.create(
    service_type='receita_federal',
    name='Receita Federal do Brasil',
    description='Validação de CPF e CNPJ',
    base_url='https://www.receitaws.com.br/v1',  # API exemplo
    api_version='1.0',
    status='active',
    is_enabled=True,
    requires_auth=False,
    rate_limit=100,  # requisições por minuto
    timeout_seconds=30,
    retry_attempts=3,
    cache_ttl_seconds=86400,  # 24 horas
)
```

### 3. Configurar Celery Beat (Opcional)

Adicione ao `celerybeat_schedule` em `settings.py`:

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'clear-expired-cache-daily': {
        'task': 'ordoc_integrations.clear_expired_cache',
        'schedule': crontab(hour=2, minute=0),  # 2am diariamente
    },
    'cleanup-old-requests-weekly': {
        'task': 'ordoc_integrations.cleanup_old_requests',
        'schedule': crontab(day_of_week=1, hour=3, minute=0),  # Segunda 3am
        'kwargs': {'days': 90},
    },
    'health-check-hourly': {
        'task': 'ordoc_integrations.health_check_services',
        'schedule': crontab(minute=0),  # A cada hora
    },
}
```

## 📚 API Endpoints

### Base URL
```
/api/v1/integrations/
```

### Services

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/services/` | Lista serviços disponíveis |
| GET | `/services/{id}/` | Detalha serviço |
| GET | `/services/{id}/stats/` | Estatísticas do serviço |
| POST | `/services/{id}/toggle_status/` | Ativa/desativa serviço |

### Requests (Auditoria)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/requests/` | Lista requisições |
| GET | `/requests/{id}/` | Detalha requisição |
| GET | `/requests/my_requests/` | Minhas requisições |
| GET | `/requests/recent/` | Últimas 24h |
| GET | `/requests/failed/` | Requisições com erro |

### Cache

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/cache/` | Lista cache |
| POST | `/cache/clear_expired/` | Remove cache expirado |
| POST | `/cache/invalidate/` | Invalida cache específico |

### Execute (Integrações)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/execute/validate-cpf/` | Valida CPF |
| POST | `/execute/validate-cnpj/` | Valida CNPJ |
| POST | `/execute/check-credit/` | Consulta crédito SERASA |

## 💻 Uso Programático

### Exemplo 1: Validar CPF

```python
from ordoc_integrations.services.receita_federal import ReceitaFederalService

# Criar instância do serviço
service = ReceitaFederalService(
    organization_id=1,
    user_id=1
)

# Validar CPF
try:
    data, request = service.validate_cpf_data('123.456.789-00')

    if data['valid']:
        print(f"CPF válido: {data['cpf']}")
    else:
        print(f"CPF inválido: {data['message']}")

    # Request object contém auditoria
    print(f"Tempo de execução: {request.execution_time_ms}ms")
    print(f"Do cache: {request.from_cache}")

except IntegrationException as e:
    print(f"Erro: {str(e)}")
```

### Exemplo 2: Validar CNPJ

```python
from ordoc_integrations.services.receita_federal import ReceitaFederalService

service = ReceitaFederalService(organization_id=1)

# Validar e obter dados da empresa
data, request = service.validate_cnpj_data('11.222.333/0001-81')

if data['valid']:
    company = data['company']
    print(f"Empresa: {company['nome']}")
    print(f"Situação: {company['situacao']}")
    print(f"CNAE: {data['activities']['primary']['text']}")
```

### Exemplo 3: Usar Cache

```python
# Primeira chamada - consulta API
data1, req1 = service.validate_cpf_data('123.456.789-00')
print(req1.from_cache)  # False

# Segunda chamada - retorna do cache
data2, req2 = service.validate_cpf_data('123.456.789-00')
print(req2.from_cache)  # True

# Forçar refresh
data3, req3 = service.execute(
    identifier='123.456.789-00',
    request_type='validate_cpf',
    force_refresh=True  # Ignora cache
)
```

### Exemplo 4: Validação Assíncrona (Celery)

```python
from ordoc_integrations.tasks import execute_integration_async

# Executar em background
result = execute_integration_async.delay(
    service_type='receita_federal',
    identifier='123.456.789-00',
    request_type='validate_cpf',
    organization_id=1,
    user_id=1
)

# Verificar resultado depois
if result.ready():
    data = result.get()
    print(data)
```

### Exemplo 5: Validação em Batch

```python
from ordoc_integrations.tasks import bulk_validate_identifiers

cpfs = [
    '123.456.789-00',
    '987.654.321-00',
    '111.222.333-44',
]

result = bulk_validate_identifiers.delay(
    identifiers=cpfs,
    service_type='receita_federal',
    request_type='validate_cpf',
    organization_id=1
)

# Resultado
data = result.get()
print(f"Sucesso: {data['successful']}/{data['total']}")
for item in data['results']:
    print(f"{item['identifier']}: {'✓' if item['success'] else '✗'}")
```

## 🔧 Configuração Avançada

### Customizar Rate Limit

```python
service = IntegrationService.objects.get(service_type='receita_federal')
service.rate_limit = 200  # 200 req/min
service.save()
```

### Customizar TTL do Cache

```python
service = IntegrationService.objects.get(service_type='receita_federal')
service.cache_ttl_seconds = 3600  # 1 hora
service.save()
```

### Customizar Timeout e Retry

```python
service = IntegrationService.objects.get(service_type='receita_federal')
service.timeout_seconds = 60  # 60 segundos
service.retry_attempts = 5  # 5 tentativas
service.save()
```

## 📊 Monitoramento e Métricas

### Visualizar Estatísticas

```python
from ordoc_integrations.models import IntegrationService
from datetime import timedelta
from django.utils import timezone

service = IntegrationService.objects.get(service_type='receita_federal')

# Requisições dos últimos 30 dias
since = timezone.now() - timedelta(days=30)
requests = service.requests.filter(created_at__gte=since)

# Métricas
total = requests.count()
success = requests.filter(status='success').count()
cached = requests.filter(from_cache=True).count()

success_rate = (success / total * 100) if total > 0 else 0
cache_hit_rate = (cached / total * 100) if total > 0 else 0

print(f"Total: {total}")
print(f"Taxa de sucesso: {success_rate:.2f}%")
print(f"Cache hit rate: {cache_hit_rate:.2f}%")
```

### Logs

```python
import logging

logger = logging.getLogger('ordoc_integrations')
logger.setLevel(logging.DEBUG)
```

## 🧪 Testes

```bash
# Rodar testes
python manage.py test ordoc_integrations

# Com coverage
coverage run --source='ordoc_integrations' manage.py test ordoc_integrations
coverage report
```

## 🔐 Segurança

### Credenciais

As credenciais dos serviços são armazenadas no campo `credentials` (JSONField) do modelo `IntegrationService`.

**⚠️ IMPORTANTE:** Em produção, use criptografia para proteger credenciais:

```python
from cryptography.fernet import Fernet

# Gerar chave
key = Fernet.generate_key()

# Criptografar
cipher = Fernet(key)
encrypted = cipher.encrypt(b'api_secret_key')

# Salvar
service.credentials = {'api_key': encrypted.decode()}
service.save()
```

### Rate Limiting

O sistema implementa rate limiting automático usando Redis:

- Limite configurável por serviço
- Por organização
- Janela de 60 segundos
- Exceção `IntegrationRateLimitException` quando excedido

## 📝 Roadmap

### Sprint 1 (Semanas 1-2) ✅
- [x] Infraestrutura base
- [x] Models
- [x] BaseIntegrationService
- [x] Cache Redis + DB
- [x] Rate limiting
- [x] ViewSets e Serializers

### Sprint 2 (Semanas 3-4) ⏳
- [ ] Integração Gov.br (OAuth2)
- [ ] Integração SERASA (crédito)
- [ ] Testes automatizados

### Sprint 3 (Semanas 5-6) ⏳
- [ ] Componentes React frontend
- [ ] Dashboard de integrações
- [ ] Widgets de integração

### Sprint 4 (Semanas 7-8) ⏳
- [ ] Mais 12 integrações
- [ ] Documentação completa
- [ ] Performance testing

## 📄 Licença

Propriedade de Adsumtec / OrdocAI

## 👥 Contribuidores

- Claude AI - Arquitetura e Implementação
- Equipe Adsumtec - Product Owner

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Última Atualização:** 19/12/2025
**Versão:** 1.0.0 (Sprint 1 Completo)
