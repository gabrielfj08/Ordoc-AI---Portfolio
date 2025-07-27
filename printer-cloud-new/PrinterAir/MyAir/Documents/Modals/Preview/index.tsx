import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DocumentService } from '../../../../../services/printer-air';
import { DocumentPreviewModalContainerProps } from './types';
import DocumentModalPreviewContentError from './Error';
import DocumentPreviewModalContentSkeleton from './Skeleton';
import DocumentPreviewModal from './Preview';

const DocumentPreviewModalContainer = ({
  documentId,
}: DocumentPreviewModalContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documents', { documentId, subdomain, token }],
    queryFn: () => DocumentService.show(token, subdomain, documentId),
  });

  if (isError) return <DocumentModalPreviewContentError />;

  if (isLoading) return <DocumentPreviewModalContentSkeleton />;

  return <DocumentPreviewModal document={data} />;
};

export default DocumentPreviewModalContainer;
