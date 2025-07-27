import { SharedDocumentStatus } from '../../services/printer-air/types';

export const ShareDocumentJobStatus: Record<string, SharedDocumentStatus> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
