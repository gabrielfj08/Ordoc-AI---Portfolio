import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow';
import { ShowGroupContainerProps } from './types';
import ShowGroupSkeleton from './Skeleton';
import ShowGroupError from './Error';
import ShowGroupUnauthorized from './Unauthorized';
import ShowGroup from './Show';

const ShowGroupContainer = ({ groupId, setGroup }: ShowGroupContainerProps) => {
  const { subdomain, token } = useAuth();
  const [error, setError] = React.useState<number>();
  const { isLoading, isError, data } = useQuery({
    queryKey: ['groupRequester', subdomain, token, {}],
    queryFn: () => GroupRequesterService.show(token, subdomain, groupId),
    onSuccess: (data) => {
      setGroup({ name: data.name, status: data.status });
    },
    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isError) {
    if (error === 401) {
      return <ShowGroupUnauthorized />;
    }
    return <ShowGroupError />;
  }

  if (isLoading) return <ShowGroupSkeleton />;

  return <ShowGroup groupId={groupId} setGroup={setGroup} group={data} />;
};

export default ShowGroupContainer;
