import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { produce } from 'immer'

// --- Interfaces ---

export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    is_active: boolean
    is_internal: boolean
    organization?: {
        id: string
        name: string
        slug: string
    }
    roles: string[]
    permissions: string[]
}

export interface Notification {
    id: string
    subject: string
    body: string
    created_at: string
    status: string
    type?: string
}

export interface Alert {
    id: string
    title: string
    message: string
    severity: 'info' | 'warning' | 'error' | 'critical'
    source: string
    is_read: boolean
    created_at: string
}

// --- State and Actions Types ---

interface AppState {
    // Auth
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean

    // Notifications
    notifications: Notification[]
    unreadNotificationsCount: number

    // Alerts
    alerts: Alert[]
    unreadAlertsCount: number
    isAlertsConnected: boolean
    notificationsEnabled: boolean
    notificationPermission: NotificationPermission

    // Actions
    // Auth Actions
    setUser: (user: User | null) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    clearAuth: () => void
    setLoading: (loading: boolean) => void
    clearAll: () => void

    // Notification Actions
    addNotification: (notification: Notification) => void
    setNotifications: (notifications: Notification[]) => void
    markNotificationAsRead: (id: string) => void
    markAllNotificationsAsRead: () => void
    clearNotifications: () => void

    // Alert Actions
    setAlerts: (alerts: Alert[]) => void
    addAlert: (alert: Alert) => void
    markAlertAsRead: (id: string) => void
    markAllAlertsAsRead: () => void
    removeAlert: (id: string) => void
    clearAlerts: () => void
    setAlertsConnected: (connected: boolean) => void
    setNotificationsEnabled: (enabled: boolean) => void
    setNotificationPermission: (permission: NotificationPermission) => void
}

// --- Implementation ---

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                // Initial State
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: true,

                notifications: [],
                unreadNotificationsCount: 0,

                alerts: [],
                unreadAlertsCount: 0,
                isAlertsConnected: false,
                notificationsEnabled: false,
                notificationPermission: 'default' as NotificationPermission,

                // Auth Actions
                setUser: (user: User | null) =>
                    (set as any)(produce((state: AppState) => {
                        state.user = user
                        state.isAuthenticated = !!user
                    }), false, 'auth/setUser'),

                setTokens: (accessToken: string, refreshToken: string) =>
                    (set as any)(produce((state: AppState) => {
                        state.accessToken = accessToken
                        state.refreshToken = refreshToken
                    }), false, 'auth/setTokens'),

                clearAuth: () =>
                    (set as any)(produce((state: AppState) => {
                        state.user = null
                        state.accessToken = null
                        state.refreshToken = null
                        state.isAuthenticated = false
                    }), false, 'auth/clearAuth'),

                setLoading: (loading: boolean) =>
                    (set as any)(produce((state: AppState) => {
                        state.isLoading = loading
                    }), false, 'auth/setLoading'),

                clearAll: () => {
                    localStorage.removeItem('ordoc-app-storage')
                        ; (set as any)(produce((state: AppState) => {
                            state.user = null
                            state.accessToken = null
                            state.refreshToken = null
                            state.isAuthenticated = false
                            state.isLoading = false
                            state.notifications = []
                            state.unreadNotificationsCount = 0
                            state.alerts = []
                            state.unreadAlertsCount = 0
                            state.isAlertsConnected = false
                            state.notificationsEnabled = false
                            state.notificationPermission = 'default' as NotificationPermission
                        }), false, 'app/reset')
                },

                // Notification Actions
                addNotification: (notification: Notification) =>
                    (set as any)(produce((state: AppState) => {
                        state.notifications.unshift(notification)
                        state.unreadNotificationsCount = state.notifications.filter((n) => n.status !== 'read').length
                    }), false, 'notifications/add'),

                setNotifications: (notifications: Notification[]) =>
                    (set as any)(produce((state: AppState) => {
                        state.notifications = notifications
                        state.unreadNotificationsCount = notifications.filter((n) => n.status !== 'read').length
                    }), false, 'notifications/setAll'),

                markNotificationAsRead: (id: string) =>
                    (set as any)(produce((state: AppState) => {
                        const notification = state.notifications.find((n) => n.id === id)
                        if (notification) {
                            notification.status = 'read'
                            state.unreadNotificationsCount = state.notifications.filter((n) => n.status !== 'read').length
                        }
                    }), false, 'notifications/markAsRead'),

                markAllNotificationsAsRead: () =>
                    (set as any)(produce((state: AppState) => {
                        state.notifications.forEach((n) => (n.status = 'read'))
                        state.unreadNotificationsCount = 0
                    }), false, 'notifications/markAllAsRead'),

                clearNotifications: () =>
                    (set as any)(produce((state: AppState) => {
                        state.notifications = []
                        state.unreadNotificationsCount = 0
                    }), false, 'notifications/clear'),

                // Alert Actions
                setAlerts: (alerts: Alert[]) =>
                    (set as any)(produce((state: AppState) => {
                        state.alerts = alerts
                        state.unreadAlertsCount = alerts.filter((a) => !a.is_read).length
                    }), false, 'alerts/setAll'),

                addAlert: (alert: Alert) =>
                    (set as any)(produce((state: AppState) => {
                        state.alerts.unshift(alert)
                        state.unreadAlertsCount = state.alerts.filter((a) => !a.is_read).length
                    }), false, 'alerts/add'),

                markAlertAsRead: (id: string) =>
                    (set as any)(produce((state: AppState) => {
                        const alert = state.alerts.find((a) => a.id === id)
                        if (alert) {
                            alert.is_read = true
                            state.unreadAlertsCount = state.alerts.filter((a) => !a.is_read).length
                        }
                    }), false, 'alerts/markAsRead'),

                markAllAlertsAsRead: () =>
                    (set as any)(produce((state: AppState) => {
                        state.alerts.forEach((a) => (a.is_read = true))
                        state.unreadAlertsCount = 0
                    }), false, 'alerts/markAllAsRead'),

                removeAlert: (id: string) =>
                    (set as any)(produce((state: AppState) => {
                        state.alerts = state.alerts.filter((a) => a.id !== id)
                        state.unreadAlertsCount = state.alerts.filter((a) => !a.is_read).length
                    }), false, 'alerts/remove'),

                clearAlerts: () =>
                    (set as any)(produce((state: AppState) => {
                        state.alerts = []
                        state.unreadAlertsCount = 0
                    }), false, 'alerts/clear'),

                setAlertsConnected: (connected: boolean) =>
                    (set as any)(produce((state: AppState) => {
                        state.isAlertsConnected = connected
                    }), false, 'alerts/setConnected'),

                setNotificationsEnabled: (enabled: boolean) =>
                    (set as any)(produce((state: AppState) => {
                        state.notificationsEnabled = enabled
                    }), false, 'alerts/setNotificationsEnabled'),

                setNotificationPermission: (permission: NotificationPermission) =>
                    (set as any)(produce((state: AppState) => {
                        state.notificationPermission = permission
                    }), false, 'alerts/setPermission'),
            }),
            {
                name: 'ordoc-app-storage',
                storage: createJSONStorage(() => localStorage),
                // Persiste apenas tokens, user e configurações de notificações
                partialize: (state: AppState) => ({
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                    user: state.user,
                    notificationsEnabled: state.notificationsEnabled,
                }),
            }
        ) as any,
        { name: 'AppStore' }
    ) as any
)
