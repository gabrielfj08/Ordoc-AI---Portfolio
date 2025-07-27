import { APIMetaProperties } from '../../types';

export interface IndexSharedDirectoriesAPIResponse {
  sharedDirectories: Array<IndexSharedDirectory>;
  meta: APIMetaProperties;
}

export interface IndexSharedDirectory {
  id: number;
  parentSharedId: number;
  objectPrn: string;
  organizationId: number;
  prn: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  directory: IndexSharedDirectoryDirectory;
  createdBy: IndexSharedDirectoryCreatedBy;
}

export interface IndexSharedDirectoryDirectory {
  id: number;
  name: string;
  description: string;
}

export interface IndexSharedDirectoryCreatedBy {
  id: number;
  name: string;
}

export interface IndexSharedDirectoriesPayload {
  parentSharedId?: number | null;
  root?: boolean;
  page?: number;
}
