import apiClient from './api-client'

export interface Notification {
    id: string
    subject: string
    body: string
    status: 'sent' | 'delivered' | 'read' | 'failed'
    notification_type: string
    type?: string
    created_at: string
    read_at?: string
    related_object_url?: string
    recipient?: string
    external_recipient?: string
}

export interface NotificationListResponse {
    results: Notification[]
    count: number
    next: string | null
    previous: string | null
}

const BASE_URL = '/api/v1/ordoc-flow'

/**
 * API de Notificações - Usa NotificationViewSet (mais completo)
 * Endpoints: /api/v1/ordoc-flow/notifications/
 */
export const notificationApi = {
    /**
     * Listar todas as notificações do usuário atual
     */
    list: async (params?: {
        page?: number
        page_size?: number
    }): Promise<NotificationListResponse> => {
        const response = await apiClient.get<NotificationListResponse>(
            `${BASE_URL}/notifications/`,
            { params }
        )
        return response.data
    },

    /**
     * Obter detalhes de uma notificação
     */
    get: async (id: string): Promise<Notification> => {
        const response = await apiClient.get<Notification>(
            `${BASE_URL}/notifications/${id}/`
        )
        return response.data
    },

    /**
     * Listar apenas notificações não lidas
     */
    listUnread: async (params?: {
        page?: number
        page_size?: number
    }): Promise<NotificationListResponse> => {
        const response = await apiClient.get<NotificationListResponse>(
            `${BASE_URL}/notifications/unread/`,
            { params }
        )
        return response.data
    },

    /**
     * Marcar notificação como lida
     */
    markAsRead: async (id: string): Promise<{ status: string; message: string }> => {
        const response = await apiClient.post<{ status: string; message: string }>(
            `${BASE_URL}/notifications/${id}/mark_read/`
        )
        return response.data
    },

    /**
     * Marcar todas as notificações como lidas
     */
    markAllAsRead: async (): Promise<{ status: string; message: string; count: number }> => {
        const response = await apiClient.post<{ status: string; message: string; count: number }>(
            `${BASE_URL}/notifications/mark_all_read/`
        )
        return response.data
    },

    /**
     * Obter contador de notificações não lidas
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get<{ count: number }>(
            `${BASE_URL}/notifications/unread_count/`
        )
        return response.data.count
    },
}

// Re-export como padrão para compatibilidade
export default notificationApi
