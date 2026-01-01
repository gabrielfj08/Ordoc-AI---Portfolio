# Compliance Validators - Guia de Integração

**Data:** 2026-01-01
**Sprint:** 1+2 Compliance
**Validators:** e-ARQ Brasil + Legal Hold + LGPD

---

## 📋 Visão Geral

Validators de compliance integrados com **Intelligence/Council** que usam:

✅ **Prompts robustos e completos** - Contexto rico, não keywords
✅ **Metadados estruturados** - Prontos para Graph DB, RAG, busca semântica
✅ **Conversação natural** - Modelos entendem contexto completo
✅ **Dados precisos** - Flags claros para IA tomar decisões

---

## 🎯 Validators Disponíveis

### 1. EArqBrasilValidator - Temporalidade Documental

**Funcionalidades:**
- Sugere classificação documental usando Council
- Valida prazos de guarda
- Alerta documentos elegíveis para disposição

**Exemplo de Uso:**

```python
from intelligence.validators import EArqBrasilValidator

validator = EArqBrasilValidator()

# Dados do documento
document_content = "Contrato de prestação de serviços entre..."
document_metadata = {
    'title': 'Contrato 2025-001',
    'type': 'contrato',
}

# Contexto organizacional
context = {
    'organization_id': 'uuid',
    'sector': 'Compras',
    'retention_status': {
        'current_phase_end': '2026-06-01',
        'retention_code': '020.2',
        'is_eligible_for_disposition': False,
        'final_disposition': 'eliminate'
    }
}

# Valida
alerts = await validator.validate(document_content, document_metadata, context)

for alert in alerts:
    print(f"[{alert.severity}] {alert.message}")
    print(f"Sugestão: {alert.suggestion}")
    print(f"Metadados: {alert.metadata}")
```

**Metadados Gerados (para Graph DB/RAG):**

```json
{
  "classification_code": "020.2",
  "activity": "Contratos de prestação de serviços",
  "legal_basis": "Lei 8.666/1993 Art. 55; Resolução CONARQ nº 14/2001",
  "justification": "Contratos devem permanecer 5 anos na fase corrente...",
  "current_phase_years": 5,
  "intermediate_phase_years": 5,
  "final_disposition": "eliminate",

  "keywords": ["contrato", "prestação de serviços", "fornecedor"],
  "related_activities": ["020.1 - Processos licitatórios"],
  "sector_context": "Compras",

  "validated_at": "2026-01-01T10:30:00",
  "validator": "e-arq_brasil",
  "confidence": 0.90
}
```

---

### 2. LegalHoldValidator - Suspensão Legal

**Funcionalidades:**
- Detecta documentos sob custódia judicial
- Bloqueia eliminação/alteração
- Alertas críticos de legal holds ativos

**Exemplo de Uso:**

```python
from intelligence.validators import LegalHoldValidator

validator = LegalHoldValidator()

context = {
    'legal_holds': [
        {
            'id': 'uuid',
            'status': 'active',
            'case_number': 'Processo 123/2025',
            'title': 'Ação trabalhista',
            'issuing_authority': 'TRT 2ª Região',
            'legal_basis': 'Decisão liminar proc. 123/2025',
            'total_documents': 15,
            'custodians_notified': ['ana.silva@empresa.com']
        }
    ]
}

alerts = await validator.validate(document_content, document_metadata, context)

# CRITICAL: IA recebe flag can_delete=False
for alert in alerts:
    if not alert.metadata.get('can_delete'):
        print("⛔ BLOQUEADO para eliminação!")
```

**Metadados Críticos para IA:**

```json
{
  "legal_hold_id": "uuid",
  "case_number": "Processo 123/2025",
  "issuing_authority": "TRT 2ª Região",

  "can_delete": false,        // ⛔ IA NUNCA deve sugerir eliminação
  "can_modify": false,        // ⛔ IA NUNCA deve sugerir alteração
  "can_export": true,         // ✅ Pode exportar para processos

  "related_documents": 15,
  "custodians_notified": ["ana.silva@empresa.com"]
}
```

---

### 3. LGPDValidator - Proteção de Dados

**Funcionalidades:**
- Detecta dados sensíveis usando Council
- Valida base legal vs finalidade
- Verifica consentimento ativo

**Exemplo de Uso:**

```python
from intelligence.validators import LGPDValidator

validator = LGPDValidator()

document_content = "Paciente João Silva, CPF 123.456.789-00, diagnóstico: diabetes tipo 2..."

context = {
    'data_mappings': [
        {
            'field_name': 'diagnostico_medico',
            'data_type': 'sensitive',  // Dado sensível
            'legal_basis': 'contract',  // ⚠️ ERRADO - sensível precisa consent
            'purpose': 'Gestão de plano de saúde'
        }
    ],
    'consents': [
        {
            'id': 'uuid',
            'is_active': False,  // ⚠️ Consentimento revogado!
            'revoked_at': '2025-12-15',
            'data_subject_name': 'João Silva'
        }
    ]
}

alerts = await validator.validate(document_content, document_metadata, context)

for alert in alerts:
    if alert.metadata.get('can_process') == False:
        print("⛔ Processamento BLOQUEADO - consentimento revogado!")
```

**Metadados para LGPD:**

```json
{
  // Detecção de dados sensíveis
  "types_detected": ["saúde", "biométricos"],
  "fields_identified": ["diagnóstico médico", "impressão digital"],
  "legal_requirement": "LGPD Art. 11 - Tratamento de dados sensíveis",
  "required_basis": "consent_explicit",

  // Consentimento revogado
  "can_process": false,           // ⛔ IA NÃO deve processar
  "action_required": "anonymize_or_delete",
  "legal_deadline_days": 15       // Art. 19, §3º
}
```

---

## 🔗 Integração com APIs REST

### Endpoint de Validação (a criar em views.py)

```python
# backend/intelligence/api/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from intelligence.validators import (
    EArqBrasilValidator,
    LegalHoldValidator,
    LGPDValidator
)

@api_view(['POST'])
async def validate_document_compliance(request):
    """
    POST /api/intelligence/validate-compliance/

    Body:
    {
        "document_id": "uuid",
        "document_content": "texto do documento",
        "validators": ["earq", "legal_hold", "lgpd"]
    }

    Response:
    {
        "alerts": [
            {
                "severity": "CRITICAL",
                "alert_type": "COMPLIANCE",
                "message": "Documento sob LEGAL HOLD",
                "metadata": { "can_delete": false }
            }
        ]
    }
    """

    document_id = request.data.get('document_id')
    document_content = request.data.get('document_content')
    validator_types = request.data.get('validators', ['earq', 'legal_hold', 'lgpd'])

    # Busca contexto do documento
    from ordoc_air.models import Document, RetentionSchedule, LegalHold
    from ordoc_cloud.models import PersonalDataMapping, ConsentRecord

    document = await Document.objects.aget(id=document_id)

    # Monta contexto rico
    context = {
        'organization_id': str(document.organization_id),
        'sector': document.department.name if document.department else '',

        # e-ARQ Brasil context
        'retention_status': None,

        # Legal Hold context
        'legal_holds': [],

        # LGPD context
        'data_mappings': [],
        'consents': [],
    }

    # Enriquece contexto
    if hasattr(document, 'retention_status'):
        rs = document.retention_status
        context['retention_status'] = {
            'current_phase_end': rs.current_phase_end,
            'retention_code': rs.retention_schedule.code,
            'is_eligible_for_disposition': rs.is_eligible_for_disposition(),
            'final_disposition': rs.retention_schedule.final_disposition,
        }

    # Legal holds ativos
    active_holds = document.legal_holds.filter(status='active').values(
        'id', 'case_number', 'title', 'issuing_authority', 'legal_basis'
    )
    context['legal_holds'] = list(active_holds)

    # Executa validators
    all_alerts = []

    if 'earq' in validator_types:
        earq = EArqBrasilValidator()
        alerts = await earq.validate(document_content, document.__dict__, context)
        all_alerts.extend(alerts)

    if 'legal_hold' in validator_types:
        legal_hold = LegalHoldValidator()
        alerts = await legal_hold.validate(document_content, document.__dict__, context)
        all_alerts.extend(alerts)

    if 'lgpd' in validator_types:
        lgpd = LGPDValidator()
        alerts = await lgpd.validate(document_content, document.__dict__, context)
        all_alerts.extend(alerts)

    return Response({
        'document_id': str(document_id),
        'alerts': [
            {
                'severity': alert.severity.value,
                'alert_type': alert.alert_type.value,
                'field_name': alert.field_name,
                'message': alert.message,
                'suggestion': alert.suggestion,
                'metadata': alert.metadata
            }
            for alert in all_alerts
        ]
    })
```

---

## 🎨 Integração Frontend-new

### Hook React para usar validators

```typescript
// frontend-new/hooks/useComplianceValidation.ts

import { useState } from 'react';

interface ComplianceAlert {
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  alert_type: 'COMPLIANCE' | 'PATTERN' | 'SUGGESTION';
  message: string;
  suggestion: string;
  metadata: Record<string, any>;
}

export function useComplianceValidation() {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);

  const validateDocument = async (
    documentId: string,
    validators: string[] = ['earq', 'legal_hold', 'lgpd']
  ) => {
    setLoading(true);

    try {
      const response = await fetch('/api/intelligence/validate-compliance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          validators,
        }),
      });

      const data = await response.json();
      setAlerts(data.alerts);

      return data.alerts;
    } catch (error) {
      console.error('Erro ao validar compliance:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { validateDocument, loading, alerts };
}
```

### Componente de Alertas

```typescript
// frontend-new/components/compliance/ComplianceAlerts.tsx

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield, Info } from 'lucide-react';

export function ComplianceAlerts({ alerts }) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="h-4 w-4" />;
      case 'WARNING': return <Shield className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <Alert key={i} variant={alert.severity.toLowerCase()}>
          {getSeverityIcon(alert.severity)}
          <AlertTitle>{alert.message}</AlertTitle>
          <AlertDescription>{alert.suggestion}</AlertDescription>

          {/* Metadados para debugging */}
          {alert.metadata.can_delete === false && (
            <div className="mt-2 text-sm text-destructive font-bold">
              ⛔ BLOQUEADO para eliminação
            </div>
          )}
        </Alert>
      ))}
    </div>
  );
}
```

---

## 📊 Dados para Graph DB / RAG

### Estrutura de Metadados

Todos os validators retornam metadados estruturados prontos para:

**1. Graph Database (Neo4j, ArangoDB):**

```cypher
// Exemplo: Criar nó de classificação e-ARQ
CREATE (c:Classification {
  code: '020.2',
  activity: 'Contratos de prestação de serviços',
  confidence: 0.90,
  validated_at: '2026-01-01T10:30:00'
})

// Relacionar com documento
MATCH (d:Document {id: 'uuid'})
MATCH (c:Classification {code: '020.2'})
CREATE (d)-[:CLASSIFIED_AS {validator: 'e-arq_brasil'}]->(c)

// Relacionar com atividades relacionadas
MATCH (c1:Classification {code: '020.2'})
MATCH (c2:Classification {code: '020.1'})
CREATE (c1)-[:RELATED_TO]->(c2)
```

**2. RAG (Retrieval-Augmented Generation):**

Os metadados podem ser indexados em vector stores para busca semântica:

```python
# Exemplo: Indexar no ChromaDB / Pinecone
from chromadb import Client

client = Client()
collection = client.create_collection("compliance_validations")

# Adiciona validação ao vector store
collection.add(
    documents=[alert.metadata['justification']],
    metadatas=[alert.metadata],
    ids=[str(document_id)]
)

# Busca conversacional
results = collection.query(
    query_texts=["Como classificar contratos de serviço?"],
    n_results=5
)
```

**3. Busca Conversacional:**

Frontend pode fazer perguntas naturais:

```
Usuário: "Quais documentos estão próximos de serem eliminados?"

→ Query no Graph:
MATCH (d:Document)-[:HAS_RETENTION]->(r:Retention)
WHERE r.is_eligible_for_disposition = true
  AND r.final_disposition = 'eliminate'
RETURN d.title, r.retention_code, r.intermediate_phase_end

→ Resultado estruturado com metadados completos
```

---

## ✅ Checklist de Integração

- [x] Validators criados (EArqBrasilValidator, LegalHoldValidator, LGPDValidator)
- [x] Prompts robustos com contexto completo
- [x] Metadados estruturados para Graph/RAG
- [ ] API endpoint `/api/intelligence/validate-compliance/` (próximo passo)
- [ ] Hook React `useComplianceValidation` (frontend-new)
- [ ] Componente `ComplianceAlerts` (frontend-new)
- [ ] Integração com Graph DB (opcional)
- [ ] Indexação RAG (opcional)

---

## 🎯 Próximos Passos

1. **Criar API endpoint** em `backend/intelligence/api/views.py`
2. **Criar hooks React** em `frontend-new/hooks/useComplianceValidation.ts`
3. **Criar componentes** em `frontend-new/components/compliance/`
4. **Testar fluxo completo** frontend → backend → IA → resposta

---

**Documento gerado em:** 2026-01-01
**Sprint:** 1+2 Compliance
**Status:** Validators prontos para integração
