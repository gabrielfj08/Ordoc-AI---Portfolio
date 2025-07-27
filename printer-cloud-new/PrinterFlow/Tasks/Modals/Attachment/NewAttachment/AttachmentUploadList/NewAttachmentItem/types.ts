import { ShowTaskDocumentAPIResponse } from '../../../../../../../services/printer-flow/types';

export interface NewTaskAttachmentItemContainerProps {
  taskId: number;
  taskDocumentUploadJobId: number;
}

export interface NewTaskAttachmentItemProps {
  taskDocument: ShowTaskDocumentAPIResponse;
  itemVisibility: boolean;
  setItemVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}
