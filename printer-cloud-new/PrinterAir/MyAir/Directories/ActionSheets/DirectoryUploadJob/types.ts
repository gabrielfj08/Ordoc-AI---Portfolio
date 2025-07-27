import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface DirectoryUploadJobsContainerProps {
  description: string;
  location: string;
  fileList: FileList;
  parentDirectory: ShowDirectoryAPIResponse;
  ocr: boolean;
}

export interface DirectoryUploadJobsProps {
  directoryUploadJobId: number | null;
  directoryName: string;
}
