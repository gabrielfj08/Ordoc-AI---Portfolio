import {
  ShowProcedureAPIResponse,
  ShowTaskAPIResponse,
  RefuseTaskAPIResponse,
  CreateTaskCommentAPIResponse,
  ShowTaskCommentAPIResponse,
  taskStatus,
} from '../../../../../services/printer-flow/types';

export interface ShowTaskModalAppendicesContainerProps {
  procedure: ShowProcedureAPIResponse;
  status: taskStatus;
  task: ShowTaskAPIResponse;
  commentModalVisibility: boolean;
  attachmentModalVisibility: boolean;
  justificationModalVisibility: boolean;
  setCommentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export interface RefuseTaskModalAppendiceProps {
  justificationModalVisibility: boolean;
  onSubmit: (values: RefuseTaskFormValues) => Promise<RefuseTaskAPIResponse>;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export interface AddCommentModalAppendiceProps {
  taskComments?: ShowTaskCommentAPIResponse;
  commentModalVisibility: boolean;
  setCommentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (
    values: AddCommentaskFormValues
  ) => Promise<CreateTaskCommentAPIResponse>;
}

export interface AddCommentaskFormValues {
  body: string;
}

export interface RefuseTaskFormValues {
  note: string;
}

export interface SetAssigneeTaskFormValues {
  groupAssigneeId: number | null;
}
