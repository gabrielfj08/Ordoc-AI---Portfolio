import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { queryClient } from '../../../../../queryClient';
import { BatchOperationService } from '../../../../../services/printer-air';
import { MoveJobStatus } from '../../../../constants';
import { MoveDocumentJobContainerProps } from './types';
import MoveDocumentJob from './MoveDocumentJob';
import MoveDirectoryJobError from '../MoveDirectoryJob/Error';
import MoveDocumentJobSkeleton from './Skeleton';

const MoveDocumentJobContainer = ({
  moveDocumentJobId,
}: MoveDocumentJobContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['batchOperation', moveDocumentJobId, token],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, moveDocumentJobId),
    refetchInterval: (data) =>
      data?.status === MoveJobStatus.finished ||
      data?.status === MoveJobStatus.failed
        ? false
        : 1000,
    onSuccess: (data) =>
      data?.status === MoveJobStatus.finished &&
      queryClient.invalidateQueries(['documents']),
  });

  if (isError) {
    return <MoveDirectoryJobError />;
  }

  if (isLoading) {
    return <MoveDocumentJobSkeleton />;
  }

  return <MoveDocumentJob status={data.status} />;
};

export default MoveDocumentJobContainer;
