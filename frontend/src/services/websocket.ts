/**
 * WebSocket Client for Real-Time Updates
 *
 * Provides WebSocket connection management with:
 * - Auto-reconnect logic
 * - Event-based message handling
 * - Token-based authentication
 * - Support for notifications and dashboard metrics
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

type WebSocketEventType =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'notification'
  | 'dashboard_metrics'
  | 'message';

type WebSocketMessage = {
  type: string;
  data?: any;
  notification?: any;
  metrics?: any;
};

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // Start with 2 seconds
  private listeners: Map<WebSocketEventType | string, Set<Function>> = new Map();
  private endpoint: 'notifications' | 'dashboard' | null = null;
  private pendingReconnect: NodeJS.Timeout | null = null;

  /**
   * Connect to WebSocket server
   * @param endpoint - 'notifications' or 'dashboard'
   * @param token - Optional auth token (defaults to localStorage)
   */
  connect(endpoint: 'notifications' | 'dashboard' = 'notifications', token?: string) {
    // Get token from parameter or localStorage
    const effectiveToken = token || this.getToken();

    if (!effectiveToken) {
      console.warn('[WebSocket] Cannot connect: No auth token available');
      return;
    }

    this.endpoint = endpoint;

    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const wsUrl = `${baseUrl}/ws/${endpoint}/?token=${effectiveToken}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`[WebSocket] Connected to ${endpoint} endpoint`);
        this.reconnectAttempts = 0;
        this.emit('connected', { endpoint });
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        // WebSocket errors are expected if backend WS is not configured
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[WebSocket] Connection error (expected if WebSocket server is not running):',
            error
          );
        }
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[WebSocket] Connection to ${endpoint} closed`);
        }
        this.emit('disconnected', { endpoint });
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.pendingReconnect) {
      clearTimeout(this.pendingReconnect);
      this.pendingReconnect = null;
    }

    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnect attempt
      this.ws.close();
      this.ws = null;
    }

    this.endpoint = null;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: WebSocketMessage) {
    const { type } = data;

    // Emit specific event based on message type
    switch (type) {
      case 'notification':
        this.emit('notification', data.notification);
        break;

      case 'dashboard_metrics':
        this.emit('dashboard_metrics', data.metrics);
        break;

      case 'error':
        console.error('[WebSocket] Server error:', data.data);
        this.emit('error', data.data);
        break;

      default:
        // Emit generic message event
        this.emit('message', data);
        this.emit(type, data.data);
        break;
    }
  }

  /**
   * Send data to WebSocket server
   */
  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Cannot send: Not connected');
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string) {
    this.send({
      action: 'mark_as_read',
      notification_id: notificationId,
    });
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    this.send({
      action: 'mark_all_as_read',
    });
  }

  /**
   * Subscribe to dashboard metrics updates
   */
  subscribeToDashboardMetrics() {
    this.send({
      action: 'subscribe',
      channel: 'dashboard_metrics',
    });
  }

  /**
   * Unsubscribe from dashboard metrics updates
   */
  unsubscribeFromDashboardMetrics() {
    this.send({
      action: 'unsubscribe',
      channel: 'dashboard_metrics',
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect() {
    // Check if we still have a valid token
    const token = this.getToken();
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[WebSocket] No token found, skipping reconnection');
      }
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts && this.endpoint) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
        );
      }

      this.pendingReconnect = setTimeout(() => {
        if (this.endpoint) {
          this.connect(this.endpoint);
        }
      }, delay);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[WebSocket] Max reconnection attempts reached. WebSocket features will be unavailable.'
        );
      }
    }
  }

  /**
   * Register event listener
   */
  on(event: WebSocketEventType | string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Unregister event listener
   */
  off(event: WebSocketEventType | string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit event to all registered listeners
   */
  private emit(event: WebSocketEventType | string, data: any) {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[WebSocket] Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Get auth token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ordoc_token');
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();

// Export type for external use
export type { WebSocketEventType, WebSocketMessage };
