import * as React from 'react';
import { MenuCellContainerProps } from './types';
import MenuCell from './Menu';
import { menuOptions } from '../../../../../components/MenuButton/types';
import { useDrawer, useModal } from '../../../../../../hooks';
import DocumentProperties from '../../../Properties';
import RestoreItemsModal from '../../../../Modals/Restore';

const MenuCellContainer = ({ document }: MenuCellContainerProps) => {
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
            selectedDirectories={[]}
            selectedDocuments={[
              { id: document.id, name: document.originalFilename },
            ]}
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
          <DocumentProperties
            documentId={document.id}
            // organizationId={document.organizationId}
          />,
          'right'
        ),
    },
  ];

  return <MenuCell options={options} />;
};

export default MenuCellContainer;
