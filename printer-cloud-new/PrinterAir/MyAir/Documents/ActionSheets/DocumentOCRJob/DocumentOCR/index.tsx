import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../../queryClient';
import { useAuth } from '../../../../../../hooks';
import { BatchOperationService } from '../../../../../../services/printer-air';
import { DocumentOCRStatus } from '../../../../../constants';
import { DocumentOCRContainerProps } from './types';
import DocumentOCRError from './Error';
import DocumentOCRSkeleton from './Skeleton';
import DocumentOCR from './DocumentOCR';

const DocumentOCRContainer = ({
  batchOperationId,
}: DocumentOCRContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documentOCRJob', batchOperationId, { token }],
    queryFn: () =>
      BatchOperationService.show(token, subdomain, batchOperationId),
    refetchInterval: (data) =>
      data?.status === DocumentOCRStatus.finished ||
      data?.status === DocumentOCRStatus.failed
        ? false
        : 1000,
    onSuccess: (data) =>
      data?.status === DocumentOCRStatus.finished &&
      queryClient.invalidateQueries(['documents']),
  });

  if (isError) return <DocumentOCRError />;

  if (isLoading) return <DocumentOCRSkeleton />;

  return <DocumentOCR status={data.status} />;
};

export default DocumentOCRContainer;
