import { RefuseExternalSignatureAPIResponse } from '../../../../../../services/flow-cidadao/types';

export interface SignatureExternalActionsFormProps {
  onClose: () => void;
  onSubmit: (
    values: SignatureExternalActionsFormValues
  ) => Promise<RefuseExternalSignatureAPIResponse>;
}

export interface SignatureExternalActionsFormContainerProps {
  onClose: () => void;
  signatureId: number;
}

export interface SignatureExternalActionsFormValues {
  note: string;
}
