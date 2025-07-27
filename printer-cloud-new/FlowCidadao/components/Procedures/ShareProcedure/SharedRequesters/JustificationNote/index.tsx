import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../../../hooks';
import { ExternalJustificationNoteService } from '../../../../../../services/flow-cidadao';
import { RefuseJustificationNoteContainerProps } from './types';
import RefuseJustificationNote from './JustificationNote';
import JustificationNoteSkeleton from './Skeleton';
import JustificationNoteError from './Error';

const RefuseJustificationNoteContainer = ({
  sharedProcedure,
}: RefuseJustificationNoteContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'sharedProcedureJustificationNote',
      externalToken,
      subdomain,
      sharedProcedure.id,
    ],
    queryFn: () =>
      ExternalJustificationNoteService.index(
        externalToken as string,
        subdomain,
        {
          justifiableId: sharedProcedure.id,
          justifiableType: 'shared_procedure',
        }
      ),
  });

  if (isError) return <JustificationNoteError />;

  if (isLoading) return <JustificationNoteSkeleton />;

  return (
    <RefuseJustificationNote justificationNotes={data.justificationNotes} />
  );
};

export default RefuseJustificationNoteContainer;
