import {
  ShowProcedureAPIResponse,
  IndexTask,
} from '../../../../../../services/printer-flow/types';
import { FilterTasksParams } from '../types';

export interface TasksTableContainerProps {
  procedure: ShowProcedureAPIResponse;
  params: FilterTasksParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface TasksTableProps {
  data: Array<IndexTask>;
  procedure: ShowProcedureAPIResponse;
}
