import {
  IndexDocument,
  ShareDocumentAPIResponse,
} from '../../../../../services/printer-air/types';

export interface SharedModalContainerProps {
  document: IndexDocument;
}
export interface SharedModalProps {
  document: IndexDocument;
  onSubmit: (
    values: ShareDocumentModalFormValues
  ) => Promise<ShareDocumentAPIResponse>;
}

export interface ShareDocumentModalFormValues {
  userId: number;
  documentId: number;
}
