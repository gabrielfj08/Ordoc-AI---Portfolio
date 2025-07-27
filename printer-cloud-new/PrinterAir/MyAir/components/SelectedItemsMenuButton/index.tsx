import * as React from 'react';
import { useActionSheet, useModal, useSession } from '../../../../hooks';
import { menuOptions } from '../../../components/SelectedItemsMenuButton/types';
import { MyAirSelectedItemsMenuButtonContainerProps } from './types';
import MoveItemsModal from '../../../components/Move/Modal';
import DocumentOCRJob from '../../Documents/ActionSheets/DocumentOCRJob';
import DownloadJobActionSheet from '../../Downloads/ActionSheets';
import RemoveItemsModal from '../../../components/Remove/Modal';
import SelectedItemsMenuButton from '../../../components/SelectedItemsMenuButton';

const MyAirSelectedItemsMenuButtonContainer = ({
  selectedDocumentIds,
  selectedDirectoryIds,
}: MyAirSelectedItemsMenuButtonContainerProps) => {
  const { openModal } = useModal();
  const { openActionSheet } = useActionSheet();
  const { session } = useSession();

  const options: menuOptions[] = [
    {
      label: 'Mover para',
      icon: 'moveDocTo',
      fill: true,
      stroke: true,
      onClick: () => {
        openModal(
          <MoveItemsModal
            selectedDocumentIds={selectedDocumentIds}
            selectedDirectoryIds={selectedDirectoryIds}
            organization={session.organization}
          />
        );
      },
    },
    {
      label: 'OCR',
      icon: 'ocr',
      fill: true,
      stroke: false,
      onClick: () => {
        openActionSheet(
          <DocumentOCRJob selectedDocumentIds={selectedDocumentIds} />
        );
      },
      disabled:
        selectedDirectoryIds.length || !selectedDocumentIds.length
          ? true
          : false,
    },
    {
      label: 'Download',
      icon: 'downloadV2',
      fill: true,
      stroke: false,
      onClick: () => {
        openActionSheet(
          <DownloadJobActionSheet
            selectedDirectoryIds={selectedDirectoryIds}
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
            selectedDirectoryIds={selectedDirectoryIds}
            selectedDocumentIds={selectedDocumentIds}
          />
        );
      },
    },
  ];

  return <SelectedItemsMenuButton options={options} />;
};

export default MyAirSelectedItemsMenuButtonContainer;
