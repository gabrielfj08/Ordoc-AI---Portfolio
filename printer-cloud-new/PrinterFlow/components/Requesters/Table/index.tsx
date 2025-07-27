import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { RequesterService } from '../../../../services/printer-flow';
import { RequestersTableContainerProps } from './types';
import RequestersTableSkeleton from './Skeleton';
import RequestersTableEmpty from './Empty';
import RequestersTableError from './Error';
import RequestersTable from './Table';

const RequestersTableContainer = ({
  params,
  setTotalObjects,
}: RequestersTableContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['requesters', subdomain, token, { params }],
    queryFn: () => RequesterService.index(token, subdomain, params),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isLoading || isFetching) {
    return <RequestersTableSkeleton />;
  }

  if (isError) {
    return <RequestersTableError />;
  }

  if (!data.meta.total) {
    return <RequestersTableEmpty />;
  }

  return <RequestersTable data={data.requesters} />;
};

export default RequestersTableContainer;
