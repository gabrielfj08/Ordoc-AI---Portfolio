import { BaseTaskDocument } from '../../../../../services/printer-flow/types';

export interface AttachmentTaskListContainerProps {
  taskId: number;
}

export interface AttachmentTaskListProps {
  taskDocuments: Array<BaseTaskDocument>;
}
