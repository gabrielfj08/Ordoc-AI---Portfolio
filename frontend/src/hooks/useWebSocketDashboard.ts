/**
 * WebSocket Dashboard Hook
 *
 * Specialized hook for real-time dashboard metrics updates.
 *
 * Features:
 * - Automatic subscription to dashboard metrics
 * - Metric state management
 * - Type-safe metric updates with Zod validation
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

import { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { type DashboardMetrics } from '@/lib/schemas/reports';
import { safeValidateApiResponse } from '@/lib/schemas/common';
import { DashboardMetricsSchema } from '@/lib/schemas/reports';

interface UseWebSocketDashboardOptions {
  /**
   * Enable automatic connection to dashboard WebSocket
   * @default true
   */
  autoConnect?: boolean;

  /**
   * Callback when metrics are updated
   */
  onMetricsUpdate?: (metrics: DashboardMetrics) => void;

  /**
   * Callback when connection fails
   */
  onError?: (error: any) => void;
}

interface UseWebSocketDashboardReturn {
  /**
   * Current dashboard metrics (null if not received yet)
   */
  metrics: DashboardMetrics | null;

  /**
   * Whether WebSocket is connected
   */
  isConnected: boolean;

  /**
   * Whether metrics are being loaded
   */
  isLoading: boolean;

  /**
   * Error state (null if no error)
   */
  error: string | null;

  /**
   * Manually refresh metrics
   */
  refresh: () => void;

  /**
   * Subscribe to metrics updates
   */
  subscribe: () => void;

  /**
   * Unsubscribe from metrics updates
   */
  unsubscribe: () => void;
}

/**
 * Hook for real-time dashboard metrics via WebSocket
 *
 * @param options - Configuration options
 * @returns Dashboard metrics state and methods
 *
 * @example
 * ```tsx
 * function DashboardMetrics() {
 *   const { metrics, isConnected, isLoading, error } = useWebSocketDashboard({
 *     autoConnect: true,
 *     onMetricsUpdate: (metrics) => {
 *       console.log('Metrics updated:', metrics);
 *     },
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!metrics) return <div>No metrics available</div>;
 *
 *   return (
 *     <div>
 *       <p>Total Reports: {metrics.total_reports}</p>
 *       <p>This Month: {metrics.reports_this_month}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useWebSocketDashboard(
  options: UseWebSocketDashboardOptions = {}
): UseWebSocketDashboardReturn {
  const { autoConnect = true, onMetricsUpdate, onError } = options;

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, on, off, send } = useWebSocket({
    endpoint: 'dashboard',
    autoConnect,
    onConnected: () => {
      setError(null);
      // Subscribe to metrics on connection
      subscribe();
    },
    onDisconnected: () => {
      setIsLoading(false);
    },
    onError: (err) => {
      const errorMessage = err?.message || 'WebSocket connection error';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(err);
    },
  });

  const subscribe = useCallback(() => {
    send({
      action: 'subscribe',
      channel: 'dashboard_metrics',
    });
  }, [send]);

  const unsubscribe = useCallback(() => {
    send({
      action: 'unsubscribe',
      channel: 'dashboard_metrics',
    });
  }, [send]);

  const refresh = useCallback(() => {
    send({
      action: 'refresh',
      channel: 'dashboard_metrics',
    });
  }, [send]);

  // Listen for metrics updates
  useEffect(() => {
    const handleMetrics = (data: unknown) => {
      // Validate metrics with Zod schema
      const validated = safeValidateApiResponse(
        DashboardMetricsSchema,
        data,
        'WebSocket dashboard_metrics'
      );

      if (validated) {
        setMetrics(validated);
        setIsLoading(false);
        setError(null);
        onMetricsUpdate?.(validated);
      } else {
        setError('Invalid metrics data received from WebSocket');
        setIsLoading(false);
      }
    };

    on('dashboard_metrics', handleMetrics);

    return () => {
      off('dashboard_metrics', handleMetrics);
    };
  }, [on, off, onMetricsUpdate]);

  return {
    metrics,
    isConnected,
    isLoading,
    error,
    refresh,
    subscribe,
    unsubscribe,
  };
}
