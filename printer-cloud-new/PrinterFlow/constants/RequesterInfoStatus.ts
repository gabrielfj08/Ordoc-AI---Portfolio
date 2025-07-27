import { requesterInfoStatus } from '../../services/printer-flow/types';

export const RequesterInfoJobStatus: Record<string, requesterInfoStatus> =
  {
    created: 'created',
    running: 'running',
    finished: 'finished',
    failed: 'failed',
  };
