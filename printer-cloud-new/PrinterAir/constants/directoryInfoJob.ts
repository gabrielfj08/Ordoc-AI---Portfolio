import { showDirectoryInfoJobStatus } from '../../services/printer-air/types/directoryInfosJob';

export const DirectoryInfoJobStatus: Record<
  string,
  showDirectoryInfoJobStatus
> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};
