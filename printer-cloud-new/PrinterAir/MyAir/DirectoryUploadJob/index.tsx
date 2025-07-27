import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { DirectoryUploadJobService } from '../../../services/printer-air';
import { DirectoryUploadJobStatus } from '../../constants';
import { DirectoryUploadJobContainerProps } from './types';
import { getSubdomain } from '../../../utils';
import DirectoryUploadJobError from './Error';
import DirectoryUploadJobSkeleton from '../Directories/ActionSheets/DirectoryUploadJob/Skeleton';
import DirectoryUploadJob from './DirectoryUploadJob';

const DirectoryUploadJobContainer = ({
  directoryName,
  id,
}: DirectoryUploadJobContainerProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['directoryUploadJob', id, { token }],
    queryFn: () => DirectoryUploadJobService.show(token, getSubdomain(), id),
    refetchInterval: (data) =>
      data?.status === DirectoryUploadJobStatus.finished ||
      data?.status === DirectoryUploadJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <DirectoryUploadJobError />;
  }

  if (isLoading) {
    return <DirectoryUploadJobSkeleton />;
  }

  if (
    data.status === DirectoryUploadJobStatus.finished ||
    data.status === DirectoryUploadJobStatus.failed
  ) {
    queryClient.invalidateQueries(['directories', { token }]);
  }

  return (
    <DirectoryUploadJob directoryName={directoryName} status={data.status} />
  );
};

export default DirectoryUploadJobContainer;
