import { ShowSignatureAPIResponse } from '../../../../services/printer-flow/types/signature';

export interface SignatureDocumentModalContainerProps {
  signatureId: number;
}

export interface SignatureDocumentPreviewModalProps {
  signature: ShowSignatureAPIResponse;
}
