/**
 * Generic WebSocket Hook
 *
 * Provides a React hook for WebSocket connections with automatic cleanup.
 *
 * Features:
 * - Automatic connection/disconnection
 * - Event listener management
 * - Connection state tracking
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { wsClient, type WebSocketEventType } from '@/services/websocket';

interface UseWebSocketOptions {
  endpoint?: 'notifications' | 'dashboard';
  autoConnect?: boolean;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  send: (data: any) => void;
  on: (event: WebSocketEventType | string, callback: Function) => void;
  off: (event: WebSocketEventType | string, callback: Function) => void;
}

/**
 * Generic WebSocket hook for managing WebSocket connections
 *
 * @param options - Configuration options
 * @returns WebSocket connection state and methods
 *
 * @example
 * ```tsx
 * const { isConnected, on, off } = useWebSocket({
 *   endpoint: 'notifications',
 *   autoConnect: true,
 *   onConnected: () => console.log('Connected!'),
 * });
 *
 * useEffect(() => {
 *   const handleNotification = (data) => {
 *     console.log('New notification:', data);
 *   };
 *
 *   on('notification', handleNotification);
 *   return () => off('notification', handleNotification);
 * }, [on, off]);
 * ```
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    endpoint = 'notifications',
    autoConnect = true,
    onConnected,
    onDisconnected,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef<Map<string, Function>>(new Map());

  const connect = useCallback(() => {
    wsClient.connect(endpoint);
  }, [endpoint]);

  const disconnect = useCallback(() => {
    wsClient.disconnect();
  }, []);

  const send = useCallback((data: any) => {
    wsClient.send(data);
  }, []);

  const on = useCallback((event: WebSocketEventType | string, callback: Function) => {
    wsClient.on(event, callback);
    listenersRef.current.set(event, callback);
  }, []);

  const off = useCallback((event: WebSocketEventType | string, callback: Function) => {
    wsClient.off(event, callback);
    listenersRef.current.delete(event);
  }, []);

  // Setup connection state listeners
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      onConnected?.();
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      onDisconnected?.();
    };

    const handleError = (error: any) => {
      setIsConnected(false);
      onError?.(error);
    };

    wsClient.on('connected', handleConnected);
    wsClient.on('disconnected', handleDisconnected);
    wsClient.on('error', handleError);

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      wsClient.off('connected', handleConnected);
      wsClient.off('disconnected', handleDisconnected);
      wsClient.off('error', handleError);

      // Clean up all registered listeners
      listenersRef.current.forEach((callback, event) => {
        wsClient.off(event, callback);
      });
      listenersRef.current.clear();

      // Disconnect if auto-connected
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect, onConnected, onDisconnected, onError]);

  return {
    isConnected,
    connect,
    disconnect,
    send,
    on,
    off,
  };
}
