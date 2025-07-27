import { ShowOrganizationAPIResponse } from '../../../services/types';

export interface LayoutProps {
  children: React.ReactNode;
  currentOrganizationId: number;
  queryString?: string;
}

export interface AirSidebarProps {
  buttonClick: () => void;
  organization: ShowOrganizationAPIResponse;
}

export interface AirSidebarContainerProps {
  buttonClick: () => void;
  organizationId: number;
}
