import { ShowTaskAPIResponse } from '../../../../../../services/printer-flow/types';

export interface AttachmentUploadListContainerProps {
  task: ShowTaskAPIResponse;
  fileList: FileList;
}

export interface AttachmentUploadListProps {
  taskId: number;
  taskDocumentUploadJobIds: Array<number>;
}
