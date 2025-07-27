import { IndexOrganization } from '../../../services/types';

export interface SelectOrganizationContainerProps {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface SelectOrganizationProps {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  organizations: Array<IndexOrganization>;
}
