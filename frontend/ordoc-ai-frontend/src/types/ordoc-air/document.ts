import type { APIMetaProperties } from '.';

export interface IndexDocumentsAPIResponse {
  documents: Array<IndexDocument>;
  meta: APIMetaProperties;
}

export interface IndexDocument {
  id: number;
  originalFilename: string;
  status: DocumentStatus;
  description: string;
  location: string;
  directoryId: number;
  path: string;
  prn: string;
  previousParentPrn: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  shared: boolean;
  shareableLink: boolean;
  updatedBy: UpdatedByIndexDocument | null;
}

export interface UpdatedByIndexDocument {
  id: number;
  name: string;
}

export interface IndexDocumentsPayload {
  order?: string;
  direction?: string;
  directoryId: number;
  page?: number;
}

export interface MoveDocumentAPIResponse {
  id: number;
  status: MoveDocumentStatus;
  recordType: string;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  action: MoveDocumentActions;
  ids: Array<number>;
  payload: MoveDocumentResponsePayload;
}

export interface MoveDocumentPayload {
  ids: Array<number>;
  batchAction: MoveDocumentActions;
  payload: MoveDocumentPayloadPayload;
}

export interface MoveDocumentPayloadPayload {
  directoryId: number;
}

export interface MoveDocumentResponsePayload {
  directoryId: number;
}
export interface SharedDocument {
  id: number;
  ids: Array<number>;
  payload: ShareDocumentPayload;
  action: ShareDocumentActions;
  recordType: string;
  createdById: number;
  status: SharedDocumentStatus;
  updatedAt: string;
}

export interface ShareDocumentAPIResponse {
  id: number;
  ids: Array<number>;
  payload: ShareDocumentPayload;
  action: ShareDocumentActions;
  recordType: string;
  createdById: number;
  status: SharedDocumentStatus;
  updatedAt: string;
}
export interface ShareDocumentPayload {
  ids: Array<number>;
  payload: ShareDocumentPayloadPayload;
}
export interface ShareDocumentPayloadPayload {
  userId: number;
}

export interface RestoreDocumentsPayload {
  ids: Array<number>;
}

export interface RestoreDocumentsAPIResponse {
  id: number;
  ids: Array<number>;
  payload: null;
  action: RestoreDocumentActions;
  recordType: string;
  createdById: number;
  status: RestoreDocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShowDocument {
  id: number;
  originalFilename: string;
  status: DocumentStatus;
  description: string;
  location: string;
  directoryId: number;
  prn: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  url: string;
  content: string;
  size: string;
  createdBy: ShowDocumentCreatedBy;
  updatedBy: ShowDocumentUpdatedBy | null;
  directory: ShowDocumentDirectory;
}

export interface ShowDocumentAPIResponse {
  id: number;
  originalFilename: string;
  status: DocumentStatus;
  description: string;
  location: string;
  directoryId: number;
  prn: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  url: string;
  downloadUrl: string;
  content: string;
  size: string;
  byteSize: number;
  createdBy: ShowDocumentCreatedBy;
  updatedBy: ShowDocumentUpdatedBy | null;
  directory: ShowDocumentDirectory;
}

export interface ShowDocumentCreatedBy {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  cpf: string;
  deletedAt: string;
  dateOfBirth: string;
  unlockTokenSentAt: string;
  status: CreatedByStatus;
  prn: string;
}

export interface ShowDocumentUpdatedBy {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  cpf: string;
  deletedAt: string;
  dateOfBirth: string;
  unlockTokenSentAt: string;
  status: CreatedByStatus;
  prn: string;
}

export interface ShowDocumentDirectory {
  name: string;
}

export interface TrashDocumentAPIResponse {
  id: number;
  ids: Array<number>;
  payload: string | null;
  action: string;
  recordType: string;
  createdById: number;
  status: TrashDocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TrashDocumentPayload {
  ids: Array<number>;
}

export interface UpdateDocumentCreatedBy {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  cpf: string;
  deletedAt: string;
  dateOfBirth: string;
  unlockTokenSentAt: string;
  status: CreatedByStatus;
  prn: string;
}

export interface UpdateDocumentUpdatedBy {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  cpf: string;
  deletedAt: string;
  dateOfBirth: string;
  unlockTokenSentAt: string;
  status: CreatedByStatus;
  prn: string;
}

export interface UpdateDocumentDirectory {
  name: string;
}

export interface UpdateDocumentAPIResponse {
  id: number;
  originalFilename: string;
  status: DocumentStatus;
  description: string;
  location: string;
  directoryId: number;
  prn: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  url: string;
  content: string;
  size: string;
  createdBy: UpdateDocumentCreatedBy;
  updatedBy: UpdateDocumentUpdatedBy | string;
  directory: UpdateDocumentDirectory;
}

export interface UpdateDocumentPayload {
  description: string;
  location: string;
  originalFilename: string;
}

export interface DocumentOCRAPIResponse {
  id: number;
  recordType: string;
  ids: Array<number>;
  action: string;
  status: documentOCRStatus;
  payload: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: number;
}

export interface DocumentOCRPayload {
  ids: Array<number>;
}

export interface SearchDocumentsAPIResponse {
  documents: Array<SearchDocument>;
  meta: APIMetaProperties;
}

export interface SearchDocument {
  id: number;
  originalFilename: string;
  status: DocumentStatus;
  description: string;
  location: string;
  directoryId: number;
  path: string;
  prn: string;
  previousParentPrn: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  byteSize: number;
  versionId: number;
  shared: boolean;
  shareableLink: boolean;
  previewContent: string;
  updatedBy: UpdatedBySearchDocument;
}

export interface UpdatedBySearchDocument {
  id: number;
  name: string;
}

export type CreatedByStatus = 'active' | 'inactive';

export type DocumentStatus = 'failed' | 'created' | 'enqueued' | 'processed';

export type MoveDocumentStatus = 'created' | 'failed' | 'finished' | 'running';

export type MoveDocumentActions =
  | 'move_and_keep'
  | 'move_and_merge'
  | 'move_and_replace';

export type TrashDocumentStatus = 'created' | 'failed' | 'finished' | 'running';

export type RestoreDocumentStatus =
  | 'created'
  | 'failed'
  | 'finished'
  | 'running';

export type RestoreDocumentActions =
  | 'restore_and_keep'
  | 'restore_and_merge'
  | 'restore_and_replace';

export type documentOCRStatus = 'failed' | 'created' | 'running' | 'finished';

export type SharedDocumentStatus =
  | 'failed'
  | 'created'
  | 'running'
  | 'finished';

export type ShareDocumentActions = 'share';
