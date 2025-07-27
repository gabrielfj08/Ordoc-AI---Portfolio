import { ShowTaskAPIResponse } from '../../../../../services/printer-flow/types';

export interface AttachmentButtonProps {
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  task: ShowTaskAPIResponse;
}

export interface AttachmentButtonContainerProps {
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  task: ShowTaskAPIResponse;
}
