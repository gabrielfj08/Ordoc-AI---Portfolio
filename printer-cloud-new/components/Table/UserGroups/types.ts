import { UserGroup } from '../../../types/userGroup';

export interface UserGroupsContainerProps {
  queryParams: object;
  page: number;
  setPage: (page: number) => void;
}
export interface UserGroupsProps {
  userGroups: Array<UserGroup>;
}
export interface UserGroupsCellProps {
  userGroup: UserGroup;
}
