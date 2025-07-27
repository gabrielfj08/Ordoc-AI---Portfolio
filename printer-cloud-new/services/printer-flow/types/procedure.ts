import { APIMetaProperties } from '../../types';

export interface CreateProcedureAPIResponse extends ShowProcedureAPIResponse {}

export interface CreateProcedurePayload {
  priority: procedurePriority;
  source: string;
  private: boolean;
  deadline: string;
  requesterId: number | null;
  procedureTemplateId: number | null;
}

export interface IndexProceduresAPIResponse {
  procedures: Array<IndexProcedure>;
  meta: APIMetaProperties;
}

export interface IndexProcedure {
  id: number;
  deadline: string | null;
  priority: procedurePriority;
  private: boolean;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  source: procedureSource;
  status: procedureStatus;
  schema: Array<ProcedureSchemaItems>;
  payload: Array<ProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
}

export interface IndexProceduresPayload {
  q?: string;
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  source?: procedureSource;
  status?: procedureStatus;
  priority?: procedurePriority;
  createdById?: number;
  responsibleGroupId?: number;
  requesterId?: number;
  private?: string;
}

export interface ShowProcedureAPIResponse extends BaseProcedure {
  requester: ProcedureRequester;
  responsibleGroup: ProcedureResponsibleGroup;
  createdBy: ProcedureCreatedBy;
}

export interface BaseProcedure {
  id: number;
  deadline: string | number | Date | null;
  priority: procedurePriority;
  private: boolean;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  source: procedureSource;
  status: procedureStatus;
  schema: Array<ProcedureSchemaItems>;
  payload: Array<ProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
  parentProcedureTemplateName: string | null;
}
export interface CountProceduresByStatusAPIResponse {
  draft: number;
  running: number;
  started: number;
  archived: number;
  finished: number;
}

export interface CountProcedureByStatusPayload {
  responsibleGroupId?: number;
  createdById?: number;
}

export interface ProcedureSchemaItems {
  label: string;
  fieldType: procedureFieldTypes;
  options?: Array<string>;
}

export interface ProcedurePayloadItems {
  label: string;
  fieldType: procedureFieldTypes;
  options?: Array<string>;
  value: any;
}

export interface ArchiveProcedurePayload {
  note: string;
}

export interface UnarchiveProcedurePayload {
  note: string;
}

export interface ProcedureRequester {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: number;
  prn: string;
  code: string;
  email: string;
  optionalEmail: string | null;
  type: procedureSource;
  status: procedureRequesterStatus;
  blocked: boolean;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureResponsibleGroup {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: procedureResponsibleGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureCreatedBy {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: procedureCreatedByStatus;
  username: string;
  changedPassword: boolean;
  registrationNumber: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type procedurePriority = '' | 'high' | 'normal';

export type procedureSource = '' | 'external' | 'internal';

export type procedureStatus =
  | ''
  | 'draft'
  | 'started'
  | 'running'
  | 'finished'
  | 'archived'
  | 'progress';

export type procedureRequesterStatus = 'active' | 'inactive';

export type procedureResponsibleGroupStatus = 'active' | 'inactive';

export type procedureCreatedByStatus = 'active' | 'inactive';

export type procedureFieldTypes =
  | 'attachment'
  | 'checkbox'
  | 'cpf'
  | 'cnpj'
  | 'date'
  | 'email'
  | 'long_text'
  | 'time'
  | 'numeric'
  | 'phone'
  | 'radio'
  | 'select_field'
  | 'short_text';

export interface UpdateProcedureAPIResponse {
  id: number;
  deadline: string | null;
  priority: procedurePriority;
  private: boolean;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  source: procedureSource;
  status: procedureStatus;
  schema: Array<ProcedureSchemaItems>;
  payload: Array<ProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
  requester: ProcedureRequester;
  responsibleGroup: ProcedureResponsibleGroup;
  createdBy: ProcedureCreatedBy;
  parentProcedureTemplateName: string | null;
}

export interface UpdateProcedurePayload {
  responsibleGroupId: number;
  requesterId: number;
  priority: procedurePriority;
  source: procedureSource;
  private: boolean;
  deadline: string | number | Date | null;
  payload: Array<ProcedurePayloadItems>;
}
