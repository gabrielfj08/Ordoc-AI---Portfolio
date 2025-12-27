import { useEffect, useRef, useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook para conexão WebSocket de notificações em tempo real
 * 
 * Conecta ao backend via WebSocket e recebe notificações instantâneas
 * Gerencia reconexão automática em caso de desconexão
 */

export interface WebSocketNotification {
    id: string
    subject: string
    body: string
    created_at: string
    status: 'sent' | 'delivered' | 'read'
}

export interface WebSocketMessage {
    type: 'notification' | 'connection' | 'error'
    notification?: WebSocketNotification
    message?: string
}

interface UseNotificationWebSocketOptions {
    /** Habilitar reconexão automática */
    autoReconnect?: boolean
    /** Intervalo de reconexão em ms */
    reconnectInterval?: number
    /** Máximo de tentativas de reconexão */
    maxReconnectAttempts?: number
    /** Callback quando receber notificação */
    onNotification?: (notification: WebSocketNotification) => void
    /** Callback quando conectar */
    onConnect?: () => void
    /** Callback quando desconectar */
    onDisconnect?: () => void
}

export function useNotificationWebSocket(options: UseNotificationWebSocketOptions = {}) {
    const {
        autoReconnect = true,
        reconnectInterval = 3000,
        maxReconnectAttempts = 10,
        onNotification,
        onConnect,
        onDisconnect,
    } = options

    const [isConnected, setIsConnected] = useState(false)
    const [notifications, setNotifications] = useState<WebSocketNotification[]>([])
    const [reconnectAttempts, setReconnectAttempts] = useState(0)
    
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { toast } = useToast()

    const connect = useCallback(() => {
        // Obter token do localStorage
        const token = localStorage.getItem('access_token')
        if (!token) {
            console.warn('No access token found, cannot connect to WebSocket')
            return
        }

        try {
            // Determinar URL do WebSocket
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host
            const wsUrl = `${protocol}//${host}/ws/notifications/?token=${token}`

            console.log('Connecting to WebSocket:', wsUrl.replace(token, '[REDACTED]'))

            const ws = new WebSocket(wsUrl)
            wsRef.current = ws

            ws.onopen = () => {
                console.log('WebSocket connected')
                setIsConnected(true)
                setReconnectAttempts(0)
                onConnect?.()
                
                toast({
                    title: '🔔 Notificações em tempo real ativadas',
                    description: 'Você receberá alertas instantâneos',
                })
            }

            ws.onmessage = (event) => {
                try {
                    const data: WebSocketMessage = JSON.parse(event.data)
                    
                    if (data.type === 'notification' && data.notification) {
                        console.log('Received notification:', data.notification)
                        
                        // Adicionar à lista
                        setNotifications(prev => [data.notification!, ...prev])
                        
                        // Callback externo
                        onNotification?.(data.notification)
                        
                        // Toast de notificação
                        toast({
                            title: data.notification.subject,
                            description: data.notification.body,
                        })
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error)
                }
            }

            ws.onerror = (error) => {
                console.error('WebSocket error:', error)
                toast({
                    variant: 'destructive',
                    title: 'Erro na conexão',
                    description: 'Falha ao conectar notificações em tempo real',
                })
            }

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason)
                setIsConnected(false)
                onDisconnect?.()
                
                // Tentar reconectar
                if (
                    autoReconnect &&
                    reconnectAttempts < maxReconnectAttempts &&
                    event.code !== 1000 // Não reconectar em fechamento normal
                ) {
                    console.log(`Reconnecting in ${reconnectInterval}ms (attempt ${reconnectAttempts + 1})`)
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setReconnectAttempts(prev => prev + 1)
                        connect()
                    }, reconnectInterval)
                }
            }
        } catch (error) {
            console.error('Error creating WebSocket:', error)
        }
    }, [
        autoReconnect,
        reconnectInterval,
        maxReconnectAttempts,
        reconnectAttempts,
        onNotification,
        onConnect,
        onDisconnect,
        toast,
    ])

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
        }
        
        if (wsRef.current) {
            wsRef.current.close(1000, 'Manual disconnect')
            wsRef.current = null
        }
        
        setIsConnected(false)
    }, [])

    const markAsRead = useCallback((notificationId: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                action: 'mark_as_read',
                notification_id: notificationId,
            }))
            
            // Atualizar localmente
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId
                        ? { ...n, status: 'read' as const }
                        : n
                )
            )
        }
    }, [])

    const markAllAsRead = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                action: 'mark_all_as_read',
            }))
            
            // Atualizar localmente
            setNotifications(prev =>
                prev.map(n => ({ ...n, status: 'read' as const }))
            )
        }
    }, [])

    const clearNotifications = useCallback(() => {
        setNotifications([])
    }, [])

    // Conectar ao montar
    useEffect(() => {
        connect()
        
        // Desconectar ao desmontar
        return () => {
            disconnect()
        }
    }, []) // Apenas uma vez, sem dependências para evitar reconexões desnecessárias

    // Cleanup de timeout ao desmontar
    useEffect(() => {
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
        }
    }, [])

    return {
        isConnected,
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        reconnect: connect,
        disconnect,
        reconnectAttempts,
    }
}
