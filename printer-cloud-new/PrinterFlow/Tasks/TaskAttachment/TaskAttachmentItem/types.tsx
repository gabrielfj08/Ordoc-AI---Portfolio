import {
  BaseTaskAttachment,
  ShowTaskAttachmentAPIResponse,
} from '../../../../services/printer-flow/types';

export interface TaskAttachmentItemContainerProps {
  taskAttachment: BaseTaskAttachment;
}

export interface TaskAttachmentItemProps {
  taskAttachment: ShowTaskAttachmentAPIResponse;
  handleSubmit: () => void;
}
