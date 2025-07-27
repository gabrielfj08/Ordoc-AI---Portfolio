import { IndexExternalTask } from '../../../../services/flow-cidadao/types';
import { IndexExternalTasksParams } from '../../../../services/flow-cidadao/types';

export interface TaskTableProps {
  data: Array<IndexExternalTask>;
  color: string;
}

export interface CellProps {
  task: IndexExternalTask;
}

export interface TasksTableContainerProps {
  params: IndexExternalTasksParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}
