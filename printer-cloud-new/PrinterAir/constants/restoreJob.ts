import { restoreJobStatus } from '../../services/printer-air/types';

export const RestoreJobStatus: Record<string, restoreJobStatus> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
