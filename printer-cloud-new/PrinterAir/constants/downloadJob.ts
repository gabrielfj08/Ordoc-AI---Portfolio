import { downloadJobStatus } from '../../services/printer-air/types';

export const DownloadJobStatus: Record<string, downloadJobStatus> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
