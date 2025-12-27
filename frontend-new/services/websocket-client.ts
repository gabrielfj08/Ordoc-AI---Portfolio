class WebSocketClient {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private listeners: Map<string, Set<Function>> = new Map()

    connect(token: string) {
        const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
        const wsUrl = `${baseUrl}/ws/notifications/?token=${token}`

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
            console.error('WebSocket error:', error)
            this.emit('error', error)
        }

        this.ws.onclose = () => {
            console.log('WebSocket disconnected')
            this.emit('disconnected', {})
            this.attemptReconnect(token)
        }
    }

    disconnect() {
        if (this.ws) {
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

    private attemptReconnect(token: string) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay = this.reconnectDelay * this.reconnectAttempts

            console.log(`Attempting to reconnect in ${delay}ms...`)
            setTimeout(() => this.connect(token), delay)
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
