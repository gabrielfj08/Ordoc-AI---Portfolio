import { APIMetaProperties } from '.';
import { status } from '../../types';

export interface BaseUserGroup {
  id: number;
  description: string;
  name: string;
  organizationId: number;
  prn: string;
  status: userGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserGroupAPIResponse extends BaseUserGroup {}

export interface CreateUserGroupPayload {
  name: string;
  description: string;
}

export interface DeactivateUserGroupAPIResponse extends BaseUserGroup {}

export interface IndexUserGroupsParams {
  organization_id?: number;
  order?: string;
  direction?: string;
  q?: string;
  status?: status;
  user_id?: number;
  policy_id?: number;
  page?: string;
  perPage?: number;
}

export interface IndexUserGroupsAPIResponse {
  userGroups: Array<IndexUserGroup>;
  meta: APIMetaProperties;
}

export interface IndexUserGroup {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  status: userGroupStatus;
  prn: string;
  createdAt: string;
  updatedAt: string;
  organization: IndexUserGroupOrganization;
}

export type userGroupStatus = 'active' | 'inactive';

export interface IndexUserGroupOrganization {
  corporateName: string;
}
