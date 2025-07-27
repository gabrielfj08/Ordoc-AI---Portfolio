import { ShowExternalTaskDocumentAPIResponse } from '../../../../../../services/flow-cidadao/types';
import { IndexExternalTaskDocument } from '../../../../../../services/flow-cidadao/types/taskDocument';

export interface AttachmentTaskItemContainerProps {
  taskDocument: IndexExternalTaskDocument;
}

export interface AttachmentTaskItemProps {
  taskDocument: ShowExternalTaskDocumentAPIResponse;
}
