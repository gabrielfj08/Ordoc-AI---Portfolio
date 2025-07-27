export interface FilterButtonProcedureProps {
  children: React.ReactNode;
  params: FilterProcedureParams;
  setParams: React.Dispatch<React.SetStateAction<FilterProcedureParams>>;
}
export interface FilterButtonProcedureContainerProps {
  children: React.ReactNode;
  params: FilterProcedureParams;
  setParams: React.Dispatch<React.SetStateAction<FilterProcedureParams>>;
}

export interface FilterProcedureParams {
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
  | 'archived'
  | 'finished'
  | 'running'
  | 'progress';

export type procedurePriority = '' | 'normal' | 'high';
