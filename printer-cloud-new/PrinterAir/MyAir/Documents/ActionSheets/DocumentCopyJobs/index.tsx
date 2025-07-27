import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DocumentCopyService } from '../../../../../services/printer-air';
import { DocumentCopyJobsContainerProps } from './types';
import DocumentCopyJobsError from './Error';
import DocumentCopyJobs from './DocumentCopyJobs';

const DocumentCopyJobsContainer = ({
  document,
}: DocumentCopyJobsContainerProps) => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documentCopyJob', document.id, { token }],
    queryFn: () => DocumentCopyService.create(token, subdomain, document.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents', {}]);
    },
  });

  if (isError) return <DocumentCopyJobsError />;

  if (isLoading) return null;

  return <DocumentCopyJobs document={document} documentCopy={data} />;
};

export default DocumentCopyJobsContainer;
