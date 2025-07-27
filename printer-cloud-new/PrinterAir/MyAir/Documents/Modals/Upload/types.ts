import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface UploadDocumentsModalContainerProps {
  parentDirectory: ShowDirectoryAPIResponse;
}

export interface UploadDocumentsModalProps {
  onSubmit: (values: UploadDocumentsFormValues) => void;
}

export interface UploadDocumentsFormValues {
  description: string;
  location: string;
  fileList: FileList | null;
  skipOcr: boolean;
}
