import { directoryUploadJobStatus } from '../../services/printer-air/types';

export const DirectoryUploadJobStatus: Record<
  string,
  directoryUploadJobStatus
> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
