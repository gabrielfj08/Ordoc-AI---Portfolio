import { ShowDocumentAPIResponse } from '../../../../../../services/printer-air/types';

export interface EditDocumentInfoContainerProps {
  documentId: number;
}

export interface EditDocumentInfoProps {
  document: ShowDocumentAPIResponse;
}
