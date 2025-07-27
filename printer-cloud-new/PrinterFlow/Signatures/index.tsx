import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../hooks';
import { SignatureService } from '../../services/printer-flow';
import SignaturesPage from './Signatures';
import SignaturesPageSkeleton from './Skeleton';
import SignaturesPageError from './Error';

const SignaturesPageContainer = () => {
  const { session } = useSession();
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['signaturesCount', token, subdomain],
    queryFn: () => SignatureService.countByStatus(token, subdomain),
    enabled: !!session.user?.internalRequester?.id,
  });

  if (isError) return <SignaturesPageError />;

  if (isLoading) return <SignaturesPageSkeleton />;

  return <SignaturesPage signatures={data} />;
};

export default SignaturesPageContainer;
