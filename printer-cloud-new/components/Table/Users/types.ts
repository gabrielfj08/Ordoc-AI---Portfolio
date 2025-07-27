import { User } from '../../../types/user';
import { IndexUsersParams } from '../../../services/types';

export interface UsersContainerProps {
  filterParams: IndexUsersParams;
  setPage: (page: number) => void;
}

export interface UsersProps {
  users: Array<User>;
}

export interface UsersCellProps {
  user: User;
}
