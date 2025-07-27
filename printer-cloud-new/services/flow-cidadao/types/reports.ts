export interface CreateExternalReportAPIResponse {
  id: number;
  externalRequesterId: number;
  status: ExternalReportStatus;
  proceduresRunningCount: number;
  proceduresStartedCount: number;
  tasksRunningCount: number;
  signaturesPendingCount: number;
  sharedProceduresPendingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowExternalReportAPIResponse {
  id: number;
  externalRequesterId: number;
  status: ExternalReportStatus;
  proceduresRunningCount: number;
  proceduresStartedCount: number;
  tasksRunningCount: number;
  signaturesPendingCount: number;
  sharedProceduresPendingCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ExternalReportStatus =
  | ''
  | 'created'
  | 'failed'
  | 'finished'
  | 'running';
