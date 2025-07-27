import { IndexAppsAPIResponse, IndexOrganization } from '../../../../services/types';

export interface AppsContainerProps {
  organizations: Array<IndexOrganization>;
}

export interface AppsProps {
  apps: IndexAppsAPIResponse;
  organizations: Array<IndexOrganization>;
}
