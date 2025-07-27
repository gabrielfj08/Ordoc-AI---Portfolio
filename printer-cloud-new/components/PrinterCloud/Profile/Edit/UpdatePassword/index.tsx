import * as React from 'react';
import UpdatePassword from './UpdatePassword';
import { useAuth } from '../../../../../hooks';
import { UserService } from '../../../../../services';
import { useQuery } from '@tanstack/react-query';
import UpdatePasswordSkeleton from './Skeleton';
import UpdatePasswordError from './Error';

const UpdatePasswordContainer = () => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['me', token, subdomain],
    queryFn: () => UserService.me(token, subdomain),
  });

  if (isError) {
    return <UpdatePasswordError />;
  }

  if (isLoading) {
    return <UpdatePasswordSkeleton />;
  }

  const handleSubmit = (values: any) => {
    return UserService.updatePassword(
      token,
      subdomain,
      Number(data.id),
      values
    );
  };

  return <UpdatePassword onSubmit={handleSubmit} />;
};

export default UpdatePasswordContainer;
