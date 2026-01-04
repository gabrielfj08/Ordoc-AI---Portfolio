import { useEffect, useRef, useState } from 'react'

interface DashboardMetrics {
  total_documents?: number
  active_users?: number
  procedure_stats?: {
    urgent: number
    normal: number
    completed: number
    total: number
  }
  recent_activities?: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

interface UseWebSocketDashboardOptions {
  autoConnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

interface UseWebSocketDashboardReturn {
  metrics: DashboardMetrics | null
  isConnected: boolean
  error: string | null
  reconnect: () => void
}

/**
 * Hook para WebSocket de métricas do dashboard em tempo real
 *
 * Conecta com o WebSocket do backend para receber atualizações
 * em tempo real de métricas do dashboard
 */
export function useWebSocketDashboard(
  options: UseWebSocketDashboardOptions = {}
): UseWebSocketDashboardReturn {
  const {
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = () => {
    try {
      // Obter token do localStorage
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Token de autenticação não encontrado')
        return
      }

      // Determinar URL do WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const wsUrl = `${protocol}//${host}/ws/dashboard/?token=${token}`

      console.log('[WebSocket Dashboard] Conectando...')
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('[WebSocket Dashboard] Conectado')
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('[WebSocket Dashboard] Mensagem recebida:', data)

          if (data.type === 'dashboard_metrics') {
            setMetrics(data.metrics)
          } else if (data.type === 'error') {
            setError(data.message || 'Erro no WebSocket')
          }
        } catch (err) {
          console.error('[WebSocket Dashboard] Erro ao processar mensagem:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('[WebSocket Dashboard] Erro:', event)
        setError('Erro na conexão WebSocket')
      }

      ws.onclose = () => {
        console.log('[WebSocket Dashboard] Desconectado')
        setIsConnected(false)

        // Tentar reconectar se não excedeu o máximo de tentativas
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1
          console.log(
            `[WebSocket Dashboard] Tentando reconectar (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        } else {
          setError('Máximo de tentativas de reconexão excedido')
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('[WebSocket Dashboard] Erro ao conectar:', err)
      setError('Erro ao estabelecer conexão WebSocket')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const reconnect = () => {
    disconnect()
    reconnectAttemptsRef.current = 0
    connect()
  }

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect])

  return {
    metrics,
    isConnected,
    error,
    reconnect,
  }
}
