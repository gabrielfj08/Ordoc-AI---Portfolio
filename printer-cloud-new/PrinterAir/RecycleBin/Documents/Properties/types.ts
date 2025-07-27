import { ShowDocumentAPIResponse } from '../../../../services/printer-air/types/document';
export interface DocumentPropertiesContainerProps {
  documentId: number;
}
export interface DocumentPropertiesProps {
  document: ShowDocumentAPIResponse;
}
