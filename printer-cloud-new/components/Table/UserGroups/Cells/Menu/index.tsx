import * as React from 'react';
import { useModal } from '../../../../../hooks';
import { menuOptions } from '../../../../../components/MenuButton/types';
import { UserGroupMenuCellContainerProps } from './types';
import MenuButton from '../../../../MenuButton/MenuButton';
import DeleteUserGroupModal from '../../../../Modal/UserGroup/Delete';
import ActivateUserGroupModal from '../../../../Modal/UserGroup/Activate';
import DeactivateUserGroupModal from '../../../../Modal/UserGroup/Deactivate';

const UserGroupMenuCellContainer = ({
  userGroup,
}: UserGroupMenuCellContainerProps) => {
  const { openModal } = useModal();

  const getStatusOptions = (): menuOptions => {
    if (userGroup.status === 'active') {
      return {
        label: 'Desativar',
        icon: 'inactiveGroup',
        fill: true,
        stroke: false,
        onClick: () =>
          openModal(<DeactivateUserGroupModal userGroup={userGroup} />),
      };
    } else {
      return {
        label: 'Ativar',
        icon: 'activeGroup',
        fill: true,
        stroke: false,
        onClick: () =>
          openModal(<ActivateUserGroupModal userGroup={userGroup} />),
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
      onClick: () => openModal(<DeleteUserGroupModal userGroup={userGroup} />),
    },
  ];

  return <MenuButton options={options} />;
};

export default UserGroupMenuCellContainer;
