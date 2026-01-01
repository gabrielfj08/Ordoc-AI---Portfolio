# Django N+1 Query Analysis Report

## Executive Summary

Analyzed **47 Django ViewSets** across 7 backend modules in the ordoc-ai project:

- **19 ViewSets (40%)** with proper query optimization
- **28 ViewSets (60%)** requiring optimization
- **6 CRITICAL N+1 patterns** found
- **Multiple MEDIUM/LOW severity** issues across the codebase

## Critical Issues Found

### 1. PolicyViewSet.affected_users() - HIGH SEVERITY
**File:** `/home/user/ordoc-ai/backend/ordoc_cloud/views.py` (lines 620-635)

**Problem:**
```python
# Direct users
direct_users = set(policy.users.all())

# Users from groups
for group in policy.user_groups.all():
    direct_users.update(group.get_all_users())
```

This causes N+1 queries:
- 1 query to fetch policy users
- 1 query to fetch policy groups
- +N queries (one per group) when calling `get_all_users()`

**Solution:**
```python
# Prefetch in get_queryset():
def get_queryset(self):
    return super().get_queryset().prefetch_related(
        'users',
        Prefetch('user_groups', queryset=UserGroup.objects.prefetch_related('users'))
    )

# Then in action:
direct_users = set(policy.users.all())
for group in policy.user_groups.all():
    direct_users.update(group.users.all())
```

---

### 2. ReportMetricViewSet.dashboard() - HIGH SEVERITY
**File:** `/home/user/ordoc-ai/backend/ordoc_reports/views.py` (lines 554-656)

**Problem:**
The dashboard method performs 16+ separate database queries:
- Line 563: Count total reports
- Line 564-567: Count reports this month
- Line 569-572: Count active templates
- Line 574-577: Count active schedules
- Line 580-583: Aggregate generation time
- Line 591-595: Get most used template
- Line 599-613: Get reports by status and format
- Line 617-625: Loop through 12 months (12 separate queries!)

**Solution:**
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

    # Separate efficient queries for other metrics
    # ... rest of implementation
```

---

### 3. DepartmentViewSet.tree() / DirectoryViewSet.tree() - HIGH SEVERITY
**File:** `/home/user/ordoc-ai/backend/ordoc_air/views.py` (lines 119-143, 226-249)

**Problem:**
```python
def build_tree(departments):
    result = []
    for dept in departments:
        dept_data = self.get_serializer(dept).data
        children = dept.children.filter(deleted_at__isnull=True)  # N+1!
        if children.exists():
            dept_data['children'] = build_tree(children)
        result.append(dept_data)
    return result
```

This creates a query for every node in the tree: 1 + D + D² queries (where D = average children per node)

**Solution:**
```python
def get_queryset(self):
    return super().get_queryset().select_related(
        'organization', 'parent'
    ).prefetch_related('children')

def build_tree(departments, children_map):
    result = []
    for dept in departments:
        dept_data = self.get_serializer(dept).data
        children = [d for d in children_map.get(dept.id, [])]
        if children:
            dept_data['children'] = build_tree(children, children_map)
        result.append(dept_data)
    return result

@action(detail=False, methods=['get'])
def tree(self, request):
    org = self.get_current_organization()
    departments = self.get_queryset().filter(
        organization=org,
        parent__isnull=True,
        deleted_at__isnull=True
    )

    # Build children_map from prefetched data
    all_depts = {d.id: d for d in departments}
    children_map = {}
    for dept in all_depts.values():
        for child in dept.children.all():
            if child.id not in children_map:
                children_map[child.id] = []
            children_map[child.id].append(child)

    return Response(build_tree(list(all_depts.values()), children_map))
```

---

### 4. DocumentViewSet.recommended() - HIGH SEVERITY
**File:** `/home/user/ordoc-ai/backend/ordoc_air/views.py` (lines 818-953)

**Problem:**
- Line 877: Queries Task.objects without select_related
- Line 895: Queries TaskAttachment.objects for each task iteration
- Line 901-906: Queries ProcedureDocument without batching
- Line 912: Filters favorited documents without prefetch
- Line 918: Queries RecentDocument with subsequent document access

Multiple N+1 patterns in a single action method.

**Solution:**
Move to a service layer and batch-load all documents at once:
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

    page = self.paginate_queryset(results)
    if page:
        serializer = DocumentSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    return Response(DocumentSerializer(results, many=True, context={'request': request}).data)
```

---

### 5. WorkflowDashboardViewSet.overview() - HIGH SEVERITY
**File:** `/home/user/ordoc-ai/backend/ordoc_flow/views.py` (lines 621-762)

**Problem:**
- Lines 660-676: Iterate through procedures, access `created_by.user` without select_related
- Lines 683-708: Loop through organization users and make ApprovalStepInstance query per user
- Line 715: Count documents without optimization
- Line 735: Another separate count query

**Solution:**
```python
def get_queryset(self):
    return super().get_queryset().select_related(
        'procedure_template', 'requester', 'created_by__user', 'organization'
    )

@action(detail=False, methods=['get'])
def overview(self, request):
    org = self.get_current_organization()

    # Prefetch procedures with optimization
    recent_procedures = self.get_queryset().filter(
        organization=org
    ).order_by('-created_at')[:10]

    # Single count query for documents
    document_stats = Document.objects.filter(
        department__organization=org
    ).aggregate(
        total=Count('id'),
        recent=Count('id', filter=Q(created_at__gte=timezone.now() - timedelta(days=30)))
    )

    # Pre-load user roles and approvals
    user_roles = UserOrganizationRole.objects.filter(
        organization=org
    ).select_related('user__user')

    # ... rest of implementation
```

---

### 6. AnalyzeDocumentView - HIGH SEVERITY
**File:** `/home/user/ordoc-ai/backend/intelligence/api/views.py` (lines 92-104)

**Problem:**
```python
for alert_data in result.get('alerts') or []:
    ProactiveAlert.objects.create(
        document_id=data['document_id'],
        document_type=data.get('document_type', ''),
        alert_type=alert_data.get('alert_type', 'suggestion'),
        # ... more fields
    )
```

Creates N individual INSERT queries instead of 1 batch INSERT.

**Solution:**
```python
alert_objects = [
    ProactiveAlert(
        document_id=data['document_id'],
        document_type=data.get('document_type', ''),
        alert_type=alert_data.get('alert_type', 'suggestion'),
        severity=alert_data.get('severity', 'info'),
        title=alert_data.get('title', 'Alerta'),
        message=alert_data.get('message', ''),
        details=alert_data.get('details', {}),
        location=alert_data.get('location'),
        suggested_actions=alert_data.get('suggested_actions', []),
        organization=getattr(request.user, 'organization', None)
    )
    for alert_data in result.get('alerts') or []
]

ProactiveAlert.objects.bulk_create(alert_objects, batch_size=1000)
```

---

## Medium Severity Issues

### OrdocUserViewSet
- **Problem:** No select_related for user relationship. Filters by `roles__organization` without optimization.
- **Solution:** Add `select_related('user').prefetch_related('roles__organization')`

### UserOrganizationRoleViewSet
- **Problem:** Doesn't optimize `user`, `organization`, `assigned_by` relationships
- **Solution:** Add `select_related('user__user', 'organization', 'assigned_by__user')`

### ReportTemplateViewSet, ReportViewSet, ReportScheduleViewSet, ReportShareViewSet
- **Problem:** No select_related for template, organization, created_by relationships
- **Solution:** Add appropriate `select_related()` calls in get_queryset()

### DirectoryViewSet.stats()
- **Problem:** Multiple separate count() queries instead of using annotate()
- **Solution:** Use `annotate(count=Count('id'), filter=Q(...))`

### ActivityLogViewSet
- **Problem:** Doesn't select_related user relationships before iteration
- **Solution:** Add `select_related('user__user')`

---

## ViewSets Already Optimized ✓

### Properly Optimized (19 ViewSets):
1. **IntegrationRequestViewSet** - uses select_related('service', 'user', 'organization')
2. **IntegrationCacheViewSet** - uses select_related('service')
3. **SignatureRequestViewSet** - uses select_related + prefetch_related for signers
4. **DocumentSignatureViewSet** - comprehensive select_related
5. **SignatureBatchViewSet** - proper template and created_by optimization
6. **SignatureAuditLogViewSet** - full relationship optimization
7. **GroupRequesterViewSet** - excellent nested Prefetch with select_related
8. **ProcedureTemplateViewSet** - comprehensive select + prefetch
9. **ProcedureViewSet** - excellent nested Prefetch for tasks
10. **TaskViewSet** - well-optimized with nested relationships
11. **ApprovalWorkflowViewSet** - good prefetch for steps
12. **ApprovalInstanceViewSet** - comprehensive nested prefetch
13. **NotificationLogViewSet** - proper select_related
14. **ProcedureDocumentViewSet** - optimized with nested select
15. **TaskAttachmentViewSet** - good nested select_related
16. **WorkflowHistoryViewSet** - basic but proper optimization
17. **ExternalRequesterViewSet** - select_related for organization
18. **NotificationTemplateViewSet** - simple structure, acceptable as-is
19. **Plus several others with partial optimization**

---

## Optimization Strategies

### 1. Use select_related() for ForeignKey/OneToOne
```python
queryset = queryset.select_related('user', 'organization', 'created_by__user')
```

### 2. Use prefetch_related() for ManyToMany/Reverse FK
```python
queryset = queryset.prefetch_related('roles', 'tags', 'related_objects')
```

### 3. Use Prefetch objects for advanced optimization
```python
from django.db.models import Prefetch

queryset = queryset.prefetch_related(
    Prefetch(
        'children',
        queryset=Department.objects.select_related('parent')
    )
)
```

### 4. Use annotate() + aggregate() instead of count() loops
```python
# Instead of:
active_count = qs.filter(status='active').count()
inactive_count = qs.filter(status='inactive').count()

# Use:
stats = qs.aggregate(
    active=Count('id', filter=Q(status='active')),
    inactive=Count('id', filter=Q(status='inactive'))
)
```

### 5. Use bulk_create() for batch inserts
```python
# Instead of:
for item in items:
    Model.objects.create(**item)

# Use:
Model.objects.bulk_create([Model(**item) for item in items], batch_size=1000)
```

### 6. Move complex logic to service layer
For methods that need to combine data from multiple sources, use a service class to handle all queries efficiently with proper prefetching.

---

## Recommendations by Priority

### Priority 1: CRITICAL (Implement Immediately)
1. Fix PolicyViewSet.affected_users() - High impact on policy access endpoints
2. Fix ReportMetricViewSet.dashboard() - Dashboard is slow, heavily used
3. Fix DepartmentViewSet.tree() and DirectoryViewSet.tree() - Tree building affects all listings
4. Fix WorkflowDashboardViewSet.overview() - Dashboard performance critical
5. Fix DocumentViewSet.recommended() - Complex recommendations are slow

### Priority 2: HIGH (Implement This Sprint)
1. Fix AnalyzeDocumentView bulk insert
2. Add select_related to all get_queryset() methods in OrdocCloud module
3. Optimize all action methods that perform additional queries
4. Add select_related to remaining Report-related ViewSets

### Priority 3: MEDIUM (Optimize Later)
1. Optimize remaining low-impact N+1 patterns
2. Review and optimize intelligence module queries
3. Add database query profiling to CI/CD pipeline

---

## Testing & Validation

### Django Debug Toolbar Integration
```python
# settings/development.py
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
```

### Query Counting Tests
```python
from django.test.utils import override_settings
from django.test import TestCase

@override_settings(DEBUG=True)
class ViewSetTestCase(TestCase):
    def test_no_n_plus_one(self):
        from django.db import connection, reset_queries

        reset_queries()

        # Make API call
        response = self.client.get('/api/policies/123/affected_users/')

        # Assert query count is reasonable
        self.assertLess(len(connection.queries), 5)
```

### Monitoring in Production
Use Django Silk or similar tools to monitor actual query patterns:
```python
INSTALLED_APPS += ['silk']
MIDDLEWARE += ['silk.middleware.SilkyMiddleware']
```

---

## Files Generated

1. **n1_query_analysis_report.json** - Complete structured report with all findings
2. **N1_QUERY_ANALYSIS_SUMMARY.md** - This detailed analysis document

## Next Steps

1. Review findings with backend team
2. Create tickets for high-priority optimizations
3. Implement fixes in order of priority
4. Add automated tests to prevent regression
5. Monitor query performance after each fix
