'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useBrowserNotifications } from '@/hooks/use-browser-notifications'
import type { Alert } from '@/services/intelligence-api'

interface AlertsContextValue {
  alerts: Alert[]
  unreadCount: number
  isConnected: boolean
  notificationsEnabled: boolean
  notificationPermission: NotificationPermission
  enableNotifications: () => Promise<boolean>
  disableNotifications: () => void
}

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined)

export function AlertsProvider({ children }: { children: ReactNode }) {
  const alertsData = useBrowserNotifications({
    enabled: false, // Desabilitado até backend WebSocket estar pronto
    autoRequestPermission: false,
    showBrowserNotifications: true,
  })

  return (
    <AlertsContext.Provider value={alertsData}>
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts() {
  const context = useContext(AlertsContext)
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider')
  }
  return context
}
