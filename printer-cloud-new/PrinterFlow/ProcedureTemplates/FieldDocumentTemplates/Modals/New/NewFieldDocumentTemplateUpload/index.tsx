import * as React from 'react';
import router from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { FieldDocumentTemplateService } from '../../../../../../services/printer-flow';
import { AttachmentUploadStatus } from '../../../../../constants/AttachmentUploadStatus';
import { NewFieldDocumentTemplateUploadContainerProps } from './types';
import NewFieldDocumentTemplateUploadError from './Error';
import NewFieldDocumentTemplateUploadSkeleton from './Skeleton';
import NewFieldDocumentTemplateUpload from './NewFieldDocumentTemplateUpload';

const NewFieldDocumentTemplateUploadContainer = ({
  uploadFieldDocumentTemplateId,
}: NewFieldDocumentTemplateUploadContainerProps) => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'fieldDocumentTemplate',
      uploadFieldDocumentTemplateId,
      subdomain,
      token,
      {},
    ],
    queryFn: () =>
      FieldDocumentTemplateService.show(
        token,
        subdomain,
        uploadFieldDocumentTemplateId
      ),
    refetchInterval: (data) =>
      data?.status === AttachmentUploadStatus.finished ||
      data?.status === AttachmentUploadStatus.failed
        ? false
        : 500,
  });

  if (isError) {
    return <NewFieldDocumentTemplateUploadError />;
  }

  if (isLoading) {
    return <NewFieldDocumentTemplateUploadSkeleton />;
  }

  if (
    data.status === AttachmentUploadStatus.finished ||
    data.status === AttachmentUploadStatus.failed
  ) {
    queryClient.invalidateQueries([
      'fields',
      subdomain,
      token,
      Number(router.query.procedureTemplateId),
      {},
    ]);
  }

  return <NewFieldDocumentTemplateUpload fieldDocumentTemplate={data} />;
};

export default NewFieldDocumentTemplateUploadContainer;
