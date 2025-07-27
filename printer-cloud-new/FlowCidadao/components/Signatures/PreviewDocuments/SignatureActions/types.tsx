import {
  ShowExternalSignatureAPIResponse,
  SignExternalSignatureAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface SignatureExternalActionsProps {
  signature: ShowExternalSignatureAPIResponse;
  onSubmit: () => Promise<SignExternalSignatureAPIResponse>;
  refuseFormInitialState: boolean;
}

export interface SignatureExternalActionsContainerProps {
  signature: ShowExternalSignatureAPIResponse;
  refuseFormInitialState: boolean;
}

export interface RefuseJustificationNoteProps {
  signature: ShowExternalSignatureAPIResponse;
}
