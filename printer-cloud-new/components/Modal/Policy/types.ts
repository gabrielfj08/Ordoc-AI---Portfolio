export interface DeletePolicyProps {
  policy_id: number;
  policy_name: string;
}
export interface DetachPolicyFromUserProps {
  policy_id: number | null;
  user_id: number | null;
  user_name: string;
}
export interface DetachPolicyFromUserGroupProps {
  policy_id: number | null;
  user_group_id: number | null;
  user_group_name: string;
}
