import {
  MoveDirectoryActions,
  MoveDocumentActions,
} from '../../../../services/printer-air/types';
import { MoveItemsFormPayload } from '../Modal/types';

export interface MoveJobsActionSheetProps {
  moveDirectoryJobId: number | null;
  moveDocumentJobId: number | null;
}

export interface MoveJobsActionSheetContainerProps {
  batchAction: MoveDocumentActions | MoveDirectoryActions;
  directoryIds: Array<number>;
  documentIds: Array<number>;
  organizationId: number;
  payload: MoveItemsFormPayload;
}
