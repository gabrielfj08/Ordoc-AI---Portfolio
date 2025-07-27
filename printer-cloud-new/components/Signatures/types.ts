import {
  PublicIndexSignature,
  PublicIndexSignaturesPayload,
} from '../../services/types';

export interface SignaturesListProps {
  signatures: Array<PublicIndexSignature>;
}

export interface VerifySignaturesListContainerProps {
  params: PublicIndexSignaturesPayload;
  setDocumentName: React.Dispatch<React.SetStateAction<string>>;
}

export interface VerifySignaturesContainerProps {
  documentToken: string;
}

export interface VerifySignaturesProps {
  params: PublicIndexSignaturesPayload;
  setParams: React.Dispatch<React.SetStateAction<PublicIndexSignaturesPayload>>;
}
