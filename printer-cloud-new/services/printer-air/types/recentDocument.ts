import { APIMetaProperties } from '../../types';
import { IndexDocument } from './document';

export interface IndexRecentDocumentAPIResponse {
  recentDocument: Array<IndexRecentDocument>;
  meta: APIMetaProperties;
}

export interface IndexRecentDocumentPayload {
  order: string;
  direction: string;
  organizationId: number;
  path: string;
}

export interface IndexRecentDocument {
  documentId: number;
  lastAccessedAt: string;
  userId: number;
  document: IndexDocument;
}

export type DocumentRecentDocumenStatus =
  | 'failed'
  | 'created'
  | 'enqueued'
  | 'processed';
