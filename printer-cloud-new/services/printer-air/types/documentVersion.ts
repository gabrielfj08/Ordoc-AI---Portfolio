import { APIMetaProperties } from '../../types';

export interface IndexDocumentVersionAPIResponse {
  documentVersions: Array<IndexDocumentVersion>;
  meta: APIMetaProperties;
}

export interface IndexDocumentVersion {
  id: number;
  originalFilename: string;
  description: string;
  location: string;
  status: DocumentVersionStatus;
  directoryId: number;
  prn: string;
  versionId: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  createdBy: IndexDocumentVersionCreatedBy;
}

export interface IndexDocumentVersionCreatedBy {
  id: number;
  name: string;
}

export interface IndexDocumentVersionPayload {
  order: string;
  direction: string;
  page: number;
  perPage: number;
  path: string;
}
export interface ShowDocumentVersion {
  id: number;
  originalFilename: string;
  description: string;
  location: string;
  status: DocumentVersionStatus;
  directoryId: number;
  prn: string;
  versionId: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  createdById: number;
}

export interface ShowDocumentVersionAPIResponse {
  id: number;
  originalFilename: string;
  description: string;
  location: string;
  status: DocumentVersionStatus;
  directoryId: number;
  prn: string;
  versionId: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  createdById: number;
}

export interface DeleteDocumentVersionAPIResponse {
  id: number;
  originalFilename: string;
  description: string;
  location: string;
  status: DocumentVersionStatus;
  directoryId: number;
  prn: string;
  versionId: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  createdBy: DeleteDocumentVersionCreatedBy;
}

export interface DeleteDocumentVersionCreatedBy {
  id: number;
  name: string;
}

export type DocumentVersionStatus =
  | 'failed'
  | 'created'
  | 'enqueued'
  | 'processed';
