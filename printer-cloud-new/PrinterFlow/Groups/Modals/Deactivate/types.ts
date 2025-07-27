import { DeactivateRequesterAPIResponse } from '../../../../services/printer-flow/types';

export interface DeactivateGroupContainerModalProps {
  groupId: number;
  groupName: string;
}

export interface DeactivateGroupModalProps {
  onSubmit: (
    values: DeactivateGroupFormValues
  ) => Promise<DeactivateRequesterAPIResponse>;
  groupName: string;
}

export interface DeactivateGroupFormValues {
  note: string;
}
