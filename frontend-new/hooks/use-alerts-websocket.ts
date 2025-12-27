import { useCallback, useState } from 'react'
import { useWebSocket, type WebSocketMessage } from './use-websocket'
import type { Alert } from '@/services/intelligence-api'

export interface AlertWebSocketMessage extends WebSocketMessage {
  type: 'new_alert' | 'alert_updated' | 'alert_deleted'
  data: Alert
}

export interface UseAlertsWebSocketReturn {
  alerts: Alert[]
  unreadCount: number
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  addAlert: (alert: Alert) => void
  removeAlert: (alertId: string) => void
  updateAlert: (alertId: string, updates: Partial<Alert>) => void
  clearAlerts: () => void
}

/**
 * Hook para gerenciar alertas em tempo real via WebSocket
 * 
 * @example
 * ```tsx
 * const { alerts, unreadCount, isConnected } = useAlertsWebSocket()
 * ```
 */
export function useAlertsWebSocket(enabled: boolean = false): UseAlertsWebSocketReturn {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const handleMessage = useCallback((message: WebSocketMessage) => {
    const alertMessage = message as AlertWebSocketMessage

    switch (alertMessage.type) {
      case 'new_alert':
        // Adicionar novo alerta no início da lista
        setAlerts((prev) => {
          // Evitar duplicatas
          if (prev.find((a) => a.id === alertMessage.data.id)) {
            return prev
          }
          return [alertMessage.data, ...prev]
        })
        break

      case 'alert_updated':
        // Atualizar alerta existente
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertMessage.data.id ? alertMessage.data : alert
          )
        )
        break

      case 'alert_deleted':
        // Remover alerta
        setAlerts((prev) =>
          prev.filter((alert) => alert.id !== alertMessage.data.id)
        )
        break

      default:
        console.warn('[AlertsWebSocket] Tipo de mensagem desconhecido:', alertMessage.type)
    }
  }, [])

  // Só conectar se enabled=true
  const { isConnected, isConnecting, error } = enabled ? useWebSocket({
    // URL do WebSocket - ajustar conforme configuração do backend
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/alerts/',
    reconnect: true,
    reconnectInterval: 3000,
    reconnectAttempts: 10,
    onMessage: handleMessage,
    onOpen: () => {
      console.log('[AlertsWebSocket] Conexão estabelecida')
    },
    onClose: () => {
      console.log('[AlertsWebSocket] Conexão fechada')
    },
    onError: () => {
      console.error('[AlertsWebSocket] Erro na conexão')
    },
  }) : { isConnected: false, isConnecting: false, error: null }

  // Métodos auxiliares para manipular alertas localmente
  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => {
      if (prev.find((a) => a.id === alert.id)) {
        return prev
      }
      return [alert, ...prev]
    })
  }, [])

  const removeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }, [])

  const updateAlert = useCallback((alertId: string, updates: Partial<Alert>) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, ...updates } : alert
      )
    )
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  // Calcular quantidade de alertas não lidos
  const unreadCount = alerts.filter((alert) => !alert.is_read).length

  return {
    alerts,
    unreadCount,
    isConnected,
    isConnecting,
    error,
    addAlert,
    removeAlert,
    updateAlert,
    clearAlerts,
  }
}
