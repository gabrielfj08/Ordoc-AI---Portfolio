import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useSession } from '../../../hooks';
import { ExternalSignatureService } from '../../../services/flow-cidadao';
import { SignatureTableContainerProps } from './types';
import SignaturesTableSkeleton from './Skeleton';
import SignaturesTableError from './Error';
import SignaturesTableEmpty from './Empty';
import SignatureTable from './Table';

const SignatureTableContainer = ({
  params,
  setTotalObjects,
}: SignatureTableContainerProps) => {
  const { token, subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { session } = useSession();

  if (!session) return null;

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['signatures', subdomain, token, params],
    queryFn: () =>
      ExternalSignatureService.index(externalToken as string, subdomain, {
        ...params,
      }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
    enabled: !!session.organization,
  });

  if (isLoading || isFetching) {
    return <SignaturesTableSkeleton />;
  }

  if (isError) {
    return <SignaturesTableError />;
  }

  if (data.meta.total === 0) {
    return <SignaturesTableEmpty />;
  }

  return (
    <SignatureTable
      data={data.signatures}
      color={
        !!session.organization?.theme
          ? session.organization?.theme?.color
          : 'cidOrange'
      }
    />
  );
};

export default SignatureTableContainer;
