"use client"

import { useState, useEffect, useCallback } from 'react'
import { signatureRequestsApi } from '../api'
import type { SignatureRequest, CreateSignatureRequestDto } from '../types'
import { useToast } from '@/hooks/use-toast'

interface RequestFilters {
    status?: string
    priority?: string
    search?: string
}

export function useSignatureRequests(initialFilters?: RequestFilters) {
    const [requests, setRequests] = useState<SignatureRequest[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<RequestFilters>(initialFilters || {})
    const { toast } = useToast()

    const fetchRequests = useCallback(async (customFilters?: RequestFilters) => {
        setLoading(true)
        setError(null)
        try {
            const appliedFilters = customFilters || filters
            const data = await signatureRequestsApi.list(appliedFilters)
            setRequests(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar solicitações'
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

    const fetchMyRequests = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await signatureRequestsApi.myRequests()
            setRequests(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar minhas solicitações'
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

    const fetchPendingRequests = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await signatureRequestsApi.pending()
            setRequests(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar solicitações pendentes'
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

    const createRequest = async (data: CreateSignatureRequestDto) => {
        setLoading(true)
        try {
            const newRequest = await signatureRequestsApi.create(data)
            setRequests((prev) => [newRequest, ...prev])
            toast({
                title: 'Sucesso',
                description: 'Solicitação criada com sucesso',
            })
            return newRequest
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao criar solicitação'
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

    const updateRequest = async (id: string, data: Partial<SignatureRequest>) => {
        setLoading(true)
        try {
            const updatedRequest = await signatureRequestsApi.update(id, data)
            setRequests((prev) =>
                prev.map((req) => (req.id === id ? updatedRequest : req))
            )
            toast({
                title: 'Sucesso',
                description: 'Solicitação atualizada com sucesso',
            })
            return updatedRequest
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao atualizar solicitação'
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

    const submitRequest = async (id: string) => {
        setLoading(true)
        try {
            await signatureRequestsApi.submit(id)
            await fetchRequests() // Refresh list
            toast({
                title: 'Sucesso',
                description: 'Solicitação enviada para assinatura',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao enviar solicitação'
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

    const cancelRequest = async (id: string) => {
        setLoading(true)
        try {
            await signatureRequestsApi.cancel(id)
            await fetchRequests() // Refresh list
            toast({
                title: 'Sucesso',
                description: 'Solicitação cancelada',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao cancelar solicitação'
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

    const deleteRequest = async (id: string) => {
        setLoading(true)
        try {
            await signatureRequestsApi.delete(id)
            setRequests((prev) => prev.filter((req) => req.id !== id))
            toast({
                title: 'Sucesso',
                description: 'Solicitação removida com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao remover solicitação'
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

    const getRequest = async (id: string) => {
        setLoading(true)
        try {
            const request = await signatureRequestsApi.retrieve(id)
            return request
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar detalhes'
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

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    return {
        requests,
        loading,
        error,
        filters,
        setFilters,
        fetchRequests,
        fetchMyRequests,
        fetchPendingRequests,
        createRequest,
        updateRequest,
        submitRequest,
        cancelRequest,
        deleteRequest,
        getRequest,
    }
}
