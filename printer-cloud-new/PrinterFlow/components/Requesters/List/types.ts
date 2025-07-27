import {
  GroupRequesterStatus,
  IndexRequesterFromGroup,
} from '../../../../services/printer-flow/types';

export interface RequestersListContainerProps {
  groupId: number;
  groupName: string;
  status: GroupRequesterStatus;
  q: string;
}

export interface RequestersListProps {
  requesters: Array<IndexRequesterFromGroup>;
  status: GroupRequesterStatus;
  groupId: number;
  groupName: string;
  page: any;
}
