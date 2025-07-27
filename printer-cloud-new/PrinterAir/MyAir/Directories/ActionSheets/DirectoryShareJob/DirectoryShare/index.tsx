import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../../queryClient';
import { useAuth } from '../../../../../../hooks';
import { ShareDirectoryJobStatus } from '../../../../../constants';
import { BatchOperationService } from '../../../../../../services/printer-air';
import { DirectoryShareContainerProps } from './types';
import DirectoryShareSkeleton from './Skeleton';
import DirectoryShareError from './Error';
import DirectoryShare from './DirectoryShare';

const DocumentShareContainer = ({
  shareDirectoryId,
}: DirectoryShareContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['batchOperation', shareDirectoryId, { token }],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, shareDirectoryId),
    refetchInterval: (data) =>
      data?.status === ShareDirectoryJobStatus.finished ||
      data?.status === ShareDirectoryJobStatus.failed
        ? false
        : 1000,
    onSuccess: () => {
      queryClient.invalidateQueries(['directories']);
    },
  });

  if (isLoading) return <DirectoryShareSkeleton />;

  if (isError) return <DirectoryShareError />;

  return <DirectoryShare status={data.status} />;
};

export default DocumentShareContainer;
