import { procedureReportsStatus } from '../../services/printer-flow/types';

export const GeneratePDFStatus: Record<string, procedureReportsStatus> = {
  created: 'created',
  failed: 'failed',
  finished: 'finished',
  running: 'running',
};
