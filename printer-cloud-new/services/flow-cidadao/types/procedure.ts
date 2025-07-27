import { APIMetaProperties } from '../../types';
import {
  externalRequesterNotification,
  externalRequesterStatus,
} from './externalRequester';

export interface CreateExternalProcedureAPIResponse {
  id: number;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  status: externalProcedureStatus;
  schema: Array<ExternalProcedureSchemaItems>;
  payload: Array<ExternalProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
  parentProcedureTemplateName: string;
  requester: ExternalProcedureRequester;
  responsibleGroup: ExternalProcedureResponsibleGroup;
}

export interface CreateExternalProcedurePayload {
  procedureTemplateId: number;
}

export interface CreateExternalProcedurePayload {
  procedureTemplateId: number;
}

export interface CreateExternalProcedureAPIResponse {
  id: number;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  status: externalProcedureStatus;
  schema: Array<ExternalProcedureSchemaItems>;
  payload: Array<ExternalProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
  parentProcedureTemplateName: string;
  requester: ExternalProcedureRequester;
  responsibleGroup: ExternalProcedureResponsibleGroup;
}

export interface RequestFinishProcedurePayload {
  description: string;
}

export interface RequestFinishProcedureAPIResponse
  extends CreateExternalProcedureAPIResponse {}

export interface IndexExternalProcedure {
  id: number;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  status: externalProcedureStatus;
  schema: Array<ExternalProcedureSchemaItems>;
  payload: Array<ExternalProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
}

export interface IndexExternalProceduresAPIResponse {
  procedures: Array<IndexExternalProcedure>;
  meta: APIMetaProperties;
}

export interface IndexExternalProcedureParams {
  q?: string;
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  requesterId?: number;
  status?: externalProcedureStatus;
  createdAtGte?: string;
  createdAtLte?: string;
}

export interface RunExternalProcedureAPIResponse
  extends ShowExternalProcedureAPIResponse {}

export interface ShowExternalProcedureAPIResponse {
  id: number;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  status: externalProcedureStatus;
  schema: Array<ExternalProcedureSchemaItems>;
  payload: Array<ExternalProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
  parentProcedureTemplateName: string;
  requester: ExternalProcedureRequester;
  responsibleGroup: ExternalProcedureResponsibleGroup;
}

export interface UpdateExternalProcedureAPIResponse {
  id: number;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  status: externalProcedureStatus;
  schema: Array<ExternalProcedureSchemaItems>;
  payload: Array<ExternalProcedurePayloadItems>;
  createdAt: string;
  updatedAt: string;
  parentProcedureTemplateName: string;
  requester: ExternalProcedureRequester;
  responsibleGroup: ExternalProcedureResponsibleGroup;
}

export interface UpdateExternalProcedurePayload {
  payload: Array<ExternalProcedurePayloadItems>;
}

export interface ExternalProcedureResponsibleGroup {
  id: number;
  name: string;
  parentGroupId: string | null;
  prn: string;
  code: string;
  status: externalRequesterStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalProcedureSchemaItems {
  label: string;
  fieldType: externalProcedureFieldTypes;
  options?: Array<string>;
}

export interface ExternalProcedurePayloadItems {
  label: string;
  fieldType: externalProcedureFieldTypes;
  options?: Array<string>;
  value: string | number | Array<string>;
}

export interface ExternalProcedureRequester {
  id: number;
  name: string;
  email: string;
  cpfCnpj: string;
  birthDate: string;
  phone: string;
  optionalEmail: string | null;
  optionalPhone: string | null;
  occupation: string | null;
  notification: externalRequesterNotification;
  status: externalRequesterStatus;
  blocked: boolean;
  prn: string;
  organizationId: number;
  changedPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export type externalProcedureFieldTypes =
  | 'attachment'
  | 'checkbox'
  | 'cnpj'
  | 'cpf'
  | 'date'
  | 'email'
  | 'long_text'
  | 'numeric'
  | 'phone'
  | 'radio'
  | 'select_field'
  | 'short_text'
  | 'time';

export type externalProcedureStatus =
  | ''
  | 'draft'
  | 'started'
  | 'archived'
  | 'finished'
  | 'running';
