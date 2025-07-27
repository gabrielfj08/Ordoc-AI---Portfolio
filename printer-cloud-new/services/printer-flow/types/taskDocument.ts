import { APIMetaProperties } from '../../types';

export interface BaseTaskDocument {
  id: number;
  status: TaskDocumentStatus;
  taskId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number | null;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexTaskDocumentsAPIResponse {
  taskDocuments: Array<BaseTaskDocument>;
  meta: APIMetaProperties;
}

export interface IndexTaskDocumentPayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  status?: TaskDocumentStatus;
  filterByProcedureId?: number;
  filterByTaskId?: number;
  procedureId?: number;
  taskId?: number;
}

export interface ShowTaskDocumentAPIResponse extends BaseTaskDocument {
  documentUrl: string | null;
}

export interface CreateTaskDocumentAPIResponse extends BaseTaskDocument {
  documentUrl: string | null;
}

export interface CreateTaskDocumentPayload {
  name: string;
  s3Key: string;
}

export interface DeleteTaskDocumentAPIResponse extends BaseTaskDocument {
  documentUrl: string | null;
}

export interface CreateTaskDocumentV4APIResponse {
  id: number;
  status: TaskDocumentStatus;
  taskId: number;
  key: string;
  source: taskDocumentSource;
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

export interface CreateTaskDocumentV4Payload {
  taskDocument: {
    source: taskDocumentSource;
    name: string;
    key: string;
  };
}

export type TaskDocumentStatus = 'created' | 'running' | 'finished' | 'failed';

export type taskDocumentSource = 'printer_air' | 'upload';
