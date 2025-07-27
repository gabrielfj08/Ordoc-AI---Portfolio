import {
  ShowTaskAPIResponse,
  taskStatus,
} from '../../../services/printer-flow/types';
import { multipleSelectItem } from '../../../types';

export interface TaskAttachmentContainerProps {
  taskStatus: taskStatus;
  task: ShowTaskAPIResponse;
  setMentionVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TaskAttachmentProps {
  taskDocuments: Array<multipleSelectItem>;
  procedureDocuments: Array<multipleSelectItem>;
  taskId: number;
  taskStatus: taskStatus;
  setMentionVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}
