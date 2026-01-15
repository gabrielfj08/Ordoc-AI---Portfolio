import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import integrationService, {
    IntegrationService,
    IntegrationRequest,
    IntegrationCache,
    IntegrationExecuteRequest,
    IntegrationExecuteResponse,
    CPFValidationRequest,
    CPFValidationResponse,
    CNPJValidationRequest,
    CNPJValidationResponse,
    CreditCheckRequest,
    CreditCheckResponse,
} from '@/services/integrations';

// Query Keys Factory
export const integrationKeys = {
    all: ['integrations'] as const,

    // Services
    services: () => [...integrationKeys.all, 'services'] as const,
    servicesList: (filters?: any) => [...integrationKeys.services(), 'list', filters] as const,
    service: (id: string) => [...integrationKeys.services(), 'detail', id] as const,
    serviceStats: (id: string) => [...integrationKeys.service(id), 'stats'] as const,

    // Requests
    requests: () => [...integrationKeys.all, 'requests'] as const,
    requestsList: (filters?: any) => [...integrationKeys.requests(), 'list', filters] as const,
    request: (id: string) => [...integrationKeys.requests(), 'detail', id] as const,
    myRequests: (filters?: any) => [...integrationKeys.requests(), 'my-requests', filters] as const,
    recentRequests: () => [...integrationKeys.requests(), 'recent'] as const,
    failedRequests: () => [...integrationKeys.requests(), 'failed'] as const,

    // Cache
    cache: () => [...integrationKeys.all, 'cache'] as const,
    cacheList: (filters?: any) => [...integrationKeys.cache(), 'list', filters] as const,
    cacheItem: (id: string) => [...integrationKeys.cache(), 'detail', id] as const,

    // GovBr Auth
    govbr: () => [...integrationKeys.all, 'govbr'] as const,
    govbrConfig: () => [...integrationKeys.govbr(), 'config'] as const,
};

// ==================== INTEGRATION SERVICES - QUERIES ====================

export function useIntegrationServices(filters?: any, options?: Omit<UseQueryOptions<IntegrationService[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.servicesList(filters),
        queryFn: () => integrationService.listServices(filters),
        ...options,
    });
}

export function useIntegrationService(id: string, options?: Omit<UseQueryOptions<IntegrationService>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.service(id),
        queryFn: () => integrationService.getService(id),
        enabled: !!id,
        ...options,
    });
}

export function useIntegrationServiceStats(id: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.serviceStats(id),
        queryFn: () => integrationService.getServiceStats(id),
        enabled: !!id,
        ...options,
    });
}

// ==================== INTEGRATION SERVICES - MUTATIONS ====================

export function useCreateIntegrationService(options?: UseMutationOptions<IntegrationService, Error, Partial<IntegrationService>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => integrationService.createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.services() });
            toast.success('Serviço de integração criado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar serviço');
        },
        ...options,
    });
}

export function useUpdateIntegrationService(options?: UseMutationOptions<IntegrationService, Error, { id: string; data: Partial<IntegrationService> }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => integrationService.updateService(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.service(variables.id) });
            queryClient.invalidateQueries({ queryKey: integrationKeys.services() });
            toast.success('Serviço atualizado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar serviço');
        },
        ...options,
    });
}

export function useDeleteIntegrationService(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => integrationService.deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.services() });
            toast.success('Serviço deletado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar serviço');
        },
        ...options,
    });
}

export function useToggleIntegrationServiceStatus(options?: UseMutationOptions<IntegrationService, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => integrationService.toggleServiceStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.service(id) });
            queryClient.invalidateQueries({ queryKey: integrationKeys.services() });
            toast.success('Status do serviço alterado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao alterar status');
        },
        ...options,
    });
}

// ==================== INTEGRATION REQUESTS - QUERIES ====================

export function useIntegrationRequests(filters?: any, options?: Omit<UseQueryOptions<IntegrationRequest[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.requestsList(filters),
        queryFn: () => integrationService.listRequests(filters),
        ...options,
    });
}

export function useIntegrationRequest(id: string, options?: Omit<UseQueryOptions<IntegrationRequest>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.request(id),
        queryFn: () => integrationService.getRequest(id),
        enabled: !!id,
        ...options,
    });
}

export function useMyIntegrationRequests(filters?: any, options?: Omit<UseQueryOptions<IntegrationRequest[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.myRequests(filters),
        queryFn: () => integrationService.getMyRequests(filters),
        ...options,
    });
}

export function useRecentIntegrationRequests(options?: Omit<UseQueryOptions<IntegrationRequest[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.recentRequests(),
        queryFn: () => integrationService.getRecentRequests(),
        refetchInterval: 30000, // Auto-refresh every 30s
        ...options,
    });
}

export function useFailedIntegrationRequests(options?: Omit<UseQueryOptions<IntegrationRequest[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.failedRequests(),
        queryFn: () => integrationService.getFailedRequests(),
        ...options,
    });
}

// ==================== INTEGRATION CACHE - QUERIES ====================

export function useIntegrationCache(filters?: any, options?: Omit<UseQueryOptions<IntegrationCache[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.cacheList(filters),
        queryFn: () => integrationService.listCache(filters),
        ...options,
    });
}

export function useIntegrationCacheItem(id: string, options?: Omit<UseQueryOptions<IntegrationCache>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.cacheItem(id),
        queryFn: () => integrationService.getCache(id),
        enabled: !!id,
        ...options,
    });
}

// ==================== INTEGRATION CACHE - MUTATIONS ====================

export function useClearExpiredCache(options?: UseMutationOptions<any, Error, void>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => integrationService.clearExpiredCache(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.cache() });
            toast.success('Cache expirado limpo com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao limpar cache');
        },
        ...options,
    });
}

export function useInvalidateCache(options?: UseMutationOptions<any, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cacheKey) => integrationService.invalidateCache(cacheKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.cache() });
            toast.success('Cache invalidado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao invalidar cache');
        },
        ...options,
    });
}

// ==================== INTEGRATION EXECUTE - MUTATIONS ====================

export function useExecuteIntegration(options?: UseMutationOptions<IntegrationExecuteResponse, Error, IntegrationExecuteRequest>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request) => integrationService.execute(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.requests() });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao executar integração');
        },
        ...options,
    });
}

export function useValidateCPF(options?: UseMutationOptions<CPFValidationResponse, Error, CPFValidationRequest>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request) => integrationService.validateCPF(request),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.requests() });
            if (result.valid) {
                toast.success('CPF válido');
            } else {
                toast.error('CPF inválido');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao validar CPF');
        },
        ...options,
    });
}

export function useValidateCNPJ(options?: UseMutationOptions<CNPJValidationResponse, Error, CNPJValidationRequest>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request) => integrationService.validateCNPJ(request),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.requests() });
            if (result.valid) {
                toast.success('CNPJ válido');
            } else {
                toast.error('CNPJ inválido');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao validar CNPJ');
        },
        ...options,
    });
}

export function useCheckCredit(options?: UseMutationOptions<CreditCheckResponse, Error, CreditCheckRequest>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request) => integrationService.checkCredit(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: integrationKeys.requests() });
            toast.success('Consulta de crédito realizada');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao consultar crédito');
        },
        ...options,
    });
}

// ==================== GOV.BR AUTH - QUERIES ====================

export function useGovBrConfig(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: integrationKeys.govbrConfig(),
        queryFn: () => integrationService.getGovBrConfig(),
        staleTime: Infinity, // Config rarely changes
        ...options,
    });
}

// ==================== GOV.BR AUTH - MUTATIONS ====================

export function useInitiateGovBrLogin(options?: UseMutationOptions<any, Error, string | undefined>) {
    return useMutation({
        mutationFn: (redirectUri) => integrationService.initiateGovBrLogin(redirectUri),
        onSuccess: (data) => {
            // Redirect to Gov.br authorization URL
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao iniciar login Gov.br');
        },
        ...options,
    });
}

export function useRefreshGovBrToken(options?: UseMutationOptions<any, Error, string>) {
    return useMutation({
        mutationFn: (refreshToken) => integrationService.refreshGovBrToken(refreshToken),
        onSuccess: () => {
            toast.success('Token renovado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao renovar token');
        },
        ...options,
    });
}

export function useRevokeGovBrToken(options?: UseMutationOptions<void, Error, string>) {
    return useMutation({
        mutationFn: (token) => integrationService.revokeGovBrToken(token),
        onSuccess: () => {
            toast.success('Token revogado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao revogar token');
        },
        ...options,
    });
}
