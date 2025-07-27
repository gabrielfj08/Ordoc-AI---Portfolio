import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../../queryClient';
import { useAuth } from '../../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../../services/printer-flow';
import { DocumentUploadJobStatus } from '../../../../../../PrinterAir/constants';
import { SubjectDocumentUploadContainerProps } from './types';
import SubjectDocumentUpload from './SubjectUploadDocument';
import SubjectDocumentUploadError from './Error';
import DocumentUploadSkeleton from './Skeleton';

const SubjectDocumentUploadContainer = ({
  id,
}: SubjectDocumentUploadContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureTemplateDocument', id, { token }],
    queryFn: () =>
      ProcedureTemplateDocumentService.show(
        token,
        subdomain,
        Number(router.query.id),
        id
      ),
    refetchInterval: (data) =>
      data?.status === DocumentUploadJobStatus.finished ||
      data?.status === DocumentUploadJobStatus.failed
        ? false
        : 500,
  });

  if (isError) {
    return <SubjectDocumentUploadError />;
  }

  if (isLoading) {
    return <DocumentUploadSkeleton />;
  }

  if (
    data.status === DocumentUploadJobStatus.finished ||
    data.status === DocumentUploadJobStatus.failed
  ) {
    queryClient.invalidateQueries([
      'procedureTemplateDocuments',
      subdomain,
      token,
    ]);
  }

  return <SubjectDocumentUpload documentUploadJob={data} />;
};

export default SubjectDocumentUploadContainer;
