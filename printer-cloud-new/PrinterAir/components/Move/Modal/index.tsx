import * as React from 'react';
import { useActionSheet, useModal } from '../../../../hooks';
import {
  IndexDirectoriesParams,
  MoveItemsFormValues,
  MoveItemsModalContainerProps,
} from './types';
import MoveJobsActionSheet from '../ActionSheet';
import MoveItemsModal from './Move';

const MoveItemsModalContainer = ({
  organization,
  selectedDirectoryIds,
  selectedDocumentIds,
}: MoveItemsModalContainerProps) => {
  const { openActionSheet } = useActionSheet();
  const { closeModal } = useModal();

  if (!organization) {
    return null;
  }

  const [indexDirectoriesParams, setIndexDirectoriesParams] =
    React.useState<IndexDirectoriesParams>({
      directoryId: organization.rootDirectory.id,
      perPage: 1000,
    });

  const onSubmit = ({
    directoryIds,
    documentIds,
    batchAction,
    payload,
  }: MoveItemsFormValues) => {
    openActionSheet(
      <MoveJobsActionSheet
        batchAction={batchAction}
        directoryIds={directoryIds}
        documentIds={documentIds}
        payload={payload}
        organizationId={organization.id}
      />
    );
    closeModal();
  };

  return (
    <MoveItemsModal
      onSubmit={onSubmit}
      selectedDirectoryIds={selectedDirectoryIds}
      selectedDocumentIds={selectedDocumentIds}
      organizationId={organization.id}
      setIndexDirectoriesParams={setIndexDirectoriesParams}
      indexDirectoriesParams={indexDirectoriesParams}
    />
  );
};

export default MoveItemsModalContainer;
