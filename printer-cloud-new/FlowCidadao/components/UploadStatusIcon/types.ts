export type uploadStatus = 'created' | 'running' | 'finished' | 'failed';

export const UploadStatus: Record<string, uploadStatus> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};

export interface StatusIconProps {
  status: uploadStatus;
  color?: string;
}
