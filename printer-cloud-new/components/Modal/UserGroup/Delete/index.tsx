import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { IndexUserGroup } from '../../../../services/types';
import { DeleteUserFromGroupContainerProps } from './types';
import Delete from './Delete';

const DeleteUserFromGroupContainer = ({
  userGroup,
}: DeleteUserFromGroupContainerProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const destroyUserGroupMutation = useMutation((userGroup: IndexUserGroup) =>
    UserGroupService.deleteGroup(token, subdomain, userGroup.id)
  );

  const onSubmit = () => {
    destroyUserGroupMutation
      .mutateAsync(userGroup)
      .then(() => {
        queryClient.invalidateQueries(['userGroups', {}]);
        closeModal();
        showSnackbar('Grupo excluído com sucesso', 'success');
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return <Delete onSubmit={onSubmit} userGroup={userGroup} />;
};

export default DeleteUserFromGroupContainer;
