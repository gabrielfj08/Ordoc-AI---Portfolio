import apiClient from './api';

// Integration Service
export interface IntegrationService {
    id: string;
    name: string;
    description?: string;
    service_type: 'gov_br' | 'receita_federal' | 'serasa' | 'serpro' | 'custom';
    base_url: string;
    status: 'active' | 'inactive' | 'maintenance';
    authentication_config: any; // JSON field
    request_config?: any; // JSON field
    retry_config?: any; // JSON field
    rate_limit_config?: any; // JSON field
    organization?: string;
    is_public: boolean;
    created_by: string;
    created_by_name?: string;
    created_at: string;
    updated_at: string;
}

// Integration Request
export interface IntegrationRequest {
    id: string;
    service: string;
    service_name?: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    request_data?: any; // JSON field
    response_data?: any; // JSON field
    status: 'pending' | 'processing' | 'success' | 'failed' | 'timeout';
    status_code?: number;
    error_message?: string;
    retry_count: number;
    max_retries: number;
    duration_ms?: number;
    user: string;
    user_name?: string;
    organization: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

// Integration Cache
export interface IntegrationCache {
    id: string;
    service: string;
    service_name?: string;
    cache_key: string;
    cache_data: any; // JSON field
    ttl_seconds: number;
    expires_at: string;
    hit_count: number;
    organization: string;
    created_at: string;
    updated_at: string;
    last_accessed_at?: string;
}

// Integration Execute Request
export interface IntegrationExecuteRequest {
    service_id?: string;
    service_type?: string;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: any;
    params?: any;
    headers?: Record<string, string>;
    use_cache?: boolean;
    cache_ttl?: number;
}

// Integration Execute Response
export interface IntegrationExecuteResponse {
    success: boolean;
    data?: any;
    error?: string;
    status_code?: number;
    cached?: boolean;
    request_id?: string;
    duration_ms?: number;
}

// Gov.br Auth
export interface GovBrAuthConfig {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    authorization_url: string;
    token_url: string;
    scope: string[];
}

export interface GovBrAuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

export interface GovBrUserInfo {
    sub: string;
    name: string;
    email?: string;
    phone_number?: string;
    cpf?: string;
}

// Validation Requests
export interface CPFValidationRequest {
    cpf: string;
    name?: string;
    birth_date?: string;
}

export interface CPFValidationResponse {
    valid: boolean;
    cpf: string;
    formatted_cpf: string;
    name_match?: boolean;
    birth_date_match?: boolean;
    status?: string;
    details?: any;
}

export interface CNPJValidationRequest {
    cnpj: string;
    company_name?: string;
}

export interface CNPJValidationResponse {
    valid: boolean;
    cnpj: string;
    formatted_cnpj: string;
    company_name?: string;
    trade_name?: string;
    status?: string;
    registration_date?: string;
    legal_nature?: string;
    address?: any;
    activities?: any[];
    details?: any;
}

export interface CreditCheckRequest {
    document: string; // CPF or CNPJ
    document_type: 'cpf' | 'cnpj';
}

export interface CreditCheckResponse {
    score?: number;
    risk_level?: 'low' | 'medium' | 'high';
    restrictions?: boolean;
    restrictions_details?: any[];
    last_updated?: string;
    details?: any;
}

class IntegrationService_Class {
    // ==================== INTEGRATION SERVICES ====================

    /**
     * Listar serviços de integração
     */
    async listServices(filters?: {
        service_type?: string;
        status?: string;
        is_public?: boolean;
        search?: string;
    }): Promise<IntegrationService[]> {
        const response = await apiClient.get<any>('/integrations/services/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter serviço de integração
     */
    async getService(id: string): Promise<IntegrationService> {
        const response = await apiClient.get<IntegrationService>(`/integrations/services/${id}/`);
        return response.data;
    }

    /**
     * Criar serviço de integração (admin only)
     */
    async createService(data: Partial<IntegrationService>): Promise<IntegrationService> {
        const response = await apiClient.post<IntegrationService>('/integrations/services/', data);
        return response.data;
    }

    /**
     * Atualizar serviço de integração (admin only)
     */
    async updateService(id: string, data: Partial<IntegrationService>): Promise<IntegrationService> {
        const response = await apiClient.patch<IntegrationService>(`/integrations/services/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar serviço de integração (admin only)
     */
    async deleteService(id: string): Promise<void> {
        await apiClient.delete(`/integrations/services/${id}/`);
    }

    /**
     * Obter estatísticas do serviço
     */
    async getServiceStats(id: string): Promise<any> {
        const response = await apiClient.get(`/integrations/services/${id}/stats/`);
        return response.data;
    }

    /**
     * Ativar/Desativar serviço
     */
    async toggleServiceStatus(id: string): Promise<IntegrationService> {
        const response = await apiClient.post<IntegrationService>(`/integrations/services/${id}/toggle_status/`);
        return response.data;
    }

    // ==================== INTEGRATION REQUESTS ====================

    /**
     * Listar requisições de integração
     */
    async listRequests(filters?: {
        service?: string;
        status?: string;
        user?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<IntegrationRequest[]> {
        const response = await apiClient.get<any>('/integrations/requests/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter requisição de integração
     */
    async getRequest(id: string): Promise<IntegrationRequest> {
        const response = await apiClient.get<IntegrationRequest>(`/integrations/requests/${id}/`);
        return response.data;
    }

    /**
     * Minhas requisições
     */
    async getMyRequests(filters?: {
        status?: string;
        service?: string;
    }): Promise<IntegrationRequest[]> {
        const response = await apiClient.get<any>('/integrations/requests/my_requests/', {
            params: filters
        });
        return response.data;
    }

    /**
     * Requisições recentes (últimas 24h)
     */
    async getRecentRequests(): Promise<IntegrationRequest[]> {
        const response = await apiClient.get<any>('/integrations/requests/recent/');
        return response.data;
    }

    /**
     * Requisições que falharam
     */
    async getFailedRequests(): Promise<IntegrationRequest[]> {
        const response = await apiClient.get<any>('/integrations/requests/failed/');
        return response.data;
    }

    // ==================== INTEGRATION CACHE ====================

    /**
     * Listar cache de integrações
     */
    async listCache(filters?: {
        service?: string;
        search?: string;
    }): Promise<IntegrationCache[]> {
        const response = await apiClient.get<any>('/integrations/cache/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter cache específico
     */
    async getCache(id: string): Promise<IntegrationCache> {
        const response = await apiClient.get<IntegrationCache>(`/integrations/cache/${id}/`);
        return response.data;
    }

    /**
     * Limpar cache expirado
     */
    async clearExpiredCache(): Promise<any> {
        const response = await apiClient.post('/integrations/cache/clear_expired/');
        return response.data;
    }

    /**
     * Invalidar cache específico
     */
    async invalidateCache(cacheKey: string): Promise<any> {
        const response = await apiClient.post('/integrations/cache/invalidate/', {
            cache_key: cacheKey
        });
        return response.data;
    }

    // ==================== INTEGRATION EXECUTE ====================

    /**
     * Executar integração genérica
     */
    async execute(request: IntegrationExecuteRequest): Promise<IntegrationExecuteResponse> {
        const response = await apiClient.post<IntegrationExecuteResponse>(
            '/integrations/execute/execute/',
            request
        );
        return response.data;
    }

    /**
     * Validar CPF
     */
    async validateCPF(request: CPFValidationRequest): Promise<CPFValidationResponse> {
        const response = await apiClient.post<CPFValidationResponse>(
            '/integrations/execute/validate-cpf/',
            request
        );
        return response.data;
    }

    /**
     * Validar CNPJ
     */
    async validateCNPJ(request: CNPJValidationRequest): Promise<CNPJValidationResponse> {
        const response = await apiClient.post<CNPJValidationResponse>(
            '/integrations/execute/validate-cnpj/',
            request
        );
        return response.data;
    }

    /**
     * Consultar crédito
     */
    async checkCredit(request: CreditCheckRequest): Promise<CreditCheckResponse> {
        const response = await apiClient.post<CreditCheckResponse>(
            '/integrations/execute/check-credit/',
            request
        );
        return response.data;
    }

    // ==================== GOV.BR AUTH ====================

    /**
     * Obter configuração de autenticação Gov.br
     */
    async getGovBrConfig(): Promise<GovBrAuthConfig> {
        const response = await apiClient.get<GovBrAuthConfig>('/integrations/auth/govbr/config/');
        return response.data;
    }

    /**
     * Iniciar fluxo de login Gov.br
     * Retorna a URL de autorização para redirecionamento
     */
    async initiateGovBrLogin(redirectUri?: string): Promise<{ authorization_url: string }> {
        const response = await apiClient.get('/integrations/auth/govbr/login/', {
            params: redirectUri ? { redirect_uri: redirectUri } : {}
        });
        return response.data;
    }

    /**
     * Callback do login Gov.br (processar código de autorização)
     * Normalmente chamado automaticamente pelo backend após redirect
     */
    async handleGovBrCallback(code: string, state?: string): Promise<{
        access_token: string;
        user_info: GovBrUserInfo;
    }> {
        const response = await apiClient.get('/integrations/auth/govbr/callback/', {
            params: { code, state }
        });
        return response.data;
    }

    /**
     * Obter informações do usuário Gov.br
     */
    async getGovBrUserInfo(accessToken: string): Promise<GovBrUserInfo> {
        const response = await apiClient.get('/integrations/auth/govbr/userinfo/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    }

    /**
     * Renovar token Gov.br
     */
    async refreshGovBrToken(refreshToken: string): Promise<GovBrAuthToken> {
        const response = await apiClient.post<GovBrAuthToken>('/integrations/auth/govbr/refresh/', {
            refresh_token: refreshToken
        });
        return response.data;
    }

    /**
     * Revogar token Gov.br
     */
    async revokeGovBrToken(token: string): Promise<void> {
        await apiClient.post('/integrations/auth/govbr/revoke/', {
            token
        });
    }
}

export const integrationService = new IntegrationService_Class();
export default integrationService;
