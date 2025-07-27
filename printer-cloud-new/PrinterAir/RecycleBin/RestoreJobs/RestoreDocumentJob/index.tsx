import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { BatchOperationService } from '../../../../services/printer-air';
import { RestoreJobStatus } from '../../../constants';
import { RestoreDocumentJobContainerProps } from './types';
import RestoreDocumentJob from './RestoreDocumentJob';
import RestoreDirectoryJobError from '../RestoreDirectoryJob/Error';
import RestoreDocumentJobSkeleton from './Skeleton';

const RestoreDocumentJobContainer = ({
  restoreDocumentJobId,
}: RestoreDocumentJobContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['batchOperation', restoreDocumentJobId, token],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, restoreDocumentJobId),
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
    return <RestoreDocumentJobSkeleton />;
  }

  return <RestoreDocumentJob status={data.status} />;
};

export default RestoreDocumentJobContainer;
