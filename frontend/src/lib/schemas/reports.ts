/**
 * Reports Zod Schemas
 *
 * Validates ordoc-reports API responses:
 * - Dashboard metrics
 * - Report templates
 * - Reports
 * - Report schedules
 * - Report shares
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

import { z } from 'zod';
import { BaseEntitySchema } from './common';

/**
 * Report Template schema
 */
export const ReportTemplateSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  is_public: z.boolean(),
  query_config: z.record(z.any()),
  display_config: z.record(z.any()),
  filter_config: z.record(z.any()),
  export_config: z.record(z.any()),
  allowed_roles: z.array(z.string()),
  organization_id: z.number().int().positive(),
  created_by_id: z.number().int().positive(),
  isActive: z.boolean(),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  charts: z
    .array(
      z.object({
        type: z.string(),
        title: z.string(),
        config: z.record(z.any()),
      })
    )
    .optional(),
});

export type ReportTemplate = z.infer<typeof ReportTemplateSchema>;

/**
 * Report schema
 */
export const ReportSchema = BaseEntitySchema.extend({
  title: z.string().min(1),
  description: z.string().optional(),
  template_id: z.string().uuid(),
  template_name: z.string().optional(),
  format: z.enum(['html', 'pdf', 'xlsx', 'csv']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  file_url: z.string().url().optional(),
  file_size: z.number().int().nonnegative().optional(),
  expires_at: z.string().datetime().optional(),
  error_message: z.string().optional(),
  completed_at: z.string().datetime().optional(),
  filters: z.record(z.any()).optional(),
  parameters: z.record(z.any()).optional(),
  organization_id: z.number().int().positive(),
  created_by_id: z.number().int().positive(),
});

export type Report = z.infer<typeof ReportSchema>;

/**
 * Report Schedule schema
 */
export const ReportScheduleSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  description: z.string().optional(),
  template_id: z.string().uuid(),
  template_name: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  status: z.enum(['active', 'paused', 'inactive']),
  next_run: z.string().datetime(),
  last_run: z.string().datetime().optional(),
  filters: z.record(z.any()).optional(),
  parameters: z.record(z.any()).optional(),
  export_format: z.enum(['html', 'pdf', 'xlsx', 'csv']),
  organization_id: z.number().int().positive(),
  created_by_id: z.number().int().positive(),
});

export type ReportSchedule = z.infer<typeof ReportScheduleSchema>;

/**
 * Report Share schema
 */
export const ReportShareSchema = BaseEntitySchema.extend({
  report_id: z.string().uuid(),
  share_token: z.string().min(1),
  access_type: z.enum(['public', 'protected', 'private']),
  status: z.enum(['active', 'expired', 'revoked']),
  expires_at: z.string().datetime().optional(),
  password_protected: z.boolean(),
  download_count: z.number().int().nonnegative(),
  max_downloads: z.number().int().positive().optional(),
  organization_id: z.number().int().positive(),
  created_by_id: z.number().int().positive(),
});

export type ReportShare = z.infer<typeof ReportShareSchema>;

/**
 * Report Metric schema
 */
export const ReportMetricSchema = BaseEntitySchema.extend({
  metric_type: z.string().min(1),
  metric_name: z.string().min(1),
  metric_value: z.number(),
  metric_unit: z.string().optional(),
  report_id: z.string().uuid().optional(),
  template_id: z.string().uuid().optional(),
  organization_id: z.number().int().positive(),
});

export type ReportMetric = z.infer<typeof ReportMetricSchema>;

/**
 * Dashboard Metrics schema
 */
export const DashboardMetricsSchema = z.object({
  total_reports: z.number().int().nonnegative(),
  reports_this_month: z.number().int().nonnegative(),
  active_templates: z.number().int().nonnegative(),
  active_schedules: z.number().int().nonnegative(),
  avg_generation_time: z.number().nonnegative(),
  most_used_template: z.string().nullable(),
  reports_by_status: z.record(z.number().int().nonnegative()),
  reports_by_format: z.record(z.number().int().nonnegative()),
  monthly_trend: z.array(
    z.object({
      month: z.string(),
      count: z.number().int().nonnegative(),
    })
  ),
  error_rate: z.number().min(0).max(100),
});

export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>;

/**
 * Generate Report Request schema
 */
export const GenerateReportRequestSchema = z.object({
  template_id: z.string().uuid('Template ID inválido'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  format: z.enum(['html', 'pdf', 'xlsx', 'csv']).default('pdf'),
  filters: z.record(z.any()).optional(),
  parameters: z.record(z.any()).optional(),
  expires_in_days: z.number().int().positive().max(365).optional(),
});

export type GenerateReportRequest = z.infer<typeof GenerateReportRequestSchema>;

/**
 * Filter params schemas
 */
export const FilterReportTemplatesParamsSchema = z.object({
  category: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft', '']).optional(),
  is_public: z.boolean().optional(),
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type FilterReportTemplatesParams = z.infer<typeof FilterReportTemplatesParamsSchema>;

export const FilterReportsParamsSchema = z.object({
  template_id: z.string().uuid().optional(),
  format: z.enum(['html', 'pdf', 'xlsx', 'csv', '']).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', '']).optional(),
  created_after: z.string().datetime().optional(),
  created_before: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type FilterReportsParams = z.infer<typeof FilterReportsParamsSchema>;

export const FilterReportSchedulesParamsSchema = z.object({
  template_id: z.string().uuid().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly', '']).optional(),
  status: z.enum(['active', 'paused', 'inactive', '']).optional(),
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type FilterReportSchedulesParams = z.infer<typeof FilterReportSchedulesParamsSchema>;

export const FilterReportSharesParamsSchema = z.object({
  report_id: z.string().uuid().optional(),
  access_type: z.enum(['public', 'protected', 'private', '']).optional(),
  status: z.enum(['active', 'expired', 'revoked', '']).optional(),
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type FilterReportSharesParams = z.infer<typeof FilterReportSharesParamsSchema>;
