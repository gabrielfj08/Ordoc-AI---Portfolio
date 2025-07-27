import {
  IndexDocument,
  ShowDocumentCopyAPIResponse,
} from '../../../../services/printer-air/types';

export interface DocumentCopyJobContainerProps {
  document: IndexDocument;
  documentCopy: ShowDocumentCopyAPIResponse;
}

export interface DocumentCopyJobProps {
  document: IndexDocument;
  documentCopy: ShowDocumentCopyAPIResponse;
}
