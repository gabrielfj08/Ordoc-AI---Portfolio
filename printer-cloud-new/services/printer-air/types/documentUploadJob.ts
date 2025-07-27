export type documentUploadJobStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';

export interface CreateDocumentUploadJobAPIResponse {
  id: number;
  status: documentUploadJobStatus;
  s3Key: string;
  description: string;
  location: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentUploadJobPayload {
  s3Key: string;
  location: string;
  description: string;
  ocr: boolean;
}

export interface ShowDocumentUploadJobAPIResponse {
  id: number;
  status: documentUploadJobStatus;
  s3Key: string;
  description: string;
  location: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}
