"use client"

import { useState, useEffect, useCallback } from 'react'
import { certificatesApi } from '../api'
import type { DigitalCertificate } from '../types'
import { useToast } from '@/hooks/use-toast'

export function useCertificates() {
    const [certificates, setCertificates] = useState<DigitalCertificate[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchCertificates = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await certificatesApi.myCertificates()
            setCertificates(data.results)
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar certificados'
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

    const uploadCertificate = async (
        file: File,
        password?: string,
        certificateType?: string,
        isDefault?: boolean
    ) => {
        setLoading(true)
        setError(null)
        try {
            const newCertificate = await certificatesApi.upload(file, password, certificateType, isDefault)
            setCertificates((prev) => [newCertificate, ...prev])
            toast({
                title: 'Sucesso',
                description: 'Certificado adicionado com sucesso',
            })
            return newCertificate
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao fazer upload do certificado'
            setError(errorMessage)
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

    const setDefaultCertificate = async (id: string) => {
        setLoading(true)
        try {
            const updatedCertificate = await certificatesApi.setDefault(id)
            setCertificates((prev) =>
                prev.map((cert) => ({
                    ...cert,
                    is_default: cert.id === id,
                }))
            )
            toast({
                title: 'Sucesso',
                description: 'Certificado padrão atualizado',
            })
            return updatedCertificate
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao definir certificado padrão'
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

    const deleteCertificate = async (id: string) => {
        setLoading(true)
        try {
            await certificatesApi.delete(id)
            setCertificates((prev) => prev.filter((cert) => cert.id !== id))
            toast({
                title: 'Sucesso',
                description: 'Certificado removido com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao remover certificado'
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

    const verifyCertificate = async (id: string) => {
        setLoading(true)
        try {
            const result = await certificatesApi.verify(id)
            toast({
                title: result.valid ? 'Certificado Válido' : 'Certificado Inválido',
                description: result.message,
                variant: result.valid ? 'default' : 'destructive',
            })
            return result
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao verificar certificado'
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
        fetchCertificates()
    }, [fetchCertificates])

    return {
        certificates,
        loading,
        error,
        fetchCertificates,
        uploadCertificate,
        setDefaultCertificate,
        deleteCertificate,
        verifyCertificate,
    }
}
