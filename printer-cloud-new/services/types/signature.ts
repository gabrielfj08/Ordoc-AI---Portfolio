import { APIMetaProperties } from '.';
import {
  BaseProcedure,
  BaseRequester,
  signatureStatus,
} from '../printer-flow/types';
import {
  SignatureCreatedBy,
  SignatureSignable,
} from '../printer-flow/types/signature';

export interface PublicIndexSignaturesAPIResponse {
  signatures: Array<PublicIndexSignature>;
  meta: APIMetaProperties;
}

export interface PublicIndexSignature {
  id: number;
  signableId: number;
  signableType: string;
  requesterId: number;
  status: signatureStatus;
  service: string;
  token: string;
  procedureId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  procedure: BaseProcedure;
  requester: BaseRequester;
  createdBy: SignatureCreatedBy;
  signable: SignatureSignable;
}

export interface PublicIndexSignaturesPayload {
  documentToken: string;
  q?: string;
  page?: number;
  perPage?: number;
}
