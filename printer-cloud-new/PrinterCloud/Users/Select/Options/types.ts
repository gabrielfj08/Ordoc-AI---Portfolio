import { IndexUser } from '../../../../services/types';

export interface UserSelectOptionsContainerProps {
  query: string;
}

export interface SelectUserOptionsProps {
  users: Array<IndexUser>;
}
