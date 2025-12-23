/**
 * Reports Service - API client for Ordoc Reports
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/ordoc-reports/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  config.headers['X-Subdomain'] = 'demo';
  const token = localStorage.getItem('ordoc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Report {
  id: string;
  title: string;
  description?: string;
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  format: 'html' | 'pdf' | 'excel' | 'csv' | 'json';
  created_at: string;
  file_size?: number;
  file_path?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
}

export const reportsService = {
  /**
   * Get list of reports
   */
  async getReports(params?: { status?: string; search?: string }): Promise<Report[]> {
    const response = await api.get('/reports/', { params });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  /**
   * Get list of report templates
   */
  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await api.get('/templates/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  /**
   * Create a new report
   */
  async createReport(templateId: string, parameters: Record<string, unknown>): Promise<Report> {
    const response = await api.post('/reports/', {
      template_id: templateId,
      parameters
    });
    return response.data;
  },

  /**
   * Delete a report
   */
  async deleteReport(reportId: string): Promise<void> {
    await api.delete(`/reports/${reportId}/`);
  },

  /**
   * Get report download URL
   */
  getDownloadUrl(reportId: string): string {
    return `${API_BASE_URL}/ordoc-reports/api/reports/${reportId}/download/`;
  }
};

export default reportsService;
