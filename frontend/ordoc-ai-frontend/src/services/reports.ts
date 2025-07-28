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

export interface ReportSchedule {
  id: string;
  name: string;
  status: string;
  frequency: string;
  next_run: string;
  template: string;
}

export interface ReportShare {
  id: string;
  share_token: string;
  access_type: string;
  status: string;
  report: string;
}

export interface ReportMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  created_at: string;
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

  /* Schedules */
  async getSchedules(params?: Record<string, any>): Promise<ReportSchedule[]> {
    const response = await api.get(`${this.base}/schedules/`, { params });
    return response.data.results || response.data;
  }

  async createSchedule(data: Record<string, any>): Promise<ReportSchedule> {
    const response = await api.post(`${this.base}/schedules/`, data);
    return response.data;
  }

  async updateSchedule(id: string, data: Record<string, any>): Promise<ReportSchedule> {
    const response = await api.put(`${this.base}/schedules/${id}/`, data);
    return response.data;
  }

  async deleteSchedule(id: string): Promise<any> {
    const response = await api.delete(`${this.base}/schedules/${id}/`);
    return response.data;
  }

  async activateSchedule(id: string): Promise<any> {
    const response = await api.post(`${this.base}/schedules/${id}/activate/`);
    return response.data;
  }

  async pauseSchedule(id: string): Promise<any> {
    const response = await api.post(`${this.base}/schedules/${id}/pause/`);
    return response.data;
  }

  async runScheduleNow(id: string): Promise<any> {
    const response = await api.post(`${this.base}/schedules/${id}/run_now/`);
    return response.data;
  }

  /* Shares */
  async getShares(params?: Record<string, any>): Promise<ReportShare[]> {
    const response = await api.get(`${this.base}/shares/`, { params });
    return response.data.results || response.data;
  }

  async createShare(data: Record<string, any>): Promise<ReportShare> {
    const response = await api.post(`${this.base}/shares/`, data);
    return response.data;
  }

  async updateShare(id: string, data: Record<string, any>): Promise<ReportShare> {
    const response = await api.put(`${this.base}/shares/${id}/`, data);
    return response.data;
  }

  async deleteShare(id: string): Promise<any> {
    const response = await api.delete(`${this.base}/shares/${id}/`);
    return response.data;
  }

  async revokeShare(id: string): Promise<any> {
    const response = await api.post(`${this.base}/shares/${id}/revoke/`);
    return response.data;
  }

  async publicShareAccess(token: string, password?: string): Promise<any> {
    const response = await api.get(`${this.base}/shares/public_access`, { params: { token, password } });
    return response.data;
  }

  /* Metrics */
  async getMetrics(params?: Record<string, any>): Promise<ReportMetric[]> {
    const response = await api.get(`${this.base}/metrics/`, { params });
    return response.data.results || response.data;
  }
}

export const reportsService = new ReportsService();
export default reportsService;
