import { APIMetaProperties } from '../../types';

export interface CreateProcedureDocumentPayload {
  procedureDocument: {
    name: string;
    s3Key: string;
  };
}

export interface CreateProcedureDocumentAPIResponse {
  id: number;
  status: ProcedureDocumentStatus;
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

export interface ShowProcedureDocumentAPIResponse {
  id: number;
  status: ProcedureDocumentStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string;
}

export interface DeleteProcedureDocumentAPIResponse {
  id: number;
  status: ProcedureDocumentStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string;
}

export interface IndexProcedureDocumentsAPIResponse {
  procedureDocuments: Array<IndexProcedureDocument>;
  meta: APIMetaProperties;
}

export interface IndexProcedureDocument {
  id: number;
  status: ProcedureDocumentStatus;
  procedure_id: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexProcedureDocumentsParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  status?: ProcedureDocumentStatus;
}

export type ProcedureDocumentStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
