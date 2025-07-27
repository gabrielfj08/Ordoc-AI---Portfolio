import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../../services/printer-flow';
import { SubjectDocumentListContainerProps } from './types';
import SubjectocumentListSkeleton from './Skeleton';
import SubjectDocumentList from './AttachmentList';
import SubjectDocumentListEmpty from './Empty';
import SubjectDocumentListError from './Error';

const SubjectDocumentListContainer = ({
  params,
  procedureTemplate,
  setTotalObjects,
}: SubjectDocumentListContainerProps) => {
  const { subdomain, token } = useAuth();

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['procedureTemplateDocuments', subdomain, token, params],
    queryFn: () =>
      ProcedureTemplateDocumentService.index(
        token,
        subdomain,
        Number(router.query.id),
        { ...params, status: 'finished' }
      ),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isError) return <SubjectDocumentListError />;

  if (isLoading || isFetching) return <SubjectocumentListSkeleton />;

  if (!data.meta.total) return <SubjectDocumentListEmpty />;

  return (
    <SubjectDocumentList
      procedureTemplateDocuments={data.procedureTemplateDocuments}
      procedureTemplate={procedureTemplate}
    />
  );
};

export default SubjectDocumentListContainer;
