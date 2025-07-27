import { documentOCRStatus } from '../../services/printer-air/types';

export const DocumentOCRStatus: Record<string, documentOCRStatus> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};
