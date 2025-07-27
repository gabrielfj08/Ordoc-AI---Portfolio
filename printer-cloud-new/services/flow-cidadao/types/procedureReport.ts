import { externalProcedureStatus } from './procedure';

export interface BaseExternalProcedureReportAPIResponse {
  id: number;
  status: externalProcedureReportStatus;
  documentId: number | null;
  procedureId: number;
  procedureStatus: externalProcedureStatus;
  createdAt: string;
  updatedAt: string;
  documentUrl: string | null;
}

export interface CreateExternalProcedureReportAPIResponse
  extends BaseExternalProcedureReportAPIResponse {}

export interface ShowExternalProcedureReportAPIResponse
  extends BaseExternalProcedureReportAPIResponse {}

export type externalProcedureReportStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
