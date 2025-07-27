import { APIMetaProperties } from '../../types';
export interface IndexShareableLink {
  id: number;
  uuid: string;
  expiresIn: number;
  expiresAt: string;
  documentPrn: string;
  createdAt: string;
  updatedAt: string;
  link: string;
  createdById: number;
  createdBy: CreatedByShareableLink | null;
}

export interface IndexShareableLinkAPIResponse {
  shareableLinks: Array<IndexShareableLink>;
  meta: APIMetaProperties;
}

export interface CreatedByShareableLink {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: StatusCreatedByShareableLink;
  username: string;
  changedPassword: boolean;
  registrationNumber: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type StatusCreatedByShareableLink = 'active' | 'inactive';

export interface CreateShareableLink {
  id: number;
  uuid: string;
  expiresIn: number;
  expiresAt: string;
  documentPrn: string;
  createdAt: string;
  updatedAt: string;
  link: string;
}

export interface CreateShareableLinkAPIResponse {
  id: number;
  uuid: string;
  expiresIn: number;
  expiresAt: string;
  documentPrn: string;
  createdAt: string;
  updatedAt: string;
  link: string;
}

export interface CreateShareableLinkPayload {
  expiresIn: number | null;
}

export interface DestroyShareableLink {
  id: number;
  uuid: string;
  expiresIn: number;
  expiresAt: string;
  documentPrn: string;
  createdAt: string;
  updatedAt: string;
  link: string;
}
export interface DestroyShareableLinkAPIResponse {
  id: number;
  uuid: string;
  expiresIn: number;
  expiresAt: string;
  documentPrn: string;
  createdAt: string;
  updatedAt: string;
  link: string;
}

export interface ShowShareableLinkAPIResponse {
  id: number;
  uuid: string;
  expiresIn: number;
  expiresAt: number;
  documentPrn: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  downloadUrl: string;
  byteSize: number;
}
