import apiClient from './api';

export interface KPI {
    label: string;
    value: string | number;
    change: number;
    trend: number[];
}

export interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

export interface AnalyticsData {
    kpis: KPI[];
    processesOverTime: ChartData[];
    processesByCategory: ChartData[];
    processesByStatus: ChartData[];
}

class AnalyticsService {
    /**
     * Obter KPIs
     */
    async getKPIs(period: '7d' | '30d' | '90d' = '30d'): Promise<KPI[]> {
        const response = await apiClient.get<KPI[]>('/analytics/kpis', {
            params: { period },
        });
        return response.data;
    }

    /**
     * Obter dados de gráficos
     */
    async getCharts(period: '7d' | '30d' | '90d' = '30d'): Promise<{
        processesOverTime: ChartData[];
        processesByCategory: ChartData[];
        processesByStatus: ChartData[];
    }> {
        const response = await apiClient.get('/analytics/charts', {
            params: { period },
        });
        return response.data;
    }

    /**
     * Obter todos os dados de analytics
     */
    async getAll(period: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> {
        const [kpis, charts] = await Promise.all([
            this.getKPIs(period),
            this.getCharts(period),
        ]);

        return {
            kpis,
            ...charts,
        };
    }

    /**
     * Exportar relatório
     */
    async exportReport(format: 'pdf' | 'excel' | 'csv', period: '7d' | '30d' | '90d' = '30d'): Promise<Blob> {
        const response = await apiClient.get('/analytics/export', {
            params: { format, period },
            responseType: 'blob',
        });
        return response.data;
    }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
