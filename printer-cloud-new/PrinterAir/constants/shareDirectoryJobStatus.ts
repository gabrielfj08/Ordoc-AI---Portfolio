import { ShareDirectoryStatus } from '../../services/printer-air/types';

export const ShareDirectoryJobStatus: Record<string, ShareDirectoryStatus> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
