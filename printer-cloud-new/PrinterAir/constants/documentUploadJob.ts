import { documentUploadJobStatus } from '../../services/printer-air/types';

export const DocumentUploadJobStatus: Record<string, documentUploadJobStatus> =
  {
    created: 'created',
    running: 'running',
    finished: 'finished',
    failed: 'failed',
  };
