import { ShowDocumentVersionUploadJobAPIResponse } from '../../../../services/printer-air/types';

export interface DocumentVersionUploadJobContainerProps {
  documentVersionUploadJobId: number;
};

export interface DocumentVersionUploadJobProps {
  documentVersionUploadJob: ShowDocumentVersionUploadJobAPIResponse;
};
