import {
  IndexExternalTaskDocument,
  ShowExternalTaskAPIResponse,
  ShowExternalTaskDocumentAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface AttachmentTaskItemContainerProps {
  taskDocument: IndexExternalTaskDocument;
  task: ShowExternalTaskAPIResponse;
}

export interface AttachmentTaskItemProps {
  taskDocument: ShowExternalTaskDocumentAPIResponse;
  handleSubmit: () => void;
  task: ShowExternalTaskAPIResponse;
}
