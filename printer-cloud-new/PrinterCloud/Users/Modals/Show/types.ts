import { ShowUserAPIResponse } from '../../../../services/types';

export interface ShowUserModalProps {
  user: ShowUserAPIResponse;
}

export interface ShowUserModalContainerProps {
  userId: number;
}
