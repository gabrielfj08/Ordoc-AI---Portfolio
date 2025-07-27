import { APIMetaProperties } from '../../types';

export interface IndexSharedDocumentsAPIResponse {
  sharedDocuments: Array<IndexSharedDocument>;
  meta: APIMetaProperties;
}

export interface IndexSharedDocument {
  id: number;
  parentSharedId: number;
  objectPrn: string;
  organizationId: number;
  prn: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  document: IndexSharedDocumentDocument;
  createdBy: IndexSharedDocumentCreatedBy;
}

export interface IndexSharedDocumentDocument {
  id: number;
  originalFilename: string;
  location: string;
  description: string;
  url: string;
  downloadUrl: string;
  byteSize: number;
}

export interface IndexSharedDocumentCreatedBy {
  id: number;
  name: string;
}

export interface IndexSharedDocumentsPayload {
  parentSharedId?: number | null;
  root?: boolean;
  page?: number;
}
