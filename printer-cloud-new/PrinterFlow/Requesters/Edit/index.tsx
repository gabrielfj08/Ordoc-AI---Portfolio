import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { RequesterService } from '../../../services/printer-flow/Requester';
import { EditRequesterFormValues } from './types';
import { UpdateRequesterAPIResponse } from '../../../services/printer-flow/types';
import EditRequester from './Edit';
import EditRequesterError from './Error';
import EditRequesterSkeleton from './Skeleton';
import EditRequesterUnauthorized from './Unauthorized';

const EditRequesterContainer = () => {
  const { token, subdomain } = useAuth();
  const [error, setError] = React.useState<any>();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['requester', subdomain, token],
    queryFn: () =>
      RequesterService.show(
        token,
        subdomain,
        Number(router.query.requestersId)
      ),

    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isError) {
    if (error === 401) {
      return <EditRequesterUnauthorized />;
    }
    return <EditRequesterError />;
  }

  if (isLoading) {
    return <EditRequesterSkeleton />;
  }

  const handleSubmit = (
    values: EditRequesterFormValues
  ): Promise<UpdateRequesterAPIResponse> => {
    return RequesterService.update(token, subdomain, data.id, values);
  };

  return <EditRequester data={data} onSubmit={handleSubmit} />;
};

export default EditRequesterContainer;
