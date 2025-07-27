import { APIMetaProperties } from '../../types';

export interface IndexProcedureTemplateAPIResponse {
  procedureTemplates: Array<IndexProcedureTemplate>;
  meta: APIMetaProperties;
}

export interface BaseProcedureTemplate {
  id: number;
  name: string;
  prn: string;
  source: procedureTemplateSource;
  status: procedureTemplateStatus;
  organizationId: number;
  parentProcedureTemplateId: number | null;
  groupRequesterId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IndexProcedureTemplate extends BaseProcedureTemplate {
  childrenCount: number;
}

export interface ShowProcedureTemplate extends BaseProcedureTemplate {
  groupRequester: ShowGroupRequesterProcedureTemplate | null;
  proceduresCount: number;
}

export interface UpdateProcedureTemplate extends BaseProcedureTemplate {
  groupRequester?: ShowGroupRequesterProcedureTemplate | null;
}

export interface IndexProcedureTemplatePayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  source?: procedureTemplateSource;
  status?: procedureTemplateStatus;
  q?: string;
  parentProcedureTemplateId?: number;
  root?: boolean;
}

export interface ShowGroupRequesterProcedureTemplate {
  id: number;
  name: string;
  parentGroupId: number;
  prn: string;
  code: string;
  status: procedureTemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcedureTemplatePayload {
  name: string;
  groupRequesterId: number | null;
  parentProcedureTemplateId: number;
  source: string;
}

export interface UpdateProcedureTemplatePayload {
  name: string;
  groupRequesterId?: number | null;
  source: string;
}

export interface DeactivateProcedureTemplatePayload {
  note: string;
}

export type procedureTemplateSource =
  | ''
  | 'external'
  | 'internal'
  | 'internal_external';

export type procedureTemplateStatus = '' | 'active' | 'inactive';
