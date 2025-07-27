import { restoreJobStatus } from '../../../services/printer-air/types';

export interface RestoreJobProps {
  status: restoreJobStatus;
}

export interface RestoreJobsContainerProps {
  restoreDirectoryJobId: number | null;
  restoreDocumentJobId: number | null;
}
