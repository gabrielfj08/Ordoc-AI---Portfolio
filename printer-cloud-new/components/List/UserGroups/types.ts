import { Policy, UserGroup } from '../../../types';

export interface UserGroupsListProps {
  userGroups: UserGroup;
  page: any;
  user_id: number;
  policy: Policy;
}
