export type directoryUploadJobStatus =
  | 'created'
  | 'failed'
  | 'finished'
  | 'running';

export interface CreateDirectoryUploadJobAPIResponse {
  id: number;
  status: directoryUploadJobStatus;
  s3Key: string;
  description: string;
  location: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDirectoryUploadJobPayload {
  s3Key: string;
  description: string;
  location: string;
  ocr: boolean;
}

export interface ShowDirectoryUploadJobAPIResponse {
  id: number;
  status: directoryUploadJobStatus;
  s3Key: string;
  description: string;
  location: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}
