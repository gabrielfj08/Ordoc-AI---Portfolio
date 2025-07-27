import { IndexExternalTasksParams } from '../../../../services/flow-cidadao/types';

export interface TasksTableContainerProps {
  color?: string;
  params: IndexExternalTasksParams;
  setParams: React.Dispatch<React.SetStateAction<any>>;
}

export interface TasksTableProps {
  color?: string;
}
