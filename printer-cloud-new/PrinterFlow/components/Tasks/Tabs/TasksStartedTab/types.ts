import { FilterTasksParams } from '../types';

export interface TasksStartedTabProps {
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
