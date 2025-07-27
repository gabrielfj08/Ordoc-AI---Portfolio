import { moveJobStatus } from '../../../../services/printer-air/types';

export interface MoveJobProps {
  status: moveJobStatus;
}

export interface MoveJobsContainerProps {
  moveDirectoryJobId: number | null;
  moveDocumentJobId: number | null;
}
