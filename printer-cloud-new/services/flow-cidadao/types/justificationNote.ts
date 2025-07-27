import { APIMetaProperties } from '../../types';
import { externalRequesterStatus } from './externalRequester';

export interface IndexExternalJustificationNotesParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  justifiableId?: number;
  justifiableType?: externalJustifiableType;
}

export interface IndexExternalJustificationNotesAPIResponse {
  justificationNotes: Array<IndexExternalJustificationNote>;
  meta: APIMetaProperties;
}

export interface IndexExternalJustificationNote {
  id: number;
  note: string;
  createdById: number;
  action: string;
  justifiableType: string;
  justifiableId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: justificationNoteCreatedBy;
}

export interface justificationNoteCreatedBy {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: string;
  prn: string;
  code: string | null;
  email: string;
  optionalEmail: string | null;
  type: string;
  status: externalRequesterStatus;
  blocked: boolean;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export type externalJustifiableType =
  | 'requester'
  | 'procedure_template'
  | 'procedure'
  | 'task'
  | 'task_template'
  | 'signature'
  | 'shared_procedure';
