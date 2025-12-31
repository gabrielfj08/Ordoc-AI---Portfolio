# Guia de Implementação das Integrações - ordoc_integrations

## 📊 Status Geral

**Implementado:** 5/20 (25%)
- ✅ Receita Federal (CPF/CNPJ)
- ✅ Gov.br (OAuth2 - 80%)
- ✅ TSE (Tribunal Superior Eleitoral)
- ✅ ANS (Agência Nacional de Saúde)
- ⏳ CVM, CAGED, JUCESP, Conselhos (em desenvolvimento)

**Pendente:** 15/20 (75%)

---

## 🎯 Fase 1: APIs Públicas (COMPLETO 60%)

### ✅ TSE - Tribunal Superior Eleitoral
**Arquivo:** `/services/tse.py`
**Status:** ✅ IMPLEMENTADO
**Endpoints:**
- Situação eleitoral (regular/irregular)
- Histórico de comparecimento
- Dados cadastrais do eleitor

**Métodos:**
```python
check_voter_status(cpf)
get_election_history(cpf)
get_registration_data(cpf)
```

### ✅ ANS - Agência Nacional de Saúde Suplementar
**Arquivo:** `/services/ans.py`
**Status:** ✅ IMPLEMENTADO
**Endpoints:**
- Consulta de beneficiários
- Dados de planos de saúde
- Informações de operadoras
- Lista de operadoras

**Métodos:**
```python
check_beneficiary(cpf)
get_health_plan(plan_code)
get_operator(cnpj_or_code)
list_operators(filters)
```

### ⏳ CVM - Comissão de Valores Mobiliários
**Status:** PENDENTE
**Complexidade:** BAIXA (4h)
**Endpoints principais:**
```python
# /services/cvm.py
- get_investment_fund_data(cnpj)  # Fundos de investimento
- get_company_data(cnpj)           # Empresas abertas
- get_market_data()                # Dados de mercado
```

**Estrutura:**
```python
class CVMService(BaseIntegrationService):
    REQUEST_TYPE_FUND = 'fund'
    REQUEST_TYPE_COMPANY = 'company'
    REQUEST_TYPE_MARKET_DATA = 'market_data'

    def validate_identifier(self, identifier: str) -> bool:
        # CNPJ ou código CVM (6 dígitos)
        return validate_cnpj(identifier) or (len(identifier) == 6 and identifier.isdigit())
```

### ⏳ CAGED - Cadastro Geral de Empregados e Desempregados
**Status:** PENDENTE
**Complexidade:** BAIXA (3h)
**Endpoints principais:**
```python
# /services/caged.py
- get_worker_data(cpf)      # Movimentações do trabalhador
- get_company_data(cnpj)    # Movimentações da empresa
```

### ⏳ JUCESP - Junta Comercial de São Paulo
**Status:** PENDENTE
**Complexidade:** MÉDIA (5h)
**Endpoints principais:**
```python
# /services/jucesp.py
- get_company_data(cnpj)         # Dados empresariais
- get_company_history(cnpj)      # Histórico de alterações
- search_company(name)           # Busca por nome
```

---

## 🎯 Fase 2: Conselhos Profissionais (18h total)

### Template Base para Conselhos
```python
class ProfessionalCouncilService(BaseIntegrationService):
    """Base para OAB, CRM, CRO, CREA"""

    REQUEST_TYPE_VALIDATE = 'validate'
    REQUEST_TYPE_PROFESSIONAL_DATA = 'professional_data'
    REQUEST_TYPE_SEARCH = 'search'

    def validate_identifier(self, identifier: str) -> bool:
        # Número de registro (varia por conselho)
        return identifier.isdigit() and len(identifier) >= 4

    def _make_request(self, identifier, request_type, params=None):
        if request_type == self.REQUEST_TYPE_VALIDATE:
            return self._validate_registration(identifier)
        elif request_type == self.REQUEST_TYPE_PROFESSIONAL_DATA:
            return self._get_professional_data(identifier)
        elif request_type == self.REQUEST_TYPE_SEARCH:
            return self._search_professional(params)
```

### OAB - Ordem dos Advogados do Brasil
**Arquivo:** `/services/oab.py`
**Complexidade:** BAIXA (4h)
**Endpoints:**
- Validar inscrição OAB
- Dados do advogado
- Busca por nome/número

### CRM - Conselho Regional de Medicina
**Arquivo:** `/services/crm.py`
**Complexidade:** BAIXA (4h)
**Endpoints:**
- Validar CRM
- Dados do médico (especialidades)
- Busca

### CRO - Conselho Regional de Odontologia
**Arquivo:** `/services/cro.py`
**Complexidade:** BAIXA (5h)
**Endpoints:**
- Validar CRO
- Dados do dentista
- Busca

### CREA - Conselho Regional de Engenharia
**Arquivo:** `/services/crea.py`
**Complexidade:** BAIXA (5h)
**Endpoints:**
- Validar CREA
- Dados do engenheiro/técnico
- Atribuições técnicas

---

## 🎯 Fase 3: Completar Gov.br (4h)

### Token Refresh
```python
# /services/govbr.py
def refresh_access_token(self, refresh_token: str):
    """
    Renova access token usando refresh token

    Implementar:
    1. POST /oauth2/token com grant_type=refresh_token
    2. Atualizar GovBrProfile com novos tokens
    3. Retornar novos access_token e refresh_token
    """
```

### Health Check Específico
```python
def check_health(self):
    """
    Verifica saúde do serviço Gov.br

    Implementar:
    1. GET /oauth2/.well-known/openid-configuration
    2. Verificar se endpoints estão respondendo
    3. Retornar status: 'healthy' ou 'degraded'
    """
```

---

## 🎯 Fase 4: Estrutura para APIs Bloqueadas (20h)

### SERASA (Crédito)
**Arquivo:** `/services/serasa.py`
**Status:** ESTRUTURA BASE
**Bloqueador:** Credenciais corporativas
```python
class SERASAService(BaseIntegrationService):
    """
    IMPORTANTE: Requer credenciais corporativas
    - API Key
    - Client Secret
    - Contrato com SERASA Experian

    Configurar em IntegrationService.credentials:
    {
        "api_key": "xxx",
        "client_secret": "yyy",
        "environment": "production"  # ou "sandbox"
    }
    """

    REQUEST_TYPE_CREDIT_SCORE = 'credit_score'
    REQUEST_TYPE_DEBTS = 'debts'
    REQUEST_TYPE_PROTESTS = 'protests'
```

### PIX (Banco Central)
**Arquivo:** `/services/pix.py`
**Bloqueador:** OAuth2 + Certificado Digital A1
```python
class PIXService(BaseIntegrationService):
    """
    IMPORTANTE: Requer:
    - OAuth2 do Banco Central
    - Certificado Digital A1
    - Registro no DICT (Diretório de Identificadores)
    """
```

### NFe/NFSe (Fiscal)
**Arquivo:** `/services/nfe.py`
**Bloqueador:** Certificado Digital A1/A3
```python
class NFeService(BaseIntegrationService):
    """
    IMPORTANTE: Requer:
    - Certificado Digital A1 ou A3
    - Validação de assinatura digital
    - Processamento de XML/XSD
    """
```

### DETRAN, INSS, eSocial, SINTEGRA
**Status:** Estrutura similar a NFe/PIX

---

## 📝 Checklist de Implementação

Para cada nova integração:

### 1. Criar Service Class
```python
# /services/nova_integracao.py
from .base import BaseIntegrationService, IntegrationException

class NovaIntegracaoService(BaseIntegrationService):
    REQUEST_TYPE_XXX = 'xxx'

    def __init__(self, organization_id=None, user_id=None):
        super().__init__(
            service_type='nova_integracao',
            organization_id=organization_id,
            user_id=user_id
        )

    def validate_identifier(self, identifier: str) -> bool:
        # Implementar validação
        pass

    def _make_request(self, identifier, request_type, params=None):
        # Implementar chamada à API
        pass
```

### 2. Adicionar ao IntegrationService Model
```python
# models.py - SERVICE_TYPE_CHOICES
('nova_integracao', 'Nova Integração'),
```

### 3. Criar Seed no Management Command
```python
# management/commands/seed_integrations.py
IntegrationService.objects.get_or_create(
    service_type='nova_integracao',
    defaults={
        'name': 'Nova Integração',
        'base_url': 'https://api.nova-integracao.gov.br',
        'status': 'active',
        'is_enabled': True,
        'rate_limit': 100,
        'timeout_seconds': 30,
        'cache_ttl_seconds': 3600,
    }
)
```

### 4. Adicionar Endpoint no ViewSet
```python
# views.py - IntegrationExecuteViewSet
@action(detail=False, methods=['post'], url_path='nova-integracao')
def nova_integracao(self, request):
    service = NovaIntegracaoService(
        organization_id=getattr(request, 'current_organization', None),
        user_id=request.user.id
    )

    data, req = service.execute(
        identifier=request.data['identifier'],
        request_type=request.data.get('request_type', 'default')
    )

    return Response(data)
```

### 5. Criar Testes
```python
# tests/test_nova_integracao.py
class TestNovaIntegracaoService(TestCase):
    def test_validate_identifier(self):
        pass

    def test_make_request_success(self):
        pass

    def test_cache_hit(self):
        pass
```

---

## 🚀 Próximos Passos Recomendados

### Curto Prazo (1 semana)
1. ✅ Completar Fase 1 (TSE, ANS, CVM, CAGED, JUCESP)
2. ⏳ Implementar Fase 2 (OAB, CRM, CRO, CREA)
3. ⏳ Completar Gov.br (token refresh)

### Médio Prazo (2-3 semanas)
4. Criar estrutura base para APIs bloqueadas
5. Implementar testes unitários (> 80% coverage)
6. Documentar uso completo

### Longo Prazo (1-2 meses)
7. Obter credenciais para SERASA, PIX, NFe
8. Implementar integrações bloqueadas
9. Criar monitoramento e alertas

---

## 📚 Recursos e Documentação

### APIs Públicas Brasileiras
- **TSE:** https://dadosabertos.tse.jus.br/
- **ANS:** https://www.ans.gov.br/anstabnet/index.htm
- **CVM:** https://dados.cvm.gov.br/
- **CAGED:** https://pdet.mte.gov.br/
- **JUCESP:** https://www.jucesp.sp.gov.br/

### APIs que Requerem Credenciais
- **Gov.br:** https://www.gov.br/governodigital/pt-br/identidade/acesso-gov.br/
- **SERASA:** https://www.serasa.com.br/empresas/
- **Banco Central PIX:** https://www.bcb.gov.br/estabilidadefinanceira/pix

### Certificação Digital
- **ICP-Brasil:** https://www.gov.br/iti/pt-br/assuntos/certificacao-digital
- **NFe:** https://www.nfe.fazenda.gov.br/

---

**Documento atualizado:** 2025-12-31
**Versão:** 1.0
**Status:** Em desenvolvimento ativo
