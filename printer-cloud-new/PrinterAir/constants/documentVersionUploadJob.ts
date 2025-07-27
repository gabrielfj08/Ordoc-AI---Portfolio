import { documentVersionUploadJobStatus } from '../../services/printer-air/types';

export const DocumentVersionUploadJobStatus: Record<
  string,
  documentVersionUploadJobStatus
> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
