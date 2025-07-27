import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { JustificationNotesService } from '../../../../services/printer-flow';
import { InactiveTaskTemplateDetailsContainerProps } from './types';
import InactiveTaskTemplateDetailsSkeleton from './Skeleton';
import InactiveTaskTemplateDetails from './Inactive';
import InactiveTaskTemplateDetailsError from './Error';

const InactiveTaskTemplateDetailsContainer = ({
  justifiableId,
}: InactiveTaskTemplateDetailsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['justificationNotes', subdomain, token],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        order: 'created_at',
        direction: 'asc',
        justifiableId,
        justifiableType: 'task_template',
      }),
  });

  if (isError) {
    return <InactiveTaskTemplateDetailsError />;
  }

  if (isLoading) {
    return <InactiveTaskTemplateDetailsSkeleton />;
  }

  return (
    <InactiveTaskTemplateDetails justificationNotes={data.justificationNotes} />
  );
};

export default InactiveTaskTemplateDetailsContainer;
