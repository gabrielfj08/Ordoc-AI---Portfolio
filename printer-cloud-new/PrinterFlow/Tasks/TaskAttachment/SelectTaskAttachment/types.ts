import {
  CreateTaskAttachmentAPIResponse,
  taskStatus,
} from '../../../../services/printer-flow/types';
import { multipleSelectItem } from '../../../../types';

export interface SelectTaskAttachmentContainerProps {
  taskId: number;
  taskStatus: taskStatus;
  procedureDocuments: Array<multipleSelectItem>;
  taskDocuments: Array<multipleSelectItem>;
  setMentionVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SelectTaskAttachmentProps {
  taskId: number;
  taskStatus: taskStatus;
  procedureDocuments: Array<multipleSelectItem>;
  taskDocuments: Array<multipleSelectItem>;
  setMentionVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (
    values: SelectTaskAttachmentFormValues
  ) => Promise<CreateTaskAttachmentAPIResponse>;
}

export interface SelectTaskAttachmentFormValues {
  taskId: number;
  taskDocumentIds: Array<number>;
  procedureDocumentIds: Array<number>;
}
