import * as React from 'react';
import {
  useActionSheet,
  useDrawer,
  useModal,
  useSession,
} from '../../../../../../hooks';
import { menuOptions } from '../../../../MenuButton/types';
import MenuCell from './Menu';
import { MenuCellContainerProps } from './types';
import EditDirectoryModal from '../../../../../MyAir/Directories/Modals/Edit';
import DirectoryProperties from '../../../../../MyAir/Directories/Properties';
import DownloadJob from '../../../../../MyAir/Downloads/ActionSheets';
import MoveItemsModal from '../../../../Move/Modal';
import ShareDirectoryModal from '../../../../../MyAir/Directories/Modals/Share';
import RemoveItemsModal from '../../../../Remove/Modal';

const DirectoryMenuCellContainer = ({ directory }: MenuCellContainerProps) => {
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const { openActionSheet } = useActionSheet();
  const { session } = useSession();

  const options: menuOptions[] = [
    {
      icon: 'moveDocTo',
      fill: true,
      onClick: () => {
        openModal(
          <MoveItemsModal
            organization={session.organization}
            selectedDirectoryIds={[directory.id]}
            selectedDocumentIds={[]}
          />
        );
      },
      label: 'Mover para',
      stroke: true,
    },
    {
      icon: 'shared',
      fill: true,
      onClick: () => openModal(<ShareDirectoryModal directory={directory} />),
      label: 'Compartilhar',
      stroke: false,
    },
    {
      icon: 'write',
      fill: true,
      onClick: () =>
        openModal(
          <EditDirectoryModal
            organizationId={directory.organizationId}
            directoryId={directory.id}
            name={directory.name}
            description={directory.description}
          />
        ),
      label: 'Editar',
      stroke: true,
    },
    {
      icon: 'downloadV2',
      fill: true,
      onClick: () => {
        openActionSheet(
          <DownloadJob
            selectedDirectoryIds={[directory.id]}
            selectedDocumentIds={[]}
          />
        );
      },
      label: 'Download',
      stroke: false,
    },
    {
      icon: 'info',
      fill: false,
      onClick: () =>
        openDrawer(
          <DirectoryProperties
            directoryId={directory.id}
            organizationId={directory.organizationId}
          />,
          'right'
        ),
      label: 'Propriedades',
      stroke: true,
    },
    {
      icon: 'trashV2',
      fill: true,
      onClick: () => {
        openModal(
          <RemoveItemsModal
            selectedDirectoryIds={[directory.id]}
            selectedDocumentIds={[]}
          />
        );
      },
      label: 'Remover',
      stroke: true,
    },
  ];

  return <MenuCell options={options} />;
};
export default DirectoryMenuCellContainer;
