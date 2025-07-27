import * as React from 'react';
import router from 'next/router';
import { useAuth, useSnackbar, useActionSheet } from '../../../../hooks';
import {
  DocumentService,
  DirectoryService,
} from '../../../../services/printer-air';
import { MoveJobsActionSheetContainerProps } from './types';
import MoveJobsActionSheet from './ActionSheet';

const MoveJobsActionSheetContainer = ({
  batchAction,
  directoryIds,
  documentIds,
  organizationId,
  payload,
}: MoveJobsActionSheetContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();

  const [moveDocumentJobId, setMoveDocumentJobId] = React.useState<
    number | null
  >(null);
  const [moveDirectoryJobId, setMoveDirectoryJobId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (directoryIds.length) {
      DirectoryService.move(token, subdomain, organizationId, {
        ids: directoryIds,
        batchAction,
        payload,
      })
        .then((res) => {
          setMoveDirectoryJobId(res.id);
          router.push(
            `/printer-air/my-air/organizations/${router.query.organizationId}/directories/${res.payload.directoryId}`
          );
        })
        .catch((err) => {
          closeActionSheet();
          showSnackbar(err.response.data.message, 'error');
        });
    }

    if (documentIds.length) {
      DocumentService.move(token, subdomain, organizationId, {
        ids: documentIds,
        batchAction,
        payload,
      })
        .then((res) => {
          setMoveDocumentJobId(res.id);
          router.push(
            `/printer-air/my-air/organizations/${router.query.organizationId}/directories/${res.payload.directoryId}`
          );
        })
        .catch((err) => {
          closeActionSheet();
          showSnackbar(err.response.data.message, 'error');
        });
    }
  }, [directoryIds, documentIds]);

  return (
    <MoveJobsActionSheet
      moveDocumentJobId={moveDocumentJobId}
      moveDirectoryJobId={moveDirectoryJobId}
    />
  );
};

export default MoveJobsActionSheetContainer;
