import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { DocumentCopyService } from '../../../../services/printer-air';
import { DocumentCopyJobStatus } from '../../../constants';
import { getSubdomain } from '../../../../utils';
import { DocumentCopyJobContainerProps } from './types';
import DocumentCopyJobError from './Error';
import DocumentCopyJobSkeleton from './Skeleton';
import DocumentCopyJob from './DocumentCopyJob';

const DocumentCopyJobContainer = ({
  document,
  documentCopy,
}: DocumentCopyJobContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documentCopyJob', document.id, { token }],
    queryFn: () =>
      DocumentCopyService.show(
        token,
        getSubdomain(),
        document.id,
        documentCopy.id
      ),
    refetchInterval: (data) =>
      data?.status === DocumentCopyJobStatus.finished ||
      data?.status === DocumentCopyJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <DocumentCopyJobError />;
  }

  if (isLoading) {
    return <DocumentCopyJobSkeleton />;
  }

  return <DocumentCopyJob document={document} documentCopy={data} />;
};

export default DocumentCopyJobContainer;
