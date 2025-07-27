import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { PolicyService } from '../../../../services';
import { ShowPolicyContainerProps } from './types';
import PolicyViewSkeleton from './Skeleton';
import ErrorPage from './Error';
import Show from './Show';
import UnauthorizedShowPolicy from './Unauthorized';

const ShowPolicyContainer = ({ policyId }: ShowPolicyContainerProps) => {
  const { token, subdomain } = useAuth();
  const [showPolicyError, setShowPolicyError] = React.useState<number>();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['policies', policyId, token],
    queryFn: () => PolicyService.show(token, subdomain, policyId),
    onError: (error: any) => {
      setShowPolicyError(error.response.status);
    },
  });

  if (isLoading) {
    return <PolicyViewSkeleton />;
  }

  if (isError) {
    if (showPolicyError === 401) {
      return <UnauthorizedShowPolicy />;
    }
    return <ErrorPage />;
  }

  return <Show policy={data} />;
};

export default ShowPolicyContainer;
