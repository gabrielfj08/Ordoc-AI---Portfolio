import {
  ShowTaskAPIResponse,
  taskPriority,
} from '../../../../services/printer-flow/types';
import { UpdateTaskAPIResponse } from '../../../../services/printer-flow/types/task';

export interface EditTaskModalContainerProps {
  task: ShowTaskAPIResponse;
  justificationModalVisibility: boolean;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  commentModalVisibility: boolean;
  setCommentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  attachmentModalVisibility: boolean;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface EditTaskModalProps {
  task: ShowTaskAPIResponse;
  onSubmit: (values: UpdateTaskFormValue) => Promise<UpdateTaskAPIResponse>;
  justificationModalVisibility: boolean;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  commentModalVisibility: boolean;
  setCommentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  attachmentModalVisibility: boolean;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UpdateTaskFormValue {
  name: string;
  description: string;
  priority: taskPriority;
  deadline: any;
}
