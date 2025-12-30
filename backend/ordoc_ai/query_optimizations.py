"""
QuerySet Optimization Mixins and Utilities
============================================

This module provides reusable optimizations for Django ViewSets to reduce N+1 queries.

Usage in ViewSets:
    from ordoc_ai.query_optimizations import QueryOptimizationMixin

    class MyViewSet(QueryOptimizationMixin, BaseViewSet):
        queryset = MyModel.objects.all()
        select_related_fields = ['organization', 'created_by']
        prefetch_related_fields = ['tags', 'permissions']

Created as part of Sprint 5 - Performance Backend
"""

from django.db.models import Prefetch
from functools import wraps
from typing import List, Optional


class QueryOptimizationMixin:
    """
    Mixin that automatically applies select_related and prefetch_related
    to ViewSet querysets based on declared fields.

    Attributes:
        select_related_fields (list): ForeignKey/OneToOneField fields to optimize
        prefetch_related_fields (list): ManyToMany/reverse ForeignKey fields to optimize
        custom_prefetches (dict): Custom Prefetch objects for complex relationships
    """

    select_related_fields: List[str] = []
    prefetch_related_fields: List[str] = []
    custom_prefetches: dict = {}

    def get_queryset(self):
        """
        Override to automatically apply query optimizations.
        """
        queryset = super().get_queryset()

        # Apply select_related for ForeignKey/OneToOne
        if self.select_related_fields:
            queryset = queryset.select_related(*self.select_related_fields)

        # Apply prefetch_related for ManyToMany/reverse FK
        if self.prefetch_related_fields:
            queryset = queryset.prefetch_related(*self.prefetch_related_fields)

        # Apply custom Prefetch objects
        if self.custom_prefetches:
            for prefetch in self.custom_prefetches.values():
                queryset = queryset.prefetch_related(prefetch)

        return queryset


def optimize_tree_queryset(
    queryset,
    parent_field='parent',
    children_field='children',
    organization_field='organization'
):
    """
    Optimizes queryset for tree structures (departments, directories, etc).

    Args:
        queryset: Base queryset to optimize
        parent_field: Name of the parent ForeignKey field
        children_field: Name of the reverse children relationship
        organization_field: Name of the organization ForeignKey field

    Returns:
        Optimized queryset with prefetched children

    Example:
        queryset = Department.objects.all()
        optimized = optimize_tree_queryset(queryset)
    """
    return queryset.select_related(
        organization_field,
        parent_field
    ).prefetch_related(children_field)


def batch_tree_build(nodes, parent_id_field='parent_id'):
    """
    Builds a tree structure from a flat list of nodes without N+1 queries.

    Args:
        nodes: Iterable of model instances
        parent_id_field: Name of the parent ID field

    Returns:
        dict: {node_id: {'node': node, 'children': [...]}}

    Example:
        departments = Department.objects.all().select_related('parent')
        tree = batch_tree_build(departments)
    """
    # Build lookup dict
    node_dict = {node.id: {'node': node, 'children': []} for node in nodes}

    # Build parent-child relationships
    root_nodes = []
    for node in nodes:
        parent_id = getattr(node, parent_id_field)
        if parent_id is None:
            root_nodes.append(node_dict[node.id])
        elif parent_id in node_dict:
            node_dict[parent_id]['children'].append(node_dict[node.id])

    return {'roots': root_nodes, 'all_nodes': node_dict}


def cache_queryset(timeout=300, key_prefix='qs'):
    """
    Decorator to cache queryset results in Redis.

    Args:
        timeout: Cache timeout in seconds (default 5 minutes)
        key_prefix: Prefix for cache keys

    Example:
        @cache_queryset(timeout=600, key_prefix='documents')
        def get_recent_documents(self, user_id):
            return Document.objects.filter(created_by=user_id).order_by('-created_at')[:10]
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            from django.core.cache import cache
            import hashlib
            import pickle

            # Generate cache key from function name and arguments
            key_parts = [key_prefix, func.__name__]
            for arg in args[1:]:  # Skip self
                key_parts.append(str(arg))
            for k, v in sorted(kwargs.items()):
                key_parts.append(f"{k}={v}")

            cache_key = hashlib.md5(
                ':'.join(key_parts).encode()
            ).hexdigest()

            # Try to get from cache
            cached = cache.get(cache_key)
            if cached is not None:
                return pickle.loads(cached)

            # Execute function and cache result
            result = func(*args, **kwargs)

            # Cache only if result is a QuerySet or list
            if hasattr(result, '__iter__'):
                # Evaluate queryset to list for caching
                if hasattr(result, 'model'):
                    result_list = list(result)
                    cache.set(cache_key, pickle.dumps(result_list), timeout)
                    return result_list
                else:
                    cache.set(cache_key, pickle.dumps(result), timeout)

            return result

        return wrapper
    return decorator


class TreeQueryOptimizationMixin:
    """
    Specialized mixin for tree-structured models (Department, Directory).

    Provides optimized tree building without N+1 queries.
    """

    tree_parent_field = 'parent'
    tree_children_field = 'children'

    def get_tree_queryset(self):
        """
        Returns an optimized queryset for tree structures.
        """
        queryset = self.get_queryset()
        return optimize_tree_queryset(
            queryset,
            parent_field=self.tree_parent_field,
            children_field=self.tree_children_field
        )

    def build_tree_response(self, queryset, serialize=True):
        """
        Builds tree structure from queryset without N+1 queries.

        Args:
            queryset: Already filtered queryset (e.g., filter organization)
            serialize: Whether to serialize using ViewSet serializer

        Returns:
            list: Tree structure as list of dicts
        """
        # Fetch all nodes at once
        all_nodes = list(queryset)

        # Build tree structure
        tree_data = batch_tree_build(all_nodes, f"{self.tree_parent_field}_id")

        if serialize:
            return self._serialize_tree(tree_data['roots'])
        return tree_data['roots']

    def _serialize_tree(self, nodes):
        """
        Recursively serialize tree nodes.

        Args:
            nodes: List of node dicts from batch_tree_build

        Returns:
            list: Serialized tree structure
        """
        result = []
        for node_data in nodes:
            node = node_data['node']
            serialized = self.get_serializer(node).data

            if node_data['children']:
                serialized['children'] = self._serialize_tree(node_data['children'])

            result.append(serialized)

        return result


# Commonly used Prefetch configurations

def prefetch_user_with_organization():
    """Returns Prefetch for users with organization."""
    from ordoc_cloud.models import OrdocUser
    return Prefetch(
        'user',
        queryset=OrdocUser.objects.select_related('organization', 'user')
    )


def prefetch_documents_with_metadata():
    """Returns Prefetch for documents with all metadata."""
    from ordoc_air.models import Document
    return Prefetch(
        'documents',
        queryset=Document.objects.select_related(
            'organization',
            'department',
            'directory',
            'uploaded_by'
        ).prefetch_related('tags', 'permissions')
    )


def prefetch_tasks_with_assignees():
    """Returns Prefetch for tasks with assignees."""
    from ordoc_flow.models import Task
    return Prefetch(
        'tasks',
        queryset=Task.objects.select_related(
            'procedure',
            'task_template',
            'assigned_to'
        ).prefetch_related('attachments')
    )


def prefetch_procedures_complete():
    """Returns Prefetch for procedures with all relationships."""
    from ordoc_flow.models import Procedure
    return Prefetch(
        'procedures',
        queryset=Procedure.objects.select_related(
            'organization',
            'procedure_template',
            'requester',
            'created_by'
        ).prefetch_related('tasks', 'documents', 'history')
    )
