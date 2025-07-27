import { ShowTaskAPIResponse } from '../../../../../services/printer-flow/types';

export interface NewAttachmentTaskListContainerProps {
  task: ShowTaskAPIResponse;
  attachmentModalVisibility: boolean;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NewAttachmentTaskListProps {
  task: ShowTaskAPIResponse;
  files: FileList | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  attachmentUploadListVisibility: boolean;
  attachmentModalVisibility: boolean;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NewAttachmentTaskFormValues {
  fileList: FileList | null;
}
