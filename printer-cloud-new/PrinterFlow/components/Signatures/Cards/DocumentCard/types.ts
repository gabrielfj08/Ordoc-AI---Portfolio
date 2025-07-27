import {
  IndexSignaturesPayload,
  IndexSignature,
} from '../../../../../services/printer-flow/types';

export interface DocumentSignaturesCardContainerProps {
  params: IndexSignaturesPayload;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface DocumentSignatureCardProps {
  signature: IndexSignature;
}

export interface DocumentCardMenuButtonProps {
  signature: IndexSignature;
}
