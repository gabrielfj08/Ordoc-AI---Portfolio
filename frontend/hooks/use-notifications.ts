import { useAppStore } from '@/stores/app-store'
import { wsClient } from '@/services/websocket-client'

/**
 * Hook para acessar notificações
 * Usa Zustand store para estado global e WebSocket para real-time
 */
export function useNotifications() {
  const {
    notifications,
    unreadNotificationsCount: unreadCount,
    markNotificationAsRead: markAsReadStore,
    markAllNotificationsAsRead: markAllAsReadStore
  } = useAppStore()

  const markAsRead = (id: string) => {
    wsClient.markAsRead(id)
    markAsReadStore(id)
  }

  const markAllAsRead = () => {
    wsClient.markAllAsRead()
    markAllAsReadStore()
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}
