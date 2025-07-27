import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { RequesterService } from '../../../services/printer-flow/Requester';
import { DetailsRequesterContainerProps } from './types';
import DetailsRequester from './Details';
import DetailsRequesterError from './Error';
import DetailsRequesterSkeleton from './Skeleton';

const DetailsRequesterContainer = ({
  requesterId,
}: DetailsRequesterContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['requesters', token, subdomain],
    queryFn: () => RequesterService.show(token, subdomain, requesterId),
  });

  if (isError) {
    return <DetailsRequesterError />;
  }

  if (isLoading) {
    return <DetailsRequesterSkeleton />;
  }

  return <DetailsRequester requester={data} />;
};

export default DetailsRequesterContainer;
