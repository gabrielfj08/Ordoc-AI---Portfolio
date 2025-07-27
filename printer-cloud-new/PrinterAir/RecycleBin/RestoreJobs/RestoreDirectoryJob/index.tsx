import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { BatchOperationService } from '../../../../services/printer-air';
import { RestoreJobStatus } from '../../../constants';
import { RestoreDirectoryJobContainerProps } from './types';
import RestoreDirectoryJob from './RestoreDirectoryJob';
import RestoreDirectoryJobError from './Error';
import RestoreDirectoryJobSkeleton from './Skeleton';

const RestoreDirectoryJobContainer = ({
  restoreDirectoryJobId,
}: RestoreDirectoryJobContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['batchOperation', restoreDirectoryJobId, token],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, restoreDirectoryJobId),
    refetchInterval: (data) =>
      data?.status === RestoreJobStatus.finished ||
      data?.status === RestoreJobStatus.failed
        ? false
        : 1000,
    onSuccess: (data) =>
      data?.status === RestoreJobStatus.finished &&
      queryClient.invalidateQueries(),
  });

  if (isError) {
    return <RestoreDirectoryJobError />;
  }

  if (isLoading) {
    return <RestoreDirectoryJobSkeleton />;
  }

  return <RestoreDirectoryJob status={data.status} />;
};

export default RestoreDirectoryJobContainer;
