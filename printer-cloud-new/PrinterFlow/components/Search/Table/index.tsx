import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import { SearchTableContainerProps } from './types';
import SearchTableError from './Error';
import SearchTable from './Table';
import SearchTableEmpty from './Empty';
import SearchTableSkeleton from './Skeleton';

const SearchTableContainer = ({
  params,
  setTotalObjects,
}: SearchTableContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['procedures', subdomain, token, params],
    queryFn: () =>
      ProcedureService.index(token, subdomain, {
        ...params,
      }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isLoading || isFetching) {
    return <SearchTableSkeleton />;
  }

  if (isError) {
    return <SearchTableError />;
  }

  if (!data.meta.total) {
    return <SearchTableEmpty />;
  }

  return <SearchTable data={data.procedures} />;
};

export default SearchTableContainer;
