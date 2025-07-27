import { DeactivateRequesterAPIResponse } from '../../../../services/printer-flow/types';

export interface DeactivateRequesterContainerModalProps {
  requesterId: number;
  requesterName: string;
}

export interface DeactivateRequesterModalProps {
  onSubmit: (
    values: DeactivateRequesterFormValues
  ) => Promise<DeactivateRequesterAPIResponse>;
  requesterName: string;
}

export interface DeactivateRequesterFormValues {
  note: string;
}
