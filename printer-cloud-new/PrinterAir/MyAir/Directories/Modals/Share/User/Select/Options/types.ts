import { IndexUser } from '../../../../../../../../services/types';

export interface UserSelectOptionsContainerProps {
  query: string;
  directoryId: number;
}

export interface SelectUserOptionsProps {
  users: Array<IndexUser>;
}
