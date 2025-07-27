import { documentCopyStatus } from '../../services/printer-air/types';

export const DocumentCopyJobStatus: Record<string, documentCopyStatus> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};
