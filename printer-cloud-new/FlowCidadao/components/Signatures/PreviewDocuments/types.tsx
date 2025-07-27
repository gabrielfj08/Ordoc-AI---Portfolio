import { ShowExternalSignatureAPIResponse } from '../../../../services/flow-cidadao/types';

export interface SignatureExternalDocumentPreviewModalContainerProps {
  signatureId: number;
  isRefusing: boolean;
}

export interface SignatureExternalDocumentPreviewModalProps {
  signature: ShowExternalSignatureAPIResponse;
  isRefusing: boolean;
}
