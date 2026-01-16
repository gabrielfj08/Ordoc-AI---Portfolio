/**
 * Global Event Emitter for Cross-Module Synchronization
 * Provides type-safe event system for coordinating cache invalidation
 * and data synchronization across different modules
 */

type EventCallback<T = any> = (data: T) => void;

interface EventMap {
    // Document Events
    'document:created': { id: string; document: any };
    'document:updated': { id: string; document: any };
    'document:deleted': { id: string };
    'document:signed': { id: string; signatureId: string };

    // Process/Procedure Events
    'procedure:created': { id: string; procedure: any };
    'procedure:updated': { id: string; procedure: any };
    'procedure:deleted': { id: string };
    'procedure:status-changed': { id: string; status: string };

    // Task Events
    'task:created': { id: string; task: any; procedureId?: string };
    'task:updated': { id: string; task: any; procedureId?: string };
    'task:deleted': { id: string; procedureId?: string };
    'task:completed': { id: string; procedureId?: string };

    // Signature Events
    'signature:requested': { id: string; documentId: string };
    'signature:completed': { id: string; documentId: string };
    'signature:rejected': { id: string; documentId: string };

    // Report Events
    'report:generated': { id: string; templateId: string };
    'report:failed': { id: string; error: string };

    // User Events
    'user:created': { id: string; user: any };
    'user:updated': { id: string; user: any };
    'user:deleted': { id: string };

    // Integration Events
    'integration:executed': { serviceId: string; success: boolean };
    'integration:failed': { serviceId: string; error: string };

    // Analytics Events
    'analytics:refresh': {};
    'dashboard:refresh': {};

    // Cache Events
    'cache:invalidate': { keys: string[] };
    'cache:clear': { pattern?: string };
}

class EventEmitter {
    private listeners: Map<keyof EventMap, Set<EventCallback>> = new Map();
    private debug: boolean = process.env.NODE_ENV === 'development';

    /**
     * Subscribe to an event
     */
    on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event)!.add(callback);

        if (this.debug) {
            console.log(`[EventEmitter] Subscribed to ${event}`);
        }

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event once (auto-unsubscribe after first emission)
     */
    once<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
        const wrappedCallback = (data: EventMap[K]) => {
            callback(data);
            this.off(event, wrappedCallback as any);
        };

        this.on(event, wrappedCallback as any);
    }

    /**
     * Unsubscribe from an event
     */
    off<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.delete(callback);

            if (this.debug) {
                console.log(`[EventEmitter] Unsubscribed from ${event}`);
            }
        }
    }

    /**
     * Emit an event
     */
    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
        const listeners = this.listeners.get(event);

        if (this.debug) {
            console.log(`[EventEmitter] Emitting ${event}`, data);
        }

        if (listeners && listeners.size > 0) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[EventEmitter] Error in ${event} listener:`, error);
                }
            });
        }
    }

    /**
     * Remove all listeners for an event
     */
    removeAllListeners<K extends keyof EventMap>(event?: K): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }

    /**
     * Get listener count for an event
     */
    listenerCount<K extends keyof EventMap>(event: K): number {
        return this.listeners.get(event)?.size || 0;
    }
}

// Global singleton instance
export const globalEvents = new EventEmitter();

// Helper function to emit cache invalidation
export function invalidateCache(keys: string[]) {
    globalEvents.emit('cache:invalidate', { keys });
}

// Helper function to clear cache by pattern
export function clearCache(pattern?: string) {
    globalEvents.emit('cache:clear', { pattern });
}

// Helper function to refresh analytics
export function refreshAnalytics() {
    globalEvents.emit('analytics:refresh', {});
}

// Helper function to refresh dashboard
export function refreshDashboard() {
    globalEvents.emit('dashboard:refresh', {});
}

export default globalEvents;
