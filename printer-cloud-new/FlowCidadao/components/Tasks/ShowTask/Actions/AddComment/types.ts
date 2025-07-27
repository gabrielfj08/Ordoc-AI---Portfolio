import {
  CreateExternalTaskCommentAPIResponse,
  ShowExternalTaskAPIResponse,
  taskExternalStatus,
} from '../../../../../../services/flow-cidadao/types';

export interface AddExternalCommentModalContainerProps {
  status: taskExternalStatus;
  task: ShowExternalTaskAPIResponse;
  commentModalVisibility: boolean;
  setCommentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddExternalCommentModalProps {
  commentModalVisibility: boolean;
  onSubmit: (
    values: AddExternalCommentaskFormValues
  ) => Promise<CreateExternalTaskCommentAPIResponse>;
  setCommentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddExternalCommentaskFormValues {
  body: string;
}
