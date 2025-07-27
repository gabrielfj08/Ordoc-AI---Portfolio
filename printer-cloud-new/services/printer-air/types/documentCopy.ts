export type documentCopyStatus = 'created' | 'running' | 'finished' | 'failed';

export interface CreateDocumentCopyAPIResponse {
  id: number;
  status: documentCopyStatus;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowDocumentCopyAPIResponse {
  id: number;
  status: documentCopyStatus;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}
