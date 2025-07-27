import {
  ShowUserAPIResponse,
  IndexAppsAPIResponse,
} from '../../services/types';

export interface ProfileContainerProps {
  currentOrganizationId: number;
}

export interface ProfileProps {
  currentOrganizationId?: number;
  user: ShowUserAPIResponse;
  apps: IndexAppsAPIResponse;
}
