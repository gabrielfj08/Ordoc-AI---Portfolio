/**
 * Shared Cache Utilities
 * Provides centralized cache management and cross-module invalidation
 */

import { QueryClient } from '@tanstack/react-query';
import { globalEvents } from '../events';

/**
 * Cache invalidation patterns for cross-module coordination
 */
export const cachePatterns = {
    // Documents affect signatures, analytics, dashboard
    documents: {
        invalidates: ['signatures', 'analytics', 'dashboard', 'reports'],
        keys: (id?: string) => id
            ? ['documents', 'document', id]
            : ['documents'],
    },

    // Signatures affect documents, analytics, dashboard
    signatures: {
        invalidates: ['documents', 'analytics', 'dashboard', 'reports'],
        keys: (id?: string) => id
            ? ['signatures', 'signature', id]
            : ['signatures'],
    },

    // Procedures affect tasks, analytics, dashboard, reports
    procedures: {
        invalidates: ['tasks', 'analytics', 'dashboard', 'reports', 'approvals'],
        keys: (id?: string) => id
            ? ['processes', 'procedures', 'procedure', id]
            : ['processes', 'procedures'],
    },

    // Tasks affect procedures, analytics, dashboard
    tasks: {
        invalidates: ['procedures', 'analytics', 'dashboard'],
        keys: (id?: string) => id
            ? ['processes', 'tasks', 'task', id]
            : ['processes', 'tasks'],
    },

    // Users affect procedures, tasks, analytics
    users: {
        invalidates: ['procedures', 'tasks', 'analytics', 'groups'],
        keys: (id?: string) => id
            ? ['users', 'user', id]
            : ['users'],
    },

    // Reports don't invalidate others but are invalidated by many
    reports: {
        invalidates: [],
        keys: (id?: string) => id
            ? ['reports', 'report', id]
            : ['reports'],
    },

    // Analytics is invalidated by almost everything
    analytics: {
        invalidates: [],
        keys: () => ['analytics'],
    },

    // Dashboard is invalidated by many modules
    dashboard: {
        invalidates: [],
        keys: () => ['dashboard', 'processes', 'dashboard'],
    },
};

/**
 * Setup global event listeners for cache synchronization
 */
export function setupCacheSync(queryClient: QueryClient) {
    // Document events
    globalEvents.on('document:created', () => {
        invalidateRelated(queryClient, 'documents');
    });

    globalEvents.on('document:updated', ({ id }) => {
        invalidateRelated(queryClient, 'documents', id);
    });

    globalEvents.on('document:deleted', () => {
        invalidateRelated(queryClient, 'documents');
    });

    globalEvents.on('document:signed', ({ id, signatureId }) => {
        queryClient.invalidateQueries({ queryKey: ['documents', 'document', id] });
        queryClient.invalidateQueries({ queryKey: ['signatures'] });
        invalidateRelated(queryClient, 'documents', id);
    });

    // Procedure events
    globalEvents.on('procedure:created', () => {
        invalidateRelated(queryClient, 'procedures');
    });

    globalEvents.on('procedure:updated', ({ id }) => {
        invalidateRelated(queryClient, 'procedures', id);
    });

    globalEvents.on('procedure:deleted', () => {
        invalidateRelated(queryClient, 'procedures');
    });

    globalEvents.on('procedure:status-changed', ({ id }) => {
        invalidateRelated(queryClient, 'procedures', id);
    });

    // Task events
    globalEvents.on('task:created', ({ procedureId }) => {
        invalidateRelated(queryClient, 'tasks');
        if (procedureId) {
            queryClient.invalidateQueries({ queryKey: ['processes', 'procedures', 'procedure', procedureId] });
        }
    });

    globalEvents.on('task:updated', ({ id, procedureId }) => {
        invalidateRelated(queryClient, 'tasks', id);
        if (procedureId) {
            queryClient.invalidateQueries({ queryKey: ['processes', 'procedures', 'procedure', procedureId] });
        }
    });

    globalEvents.on('task:completed', ({ procedureId }) => {
        invalidateRelated(queryClient, 'tasks');
        if (procedureId) {
            queryClient.invalidateQueries({ queryKey: ['processes', 'procedures', 'procedure', procedureId] });
        }
    });

    // Signature events
    globalEvents.on('signature:requested', ({ documentId }) => {
        queryClient.invalidateQueries({ queryKey: ['documents', 'document', documentId] });
        invalidateRelated(queryClient, 'signatures');
    });

    globalEvents.on('signature:completed', ({ documentId }) => {
        queryClient.invalidateQueries({ queryKey: ['documents', 'document', documentId] });
        invalidateRelated(queryClient, 'signatures');
    });

    // Report events
    globalEvents.on('report:generated', () => {
        queryClient.invalidateQueries({ queryKey: ['reports'] });
    });

    // User events
    globalEvents.on('user:created', () => {
        invalidateRelated(queryClient, 'users');
    });

    globalEvents.on('user:updated', ({ id }) => {
        invalidateRelated(queryClient, 'users', id);
    });

    // Integration events
    globalEvents.on('integration:executed', () => {
        queryClient.invalidateQueries({ queryKey: ['integrations', 'requests'] });
    });

    // Manual cache control
    globalEvents.on('cache:invalidate', ({ keys }) => {
        keys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: [key] });
        });
    });

    globalEvents.on('cache:clear', ({ pattern }) => {
        if (pattern) {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey.some(k => String(k).includes(pattern))
            });
        } else {
            queryClient.clear();
        }
    });

    // Analytics & Dashboard refresh
    globalEvents.on('analytics:refresh', () => {
        queryClient.invalidateQueries({ queryKey: ['analytics'] });
    });

    globalEvents.on('dashboard:refresh', () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['processes', 'dashboard'] });
    });
}

/**
 * Invalidate related caches based on module patterns
 */
function invalidateRelated(
    queryClient: QueryClient,
    module: keyof typeof cachePatterns,
    id?: string
) {
    const pattern = cachePatterns[module];

    // Invalidate the module itself
    const keys = pattern.keys(id);
    keys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
    });

    // Invalidate related modules
    pattern.invalidates.forEach(relatedModule => {
        const relatedPattern = cachePatterns[relatedModule as keyof typeof cachePatterns];
        if (relatedPattern) {
            const relatedKeys = relatedPattern.keys();
            relatedKeys.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    });
}

/**
 * Helper to emit events with cache invalidation
 */
export function emitWithInvalidation<K extends keyof import('../events').EventMap>(
    event: K,
    data: import('../events').EventMap[K],
    queryClient: QueryClient
) {
    globalEvents.emit(event, data);

    // The cache sync listeners will handle invalidation
    // This is just a convenience wrapper
}

/**
 * Prefetch related data
 */
export async function prefetchRelated(
    queryClient: QueryClient,
    module: keyof typeof cachePatterns,
    id: string
) {
    const pattern = cachePatterns[module];

    // Prefetch related modules
    for (const relatedModule of pattern.invalidates) {
        const relatedPattern = cachePatterns[relatedModule as keyof typeof cachePatterns];
        if (relatedPattern) {
            const keys = relatedPattern.keys();
            // Prefetch logic would go here based on specific module needs
        }
    }
}

export default {
    cachePatterns,
    setupCacheSync,
    invalidateRelated,
    emitWithInvalidation,
    prefetchRelated,
};
