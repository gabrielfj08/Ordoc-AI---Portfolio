import * as React from 'react';
import { useActionSheet, useModal, useSession } from '../../../../hooks';
import { RemoveItemsModalContainerProps, RemoveItemsFormValues } from './types';
import RemoveJobsActionSheet from '../ActionSheet';
import RemoveItemsModal from './Remove';

const RemoveItemsModalContainer = ({
  selectedDirectoryIds,
  selectedDocumentIds,
}: RemoveItemsModalContainerProps) => {
  const { openActionSheet } = useActionSheet();
  const { closeModal } = useModal();

  const handleSubmit = ({
    directoryIds,
    documentIds,
  }: RemoveItemsFormValues) => {
    openActionSheet(
      <RemoveJobsActionSheet
        directoryIds={directoryIds}
        documentIds={documentIds}
      />
    );
    closeModal();
  };

  return (
    <RemoveItemsModal
      onSubmit={handleSubmit}
      selectedDirectoryIds={selectedDirectoryIds}
      selectedDocumentIds={selectedDocumentIds}
    />
  );
};

export default RemoveItemsModalContainer;
