import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../../queryClient';
import { useAuth } from '../../../../../../hooks';
import { ShareDocumentJobStatus } from '../../../../../constants';
import { BatchOperationService } from '../../../../../../services/printer-air';
import { DocumentShareContainerProps } from './types';
import DocumentShareSkeleton from './Skeleton';
import DocumentShareError from './Error';
import DocumentShare from './DocumentShare';

const DocumentShareContainer = ({
  shareDocumentId,
}: DocumentShareContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['batchOperation', shareDocumentId, { token }],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, shareDocumentId),
    refetchInterval: (data) =>
      data?.status === ShareDocumentJobStatus.finished ||
      data?.status === ShareDocumentJobStatus.failed
        ? false
        : 1000,

    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    },
  });

  if (isError) return <DocumentShareError />;

  if (isLoading) return <DocumentShareSkeleton />;

  return <DocumentShare status={data.status} />;
};

export default DocumentShareContainer;
