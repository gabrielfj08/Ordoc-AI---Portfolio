import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../hooks';
import { OrganizationService } from '../../../../services';
import { FlowSidebarContainerProps } from './types';
import FlowSidebar from './Sidebar';
import SidebarFlowError from './Error';
import SidebarFlowSkeleton from './Skeleton';

const FlowSidebarContainer = ({ buttonClick }: FlowSidebarContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  if (!session) {
    return null;
  }
  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', session, { token }],
    queryFn: () =>
      OrganizationService.showV3(token, subdomain, session.organization.id),
  });

  if (isError) {
    return <SidebarFlowError />;
  }

  if (isLoading) {
    return <SidebarFlowSkeleton />;
  }

  return <FlowSidebar buttonClick={buttonClick} organization={data} />;
};

export default FlowSidebarContainer;
