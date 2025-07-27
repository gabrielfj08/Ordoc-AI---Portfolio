import {
  ShowProcedureAPIResponse,
  SetAssigneeTaskAPIResponse,
  ShowTaskAPIResponse,
  ShowTaskCommentAPIResponse,
  IndexTaskAttachmentsAPIResponse,
} from '../../../../services/printer-flow/types';
import { SetAssigneeTaskFormValues } from './Appendices/types';

export interface ShowTaskModalProps {
  taskComment: ShowTaskCommentAPIResponse;
  task: ShowTaskAPIResponse;
  justificationVisibility?: boolean;
  resetAssigneeVisibility?: boolean;
  procedure: ShowProcedureAPIResponse;
  taskAttachment: IndexTaskAttachmentsAPIResponse;
}

export interface SetTaskAssigneeModalProps {
  procedure: ShowProcedureAPIResponse;
  task: ShowTaskAPIResponse;
  onSubmit: (
    values: SetAssigneeTaskFormValues
  ) => Promise<SetAssigneeTaskAPIResponse>;
}
export interface ShowTaskModalValues {
  name: string;
  description: string;
}

export interface ShowTaskModalContainerProps {
  taskId: number;
  justificationVisibility?: boolean;
  resetAssigneeVisibility?: boolean;
  procedure?: ShowProcedureAPIResponse;
}

export interface ModalShowButtonsProps {
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
