import {
  taskPriority,
  taskStatus,
} from '../../../../services/printer-flow/types';

export interface TabProps {
  children?: React.ReactNode;
  totalTasksRefused: number;
  totalTasksStarted: number;
  totalTasksRunning: number;
  totalTasksFinished: number;
}

export interface FilterTasksParams {
  order?: string;
  direction?: string;
  q?: string;
  page?: number;
  perPage?: number;
  procedureId?: number;
  groupAssigneeId?: number;
  assigneeId?: number;
  createdById?: number;
  status: taskStatus;
  priority?: taskPriority;
}
