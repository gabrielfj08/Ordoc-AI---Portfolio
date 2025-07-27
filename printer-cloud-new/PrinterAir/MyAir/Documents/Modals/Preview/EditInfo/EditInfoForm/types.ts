import {
  ShowDocumentAPIResponse,
  UpdateDocumentAPIResponse,
} from '../../../../../../../services/printer-air/types';
export interface EditDocumentInfoFormProps {
  onClose: () => void;
  document: ShowDocumentAPIResponse;
  onSubmit: (
    values: EditDocumentInfoFormValues
  ) => Promise<UpdateDocumentAPIResponse>;
}

export interface EditDocumentInfoFormContainerProps {
  document: ShowDocumentAPIResponse;
  onClose: () => void;
}

export interface EditDocumentInfoFormValues {
  originalFilename: string;
  location: string;
  description: string;
}
