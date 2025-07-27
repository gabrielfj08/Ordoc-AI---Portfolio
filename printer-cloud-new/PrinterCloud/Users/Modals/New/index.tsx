import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import {
  CreateUserAPIResponse,
  CreateUserPayload,
} from '../../../../services/types';
import { NewUserFormValues, NewUserModalContainerProps } from './types';
import NewUserModal from './New';

const NewUserModalContainer = ({}: NewUserModalContainerProps) => {
  const { subdomain, token } = useAuth();

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: CreateUserPayload) =>
      UserService.create(token, subdomain, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  const handleSubmit = (
    values: NewUserFormValues
  ): Promise<CreateUserAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return <NewUserModal onSubmit={handleSubmit} />;
};

export default NewUserModalContainer;
