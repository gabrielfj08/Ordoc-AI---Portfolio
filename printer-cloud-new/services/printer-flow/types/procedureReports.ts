import { BaseProcedure } from './procedure';

export interface BaseProcedureReports {
  id: number;
  createdById: number;
  documentId: number;
  procedureId: number;
  status: procedureReportsStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedProcedureReportsAPIResponse
  extends BaseProcedureReports {
  documentUrl: string;
  procedure: BaseProcedure;
  createdBy: ProcedureReportsCreatedBy;
}

export interface ShowProcedureReportsAPIResponse extends BaseProcedureReports {
  documentUrl: string;
  procedure: BaseProcedure;
  createdBy: ProcedureReportsCreatedBy;
}

export interface ProcedureReportsCreatedBy {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  cpf: string;
  deletedAt: string | null;
  dateOfBirth: string;
  unlockTokenSentAt: null;
  status: ProcedureReportsCreatedByStatus;
  prn: string;
  admin: boolean;
  avatarUrl: string;
  organizationId: number;
  username: string;
  changedPassword: boolean;
  registrationNumber: number | null;
  oneTimePassword: null;
  oneTimePasswordSentAt: null;
}

export type ProcedureReportsCreatedByStatus = 'active' | 'inactive';

export type procedureReportsStatus =
  | 'created'
  | 'running'
  | 'finished'
  | 'failed';
