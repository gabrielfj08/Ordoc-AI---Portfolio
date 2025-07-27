import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { ProcedureTemplateService } from '../../../../../services/printer-flow';
import { SubjectsListContainerFieldProps } from './types';
import SubjectsListFieldSkeleton from './Skeleton';
import SubjectsListFieldEmpty from './Empty';
import SubjectsListFieldError from './Error';
import SubjectsList from './ListField';

const SubjectsListFieldContainer = ({
  params,
  procedureTemplate,
  setTotalObjects,
}: SubjectsListContainerFieldProps) => {
  const { subdomain, token } = useAuth();

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token, { params }],
    queryFn: () => ProcedureTemplateService.index(token, subdomain, params),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isError) return <SubjectsListFieldError />;

  if (isLoading || isFetching) return <SubjectsListFieldSkeleton />;

  if (!data.meta.total) return <SubjectsListFieldEmpty />;

  return (
    <SubjectsList
      subjects={data.procedureTemplates}
      procedureTemplate={procedureTemplate}
    />
  );
};

export default SubjectsListFieldContainer;
