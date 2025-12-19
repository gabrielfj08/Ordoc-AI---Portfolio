import type { APIMetaProperties } from '.';

export interface CreateDirectoryAPIResponse {
  id: number;
  name: string;
  description: string;
  createdById: number;
  organizationId: number;
  path: string;
  prn: string;
  parentDirectory: ParentDirectory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDirectoryPayload {
  name: string;
  description: string;
  parentDirectoryId: number;
}

export interface IndexDirectoriesAPIResponse {
  directories: Array<IndexDirectory>;
  meta: APIMetaProperties;
}

export interface IndexDirectory {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  prn: string;
  previousParentPrn: string;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  path: string;
  shared: boolean;
  updatedBy: UpdatedBy | null;
  parentDirectory: ParentDirectory | null;
}

export interface UpdatedBy {
  id: number;
  name: string;
}

export interface IndexDirectoriesOptions {
  directoryId?: number;
  direction?: string;
  order?: string;
  page?: number;
  path?: string;
  perPage?: number;
}

export interface MoveDirectoryAPIResponse {
  id: number;
  status: MoveDirectoryStatus;
  recordType: string;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  action: MoveDirectoryActions;
  ids: Array<number>;
  payload: MoveDirectoryResponsePayload;
}

export interface MoveDirectoryResponsePayload {
  directoryId: number;
}

export interface MoveDirectoryPayload {
  ids: Array<number>;
  batchAction: MoveDirectoryActions;
  payload: MoveDirectoryPayloadPayload;
}

export interface MoveDirectoryPayloadPayload {
  directoryId: number;
}

export interface ParentDirectory {
  id: number;
  name: string;
}
export interface ShareDirectory {
  id: number;
  ids: Array<number>;
  payload: ShareDirectoryPayload;
  action: ShareDirectoryActions;
  recordType: string;
  createdById: number;
  status: ShareDirectoryStatus;
  updatedAt: string;
}
export interface ShareDirectoryAPIResponse {
  id: number;
  ids: Array<number>;
  payload: ShareDirectoryResponsePayload;
  action: ShareDirectoryActions;
  recordType: string;
  createdById: number;
  status: ShareDirectoryStatus;
  updatedAt: string;
}

export interface ShareDirectoryPayload {
  ids: Array<number>;
  payload: ShareDirectoryPayloadPayload;
}

export interface ShareDirectoryPayloadPayload {
  userId: number;
}
export interface ShareDirectoryResponsePayload {
  userId: number;
}
export interface RestoreDirectoriesPayload {
  ids: Array<number>;
}
export interface RestoreDirectoriesAPIResponse {
  id: number;
  ids: Array<number>;
  payload: null;
  action: RestoreDirectoryActions;
  recordType: string;
  createdById: number;
  status: RestoreDirectoryStatus;
  createdAt: string;
  updatedAt: string;
}
export interface ShowDirectory {
  id: number;
  name: string;
  description: string;
  createdBy: ShowDirectoryCreatedBy;
  updatedBy: ShowDirectoryUpdatedBy;
  organizationId: number;
  prn: string;
  parentDirectory: ParentDirectory | null;
  createdAt: string;
  updatedAt: string;
  path: string;
}

export interface ShowDirectoryCreatedBy {
  id: number;
  name: string;
}

export interface ShowDirectoryUpdatedBy {
  id: number;
  name: string;
}
export interface ShowDirectoryAPIResponse {
  id: number;
  name: string;
  description: string;
  createdBy: ShowDirectoryCreatedBy;
  updatedBy: ShowDirectoryUpdatedBy;
  organizationId: number;
  path: string;
  prn: string;
  parentDirectory: ParentDirectory | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrashDirectoryAPIResponse {
  id: number;
  ids: Array<number>;
  payload: string | null;
  action: string;
  recordType: string;
  createdById: number;
  status: TrashDirectoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TrashDirectoryPayload {
  ids: Array<number>;
}

export interface UpdateDirectoryAPIResponse {
  id: number;
  name: string;
  description: string;
  createdById: number;
  organizationId: number;
  prn: string;
  parentDirectory: ParentDirectory;
  createdAt: string;
  updatedAt: string;
  path: string;
}

export interface UpdateDirectoryPayload {
  description: string;
}

export type MoveDirectoryStatus = 'created' | 'failed' | 'finished' | 'running';

export type MoveDirectoryActions =
  | 'move_and_keep'
  | 'move_and_merge'
  | 'move_and_replace';

export type ShareDirectoryStatus =
  | 'created'
  | 'failed'
  | 'finished'
  | 'running';

export type TrashDirectoryStatus =
  | 'created'
  | 'failed'
  | 'finished'
  | 'running';

export type ShareDirectoryActions = 'share';

export type RestoreDirectoryStatus =
  | 'created'
  | 'failed'
  | 'finished'
  | 'running';

export type RestoreDirectoryActions =
  | 'restore_and_keep'
  | 'restore_and_merge'
  | 'restore_and_replace';
