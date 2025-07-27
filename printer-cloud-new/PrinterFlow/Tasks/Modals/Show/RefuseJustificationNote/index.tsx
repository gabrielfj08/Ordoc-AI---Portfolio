import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { JustificationNotesService } from '../../../../../services/printer-flow';
import { RefuseJustificationNoteContainerProps } from './types';
import RefuseJustificationNoteSkeleton from './Skeleton';
import RefuseJustificationNoteError from './Error';
import RefuseJustificationNote from './RefuseJustificationNote';

const RefuseJustificationNoteContainer = ({
  justifiableId,
}: RefuseJustificationNoteContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['JustificationNote', token, subdomain, 'task'],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        justifiableId: justifiableId,
        justifiableType: 'task',
      }),
  });

  if (isLoading) return <RefuseJustificationNoteSkeleton />;

  if (isError) return <RefuseJustificationNoteError />;

  return (
    <RefuseJustificationNote justificationNote={data.justificationNotes[0]} />
  );
};

export default RefuseJustificationNoteContainer;
