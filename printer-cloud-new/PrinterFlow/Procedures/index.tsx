import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth, useSession, useSessionGroupRequester } from '../../hooks';
import { ProcedureService } from '../../services/printer-flow';
import Procedures from './Procedures';

const ProceduresContainer = () => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();
  const { session } = useSession();
  const { sessionGroupRequester } = useSessionGroupRequester();

  React.useEffect(() => {
    queryClient.invalidateQueries([
      'proceduresCount',
      token,
      subdomain,
      {
        createdById: session?.user?.id,
        responsibleGroupId: sessionGroupRequester.id,
      },
    ]);
  }, [sessionGroupRequester.id]);

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'proceduresCount',
      token,
      subdomain,
      {
        createdById: session?.user?.id,
        responsibleGroupId: sessionGroupRequester.id,
      },
    ],
    queryFn: () =>
      ProcedureService.countByStatus(token, subdomain, {
        createdById: session?.user?.id,
        responsibleGroupId: sessionGroupRequester.id,
      }),
    enabled: !!sessionGroupRequester.id,
  });

  if (isError || !session.user) return null;

  if (isLoading) return null;

  return <Procedures procedures={data} userId={session.user.id} />;
};

export default ProceduresContainer;
