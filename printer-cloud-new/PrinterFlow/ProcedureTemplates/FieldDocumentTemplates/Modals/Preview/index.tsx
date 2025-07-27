import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { FieldDocumentTemplateService } from '../../../../../services/printer-flow';
import { FieldDocumentTemplatePreviewModalContainerProps } from './types';
import FieldDocumentTemplateModalPreviewError from './Error';
import FieldDocumentTemplateModalPreviewSkeleton from './Skeleton';
import FieldDocumentTemplatePreviewModal from './Preview';

const FieldDocumentTemplatePreviewModalContainer = ({
  fieldDocumentTemplateId,
}: FieldDocumentTemplatePreviewModalContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'fieldDocumentTemplate',
      fieldDocumentTemplateId,
      subdomain,
      token,
      {},
    ],
    queryFn: () =>
      FieldDocumentTemplateService.show(
        token,
        subdomain,
        fieldDocumentTemplateId
      ),
  });

  if (isError) return <FieldDocumentTemplateModalPreviewError />;

  if (isLoading) return <FieldDocumentTemplateModalPreviewSkeleton />;

  return <FieldDocumentTemplatePreviewModal fieldDocumentTemplate={data} />;
};

export default FieldDocumentTemplatePreviewModalContainer;
