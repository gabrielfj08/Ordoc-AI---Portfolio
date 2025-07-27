import { APIMetaProperties } from '../../types';

export interface BaseExternalSignature {
  id: number;
  signableId: number;
  signableType: signableExternalType;
  requesterId: number;
  status: signatureExternalStatus;
  service: string;
  token: string;
  procedureId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexExternalSignaturesAPIResponse {
  signatures: Array<IndexExternalSignature>;
  meta: APIMetaProperties;
}

export interface IndexExternalSignature extends BaseExternalSignature {
  signable: SignatureExternalSignable;
}

export interface IndexExternalSignatureParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  signableId?: number;
  signableType?: signableExternalType;
  createdById?: number;
  procedureId?: number;
  requesterId?: number;
  status?: signatureExternalStatus;
  createdAtGte?: string;
  createdAtLte?: string;
}

export interface ShowExternalSignatureAPIResponse
  extends BaseExternalSignature {
  signable: SignatureExternalSignable;
}

export interface SignExternalSignatureAPIResponse
  extends BaseExternalSignature {
  signable: SignatureExternalSignable;
}

export interface RefuseExternalSignatureAPIResponse
  extends BaseExternalSignature {
  signable: SignatureExternalSignable;
}

export interface RefuseExternalSignaturePayload {
  note: string;
}

export type signableExternalType = '' | 'procedure_document' | 'task_document';

export type signatureExternalStatus =
  | ''
  | 'created'
  | 'running'
  | 'signed'
  | 'refused'
  | 'allStatus';

export interface SignatureExternalSignable {
  id: number;
  status: signatureExternalStatus;
  taskId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string;
}
