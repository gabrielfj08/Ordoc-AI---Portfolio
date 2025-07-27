import { APIMetaProperties } from '../../types';
import { createdByStatus } from './task';

export interface IndexExternalTaskDocumentsParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  taskId?: number;
  procedureId?: number;
  status?: taskDocumentStatus;
  createdById?: number;
}

export interface IndexExternalTaskDocumentsAPIResponse {
  taskDocuments: Array<IndexExternalTaskDocument>;
  meta: APIMetaProperties;
}

export interface BaseExternalTaskDocument {
  id: number;
  status: taskDocumentStatus;
  taskId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexExternalTaskDocument {
  id: number;
  status: taskDocumentStatus;
  taskId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedByTaskDocument;
}

export type taskDocumentStatus = 'created' | 'running' | 'finished' | 'failed';

export interface CreateExternalTaskDocumentAPIResponse
  extends BaseExternalTaskDocument {
  documentUrl: string | null;
}

export interface ShowExternalTaskDocumentAPIResponse
  extends BaseExternalTaskDocument {
  createdBy: CreatedByTaskDocument;
  documentUrl: string | null;
}
export interface CreatedByTaskDocument {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: createdByStatus;
  username: string;
  changedPassword: boolean;
  registrationNumber: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export interface CreateExternalTaskDocumentPayload {
  taskDocument: {
    name: string;
    s3Key: string;
  };
}

export interface DeleteExternalTaskDocumentAPIResponse
  extends BaseExternalTaskDocument {
  documentUrl: string | null;
}
