import apiClient from './api-client'

const BASE_URL = '/api/v1/intelligence'

export interface AnalysisResult {
    id: string
    document: string
    analysis_type: string
    results: Record<string, any>
    confidence: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    created_at: string
    completed_at?: string
}

export interface ExtractedData {
    field: string
    value: any
    confidence: number
    location?: {
        page: number
        coordinates: number[]
    }
}

export interface SuggestedAction {
    action_type: string
    label: string
    description?: string
    auto_applicable: boolean
    payload?: Record<string, any>
}

export interface Alert {
    id: string
    title: string
    message: string
    details?: Record<string, any>
    severity: 'info' | 'warning' | 'error' | 'critical'
    source: string
    is_read: boolean
    suggested_actions?: SuggestedAction[]
    created_at: string
}

export interface Pattern {
    id: string
    name: string
    description?: string
    pattern_type: string
    config: Record<string, any>
    is_active: boolean
    created_at: string
}

export interface Feedback {
    id: string
    analysis: string
    rating: number
    comment?: string
    created_by: string
    created_at: string
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ===========================
// ANALYSIS API
// ===========================

export const analysisApi = {
    /**
     * Analisa documento com IA
     */
    analyze: async (data: {
        document_id?: string
        file?: File
        analysis_types?: string[]
    }) => {
        const formData = new FormData()
        if (data.document_id) formData.append('document_id', data.document_id)
        if (data.file) formData.append('file', data.file)
        if (data.analysis_types) {
            data.analysis_types.forEach(type => formData.append('analysis_types', type))
        }

        const response = await apiClient.post<AnalysisResult>(
            `${BASE_URL}/analyze/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    },

    /**
     * Extração rápida de dados
     */
    quickExtract: async (data: {
        document_id?: string
        file?: File
        fields?: string[]
    }) => {
        const formData = new FormData()
        if (data.document_id) formData.append('document_id', data.document_id)
        if (data.file) formData.append('file', data.file)
        if (data.fields) {
            data.fields.forEach(field => formData.append('fields', field))
        }

        const response = await apiClient.post<{
            extracted_data: ExtractedData[]
        }>(`${BASE_URL}/extract/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    /**
     * Lista análises
     */
    list: async (params?: {
        document?: string
        analysis_type?: string
        status?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<AnalysisResult>>(
            `${BASE_URL}/analyses/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém resultado de análise
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<AnalysisResult>(
            `${BASE_URL}/analyses/${id}/`
        )
        return response.data
    },

    /**
     * Obtém status da IA e privacidade
     */
    getStatus: async () => {
        const response = await apiClient.get<any>(
            `${BASE_URL}/status/`
        )
        return response.data
    },
}

// ===========================
// ALERTS API
// ===========================

export const alertsApi = {
    /**
     * Lista alertas
     */
    list: async (params?: {
        severity?: string
        is_read?: boolean
        source?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<Alert>>(
            `${BASE_URL}/alerts/`,
            { params }
        )
        return response.data
    },

    /**
     * Marca alerta como lido
     */
    markAsRead: async (id: string) => {
        const response = await apiClient.post<Alert>(
            `${BASE_URL}/alerts/${id}/mark_as_read/`
        )
        return response.data
    },

    /**
     * Marca todos como lidos
     */
    markAllAsRead: async () => {
        const response = await apiClient.post(
            `${BASE_URL}/alerts/mark_all_as_read/`
        )
        return response.data
    },
}

// ===========================
// PATTERNS API
// ===========================

export const patternsApi = {
    /**
     * Lista padrões detectados
     */
    list: async (params?: { is_active?: boolean }) => {
        const response = await apiClient.get<PaginatedResponse<Pattern>>(
            `${BASE_URL}/patterns/`,
            { params }
        )
        return response.data
    },

    /**
     * Cria novo padrão
     */
    create: async (data: Partial<Pattern>) => {
        const response = await apiClient.post<Pattern>(
            `${BASE_URL}/patterns/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza padrão
     */
    update: async (id: string, data: Partial<Pattern>) => {
        const response = await apiClient.patch<Pattern>(
            `${BASE_URL}/patterns/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove padrão
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/patterns/${id}/`)
    },
}

// ===========================
// FEEDBACK API
// ===========================

export const feedbackApi = {
    /**
     * Envia feedback sobre análise
     */
    create: async (data: {
        analysis: string
        rating: number
        comment?: string
    }) => {
        const response = await apiClient.post<Feedback>(
            `${BASE_URL}/feedback/`,
            data
        )
        return response.data
    },

    /**
     * Lista feedbacks
     */
    list: async (analysisId?: string) => {
        const response = await apiClient.get<PaginatedResponse<Feedback>>(
            `${BASE_URL}/feedback/`,
            { params: { analysis: analysisId } }
        )
        return response.data
    },
}
