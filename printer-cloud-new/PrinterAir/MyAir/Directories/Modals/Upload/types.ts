import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface UploadDirectoryModalProps {
  onSubmit: (values: UploadDirectoryFormValues) => void;
}

export interface UploadDirectoryFormValues {
  description: string;
  location: string;
  fileList: FileList | null;
  skipOcr: boolean;
}

export interface UploadDirectoryModalContainerProps {
  parentDirectory: ShowDirectoryAPIResponse;
}
