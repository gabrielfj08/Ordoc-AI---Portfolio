import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../../services/printer-flow';
import { ProcedureTemplateDocumentModalContentContainerProps } from './types';
import ProcedureTemplateDocumentModalContentSkeleton from './Skeleton';
import ProcedureTemplateDocumentModalContentError from './Error';
import ProcedureTemplateDocumentModalContent from './Content';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const ProcedureTemplateDocumentModalContentContainer = ({
  procedureTemplateDocumentId,
}: ProcedureTemplateDocumentModalContentContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'procedureTemplateDocument',
      { procedureTemplateDocumentId, subdomain, token },
    ],
    queryFn: () =>
      ProcedureTemplateDocumentService.show(
        token,
        subdomain,
        Number(router.query.procedureTemplateId),
        procedureTemplateDocumentId
      ),
  });

  if (isError) return <ProcedureTemplateDocumentModalContentError />;

  if (isLoading) return <ProcedureTemplateDocumentModalContentSkeleton />;

  return (
    <ProcedureTemplateDocumentModalContent
      src={`${apiUrl}/${data.documentUrl}`}
    />
  );
};

export default ProcedureTemplateDocumentModalContentContainer;
