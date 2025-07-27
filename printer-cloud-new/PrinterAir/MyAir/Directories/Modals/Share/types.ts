import {
  IndexDirectory,
  ShareDirectoryAPIResponse,
} from '../../../../../services/printer-air/types';

export interface SharedDirectoryModalContainerProps {
  directory: IndexDirectory;
}
export interface ShareDirectoryModalProps {
  directory: IndexDirectory;
  onSubmit: (
    values: ShareDirectoryModalFormValues
  ) => Promise<ShareDirectoryAPIResponse>;
}

export interface ShareDirectoryModalFormValues {
  userId: number;
  directoryId: number;
}
