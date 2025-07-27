import {
  BaseTaskComment,
  UpdateTaskCommentAPIResponse,
} from '../../../../services/printer-flow/types/taskComment';

export interface TaskCommentListContainerProps {
  taskId: number;
  taskComments: BaseTaskComment;
}

export interface TaskCommentListProps {
  setType: React.Dispatch<React.SetStateAction<commentTypeOption>>;
  taskComments: BaseTaskComment;
  type: commentTypeOption;
  onSubmit: (
    values: EditTaskCommentFormValues
  ) => Promise<UpdateTaskCommentAPIResponse>;
}

export interface EditTaskCommentContainerProps {
  taskComment: BaseTaskComment;
  setType: React.Dispatch<React.SetStateAction<commentTypeOption>>;
  type: commentTypeOption;
  onSubmit: (
    values: EditTaskCommentFormValues
  ) => Promise<UpdateTaskCommentAPIResponse>;
}

export interface EditTaskCommentProps {
  taskComment: BaseTaskComment;
  setType: React.Dispatch<React.SetStateAction<commentTypeOption>>;
  type: commentTypeOption;
}

export interface EditTaskCommentFormValues {
  body: any;
}

export type commentTypeOption = 'edit' | 'show';
