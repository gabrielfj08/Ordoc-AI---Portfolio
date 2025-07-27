import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import { UpdateUserAPIResponse } from '../../../../services/types';
import { EditProfileFormValues } from './types';
import EditPageSkeleton from './Skeleton';
import EditProfileError from './Error';
import EditProfile from './Edit';

const EditProfileContainer = () => {
  const { token, subdomain } = useAuth();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: () => UserService.me(token, subdomain),
  });

  if (isError) {
    return <EditProfileError />;
  }

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  const handleSubmit = (
    values: EditProfileFormValues
  ): Promise<UpdateUserAPIResponse> => {
    return UserService.update(token, subdomain, data.id, values);
  };

  return <EditProfile user={data} onSubmit={handleSubmit} />;
};

export default EditProfileContainer;
