import {
  IndexDocumentVersion,
  DeleteDocumentVersionAPIResponse,
} from '../../../../services/printer-air/types';

export interface DocumentVersionContainerProps {
  documentVersion: IndexDocumentVersion;
  title: string;
  total: number;
}

export interface DocumentVersionProps {
  documentVersion: IndexDocumentVersion;
  title: string;
  total: number;
  onDownload: () => void;
  onDelete: () => Promise<DeleteDocumentVersionAPIResponse>;
}
