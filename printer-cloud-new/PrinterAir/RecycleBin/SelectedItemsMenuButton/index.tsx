import * as React from 'react';
import { useModal } from '../../../hooks';
import { RecycleBinSelectedItemsMenuButtonProps } from './types';
import { menuOptions } from '../../components/MenuButton/types';
import SelectedItemsMenuButton from '../../components/SelectedItemsMenuButton';
import RecoverItemsModal from '../Modals/Restore';

const RecycleBinSelectedItemsMenuButton = ({
  selectedDocuments,
  selectedDirectories,
}: RecycleBinSelectedItemsMenuButtonProps) => {
  const { openModal } = useModal();

  const buttonOptions: Array<menuOptions> = [
    {
      label: 'Recuperar',
      icon: 'recover',
      fill: true,
      stroke: false,
      onClick: () => {
        openModal(
          <RecoverItemsModal
            selectedDocuments={selectedDocuments}
            selectedDirectories={selectedDirectories}
          />
        );
      },
    },
  ];

  return <SelectedItemsMenuButton options={buttonOptions} />;
};

export default RecycleBinSelectedItemsMenuButton;
