import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import { ShowUserModalContainerProps } from './types';
import ShowUserModal from './Show';
import ShowUserModalError from './Error';
import ShowUserModalSkeleton from './Skeleton';

const ShowUserModalContainer = ({ userId }: ShowUserModalContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['showUser', userId],
    queryFn: () => UserService.show(token, subdomain, userId),
  });

  if (isError) {
    return <ShowUserModalError />;
  }

  if (isLoading) {
    return <ShowUserModalSkeleton />;
  }

  return <ShowUserModal user={data} />;
};

export default ShowUserModalContainer;
