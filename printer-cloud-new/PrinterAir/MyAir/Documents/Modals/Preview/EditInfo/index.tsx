import * as React from 'react';
import EditDocumentInfo from './EditInfo';
import EditDocumentInfoSkeleton from './Skeleton';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { DocumentService } from '../../../../../../services/printer-air';
import { EditDocumentInfoContainerProps } from './types';

const EditDocumentInfoContainer = ({
  documentId,
}: EditDocumentInfoContainerProps) => {
  const { subdomain, token } = useAuth();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['documents', { documentId, subdomain, token }],
    queryFn: () => DocumentService.show(token, subdomain, documentId),
  });

  if (isError) return null;

  if (isLoading) return <EditDocumentInfoSkeleton />;

  return <EditDocumentInfo document={data} />;
};

export default EditDocumentInfoContainer;
