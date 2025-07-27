import { attachmentUploadStatus } from '../../services/printer-flow/types';

export const AttachmentUploadStatus: Record<string, attachmentUploadStatus> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};
