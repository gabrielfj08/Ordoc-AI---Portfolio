"use client"

import { useState, useEffect, useCallback } from 'react'
import { notificationsApi } from '@/services/notifications-api'
import type { NotificationLog } from '@/types/notifications'

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationLog[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await notificationsApi.list({ unread_only: false })
            setNotifications(data.results)
        } catch (err: any) {
            // Silenciar erro 401 (não autenticado)
            if (err.response?.status !== 401) {
                setError(err.message || 'Erro ao carregar notificações')
            }
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchUnreadCount = useCallback(async () => {
        try {
            const data = await notificationsApi.unreadCount()
            setUnreadCount(data.count)
        } catch (err: any) {
            // Silenciar erro 401
            if (err.response?.status !== 401) {
                console.error('Erro ao buscar contagem:', err)
            }
        }
    }, [])

    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationsApi.markAsRead(id)
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, status: 'read' as const, read_at: new Date().toISOString() } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (err: any) {
            console.error('Erro ao marcar como lida:', err)
        }
    }, [])

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationsApi.markAllAsRead()
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, status: 'read' as const, read_at: new Date().toISOString() }))
            )
            setUnreadCount(0)
        } catch (err: any) {
            console.error('Erro ao marcar todas como lidas:', err)
        }
    }, [])

    useEffect(() => {
        fetchNotifications()
        fetchUnreadCount()

        // Atualizar a cada 30 segundos
        const interval = setInterval(() => {
            fetchNotifications()
            fetchUnreadCount()
        }, 30000)

        return () => clearInterval(interval)
    }, [fetchNotifications, fetchUnreadCount])

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    }
}
