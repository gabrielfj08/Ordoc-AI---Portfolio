import apiClient from '@/services/api-client'
import type { NotificationLog, PaginatedNotifications } from '@/types/notifications'

const BASE_URL = '/api/v1/ordoc-flow/api'

export const notificationsApi = {
    /**
     * Lista notificações do usuário atual
     */
    list: async (params?: {
        status?: string
        channel?: string
        unread_only?: boolean
    }) => {
        const response = await apiClient.get<PaginatedNotifications>(
            `${BASE_URL}/notification-logs/`,
            { params }
        )
        return response.data
    },

    /**
     * Marca notificação como lida
     */
    markAsRead: async (id: string) => {
        const response = await apiClient.post<NotificationLog>(
            `${BASE_URL}/notification-logs/${id}/mark_as_read/`
        )
        return response.data
    },

    /**
     * Marca todas como lidas
     */
    markAllAsRead: async () => {
        const response = await apiClient.post(
            `${BASE_URL}/notification-logs/mark_all_as_read/`
        )
        return response.data
    },

    /**
     * Conta notificações não lidas
     */
    unreadCount: async () => {
        const response = await apiClient.get<{ count: number }>(
            `${BASE_URL}/notification-logs/unread_count/`
        )
        return response.data
    },
}
