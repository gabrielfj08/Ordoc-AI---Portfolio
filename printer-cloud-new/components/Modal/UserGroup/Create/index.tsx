import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import {
  CreateUserGroupModalContainerProps,
  CreateUserGroupModalFormValues,
} from './types';
import CreateUserGroupModal from './Create';

const CreateUserGroupModalContainer =
  ({}: CreateUserGroupModalContainerProps) => {
    const { subdomain, token } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation(
      (values: CreateUserGroupModalFormValues) => {
        return UserGroupService.create(token, subdomain, values);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['userGroups', {}]);
        },
      }
    );

    const handleSubmit = (values: CreateUserGroupModalFormValues) => {
      return mutation.mutateAsync(values);
    };

    return <CreateUserGroupModal onSubmit={handleSubmit} />;
  };

export default CreateUserGroupModalContainer;
