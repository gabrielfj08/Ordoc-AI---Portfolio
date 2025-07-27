import * as React from 'react';
import { queryClient } from '../../../../../queryClient';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useModal, useSnackbar } from '../../../../../hooks';
import { UserService } from '../../../../../services';
import { MenuCellContainerProps } from './types';
import { IndexUser } from '../../../../../services/types';
import { menuOptions } from '../../../../../components/MenuButton/types';
import MenuButton from '../../../../MenuButton';
import DeleteUser from '../../../../Modal/User/Delete';
import DeactivateUser from '../../../../Modal/User/DeactivateUser';

const MenuCellContainer = ({ user }: MenuCellContainerProps) => {
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { openModal } = useModal();

  const activateUserMutation = useMutation((user: IndexUser) =>
    UserService.activate(token, subdomain, user.id)
  );

  const getStatusOptions = (): menuOptions => {
    if (user.status === 'active') {
      return {
        label: 'Desativar',
        icon: 'userFalse',
        fill: true,
        stroke: false,
        onClick: () => {
          openModal(<DeactivateUser user={user} />);
        },
      };
    } else {
      return {
        label: 'Ativar',
        icon: 'userTrue',
        fill: true,
        stroke: false,
        onClick: () =>
          activateUserMutation
            .mutateAsync(user)
            .then(() => {
              queryClient.invalidateQueries(['users', {}]);
              showSnackbar('Usuário ativado com sucesso', 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            }),
      };
    }
  };
  const options: Array<menuOptions> = [
    getStatusOptions(),
    {
      label: 'Excluir',
      icon: 'trash',
      fill: false,
      stroke: true,
      onClick: () => {
        openModal(<DeleteUser userName={user.name} id={user.id} />);
      },
    },
  ];

  return <MenuButton options={options} />;
};

export default MenuCellContainer;
