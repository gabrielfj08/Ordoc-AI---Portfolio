import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface DocumentUploadJobsContainerProps {
  description: string;
  location: string;
  fileList: FileList;
  parentDirectory: ShowDirectoryAPIResponse;
  ocr: boolean;
}

export interface DocumentUploadJobsProps {
  documentUploadJobIds: Array<number>;
}
