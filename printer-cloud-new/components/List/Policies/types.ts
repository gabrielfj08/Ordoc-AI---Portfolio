import { IndexPolicy } from '../../../services/types';
import { UserGroup } from '../../../types';

export interface PoliciesListProps {
  policies: Array<IndexPolicy>;
  page: any;
  group: UserGroup;
  userID: number | null;
}

export interface PoliciesListContainerProps {
  group: UserGroup;
  group_id: number | null;
  organization_id: number | null;
  q: string;
  userID: number | null;
}
