import { ShowExternalTaskAPIResponse } from '../../../../services/flow-cidadao/types';

export interface ShowExternalTakModalContainerProps {
  taskId: number;
  justificationVisibility: boolean;
  attachmentVisibility?: boolean;
  commentVisibility?: boolean;
}

export interface ShowExternalTakModalProps {
  task: ShowExternalTaskAPIResponse;
  justificationVisibility: boolean;
  attachmentVisibility?: boolean;
  commentVisibility?: boolean;
}

export interface RequestFinishProcedureForm {
  description: string;
}

export interface ShowExternalButtonsModalProps {
  task: ShowExternalTaskAPIResponse;
  justificationModalVisibility: boolean;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  acceptTaskHandleSubmit: (values) => void;
  finishTaskHandleSubmit: (values) => void;
}

export interface NewAttachmentTaskFormValues {
  fileList: FileList | null;
}

export interface NewAttachmentTaskListProps {
  task: ShowExternalTaskAPIResponse;
  files: FileList | undefined;
  attachmentUploadListVisibility: boolean;
  onSubmit: (values) => NewAttachmentTaskFormValues;
  attachmentModalVisibility: boolean;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles: React.Dispatch<React.SetStateAction<FileList | undefined>>;
}
