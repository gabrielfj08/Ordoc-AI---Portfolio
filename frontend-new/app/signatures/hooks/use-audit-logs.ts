"use client"

import { useState, useCallback } from 'react'
import { auditLogsApi } from '../api'
import type { SignatureAuditLog } from '../types'
import { useToast } from '@/hooks/use-toast'

interface AuditLogFilters {
    signature_request?: string
    action?: string
    user_email?: string
}

export function useAuditLogs(initialFilters?: AuditLogFilters) {
    const [logs, setLogs] = useState<SignatureAuditLog[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<AuditLogFilters>(initialFilters || {})
    const { toast } = useToast()

    const fetchLogs = useCallback(async (customFilters?: AuditLogFilters) => {
        setLoading(true)
        setError(null)
        try {
            const appliedFilters = customFilters || filters
            const data = await auditLogsApi.list(appliedFilters)
            setLogs(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar logs'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [filters, toast])

    const fetchLogsByRequest = useCallback(async (requestId: string) => {
        setLoading(true)
        setError(null)
        try {
            const data = await auditLogsApi.byRequest(requestId)
            setLogs(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar logs da solicitação'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const fetchLogsByUser = useCallback(async (userEmail: string) => {
        setLoading(true)
        setError(null)
        try {
            const data = await auditLogsApi.byUser(userEmail)
            setLogs(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar logs do usuário'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const getLog = async (id: string) => {
        setLoading(true)
        try {
            const log = await auditLogsApi.retrieve(id)
            return log
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar detalhes do log'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        logs,
        loading,
        error,
        filters,
        setFilters,
        fetchLogs,
        fetchLogsByRequest,
        fetchLogsByUser,
        getLog,
    }
}
