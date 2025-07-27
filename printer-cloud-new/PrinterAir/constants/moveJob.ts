import { moveJobStatus } from '../../services/printer-air/types';

export const MoveJobStatus: Record<string, moveJobStatus> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
