import { APIMetaProperties } from '../../types';

export interface IndexSharedObjectDirectoriesAPIResponse {
  sharedDirectories: Array<IndexSharedDirectories>;
  meta: APIMetaProperties;
}

export interface IndexSharedDirectories {
  id: number;
  recordType: string;
  objectPrn: string;
  parentSharedId: number | null;
  organizationId: number;
  prn: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  user: IndexSharedDirectoryUser;
}
export interface IndexSharedDirectoryUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface IndexSharedDocumentAPIResponse {
  sharedDocuments: Array<IndexShareDocument>;
  meta: APIMetaProperties;
}

export interface IndexShareDocument {
  id: number;
  recordType: string;
  objectPrn: string;
  parentSharedId: number | null;
  organizationId: number;
  prn: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  user: IndexSharedDocumentUser;
}

export interface IndexSharedDocumentUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}
export interface DestroySharedObject {
  id: number;
  recordType: string;
  objectPrn: string;
  parentSharedId: number | null;
  organizationId: number;
  prn: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  user: DestroySharedDocumentUser;
}

export interface DestroySharedObjectAPIResponse {
  id: number;
  recordType: string;
  objectPrn: string;
  parentSharedId: number | null;
  organizationId: number;
  prn: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  user: DestroySharedDocumentUser;
}

export interface DestroySharedDocumentUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}
