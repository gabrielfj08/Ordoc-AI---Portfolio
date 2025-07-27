import { IndexOrganization } from '../../../services/types';

export interface OrganizationsContainerProps {
  queryParams: object;
  page: number;
  setPage: (page: number) => void;
}

export interface OrganizationsProps {
  organizations: Array<IndexOrganization>;
}

export interface OrganizationCellProps {
  organization: IndexOrganization;
}
