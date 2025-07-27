import { APIMetaProperties } from '../../types';

export interface CreateProcedureDocumentAPIResponse {
  id: number;
  status: procedureDocumentUploadStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number | null;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string | null;
}

export interface CreateProcedureDocumentPayload {
  procedureDocument: {
    name: string;
    s3Key: string;
  };
}

export interface IndexProcedureDocumentsParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  status?: string;
}

export interface IndexProcedureDocumentsAPIResponse {
  procedureDocuments: Array<IndexProcedureDocument>;
  meta: APIMetaProperties;
}

export interface IndexProcedureDocument {
  id: number;
  status: procedureDocumentUploadStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowProcedureDocumentAPIResponse {
  id: number;
  status: procedureDocumentUploadStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number | null;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string | null;
}

export interface DeleteProcedureDocumentAPIResponse {
  id: number;
  status: procedureDocumentUploadStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number | null;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string | null;
}

export type procedureDocumentUploadStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
