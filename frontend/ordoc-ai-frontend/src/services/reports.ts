import {
  ReportTemplate,
  Report,
  ReportSchedule,
  ReportShare,
  ReportMetric,
  DashboardMetrics,
  GenerateReportData,
  CreateReportScheduleData,
  CreateReportShareData,
  FilterReportTemplatesParams,
  FilterReportsParams,
  FilterReportSchedulesParams,
  FilterReportSharesParams,
  ApiResponse
} from '@/types/ordoc-reports';

import api from './auth';

class ReportsService {
  private base = '/api/v1/ordoc-reports/api';

  async getTemplates(params?: FilterReportTemplatesParams): Promise<ApiResponse<ReportTemplate>> {
    const response = await api.get(`${this.base}/templates/`, { params });
    return response.data;
  }

  async getTemplate(id: string): Promise<ReportTemplate> {
    const response = await api.get(`${this.base}/templates/${id}/`);
    return response.data;
  }

  async generateReport(data: GenerateReportData): Promise<any> {
    const response = await api.post(`${this.base}/reports/generate/`, data);
    return response.data;
  }

  async getReports(params?: FilterReportsParams): Promise<ApiResponse<Report>> {
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
  async getSchedules(params?: FilterReportSchedulesParams): Promise<ApiResponse<ReportSchedule>> {
    const response = await api.get(`${this.base}/schedules/`, { params });
    return response.data;
  }

  async createSchedule(data: CreateReportScheduleData): Promise<ReportSchedule> {
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
  async getShares(params?: FilterReportSharesParams): Promise<ApiResponse<ReportShare>> {
    const response = await api.get(`${this.base}/shares/`, { params });
    return response.data;
  }

  async createShare(data: CreateReportShareData): Promise<ReportShare> {
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
  async getMetrics(params?: Record<string, any>): Promise<ApiResponse<ReportMetric>> {
    const response = await api.get(`${this.base}/metrics/`, { params });
    return response.data;
  }

  async deleteReport(id: string): Promise<any> {
    const response = await api.delete(`${this.base}/reports/${id}/`);
    return response.data;
  }

  async exportReports(reportIds: string[], format: string = 'zip'): Promise<any> {
    const response = await api.post(`${this.base}/reports/export/`, {
      report_ids: reportIds,
      export_format: format,
      include_metadata: true
    });
    return response.data;
  }

  async regenerateReport(id: string): Promise<any> {
    const response = await api.post(`${this.base}/reports/${id}/regenerate/`);
    return response.data;
  }

  async activateTemplate(id: string): Promise<any> {
    const response = await api.post(`${this.base}/templates/${id}/activate/`);
    return response.data;
  }

  async deactivateTemplate(id: string): Promise<any> {
    const response = await api.post(`${this.base}/templates/${id}/deactivate/`);
    return response.data;
  }

  async duplicateTemplate(id: string): Promise<ReportTemplate> {
    const response = await api.post(`${this.base}/templates/${id}/duplicate/`);
    return response.data;
  }

  async previewTemplate(id: string, params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${this.base}/templates/${id}/preview/`, { params });
    return response.data;
  }
}

export const reportsService = new ReportsService();
export default reportsService;

export type {
  ReportTemplate,
  Report,
  ReportSchedule,
  ReportShare,
  ReportMetric,
  DashboardMetrics,
  GenerateReportData,
  CreateReportScheduleData,
  CreateReportShareData,
  FilterReportTemplatesParams,
  FilterReportsParams,
  FilterReportSchedulesParams,
  FilterReportSharesParams
} from '@/types/ordoc-reports';
