import apiClient from './api-client'

const BASE_URL = '/api/v1/ordoc-reports'

export interface ReportTemplate {
    id: string
    name: string
    description?: string
    template_type: string
    config: Record<string, any>
    is_active: boolean
    created_by: string
    created_at: string
}

export interface Report {
    id: string
    template: string
    name: string
    parameters: Record<string, any>
    status: 'pending' | 'generating' | 'completed' | 'failed'
    file?: string
    generated_by: string
    generated_at: string
    expires_at?: string
}

export interface ReportSchedule {
    id: string
    template: string
    name: string
    frequency: 'daily' | 'weekly' | 'monthly'
    parameters: Record<string, any>
    is_active: boolean
    next_run: string
    created_at: string
}

export interface Analytics {
    total_documents: number
    total_procedures: number
    total_signatures: number
    documents_by_type: Record<string, number>
    procedures_by_status: Record<string, number>
    activity_timeline: Array<{
        date: string
        count: number
    }>
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ===========================
// TEMPLATES API
// ===========================

export const templatesApi = {
    /**
     * Lista templates
     */
    list: async (params?: { is_active?: boolean; template_type?: string }) => {
        const response = await apiClient.get<PaginatedResponse<ReportTemplate>>(
            `${BASE_URL}/templates/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém template
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<ReportTemplate>(
            `${BASE_URL}/templates/${id}/`
        )
        return response.data
    },

    /**
     * Cria template
     */
    create: async (data: Partial<ReportTemplate>) => {
        const response = await apiClient.post<ReportTemplate>(
            `${BASE_URL}/templates/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza template
     */
    update: async (id: string, data: Partial<ReportTemplate>) => {
        const response = await apiClient.patch<ReportTemplate>(
            `${BASE_URL}/templates/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove template
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/templates/${id}/`)
    },
}

// ===========================
// REPORTS API
// ===========================

export const reportsApi = {
    /**
     * Lista relatórios
     */
    list: async (params?: { template?: string; status?: string }) => {
        const response = await apiClient.get<PaginatedResponse<Report>>(
            `${BASE_URL}/reports/`,
            { params }
        )
        return response.data
    },

    /**
     * Gera novo relatório
     */
    generate: async (data: {
        template: string
        name?: string
        parameters?: Record<string, any>
    }) => {
        const response = await apiClient.post<Report>(
            `${BASE_URL}/reports/`,
            data
        )
        return response.data
    },

    /**
     * Obtém relatório
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<Report>(
            `${BASE_URL}/reports/${id}/`
        )
        return response.data
    },

    /**
     * Download de relatório
     */
    download: async (id: string) => {
        const response = await apiClient.get(
            `${BASE_URL}/reports/${id}/download/`,
            { responseType: 'blob' }
        )
        return response.data
    },

    /**
     * Remove relatório
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/reports/${id}/`)
    },
}

// ===========================
// SCHEDULES API
// ===========================

export const schedulesApi = {
    /**
     * Lista agendamentos
     */
    list: async (params?: { is_active?: boolean }) => {
        const response = await apiClient.get<PaginatedResponse<ReportSchedule>>(
            `${BASE_URL}/schedules/`,
            { params }
        )
        return response.data
    },

    /**
     * Cria agendamento
     */
    create: async (data: Partial<ReportSchedule>) => {
        const response = await apiClient.post<ReportSchedule>(
            `${BASE_URL}/schedules/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza agendamento
     */
    update: async (id: string, data: Partial<ReportSchedule>) => {
        const response = await apiClient.patch<ReportSchedule>(
            `${BASE_URL}/schedules/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove agendamento
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/schedules/${id}/`)
    },

    /**
     * Ativa/desativa agendamento
     */
    toggle: async (id: string) => {
        const response = await apiClient.post<ReportSchedule>(
            `${BASE_URL}/schedules/${id}/toggle/`
        )
        return response.data
    },
}

// ===========================
// ANALYTICS API
// ===========================

export const analyticsApi = {
    /**
     * Obtém analytics gerais
     */
    overview: async (params?: {
        date_from?: string
        date_to?: string
    }) => {
        const response = await apiClient.get<Analytics>(
            `${BASE_URL}/analytics/overview/`,
            { params }
        )
        return response.data
    },

    /**
     * Métricas de documentos
     */
    documents: async (params?: {
        date_from?: string
        date_to?: string
    }) => {
        const response = await apiClient.get(
            `${BASE_URL}/analytics/documents/`,
            { params }
        )
        return response.data
    },

    /**
     * Métricas de processos
     */
    processes: async (params?: {
        date_from?: string
        date_to?: string
    }) => {
        const response = await apiClient.get(
            `${BASE_URL}/analytics/processes/`,
            { params }
        )
        return response.data
    },
}
