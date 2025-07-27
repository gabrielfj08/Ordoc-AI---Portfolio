import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { DocumentUploadJobService } from '../../../../services/printer-air';
import { DocumentUploadJobStatus } from '../../../constants';
import { getSubdomain } from '../../../../utils';
import { DocumentUploadJobContainerProps } from './types';
import DocumentUploadJobError from './Error';
import DocumentUploadJobSkeleton from './Skeleton';
import DocumentUploadJob from './DocumentUploadJob';

const DocumentUploadJobContainer = ({
  id,
}: DocumentUploadJobContainerProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documentUploadJob', id, { token }],
    queryFn: () => DocumentUploadJobService.show(token, getSubdomain(), id),
    refetchInterval: (data) =>
      data?.status === DocumentUploadJobStatus.finished ||
      data?.status === DocumentUploadJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <DocumentUploadJobError />;
  }

  if (isLoading) {
    return <DocumentUploadJobSkeleton />;
  }

  if (
    data.status === DocumentUploadJobStatus.finished ||
    data.status === DocumentUploadJobStatus.failed
  ) {
    queryClient.invalidateQueries(['documents', { token }]);
  }

  return <DocumentUploadJob documentUploadJob={data} />;
};

export default DocumentUploadJobContainer;
