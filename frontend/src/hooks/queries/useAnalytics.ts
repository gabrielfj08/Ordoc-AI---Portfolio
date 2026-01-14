import { useQuery } from '@tanstack/react-query';
import analyticsService from '@/services/analytics';

// Query Keys
export const analyticsKeys = {
    all: ['analytics'] as const,
    kpis: (period: '7d' | '30d' | '90d') => [...analyticsKeys.all, 'kpis', period] as const,
    charts: (period: '7d' | '30d' | '90d') => [...analyticsKeys.all, 'charts', period] as const,
    allData: (period: '7d' | '30d' | '90d') => [...analyticsKeys.all, 'allData', period] as const,
};

/**
 * Hook para obter KPIs
 */
export function useKPIs(period: '7d' | '30d' | '90d' = '30d') {
    return useQuery({
        queryKey: analyticsKeys.kpis(period),
        queryFn: () => analyticsService.getKPIs(period),
    });
}

/**
 * Hook para obter dados de gráficos
 */
export function useCharts(period: '7d' | '30d' | '90d' = '30d') {
    return useQuery({
        queryKey: analyticsKeys.charts(period),
        queryFn: () => analyticsService.getCharts(period),
    });
}

/**
 * Hook para obter todos os dados de analytics
 */
export function useAnalytics(period: '7d' | '30d' | '90d' = '30d') {
    return useQuery({
        queryKey: analyticsKeys.allData(period),
        queryFn: () => analyticsService.getAll(period),
    });
}
