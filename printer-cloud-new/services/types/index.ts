export {
  IndexOrganizationParams,
  IndexOrganizationsAPIResponse,
  IndexOrganization,
  OrganizationAPIResponse,
  ShowOrganizationAPIResponse,
  ShowOrganizationAddress,
  ShowOrganizationApp,
  UpdateOrganizationAPIResponse,
  UpdateOrganizationAddress,
  UpdateOrganizationApp,
  ThemeOrganization,
} from './organization';

export {
  CreateUserGroupAPIResponse,
  CreateUserGroupPayload,
  DeactivateUserGroupAPIResponse,
  IndexUserGroupsParams,
  IndexUserGroupsAPIResponse,
  IndexUserGroup,
} from './userGroup';

export interface APIMetaProperties {
  total: number;
}

export {
  ActivateUserAPIResponse,
  AddUserGroupPayload,
  BaseUser,
  CreateUserAPIResponse,
  CreateUserPayload,
  DeactivateUserAPIResponse,
  GenerateOtpPayload,
  GenerateOtpAPIResponse,
  IndexUser,
  IndexUsersAPIResponse,
  MeAPIResponse,
  PutAddUserGroupPropsAPIResponse,
  ResetPasswordAPIResponse,
  ResetPasswordPayload,
  SendRandomPasswordAPIResponse,
  SendRandomPasswordPayload,
  ShowUserAPIResponse,
  ShowUserByOtpAPIResponse,
  UpdatePasswordAPIResponse,
  UpdatePasswordPayload,
  UpdateUserAPIResponse,
  UpdateUserProfilePayload,
} from './user';

export {
  BasePolicy,
  ShowPolicyAPIResponse,
  CreatePolicyAPIResponse,
  CreatePolicyAction,
  CreatePolicyOrganization,
  CreatePolicyPayload,
  IndexPoliciesAPIResponse,
  IndexPolicy,
  UpdatePolicyAPIResponse,
  PutAttachPolicyToUserGroupsAPIResponse,
  PutAttachPolicyToUserAPIResponse,
  UpdatePolicyPayload,
  AttachToUserGroupsPayload,
  AttachToUserPayload,
  effect,
} from './policy';

export interface RemoveUserProps {
  organization_id: number | null;
  id: number | null;
}

export interface IndexUsersParams {
  organization_id_by_membership?: number | null;
  printer_cloud_user_group_id?: number | null;
  direction?: string;
  order?: string;
  q?: string;
  status?: string;
  policy_id?: number | null;
  page?: number;
  perPage?: number;
}

export interface AddUserProps {
  organizationID: string;
  email: string;
}

export type policyEffect = 'allow' | 'deny';

export interface CreatePoliciesParams {
  name: string;
  description: string;
  organization_id: number;
  effect: policyEffect;
  action_ids: number | number[];
  resource: string | string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  cpf?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  phone?: string;
  password?: string;
  passwordConfirmation?: string;
  registrationNumber?: string;
}

export { IndexAppsOptions, IndexAppsAPIResponse } from './app';
export {
  IndexPolicyAction,
  IndexPolicyActionsAPIResponse,
} from './policyAction';

export {
  PublicIndexSignaturesAPIResponse,
  PublicIndexSignature,
  PublicIndexSignaturesPayload,
} from './signature';

export {
  ShowThemePIResponse,
  CreateThemePIResponse,
  UpdateThemePIResponse,
  DeleteThemeAPIResponse,
  CreateThemePayload,
  UpdateThemePayload,
} from './theme';

export { ShowDecreeAPIResponse } from './decree';
