import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import { getSubdomain } from '../../../../utils';
import { AvatarContainerProps } from './types';
import AvatarButtonSkeleton from './Skeleton';
import AvatarButton from './AvatarButton';

const AvatarContainer = ({ onClick }: AvatarContainerProps) => {
  const { token } = useAuth();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: () => UserService.me(token, getSubdomain()),
  });

  if (isError) {
    return <p>Erro</p>;
  }

  if (isLoading) {
    return <AvatarButtonSkeleton />;
  }

  return <AvatarButton user={data} onClick={onClick} />;
};

export default AvatarContainer;
