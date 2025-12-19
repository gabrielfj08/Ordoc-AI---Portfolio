export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ReportTemplate extends BaseEntity {
  name: string;
  description?: string;
  category?: string;
  type?: string;
  status: 'active' | 'inactive' | 'draft';
  is_public: boolean;
  query_config: Record<string, any>;
  display_config: Record<string, any>;
  filter_config: Record<string, any>;
  export_config: Record<string, any>;
  allowed_roles: string[];
  organization_id: number;
  created_by_id: number;
  isActive: boolean;
  fields?: Array<{ name: string; type: string; label: string }>;
  charts?: Array<{ type: string; title: string; config: Record<string, any> }>;
}

export interface Report extends BaseEntity {
  title: string;
  description?: string;
  template_id: string;
  template_name?: string;
  format: 'html' | 'pdf' | 'xlsx' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  file_size?: number;
  expires_at?: string;
  error_message?: string;
  completed_at?: string;
  filters?: Record<string, any>;
  parameters?: Record<string, any>;
  organization_id: number;
  created_by_id: number;
}

export interface ReportSchedule extends BaseEntity {
  name: string;
  description?: string;
  template_id: string;
  template_name?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'active' | 'paused' | 'inactive';
  next_run: string;
  last_run?: string;
  filters?: Record<string, any>;
  parameters?: Record<string, any>;
  export_format: 'html' | 'pdf' | 'xlsx' | 'csv';
  organization_id: number;
  created_by_id: number;
}

export interface ReportShare extends BaseEntity {
  report_id: string;
  share_token: string;
  access_type: 'public' | 'protected' | 'private';
  status: 'active' | 'expired' | 'revoked';
  expires_at?: string;
  password_protected: boolean;
  download_count: number;
  max_downloads?: number;
  organization_id: number;
  created_by_id: number;
}

export interface ReportMetric extends BaseEntity {
  metric_type: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  report_id?: string;
  template_id?: string;
  organization_id: number;
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

export interface FilterReportTemplatesParams extends PaginationParams {
  category?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'draft' | '';
  is_public?: boolean;
}

export interface FilterReportsParams extends PaginationParams {
  template_id?: string;
  format?: 'html' | 'pdf' | 'xlsx' | 'csv' | '';
  status?: 'pending' | 'processing' | 'completed' | 'failed' | '';
  created_after?: string;
  created_before?: string;
}

export interface FilterReportSchedulesParams extends PaginationParams {
  template_id?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | '';
  status?: 'active' | 'paused' | 'inactive' | '';
}

export interface FilterReportSharesParams extends PaginationParams {
  report_id?: string;
  access_type?: 'public' | 'protected' | 'private' | '';
  status?: 'active' | 'expired' | 'revoked' | '';
}

export interface GenerateReportData {
  template_id: string;
  title: string;
  description?: string;
  format?: 'html' | 'pdf' | 'xlsx' | 'csv';
  filters?: Record<string, any>;
  parameters?: Record<string, any>;
  expires_in_days?: number;
}

export interface CreateReportScheduleData {
  name: string;
  description?: string;
  template_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  export_format: 'html' | 'pdf' | 'xlsx' | 'csv';
  filters?: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface CreateReportShareData {
  report_id: string;
  access_type: 'public' | 'protected' | 'private';
  expires_in_days?: number;
  password?: string;
  max_downloads?: number;
}

export interface FormErrors {
  [key: string]: string;
}
