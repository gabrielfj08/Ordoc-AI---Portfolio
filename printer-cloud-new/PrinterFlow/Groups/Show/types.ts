import {
  GroupRequesterStatus,
  ShowGroupRequesterAPIResponse,
} from '../../../services/printer-flow/types';

export interface ShowGroupContainerProps {
  groupId: number;
  setGroup: React.Dispatch<GroupInfo>;
}

export interface ShowGroupProps {
  group: ShowGroupRequesterAPIResponse;
  groupId: number;
  setGroup: React.Dispatch<GroupInfo>;
}

export interface GroupInfo {
  name: string;
  status: GroupRequesterStatus;
}
