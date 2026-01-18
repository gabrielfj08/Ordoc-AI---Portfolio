import apiClient from './api';

// Report Template
export interface ReportTemplate {
    id: string;
    name: string;
    description?: string;
    category: 'document' | 'process' | 'user' | 'workflow' | 'signature' | 'integration' | 'custom';
    type: 'table' | 'chart' | 'dashboard' | 'export';
    status: 'draft' | 'active' | 'inactive';
    query_config: any; // JSON field with query configuration
    display_config: any; // JSON field with display configuration
    filter_config?: any; // JSON field with filter configuration
    export_config?: any; // JSON field with export configuration
    is_public: boolean;
    allowed_roles?: string[];
    organization: string;
    created_by: string;
    created_by_name?: string;
    created_at: string;
    updated_at: string;
}

// Report
export interface Report {
    id: string;
    title: string;
    description?: string;
    template: string;
    template_name?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    format: 'pdf' | 'excel' | 'csv' | 'json';
    file?: string;
    file_url?: string;
    file_size?: number;
    filters_applied?: any; // JSON field
    data?: any; // JSON field with report data
    error_message?: string;
    generated_by: string;
    generated_by_name?: string;
    organization: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

// Report Schedule
export interface ReportSchedule {
    id: string;
    name: string;
    description?: string;
    template: string;
    template_name?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    day_of_week?: number; // For weekly schedules (0-6)
    day_of_month?: number; // For monthly schedules (1-31)
    time_of_day: string; // HH:MM format
    is_active: boolean;
    last_run?: string;
    next_run?: string;
    recipients: string[]; // List of email addresses
    filters?: any; // JSON field
    format: 'pdf' | 'excel' | 'csv';
    organization: string;
    created_by: string;
    created_by_name?: string;
    created_at: string;
    updated_at: string;
}

// Report Share
export interface ReportShare {
    id: string;
    report: string;
    token: string;
    expires_at?: string;
    max_views?: number;
    view_count: number;
    is_active: boolean;
    shared_by: string;
    shared_by_name?: string;
    created_at: string;
    accessed_at?: string;
}

// Report Metric
export interface ReportMetric {
    id: string;
    name: string;
    description?: string;
    metric_type: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'percentage';
    entity_type: 'document' | 'process' | 'task' | 'user' | 'signature' | 'custom';
    query_config: any; // JSON field
    aggregation_config?: any; // JSON field
    display_config?: any; // JSON field
    organization: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

// Analytics Summary
export interface AnalyticsSummary {
    total_documents: number;
    total_processes: number;
    total_users: number;
    total_signatures: number;
    documents_by_status: Record<string, number>;
    processes_by_status: Record<string, number>;
    signatures_by_status: Record<string, number>;
    recent_activity: any[];
    trending_metrics: any[];
}

// Report Generation Request
export interface ReportGenerationRequest {
    template_id: string;
    format?: 'pdf' | 'excel' | 'csv' | 'json';
    filters?: any;
    title?: string;
    description?: string;
}

// Report Export Request
export interface ReportExportRequest {
    report_id: string;
    format: 'pdf' | 'excel' | 'csv';
}

class ReportService {
    // ==================== REPORT TEMPLATES ====================

    /**
     * Listar templates de relatrios
     */
    async listTemplates(filters?: {
        category?: string;
        type?: string;
        status?: string;
        is_public?: boolean;
        search?: string;
    }): Promise<ReportTemplate[]> {
        const response = await apiClient.get<any>('/ordoc-reports/api/templates/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter template de relatrio
     */
    async getTemplate(id: string): Promise<ReportTemplate> {
        const response = await apiClient.get<ReportTemplate>(`/ordoc-reports/api/templates/${id}/`);
        return response.data;
    }

    /**
     * Criar template de relatrio
     */
    async createTemplate(data: Partial<ReportTemplate>): Promise<ReportTemplate> {
        const response = await apiClient.post<ReportTemplate>('/ordoc-reports/api/templates/', data);
        return response.data;
    }

    /**
     * Atualizar template de relatrio
     */
    async updateTemplate(id: string, data: Partial<ReportTemplate>): Promise<ReportTemplate> {
        const response = await apiClient.patch<ReportTemplate>(`/ordoc-reports/api/templates/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar template de relatrio
     */
    async deleteTemplate(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-reports/api/templates/${id}/`);
    }

    /**
     * Ativar template
     */
    async activateTemplate(id: string): Promise<ReportTemplate> {
        const response = await apiClient.post<ReportTemplate>(`/ordoc-reports/api/templates/${id}/activate/`);
        return response.data;
    }

    /**
     * Desativar template
     */
    async deactivateTemplate(id: string): Promise<ReportTemplate> {
        const response = await apiClient.post<ReportTemplate>(`/ordoc-reports/api/templates/${id}/deactivate/`);
        return response.data;
    }

    /**
     * Duplicar template
     */
    async duplicateTemplate(id: string): Promise<ReportTemplate> {
        const response = await apiClient.post<ReportTemplate>(`/ordoc-reports/api/templates/${id}/duplicate/`);
        return response.data;
    }

    /**
     * Prvia do relatrio
     */
    async previewTemplate(id: string, filters?: any): Promise<any> {
        const response = await apiClient.get<any>(`/ordoc-reports/api/templates/${id}/preview/`, {
            params: filters
        });
        return response.data;
    }

    /**
     * Listar categorias disponveis
     */
    async getCategories(): Promise<Array<{ value: string; label: string }>> {
        const response = await apiClient.get<any>('/ordoc-reports/api/templates/categories/');
        return response.data.categories;
    }

    /**
     * Listar tipos disponveis
     */
    async getTypes(): Promise<Array<{ value: string; label: string }>> {
        const response = await apiClient.get<any>('/ordoc-reports/api/templates/types/');
        return response.data.types;
    }

    // ==================== REPORTS ====================

    /**
     * Listar relatrios
     */
    async listReports(filters?: {
        status?: string;
        format?: string;
        template?: string;
        search?: string;
    }): Promise<Report[]> {
        const response = await apiClient.get<any>('/ordoc-reports/api/reports/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter relatrio
     */
    async getReport(id: string): Promise<Report> {
        const response = await apiClient.get<Report>(`/ordoc-reports/api/reports/${id}/`);
        return response.data;
    }

    /**
     * Gerar relatrio
     */
    async generateReport(data: ReportGenerationRequest): Promise<Report> {
        const response = await apiClient.post<Report>('/ordoc-reports/api/reports/generate/', data);
        return response.data;
    }

    /**
     * Deletar relatrio
     */
    async deleteReport(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-reports/api/reports/${id}/`);
    }

    /**
     * Baixar relatrio
     */
    async downloadReport(id: string): Promise<Blob> {
        const response = await apiClient.get(`/ordoc-reports/api/reports/${id}/download/`, {
            responseType: 'blob'
        });
        return response.data;
    }

    /**
     * Exportar relatrio em formato especfico
     */
    async exportReport(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
        const response = await apiClient.post(
            `/ordoc-reports/api/reports/${id}/export/`,
            { format },
            { responseType: 'blob' }
        );
        return response.data;
    }

    /**
     * Reprocessar relatrio com falha
     */
    async retryReport(id: string): Promise<Report> {
        const response = await apiClient.post<Report>(`/ordoc-reports/api/reports/${id}/retry/`);
        return response.data;
    }

    /**
     * Cancelar gerao de relatrio
     */
    async cancelReport(id: string): Promise<void> {
        await apiClient.post(`/ordoc-reports/api/reports/${id}/cancel/`);
    }

    // ==================== REPORT SCHEDULES ====================

    /**
     * Listar agendamentos de relatrios
     */
    async listSchedules(filters?: {
        template?: string;
        frequency?: string;
        is_active?: boolean;
    }): Promise<ReportSchedule[]> {
        const response = await apiClient.get<any>('/ordoc-reports/api/schedules/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter agendamento
     */
    async getSchedule(id: string): Promise<ReportSchedule> {
        const response = await apiClient.get<ReportSchedule>(`/ordoc-reports/api/schedules/${id}/`);
        return response.data;
    }

    /**
     * Criar agendamento
     */
    async createSchedule(data: Partial<ReportSchedule>): Promise<ReportSchedule> {
        const response = await apiClient.post<ReportSchedule>('/ordoc-reports/api/schedules/', data);
        return response.data;
    }

    /**
     * Atualizar agendamento
     */
    async updateSchedule(id: string, data: Partial<ReportSchedule>): Promise<ReportSchedule> {
        const response = await apiClient.patch<ReportSchedule>(`/ordoc-reports/api/schedules/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar agendamento
     */
    async deleteSchedule(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-reports/api/schedules/${id}/`);
    }

    /**
     * Ativar agendamento
     */
    async activateSchedule(id: string): Promise<ReportSchedule> {
        const response = await apiClient.post<ReportSchedule>(`/ordoc-reports/api/schedules/${id}/activate/`);
        return response.data;
    }

    /**
     * Desativar agendamento
     */
    async deactivateSchedule(id: string): Promise<ReportSchedule> {
        const response = await apiClient.post<ReportSchedule>(`/ordoc-reports/api/schedules/${id}/deactivate/`);
        return response.data;
    }

    /**
     * Executar agendamento manualmente
     */
    async runScheduleNow(id: string): Promise<Report> {
        const response = await apiClient.post<Report>(`/ordoc-reports/api/schedules/${id}/run_now/`);
        return response.data;
    }

    // ==================== REPORT SHARES ====================

    /**
     * Listar compartilhamentos de relatrios
     */
    async listShares(filters?: {
        report?: string;
        is_active?: boolean;
    }): Promise<ReportShare[]> {
        const response = await apiClient.get<any>('/ordoc-reports/api/shares/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter compartilhamento
     */
    async getShare(id: string): Promise<ReportShare> {
        const response = await apiClient.get<ReportShare>(`/ordoc-reports/api/shares/${id}/`);
        return response.data;
    }

    /**
     * Criar compartilhamento
     */
    async createShare(data: {
        report: string;
        expires_at?: string;
        max_views?: number;
    }): Promise<ReportShare> {
        const response = await apiClient.post<ReportShare>('/ordoc-reports/api/shares/', data);
        return response.data;
    }

    /**
     * Revogar compartilhamento
     */
    async revokeShare(id: string): Promise<void> {
        const response = await apiClient.post(`/ordoc-reports/api/shares/${id}/revoke/`);
        return response.data;
    }

    /**
     * Deletar compartilhamento
     */
    async deleteShare(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-reports/api/shares/${id}/`);
    }

    /**
     * Acessar relatrio via token pblico
     */
    async accessSharedReport(token: string): Promise<any> {
        const response = await apiClient.get(`/ordoc-reports/shared/${token}/`);
        return response.data;
    }

    // ==================== REPORT METRICS ====================

    /**
     * Listar mtricas de relatrios
     */
    async listMetrics(filters?: {
        entity_type?: string;
        metric_type?: string;
        search?: string;
    }): Promise<ReportMetric[]> {
        const response = await apiClient.get<any>('/ordoc-reports/api/metrics/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter mtrica
     */
    async getMetric(id: string): Promise<ReportMetric> {
        const response = await apiClient.get<ReportMetric>(`/ordoc-reports/api/metrics/${id}/`);
        return response.data;
    }

    /**
     * Criar mtrica
     */
    async createMetric(data: Partial<ReportMetric>): Promise<ReportMetric> {
        const response = await apiClient.post<ReportMetric>('/ordoc-reports/api/metrics/', data);
        return response.data;
    }

    /**
     * Atualizar mtrica
     */
    async updateMetric(id: string, data: Partial<ReportMetric>): Promise<ReportMetric> {
        const response = await apiClient.patch<ReportMetric>(`/ordoc-reports/api/metrics/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar mtrica
     */
    async deleteMetric(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-reports/api/metrics/${id}/`);
    }

    /**
     * Calcular mtrica
     */
    async calculateMetric(id: string, filters?: any): Promise<any> {
        const response = await apiClient.post<any>(`/ordoc-reports/api/metrics/${id}/calculate/`, {
            filters
        });
        return response.data;
    }

    // ==================== ANALYTICS ====================

    /**
     * Obter resumo de analytics
     */
    async getAnalyticsSummary(filters?: {
        start_date?: string;
        end_date?: string;
        entity_type?: string;
    }): Promise<AnalyticsSummary> {
        const response = await apiClient.get<AnalyticsSummary>('/ordoc-reports/api/analytics/', {
            params: filters
        });
        return response.data;
    }

    /**
     * Obter dashboard de analytics
     */
    async getAnalyticsDashboard(): Promise<any> {
        const response = await apiClient.get('/ordoc-reports/api/analytics/dashboard/');
        return response.data;
    }

    /**
     * Obter mtricas por perodo
     */
    async getMetricsByPeriod(filters?: {
        metric_type?: string;
        entity_type?: string;
        start_date?: string;
        end_date?: string;
        period?: 'day' | 'week' | 'month' | 'year';
    }): Promise<any> {
        const response = await apiClient.get('/ordoc-reports/api/analytics/metrics_by_period/', {
            params: filters
        });
        return response.data;
    }

    /**
     * Obter estatsticas de tendncia
     */
    async getTrendingStats(filters?: {
        entity_type?: string;
        days?: number;
    }): Promise<any> {
        const response = await apiClient.get('/ordoc-reports/api/analytics/trending/', {
            params: filters
        });
        return response.data;
    }
}

export const reportService = new ReportService();
export default reportService;
