import * as React from 'react';
import { useActionSheet, useModal } from '../../../../hooks';
import {
  RestoreItemsFormValues,
  RestoreItemsModalContainerProps,
} from './types';
import RestoreItemsModal from './Restore';
import RestoreJobsActionSheet from '../../ActionSheet';

const RestoreItemsModalContainer = ({
  selectedDirectories,
  selectedDocuments,
}: RestoreItemsModalContainerProps) => {
  const { openActionSheet } = useActionSheet();
  const { closeModal } = useModal();

  const handleSubmit = ({
    directoryIds,
    documentIds,
  }: RestoreItemsFormValues) => {
    openActionSheet(
      <RestoreJobsActionSheet
        directoryIds={directoryIds}
        documentIds={documentIds}
      />
    );
    closeModal();
  };

  return (
    <RestoreItemsModal
      selectedDirectories={selectedDirectories}
      selectedDocuments={selectedDocuments}
      onSubmit={handleSubmit}
    />
  );
};

export default RestoreItemsModalContainer;
