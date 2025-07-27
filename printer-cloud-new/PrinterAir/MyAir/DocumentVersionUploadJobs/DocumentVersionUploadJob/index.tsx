import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { DocumentVersionUploadJobService } from '../../../../services/printer-air';
import { DocumentVersionUploadJobContainerProps } from './types';
import DocumentVersionUploadJobError from './Error';
import DocumentVersionUploadJobSkeleton from './Skeleton';
import DocumentVersionUploadJob from './DocumentVersionUploadJob';

const DocumentVersionUploadJobContainer = ({
  documentVersionUploadJobId,
}: DocumentVersionUploadJobContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'documentVersionUploadJob',
      documentVersionUploadJobId,
      { token },
    ],
    queryFn: () =>
      DocumentVersionUploadJobService.show(
        token,
        subdomain,
        documentVersionUploadJobId
      ),
    refetchInterval: 1000,
    // TODO: DISABLE QUERY AFTER ALL JOBS ARE FINISHED OR FAILED
  });

  if (isError) {
    return <DocumentVersionUploadJobError />;
  }

  if (isLoading) {
    return <DocumentVersionUploadJobSkeleton />;
  }

  return <DocumentVersionUploadJob documentVersionUploadJob={data} />;
};

export default DocumentVersionUploadJobContainer;
