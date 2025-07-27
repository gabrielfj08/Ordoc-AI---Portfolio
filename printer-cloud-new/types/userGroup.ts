import { status } from './status';

export type UserGroup = {
  id: number | null;
  name: string;
  description: string;
  organization_id: number | null;
  status: status;
  users_count: number | null;
  created_at: string;
  updated_at: string;
  policies_count: number | null;
  organization: {
    corporate_name: string;
  };
};
