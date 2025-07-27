import { IndexPolicy, BaseUser } from '../../../services/types';

export interface DeleteUserProps {
  userName: string;
  id: number | null;
}
export interface Group {
  name: string;
  description: string;
  id: number | null;
}
export interface RemovePolicyUserProps {
  user_id: number | null;
  policy_id: number | null;
  policy_name: string;
}
export interface AddPoliciesUserContainerProps {
  userId: number;
}

export interface AddPolicyUserProps {
  policies: Array<IndexPolicy>;
  currentPolicies: Array<IndexPolicy>;
  onSubmit: (values: AttachPolicyFormValues) => Promise<BaseUser>;
}

export interface AttachPolicyFormValues {
  policyIds: Array<number>;
}
