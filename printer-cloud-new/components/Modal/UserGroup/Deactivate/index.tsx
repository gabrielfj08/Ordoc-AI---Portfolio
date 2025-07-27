import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { queryClient } from '../../../../queryClient';
import { UserGroupService } from '../../../../services';
import { IndexUserGroup } from '../../../../services/types';
import Deactivate from './Deactivate';
import { DeactivateGroupContainerProps } from './types';

const DeactivateGroupContainer = ({
  userGroup,
}: DeactivateGroupContainerProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const deactivateUserGroupMutation = useMutation((userGroup: IndexUserGroup) =>
    UserGroupService.deactivate(token, subdomain, userGroup.id)
  );

  const handleSubmit = () => {
    deactivateUserGroupMutation
      .mutateAsync(userGroup)
      .then(() => {
        closeModal();
        queryClient.invalidateQueries(['userGroups', {}]);
        showSnackbar('Grupo desativado com sucesso', 'success');
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return <Deactivate onSubmit={handleSubmit} userGroup={userGroup} />;
};

export default DeactivateGroupContainer;
