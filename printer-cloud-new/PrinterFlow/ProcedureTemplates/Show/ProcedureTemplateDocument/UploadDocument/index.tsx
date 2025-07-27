import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { queryClient } from '../../../../../queryClient';
import { ProcedureTemplateDocumentService } from '../../../../../services/printer-flow';
import { DocumentUploadJobStatus } from '../../../../../PrinterAir/constants';
import { UploadDocumentContainerProps } from './types';
import UploadDocumentSkeleton from './Skeleton';
import UploadDocument from './UploadDocument';
import UploadDocumentError from './Error';

const UploadDocumentContainer = ({ id }: UploadDocumentContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureTemplateDocument', id, { token }],
    queryFn: () =>
      ProcedureTemplateDocumentService.show(
        token,
        subdomain,
        Number(router.query.procedureTemplateId),
        id
      ),
    refetchInterval: (data) =>
      data?.status === DocumentUploadJobStatus.finished ||
      data?.status === DocumentUploadJobStatus.failed
        ? false
        : 500,
  });

  if (isError) {
    return <UploadDocumentError />;
  }

  if (isLoading) {
    return <UploadDocumentSkeleton />;
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

  return <UploadDocument documentUploadJob={data} />;
};

export default UploadDocumentContainer;
