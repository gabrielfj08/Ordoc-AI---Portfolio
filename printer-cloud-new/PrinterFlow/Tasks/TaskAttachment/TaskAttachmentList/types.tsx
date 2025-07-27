import { IndexTaskAttachment } from '../../../../services/printer-flow/types';

export interface TaskAttachmentListContainerProps {
  taskId: number;
}

export interface TaskAttachmentListProps {
  taskAttachments: Array<IndexTaskAttachment>;
}
