export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  type?: string;
  status?: string;
}

export interface GenerateReportData {
  template_id: string;
  title: string;
  description?: string;
  format?: string;
  filters?: Record<string, any>;
  parameters?: Record<string, any>;
  expires_in_days?: number;
}

export interface DashboardMetrics {
  total_reports: number;
  reports_this_month: number;
  active_templates: number;
  active_schedules: number;
  avg_generation_time: number;
  most_used_template: string | null;
  reports_by_status: Record<string, number>;
  reports_by_format: Record<string, number>;
  monthly_trend: Array<{ month: string; count: number }>;
  error_rate: number;
}

import api from './auth';

class ReportsService {
  private base = '/api/v1/ordoc-reports/api';

  async getTemplates(params?: Record<string, any>): Promise<ReportTemplate[]> {
    const response = await api.get(`${this.base}/templates/`, { params });
    return response.data.results || response.data;
  }

  async getTemplate(id: string): Promise<ReportTemplate> {
    const response = await api.get(`${this.base}/templates/${id}/`);
    return response.data;
  }

  async generateReport(data: GenerateReportData): Promise<any> {
    const response = await api.post(`${this.base}/reports/generate/`, data);
    return response.data;
  }

  async getReports(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${this.base}/reports/`, { params });
    return response.data;
  }

  async getReportStats(): Promise<any> {
    const response = await api.get(`${this.base}/reports/stats/`);
    return response.data;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get(`${this.base}/metrics/dashboard/`);
    return response.data;
  }
}

export const reportsService = new ReportsService();
export default reportsService;
