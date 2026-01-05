import apiClient from './api-client'
import type { NotificationLog, PaginatedNotifications } from '@/types/notifications'

const BASE_URL = '/api/v1/ordoc-flow'

export const notificationsApi = {
    /**
     * Lista notificações
     */
    list: async (params?: { unread_only?: boolean }) => {
        const response = await apiClient.get<PaginatedNotifications>(
            `${BASE_URL}/notifications/`,
            { params }
        )
        return response.data
    },

    /**
     * Contagem de não lidas
     */
    unreadCount: async () => {
        const response = await apiClient.get<{ count: number }>(
            `${BASE_URL}/notifications/unread-count/`
        )
        return response.data
    },

    /**
     * Marca notificação como lida
     */
    markAsRead: async (id: string) => {
        const response = await apiClient.post<NotificationLog>(
            `${BASE_URL}/notifications/${id}/mark-as-read/`
        )
        return response.data
    },

    /**
     * Marca todas como lidas
     */
    markAllAsRead: async () => {
        const response = await apiClient.post(
            `${BASE_URL}/notifications/mark-all-as-read/`
        )
        return response.data
    },
}
