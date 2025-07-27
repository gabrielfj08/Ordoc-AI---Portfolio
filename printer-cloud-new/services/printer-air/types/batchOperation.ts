export interface ShowBatchOperationAPIResponse {
  id: number;
  recordType: string;
  ids: Array<number>;
  action: string;
  status: BatchOperationStatus;
  payload: any;
  createdAt: string;
  updatedAt: string;
  createdById: number;
}

export type BatchOperationStatus =
  | 'failed'
  | 'created'
  | 'running'
  | 'finished';
