import {
  IndexExternalTaskComment,
  ShowExternalTaskAPIResponse,
  UpdateExternalTaskCommentAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface TaskExternalCommentListContainerProps {
  task: ShowExternalTaskAPIResponse;
  taskComments: IndexExternalTaskComment;
}

export interface TaskExtenalCommentItemProps {
  createdBy: string;
  type: commentTypeOption;
  task: ShowExternalTaskAPIResponse;
  setType: React.Dispatch<React.SetStateAction<commentTypeOption>>;
  taskComments: IndexExternalTaskComment;
  onSubmit: (
    values: UpdateExternalTaskCommentFormValues
  ) => Promise<UpdateExternalTaskCommentAPIResponse>;
}

export interface UpdateExternalTaskCommentFormValues {
  body: string;
}

export type commentTypeOption = 'edit' | 'show';
