import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { DocumentService } from '../../../../services/printer-air';
import { getSubdomain } from '../../../../utils';
import { DocumentPropertiesContainerProps } from './types';
import DocumentPropertiesError from './Error';
import DocumentPropertiesSkeleton from './Skeleton';
import DocumentProperties from './Properties';

const DocumentPropertiesContainer = ({
  documentId,
}: DocumentPropertiesContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documentProperties', documentId, { token }],
    queryFn: () => DocumentService.show(token, getSubdomain(), documentId),
  });

  if (isError) {
    return <DocumentPropertiesError />;
  }

  if (isLoading) {
    return <DocumentPropertiesSkeleton />;
  }

  return <DocumentProperties document={data} />;
};

export default DocumentPropertiesContainer;
