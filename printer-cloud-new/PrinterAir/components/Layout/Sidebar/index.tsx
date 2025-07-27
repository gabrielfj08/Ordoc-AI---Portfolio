import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { OrganizationService } from '../../../../services';
import { AirSidebarContainerProps } from '../types';
import SidebarAirSkeleton from './Skeleton';
import SidebarAirError from './Error';
import AirSidebar from './Sidebar';

const AirSidebarContainer = ({
  buttonClick,
  organizationId,
}: AirSidebarContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', { organizationId, token }],
    queryFn: () => OrganizationService.showV3(token, subdomain, organizationId),
  });

  if (isError) {
    return <SidebarAirError />;
  }

  if (isLoading) {
    return <SidebarAirSkeleton />;
  }

  return (
    <div>
      <AirSidebar buttonClick={buttonClick} organization={data} />
    </div>
  );
};

export default AirSidebarContainer;
