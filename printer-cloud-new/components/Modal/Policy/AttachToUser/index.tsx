import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { PolicyService } from '../../../../services';
import { AttachToUserContainerProps } from './types';
import AttachToUser from './AttachToUser';

const AttachToUserContainer = ({ policy }: AttachToUserContainerProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (values: any) => {
      return PolicyService.attachToUser(token, subdomain, policy.id, values.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['policies', policy.id, 'users', token]);
        queryClient.invalidateQueries(['policies', policy.id]);
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

  return <AttachToUser onSubmit={handleSubmit} />;
};

export default AttachToUserContainer;
