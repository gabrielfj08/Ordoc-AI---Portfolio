import { IOrganization, PolicyAction } from '../types';
import { Organization } from '.';

export class Policy {
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
  organization: IOrganization;
  status: string;
  actions: Array<PolicyAction>;

  constructor(policy) {
    this.id = policy.id;
    this.name = policy.name;
    this.prn = policy.prn;
    this.effect = policy.effect;
    this.resource = policy.resource;
    this.organizationId = policy.organizationId;
    this.createdAt = policy.createdAt;
    this.updatedAt = policy.updatedAt;
    this.description = policy.description;
    this.source = policy.source;
    this.usersCount = policy.usersCount;
    this.userGroupsCount = policy.userGroupsCount;
    this.organization = policy.organization;
    this.status = policy.status;
    this.actions = policy.actions;
  }

  static create(data) {
    return new Policy({
      id: data.id,
      name: data.name,
      prn: data.prn,
      effect: data.effect,
      resource: data.resource,
      organizationId: data.organization_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      description: data.description,
      source: data.source,
      usersCount: data.users_count,
      userGroupsCount: data.user_groups_count,
      organization: Organization.create(data.organization),
    });
  }
}
