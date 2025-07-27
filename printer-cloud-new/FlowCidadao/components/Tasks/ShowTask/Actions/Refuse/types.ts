import {
  RefuseExternalTaskAPIResponse,
  ShowExternalTaskAPIResponse,
  taskExternalStatus,
} from '../../../../../../services/flow-cidadao/types';

export interface TaskExternalActionsModalProps {
  status: taskExternalStatus;
  task: ShowExternalTaskAPIResponse;
  justificationModalVisibility: boolean;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export interface RefuseExternalTaskFormValues {
  note: string;
}

export interface RefuseExternalTaskModalProps {
  justificationModalVisibility: boolean;
  onSubmit: (
    values: RefuseExternalTaskFormValues
  ) => Promise<RefuseExternalTaskAPIResponse>;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export interface AddExternalDocumentTaskFormValues {
  name: string;
  s3Key: string;
}
