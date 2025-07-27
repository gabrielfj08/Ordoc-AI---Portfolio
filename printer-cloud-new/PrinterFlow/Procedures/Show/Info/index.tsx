import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { JustificationNotesService } from '../../../../services/printer-flow';
import { ProcedureRequester } from '../../../../services/printer-flow/types';
import { ShowProcedureInfoContainerProps } from './types';
import ShowProcedureSkeleton from '../Skeleton';
import ShowProcedureError from '../Error';
import ShowProcedureInfo from './Info';

const ShowProcedureInfoContainer = ({
  procedure,
}: ShowProcedureInfoContainerProps) => {
  const { token, subdomain } = useAuth();

  const {
    isError: justificationIsError,
    isLoading: justificationIsLoading,
    data: justificationData,
  } = useQuery({
    queryKey: ['JustificationNote', token, subdomain, 'procedures'],
    queryFn: () =>
      JustificationNotesService.index(token, subdomain, {
        justifiableId: Number(procedure.id),
        justifiableType: 'procedure',
      }),
  });

  if (justificationIsError) return <ShowProcedureError />;

  if (justificationIsLoading) return <ShowProcedureSkeleton />;

  return (
    <ShowProcedureInfo
      requester={{} as ProcedureRequester}
      procedure={procedure}
      justificationNote={
        justificationData ? justificationData.justificationNotes : []
      }
    />
  );
};

export default ShowProcedureInfoContainer;
