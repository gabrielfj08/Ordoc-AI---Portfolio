import { TaskGroupAssignee } from '../../../services/printer-flow/types';

export interface SelectGroupRequestersContainerProps {
  name: string;
  groupRequester: TaskGroupAssignee | null;
}

export interface SelectGroupRequestersProps {
  name: string;
  groupRequester: TaskGroupAssignee | null;
}
