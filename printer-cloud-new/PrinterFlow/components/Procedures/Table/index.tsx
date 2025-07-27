import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth, useSessionGroupRequester } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import { ProceduresTableContainerProps } from './types';
import ProceduresTableSkeleton from './Skeleton';
import ProceduresTableError from './Error';
import ProceduresTableEmpty from './Empty';
import ProceduresTable from './Table';

const ProceduresTableContainer = ({
  params,
  setTotalObjects,
}: ProceduresTableContainerProps) => {
  const queryClient = useQueryClient();
  const { token, subdomain } = useAuth();
  const { sessionGroupRequester } = useSessionGroupRequester();

  React.useEffect(() => {
    queryClient.invalidateQueries([
      'procedures',
      subdomain,
      token,
      {
        ...params,
        responsibleGroupId: sessionGroupRequester?.id,
        createdById: params.createdById,
      },
    ]);
  }, [sessionGroupRequester?.id]);

  const {
    isLoading: groupIsLoading,
    isFetching: groupIsFetching,
    isError: groupIsError,
    data: groupData,
  } = useQuery({
    queryKey: [
      'procedures',
      subdomain,
      token,
      {
        ...params,
        createdById: params.createdById,
        responsibleGroupId: sessionGroupRequester?.id,
      },
    ],
    queryFn: () =>
      ProcedureService.index(token, subdomain, {
        ...params,
        createdById: params.createdById,
        responsibleGroupId: sessionGroupRequester?.id,
      }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
    enabled: !!sessionGroupRequester?.id,
  });

  if (groupIsLoading || groupIsFetching) {
    return <ProceduresTableSkeleton />;
  }

  if (groupIsError) {
    return <ProceduresTableError status={params.status} />;
  }

  if (!groupData.meta.total) {
    return <ProceduresTableEmpty status={params.status} />;
  }

  return <ProceduresTable data={groupData.procedures} />;
};

export default ProceduresTableContainer;
