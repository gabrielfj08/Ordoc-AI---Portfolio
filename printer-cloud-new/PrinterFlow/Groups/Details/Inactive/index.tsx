import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { InactiveGroupDetailsContainerProps } from './types';
import { JustificationNotesService } from '../../../../services/printer-flow/JustificationNotes';
import InactiveGroupDetailsError from './Error';
import InactiveGroupDetailsSkeleton from './Skeleton';
import InactiveGroupDetails from './Inactive';

const InactiveGroupDetailsContainer = ({
  justifiableId,
}: InactiveGroupDetailsContainerProps) => {
  const { token, subdomain } = useAuth();
  const { isError, isLoading, data } = useQuery({
    queryKey: ['inactiveGroupDetails', subdomain, token, { justifiableId }],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        justifiableId,
        justifiableType: 'requester',
      }),
  });
  if (isError) {
    return <InactiveGroupDetailsError />;
  }
  if (isLoading) {
    return <InactiveGroupDetailsSkeleton />;
  }

  return (
    <InactiveGroupDetails justificationNote={data.justificationNotes[0]} />
  );
};

export default InactiveGroupDetailsContainer;
