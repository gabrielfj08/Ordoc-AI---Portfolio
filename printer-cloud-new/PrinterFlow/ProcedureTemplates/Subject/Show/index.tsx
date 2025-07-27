import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { ProcedureTemplateService } from '../../../../services/printer-flow';
import { ShowSubjectContainerProps } from './types';
import ShowSubjectSkeleton from './Skeleton';
import ShowSubjectError from './Error';
import ShowSubject from './Show';

const ShowSubjectContainer = ({
  setSubject,
  procedureTemplateDocument,
  subjectId,
}: ShowSubjectContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token],
    queryFn: () => ProcedureTemplateService.show(token, subdomain, subjectId),
    onSuccess: (data) => {
      setSubject(data);
    },
  });

  if (isError) return <ShowSubjectError />;

  if (isLoading) return <ShowSubjectSkeleton />;

  return (
    <ShowSubject
      procedureTemplate={data}
      procedureTemplateDocument={procedureTemplateDocument}
    />
  );
};

export default ShowSubjectContainer;
