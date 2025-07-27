import {
  IndexExternalTaskDocument,
  ShowExternalTaskAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface AttachmentExternalTaskListContainerProps {
  task: ShowExternalTaskAPIResponse;
}

export interface AttachmentTaskListProps {
  taskDocuments: Array<IndexExternalTaskDocument>;
}
