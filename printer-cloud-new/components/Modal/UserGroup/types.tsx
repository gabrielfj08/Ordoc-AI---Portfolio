import { IndexPolicy, IndexUserGroup } from '../../../services/types';
import { multipleSelectItem } from '../../../types';

export interface GroupModalProps {
  userGroup: IndexUserGroup;
}
export interface RemoveUserModalProps {
  user: {
    id: number | null;
    name: string;
  };
  userGroup: IndexUserGroup;
}
export interface RemoveUserFromGroupModalProps {
  user_id: number | null;
  userGroup: IndexUserGroup;
}

export interface AddPoliciesProps {
  buttonLoading: boolean;
  onSubmit: any;
  userGroupPolicies: Array<IndexPolicy>;
  currentUserGroupPolicies: Array<IndexPolicy>;
}

export interface AddPoliciesContainerProps {
  organization_id: number | null;
  group_id: number | null;
}

export interface RemovePolicyProps {
  group_id: number | null;
  group_name: string;
  policy_id: number | null;
  policy_name: string;
}

export interface UpdateGroupProps {
  group_id: number | null;
  organization_name: string;
  organization_cnpj: string;
  organization_id: number | null;
}
