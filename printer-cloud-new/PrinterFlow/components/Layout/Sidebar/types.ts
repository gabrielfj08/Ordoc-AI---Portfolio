import { ShowOrganizationAPIResponse } from '../../../../services/types';

export interface FlowSidebarProps {
  buttonClick: () => void;
  organization: ShowOrganizationAPIResponse;
}

export interface FlowSidebarContainerProps {
  buttonClick: () => void;
}
