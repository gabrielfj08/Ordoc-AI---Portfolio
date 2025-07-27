import { downloadJobStatus } from '../../../services/printer-air/types';

export interface DownloadJobProps {
  status: downloadJobStatus;
  zipfileName: string;
}

export interface DownloadJobContainerProps {
  downloadJobId: number;
}
