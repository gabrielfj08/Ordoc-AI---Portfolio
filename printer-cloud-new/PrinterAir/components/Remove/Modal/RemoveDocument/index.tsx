import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DocumentService } from '../../../../../services/printer-air';
import { getSubdomain } from '../../../../../utils';
import { RemoveDocumentContainerProps } from './types';
import RemoveDocumentError from './Error';
import RemoveDocumentSkeleton from './Skeleton';
import RemoveDocument from './RemoveDocument';

const RemoveDocumentContainer = ({
  documentId,
}: RemoveDocumentContainerProps) => {
  const { token } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['RemoveDocument', documentId, token],
    queryFn: () => DocumentService.show(token, getSubdomain(), documentId),
  });

  if (isError) return <RemoveDocumentError />;

  if (isLoading) return <RemoveDocumentSkeleton />;

  return <RemoveDocument documentOriginalFilename={data.originalFilename} />;
};

export default RemoveDocumentContainer;
