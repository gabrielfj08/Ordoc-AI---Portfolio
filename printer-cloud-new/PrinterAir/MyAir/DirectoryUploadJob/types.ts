import { directoryUploadJobStatus } from '../../../services/printer-air/types';

export interface DirectoryUploadJobContainerProps {
  directoryName: string;
  id: number;
}

export interface DirectoryUploadJobProps {
  directoryName: string;
  status: directoryUploadJobStatus;
}
