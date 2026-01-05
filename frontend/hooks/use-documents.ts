import { useState, useEffect } from 'react'
import { documentsApi, directoriesApi, Document, Directory, PaginatedResponse } from '@/services/documents-api'

interface UseDocumentsOptions {
    directory?: string
    tags?: string[]
    search?: string
    is_favorite?: boolean
    is_favorited?: boolean
    is_archived?: boolean
    is_shared?: boolean
    in_trash?: boolean
    requires_signature?: boolean
    has_deadline?: boolean
    criticality?: string
    status?: string
    file_type?: string
    document_type?: string
    ordering?: string
    page?: number
    autoFetch?: boolean
}

interface UseDocumentsReturn {
    documents: Document[]
    directories: Directory[] // Added directories
    loading: boolean
    error: Error | null
    total: number
    refetch: () => Promise<void>
    nextPage: () => void
    previousPage: () => void
    hasNext: boolean
    hasPrevious: boolean
}

export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsReturn {
    const [documents, setDocuments] = useState<Document[]>([])
    const [directories, setDirectories] = useState<Directory[]>([]) // Added state
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(options.page || 1)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrevious, setHasPrevious] = useState(false)

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            setError(null)

            const [docsResponse, dirsResponse] = await Promise.all([
                documentsApi.list({
                    ...options,
                    page,
                }),
                // Only fetch directories if not searching and not in special filters (like trash/shared)
                // or if explicitly navigating a directory
                // Fetch directories if not searching/filtering (except trash)
                // or if explicitly navigating a directory
                (!options.search && !options.is_shared && !options.is_favorite && !options.is_favorited) || options.in_trash
                    ? directoriesApi.list({
                        parent: options.directory
                    })
                    : Promise.resolve({ results: [], count: 0 })
            ])

            setDocuments(docsResponse.results)
            setDirectories(dirsResponse.results as Directory[]) // Cast needed if listDirectories return is generic
            setTotal(docsResponse.count)
            setHasNext(!!docsResponse.next)
            setHasPrevious(!!docsResponse.previous)
        } catch (err) {
            setError(err as Error)
            console.error('Error fetching documents:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (options.autoFetch !== false) {
            fetchDocuments()
        }
    }, [
        page,
        options.directory,
        options.search,
        options.is_favorite,
        options.is_favorited,
        options.is_archived,
        options.is_shared,
        options.in_trash,
        options.requires_signature,
        options.has_deadline,
        options.criticality,
        options.status,
        options.document_type,
        options.ordering
    ])

    const nextPage = () => {
        if (hasNext) {
            setPage(p => p + 1)
        }
    }

    const previousPage = () => {
        if (hasPrevious && page > 1) {
            setPage(p => p - 1)
        }
    }

    return {
        documents,
        directories,
        loading,
        error,
        total,
        refetch: fetchDocuments,
        nextPage,
        previousPage,
        hasNext,
        hasPrevious,
    }
}
