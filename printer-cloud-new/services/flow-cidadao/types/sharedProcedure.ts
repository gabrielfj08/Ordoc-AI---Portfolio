import { APIMetaProperties } from '../../types';
import { externalRequesterStatus } from './externalRequester';
import { externalProcedureStatus } from './procedure';

export interface BaseSharedProcedure {
  id: number;
  status: externalSharedProcedureStatus;
  externalRequesterId: number;
  procedureId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexSharedProceduresAPIResponse {
  sharedProcedures: Array<IndexSharedProcedure>;
  meta: APIMetaProperties;
}

export interface IndexSharedProceduresParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  procedureId?: number;
  externalRequesterId?: number;
  createdById?: number;
  status?: externalSharedProcedureStatus;
}

export interface IndexSharedProcedure extends BaseSharedProcedure {
  procedure: IndexSharedProcedureProcedure;
  externalRequester: IndexSharedProcedureExternalRequester;
  createdBy: IndexSharedProcedureExternalRequester;
}

export interface IndexSharedProcedureProcedure {
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
  schema: Array<IndexSharedProcedureSchemaItem>;
  payload: Array<IndexSharedProcedurePayloadItem>;
  createdAt: string;
  updateAt: string;
}

export interface IndexSharedProcedureExternalRequester {
  id: number;
  name: string;
  email: string;
  cpfCnpj: number;
  birthDate: string;
  phone: string;
  optionalEmail: string;
  optionalPhone: string;
  occupation: string;
  notification: string;
  status: externalRequesterStatus;
  blocked: boolean;
  prn: string;
  organizationId: number;
  changedPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IndexSharedProcedureSchemaItem {
  label: string;
  fieldType: string;
  options?: Array<string>;
}

export interface IndexSharedProcedurePayloadItem {
  label: string;
  fieldType: string;
  value: string;
  options?: Array<string>;
}

export interface CreateSharedProcedurePayload {
  cpfCnpj: string;
  procedureId: number;
}

export interface CreateSharedProcedureAPIResponse extends BaseSharedProcedure {}

export type externalSharedProcedureStatus =
  | ''
  | 'created'
  | 'accepted'
  | 'refused'
  | 'allStatus';

export interface AcceptSharedProcedureAPIResponse extends BaseSharedProcedure {}

export interface RefuseSharedProcedurePayload {
  note: string;
}

export interface RefuseSharedProcedureAPIResponse extends BaseSharedProcedure {}

export interface DestroySharedProcedureAPIResponse
  extends BaseSharedProcedure {}
