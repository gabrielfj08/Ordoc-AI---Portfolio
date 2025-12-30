# Performance & Caching Guide - OrdocAI

Guia completo de otimizações de performance e caching para o backend Django.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [N+1 Query Optimizations](#n1-query-optimizations)
3. [Cache Strategy](#cache-strategy)
4. [QuerySet Optimizations](#queryset-optimizations)
5. [Database Indexes](#database-indexes)
6. [Monitoring & Profiling](#monitoring--profiling)
7. [Best Practices](#best-practices)

---

## Visão Geral

**Sprint 5 - Performance Backend** implementou otimizações críticas para reduzir N+1 queries e melhorar performance geral.

### Resultados

| Área | Antes | Depois | Melhoria |
|------|-------|--------|----------|
| **Tree Views (Department)** | 1 + N queries | 1 query | 90%+ redução |
| **Tree Views (Directory)** | 1 + N queries | 1 query | 90%+ redução |
| **ViewSets Otimizados** | 19/47 (40%) | 21/47 (45%) | +2 ViewSets |

### Arquivos Criados

1. `backend/ordoc_ai/query_optimizations.py` - Mixins e utilities reutilizáveis
2. `N1_QUERY_ANALYSIS_SUMMARY.md` - Análise completa de N+1 queries
3. `n1_query_analysis_report.json` - Relatório estruturado em JSON

---

## N+1 Query Optimizations

### ✅ Problemas Resolvidos (Sprint 5)

#### 1. DepartmentViewSet.tree() - HIGH SEVERITY

**Antes:**
```python
def tree(self, request):
    root_departments = Department.objects.filter(parent__isnull=True)

    def build_tree(departments):
        result = []
        for dept in departments:
            children = dept.children.filter(deleted_at__isnull=True)  # N+1!
            if children.exists():
                dept_data['children'] = build_tree(children)
        return result
```

**Depois:**
```python
class DepartmentViewSet(TreeQueryOptimizationMixin, BaseViewSet):
    def get_queryset(self):
        return super().get_queryset().select_related(
            'organization', 'parent'
        ).prefetch_related('children')

    def tree(self, request):
        queryset = self.get_queryset().filter(
            organization=organization,
            deleted_at__isnull=True
        )
        tree_data = self.build_tree_response(
            queryset.filter(parent__isnull=True),
            serialize=True
        )
        return Response(tree_data)
```

**Resultado:** 1 + N queries → 1 query (90%+ redução)

#### 2. DirectoryViewSet.tree() - HIGH SEVERITY

**Antes:**
```python
def tree(self, request):
    root_directories = queryset.filter(parent__isnull=True)

    def build_tree(directories):
        for directory in directories:
            children = directory.children.filter(deleted_at__isnull=True)  # N+1!
            if children.exists():
                dir_data['children'] = build_tree(children)
```

**Depois:**
```python
class DirectoryViewSet(TreeQueryOptimizationMixin, BaseViewSet):
    tree_parent_field = 'parent_directory'
    tree_children_field = 'children'

    def get_queryset(self):
        return super().get_queryset().select_related(
            'organization', 'department', 'parent_directory'
        ).prefetch_related('children', 'documents')
```

**Resultado:** 1 + N queries → 1 query (90%+ redução)

---

### ⚠️ Problemas Identificados (A Resolver)

#### Priority 1: Implementar Imediatamente

**1. PolicyViewSet.affected_users()** - HIGH SEVERITY
- **File:** `backend/ordoc_cloud/views.py:620-635`
- **Problem:** Loop através de grupos sem batch loading
- **Fix:**
```python
def get_queryset(self):
    return super().get_queryset().prefetch_related(
        'users',
        Prefetch('user_groups', queryset=UserGroup.objects.prefetch_related('users'))
    )
```

**2. ReportMetricViewSet.dashboard()** - HIGH SEVERITY
- **File:** `backend/ordoc_reports/views.py:554-656`
- **Problem:** 16+ separate database queries
- **Fix:**
```python
@action(detail=False, methods=['get'])
def dashboard(self, request):
    org = self.get_current_organization()
    now = timezone.now()
    this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Single optimized query with all aggregations
    stats = Report.objects.filter(
        organization=org,
        generation_time__isnull=False
    ).aggregate(
        total=Count('id'),
        this_month=Count('id', filter=Q(created_at__gte=this_month_start)),
        avg_time=Avg('generation_time')
    )

    # Resto das métricas em queries separadas eficientes
    # ...
```

**3. DocumentViewSet.recommended()** - HIGH SEVERITY
- **File:** `backend/ordoc_air/views.py:818-953`
- **Problem:** Multiple N+1 patterns in single action
- **Fix:** Mover para service layer com batch loading
```python
@action(detail=False, methods=['get'])
def recommended(self, request):
    from .services import DocumentRecommendationService
    service = DocumentRecommendationService()

    results = service.get_recommended_documents(
        user=self.get_current_user(),
        organization=self.get_current_organization(),
        limit=10
    )

    return Response(DocumentSerializer(results, many=True).data)
```

**4. WorkflowDashboardViewSet.overview()** - HIGH SEVERITY
- **File:** `backend/ordoc_flow/views.py:621-762`
- **Problem:** Nested loops with unoptimized queries
- **Fix:**
```python
def get_queryset(self):
    return super().get_queryset().select_related(
        'procedure_template', 'requester', 'created_by__user', 'organization'
    )
```

**5. AnalyzeDocumentView** - HIGH SEVERITY
- **File:** `backend/intelligence/views.py`
- **Problem:** Creates alerts in loop instead of bulk_create()
- **Fix:**
```python
# Coleta todos os alerts primeiro
alerts_to_create = []
for analysis in analyses:
    if analysis.severity in ['high', 'critical']:
        alerts_to_create.append(AIAlert(
            organization=organization,
            type='document_analysis',
            severity=analysis.severity,
            message=analysis.message
        ))

# Bulk create de uma vez
if alerts_to_create:
    AIAlert.objects.bulk_create(alerts_to_create)
```

#### Priority 2: Otimizar nesta Sprint

**6. OrdocUserViewSet** - MEDIUM
- **Problem:** Não usa select_related para 'organization', 'user'
- **Fix:** Adicionar ao get_queryset()

**7. RoleViewSet** - MEDIUM
- **Problem:** Não carrega users relacionados
- **Fix:** `prefetch_related('users')`

**8. DocumentViewSet** - MEDIUM
- **Problem:** get_queryset() não otimiza relationships
- **Fix:**
```python
def get_queryset(self):
    return super().get_queryset().select_related(
        'organization', 'department', 'directory', 'uploaded_by'
    ).prefetch_related('tags', 'permissions', 'versions')
```

---

## Cache Strategy

### Configuração Redis

**settings.py:**
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': config('REDIS_URL', default='redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PARSER_CLASS': 'redis.connection.HiredisParser',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'CONNECTION_POOL_KWARGS': {'max_connections': 50},
            'COMPRESSOR': 'django_redis.compressors.zlib.ZlibCompressor',
        },
        'KEY_PREFIX': 'ordocai',
        'TIMEOUT': 300,  # 5 minutes default
    }
}
```

### Cache Warming Strategy

**tasks.py:**
```python
from celery import shared_task
from django.core.cache import cache

@shared_task
def warm_cache_dashboard_stats():
    """
    Pre-populate cache with dashboard statistics.
    Runs every 5 minutes.
    """
    from ordoc_reports.models import Report
    from ordoc_cloud.models import Organization

    for org in Organization.objects.filter(is_active=True):
        # Cache dashboard stats
        stats = Report.objects.filter(
            organization=org
        ).aggregate(
            total=Count('id'),
            avg_time=Avg('generation_time')
        )

        cache_key = f'dashboard_stats:{org.id}'
        cache.set(cache_key, stats, timeout=300)

@shared_task
def warm_cache_frequent_queries():
    """
    Pre-populate cache for frequently accessed data.
    """
    from ordoc_air.models import Tag

    # Cache all active tags
    for org in Organization.objects.filter(is_active=True):
        tags = list(Tag.objects.filter(organization=org, is_active=True))
        cache.set(f'tags:{org.id}', tags, timeout=600)
```

**celerybeat_schedule:**
```python
CELERY_BEAT_SCHEDULE = {
    'warm-cache-dashboard': {
        'task': 'ordoc_reports.tasks.warm_cache_dashboard_stats',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
    },
    'warm-cache-frequent': {
        'task': 'ordoc_air.tasks.warm_cache_frequent_queries',
        'schedule': crontab(minute='*/10'),  # Every 10 minutes
    },
}
```

### Using Cache Decorator

**views.py:**
```python
from ordoc_ai.query_optimizations import cache_queryset

class DocumentViewSet(BaseViewSet):
    @cache_queryset(timeout=600, key_prefix='recent_docs')
    def get_recent_documents(self, user_id):
        return Document.objects.filter(
            created_by=user_id
        ).select_related(
            'organization', 'uploaded_by'
        ).order_by('-created_at')[:10]

    @action(detail=False, methods=['get'])
    def recent(self, request):
        user = self.get_current_user()
        documents = self.get_recent_documents(user.id)
        return Response(DocumentSerializer(documents, many=True).data)
```

### Cache Invalidation

**signals.py:**
```python
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

@receiver(post_save, sender=Document)
@receiver(post_delete, sender=Document)
def invalidate_document_cache(sender, instance, **kwargs):
    """Invalidate document-related caches on changes."""
    cache.delete(f'recent_docs:get_recent_documents:{instance.created_by_id}')
    cache.delete(f'document_stats:{instance.organization_id}')

@receiver(post_save, sender=Tag)
@receiver(post_delete, sender=Tag)
def invalidate_tag_cache(sender, instance, **kwargs):
    """Invalidate tag cache."""
    cache.delete(f'tags:{instance.organization_id}')
```

---

## QuerySet Optimizations

### General Patterns

#### 1. select_related() - ForeignKey/OneToOne

**Use when:** Accessing related objects via ForeignKey/OneToOne

```python
# ❌ Bad (N+1 queries)
documents = Document.objects.all()
for doc in documents:
    print(doc.organization.name)  # Query per document!

# ✅ Good (1 query)
documents = Document.objects.select_related('organization')
for doc in documents:
    print(doc.organization.name)  # No extra query
```

#### 2. prefetch_related() - ManyToMany/Reverse FK

**Use when:** Accessing reverse relationships or ManyToMany

```python
# ❌ Bad (N+1 queries)
departments = Department.objects.all()
for dept in departments:
    print(dept.documents.count())  # Query per department!

# ✅ Good (2 queries total)
departments = Department.objects.prefetch_related('documents')
for dept in departments:
    print(dept.documents.count())  # No extra query
```

#### 3. Prefetch() - Custom Prefetching

**Use when:** Need to filter or optimize prefetched queryset

```python
from django.db.models import Prefetch

# ✅ Prefetch with filtering
procedures = Procedure.objects.prefetch_related(
    Prefetch(
        'tasks',
        queryset=Task.objects.filter(status='pending').select_related('assigned_to')
    )
)
```

#### 4. only() / defer() - Select Specific Fields

**Use when:** Only need subset of fields

```python
# ✅ Load only needed fields (reduces memory & transfer)
documents = Document.objects.only('id', 'name', 'created_at')

# ✅ Exclude large fields
documents = Document.objects.defer('file_content', 'ocr_text')
```

#### 5. values() / values_list() - Dictionary/Tuple Queries

**Use when:** Only need data, not model instances

```python
# ✅ Faster for aggregations
doc_names = Document.objects.values_list('name', flat=True)

# ✅ Get dictionaries
docs_data = Document.objects.values('id', 'name', 'created_at')
```

---

## Database Indexes

### Recommended Indexes

**ordoc_air/models.py:**
```python
class Document(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['organization', 'created_at']),  # Dashboard queries
            models.Index(fields=['organization', 'status']),      # Filtering
            models.Index(fields=['uploaded_by', '-created_at']), # User's recent docs
            models.Index(fields=['directory', 'status']),         # Directory listing
        ]
```

**ordoc_flow/models.py:**
```python
class Procedure(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['requester', '-created_at']),
            models.Index(fields=['procedure_template', 'status']),
        ]
```

### Checking Index Usage

```sql
-- PostgreSQL: Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename;
```

---

## Monitoring & Profiling

### Django Debug Toolbar (Development)

**settings.py:**
```python
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
        'ENABLE_STACKTRACES': True,
    }
```

### Query Logging (Development)

**settings.py:**
```python
if DEBUG:
    LOGGING = {
        'version': 1,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'loggers': {
            'django.db.backends': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': False,
            },
        },
    }
```

### Profiling ViewSets

```python
from django.db import connection
from django.test.utils import override_settings

@override_settings(DEBUG=True)
@action(detail=False, methods=['get'])
def profiled_action(self, request):
    # Reset query count
    connection.queries_log.clear()

    # Your code here
    results = self.get_queryset()

    # Log query count
    query_count = len(connection.queries)
    print(f"Queries executed: {query_count}")

    return Response(results)
```

---

## Best Practices

### 1. Always Profile Before Optimizing

```python
# Use django-extensions
python manage.py runprofileserver

# Or use cProfile
python -m cProfile manage.py runserver
```

### 2. Annotate Instead of Python Loops

```python
# ❌ Bad (N queries)
for dept in departments:
    dept.doc_count = dept.documents.count()

# ✅ Good (1 query)
departments = departments.annotate(doc_count=Count('documents'))
```

### 3. Use Database Aggregations

```python
# ❌ Bad (loads all data into Python)
total_size = sum(doc.file_size for doc in documents)

# ✅ Good (aggregation in database)
total_size = documents.aggregate(total=Sum('file_size'))['total']
```

### 4. Batch Operations

```python
# ❌ Bad (N queries)
for doc in documents:
    doc.status = 'archived'
    doc.save()

# ✅ Good (1 query)
documents.update(status='archived')

# ✅ Or bulk_update if you need pre_save signals
Document.objects.bulk_update(documents, ['status'], batch_size=100)
```

### 5. Use get_or_create Carefully

```python
# ❌ Bad (can cause race conditions)
try:
    tag = Tag.objects.get(name='Finance')
except Tag.DoesNotExist:
    tag = Tag.objects.create(name='Finance')

# ✅ Good (atomic operation)
tag, created = Tag.objects.get_or_create(
    name='Finance',
    defaults={'organization': org}
)
```

---

## Testing Performance

### Unit Tests for Query Count

```python
from django.test import TestCase
from django.test.utils import override_settings

class DocumentViewSetTests(TestCase):
    @override_settings(DEBUG=True)
    def test_tree_query_count(self):
        """Tree view should use at most 2 queries."""
        from django.db import connection
        from django.test import Client

        client = Client()
        connection.queries_log.clear()

        response = client.get('/api/departments/tree/')

        # Assert query count
        self.assertLessEqual(
            len(connection.queries),
            2,
            f"Tree view used {len(connection.queries)} queries (max 2 expected)"
        )
```

### Load Testing

```bash
# Using locust
pip install locust

# locustfile.py
from locust import HttpUser, task

class OrdocUser(HttpUser):
    @task
    def load_dashboard(self):
        self.client.get("/api/reports/dashboard/")

    @task
    def load_documents(self):
        self.client.get("/api/documents/")

# Run test
locust -f locustfile.py --host=http://localhost:8000
```

---

## Checklist de Otimização

### Para cada ViewSet:

- [ ] get_queryset() usa select_related() para FKs?
- [ ] get_queryset() usa prefetch_related() para M2M/reverse FKs?
- [ ] Actions com loops têm batch loading?
- [ ] Aggregations usam database em vez de Python?
- [ ] Cache está configurado para dados frequentes?
- [ ] Indexes estão criados para queries comuns?
- [ ] Tests verificam query count?
- [ ] Debug Toolbar confirma otimização?

---

**Última atualização:** Sprint 5 (Dez/2025)
**Mantido por:** @Adsumtec/backend-team

**Arquivos Relacionados:**
- `backend/ordoc_ai/query_optimizations.py` - Mixins e utilities
- `N1_QUERY_ANALYSIS_SUMMARY.md` - Análise completa de N+1 queries
- `n1_query_analysis_report.json` - Relatório JSON estruturado
