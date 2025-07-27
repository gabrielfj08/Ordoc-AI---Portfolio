import * as React from 'react';
import { MenuCellContainerProps } from './types';
import MenuCell from './Menu';
import { menuOptions } from '../../../../../components/MenuButton/types';
import { useDrawer, useModal } from '../../../../../../hooks';
import DirectoryProperties from '../../../Properties';
import RestoreItemsModal from '../../../../Modals/Restore';

const MenuCellContainer = ({ directory }: MenuCellContainerProps) => {
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();

  const options: Array<menuOptions> = [
    {
      label: 'Recuperar',
      icon: 'recover',
      fill: true,
      stroke: false,
      onClick: () => {
        openModal(
          <RestoreItemsModal
            selectedDirectories={[{ id: directory.id, name: directory.name }]}
            selectedDocuments={[]}
          />
        );
      },
    },
    {
      label: 'Propriedades',
      icon: 'info',
      fill: false,
      stroke: true,
      onClick: () =>
        openDrawer(
          <DirectoryProperties
            directoryId={directory.id}
            organizationId={directory.organizationId}
          />,
          'right'
        ),
    },
  ];

  return <MenuCell options={options} />;
};

export default MenuCellContainer;
