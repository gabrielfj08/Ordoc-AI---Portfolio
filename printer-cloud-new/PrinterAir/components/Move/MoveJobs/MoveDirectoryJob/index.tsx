import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth } from '../../../../../hooks';
import { BatchOperationService } from '../../../../../services/printer-air';
import { MoveJobStatus } from '../../../../constants';
import { MoveDirectoryJobContainerProps } from './types';
import MoveDirectoryJob from './MoveDirectoryJob';
import MoveDirectoryJobError from './Error';
import MoveDirectoryJobSkeleton from './Skeleton';

const MoveDirectoryJobContainer = ({
  moveDirectoryJobId,
}: MoveDirectoryJobContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['batchOperation', moveDirectoryJobId, token],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, moveDirectoryJobId),
    refetchInterval: (data) =>
      data?.status === MoveJobStatus.finished ||
      data?.status === MoveJobStatus.failed
        ? false
        : 1000,
    onSuccess: (data) =>
      data?.status === MoveJobStatus.finished &&
      queryClient.invalidateQueries(['directories']),
  });

  if (isError) {
    return <MoveDirectoryJobError />;
  }

  if (isLoading) {
    return <MoveDirectoryJobSkeleton />;
  }

  return <MoveDirectoryJob status={data.status} />;
};

export default MoveDirectoryJobContainer;
