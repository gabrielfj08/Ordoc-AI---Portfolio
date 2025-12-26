"use client"

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { proceduresApi } from '../api'
import type { Procedure, CreateProcedureDto, UpdateProcedureDto, ProcedureStatus } from '../types'

export function useProcedures() {
    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchProcedures = useCallback(async (params?: {
        status?: string
        priority?: string
        search?: string
    }) => {
        setLoading(true)
        setError(null)

        try {
            const response = await proceduresApi.list(params)
            setProcedures(response.results)
            return response.results
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao buscar procedimentos'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            return []
        } finally {
            setLoading(false)
        }
    }, [toast])

    const getProcedure = useCallback(async (id: string) => {
        try {
            const procedure = await proceduresApi.retrieve(id)
            return procedure
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao buscar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    const createProcedure = useCallback(async (data: CreateProcedureDto) => {
        setLoading(true)

        try {
            const newProcedure = await proceduresApi.create(data)
            setProcedures((prev) => [...prev, newProcedure])
            toast({
                title: 'Sucesso',
                description: 'Procedimento criado com sucesso',
            })
            return newProcedure
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao criar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }, [toast])

    const updateProcedure = useCallback(async (id: string, data: UpdateProcedureDto) => {
        setLoading(true)

        try {
            const updatedProcedure = await proceduresApi.update(id, data)
            setProcedures((prev) => prev.map((proc) => (proc.id === id ? updatedProcedure : proc)))
            toast({
                title: 'Sucesso',
                description: 'Procedimento atualizado com sucesso',
            })
            return updatedProcedure
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao atualizar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }, [toast])

    const deleteProcedure = useCallback(async (id: string) => {
        setLoading(true)

        try {
            await proceduresApi.delete(id)
            setProcedures((prev) => prev.filter((proc) => proc.id !== id))
            toast({
                title: 'Sucesso',
                description: 'Procedimento removido com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao remover procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }, [toast])

    const runProcedure = useCallback(async (id: string) => {
        try {
            await proceduresApi.run(id)
            setProcedures((prev) =>
                prev.map((proc) =>
                    proc.id === id ? { ...proc, status: 'running' as ProcedureStatus } : proc
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Procedimento executado com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao executar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    const startProcedure = useCallback(async (id: string) => {
        try {
            await proceduresApi.start(id)
            setProcedures((prev) =>
                prev.map((proc) =>
                    proc.id === id ? { ...proc, status: 'started' as ProcedureStatus } : proc
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Procedimento iniciado com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao iniciar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    const finishProcedure = useCallback(async (id: string) => {
        try {
            await proceduresApi.finish(id)
            setProcedures((prev) =>
                prev.map((proc) =>
                    proc.id === id ? { ...proc, status: 'finished' as ProcedureStatus } : proc
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Procedimento finalizado com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao finalizar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    const archiveProcedure = useCallback(async (id: string) => {
        try {
            await proceduresApi.archive(id)
            setProcedures((prev) =>
                prev.map((proc) =>
                    proc.id === id ? { ...proc, status: 'archived' as ProcedureStatus } : proc
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Procedimento arquivado com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao arquivar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    const unarchiveProcedure = useCallback(async (id: string) => {
        try {
            await proceduresApi.unarchive(id)
            // Status será draft ou started dependendo das tarefas
            toast({
                title: 'Sucesso',
                description: 'Procedimento desarquivado com sucesso',
            })
            // Recarregar procedimentos para obter status correto
            await fetchProcedures()
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao desarquivar procedimento'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast, fetchProcedures])

    return {
        procedures,
        loading,
        error,
        fetchProcedures,
        getProcedure,
        createProcedure,
        updateProcedure,
        deleteProcedure,
        runProcedure,
        startProcedure,
        finishProcedure,
        archiveProcedure,
        unarchiveProcedure,
    }
}
