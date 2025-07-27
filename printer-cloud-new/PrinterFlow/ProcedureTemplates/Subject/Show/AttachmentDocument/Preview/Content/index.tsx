import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../../../services/printer-flow';
import { SubjectDocumentsModalContentContainerProps } from './types';
import SubjectDocumentsModalContentContainerSkeleton from './Skeleton';
import SubjectDocumentsModalContentContainerError from './Error';
import SubjectDocumentsModalContent from './Content';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const SubjectDocumentsModalContentContainer = ({
  procedureTemplateDocumentId,
}: SubjectDocumentsModalContentContainerProps) => {
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
        Number(router.query.id),
        procedureTemplateDocumentId
      ),
  });

  if (isError) return <SubjectDocumentsModalContentContainerError />;

  if (isLoading) return <SubjectDocumentsModalContentContainerSkeleton />;

  return <SubjectDocumentsModalContent src={`${apiUrl}/${data.documentUrl}`} />;
};

export default SubjectDocumentsModalContentContainer;
