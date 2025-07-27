import { IndexDocument } from '../../../../../services/printer-air/types';

export interface DocumentVersionUploadJobActionSheetContainerProps {
  document: IndexDocument;
  description: string;
  location: string;
  file: File;
};

export interface DocumentVersionUploadJobActionSheetProps {
  documentVersionUploadJobId: number;
};
