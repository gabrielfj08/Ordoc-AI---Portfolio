import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { ProcedureTemplateService } from '../../../../services/printer-flow';
import { ProcedureTemplatesTableContainerProps } from './types';
import ProcedureTemplatesTable from './Table';
import ProcedureTemplatesTableSkeleton from './Skeleton';
import ProcedureTemplatesTableError from './Error';
import ProcedureTemplatesTableEmpty from './Empty';

const ProcedureTemplatesTableContainer = ({
  params,
  setTotalObjects,
}: ProcedureTemplatesTableContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token, { params }],
    queryFn: () => ProcedureTemplateService.index(token, subdomain, params),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isLoading || isFetching) {
    return <ProcedureTemplatesTableSkeleton />;
  }

  if (isError) {
    return <ProcedureTemplatesTableError />;
  }

  if (!data.meta.total) {
    return <ProcedureTemplatesTableEmpty />;
  }

  return <ProcedureTemplatesTable data={data.procedureTemplates} />;
};

export default ProcedureTemplatesTableContainer;
