import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useExternalAuth, useSession } from '../../../hooks';
import { ExternalSharedProceduresService } from '../../../services/flow-cidadao';
import { SharedProcedureTableContainerProps } from './types';
import SharedProcedureTableSkeleton from './Skeleton';
import SharedProcedureTableError from './Error';
import SharedProcedureTableEmpty from './Empty';
import SharedProcedureTable from './Table';

const SharedProcedureTableContainer = ({
  params,
  setTotalObjects,
}: SharedProcedureTableContainerProps) => {
  const { externalToken, subdomain } = useExternalAuth();
  const { session, themeColor } = useSession();

  if (!session) return null;

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: [
      'externalSharedProcedures',
      subdomain,
      externalToken,
      { ...params },
    ],
    queryFn: () =>
      ExternalSharedProceduresService.index(
        externalToken as string,
        subdomain,
        {
          ...params,
        }
      ),
    onSuccess: (data) => {
      setTotalObjects(data.meta.total);
    },
    enabled: !!session.organization,
  });

  if (isLoading || isFetching) return <SharedProcedureTableSkeleton />;

  if (isError) return <SharedProcedureTableError />;

  if (data.meta.total === 0) return <SharedProcedureTableEmpty />;

  return (
    <SharedProcedureTable data={data.sharedProcedures} color={themeColor} />
  );
};

export default SharedProcedureTableContainer;
