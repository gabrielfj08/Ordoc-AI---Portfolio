"use client"

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { dashboardApi } from '../api'
import type { DashboardStats } from '../types'

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchDashboard = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await dashboardApi.overview()
            setStats(data)
            return data
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao buscar dashboard'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            return null
        } finally {
            setLoading(false)
        }
    }, [toast])

    return {
        stats,
        loading,
        error,
        fetchDashboard,
    }
}
