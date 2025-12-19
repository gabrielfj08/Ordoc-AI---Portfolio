// Tipos para autenticação
export interface LoginFormProps {
  secret: string;
  onSubmit: (values: LoginFormValues) => Promise<LoginAPIResponse>;
}

export interface LoginFormValues {
  cpfCnpj: string;
  password: string;
}

export interface LoginAPIResponse {
  data: {
    token: string;
  };
}

// Tipos para Home
export interface HomeProps {
  reportId: number;
}

export interface CardsContainerProps {
  reportId: number;
}

export interface CardsProps {
  reportData: ShowExternalReportAPIResponse;
  handleClick: () => void;
}

export interface ShowExternalReportAPIResponse {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Tipos para Procedimentos
export interface ProcedureProps {
  procedureId: number;
}

export interface NewProcedureProps {
  templateId?: number;
}

export interface ProcedureFieldProps {
  field: ProcedureField;
  value?: any;
  onChange: (value: any) => void;
  error?: string;
}

export interface ProcedureField {
  id: number;
  name: string;
  field_type: string;
  required: boolean;
  options?: string[];
  validation_rules?: any;
}

// Tipos para Assinaturas
export interface SignatureProps {
  signatureId: number;
}

export interface SignatureData {
  id: number;
  document_name: string;
  status: string;
  created_at: string;
  procedure_id: number;
}

// Tipos para Tarefas
export interface TaskProps {
  taskId: number;
}

export interface TaskData {
  id: number;
  name: string;
  description: string;
  status: string;
  due_date: string;
  procedure_id: number;
}

// Tipos para Profile
export interface ProfileProps {
  requesterId: number;
}

export interface RequesterData {
  id: number;
  name: string;
  email: string;
  cpf_cnpj: string;
  phone: string;
  address: AddressData;
}

export interface AddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

// Constantes de Status
export enum ProcedureStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_ANALYSIS = 'in_analysis',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum SignatureStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  REJECTED = 'rejected'
}

export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  FILE = 'file',
  TEXTAREA = 'textarea'
}
