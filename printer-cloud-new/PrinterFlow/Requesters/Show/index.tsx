import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import router from 'next/router';
import { useAuth } from '../../../hooks';
import { RequesterService } from '../../../services/printer-flow';
import { ShowContainerProps } from './types';
import ShowRequester from './Show';
import ShowRequesterSkeleton from './Skeleton';
import ShowRequesterError from './Error';
import ShowRequesterUnauthorized from './Unauthorized';

const ShowContainer = ({ setRequester }: ShowContainerProps) => {
  if (!Number(router.query.requestersId)) return null;

  const { token, subdomain } = useAuth();

  const [error, setError] = React.useState<number>(0);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['requesters', subdomain, token],
    queryFn: () =>
      RequesterService.show(
        token,
        subdomain,
        Number(router.query.requestersId)
      ),
    onSuccess: (data) => {
      setRequester(data);
    },
    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isError) {
    if (error === 401) {
      return <ShowRequesterUnauthorized />;
    }
    return <ShowRequesterError />;
  }

  if (isLoading) {
    return <ShowRequesterSkeleton />;
  }

  return <ShowRequester requester={data} />;
};

export default ShowContainer;
