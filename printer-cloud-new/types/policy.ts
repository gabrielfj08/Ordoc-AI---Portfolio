import { PolicyAction } from './policyAction';

export type Policy = {
  id: number;
  name: string;
  prn: string;
  effect: string;
  resource: Array<string>;
  organizationId: number | null;
  createdAt: string;
  updatedAt: string;
  description: string;
  source: string;
  usersCount: number | null;
  userGroupsCount: number | null;
  organization: {
    corporateName: string;
  };
  status: string;
  actions: Array<PolicyAction>;
};

export type PoliciesParams = {
  direction: string;
  order: string;
  organization_id: number | null;
  page: number;
  printer_cloud_group_id: number;
  q: string;
};

// TODO: REFACTOR showPolicy TO USE TYPE UNION
// https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html
export type showPolicy = {
  id: number | null;
  name: string;
  prn: string;
  effect: string;
  resource: [string];
  organization_id: number | null;
  created_at: string;
  updated_at: string;
  description: string;
  source: string;
  users_count: number | null;
  user_groups_count: number | null;
  actions: [
    {
      id: number | null;
      service: string;
      access_level: string;
      resource: string;
      action: string;
      label: string;
      translated_resource: string;
    }
  ];
  organization: {
    corporate_name: string;
  };
};

export type IndexPoliciesParams = {
  page?: number;
  perPage?: number;
  user_group_id?: number | null;
  organization_id?: number | null | string;
  source?: string;
  q?: string;
  user_id?: number | null;
  order?: string;
  direction?: string;
};
