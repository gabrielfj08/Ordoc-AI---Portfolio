import { ShareDocumentAPIResponse } from '../../../../../services/printer-air/types';

export interface DocumentShareJobContainerProps {
  batchOperationJob: ShareDocumentAPIResponse;
}

export interface DocumentShareJobProps {
  shareDocumentId: number;
}
