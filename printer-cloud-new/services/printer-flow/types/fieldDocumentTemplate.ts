import { APIMetaProperties } from '../../types';

export interface IndexFieldDocumentTemplates {
  fieldDocumentTemplates: Array<IndexFieldDocumentTemplate>;
  meta: APIMetaProperties;
}

export interface IndexFieldDocumentTemplate {
  id: number;
  name: string;
  status: fieldDocumentTemplateStatus;
  organizationId: number;
  s3Key: string;
  documentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseFieldDocumentTemplate {
  id: number;
  name: string;
  status: fieldDocumentTemplateStatus;
  organizationId: number;
  s3Key: string;
  documentId: number | null;
  createdAt: string;
  updatedAt: string;
  documentUrl: string | null;
}

export interface CreateFieldDocumentTemplatePayload {
  name: string;
  s3Key: string;
}

export interface IndexFieldDocumentTemplatePayload {
  q?: string;
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
}

export type fieldDocumentTemplateStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
