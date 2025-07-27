import {
  BaseTaskDocument,
  ShowTaskDocumentAPIResponse,
} from '../../../../../services/printer-flow/types';

export interface AttachmentTaskItemContainerProps {
  taskDocument: BaseTaskDocument;
}

export interface AttachmentTaskItemProps {
  taskDocument: ShowTaskDocumentAPIResponse;
  handleSubmit: () => void;
}
