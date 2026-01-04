import { useAppStore } from '@/stores/app-store'
import { notificationService } from '@/lib/notifications'

/**
 * Hook para acessar alertas de IA
 * Usa Zustand store para estado global
 */
export function useAlerts() {
  const {
    alerts,
    unreadAlertsCount: unreadCount,
    isAlertsConnected: isConnected,
    notificationsEnabled,
    notificationPermission,
    setNotificationsEnabled,
    setNotificationPermission,
  } = useAppStore()

  const enableNotifications = async (): Promise<boolean> => {
    if (!notificationService.isSupported()) {
      console.warn('[useAlerts] Navegador não suporta notificações')
      return false
    }

    const permission = await notificationService.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      setNotificationsEnabled(true)

      // Mostrar notificação de boas-vindas
      notificationService.show({
        title: '🔔 Notificações Ativadas',
        body: 'Você receberá alertas em tempo real!',
        icon: '/logo.png',
      })

      return true
    }

    return false
  }

  const disableNotifications = () => {
    setNotificationsEnabled(false)
  }

  return {
    alerts,
    unreadCount,
    isConnected,
    notificationsEnabled,
    notificationPermission,
    enableNotifications,
    disableNotifications,
  }
}
