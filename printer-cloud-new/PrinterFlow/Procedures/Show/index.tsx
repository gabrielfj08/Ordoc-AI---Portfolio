import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSessionGroupRequester } from '../../../hooks';
import { ProcedureService } from '../../../services/printer-flow';
import { ShowProcedureAPIResponse } from '../../../services/printer-flow/types';
import { ShowProcedureContainerProps } from './types';
import ShowProcedureSkeleton from './Skeleton';
import ShowProcedureError from './Error';
import ShowProcedure from './Show';
import ShowProcedureUnauthorized from './Unauthorized';

const ShowProcedureFieldsContainer = ({
  setProcedureNumber,
  justificationNote,
  subject,
}: ShowProcedureContainerProps) => {
  const { sessionGroupRequester } = useSessionGroupRequester();
  const { token, subdomain } = useAuth();
  const [errorStatus, setErrorStatus] = React.useState();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'procedure',
      token,
      subdomain,
      Number(router.query.responsibleGroupId),
      Number(router.query.procedureId),
    ],
    queryFn: () =>
      ProcedureService.show(
        token,
        subdomain,
        Number(router.query.responsibleGroupId),
        Number(router.query.procedureId)
      ),
    onSuccess: (data: ShowProcedureAPIResponse) =>
      setProcedureNumber(data.processNumber),
    enabled: Boolean(sessionGroupRequester?.id),

    onError: (error: any) => {
      setErrorStatus(error.response.status);
    },
  });

  if (isError) {
    if (errorStatus === 401) {
      return <ShowProcedureUnauthorized />;
    }
    return <ShowProcedureError />;
  }

  if (isLoading) {
    return <ShowProcedureSkeleton />;
  }

  return (
    <ShowProcedure
      procedure={data}
      justificationNote={justificationNote}
      subject={subject}
    />
  );
};

export default ShowProcedureFieldsContainer;
