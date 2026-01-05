'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'
import { wsClient } from '@/services/websocket-client'
import { notificationSound } from '@/utils/notification-sound'
import type { Notification } from '@/stores/app-store'

/**
 * Provider que gerencia WebSocket de notificações
 * Conecta automaticamente quando usuário está autenticado
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken, addNotification } = useAppStore()

  useEffect(() => {
    if (!user || !accessToken) {
      return
    }

    // Conectar WebSocket
    wsClient.connect(accessToken)

    // Escutar notificações
    wsClient.on('notification', (notification: Notification) => {
      addNotification(notification)
      // Tocar som e vibrar
      notificationSound.notify()
    })

    // Cleanup ao desmontar
    return () => {
      wsClient.disconnect()
    }
  }, [user, accessToken, addNotification])

  return <>{children}</>
}
