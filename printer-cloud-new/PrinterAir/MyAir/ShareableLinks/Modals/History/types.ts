import { IndexShareableLink } from '../../../../../services/printer-air/types';
export interface ShareableLinksHistoryModalContainerProps {
  documentId: number;
}
export interface ShareableLinksHistoryModalProps {
  documentId: number;
  shareableLinks: Array<IndexShareableLink>;
}
export interface DestroyShareableLinkModalFormValues {
  documentId: number;
  id: number;
}
