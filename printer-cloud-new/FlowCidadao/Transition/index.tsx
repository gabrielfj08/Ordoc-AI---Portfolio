import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useSession } from '../../hooks';
import { ExternalRequesterService } from '../../services/flow-cidadao/ExternalRequester';
import Transition from './Transition';

const TransitionContainer = () => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();
  const { themeColor } = useSession();

  const [animated, setAnimation] = React.useState<boolean>(false);

  const { isError, isLoading, data } = useQuery({
    queryKey: ['me', externalToken, subdomain],
    queryFn: () =>
      ExternalRequesterService.me(externalToken as string, subdomain),
    onSuccess: () => setAnimation(true),
  });

  if (isError) return <p>Erro</p>;

  if (isLoading) return <Transition animated={false} color={themeColor} />;

  return (
    <Transition
      animated={animated}
      externalRequester={data}
      color={themeColor}
    />
  );
};

export default TransitionContainer;
