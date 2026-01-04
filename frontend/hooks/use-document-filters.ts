import { useState, useEffect } from 'react'
import apiClient from '@/services/api-client'

const BASE_URL = '/api/v1/ordoc-air'

export interface DocumentTypeFilter {
    value: string
    label: string
    count: number
}

export interface FlagFilter {
    id: string
    label: string
    field: string
    value: boolean | string[]
    count: number
}

export interface DocumentFilters {
    type_filters: DocumentTypeFilter[]
    flag_filters: FlagFilter[]
    total_documents: number
    trash_count: number
}

interface UseDocumentFiltersReturn {
    filters: DocumentFilters | null
    loading: boolean
    error: Error | null
    refetch: () => Promise<void>
}

export function useDocumentFilters(): UseDocumentFiltersReturn {
    const [filters, setFilters] = useState<DocumentFilters | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchFilters = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiClient.get<DocumentFilters>(
                `${BASE_URL}/documents/filters/`
            )

            setFilters(response.data)
        } catch (err) {
            setError(err as Error)
            console.error('Error fetching document filters:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFilters()
    }, [])

    return {
        filters,
        loading,
        error,
        refetch: fetchFilters,
    }
}
