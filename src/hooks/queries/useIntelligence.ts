/**
 * Intelligence Hooks - React Query hooks para Intelligence API
 *
 * Gerencia estado, cache e invalidação para:
 * - Análise de documentos com LLM Council
 * - Alertas proativos
 * - Padrões aprendidos
 * - Feedbacks
 * - Validação de compliance
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import intelligenceService, {
    AnalysisRequest,
    AnalysisResult,
    QuickExtractRequest,
    ExtractionResult,
    ComplianceValidationRequest,
    ComplianceValidationResult,
    DocumentAnalysis,
    ProactiveAlert,
    LearnedPattern,
    KnowledgeFeedback,
    ActivityFeedItem,
    LanguageModelStatus,
    PaginatedResponse,
} from '@/services/intelligence';

// Helper para verificar autenticação
const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
};

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const intelligenceKeys = {
    all: ['intelligence'] as const,

    // Analyses
    analyses: () => [...intelligenceKeys.all, 'analyses'] as const,
    analysesList: (filters?: Record<string, any>) => [...intelligenceKeys.analyses(), 'list', filters] as const,
    analysis: (id: string) => [...intelligenceKeys.analyses(), 'detail', id] as const,

    // Alerts
    alerts: () => [...intelligenceKeys.all, 'alerts'] as const,
    alertsList: (filters?: Record<string, any>) => [...intelligenceKeys.alerts(), 'list', filters] as const,
    alert: (id: string) => [...intelligenceKeys.alerts(), 'detail', id] as const,
    alertCounts: () => [...intelligenceKeys.alerts(), 'counts'] as const,

    // Patterns
    patterns: () => [...intelligenceKeys.all, 'patterns'] as const,
    patternsList: (filters?: Record<string, any>) => [...intelligenceKeys.patterns(), 'list', filters] as const,
    pattern: (id: string) => [...intelligenceKeys.patterns(), 'detail', id] as const,

    // Feedbacks
    feedbacks: () => [...intelligenceKeys.all, 'feedbacks'] as const,
    feedbacksList: (filters?: Record<string, any>) => [...intelligenceKeys.feedbacks(), 'list', filters] as const,

    ranking: (type?: string, params?: Record<string, any>) =>
        [...intelligenceKeys.all, 'ranking', type || 'all', params] as const,

    // Activity Feed
    activityFeed: (filters?: Record<string, any>) => [...intelligenceKeys.all, 'activity', filters] as const,

    // Status
    status: () => [...intelligenceKeys.all, 'status'] as const,
};

// ============================================================================
// ANÁLISE DE DOCUMENTOS - QUERIES
// ============================================================================

/**
 * Hook para obter análise de documento
 */
export function useDocumentAnalysis(
    documentId: string,
    options?: Omit<UseQueryOptions<DocumentAnalysis>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.analysis(documentId),
        queryFn: () => intelligenceService.getAnalysis(documentId),
        enabled: !!documentId,
        ...options,
    });
}

/**
 * Hook para listar análises
 */
export function useAnalysesList(
    filters?: {
        document_type?: string;
        status?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<DocumentAnalysis>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.analysesList(filters),
        queryFn: () => intelligenceService.listAnalyses(filters),
        enabled: isAuthenticated(),
        ...options,
    });
}

// ============================================================================
// ANÁLISE DE DOCUMENTOS - MUTATIONS
// ============================================================================

/**
 * Hook para analisar documento com LLM Council
 */
export function useAnalyzeDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AnalysisRequest) => intelligenceService.analyzeDocument(data),
        onSuccess: (result, variables) => {
            toast.success('Documento analisado com sucesso pela IA');

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.analyses() });
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.analysis(variables.document_id) });

            // Se geraram alertas, invalidar alerts também
            if (result.alerts && result.alerts.length > 0) {
                queryClient.invalidateQueries({ queryKey: intelligenceKeys.alerts() });
                queryClient.invalidateQueries({ queryKey: intelligenceKeys.alertCounts() });
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.error || 'Erro ao analisar documento';
            toast.error(message);
        },
    });
}

/**
 * Hook para extração rápida de entidades
 */
export function useQuickExtract() {
    return useMutation({
        mutationFn: (data: QuickExtractRequest) => intelligenceService.quickExtract(data),
        onSuccess: () => {
            toast.success('Entidades extraídas com sucesso');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.error || 'Erro ao extrair entidades';
            toast.error(message);
        },
    });
}

/**
 * Hook para validar compliance
 */
export function useValidateCompliance() {
    return useMutation({
        mutationFn: (data: ComplianceValidationRequest) => intelligenceService.validateCompliance(data),
        onSuccess: (result) => {
            if (result.is_compliant) {
                toast.success('Documento está em conformidade');
            } else {
                toast.warning(`${result.violations.length} violações de compliance encontradas`);
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.error || 'Erro ao validar compliance';
            toast.error(message);
        },
    });
}

// ============================================================================
// ALERTAS - QUERIES
// ============================================================================

/**
 * Hook para listar alertas
 */
export function useAlertsList(
    filters?: {
        alert_type?: string;
        severity?: string;
        is_read?: boolean;
        is_dismissed?: boolean;
        document_id?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<ProactiveAlert>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.alertsList(filters),
        queryFn: () => intelligenceService.listAlerts(filters),
        enabled: isAuthenticated(),
        ...options,
    });
}

/**
 * Hook para obter alerta específico
 */
export function useAlert(
    id: string,
    options?: Omit<UseQueryOptions<ProactiveAlert>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.alert(id),
        queryFn: () => intelligenceService.getAlert(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook para obter contadores de severidade
 */
export function useAlertSeverityCounts(
    options?: Omit<UseQueryOptions<Record<string, number>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.alertCounts(),
        queryFn: () => intelligenceService.getAlertSeverityCounts(),
        enabled: isAuthenticated(),
        ...options,
    });
}

// ============================================================================
// ALERTAS - MUTATIONS
// ============================================================================

/**
 * Hook para marcar alerta como lido
 */
export function useMarkAlertAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => intelligenceService.markAlertAsRead(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.alerts() });
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.alert(id) });
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.alertCounts() });
        },
    });
}

/**
 * Hook para descartar alerta
 */
export function useDismissAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => intelligenceService.dismissAlert(id),
        onSuccess: (_, id) => {
            toast.success('Alerta descartado');
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.alerts() });
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.alert(id) });
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.alertCounts() });
        },
        onError: () => {
            toast.error('Erro ao descartar alerta');
        },
    });
}

// ============================================================================
// PADRÕES - QUERIES
// ============================================================================

/**
 * Hook para listar padrões aprendidos
 */
export function usePatternsList(
    filters?: {
        pattern_type?: string;
        scope?: 'user' | 'organization' | 'platform';
        is_active?: boolean;
        min_confidence?: number;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<LearnedPattern>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.patternsList(filters),
        queryFn: () => intelligenceService.listPatterns(filters),
        enabled: isAuthenticated(),
        ...options,
    });
}

/**
 * Hook para obter padrão específico
 */
export function usePattern(
    id: string,
    options?: Omit<UseQueryOptions<LearnedPattern>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.pattern(id),
        queryFn: () => intelligenceService.getPattern(id),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// FEEDBACKS - QUERIES & MUTATIONS
// ============================================================================

/**
 * Hook para listar feedbacks
 */
export function useFeedbacksList(
    filters?: {
        feedback_type?: string;
        entity_type?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<KnowledgeFeedback>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.feedbacksList(filters),
        queryFn: () => intelligenceService.listFeedbacks(filters),
        ...options,
    });
}

/**
 * Hook para enviar feedback
 */
export function useSubmitFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            feedback_type: string;
            entity_type: string;
            entity_id: string;
            action: string;
            context?: Record<string, any>;
        }) => intelligenceService.submitFeedback(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.feedbacks() });
            queryClient.invalidateQueries({ queryKey: intelligenceKeys.patterns() });
        },
    });
}

// ============================================================================
// RANKING - QUERIES
// ============================================================================

/**
 * Hook para obter ranking
 */
export function useRanking(
    entityType?: 'document' | 'task' | 'procedure',
    params?: {
        view_mode?: 'personal' | 'team';
        limit?: number;
    },
    options?: Omit<
        UseQueryOptions<Array<{
            entity_type: string;
            entity_id: string;
            score: number;
            personal_score: number;
            department_score: number;
            organization_score: number;
            sector_score: number;
            last_updated: string;
        }>>,
        'queryKey' | 'queryFn'
    >
) {
    return useQuery({
        queryKey: intelligenceKeys.ranking(entityType, params),
        queryFn: () => intelligenceService.getRanking({ entity_type: entityType, ...params }),
        enabled: isAuthenticated(),
        ...options,
    });
}

// ============================================================================
// ACTIVITY FEED - QUERIES
// ============================================================================

/**
 * Hook para obter feed de atividades
 */
export function useActivityFeed(
    filters?: {
        activity_type?: string;
        entity_type?: string;
        limit?: number;
        hours?: number;
    },
    options?: Omit<UseQueryOptions<ActivityFeedItem[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.activityFeed(filters),
        queryFn: () => intelligenceService.getActivityFeed(filters),
        enabled: isAuthenticated(),
        // Refresh automaticamente a cada 30 segundos para feed em tempo real
        refetchInterval: 30000,
        ...options,
    });
}

// ============================================================================
// STATUS - QUERIES
// ============================================================================

/**
 * Hook para verificar status do sistema de IA
 */
export function useIntelligenceStatus(
    options?: Omit<UseQueryOptions<LanguageModelStatus>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: intelligenceKeys.status(),
        queryFn: () => intelligenceService.getStatus(),
        // Refresh a cada 60 segundos
        refetchInterval: 60000,
        ...options,
    });
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Hook composto para análise completa com alertas
 */
export function useDocumentAnalysisComplete(documentId: string) {
    const analysis = useDocumentAnalysis(documentId);
    const alerts = useAlertsList({ document_id: documentId, is_dismissed: false });

    return {
        analysis: analysis.data,
        alerts: alerts.data?.results || [],
        isLoading: analysis.isLoading || alerts.isLoading,
        isError: analysis.isError || alerts.isError,
        error: analysis.error || alerts.error,
    };
}

/**
 * Hook para alertas não lidos
 */
export function useUnreadAlerts() {
    return useAlertsList({ is_read: false, is_dismissed: false });
}

/**
 * Hook para alertas críticos
 */
export function useCriticalAlerts() {
    return useAlertsList({ severity: 'critical', is_dismissed: false });
}
