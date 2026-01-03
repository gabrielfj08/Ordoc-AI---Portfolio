import apiClient from './api-client'

const BASE_URL = '/api/v1/ordoc-air'

export interface Document {
    id: string
    name: string
    description?: string
    file: string
    file_size: number
    file_type: string
    mime_type: string
    directory?: string
    organization: string
    created_by: string
    tags: string[]
    metadata?: Record<string, any>
    ocr_text?: string
    ocr_status?: 'pending' | 'processing' | 'completed' | 'failed'
    is_favorite: boolean
    is_archived: boolean
    version: number
    // Intelligence fields
    document_type?: string
    document_type_display?: string
    contains_sensitive_data?: boolean
    requires_signature?: boolean
    criticality?: 'low' | 'medium' | 'high' | 'critical'
    criticality_display?: string
    // Dynamic filter fields
    has_deadline?: boolean
    deadline_date?: string
    is_from_external_source?: boolean
    external_source_name?: string
    is_public?: boolean
    created_at: string
    updated_at: string
}

export interface Directory {
    id: string
    name: string
    description?: string
    parent?: string
    organization: string
    path: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface Tag {
    id: string
    name: string
    color?: string
    organization: string
    created_at: string
}

export interface ShareableLink {
    id: string
    document: string
    token: string
    password_protected: boolean
    expires_at?: string
    max_downloads?: number
    download_count: number
    is_active: boolean
    created_by: string
    created_at: string
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface UploadProgress {
    loaded: number
    total: number
    percentage: number
}

export interface StorageStats {
    total_used_bytes: number
    limit_bytes: number
    usage_percentage: number
    breakdown: {
        active_documents: {
            bytes: number
            count: number
        }
        trash: {
            bytes: number
            count: number
        }
        temp_files: {
            bytes: number
            count: number
        }
    }
}

// ===========================
// DOCUMENTS API
// ===========================

export const documentsApi = {
    /**
     * Create new directory
     */
    createDirectory: async (data: { name: string, parent?: string, department?: string }) => {
        const response = await apiClient.post<Directory>(
            `${BASE_URL}/directories/`,
            data
        )
        return response.data
    },

    /**
     * List directories
     */
    listDirectories: async (params?: { parent?: string, department?: string }) => {
        const response = await apiClient.get<PaginatedResponse<Directory>>(
            `${BASE_URL}/directories/`,
            { params }
        )
        return response.data
    },

    /**
     * Get storage usage statistics
     */
    getStorageStats: async () => {
        const response = await apiClient.get<StorageStats>(
            `${BASE_URL}/documents/storage_stats/`
        )
        return response.data
    },

    /**
     * Lista documentos com filtros
     */
    list: async (params?: {
        directory?: string
        tags?: string[]
        search?: string
        is_favorite?: boolean
        is_favorited?: boolean // Alias for backend filter
        is_archived?: boolean
        is_shared?: boolean
        in_trash?: boolean
        requires_signature?: boolean
        has_deadline?: boolean
        criticality?: string
        status?: string
        file_type?: string
        ordering?: string
        page?: number
    }) => {
        const response = await apiClient.get<PaginatedResponse<Document>>(
            `${BASE_URL}/documents/`,
            { params }
        )
        return response.data
    },

    createBlankDocument: async (name: string = "Novo Documento.txt") => {
        const char = " ";
        const blob = new Blob([char], { type: "text/plain" })
        const file = new File([blob], name, { type: "text/plain" })

        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post<Document>(
            `${BASE_URL}/documents/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
        return response.data
    },

    /**
     * Busca documento por ID
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<Document>(
            `${BASE_URL}/documents/${id}/`
        )
        return response.data
    },

    /**
     * Upload de novo documento
     */
    upload: async (
        data: {
            file: File
            name?: string
            description?: string
            directory?: string
            tags?: string[]
        },
        onProgress?: (progress: UploadProgress) => void
    ) => {
        const formData = new FormData()
        formData.append('file', data.file)
        if (data.name) formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        if (data.directory) formData.append('directory', data.directory)
        if (data.tags) {
            data.tags.forEach(tag => formData.append('tags', tag))
        }

        const response = await apiClient.post<Document>(
            `${BASE_URL}/documents/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        onProgress({
                            loaded: progressEvent.loaded,
                            total: progressEvent.total,
                            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        })
                    }
                }
            }
        )
        return response.data
    },

    /**
     * Atualiza documento
     */
    update: async (id: string, data: Partial<Document>) => {
        const response = await apiClient.patch<Document>(
            `${BASE_URL}/documents/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove documento
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/documents/${id}/`)
    },

    /**
     * Download de documento
     */
    download: async (id: string) => {
        const response = await apiClient.get(
            `${BASE_URL}/documents/${id}/download/`,
            { responseType: 'blob' }
        )
        return response.data
    },

    /**
     * Marca documento como favorito
     */
    favorite: async (id: string) => {
        const response = await apiClient.post<Document>(
            `${BASE_URL}/documents/${id}/favorite/`
        )
        return response.data
    },

    /**
     * Remove marcação de favorito
     */
    unfavorite: async (id: string) => {
        const response = await apiClient.post<Document>(
            `${BASE_URL}/documents/${id}/unfavorite/`
        )
        return response.data
    },

    /**
     * Arquiva documento
     */
    archive: async (id: string) => {
        const response = await apiClient.post<Document>(
            `${BASE_URL}/documents/${id}/archive/`
        )
        return response.data
    },

    /**
     * Desarquiva documento
     */
    unarchive: async (id: string) => {
        const response = await apiClient.post<Document>(
            `${BASE_URL}/documents/${id}/unarchive/`
        )
        return response.data
    },

    /**
     * Lista documentos recentes
     */
    recent: async (limit: number = 10) => {
        const response = await apiClient.get<Document[]>(
            `${BASE_URL}/recent-documents/`,
            { params: { limit } }
        )
        return response.data
    },

    /**
     * Busca avançada (Solr)
     */
    search: async (query: string, filters?: {
        file_type?: string
        tags?: string[]
        date_from?: string
        date_to?: string
    }) => {
        const response = await apiClient.post<PaginatedResponse<Document>>(
            `${BASE_URL}/advanced/search/`,
            { query, ...filters }
        )
        return response.data
    },

    /**
     * Processa OCR em documento
     */
    processOCR: async (id: string) => {
        const response = await apiClient.post<{ task_id: string }>(
            `${BASE_URL}/advanced/ocr/`,
            { document_id: id }
        )
        return response.data
    },

    /**
     * Exporta múltiplos documentos
     */
    bulkExport: async (documentIds: string[], format: 'zip' | 'pdf' = 'zip') => {
        const response = await apiClient.post(
            `${BASE_URL}/advanced/batch-export/`,
            { document_ids: documentIds, format },
            { responseType: 'blob' }
        )
        return response.data
    },
}

// ===========================
// DIRECTORIES API
// ===========================

export const directoriesApi = {
    /**
     * Lista diretórios
     */
    list: async (params?: { parent?: string; search?: string }) => {
        const response = await apiClient.get<PaginatedResponse<Directory>>(
            `${BASE_URL}/directories/`,
            { params }
        )
        return response.data
    },

    /**
     * Cria diretório
     */
    create: async (data: {
        name: string
        description?: string
        parent?: string
    }) => {
        const response = await apiClient.post<Directory>(
            `${BASE_URL}/directories/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza diretório
     */
    update: async (id: string, data: Partial<Directory>) => {
        const response = await apiClient.patch<Directory>(
            `${BASE_URL}/directories/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove diretório
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/directories/${id}/`)
    },

    /**
     * Move diretório
     */
    move: async (id: string, newParent: string | null) => {
        const response = await apiClient.post<Directory>(
            `${BASE_URL}/directories/${id}/move/`,
            { parent: newParent }
        )
        return response.data
    },
}

// ===========================
// TAGS API
// ===========================

export const tagsApi = {
    /**
     * Lista tags
     */
    list: async () => {
        const response = await apiClient.get<PaginatedResponse<Tag>>(
            `${BASE_URL}/tags/`
        )
        return response.data
    },

    /**
     * Cria tag
     */
    create: async (data: { name: string; color?: string }) => {
        const response = await apiClient.post<Tag>(
            `${BASE_URL}/tags/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza tag
     */
    update: async (id: string, data: Partial<Tag>) => {
        const response = await apiClient.patch<Tag>(
            `${BASE_URL}/tags/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove tag
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/tags/${id}/`)
    },
}

// ===========================
// SHAREABLE LINKS API
// ===========================

export const shareableLinksApi = {
    /**
     * Cria link compartilhável
     */
    create: async (data: {
        document: string
        password?: string
        expires_at?: string
        max_downloads?: number
    }) => {
        const response = await apiClient.post<ShareableLink>(
            `${BASE_URL}/shareable-links/`,
            data
        )
        return response.data
    },

    /**
     * Lista links de um documento
     */
    list: async (documentId: string) => {
        const response = await apiClient.get<PaginatedResponse<ShareableLink>>(
            `${BASE_URL}/shareable-links/`,
            { params: { document: documentId } }
        )
        return response.data
    },

    /**
     * Revoga link
     */
    revoke: async (id: string) => {
        const response = await apiClient.post<ShareableLink>(
            `${BASE_URL}/shareable-links/${id}/revoke/`
        )
        return response.data
    },

    /**
     * Acessa documento via link público
     */
    access: async (token: string, password?: string) => {
        const response = await apiClient.post(
            `${BASE_URL}/shareable-links/${token}/access/`,
            { password }
        )
        return response.data
    },
}
