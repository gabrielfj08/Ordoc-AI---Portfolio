import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { DecreeService } from '../../../services/Decree';
import Decree from './Decree';
import DecreeSkeleton from './Skeleton';
import DecreeError from './Error';

const DecreeContainer = () => {
  const { subdomain } = useAuth();
  const { isError, isLoading, data } = useQuery({
    queryKey: ['showDecree', subdomain],
    queryFn: () => DecreeService.show(subdomain),
  });

  if (isError) return <DecreeError />;

  if (isLoading) return <DecreeSkeleton />;

  return <Decree decree={data} />;
};

export default DecreeContainer;
