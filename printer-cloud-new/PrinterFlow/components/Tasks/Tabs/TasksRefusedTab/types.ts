import { FilterTasksParams } from '../types';

export interface TasksRefusedTabProps {
  params: any;
  setParams: React.Dispatch<React.SetStateAction<FilterTasksParams>>;
}

export type procedureStatus =
  | ''
  | 'draft'
  | 'started'
  | 'running'
  | 'finished'
  | 'archived';
