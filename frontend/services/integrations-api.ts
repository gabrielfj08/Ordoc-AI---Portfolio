import apiClient from './api-client'

const BASE_URL = '/api/v1/integrations'

// ===========================
// TYPES & INTERFACES
// ===========================

export interface IntegrationService {
    id: string
    name: string
    description: string
    service_type: 'govbr' | 'receita_federal' | 'tse' | 'ans' | 'serasa' | 'cvm' | 'caged' | 'jucesp' | 'other'
    status: 'active' | 'inactive' | 'maintenance' | 'error'
    is_enabled: boolean
    base_url: string
    credentials: Record<string, any>
    config: Record<string, any>
    created_at: string
    updated_at: string
    created_by?: string
}

export interface IntegrationRequest {
    id: string
    service: string
    service_name?: string
    request_type: string
    request_identifier: string
    request_payload: Record<string, any>
    response_data: Record<string, any>
    status: 'pending' | 'success' | 'failed' | 'cached'
    error_message?: string
    from_cache: boolean
    execution_time_ms?: number
    user?: string
    organization?: string
    created_at: string
    completed_at?: string
}

export interface IntegrationCache {
    id: string
    service: string
    cache_key: string
    cache_data: Record<string, any>
    expires_at: string
    hit_count: number
    created_at: string
    updated_at: string
}

export interface IntegrationStats {
    service: {
        id: string
        name: string
        service_type: string
        status: string
    }
    period: {
        days: number
        since: string
    }
    metrics: {
        total_requests: number
        successful_requests: number
        failed_requests: number
        cached_requests: number
        success_rate: number
        cache_hit_rate: number
        avg_execution_time_ms: number
    }
    requests_by_type: Array<{
        request_type: string
        count: number
    }>
    requests_by_status: Array<{
        status: string
        count: number
    }>
}

export interface ExecuteRequestPayload {
    request_type: string
    identifier: string
    params?: Record<string, any>
}

export interface ExecuteResponse {
    success: boolean
    data: Record<string, any>
    cached: boolean
    execution_time_ms: number
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ===========================
// SERVICES API
// ===========================

export const servicesApi = {
    /**
     * Lista serviços de integração disponíveis
     */
    list: async (params?: {
        service_type?: string
        status?: string
        is_enabled?: boolean
    }) => {
        const response = await apiClient.get<PaginatedResponse<IntegrationService>>(
            `${BASE_URL}/services/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de um serviço
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<IntegrationService>(
            `${BASE_URL}/services/${id}/`
        )
        return response.data
    },

    /**
     * Obtém estatísticas de um serviço
     */
    stats: async (id: string, days: number = 30) => {
        const response = await apiClient.get<IntegrationStats>(
            `${BASE_URL}/services/${id}/stats/`,
            { params: { days } }
        )
        return response.data
    },

    /**
     * Ativa/desativa um serviço
     */
    toggleStatus: async (id: string) => {
        const response = await apiClient.post<{ message: string; is_enabled: boolean }>(
            `${BASE_URL}/services/${id}/toggle_status/`
        )
        return response.data
    },
}

// ===========================
// REQUESTS API
// ===========================

export const requestsApi = {
    /**
     * Lista requisições de integração
     */
    list: async (params?: {
        service?: string
        status?: string
        request_type?: string
        from_cache?: boolean
        organization?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<IntegrationRequest>>(
            `${BASE_URL}/requests/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de uma requisição
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<IntegrationRequest>(
            `${BASE_URL}/requests/${id}/`
        )
        return response.data
    },

    /**
     * Lista requisições do usuário logado
     */
    myRequests: async (params?: { limit?: number }) => {
        const response = await apiClient.get<PaginatedResponse<IntegrationRequest>>(
            `${BASE_URL}/requests/my_requests/`,
            { params }
        )
        return response.data
    },

    /**
     * Lista requisições recentes
     */
    recent: async (params?: { limit?: number }) => {
        const response = await apiClient.get<IntegrationRequest[]>(
            `${BASE_URL}/requests/recent/`,
            { params }
        )
        return response.data
    },

    /**
     * Lista requisições que falharam
     */
    failed: async () => {
        const response = await apiClient.get<IntegrationRequest[]>(
            `${BASE_URL}/requests/failed/`
        )
        return response.data
    },
}

// ===========================
// EXECUTE API
// ===========================

export const executeApi = {
    /**
     * Executa uma integração
     */
    execute: async (serviceType: string, payload: ExecuteRequestPayload) => {
        const response = await apiClient.post<ExecuteResponse>(
            `${BASE_URL}/execute/`,
            {
                service_type: serviceType,
                ...payload
            }
        )
        return response.data
    },
}

// ===========================
// SPECIFIC INTEGRATIONS
// ===========================

/**
 * Receita Federal
 */
export const receitaFederalApi = {
    /**
     * Valida CPF
     */
    validateCPF: async (cpf: string) => {
        return executeApi.execute('receita_federal', {
            request_type: 'cpf_validation',
            identifier: cpf
        })
    },

    /**
     * Valida CNPJ
     */
    validateCNPJ: async (cnpj: string) => {
        return executeApi.execute('receita_federal', {
            request_type: 'cnpj_validation',
            identifier: cnpj
        })
    },

    /**
     * Consulta QSA (Quadro de Sócios e Administradores)
     */
    getQSA: async (cnpj: string) => {
        return executeApi.execute('receita_federal', {
            request_type: 'qsa_query',
            identifier: cnpj
        })
    },
}

/**
 * TSE (Tribunal Superior Eleitoral)
 */
export const tseApi = {
    /**
     * Consulta situação eleitoral
     */
    getElectoralStatus: async (cpf: string) => {
        return executeApi.execute('tse', {
            request_type: 'electoral_status',
            identifier: cpf
        })
    },

    /**
     * Consulta histórico de comparecimento
     */
    getAttendanceHistory: async (cpf: string) => {
        return executeApi.execute('tse', {
            request_type: 'attendance_history',
            identifier: cpf
        })
    },

    /**
     * Consulta dados cadastrais do eleitor
     */
    getVoterData: async (cpf: string) => {
        return executeApi.execute('tse', {
            request_type: 'voter_data',
            identifier: cpf
        })
    },
}

/**
 * ANS (Agência Nacional de Saúde)
 */
export const ansApi = {
    /**
     * Consulta beneficiário
     */
    getBeneficiary: async (cpf: string, params?: { operator_code?: string }) => {
        return executeApi.execute('ans', {
            request_type: 'beneficiary_query',
            identifier: cpf,
            params
        })
    },

    /**
     * Consulta dados de operadora
     */
    getOperator: async (operatorCode: string) => {
        return executeApi.execute('ans', {
            request_type: 'operator_query',
            identifier: operatorCode
        })
    },

    /**
     * Consulta planos de saúde
     */
    getPlans: async (operatorCode: string) => {
        return executeApi.execute('ans', {
            request_type: 'plans_query',
            identifier: operatorCode
        })
    },
}

/**
 * Gov.br OAuth
 */
export const govbrApi = {
    /**
     * Obtém URL de autorização para login Gov.br
     */
    getAuthorizationUrl: async (state: string, nonce: string) => {
        const response = await apiClient.post<{ authorization_url: string }>(
            `${BASE_URL}/govbr/authorization_url/`,
            { state, nonce }
        )
        return response.data
    },

    /**
     * Callback após autenticação (troca code por tokens)
     */
    callback: async (code: string, state: string) => {
        const response = await apiClient.post<{
            access_token: string
            refresh_token: string
            id_token: string
            expires_in: number
        }>(
            `${BASE_URL}/govbr/callback/`,
            { code, state }
        )
        return response.data
    },

    /**
     * Obtém dados do usuário autenticado
     */
    getUserInfo: async (accessToken: string) => {
        const response = await apiClient.get(
            `${BASE_URL}/govbr/userinfo/`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
        return response.data
    },
}

// ===========================
// CACHE API
// ===========================

export const cacheApi = {
    /**
     * Lista cache de integrações
     */
    list: async (params?: { service?: string }) => {
        const response = await apiClient.get<PaginatedResponse<IntegrationCache>>(
            `${BASE_URL}/cache/`,
            { params }
        )
        return response.data
    },

    /**
     * Limpa cache de um serviço
     */
    clear: async (serviceId: string) => {
        const response = await apiClient.post<{ message: string }>(
            `${BASE_URL}/cache/clear/`,
            { service_id: serviceId }
        )
        return response.data
    },

    /**
     * Obtém estatísticas de cache
     */
    stats: async () => {
        const response = await apiClient.get<{
            total_entries: number
            total_hits: number
            cache_size_mb: number
        }>(
            `${BASE_URL}/cache/stats/`
        )
        return response.data
    },
}

// ===========================
// EXPORTS
// ===========================

export default {
    services: servicesApi,
    requests: requestsApi,
    execute: executeApi,
    receitaFederal: receitaFederalApi,
    tse: tseApi,
    ans: ansApi,
    govbr: govbrApi,
    cache: cacheApi,
}
