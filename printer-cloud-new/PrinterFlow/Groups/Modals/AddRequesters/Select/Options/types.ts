import {
  IndexRequesters,
  IndexRequesterFromGroup,
} from '../../../../../../services/printer-flow/types';

export interface AddRequestersSelectOptionsContainerProps {
  query: string;
  open: boolean;
  groupId: number;
}

export interface SelectAddRequestersOptionsProps {
  requesters: Array<IndexRequesters>;
  requestersFromGroup: Array<IndexRequesterFromGroup>;
}
