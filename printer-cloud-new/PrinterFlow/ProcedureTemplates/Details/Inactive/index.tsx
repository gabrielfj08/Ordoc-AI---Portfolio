import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { InactiveProcedureTemplateDetailsContainerProps } from './types';
import InactiveProcedureTemplateDetailsSkeleton from './Skeleton';
import InactiveProcedureTemplateDetails from './Inactive';
import InactiveProcedureTemplateDetailsError from './Error';
import { JustificationNotesService } from '../../../../services/printer-flow';

const InactiveProcedureTemplateDetailsContainer = ({
  justifiableId,
}: InactiveProcedureTemplateDetailsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['justificationNotes', subdomain, token],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        order: 'created_at',
        direction: 'asc',
        justifiableId,
        justifiableType: 'procedure_template',
      }),
  });

  if (isError) {
    return <InactiveProcedureTemplateDetailsError />;
  }

  if (isLoading) {
    return <InactiveProcedureTemplateDetailsSkeleton />;
  }

  return (
    <InactiveProcedureTemplateDetails
      justificationNotes={data.justificationNotes}
    />
  );
};

export default InactiveProcedureTemplateDetailsContainer;
