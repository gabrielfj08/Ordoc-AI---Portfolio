import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import { HomeContainerProps } from './types';
import AppsError from '../Apps/AppsContainer/AppsError';
import HomePageSkeleton from '../Apps/AppsContainer/AppsSkeleton';
import Home from './Home';

const HomeContainer = ({}: HomeContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', token],
    queryFn: () => OrganizationService.indexV3(token, subdomain, {}),
  });

  if (isError) {
    return <AppsError />;
  }

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return <Home organizations={data.organizations} />;
};

export default HomeContainer;
