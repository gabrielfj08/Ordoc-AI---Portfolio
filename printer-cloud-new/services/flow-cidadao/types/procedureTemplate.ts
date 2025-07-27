import { APIMetaProperties } from '../../types';

export interface IndexExternalProcedureTemplateAPIResponse {
  procedureTemplates: Array<IndexExternalProcedureTemplate>;
  meta: APIMetaProperties;
}

export interface ExternalBaseProcedureTemplate {
  id: number;
  name: string;
}

export interface IndexExternalProcedureTemplate
  extends ExternalBaseProcedureTemplate {}

export interface ExternalProcedureTemplatePayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  parentProcedureTemplateId?: number;
  q?: string;
  root?: boolean;
}

export interface ShowExternalProcedureTemplateAPIResponse
  extends ExternalBaseProcedureTemplate {
  groupRequester: ResponsibleGroupRequester | null;
}

export interface ResponsibleGroupRequester {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: groupRequesterStatus;
  createdAt: string;
  updatedAt: string;
}

export type groupRequesterStatus = 'active' | 'inactive';
