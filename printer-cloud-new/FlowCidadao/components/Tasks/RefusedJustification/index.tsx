import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalJustificationNoteService } from '../../../../services/flow-cidadao';
import { RefuseJustificationNoteContainerProps } from './types';
import RefuseExternalJustificationNote from './RefuseJustificationNote';
import RefuseJustificationNoteSkeleton from './Skeleton';
import RefuseJustificationNoteError from './Error';

const RefuseExternalJustificationNoteContainer = ({
  justifiableId,
}: RefuseJustificationNoteContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['ExternalJustificationNote', externalToken, subdomain],
    queryFn: () =>
      ExternalJustificationNoteService.index(String(externalToken), subdomain, {
        justifiableId: justifiableId,
        justifiableType: 'task',
      }),
  });

  if (isLoading) return <RefuseJustificationNoteSkeleton />;

  if (isError) return <RefuseJustificationNoteError />;

  return (
    <RefuseExternalJustificationNote
      justificationNote={data.justificationNotes[0]}
    />
  );
};

export default RefuseExternalJustificationNoteContainer;
