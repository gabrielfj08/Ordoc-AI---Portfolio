import {
  IndexExternalTask,
  IndexExternalTasksParams,
} from '../../../services/flow-cidadao/types';

export interface ExternalTasksTableContainerProps {
  params: IndexExternalTasksParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface ExternalTasksTableProps {
  data: Array<IndexExternalTask>;
  color: string;
}

export interface CellProps {
  task: IndexExternalTask;
}
