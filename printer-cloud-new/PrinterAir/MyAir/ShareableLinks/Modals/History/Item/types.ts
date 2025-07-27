import { IndexShareableLink } from '../../../../../../services/printer-air/types';
export interface ShareableLinksModalHistoryItemProps {
  shareableLinks: Array<IndexShareableLink>;
  onSubmit: (id: number) => Promise<void>;
}
export interface DestroyShareableLinkModalFormValues {
  documentId: number;
  id: number;
}
export interface ShareableLinksModalHistoryItemContainerProps {
  shareableLinks: Array<IndexShareableLink>;
  documentId: number;
}
