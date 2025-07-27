import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useSession } from '../../../hooks';
import { ExternalProcedureService } from '../../../services/flow-cidadao';
import { ProcedureTableContainerProps } from './types';
import ProceduresTableSkeleton from './Skeleton';
import ProceduresTableError from './Error';
import ProceduresTableEmpty from './Empty';
import ProcedureTable from './Table';

const ProcedureTableContainer = ({
  params,
  setTotalObjects,
}: ProcedureTableContainerProps) => {
  const { token, subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { session, themeColor } = useSession();

  if (!session) return null;

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['procedures', subdomain, token, { ...params }],
    queryFn: () =>
      ExternalProcedureService.index(externalToken as string, subdomain, {
        ...params,
      }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
    enabled: !!session.organization,
  });

  if (isLoading || isFetching) {
    return <ProceduresTableSkeleton />;
  }

  if (isError) {
    return <ProceduresTableError />;
  }

  if (data.meta.total === 0) {
    return <ProceduresTableEmpty />;
  }

  return <ProcedureTable data={data.procedures} color={themeColor} />;
};

export default ProcedureTableContainer;
