import { UserGroup } from '../../../types';
import { User } from '../../../types/user';
import { Policy } from '../../../types';

export interface UsersProps {
  users: Array<User>;
  page: any;
  userGroup: UserGroup;
  policy: Policy;
}
