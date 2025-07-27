export interface CreateRequesterInfoAPIResponse {
  id: number;
  status: requesterInfoStatus;
  proceduresCount: number;
  requesterId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowRequesterInfoAPIResponse
  extends CreateRequesterInfoAPIResponse {}

export type requesterInfoStatus = 'failed' | 'created' | 'running' | 'finished';
