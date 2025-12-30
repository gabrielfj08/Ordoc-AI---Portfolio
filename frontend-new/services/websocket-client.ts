import { useAppStore } from '@/stores/app-store'

class WebSocketClient {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private listeners: Map<string, Set<Function>> = new Map()

    connect(token?: string) {
        // Se não passar token, tenta pegar do store
        const effectiveToken = token || useAppStore.getState().accessToken

        if (!effectiveToken) {
            console.warn('[WebSocket] Cannot connect: No token available')
            return
        }

        const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
        const wsUrl = `${baseUrl}/ws/notifications/?token=${effectiveToken}`

        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
            console.log('WebSocket connected')
            this.reconnectAttempts = 0
            this.emit('connected', {})
        }

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                this.handleMessage(data)
            } catch (error) {
                console.error('Error parsing WebSocket message:', error)
            }
        }

        this.ws.onerror = (error) => {
            // WebSocket errors are expected if backend WS is not configured
            // Only log in development mode
            if (process.env.NODE_ENV === 'development') {
                console.warn('[WebSocket] Connection error (this is expected if WebSocket server is not running)')
            }
            this.emit('error', error)
        }

        this.ws.onclose = () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('[WebSocket] Connection closed')
            }
            this.emit('disconnected', {})
            // Não passa token antigo, deixa o attemptReconnect pegar o novo do store
            this.attemptReconnect()
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.onclose = null // Remove listener to prevent reconnect
            this.ws.close()
            this.ws = null
        }
    }

    private handleMessage(data: any) {
        const { type, notification } = data

        if (type === 'notification') {
            this.emit('notification', notification)
        }
    }

    markAsRead(notificationId: string) {
        this.send({
            action: 'mark_as_read',
            notification_id: notificationId
        })
    }

    markAllAsRead() {
        this.send({
            action: 'mark_all_as_read'
        })
    }

    private send(data: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data))
        }
    }

    private attemptReconnect() {
        // Verificar se ainda temos um usuário autenticado antes de tentar reconectar
        const token = useAppStore.getState().accessToken
        if (!token) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[WebSocket] No token found, skipping reconnection')
            }
            return
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay = this.reconnectDelay * this.reconnectAttempts

            if (process.env.NODE_ENV === 'development') {
                console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`)
            }
            setTimeout(() => this.connect(), delay)
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.warn('[WebSocket] Max reconnection attempts reached. WebSocket features will be unavailable.')
            }
        }
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(callback)
    }

    off(event: string, callback: Function) {
        this.listeners.get(event)?.delete(callback)
    }

    private emit(event: string, data: any) {
        this.listeners.get(event)?.forEach(callback => callback(data))
    }
}

export const wsClient = new WebSocketClient()

