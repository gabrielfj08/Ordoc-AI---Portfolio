import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth } from '../../../../../hooks';
import { BatchOperationService } from '../../../../../services/printer-air';
import { TrashDocumentStatus } from '../../../../../services/printer-air/types';
import { RemoveDocumentJobContainerProps } from './types';
import RemoveDocumentJobError from './Error';
import RemoveDocumentJobSkeleton from './Skeleton';
import RemoveDocumentJob from './RemoveDocumentJob';

const RemoveDocumentJobContainer = ({
  removeDocumentJobId,
}: RemoveDocumentJobContainerProps) => {
  const { token, subdomain } = useAuth();

  const RemoveDocumentJobStatus: Record<string, TrashDocumentStatus> = {
    created: 'created',
    failed: 'failed',
    finished: 'finished',
    running: 'running',
  };

  const { isError, isLoading, data } = useQuery({
    queryKey: ['batchOperation', removeDocumentJobId, token],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, removeDocumentJobId),
    refetchInterval: (data) =>
      data?.status === RemoveDocumentJobStatus.finished ||
      data?.status === RemoveDocumentJobStatus.failed
        ? false
        : 1000,
    onSuccess: (data) =>
      data?.status === RemoveDocumentJobStatus.finished &&
      queryClient.invalidateQueries(['documents']),
  });

  if (isError) return <RemoveDocumentJobError />;

  if (isLoading) return <RemoveDocumentJobSkeleton />;

  return <RemoveDocumentJob status={data.status} />;
};

export default RemoveDocumentJobContainer;
