import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../services/printer-flow';
import { ProcedureTemplateDocumentListContainerProps } from './types';
import ProcedureTemplateDocumentListSkeleton from './Skeleton';
import ProcedureTemplateDocumentList from './DocumentList';
import ProcedureTemplateDocumentListEmpty from './Empty';
import ProcedureTemplateDocumentListError from './Error';

const ProcedureTemplateDocumentListContainer = ({
  params,
  procedureTemplate,
  setTotalObjects,
}: ProcedureTemplateDocumentListContainerProps) => {
  const { subdomain, token } = useAuth();

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['procedureTemplateDocuments', subdomain, token, params],
    queryFn: () =>
      ProcedureTemplateDocumentService.index(
        token,
        subdomain,
        Number(router.query.procedureTemplateId),
        { ...params, status: 'finished' }
      ),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isError) return <ProcedureTemplateDocumentListError />;

  if (isLoading || isFetching) return <ProcedureTemplateDocumentListSkeleton />;

  if (!data.meta.total) return <ProcedureTemplateDocumentListEmpty />;

  return (
    <ProcedureTemplateDocumentList
      procedureTemplate={procedureTemplate}
      procedureTemplateDocuments={data.procedureTemplateDocuments}
    />
  );
};

export default ProcedureTemplateDocumentListContainer;
