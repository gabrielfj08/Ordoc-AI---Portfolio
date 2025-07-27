import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useExternalSession } from '../../hooks';
import { ExternalRequesterService } from '../../services/flow-cidadao';
import { externalRequesterProfileType } from './types';
import ExternalRequesterProfileSkeleton from './Skeleton';
import ExternalRequesterProfileError from './Error';
import ExternalRequesterProfile from './Profile';

const ExternalRequesterProfileContainer = () => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { externalSession } = useExternalSession();

  const [type, setType] = React.useState<externalRequesterProfileType>('show');

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'externalRequester',
      externalToken,
      subdomain,
      externalSession.user.id,
    ],
    queryFn: () =>
      ExternalRequesterService.showRequester(
        externalToken as string,
        subdomain,
        externalSession.user.id
      ),
  });

  if (isLoading) return <ExternalRequesterProfileSkeleton />;

  if (isError) return <ExternalRequesterProfileError />;

  return (
    <ExternalRequesterProfile
      externalRequester={data}
      type={type}
      setType={setType}
    />
  );
};

export default ExternalRequesterProfileContainer;
