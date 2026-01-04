"use client"

import { useState, useCallback } from 'react'
import { signersApi } from '../api'
import type { SignatureRequestSigner, CreateSignerDto, SignDocumentDto } from '../types'
import { useToast } from '@/hooks/use-toast'

export function useSigners(signatureRequestId?: string) {
    const [signers, setSigners] = useState<SignatureRequestSigner[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchSigners = useCallback(async (requestId?: string) => {
        setLoading(true)
        setError(null)
        try {
            const params = requestId || signatureRequestId
                ? { signature_request: requestId || signatureRequestId }
                : undefined
            const data = await signersApi.list(params)
            setSigners(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar assinantes'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [signatureRequestId, toast])

    const fetchMyAssignments = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await signersApi.myAssignments()
            setSigners(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar minhas atribuições'
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

    const fetchPendingSignatures = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await signersApi.pendingSignatures()
            setSigners(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar assinaturas pendentes'
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

    const createSigner = async (data: CreateSignerDto & { signature_request?: string }) => {
        setLoading(true)
        try {
            // Se signature_request não foi fornecido, usa o do hook
            const payload = {
                ...data,
                signature_request: data.signature_request || signatureRequestId || '',
            }
            const newSigner = await signersApi.create(payload as CreateSignerDto & { signature_request: string })
            setSigners((prev) => [...prev, newSigner])
            toast({
                title: 'Sucesso',
                description: 'Assinante adicionado com sucesso',
            })
            return newSigner
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao adicionar assinante'
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

    const updateSigner = async (id: string, data: Partial<SignatureRequestSigner>) => {
        setLoading(true)
        try {
            const updatedSigner = await signersApi.update(id, data)
            setSigners((prev) =>
                prev.map((signer) => (signer.id === id ? updatedSigner : signer))
            )
            toast({
                title: 'Sucesso',
                description: 'Assinante atualizado com sucesso',
            })
            return updatedSigner
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao atualizar assinante'
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

    const deleteSigner = async (id: string) => {
        setLoading(true)
        try {
            await signersApi.delete(id)
            setSigners((prev) => prev.filter((signer) => signer.id !== id))
            toast({
                title: 'Sucesso',
                description: 'Assinante removido com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao remover assinante'
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

    const notifySigner = async (id: string) => {
        setLoading(true)
        try {
            await signersApi.notify(id)
            toast({
                title: 'Sucesso',
                description: 'Notificação enviada com sucesso',
            })
            await fetchSigners() // Refresh
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao enviar notificação'
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

    const signDocument = async (id: string, data: SignDocumentDto) => {
        setLoading(true)
        try {
            await signersApi.sign(id, data)
            toast({
                title: 'Sucesso',
                description: 'Documento assinado com sucesso',
            })
            await fetchSigners() // Refresh
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao assinar documento'
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

    const declineSigner = async (id: string, reason?: string) => {
        setLoading(true)
        try {
            await signersApi.decline(id, reason)
            toast({
                title: 'Sucesso',
                description: 'Assinatura recusada',
            })
            await fetchSigners() // Refresh
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao recusar assinatura'
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
        signers,
        loading,
        error,
        fetchSigners,
        fetchMyAssignments,
        fetchPendingSignatures,
        createSigner,
        updateSigner,
        deleteSigner,
        notifySigner,
        signDocument,
        declineSigner,
    }
}
