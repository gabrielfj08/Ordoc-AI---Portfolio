import { ShowDocumentUploadJobAPIResponse } from '../../../../services/printer-air/types';

export interface DocumentUploadJobContainerProps {
  id: number;
}

export interface DocumentUploadJobProps {
  documentUploadJob: ShowDocumentUploadJobAPIResponse;
}
