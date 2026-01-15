import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import reportService, {
    ReportTemplate,
    Report,
    ReportSchedule,
    ReportShare,
    ReportMetric,
    AnalyticsSummary,
    ReportGenerationRequest,
} from '@/services/reports';

// Query Keys Factory
export const reportKeys = {
    all: ['reports'] as const,

    // Templates
    templates: () => [...reportKeys.all, 'templates'] as const,
    templatesList: (filters?: any) => [...reportKeys.templates(), 'list', filters] as const,
    template: (id: string) => [...reportKeys.templates(), 'detail', id] as const,
    templatePreview: (id: string, filters?: any) => [...reportKeys.template(id), 'preview', filters] as const,
    categories: () => [...reportKeys.templates(), 'categories'] as const,
    types: () => [...reportKeys.templates(), 'types'] as const,

    // Reports
    reports: () => [...reportKeys.all, 'reports'] as const,
    reportsList: (filters?: any) => [...reportKeys.reports(), 'list', filters] as const,
    report: (id: string) => [...reportKeys.reports(), 'detail', id] as const,

    // Schedules
    schedules: () => [...reportKeys.all, 'schedules'] as const,
    schedulesList: (filters?: any) => [...reportKeys.schedules(), 'list', filters] as const,
    schedule: (id: string) => [...reportKeys.schedules(), 'detail', id] as const,

    // Shares
    shares: () => [...reportKeys.all, 'shares'] as const,
    sharesList: (filters?: any) => [...reportKeys.shares(), 'list', filters] as const,
    share: (id: string) => [...reportKeys.shares(), 'detail', id] as const,

    // Metrics
    metrics: () => [...reportKeys.all, 'metrics'] as const,
    metricsList: (filters?: any) => [...reportKeys.metrics(), 'list', filters] as const,
    metric: (id: string) => [...reportKeys.metrics(), 'detail', id] as const,

    // Analytics
    analytics: () => [...reportKeys.all, 'analytics'] as const,
    analyticsSummary: (filters?: any) => [...reportKeys.analytics(), 'summary', filters] as const,
    analyticsDashboard: () => [...reportKeys.analytics(), 'dashboard'] as const,
    metricsByPeriod: (filters?: any) => [...reportKeys.analytics(), 'metrics-by-period', filters] as const,
    trendingStats: (filters?: any) => [...reportKeys.analytics(), 'trending', filters] as const,
};

// ==================== TEMPLATES - QUERIES ====================

export function useReportTemplates(filters?: any, options?: Omit<UseQueryOptions<ReportTemplate[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.templatesList(filters),
        queryFn: () => reportService.listTemplates(filters),
        ...options,
    });
}

export function useReportTemplate(id: string, options?: Omit<UseQueryOptions<ReportTemplate>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.template(id),
        queryFn: () => reportService.getTemplate(id),
        enabled: !!id,
        ...options,
    });
}

export function useTemplatePreview(id: string, filters?: any, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.templatePreview(id, filters),
        queryFn: () => reportService.previewTemplate(id, filters),
        enabled: !!id,
        ...options,
    });
}

export function useReportCategories(options?: Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.categories(),
        queryFn: () => reportService.getCategories(),
        staleTime: Infinity, // Categories rarely change
        ...options,
    });
}

export function useReportTypes(options?: Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.types(),
        queryFn: () => reportService.getTypes(),
        staleTime: Infinity, // Types rarely change
        ...options,
    });
}

// ==================== TEMPLATES - MUTATIONS ====================

export function useCreateReportTemplate(options?: UseMutationOptions<ReportTemplate, Error, Partial<ReportTemplate>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => reportService.createTemplate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.templates() });
            toast.success('Template criado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar template');
        },
        ...options,
    });
}

export function useUpdateReportTemplate(options?: UseMutationOptions<ReportTemplate, Error, { id: string; data: Partial<ReportTemplate> }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => reportService.updateTemplate(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.template(variables.id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.templates() });
            toast.success('Template atualizado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar template');
        },
        ...options,
    });
}

export function useDeleteReportTemplate(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.deleteTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.templates() });
            toast.success('Template deletado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar template');
        },
        ...options,
    });
}

export function useActivateReportTemplate(options?: UseMutationOptions<ReportTemplate, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.activateTemplate(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.template(id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.templates() });
            toast.success('Template ativado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao ativar template');
        },
        ...options,
    });
}

export function useDeactivateReportTemplate(options?: UseMutationOptions<ReportTemplate, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.deactivateTemplate(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.template(id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.templates() });
            toast.success('Template desativado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao desativar template');
        },
        ...options,
    });
}

export function useDuplicateReportTemplate(options?: UseMutationOptions<ReportTemplate, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.duplicateTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.templates() });
            toast.success('Template duplicado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao duplicar template');
        },
        ...options,
    });
}

// ==================== REPORTS - QUERIES ====================

export function useReports(filters?: any, options?: Omit<UseQueryOptions<Report[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.reportsList(filters),
        queryFn: () => reportService.listReports(filters),
        ...options,
    });
}

export function useReport(id: string, options?: Omit<UseQueryOptions<Report>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.report(id),
        queryFn: () => reportService.getReport(id),
        enabled: !!id,
        refetchInterval: (data) => {
            // Poll if report is still processing
            return data?.status === 'processing' || data?.status === 'pending' ? 5000 : false;
        },
        ...options,
    });
}

// ==================== REPORTS - MUTATIONS ====================

export function useGenerateReport(options?: UseMutationOptions<Report, Error, ReportGenerationRequest>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => reportService.generateReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.reports() });
            toast.success('Relatório sendo gerado...');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao gerar relatório');
        },
        ...options,
    });
}

export function useDeleteReport(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.deleteReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.reports() });
            toast.success('Relatório deletado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar relatório');
        },
        ...options,
    });
}

export function useRetryReport(options?: UseMutationOptions<Report, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.retryReport(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.report(id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.reports() });
            toast.success('Relatório sendo reprocessado...');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao reprocessar relatório');
        },
        ...options,
    });
}

// ==================== SCHEDULES - QUERIES ====================

export function useReportSchedules(filters?: any, options?: Omit<UseQueryOptions<ReportSchedule[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.schedulesList(filters),
        queryFn: () => reportService.listSchedules(filters),
        ...options,
    });
}

export function useReportSchedule(id: string, options?: Omit<UseQueryOptions<ReportSchedule>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.schedule(id),
        queryFn: () => reportService.getSchedule(id),
        enabled: !!id,
        ...options,
    });
}

// ==================== SCHEDULES - MUTATIONS ====================

export function useCreateReportSchedule(options?: UseMutationOptions<ReportSchedule, Error, Partial<ReportSchedule>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => reportService.createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.schedules() });
            toast.success('Agendamento criado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar agendamento');
        },
        ...options,
    });
}

export function useUpdateReportSchedule(options?: UseMutationOptions<ReportSchedule, Error, { id: string; data: Partial<ReportSchedule> }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => reportService.updateSchedule(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.schedule(variables.id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.schedules() });
            toast.success('Agendamento atualizado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar agendamento');
        },
        ...options,
    });
}

export function useDeleteReportSchedule(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.schedules() });
            toast.success('Agendamento deletado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar agendamento');
        },
        ...options,
    });
}

export function useRunScheduleNow(options?: UseMutationOptions<Report, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.runScheduleNow(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.schedule(id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.reports() });
            toast.success('Agendamento executado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao executar agendamento');
        },
        ...options,
    });
}

// ==================== SHARES - QUERIES ====================

export function useReportShares(filters?: any, options?: Omit<UseQueryOptions<ReportShare[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.sharesList(filters),
        queryFn: () => reportService.listShares(filters),
        ...options,
    });
}

export function useReportShare(id: string, options?: Omit<UseQueryOptions<ReportShare>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.share(id),
        queryFn: () => reportService.getShare(id),
        enabled: !!id,
        ...options,
    });
}

// ==================== SHARES - MUTATIONS ====================

export function useCreateReportShare(options?: UseMutationOptions<ReportShare, Error, any>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => reportService.createShare(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.shares() });
            toast.success('Compartilhamento criado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar compartilhamento');
        },
        ...options,
    });
}

export function useRevokeReportShare(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.revokeShare(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.share(id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.shares() });
            toast.success('Compartilhamento revogado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao revogar compartilhamento');
        },
        ...options,
    });
}

export function useDeleteReportShare(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.deleteShare(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.shares() });
            toast.success('Compartilhamento deletado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar compartilhamento');
        },
        ...options,
    });
}

// ==================== METRICS - QUERIES ====================

export function useReportMetrics(filters?: any, options?: Omit<UseQueryOptions<ReportMetric[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.metricsList(filters),
        queryFn: () => reportService.listMetrics(filters),
        ...options,
    });
}

export function useReportMetric(id: string, options?: Omit<UseQueryOptions<ReportMetric>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.metric(id),
        queryFn: () => reportService.getMetric(id),
        enabled: !!id,
        ...options,
    });
}

// ==================== METRICS - MUTATIONS ====================

export function useCreateReportMetric(options?: UseMutationOptions<ReportMetric, Error, Partial<ReportMetric>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => reportService.createMetric(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.metrics() });
            toast.success('Métrica criada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar métrica');
        },
        ...options,
    });
}

export function useUpdateReportMetric(options?: UseMutationOptions<ReportMetric, Error, { id: string; data: Partial<ReportMetric> }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => reportService.updateMetric(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.metric(variables.id) });
            queryClient.invalidateQueries({ queryKey: reportKeys.metrics() });
            toast.success('Métrica atualizada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar métrica');
        },
        ...options,
    });
}

export function useDeleteReportMetric(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reportService.deleteMetric(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.metrics() });
            toast.success('Métrica deletada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar métrica');
        },
        ...options,
    });
}

// ==================== ANALYTICS - QUERIES ====================

export function useAnalyticsSummary(filters?: any, options?: Omit<UseQueryOptions<AnalyticsSummary>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.analyticsSummary(filters),
        queryFn: () => reportService.getAnalyticsSummary(filters),
        ...options,
    });
}

export function useAnalyticsDashboard(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.analyticsDashboard(),
        queryFn: () => reportService.getAnalyticsDashboard(),
        refetchInterval: 30000, // Auto-refresh every 30s
        ...options,
    });
}

export function useMetricsByPeriod(filters?: any, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.metricsByPeriod(filters),
        queryFn: () => reportService.getMetricsByPeriod(filters),
        ...options,
    });
}

export function useTrendingStats(filters?: any, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: reportKeys.trendingStats(filters),
        queryFn: () => reportService.getTrendingStats(filters),
        ...options,
    });
}
