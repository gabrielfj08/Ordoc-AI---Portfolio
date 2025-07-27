import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth } from '../../../../../hooks';
import { BatchOperationService } from '../../../../../services/printer-air';
import { TrashDirectoryStatus } from '../../../../../services/printer-air/types';
import { RemoveDirectoryJobContainerProps } from './types';
import RemoveDirectoryJobError from './Error';
import RemoveDirectoryJobSkeleton from './Skeleton';
import RemoveDirectoryJob from './RemoveDirectoryJob';

const RemoveDirectoryJobContainer = ({
  removeDirectoryJobId,
}: RemoveDirectoryJobContainerProps) => {
  const { token, subdomain } = useAuth();

  const RemoveDirectoryJobStatus: Record<string, TrashDirectoryStatus> = {
    created: 'created',
    failed: 'failed',
    finished: 'finished',
    running: 'running',
  };

  const { isError, isLoading, data } = useQuery({
    queryKey: ['batchOperation', removeDirectoryJobId, token],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, removeDirectoryJobId),
    refetchInterval: (data) =>
      data?.status === RemoveDirectoryJobStatus.finished ||
      data?.status === RemoveDirectoryJobStatus.failed
        ? false
        : 1000,
    onSuccess: (data) =>
      data?.status === RemoveDirectoryJobStatus.finished &&
      queryClient.invalidateQueries(['directories']),
  });

  if (isError) return <RemoveDirectoryJobError />;

  if (isLoading) return <RemoveDirectoryJobSkeleton />;

  return <RemoveDirectoryJob status={data.status} />;
};

export default RemoveDirectoryJobContainer;
