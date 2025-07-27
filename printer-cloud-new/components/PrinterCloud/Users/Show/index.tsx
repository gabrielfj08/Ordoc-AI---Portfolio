import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import { ShowUserContainerProps } from './types';
import UserViewSkeleton from './ShowSkeleton';
import ErrorShowUserPage from './Error';
import ShowUser from './Show';
import UnauthorizedShowUserPage from './Unauthorized';

const ShowUserContainer = ({ userId }: ShowUserContainerProps) => {
  const { token, subdomain } = useAuth();
  const [showUserError, setShowUserError] = React.useState<number>();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['users', userId, token],
    queryFn: () => UserService.show(token, subdomain, userId),
    onError: (err: any) => {
      setShowUserError(err.response.status);
    },
  });

  if (isError) {
    if (showUserError === 401) {
      return <UnauthorizedShowUserPage />;
    }
    return <ErrorShowUserPage />;
  }

  if (isLoading) {
    return <UserViewSkeleton />;
  }

  return <ShowUser user={data} />;
};

export default ShowUserContainer;
