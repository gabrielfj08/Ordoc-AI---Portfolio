import { IndexSignature } from '../../../../../services/printer-flow/types';
import { ShowSignatureAPIResponse } from '../../../../../services/printer-flow/types/signature';

export interface SignableDocumentContentContainerProps {
  signature: ShowSignatureAPIResponse;
}

export interface SignableDocumentContentProps {
  document: string;
}
