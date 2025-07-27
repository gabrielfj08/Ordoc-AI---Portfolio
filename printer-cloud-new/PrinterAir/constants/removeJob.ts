import {
  TrashDirectoryStatus,
  TrashDocumentStatus,
} from '../../services/printer-air/types';

export const RemoveJobStatus: Record<
  string,
  TrashDirectoryStatus | TrashDocumentStatus
> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
