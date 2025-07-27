import { ShareDirectoryStatus } from '../../../../../../services/printer-air/types';

export interface DirectoryShareContainerProps {
  shareDirectoryId: number;
}

export interface DirectoryShareProps {
  status: ShareDirectoryStatus;
}
