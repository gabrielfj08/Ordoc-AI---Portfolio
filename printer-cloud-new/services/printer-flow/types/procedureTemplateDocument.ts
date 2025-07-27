import { APIMetaProperties } from '../../types';

export interface CreateProcedureTemplateDocumentPayload {
  name: string;
  s3Key: string;
}

export interface IndexProcedureTemplateDocuments {
  procedureTemplateDocuments: Array<BaseProcedureTemplateDocument>;
  meta: APIMetaProperties;
}

export interface BaseProcedureTemplateDocument {
  id: number;
  name: string;
  status: attachmentUploadStatus;
  procedureTemplateId: number;
  s3Key: string;
  documentId: number | null;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcedureTemplateDocumentAPIResponse
  extends BaseProcedureTemplateDocument {
  documentUrl: string;
}

export interface ShowProcedureTemplateDocument
  extends BaseProcedureTemplateDocument {
  documentUrl: string;
}

export interface IndexProcedureTemplateDocumentsPayload {
  q?: string;
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  status?: attachmentUploadStatus;
}

export type attachmentUploadStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
