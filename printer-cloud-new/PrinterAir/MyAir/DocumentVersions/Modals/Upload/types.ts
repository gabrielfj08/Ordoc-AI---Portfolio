import { IndexDocument } from '../../../../../services/printer-air/types';

export interface UploadDocumentVersionsModalContainerProps {
  document: IndexDocument;
}

export interface UploadDocumentVersionsModalProps {
  onSubmit: (values: UploadDocumentVersionsModalFormValues) => void;
  document: IndexDocument;
}

export interface UploadDocumentVersionsModalFormValues {
  description: string;
  location: string;
  file: File | null;
}
