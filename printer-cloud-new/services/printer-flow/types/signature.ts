import { APIMetaProperties } from '../../types';
import { BaseProcedure } from './procedure';
import { RequestersStatus } from './requester';

export interface BaseSignature {
  id: number;
  signableId: number;
  signableType: signableTypes;
  requesterId: number;
  status: signatureStatus;
  service: string;
  token: string;
  procedureId: number | null;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CountSignaturesByStatusAPIResponse {
  created: number;
  signed: number;
  refused: number;
}

export interface IndexSignature extends BaseSignature {
  procedure: SignatureProcedure;
  requester: SignatureRequester;
  createdBy: SignatureCreatedBy;
  signable: SignatureSignable;
}

export interface SignatureCreatedBy {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: RequestersStatus;
  username: string;
  changedPassword: boolean;
  registrationNumber: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SignatureProcedure extends BaseProcedure {}

export interface SignatureRequester {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: string;
  prn: string;
  code: string | null;
  email: string;
  optionalEmail: string | null;
  type: string;
  status: RequestersStatus;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignatureSignable {
  id: number;
  status: signatureStatus;
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

export interface IndexSignaturesAPIResponse {
  signatures: Array<IndexSignature>;
  meta: APIMetaProperties;
}

export interface IndexSignaturesPayload {
  direction?: string;
  order?: string;
  page?: number;
  perPage?: number;
  procedureDocumentId?: number;
  q?: string;
  requesterId?: number;
  procedureId?: number;
  signableId?: number;
  signableType?: string;
  status?: signatureStatus;
}

export interface ShowSignatureAPIResponse extends BaseSignature {
  signable: SignatureSignable;
  requester: SignatureRequester;
}

export interface SignSignatureAPIResponse extends BaseSignature {
  requester: SignatureRequester;
}

export interface RefuseSignatureAPIResponse extends BaseSignature {
  requester: SignatureRequester;
}

export interface DeleteSignatureAPIResponse extends BaseSignature {
  requester: SignatureRequester;
  signable: SignatureSignable;
}
export interface CreateSignatureAPIResponse {
  id: number;
  ids: Array<number>;
  payload: CreateSignatureAPIResponsePayload;
  actions: string;
  recordType: recordTypeSignature;
  createdById: number;
  status: signatureStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSignatureAPIResponsePayload {
  procedureDocumentIds: Array<number>;
  taskDocumentIds: Array<number>;
}

export interface CreateSignaturePayload {
  requesterIds: Array<number>;
  procedureDocumentIds: Array<number>;
  taskDocumentIds: Array<number>;
}

export interface RefuseSignaturePayload {
  note: string;
}

export type signableTypes =
  | ''
  | 'PrinterFlow::ProcedureDocument'
  | 'PrinterFlow::ProcedureTask';

export type signatureStatus =
  | ''
  | 'created'
  | 'refused'
  | 'running'
  | 'signed'
  | 'inProgress';

export type recordTypeSignature = '' | 'PrinterSign::Signature';
