import { IndexTask, taskStatus } from '../../../../services/printer-flow/types';
import { FilterTasksParams } from '../Tabs/types';

export interface TasksTableContainerProps {
  params: FilterTasksParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface TasksTableProps {
  data: Array<IndexTask>;
  filter: taskStatus;
}

export interface TasksTableErrorProps {
  status: taskStatus;
}

export interface TasksTableEmptyProps {
  status: taskStatus;
}
