export type documentVersionUploadJobStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
export interface CreateDocumentVersionUploadJobAPIResponse {
  id: number;
  status: documentVersionUploadJobStatus;
  s3Key: string;
  location: string;
  description: string;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateDocumentVersionUploadJobPayload {
  s3Key: string;
  location: string;
  description: string;
}
export interface ShowDocumentVersionUploadJobAPIResponse {
  id: number;
  status: documentVersionUploadJobStatus;
  s3Key: string;
  location: string;
  description: string;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}
