import {
  IndexDocument,
  IndexShareDocument,
} from '../../../../../../services/printer-air/types';

export interface SharedListModalContainerProps {
  document: IndexDocument;
}

export interface ShareDocumentModalUserListProps {
  sharedDocuments: Array<IndexShareDocument>;
}
