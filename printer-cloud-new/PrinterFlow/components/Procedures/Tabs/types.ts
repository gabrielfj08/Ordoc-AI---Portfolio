export interface TabProps {
  children?: React.ReactNode;
  totalProceduresDrafts: number;
  totalProceduresArchived: number;
  totalProceduresRunning: number;
  totalProceduresFinished: number;
}

export interface FilterProceduresParams {
  order: string;
  direction: string;
  page: number;
  perPage: number;
  source: procedureSource;
  status: procedureStatus;
  priority: procedurePriority;
  private: string;
  createdById?: number;
  responsibleGroupId?: number;
  requesterId?: number;
  q: string;
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
