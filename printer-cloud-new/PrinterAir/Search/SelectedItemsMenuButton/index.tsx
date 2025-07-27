import * as React from 'react';
import { useActionSheet, useModal, useSession } from '../../../hooks';
import { menuOptions } from '../../components/SelectedItemsMenuButton/types';
import { SearchSelectedItemsMenuButtonContainerProps } from './types';
import MoveItemsModal from '../../components/Move/Modal';
import DocumentOCRJob from '../../MyAir/Documents/ActionSheets/DocumentOCRJob';
import DownloadJobActionSheet from '../../MyAir/Downloads/ActionSheets';
import RemoveItemsModal from '../../components/Remove/Modal';
import SelectedItemsMenuButton from '../../components/SelectedItemsMenuButton';

const SearchSelectedItemsMenuButtonContainer = ({
  selectedDocumentIds,
}: SearchSelectedItemsMenuButtonContainerProps) => {
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
            selectedDirectoryIds={[]}
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
      disabled: !selectedDocumentIds.length ? true : false,
    },
    {
      label: 'Download',
      icon: 'downloadV2',
      fill: true,
      stroke: false,
      onClick: () => {
        openActionSheet(
          <DownloadJobActionSheet
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

  return <SelectedItemsMenuButton options={options} />;
};

export default SearchSelectedItemsMenuButtonContainer;
