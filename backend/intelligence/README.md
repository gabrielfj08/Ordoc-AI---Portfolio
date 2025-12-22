# Intelligence Module - Sistema de IA Integrado

## 🎯 Visão Geral

O módulo Intelligence agora está **totalmente integrado** com a plataforma, funcionando de forma **automática e proativa**.

## ✨ O Que Mudou

### Antes
- ❌ Sistema passivo (só via API manual)
- ❌ Sem integração automática
- ❌ Padrões não aprendiam automaticamente
- ❌ Sem alertas proativos

### Agora
- ✅ **Integração automática** via Django signals
- ✅ **Análise automática** de documentos no upload
- ✅ **Aprendizado contínuo** com ações de usuários
- ✅ **Alertas proativos** de compliance
- ✅ **Agregação hierárquica** de padrões (user → org → platform)

## 🔄 Como Funciona

### 1. Integração Automática (signals.py)

Quando eventos acontecem na plataforma, o Intelligence reage automaticamente:

```python
# Upload de documento → Análise automática
Document criado → analyze_document_async.delay()

# Task aprovada/rejeitada → Aprendizado
Task status changed → learn_from_task_action.delay()

# Assinatura completada → Análise de padrões
Signature completed → analyze_signature_pattern.delay()

# Documento editado → Rastreamento
Document edited → track_document_edit.delay()
```

**Tudo é assíncrono** - não bloqueia o fluxo principal!

### 2. Tasks Periódicas (Celery Beat)

```
A cada hora (00:00):
  ├─ aggregate_patterns_periodic()
  └─ Agrega padrões: user → org → platform

Diariamente (08:00):
  ├─ generate_compliance_alerts()
  └─ Documentos pendentes, workflows parados

Diariamente (00:00):
  ├─ cleanup_expired_alerts()
  └─ Remove alertas antigos
```

### 3. Aprendizado Hierárquico SIMPLES

```
Lógica: 3+ ocorrências = padrão

Exemplo:
  3+ usuários corrigem "30 dias" → "30 dias corridos"
  ↓
  Cria padrão organizacional
  ↓
  Próximo documento sugere automaticamente
```

### 4. Pattern Matching SIMPLES

Sem JSONLogic complexo. Regras diretas:

```python
# Exemplo de padrão
{
    'condition': {
        'document_type': 'contract',
        'field_contains': {'content': 'rescisão'}
    },
    'action': {
        'type': 'suggestion',
        'message': 'Verificar cláusula de rescisão'
    }
}
```

Tipos de regras:
- `document_type`: tipo do documento
- `field_contains`: campo contém texto
- `field_matches`: regex match
- `field_equals`: igualdade exata

## 📊 Padrões Built-in

O sistema vem com 3 padrões úteis pré-configurados:

1. **Contratos**: Verificar cláusula de rescisão
2. **Financeiro**: Valores acima de R$ 100k requerem aprovação
3. **LGPD**: Alerta para dados pessoais (CPF, RG, etc)

## 🚀 Como Usar

### Usuário Final

**Nada precisa fazer!** O sistema funciona automaticamente:

1. **Upload documento** → Análise automática em 2s
2. **Aprovar/Rejeitar task** → Sistema aprende
3. **Editar documento** → Rastreamento de mudanças
4. **Assinar documento** → Análise de padrões

### Desenvolvedor

#### Desabilitar análise automática (se necessário):

```python
from intelligence.signals import DisableSignals
from django.db.models.signals import post_save

# Em testes ou migrations
with DisableSignals(post_save):
    # Operações sem triggering intelligence
    Document.objects.create(...)
```

#### Criar padrão customizado:

```python
from intelligence.knowledge.matchers import PatternBuilder

pattern = PatternBuilder.for_document_type(
    'invoice',
    'Verificar prazo de pagamento',
    field_contains={'content': 'fatura'}
)
```

#### Forçar análise manual:

```python
from intelligence.tasks import analyze_document_async

analyze_document_async.delay(
    document_id=str(doc.id),
    document_type='contract'
)
```

## 📈 Monitoramento

### Logs

```bash
# Ver análises em tempo real
tail -f logs/intelligence.log | grep "analisado com sucesso"

# Ver padrões agregados
tail -f logs/intelligence.log | grep "padrões criados"

# Ver alertas gerados
tail -f logs/intelligence.log | grep "Alertas de compliance"
```

### Celery Beat

```bash
# Ver tarefas agendadas
celery -A ordoc_ai beat -l info

# Ver workers processando
celery -A ordoc_ai worker -l info
```

### Admin Django

- **ProactiveAlert**: Ver todos os alertas gerados
- **LearnedPattern**: Ver padrões aprendidos
- **KnowledgeFeedback**: Ver feedbacks capturados
- **DocumentAnalysis**: Ver histórico de análises

## ⚙️ Configurações

### Desabilitar completamente (se necessário):

```python
# settings.py
INTELLIGENCE_ENABLED = False  # Desliga signals
```

### Ajustar frequência de agregação:

```python
# celery.py - Mudar de 1h para 6h
'schedule': crontab(minute=0, hour='*/6')
```

### Ajustar limite de análise automática:

```python
# tasks.py - analyze_document_async
# Por padrão: 'standard' (extraction + classification)
# Para análise completa com LLM Council:
analysis_depth='full'
```

## 🎯 Princípios de Design

1. **Simples > Complexo**: Regras simples que funcionam
2. **Assíncrono**: Nunca bloqueia o usuário
3. **Resiliente**: Falhas não afetam fluxo principal
4. **Desacoplado**: Fácil desabilitar se necessário
5. **Observável**: Logs claros e informativos

## 🔍 Troubleshooting

### Análise não está acontecendo?

```bash
# 1. Verificar se Celery está rodando
celery -A ordoc_ai inspect active

# 2. Verificar logs
tail -f logs/intelligence.log

# 3. Verificar signals registrados
python manage.py shell
>>> from intelligence import signals
>>> print("OK" if signals else "ERRO")
```

### Padrões não estão sendo agregados?

```bash
# 1. Verificar Celery Beat
celery -A ordoc_ai beat -l info

# 2. Forçar agregação manual
python manage.py shell
>>> from intelligence.tasks import aggregate_patterns_periodic
>>> aggregate_patterns_periodic.delay()
```

### Performance lenta?

```python
# Limitar análise automática a documentos importantes
# signals.py - on_document_created
if instance.file_size > 10_000_000:  # Só analisa < 10MB
    return
```

## 📚 Arquivos Principais

```
intelligence/
├── signals.py           # Integração automática
├── tasks.py             # Processamento assíncrono
├── apps.py              # Registro de signals
├── knowledge/
│   ├── matchers.py      # Pattern matching simples
│   └── repositories/
│       └── base.py      # Agregação hierárquica
└── README.md            # Este arquivo
```

## 🚀 Próximos Passos (Futuro)

- [ ] Dashboard de insights no frontend
- [ ] WebSocket para alertas em tempo real
- [ ] Auto-aplicação de padrões com alta confiança (>90%)
- [ ] Analytics preditivos (tempo médio de aprovação, etc)
- [ ] Exportação de relatórios de Intelligence

---

**Sistema desenvolvido com foco em simplicidade, valor e manutenibilidade.**
