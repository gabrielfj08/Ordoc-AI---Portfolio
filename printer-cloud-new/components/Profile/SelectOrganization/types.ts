import { IndexOrganization } from '../../../services/types';

export interface SelectOrganizationContainerProps {
  currentOrganizationId: number;
}

export interface SelectOrganizationProps {
  organizations: Array<IndexOrganization>;
  currentOrganizationId: number;
}
