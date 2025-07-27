export interface ShowDirectoryInfoJob {
  id: number;
  status: showDirectoryInfoJobStatus;
  totalSize: string;
  totalDirectoriesCount: number;
  totalDocumentsCount: number;
  directoryId: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export type showDirectoryInfoJobStatus =
  | 'created'
  | 'finished'
  | 'running'
  | 'failed';

export interface ShowDirectoryInfoJobAPIResponse {
  id: number;
  status: showDirectoryInfoJobStatus;
  totalSize: string;
  totalDirectoriesCount: number;
  totalDocumentsCount: number;
  directoryId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDirectoryInfoJob {
  id: number;
  status: CreateDirectoryInfoJobStatus;
  totalSize: string;
  totalDirectoriesCount: number;
  totalDocumentsCount: number;
  directoryId: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateDirectoryInfoJobStatus =
  | 'created'
  | 'finished'
  | 'running'
  | 'failed';

export interface CreateDirectoryInfoJobAPIResponse {
  id: number;
  status: CreateDirectoryInfoJobStatus;
  totalSize: string;
  totalDirectoriesCount: number;
  totalDocumentsCount: number;
  directoryId: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
