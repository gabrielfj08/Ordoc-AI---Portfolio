import { ShowOrganizationAPIResponse } from '../../../services/types';

export interface ShowOrganizationContainerProps {
  organizationId: number;
}

export interface ShowOrganizationProps {
  organization: ShowOrganizationAPIResponse;
}
