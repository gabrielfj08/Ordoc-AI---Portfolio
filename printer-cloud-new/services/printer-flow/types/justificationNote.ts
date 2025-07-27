import { APIMetaProperties } from '../../types';

export interface IndexJustificationNotes {
  justificationNotes: Array<IndexJustificationNote>;
  meta: APIMetaProperties;
}

export interface BaseJustificationNote {
  id: number;
  note: string;
  createdById: number;
  action: JustificationNoteAction;
  justifiableType: string;
  justifiableId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexJustificationNote extends BaseJustificationNote {
  createdBy: JustificationNoteCreatedBy;
}

export interface JustificationNoteCreatedBy {
  id: number;
  organizationId: number;
  name: string;
  email: string;
  cpfCnpj: string;
  status: JustificationNoteCreatedByStatus;
  prn: string;
  createdAt: string;
  updatedAt: string;
  code: string | null;
  parentGroupId: number | null;
  phone: string;
  optionalPhone: string | null;
  birthDate: string;
  optionalEmail: string | null;
  occupation: string;
}

export interface JustificationNotesParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  justifiableId: number;
  justifiableType: justifiableTypeParams;
}

export type JustificationNoteAction =
  | 'archive'
  | 'create'
  | 'deactivate'
  | 'finish'
  | 'unarchive';

export type JustificationNoteCreatedByStatus = 'active' | 'inactive';

export type justifiableTypeParams =
  | 'requester'
  | 'procedure_template'
  | 'procedure'
  | 'task'
  | 'task_template'
  | 'signature';
