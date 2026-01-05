import { useEffect, useState } from 'react'
import { useAlertsWebSocket } from './use-alerts-websocket'
import { notificationService } from '@/lib/notifications'
import type { Alert } from '@/services/intelligence-api'

export interface UseBrowserNotificationsOptions {
  enabled?: boolean
  autoRequestPermission?: boolean
  showBrowserNotifications?: boolean
}

export interface UseBrowserNotificationsReturn {
  alerts: Alert[]
  unreadCount: number
  isConnected: boolean
  notificationsEnabled: boolean
  notificationPermission: NotificationPermission
  enableNotifications: () => Promise<boolean>
  disableNotifications: () => void
}

/**
 * Hook que integra WebSocket de alertas com notificações do navegador
 * 
 * @example
 * ```tsx
 * const {
 *   unreadCount,
 *   notificationsEnabled,
 *   enableNotifications
 * } = useBrowserNotifications({ enabled: true })
 * ```
 */
export function useBrowserNotifications(
  options: UseBrowserNotificationsOptions = {}
): UseBrowserNotificationsReturn {
  const {
    enabled = true,
    autoRequestPermission = false,
    showBrowserNotifications = true,
  } = options

  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    'default'
  )

  // Hook do WebSocket de alertas (só conecta se enabled=true)
  const {
    alerts,
    unreadCount,
    isConnected,
  } = useAlertsWebSocket(enabled)

  // Solicitar permissão de notificações ao montar (se autoRequestPermission=true)
  useEffect(() => {
    if (enabled && autoRequestPermission && notificationService.isSupported()) {
      enableNotifications()
    }
  }, [enabled, autoRequestPermission])

  // Atualizar estado de permissão
  useEffect(() => {
    if (notificationService.isSupported()) {
      setNotificationPermission(notificationService.getPermission())
    }
  }, [])

  // Mostrar notificação do navegador quando novo alerta chegar via WebSocket
  useEffect(() => {
    if (!enabled || !showBrowserNotifications || !notificationsEnabled) {
      return
    }

    // Pegar o último alerta (mais recente)
    const latestAlert = alerts[0]
    
    if (latestAlert && !latestAlert.is_read) {
      // Mostrar notificação do navegador
      notificationService.showAlert({
        id: latestAlert.id,
        title: latestAlert.title,
        message: latestAlert.message,
        severity: latestAlert.severity,
      })
    }
  }, [alerts, enabled, showBrowserNotifications, notificationsEnabled])

  const enableNotifications = async (): Promise<boolean> => {
    if (!notificationService.isSupported()) {
      console.warn('[useBrowserNotifications] Navegador não suporta notificações')
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
