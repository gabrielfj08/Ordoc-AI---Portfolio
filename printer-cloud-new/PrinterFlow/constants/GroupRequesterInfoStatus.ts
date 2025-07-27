import { groupRequesterInfoStatus } from '../../services/printer-flow/types';

export const GroupRequesterInfoJobStatus: Record<
  string,
  groupRequesterInfoStatus
> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};
