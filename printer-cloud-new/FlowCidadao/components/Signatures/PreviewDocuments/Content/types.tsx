import { ShowExternalSignatureAPIResponse } from '../../../../../services/flow-cidadao/types';

export interface SignableExternalDocumentContentContainerProps {
  signature: ShowExternalSignatureAPIResponse;
}

export interface SignableExternalDocumentContentProps {
  document: string;
}
