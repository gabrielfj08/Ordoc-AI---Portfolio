import { FilterProceduresParams } from '../types';

export interface ProceduresArchivedTabProps {
  params: FilterProceduresParams;
  setParams: React.Dispatch<React.SetStateAction<FilterProceduresParams>>;
}

export type procedureSource = '' | 'internal' | 'external';

export type procedureStatus =
  | ''
  | 'draft'
  | 'started'
  | 'running'
  | 'finished'
  | 'archived'
  | 'progress';

export type procedurePriority = '' | 'normal' | 'high';
