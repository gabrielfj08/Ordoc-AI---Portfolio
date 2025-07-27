import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { ProcedureTemplateDetailsContainerProps } from './types';
import ProcedureTemplateDetails from './Details';
import ProcedureTemplateDetailsError from './Error';
import ProcedureTemplateDetailsSkeleton from './Skeleton';
import { ProcedureTemplateService } from '../../../services/printer-flow/ProcedureTemplate';

const ProcedureTemplateDetailsContainer = ({
  procedureTemplateId,
}: ProcedureTemplateDetailsContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['procedureTemplates', procedureTemplateId, { token }],
    queryFn: () =>
      ProcedureTemplateService.show(token, subdomain, procedureTemplateId),
  });

  if (isError) {
    return <ProcedureTemplateDetailsError />;
  }
  if (isLoading) {
    return <ProcedureTemplateDetailsSkeleton />;
  }
  return <ProcedureTemplateDetails procedureTemplate={data} />;
};

export default ProcedureTemplateDetailsContainer;
