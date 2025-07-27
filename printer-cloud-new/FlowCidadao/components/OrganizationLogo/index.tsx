import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import OrganizationLogo from './OrganizationLogo';
import OrganizationLogoSkeleton from './Skeleton';
import OrganizationLogoError from './Error';

const OrganizationLogoContainer = () => {
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['organizationLogo', subdomain],
    queryFn: () => OrganizationService.organization(subdomain),
  });

  if (isError) {
    return <OrganizationLogoError />;
  }

  if (isLoading) {
    return <OrganizationLogoSkeleton />;
  }

  return <OrganizationLogo src={data.logoUrl} />;
};

export default OrganizationLogoContainer;
