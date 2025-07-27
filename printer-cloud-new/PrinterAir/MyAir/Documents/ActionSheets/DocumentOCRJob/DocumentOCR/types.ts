import { documentOCRStatus } from '../../../../../../services/printer-air/types';

export interface DocumentOCRContainerProps {
  batchOperationId: number;
}

export interface DocumentOCRProps {
  status: documentOCRStatus;
}
