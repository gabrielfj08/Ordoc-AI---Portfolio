import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { JustificationNotesService } from '../../../../../../services/printer-flow';
import { RefuseJustificationNoteContainerProps } from './types';
import RefuseJustificationNote from './RefuseJustificationNote';
import RefuseJustificationNoteSkeleton from './Skeleton';
import RefuseJustificationNoteError from './Error';

const RefuseJustificationNoteContainer = ({
  signature,
}: RefuseJustificationNoteContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['signaturesJustificationNote', token, subdomain, signature.id],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        justifiableId: signature.id,
        justifiableType: 'signature',
      }),
  });

  if (isError) return <RefuseJustificationNoteError />;

  if (isLoading) return <RefuseJustificationNoteSkeleton />;

  return (
    <RefuseJustificationNote justificationNote={data.justificationNotes} />
  );
};

export default RefuseJustificationNoteContainer;
