import { ShowDocumentAPIResponse } from '../../../../../services/printer-air/types';

export interface DocumentPreviewModalContainerProps {
  documentId: number;
}

export interface DocumentPreviewModalProps {
  document: ShowDocumentAPIResponse;
}
