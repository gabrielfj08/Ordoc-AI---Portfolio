import { UpdateDocumentAPIResponse } from '../../../../../services/printer-air/types';

export interface EditDocumentContainerModalProps {
  documentId: number;
  description: string;
  location: string;
  originalFilename: string;
}

export interface EditDocumentModalProps {
  onSubmit: (
    values: EditDocumentFormValues
  ) => Promise<UpdateDocumentAPIResponse>;
  description: string;
  location: string;
  originalFilename: string;
}

export interface EditDocumentFormValues {
  description: string;
  location: string;
  originalFilename: string;
}
