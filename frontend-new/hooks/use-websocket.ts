import { useEffect, useRef, useState, useCallback } from 'react'

export interface WebSocketMessage<T = any> {
  type: string
  data: T
  timestamp?: string
}

export interface UseWebSocketOptions {
  url: string
  reconnect?: boolean
  reconnectInterval?: number
  reconnectAttempts?: number
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
}

export interface UseWebSocketReturn {
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  sendMessage: (message: WebSocketMessage) => void
  reconnect: () => void
  disconnect: () => void
}

/**
 * Hook customizado para gerenciar conexões WebSocket com reconexão automática
 * 
 * @example
 * ```tsx
 * const { isConnected, sendMessage } = useWebSocket({
 *   url: 'ws://localhost:8000/ws/alerts/',
 *   onMessage: (message) => {
 *     console.log('Nova mensagem:', message)
 *   }
 * })
 * ```
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 10,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const shouldReconnectRef = useRef(true)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const ws = new WebSocket(url)

      ws.onopen = (event) => {
        console.log('[WebSocket] Conectado:', url)
        setIsConnected(true)
        setIsConnecting(false)
        setError(null)
        reconnectAttemptsRef.current = 0
        onOpen?.(event)
      }

      ws.onclose = (event) => {
        console.log('[WebSocket] Desconectado:', event.code, event.reason)
        setIsConnected(false)
        setIsConnecting(false)
        wsRef.current = null
        onClose?.(event)

        // Reconectar automaticamente se habilitado
        if (
          reconnect &&
          shouldReconnectRef.current &&
          reconnectAttemptsRef.current < reconnectAttempts
        ) {
          reconnectAttemptsRef.current++
          console.log(
            `[WebSocket] Tentativa de reconexão ${reconnectAttemptsRef.current}/${reconnectAttempts}`
          )
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (event) => {
        console.error('[WebSocket] Erro:', event)
        const error = new Error('Erro na conexão WebSocket')
        setError(error)
        setIsConnecting(false)
        onError?.(event)
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          onMessage?.(message)
        } catch (err) {
          console.error('[WebSocket] Erro ao parsear mensagem:', err)
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('[WebSocket] Erro ao criar conexão:', err)
      const error = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(error)
      setIsConnecting(false)
    }
  }, [url, reconnect, reconnectInterval, reconnectAttempts, onOpen, onClose, onError, onMessage])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  const reconnectManually = useCallback(() => {
    disconnect()
    shouldReconnectRef.current = true
    reconnectAttemptsRef.current = 0
    connect()
  }, [connect, disconnect])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('[WebSocket] Não conectado. Mensagem não enviada:', message)
    }
  }, [])

  // Conectar ao montar e desconectar ao desmontar
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, []) // Intencionalmente vazio para conectar apenas uma vez

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    reconnect: reconnectManually,
    disconnect,
  }
}
