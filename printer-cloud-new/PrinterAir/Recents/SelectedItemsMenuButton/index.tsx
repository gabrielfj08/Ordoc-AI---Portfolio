import * as React from 'react';
import { useActionSheet, useModal } from '../../../hooks';
import { SelectedItemsMenuButtonRecentProps } from './types';
import { menuOptions } from '../../components/MenuButton/types';
import SelectedItemsMenuButton from '../../components/SelectedItemsMenuButton';
import DownloadJob from '../../MyAir/Downloads/ActionSheets';
import RemoveItemsModal from '../../components/Remove/Modal';

const SelectedItemsMenuButtonRecent = ({
  selectedDocumentIds,
}: SelectedItemsMenuButtonRecentProps) => {
  const { openActionSheet } = useActionSheet();
  const { openModal } = useModal();

  const buttonOptions: menuOptions[] = [
    {
      label: 'Download',
      icon: 'downloadV2',
      fill: true,
      stroke: false,
      onClick: () => {
        openActionSheet(
          <DownloadJob
            selectedDirectoryIds={[]}
            selectedDocumentIds={selectedDocumentIds}
          />
        );
      },
    },
    {
      label: 'Remover',
      icon: 'trashV2',
      fill: true,
      stroke: true,
      onClick: () => {
        openModal(
          <RemoveItemsModal
            selectedDirectoryIds={[]}
            selectedDocumentIds={selectedDocumentIds}
          />
        );
      },
    },
  ];

  return <SelectedItemsMenuButton options={buttonOptions} />;
};

export default SelectedItemsMenuButtonRecent;
