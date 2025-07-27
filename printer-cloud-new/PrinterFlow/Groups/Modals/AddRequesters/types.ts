import {
  AddRequestersToGroupAPIResponse,
  IndexRequesters,
  IndexRequesterFromGroup,
} from '../../../../services/printer-flow/types';

export interface AddRequestersContainerModalProps {
  groupId: number;
}

export interface AddRequestersModalProps {
  groupId: number;
  onSubmit: (
    values: AddRequestersFormValues
  ) => Promise<AddRequestersToGroupAPIResponse>;
}
export interface AddRequestersFormValues {
  requesterIds: Array<number>;
}
