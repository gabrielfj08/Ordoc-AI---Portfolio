import { useState, useCallback, useEffect } from 'react'
import {
    documentsApi,
    directoriesApi,
    tagsApi,
    shareableLinksApi,
    type Document,
    type Directory,
    type Tag,
    type ShareableLink,
    type PaginatedResponse,
} from '@/services/documents-api'
import { analysisApi, type AnalysisResult } from '@/services/intelligence-api'
import { useToast } from '@/hooks/use-toast'

// ===========================
// useDocuments - Lista documentos com paginação e filtros
// ===========================

interface UseDocumentsOptions {
    directory?: string
    search?: string
    tags?: string[]
    is_archived?: boolean
    autoFetch?: boolean
}

export function useDocuments(options: UseDocumentsOptions = {}) {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
    })
    const { toast } = useToast()

    const fetchDocuments = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await documentsApi.list({
                directory: options.directory,
                search: options.search,
                tags: options.tags,
                is_archived: options.is_archived,
            })
            setDocuments(response.results)
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
            })
        } catch (err) {
            const error = err as Error
            setError(error)
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar documentos',
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }, [options.directory, options.search, options.tags, options.is_archived, toast])

    useEffect(() => {
        if (options.autoFetch !== false) {
            fetchDocuments()
        }
    }, [fetchDocuments, options.autoFetch])

    return {
        documents,
        loading,
        error,
        pagination,
        refetch: fetchDocuments,
    }
}

// ===========================
// useDocument - Detalhes de um documento
// ===========================

export function useDocument(id: string | null) {
    const [document, setDocument] = useState<Document | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const { toast } = useToast()

    const fetchDocument = useCallback(async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const data = await documentsApi.retrieve(id)
            setDocument(data)
        } catch (err) {
            const error = err as Error
            setError(error)
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar documento',
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }, [id, toast])

    useEffect(() => {
        fetchDocument()
    }, [fetchDocument])

    return {
        document,
        loading,
        error,
        refetch: fetchDocument,
    }
}

// ===========================
// useDocumentUpload - Upload com progresso
// ===========================

export interface UploadProgress {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'completed' | 'error'
    error?: string
    document?: Document
    aiAnalysis?: AnalysisResult
    showSuggestionsModal?: boolean
}

export interface UseDocumentUploadOptions {
    /** Habilitar análise de IA */
    enableAI?: boolean
    /** Mostrar modal de sugestões automaticamente */
    showSuggestionsModal?: boolean
    /** Callback quando análise concluir */
    onAnalysisComplete?: (upload: UploadProgress) => void
}

export function useDocumentUpload() {
    const [uploads, setUploads] = useState<UploadProgress[]>([])
    const { toast } = useToast()

    const uploadFiles = useCallback(
        async (files: File[], directory?: string, options: UseDocumentUploadOptions = {}) => {
            const { enableAI = true, showSuggestionsModal = true, onAnalysisComplete } = options
            // Inicializa uploads
            const initialUploads: UploadProgress[] = files.map(file => ({
                file,
                progress: 0,
                status: 'pending',
            }))
            setUploads(prev => [...prev, ...initialUploads])

            // Processa uploads em paralelo
            const promises = files.map(async (file, index) => {
                const uploadIndex =
                    uploads.length + index
                try {
                    // FASE 1: Upload do arquivo
                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex
                                ? { ...u, status: 'uploading' }
                                : u
                        )
                    )

                    const document = await documentsApi.upload(
                        {
                            file,
                            directory,
                        },
                        progressEvent => {
                            const progress = Math.round(
                                (progressEvent.percentage || 0) * (enableAI ? 0.7 : 1)
                            )
                            setUploads(prev =>
                                prev.map((u, i) =>
                                    i === uploadIndex
                                        ? { ...u, progress }
                                        : u
                                )
                            )
                        }
                    )

                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex
                                ? {
                                      ...u,
                                      status: 'uploaded',
                                      progress: enableAI ? 70 : 100,
                                      document,
                                  }
                                : u
                        )
                    )

                    toast({
                        title: 'Upload concluído',
                        description: `${file.name} enviado com sucesso`,
                    })

                    // FASE 2: Análise com IA (se habilitada)
                    let aiAnalysis: AnalysisResult | undefined

                    if (enableAI && document) {
                        try {
                            setUploads(prev =>
                                prev.map((u, i) =>
                                    i === uploadIndex
                                        ? { ...u, status: 'analyzing', progress: 75 }
                                        : u
                                )
                            )

                            toast({
                                title: '🤖 Analisando com IA',
                                description: 'Extraindo informações do documento...',
                            })

                            // Chamar IA para análise
                            aiAnalysis = await analysisApi.analyze({
                                document_id: document.id,
                                analysis_types: ['ocr', 'classification', 'extraction'],
                            })

                            setUploads(prev =>
                                prev.map((u, i) =>
                                    i === uploadIndex
                                        ? {
                                              ...u,
                                              progress: 95,
                                              aiAnalysis,
                                          }
                                        : u
                                )
                            )

                            // Mostrar resultado da análise
                            if (aiAnalysis.confidence >= 0.7) {
                                const classification = aiAnalysis.results?.classification
                                const confidencePct = Math.round(aiAnalysis.confidence * 100)
                                
                                if (showSuggestionsModal) {
                                    // Marcar para abrir modal de sugestões
                                    setUploads(prev =>
                                        prev.map((u, i) =>
                                            i === uploadIndex
                                                ? { ...u, showSuggestionsModal: true }
                                                : u
                                        )
                                    )
                                }
                                
                                toast({
                                    title: '✨ Análise concluída',
                                    description: classification
                                        ? `${classification} (${confidencePct}% confiança)`
                                        : 'Documento analisado com sucesso',
                                })
                            }
                        } catch (aiError) {
                            console.error('Erro na análise de IA:', aiError)
                            // Não falhar o upload se a IA falhar
                            toast({
                                title: 'ℹ️ Análise de IA indisponível',
                                description: 'Documento enviado sem análise automática',
                            })
                        }
                    }

                    // FASE 3: Concluído
                    const completedUpload: UploadProgress = {
                        file,
                        status: 'completed',
                        progress: 100,
                        document,
                        aiAnalysis,
                        showSuggestionsModal: showSuggestionsModal && aiAnalysis && aiAnalysis.confidence >= 0.7,
                    }
                    
                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex ? completedUpload : u
                        )
                    )
                    
                    // Callback externo
                    if (onAnalysisComplete && aiAnalysis) {
                        onAnalysisComplete(completedUpload)
                    }

                    return document
                } catch (err) {
                    const error = err as Error
                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex
                                ? {
                                      ...u,
                                      status: 'error',
                                      error: error.message,
                                  }
                                : u
                        )
                    )

                    toast({
                        variant: 'destructive',
                        title: 'Erro no upload',
                        description: `${file.name}: ${error.message}`,
                    })

                    return null
                }
            })

            const results = await Promise.all(promises)
            return results.filter((doc): doc is Document => doc !== null)
        },
        [uploads.length, toast]
    )

    const clearUploads = useCallback(() => {
        setUploads([])
    }, [])

    const removeUpload = useCallback((index: number) => {
        setUploads(prev => prev.filter((_, i) => i !== index))
    }, [])
    
    const hideSuggestionsModal = useCallback((index: number) => {
        setUploads(prev =>
            prev.map((u, i) =>
                i === index ? { ...u, showSuggestionsModal: false } : u
            )
        )
    }, [])

    return {
        uploads,
        uploadFiles,
        clearUploads,
        removeUpload,
        hideSuggestionsModal,
    }
}

// ===========================
// useDocumentActions - Ações de documentos
// ===========================

export function useDocumentActions() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const updateDocument = useCallback(
        async (id: string, data: Partial<Document>) => {
            setLoading(true)
            try {
                const updated = await documentsApi.update(id, data)
                toast({
                    title: 'Documento atualizado',
                    description: 'Alterações salvas com sucesso',
                })
                return updated
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    title: 'Erro ao atualizar',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    const deleteDocument = useCallback(
        async (id: string) => {
            setLoading(true)
            try {
                await documentsApi.delete(id)
                toast({
                    title: 'Documento excluído',
                    description: 'Documento removido com sucesso',
                })
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    title: 'Erro ao excluir',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    const toggleFavorite = useCallback(
        async (id: string, isFavorite: boolean) => {
            setLoading(true)
            try {
                if (isFavorite) {
                    await documentsApi.unfavorite(id)
                    toast({ description: 'Removido dos favoritos' })
                } else {
                    await documentsApi.favorite(id)
                    toast({ description: 'Adicionado aos favoritos' })
                }
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    const toggleArchive = useCallback(
        async (id: string, isArchived: boolean) => {
            setLoading(true)
            try {
                if (isArchived) {
                    await documentsApi.unarchive(id)
                    toast({ description: 'Documento desarquivado' })
                } else {
                    await documentsApi.archive(id)
                    toast({ description: 'Documento arquivado' })
                }
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    const downloadDocument = useCallback(
        async (id: string, filename: string) => {
            setLoading(true)
            try {
                const blob = await documentsApi.download(id)
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
                toast({ description: 'Download iniciado' })
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    title: 'Erro no download',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    return {
        loading,
        updateDocument,
        deleteDocument,
        toggleFavorite,
        toggleArchive,
        downloadDocument,
    }
}

// ===========================
// useDocumentSearch - Busca Solr
// ===========================

export function useDocumentSearch() {
    const [results, setResults] = useState<Document[]>([])
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const search = useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const response = await documentsApi.search(query)
                setResults(response.results)
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    title: 'Erro na busca',
                    description: error.message,
                })
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    return {
        results,
        loading,
        search,
    }
}

// ===========================
// useDirectories - Gerenciamento de pastas
// ===========================

export function useDirectories() {
    const [directories, setDirectories] = useState<Directory[]>([])
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const fetchDirectories = useCallback(async (parentId?: string) => {
        setLoading(true)
        try {
            const response = await directoriesApi.list(parentId ? { parent: parentId } : undefined)
            setDirectories(response.results)
        } catch (err) {
            const error = err as Error
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar pastas',
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const createDirectory = useCallback(
        async (data: { name: string; parent?: string }) => {
            setLoading(true)
            try {
                const directory = await directoriesApi.create(data)
                toast({
                    title: 'Pasta criada',
                    description: `${data.name} criada com sucesso`,
                })
                return directory
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    title: 'Erro ao criar pasta',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast]
    )

    return {
        directories,
        loading,
        fetchDirectories,
        createDirectory,
    }
}

// ===========================
// useTags - Gerenciamento de tags
// ===========================

export function useTags() {
    const [tags, setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const fetchTags = useCallback(async () => {
        setLoading(true)
        try {
            const response = await tagsApi.list()
            setTags(response.results)
        } catch (err) {
            const error = err as Error
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar tags',
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchTags()
    }, [fetchTags])

    const createTag = useCallback(
        async (data: { name: string; color?: string }) => {
            setLoading(true)
            try {
                const tag = await tagsApi.create(data)
                toast({
                    title: 'Tag criada',
                    description: `${data.name} criada com sucesso`,
                })
                await fetchTags()
                return tag
            } catch (err) {
                const error = err as Error
                toast({
                    variant: 'destructive',
                    title: 'Erro ao criar tag',
                    description: error.message,
                })
                throw error
            } finally {
                setLoading(false)
            }
        },
        [toast, fetchTags]
    )

    return {
        tags,
        loading,
        refetch: fetchTags,
        createTag,
    }
}
