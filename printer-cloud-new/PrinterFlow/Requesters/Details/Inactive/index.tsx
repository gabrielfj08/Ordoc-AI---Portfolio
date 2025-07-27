import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { InactiveRequesterDetailsContainerProps } from './types';
import { JustificationNotesService } from '../../../../services/printer-flow/JustificationNotes';
import InactiveRequesterDetailsError from './Error';
import InactiveRequesterDetailsSkeleton from './Skeleton';
import InactiveRequesterDetailsEmpty from './Empty';
import InactiveRequesterDetails from './Inactive';

const InactiveRequesterDetailsContainer = ({
  justifiableId,
}: InactiveRequesterDetailsContainerProps) => {
  const { token, subdomain } = useAuth();
  const { isError, isLoading, data } = useQuery({
    queryKey: ['inactiveRequesterDetails', subdomain, token, { justifiableId }],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        justifiableId,
        justifiableType: 'requester',
      }),
  });
  if (isError) {
    return <InactiveRequesterDetailsError />;
  }
  if (isLoading) {
    return <InactiveRequesterDetailsSkeleton />;
  }

  if (!data.meta.total) return <InactiveRequesterDetailsEmpty />;

  return (
    <InactiveRequesterDetails justificationNote={data.justificationNotes[0]} />
  );
};

export default InactiveRequesterDetailsContainer;
