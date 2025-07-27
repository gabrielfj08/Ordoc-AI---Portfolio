import {
  TrashDocumentStatus,
  TrashDirectoryStatus,
} from '../../../../services/printer-air/types';

export interface RemoveJobsContainerProps {
  removeDirectoryJobId: number | null;
  removeDocumentJobId: number | null;
}

export interface RemoveJobsProps {
  status: TrashDirectoryStatus | TrashDocumentStatus;
}
