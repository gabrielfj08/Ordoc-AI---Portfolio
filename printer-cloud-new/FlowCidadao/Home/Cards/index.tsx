import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../queryClient';
import { useAuth, useExternalAuth } from '../../../hooks';
import { ExternalReportService } from '../../../services/flow-cidadao/Reports';
import { CardsContainerProps } from '../types';
import Cards from './Cards';
import CardsSkeleton from './Skeleton';
import CardsError from './Error';

const CardsContainer = ({ reportId }: CardsContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['showReport', externalToken, subdomain, reportId],
    queryFn: () =>
      ExternalReportService.show(String(externalToken), subdomain, reportId),
  });

  if (isError) return <CardsError />;

  if (isLoading) return <CardsSkeleton />;

  const handleClick = () => {
    queryClient.invalidateQueries([
      'showReport',
      externalToken,
      subdomain,
      reportId,
    ]);
    queryClient.invalidateQueries(['createReport', externalToken, subdomain]);
  };

  return <Cards reportData={data} handleClick={handleClick} />;
};

export default CardsContainer;
