// Base types for Ordoc Flow
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page: number;
  perPage: number;
  direction: 'asc' | 'desc';
  order: string;
  q?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Group types
export interface Group extends BaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  procedures_count?: number;
  requesters_count?: number;
}

export interface FilterGroupsParams extends BaseFilterParams {
  status: 'active' | 'inactive' | '';
}

// Procedure Template types
export interface ProcedureTemplate extends BaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  organization_id: number;
  group_id?: number;
  procedures_count?: number;
}

export interface FilterProcedureTemplatesParams extends BaseFilterParams {
  status: 'active' | 'inactive' | '';
  group_id?: number;
}

// Procedure types
export interface Procedure extends BaseEntity {
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  procedure_template_id: number;
  requester_id: number;
  organization_id: number;
  tasks_count?: number;
  completed_tasks_count?: number;
}

export interface FilterProceduresParams extends BaseFilterParams {
  status: 'draft' | 'active' | 'completed' | 'cancelled' | '';
  procedure_template_id?: number;
  requester_id?: number;
}

// Requester types
export interface Requester extends BaseEntity {
  name: string;
  email: string;
  document: string;
  phone?: string;
  status: 'active' | 'inactive';
  type: 'internal' | 'external';
  organization_id: number;
}

export interface FilterRequestersParams extends BaseFilterParams {
  status: 'active' | 'inactive' | '';
  type: 'internal' | 'external' | '';
}

// Task Template types
export interface TaskTemplate extends BaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  procedure_template_id: number;
  order: number;
  assignee_type: 'user' | 'group' | 'role';
  assignee_id?: number;
}

export interface FilterTaskTemplatesParams extends BaseFilterParams {
  status: 'active' | 'inactive' | '';
  procedure_template_id?: number;
}

// Task types
export interface Task extends BaseEntity {
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'refused';
  procedure_id: number;
  task_template_id: number;
  assignee_id?: number;
  assignee_type: 'user' | 'group' | 'role';
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed_at?: string;
  procedure?: Procedure;
  assignee?: { name: string };
}

export interface FilterTasksParams extends BaseFilterParams {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'refused' | '';
  procedure_id?: number;
  assignee_id?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent' | '';
}

// Signature types
export interface Signature extends BaseEntity {
  procedure_id: number;
  requester_id: number;
  status: 'pending' | 'signed' | 'refused';
  signed_at?: string;
  refused_at?: string;
  signable_type: string;
  signable_id: number;
}

export interface FilterSignaturesParams extends BaseFilterParams {
  status: 'pending' | 'signed' | 'refused' | '';
  procedure_id?: number;
  requester_id?: number;
  signable_type?: string;
}

export interface BaseFilterParams extends PaginationParams {
  status: string;
}

// Form types
export interface FormField {
  name: string;
  value: any;
  error?: string;
}

export interface FormErrors {
  [key: string]: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FormErrors;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Table types
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

// Subject types
export interface Subject extends BaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  procedure_template_id: number;
  field_type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  is_required: boolean;
  order: number;
  options?: string[];
}

export interface FilterSubjectsParams extends BaseFilterParams {
  status: 'active' | 'inactive' | '';
  procedure_template_id?: number;
}
