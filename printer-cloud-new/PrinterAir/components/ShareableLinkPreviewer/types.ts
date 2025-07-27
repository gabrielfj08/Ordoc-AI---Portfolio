import { ShowShareableLinkAPIResponse } from '../../../services/printer-air/types/shareableLink';

export interface ShareableLinkPreviewerContainerProps {
  uuid: string;
}

export interface ShareableLinkPreviewerProps {
  shareableLink: ShowShareableLinkAPIResponse;
}
