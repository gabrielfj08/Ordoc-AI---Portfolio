import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { SignatureService } from '../../../../services/printer-flow';
import SignaturesTable from './Table';
import SignaturesTableEmpty from './Empty';
import SignaturesTableError from './Error';
import SignaturesTableSkeleton from './Skeleton';

const SignaturesTableContainer = ({ params, setTotalObjects }) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexSignatures', token, subdomain, params, setTotalObjects],
    queryFn: () => SignatureService.index(token, subdomain, { ...params }),
    onSuccess: (data) => setTotalObjects(data.meta.total),
  });

  if (isError) return <SignaturesTableError status={params.status} />;

  if (isLoading) return <SignaturesTableSkeleton />;

  if (data.meta.total === 0)
    return <SignaturesTableEmpty status={params.status} />;

  return <SignaturesTable data={data.signatures} filter={params.status} />;
};

export default SignaturesTableContainer;
