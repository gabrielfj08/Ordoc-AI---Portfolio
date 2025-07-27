import {
  procedureTemplateSource,
  procedureTemplateStatus,
} from './procedureTemplate';

export interface CreateGroupRequesterInfoAPIResponse {
  id: number;
  status: groupRequesterInfoStatus;
  proceduresCount: number;
  groupRequesterId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  childrenProcedureTemplates: Array<ChildrenProcedureTemplate>;
}

export interface ShowGroupRequesterInfoAPIResponse
  extends CreateGroupRequesterInfoAPIResponse {}

export interface ChildrenProcedureTemplate {
  id: number;
  name: string;
  prn: string;
  source: procedureTemplateSource;
  status: procedureTemplateStatus;
  organizationId: number;
  parentProcedureTemplateId: number;
  groupRequesterId: number;
  createdAt: string;
  updatedAt: string;
}

export type groupRequesterInfoStatus =
  | 'failed'
  | 'created'
  | 'running'
  | 'finished';
