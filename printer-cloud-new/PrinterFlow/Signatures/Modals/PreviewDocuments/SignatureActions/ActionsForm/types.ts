import { RefuseSignatureAPIResponse } from '../../../../../../services/printer-flow/types';

export interface SignatureActionsFormProps {
  onClose: () => void;
  onSubmit: (
    values: SignatureActionsFormValues
  ) => Promise<RefuseSignatureAPIResponse>;
}

export interface SignatureActionsFormContainerProps {
  onClose: () => void;
  signatureId: number;
}

export interface SignatureActionsFormValues {
  note: string;
}
