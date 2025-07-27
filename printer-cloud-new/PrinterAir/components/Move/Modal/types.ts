import { OrganizationAPIResponse } from '../../../../services/types';
import { MoveDirectoryActions } from '../../../../services/printer-air/types';
import { MoveDocumentActions } from '../../../../services/printer-air/types';

export interface MoveItemsModalProps {
  indexDirectoriesParams: IndexDirectoriesParams;
  onSubmit: (values: MoveItemsFormValues) => void;
  organizationId: number;
  selectedDirectoryIds: Array<number>;
  selectedDocumentIds: Array<number>;
  setIndexDirectoriesParams: React.Dispatch<
    React.SetStateAction<IndexDirectoriesParams>
  >;
}

export interface MoveItemsFormValues {
  directoryIds: Array<number>;
  documentIds: Array<number>;
  batchAction: MoveDocumentActions | MoveDirectoryActions;
  payload: MoveItemsFormPayload;
}

export interface MoveItemsFormPayload {
  directoryId: number;
}

export interface MoveItemsModalContainerProps {
  organization: OrganizationAPIResponse | null;
  selectedDirectoryIds: Array<number>;
  selectedDocumentIds: Array<number>;
}

export interface IndexDirectoriesParams {
  directoryId: number;
  perPage: number;
}
