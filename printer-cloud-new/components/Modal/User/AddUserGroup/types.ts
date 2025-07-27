import { PutAddUserGroupPropsAPIResponse } from '../../../../services/types';
import {
  BaseUserGroup,
  IndexUserGroup,
} from '../../../../services/types/userGroup';

export interface AddUserGroupProps {
  currentUserGroups: Array<IndexUserGroup>;
  userGroups: Array<IndexUserGroup>;
  onSubmit: (
    values: AddUserGroupFormValues
  ) => Promise<PutAddUserGroupPropsAPIResponse>;
}
export interface AddUserGroupContainerProps {
  userGroups: BaseUserGroup;
}
export interface AddUserGroupFormValues {
  userGroupIds: Array<number>;
}
