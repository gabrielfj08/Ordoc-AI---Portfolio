/**
 * Reports Service - API client for Ordoc Reports
 */

import axios from 'axios';
import {
  DashboardMetricsSchema,
  ReportSchema,
  ReportTemplateSchema,
  type DashboardMetrics,
} from '@/lib/schemas/reports';
import { validateApiResponse, createPaginatedResponseSchema } from '@/lib/schemas/common';

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
    const data = Array.isArray(response.data) ? response.data : response.data.results || [];

    // Validate each report with Zod schema
    return data.map((report: unknown, index: number) =>
      validateApiResponse(ReportSchema, report, `getReports[${index}]`)
    );
  },

  /**
   * Get list of report templates
   */
  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await api.get('/templates/');
    const data = Array.isArray(response.data) ? response.data : response.data.results || [];

    // Validate each template with Zod schema
    return data.map((template: unknown, index: number) =>
      validateApiResponse(ReportTemplateSchema, template, `getTemplates[${index}]`)
    );
  },

  /**
   * Create a new report
   */
  async createReport(templateId: string, parameters: Record<string, unknown>): Promise<Report> {
    const response = await api.post('/reports/', {
      template_id: templateId,
      parameters
    });

    // Validate response with Zod schema
    return validateApiResponse(ReportSchema, response.data, 'createReport');
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
  },

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/metrics/dashboard/');
    // Validate response with Zod schema
    return validateApiResponse(DashboardMetricsSchema, response.data, 'getDashboardMetrics');
  },
};

export default reportsService;
