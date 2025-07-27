import {
  ResetTaskAssigneeAPIResponse,
  ShowTaskAPIResponse,
} from '../../../../../services/printer-flow/types';

export interface ResetAssigneeFormProps {
  task: ShowTaskAPIResponse;
  resetGroupAssignee: boolean;
  setResetGroupAssignee: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (
    values: ResetTaskAssigneeFormValues
  ) => Promise<ResetTaskAssigneeAPIResponse>;
}

export interface ResetAssigneeFormContainerProps {
  task: ShowTaskAPIResponse;
  resetGroupAssignee: boolean;
  setResetGroupAssignee: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ResetTaskAssigneeFormValues {
  note: string;
  groupAssigneeId: number;
}
