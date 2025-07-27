import {
  IndexUserGroup,
  ShowUserAPIResponse,
} from '../../../../services/types';

export interface ShowUserContainerProps {
  userId: number;
}

export interface ShowUserProps {
  user: ShowUserAPIResponse;
  userGroup: IndexUserGroup;
}
