import {
  ShowPolicyAPIResponse,
  PutAttachPolicyToUserGroupsAPIResponse,
} from '../../../../services/types';
import { IndexUserGroup } from '../../../../services/types/userGroup';

export interface AttachPolicyToUserGroupsProps {
  userGroups: Array<IndexUserGroup>;
  currentUserGroups: Array<IndexUserGroup>;
  onSubmit: (
    values: AttachPolicyToUserGroupsFormValues
  ) => Promise<PutAttachPolicyToUserGroupsAPIResponse>;
}
export interface AttachToUserGroupsContainerProps {
  policy: ShowPolicyAPIResponse;
}

export interface AttachPolicyToUserGroupsFormValues {
  userGroupIds: Array<number>;
}
