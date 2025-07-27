import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../hooks';
import { ExternalReportService } from '../../services/flow-cidadao/Reports';
import Home from './Home';
import HomeError from './Error';
import HomeSkeleton from './Skeleton';

const HomeContainer = () => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['createReport', externalToken, subdomain],
    queryFn: () =>
      ExternalReportService.create(String(externalToken), subdomain),
  });

  if (isError) return <HomeError />;

  if (isLoading) return <HomeSkeleton />;

  return <Home reportId={data.id} />;
};

export default HomeContainer;
