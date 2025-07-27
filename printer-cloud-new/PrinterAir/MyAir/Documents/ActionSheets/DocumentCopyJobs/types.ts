import {
  IndexDocument,
  CreateDocumentCopyAPIResponse,
} from '../../../../../services/printer-air/types';

export interface DocumentCopyJobsContainerProps {
  document: IndexDocument;
}

export interface DocumentCopyJobsProps {
  document: IndexDocument;
  documentCopy: CreateDocumentCopyAPIResponse;
}
