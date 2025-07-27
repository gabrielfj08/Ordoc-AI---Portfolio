import { SharedDocumentStatus } from '../../../../../../services/printer-air/types';

export interface DocumentShareContainerProps {
  shareDocumentId: number;
}

export interface DocumentShareProps {
  status: SharedDocumentStatus;
}
