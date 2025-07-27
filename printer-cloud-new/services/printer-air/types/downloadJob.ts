import { downloadJobStatus } from './download';

export interface CreateDownloadJobPayload {
  directoryIds: Array<number> | Array<null>;
  documentIds: Array<number> | Array<null>;
}

export interface CreateDownloadJobAPIResponse {
  id: number;
  uuid: string;
  status: downloadJobStatus;
  targets: {
    documentIds: Array<number> | Array<null>;
    directoryIds: Array<number> | Array<null>;
  };
  s3Key: null;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  downloadLink: null;
}

export interface ShowDownloadJobAPIResponse {
  id: number;
  uuid: string;
  status: downloadJobStatus;
  targets: {
    documentIds: Array<number>;
    directoryIds: Array<number>;
  };
  s3Key: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  downloadLink: string;
}
