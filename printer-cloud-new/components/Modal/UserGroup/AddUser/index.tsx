import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { AddUserModalContainerProps } from './types';
import AddUser from './AddUser';

const AddUserContainer = ({ userGroup }: AddUserModalContainerProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (values: any) => {
      return UserGroupService.addUser(
        token,
        subdomain,
        userGroup.id,
        values.id
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'userGroups',
          userGroup.id,
          'users',
          token,
        ]);
        queryClient.invalidateQueries(['userGroups', userGroup.id]);
      },
    }
  );

  const handleSubmit = (values: any) => {
    return mutation
      .mutateAsync(values)
      .then(() => {
        closeModal();
        showSnackbar(`Usuário adicionado com sucesso.`, 'success');
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return <AddUser onSubmit={handleSubmit} />;
};

export default AddUserContainer;
