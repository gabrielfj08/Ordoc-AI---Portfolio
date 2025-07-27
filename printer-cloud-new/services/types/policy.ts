import { service } from '../printer-cloud/types';
import { IPolicyAction } from '../../types';
import { APIMetaProperties } from '.';

export type effect = 'allow' | 'deny';

export interface ShowPolicyAPIResponse {
  id: number;
  name: string;
  prn: string;
  effect: string;
  resource: Array<string>;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  source: string;
  usersCount: number;
  userGroupsCount: number;
  organization: {
    corporateName: string;
    cnpj: string;
  };
  service: service;
  actions: Array<IPolicyAction>;
}

export interface CreatePolicyAPIResponse {
  id: number;
  name: string;
  prn: string;
  effect: effect;
  resource: Array<string>;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  source: string;
  usersCount: number;
  userGroupsCount: number;
  actions: Array<CreatePolicyAction>;
  organization: CreatePolicyOrganization;
  service: service;
}

export interface CreatePolicyAction {
  id: number;
  service: service;
  resource: string;
  action: string;
  label: string;
  translatedResource: string;
}

export interface CreatePolicyOrganization {
  corporateName: string;
  cnpj: string;
}

export interface CreatePolicyPayload {
  name: string;
  description: string;
  effect: string;
  actionIds: Array<number>;
  resource: Array<string>;
  service: service;
}

export interface BasePolicy {
  id: number;
  description: string;
  effect: effect;
  name: string;
  organizationId: number;
  prn: string;
  resource: Array<string>;
  service: service;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexPolicy extends BasePolicy {
  userGroupsCount: number;
  usersCount: number;
}

export interface IndexPoliciesAPIResponse {
  policies: Array<IndexPolicy>;
  meta: APIMetaProperties;
}

export interface UpdatePolicyAPIResponse {
  actionId: Array<number>;
  effect: effect;
  description: string;
  resource: string;
}

export interface AttachToUserGroupsPayload {
  userGroupIds: Array<number>;
}

export interface AttachToUserPayload {
  userId: string;
}

export interface PutAttachPolicyToUserGroupsAPIResponse {
  id: number;
  name: string;
  prn: string;
  effect: string; // TODO: CREATE effect TYPE
  resource: Array<string>;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  source: string; // TODO: CREATE source TYPE
  usersCount: number;
  userGroupsCount: number;
  actions: Array<IPolicyAction>;
  organization: PutAttachPolicyToUserGroupsOrganization;
}

export interface PutAttachPolicyToUserGroupsOrganization {
  corporateName: string;
  cnpj: string;
}

export interface PutAttachPolicyToUserAPIResponse {
  id: number;
  name: string;
  prn: string;
  effect: string; // TODO: CREATE effect TYPE
  resource: Array<string>;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  source: string; // TODO: CREATE source TYPE
  usersCount: number;
  userGroupsCount: number;
  actions: Array<IPolicyAction>;
  organization: PutAttachPolicyToUserOrganization;
}

export interface PutAttachPolicyToUserOrganization {
  corporateName: string;
  cnpj: string;
}

export interface UpdatePolicyPayload {
  actionIds: Array<string>;
  effect: string;
  description: string;
  resource: Array<string>;
  service: service;
}
