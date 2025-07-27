import {
  ShowProcedureAPIResponse,
  taskStatus,
  taskPriority,
} from '../../../../../services/printer-flow/types';

export interface TasksTabContainerProps {
  procedure: ShowProcedureAPIResponse;
}
export interface TasksTabProps {
  params: FilterTasksParams;
  setParams: React.Dispatch<React.SetStateAction<FilterTasksParams>>;
  procedure: ShowProcedureAPIResponse;
}

export interface FilterTasksParams {
  order: string;
  direction: string;
  q: string;
  page: number;
  perPage: number;
  procedureId: number;
  assigneeId?: number;
  createdById?: number;
  status?: taskStatus;
  priority?: taskPriority;
}
