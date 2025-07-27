import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSnackbar } from '../../hooks';
import { UserService } from '../../services';
import { UserButtonContainerProps } from './types';
import UserButtonSkeleton from './Skeleton';
import UserButton from './UserButton';

const UserButtonContainer = ({
  onClick,
  currentOrganizationId,
}: UserButtonContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['me', token],
    queryFn: () => UserService.me(token, subdomain),
    retry: 0,
  });

  if (isLoading) return <UserButtonSkeleton />;

  if (isError) {
    if ((error as any).response.status === 401) {
      router.push('/login');
      showSnackbar('Sua sessão expirou. Faça Login novamente', 'warning');
    }

    return <UserButtonSkeleton />;
  }

  return (
    <UserButton
      user={data}
      onClick={onClick}
      currentOrganizationId={currentOrganizationId}
    />
  );
};

export default UserButtonContainer;
