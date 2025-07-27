import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow/GroupRequester';
import { DetailsGroupContainerProps } from './types';
import DetailsGroup from './Details';
import DetailsGroupError from './Error';
import DetailsGroupSkeleton from './Skeleton';

const DetailsGroupContainer = ({
  groupRequesterId,
}: DetailsGroupContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, isFetching, data } = useQuery({
    queryKey: ['groupRequester', token, subdomain],
    queryFn: () =>
      GroupRequesterService.show(token, subdomain, groupRequesterId),
  });

  if (isError) {
    return <DetailsGroupError />;
  }

  if (isLoading || isFetching) {
    return <DetailsGroupSkeleton />;
  }

  return <DetailsGroup groupRequester={data} />;
};

export default DetailsGroupContainer;
