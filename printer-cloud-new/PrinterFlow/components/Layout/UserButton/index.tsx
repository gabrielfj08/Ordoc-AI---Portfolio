import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSnackbar } from '../../../../hooks';
import { UserService } from '../../../../services';
import { FlowUserButtonContainerProps } from './types';
import SkeletonFlowUserButton from './Skeleton';
import FlowUserButton from './UserButton';
import ErrorFlowUserButton from './Error';

const FlowUserButtonContainer = ({ onClick }: FlowUserButtonContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['me', token],
    queryFn: () => UserService.me(token, subdomain),
    retry: 0,
  });

  if (isLoading) return <SkeletonFlowUserButton />;

  if (isError) {
    if ((error as any).response.status === 401) {
      router.push('/login');
      showSnackbar('Sua sessão expirou. Faça Login novamente', 'warning');
    }

    return <ErrorFlowUserButton />;
  }
  return <FlowUserButton user={data} onClick={onClick} />;
};

export default FlowUserButtonContainer;
