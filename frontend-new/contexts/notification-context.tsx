'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { wsClient } from '@/services/websocket-client'
import { useAuth } from './auth-context'
import { notificationSound } from '@/utils/notification-sound'

interface Notification {
    id: string
    subject: string
    body: string
    created_at: string
    status: string
    type?: string
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    markAsRead: (id: string) => void
    markAllAsRead: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const { user } = useAuth()
    
    useEffect(() => {
        if (user) {
            const token = localStorage.getItem('auth_token')
            if (token) {
                wsClient.connect(token)
                
                wsClient.on('notification', (notification: Notification) => {
                    setNotifications(prev => [notification, ...prev])
                    // Tocar som e vibrar para nova notificação
                    notificationSound.notify()
                })
                
                return () => {
                    wsClient.disconnect()
                }
            }
        }
    }, [user])
    
    const unreadCount = notifications.filter(n => n.status !== 'read').length
    
    const markAsRead = (id: string) => {
        wsClient.markAsRead(id)
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
        )
    }
    
    const markAllAsRead = () => {
        wsClient.markAllAsRead()
        setNotifications(prev =>
            prev.map(n => ({ ...n, status: 'read' }))
        )
    }
    
    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider')
    }
    return context
}
